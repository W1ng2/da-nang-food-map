import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'

const root = resolve(import.meta.dirname, '..')
const publicDir = resolve(root, 'public')
const cachePath = resolve(root, 'data', 'geocoding-cache.json')
const metadataPath = resolve(root, 'data', 'google-place-metadata.json')
const enrichmentPath = resolve(root, 'data', 'place-enrichment.json')
const openingHoursPath = resolve(root, 'data', 'opening-hours.json')
const attractionsPath = resolve(root, 'data', 'attractions.json')
const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

const sources = [
  { file: 'da-nang-michelin-restaurants-hkd.csv', collection: 'michelin', nameKey: '餐廳名稱' },
  { file: 'da-nang-non-michelin-google-48-map.csv', collection: 'high-rating', nameKey: '餐廳名稱' },
  { file: 'da-nang-cafe-dessert-vetted-map.csv', collection: 'cafe-dessert', nameKey: '店名' },
  { file: 'da-nang-breakfast-banh-mi-vetted-map.csv', collection: 'breakfast', nameKey: '店名' }
]

const clean = (value) => String(value ?? '').trim()
const slug = (value) => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const firstGrapheme = (value) => Array.from(new Intl.Segmenter('zh-HK', { granularity: 'grapheme' }).segment(clean(value)))[0]?.segment || '🍴'
const typeLabel = (value) => clean(value).replace(/^\p{Extended_Pictographic}(?:\uFE0F)?\s*/u, '').replace(/^[\p{Regional_Indicator}]{2}\s*/u, '')
const vndOnly = (value) => clean(value).replace(/\s*[（(]\s*約?\s*HK\$[^）)]*[）)]\s*$/i, '').trim()

function hkdRange(value) {
  const numbers = clean(value).match(/[\d,]+/g)?.map((part) => Number(part.replace(/,/g, ''))).filter(Number.isFinite) || []
  return { min: numbers[0] ?? null, max: numbers[1] ?? numbers[0] ?? null }
}

function normalizeSchedule(value) {
  if (!value) return null
  const days = {}
  if (value.daily) weekdays.forEach((day) => { days[day] = value.daily })
  if (value.weekday) ['mon', 'tue', 'wed', 'thu', 'fri'].forEach((day) => { days[day] = value.weekday })
  if (value.weekend) ['sun', 'sat'].forEach((day) => { days[day] = value.weekend })
  Object.assign(days, value.days || {})
  // Text-only research (for example conflicting official hours) is not a closure schedule.
  if (!Object.keys(days).length && !value.alwaysOpen) return null
  return {
    timezone: 'Asia/Ho_Chi_Minh',
    ...(Object.keys(days).length ? { days } : {}),
    ...(value.alwaysOpen ? { alwaysOpen: true } : {}),
    ...(value.monthlyClosedDates?.length ? { monthlyClosedDates: value.monthlyClosedDates } : {}),
    source: value.source,
    verifiedAt: value.verifiedAt,
    ...(value.note ? { note: value.note } : {})
  }
}

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))
const cache = {
  ...await readJson(cachePath),
  ...await readJson(resolve(root, 'data', 'manual-geocodes.json'))
}
const googleMetadata = await readJson(metadataPath)
const enrichments = await readJson(enrichmentPath)
const openingHours = await readJson(openingHoursPath)

