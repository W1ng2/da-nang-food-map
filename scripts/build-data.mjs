import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'

const root = resolve(import.meta.dirname, '..')
const publicDir = resolve(root, 'public')
const cachePath = resolve(root, 'data', 'geocoding-cache.json')
const metadataPath = resolve(root, 'data', 'google-place-metadata.json')

const sources = [
  { file: 'da-nang-michelin-restaurants-hkd.csv', collection: 'michelin', nameKey: '餐廳名稱' },
  { file: 'da-nang-non-michelin-google-48-map.csv', collection: 'high-rating', nameKey: '餐廳名稱' },
  { file: 'da-nang-cafe-dessert-vetted-map.csv', collection: 'cafe-dessert', nameKey: '店名' },
  { file: 'da-nang-breakfast-banh-mi-vetted-map.csv', collection: 'breakfast', nameKey: '店名' }
]

const clean = (value) => String(value ?? '').trim()
const slug = (value) => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const normalized = (value) => slug(value).replace(/\b(da-nang|restaurant|nhahang|nha-hang|quan|cuisine|food|and|bar)\b/g, '').replace(/-+/g, '-').replace(/(^-|-$)/g, '')
const firstGrapheme = (value) => Array.from(new Intl.Segmenter('zh-HK', { granularity: 'grapheme' }).segment(clean(value)))[0]?.segment || '🍴'
const typeLabel = (value) => clean(value).replace(/^\p{Extended_Pictographic}(?:\uFE0F)?\s*/u, '').replace(/^[\p{Regional_Indicator}]{2}\s*/u, '')

function nameScore(expected, actual) {
  const a = normalized(expected)
  const b = normalized(actual)
  if (!a || !b) return 0
  if (a === b) return 1
  if (a.includes(b) || b.includes(a)) return 0.85
  const aTokens = new Set(a.split('-').filter(Boolean))
  const bTokens = new Set(b.split('-').filter(Boolean))
  const overlap = [...aTokens].filter((token) => bTokens.has(token)).length
  return overlap / Math.max(aTokens.size, bTokens.size)
}

function googleCandidates(value) {
  const candidates = []
  const walk = (node) => {
    if (!Array.isArray(node)) return
    if (node.length > 80 && typeof node[11] === 'string' && Array.isArray(node[9])) {
      const lat = Number(node[9][2])
      const lng = Number(node[9][3])
      if (Number.isFinite(lat) && Number.isFinite(lng)) candidates.push({
        name: node[11], lat, lng, address: clean(node[39]), mapsUrl: clean(node[42]),
        rating: Number(node[4]?.[7]) || null,
        reviewCount: Number(node[37]?.[1]) || null
      })
    }
    node.forEach(walk)
  }
  walk(value)
  return candidates
}

async function lookupGoogleMaps(place) {
  const url = new URL('https://www.google.com/search')
  url.searchParams.set('tbm', 'map')
  url.searchParams.set('hl', 'en')
  url.searchParams.set('gl', 'vn')
  url.searchParams.set('q', `${place.name} ${place.address}`)
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) })
  if (!response.ok) return null
  const text = await response.text()
  let value
  try { value = JSON.parse(text.replace(/^\)\]\}'\n/, '')) } catch { return null }
  const ranked = googleCandidates(value)
    .map((candidate) => ({ ...candidate, score: nameScore(place.name, candidate.name) }))
    .filter((candidate) => candidate.lat >= 15.8 && candidate.lat <= 16.3 && candidate.lng >= 107.9 && candidate.lng <= 108.5)
    .sort((a, b) => b.score - a.score)
  return ranked[0]?.score >= 0.42 ? ranked[0] : null
}

async function lookupGoogleMetadata(place) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`
  const htmlResponse = await fetch(mapsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) })
  if (!htmlResponse.ok) return null
  const html = await htmlResponse.text()
  const preload = html.match(/<link href="([^"]*tbm=map[^"]+)"[^>]*rel="preload"/)
  if (!preload) return null
  const preloadUrl = `https://www.google.com${preload[1].replaceAll('&amp;', '&')}`
  const detailResponse = await fetch(preloadUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) })
  if (!detailResponse.ok) return null
  const text = await detailResponse.text()
  let value
  try { value = JSON.parse(text.replace(/^\)\]\}'\n/, '')) } catch { return null }
  const ranked = googleCandidates(value)
    .map((candidate) => {
      const coordinateGap = Math.hypot(candidate.lat - place.lat, candidate.lng - place.lng)
      return { ...candidate, score: nameScore(place.name, candidate.name) + (coordinateGap < 0.002 ? 1 : coordinateGap < 0.01 ? 0.4 : 0) }
    })
    .filter((candidate) => candidate.reviewCount && candidate.lat >= 15.8 && candidate.lat <= 16.3 && candidate.lng >= 107.9 && candidate.lng <= 108.5)
    .sort((a, b) => b.score - a.score)
  return ranked[0]?.score >= 0.8 ? ranked[0] : null
}