const rows = []
for (const source of sources) {
  const text = await readFile(resolve(root, source.file), 'utf8')
  const records = parse(text, { columns: true, skip_empty_lines: true, bom: true })
  for (const row of records) {
    const name = clean(row[source.nameKey])
    const iconType = clean(row['圖標類型'])
    const combinedPrice = clean(row['人均消費（VND／HKD，約）'] || row['人均消費（VND，約）'])
    const hkdFromCombined = combinedPrice.match(/約\s*(HK\$[\d,]+(?:[–-][\d,]+)?)/i)?.[1] || ''
    const priceHkd = clean(row['人均消費（HKD）'] || hkdFromCombined)
    const parsedHkd = hkdRange(priceHkd)
    const id = slug(`${source.collection}-${name}`)
    const enrichment = enrichments[id] || {}
    rows.push({
      id,
      kind: 'restaurant',
      name,
      address: clean(row['地址']),
      collection: source.collection,
      iconType,
      icon: firstGrapheme(iconType),
      type: typeLabel(iconType),
      michelin: clean(row['Michelin']),
      rating: Number(row['Google評分']) || null,
      reviewCount: Number(clean(row['Google評論數']).replace(/,/g, '')) || googleMetadata[name]?.reviewCount || null,
      reviewCountVerifiedAt: Number(clean(row['Google評論數']).replace(/,/g, ''))
        ? clean(row['核對日期'] || row['評分核對日期'])
        : googleMetadata[name]?.verifiedAt || '',
      description: clean(row['餐廳簡介'] || row['店鋪簡介']).replace(/｜人均：.*$/, ''),
      priceVnd: vndOnly(row['人均消費（VND）'] || row['人均消費（VND，約）'] || combinedPrice),
      priceHkd,
      priceHkdMin: parsedHkd.min,
      priceHkdMax: parsedHkd.max,
      signature: clean(row['餐廳名物'] || row['招牌項目']),
      hours: clean(openingHours[id]?.hours || enrichment.hours || row['早餐／營業時間']),
      hoursSourceUrl: clean(openingHours[id]?.sourceUrl || enrichment.hoursSourceUrl),
      schedule: normalizeSchedule(openingHours[id]),
      enrichmentVerifiedAt: clean(openingHours[id]?.sourceUrl ? openingHours[id].verifiedAt : enrichment.enrichmentVerifiedAt),
      bookingAdvice: clean(enrichment.bookingAdvice),
      bookingUrl: clean(enrichment.bookingUrl),
      phone: clean(enrichment.phone),
      website: clean(enrichment.website),
      photo: enrichment.photo || null,
      markerImageUrl: '',
      mapsUrl: clean(row['Google Maps']) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${row['地址']}`)}`,
      criteria: clean(row['篩選條件']),
      reviewAudit: clean(row['誘評抽查']),
      verifiedAt: clean(row['核對日期'] || row['評分核對日期']),
      priceNote: clean(row['價格備註']),
      notes: clean(row['備註']),
      lat: cache[name]?.lat ?? null,
      lng: cache[name]?.lng ?? null,
      geocodeSource: cache[name]?.source ?? null
    })
  }
}

const attractionRecords = [...await readJson(attractionsPath), ...await readJson(resolve(root, 'data/hoi-an-places.json'))]
for (const attraction of attractionRecords) {
  const { markerImageFile, ...record } = attraction
  const hours = openingHours[record.id]
  rows.push({
    ...record,
    ...(hours?.hours ? { hours: hours.hours, hoursSourceUrl: hours.sourceUrl, enrichmentVerifiedAt: hours.verifiedAt } : {}),
    ...(markerImageFile ? { markerImageUrl: `data:image/webp;base64,${(await readFile(resolve(root, markerImageFile))).toString('base64')}` } : {}),
    schedule: normalizeSchedule(hours ?? attraction.schedule)
  })
}

const missing = rows.filter((place) => !Number.isFinite(place.lat) || !Number.isFinite(place.lng))
if (missing.length) {
  throw new Error(`Missing saved coordinates: ${missing.map((place) => place.name).join(', ')}. Verify the branch and add restaurant coordinates to data/manual-geocodes.json or attraction coordinates to data/attractions.json before building.`)
}

await mkdir(publicDir, { recursive: true })
await writeFile(resolve(publicDir, 'places.json'), `${JSON.stringify(rows, null, 2)}\n`)
console.log(`Built public/places.json with ${rows.length} places.`)