let cache = {}
try { cache = JSON.parse(await readFile(cachePath, 'utf8')) } catch {}
let manualGeocodes = {}
try { manualGeocodes = JSON.parse(await readFile(resolve(root, 'data', 'manual-geocodes.json'), 'utf8')) } catch {}
cache = { ...cache, ...manualGeocodes }
let googleMetadata = {}
try { googleMetadata = JSON.parse(await readFile(metadataPath, 'utf8')) } catch {}

const rows = []
for (const source of sources) {
  const text = await readFile(resolve(root, source.file), 'utf8')
  const records = parse(text, { columns: true, skip_empty_lines: true, bom: true })
  for (const row of records) {
    const name = clean(row[source.nameKey])
    const iconType = clean(row['圖標類型'])
    const combinedPrice = clean(row['人均消費（VND／HKD，約）'] || row['人均消費（VND，約）'])
    const hkdFromCombined = combinedPrice.match(/約\s*(HK\$[\d,]+(?:[–-][\d,]+)?)/i)?.[1] || ''
    rows.push({
      id: slug(`${source.collection}-${name}`),
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
      priceVnd: clean(row['人均消費（VND）'] || row['人均消費（VND，約）'] || combinedPrice),
      priceHkd: clean(row['人均消費（HKD）'] || hkdFromCombined),
      signature: clean(row['餐廳名物'] || row['招牌項目']),
      hours: clean(row['早餐／營業時間']),
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

const missingReviewCounts = rows.filter((place) => !place.reviewCount)
if (missingReviewCounts.length) {
  console.log(`Fetching Google review counts for ${missingReviewCounts.length} places.`)
  for (const [index, place] of missingReviewCounts.entries()) {
    const result = await lookupGoogleMetadata(place)
    if (result) {
      place.reviewCount = result.reviewCount
      place.reviewCountVerifiedAt = new Date().toISOString().slice(0, 10)
      googleMetadata[place.name] = {
        reviewCount: result.reviewCount,
        ratingObserved: result.rating,
        matchedName: result.name,
        matchedAddress: result.address,
        lat: result.lat,
        lng: result.lng,
        verifiedAt: place.reviewCountVerifiedAt,
        source: 'Google Maps public place result'
      }
    } else console.warn(`No review-count match: ${place.name}`)
    await writeFile(metadataPath, `${JSON.stringify(googleMetadata, null, 2)}\n`)
    console.log(`[reviews ${index + 1}/${missingReviewCounts.length}] ${place.name}${result ? ` ✓ ${result.reviewCount}` : ' — unresolved'}`)
    if (index < missingReviewCounts.length - 1) await new Promise((resolveDelay) => setTimeout(resolveDelay, 350))
  }
}

const missing = rows.filter((place) => !Number.isFinite(place.lat) || !Number.isFinite(place.lng))
if (missing.length) {
  console.log(`Geocoding ${missing.length} places (Google Maps name match, then Nominatim fallback).`)
  for (const [index, place] of missing.entries()) {
    let result = await lookupGoogleMaps(place)
    if (result) {
      place.lat = result.lat
      place.lng = result.lng
      place.geocodeSource = 'Google Maps name match'
      cache[place.name] = { lat: place.lat, lng: place.lng, source: place.geocodeSource, displayName: result.name, mapsUrl: result.mapsUrl, matchScore: result.score }
    } else {
      const url = new URL('https://nominatim.openstreetmap.org/search')
      url.searchParams.set('format', 'jsonv2')
      url.searchParams.set('limit', '1')
      url.searchParams.set('countrycodes', 'vn')
      url.searchParams.set('q', `${place.name}, ${place.address}`)
      const response = await fetch(url, { headers: { 'User-Agent': 'DaNangFoodMap/0.1 (personal travel map)' }, signal: AbortSignal.timeout(15000) })
      if (!response.ok) throw new Error(`Geocoding failed for ${place.name}: HTTP ${response.status}`)
      result = (await response.json())[0]
      if (result) {
        place.lat = Number(result.lat)
        place.lng = Number(result.lon)
        place.geocodeSource = 'Nominatim / OpenStreetMap'
        cache[place.name] = { lat: place.lat, lng: place.lng, source: place.geocodeSource, displayName: result.display_name }
      } else console.warn(`No coordinate match: ${place.name}`)
    }
    console.log(`[${index + 1}/${missing.length}] ${place.name}${result ? ' ✓' : ' — unresolved'}`)
    await mkdir(resolve(root, 'data'), { recursive: true })
    await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`)
    if (index < missing.length - 1) await new Promise((resolveDelay) => setTimeout(resolveDelay, result?.source ? 1100 : 350))
  }
}

await mkdir(resolve(root, 'data'), { recursive: true })
await mkdir(publicDir, { recursive: true })
await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`)
await writeFile(resolve(publicDir, 'places.json'), `${JSON.stringify(rows, null, 2)}\n`)
console.log(`Built public/places.json with ${rows.length} places.`)
