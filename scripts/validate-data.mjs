import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const places = JSON.parse(await readFile(resolve(root, 'public', 'places.json'), 'utf8'))
const hoiAn = JSON.parse(await readFile(resolve(root, 'data', 'hoi-an-places.json'), 'utf8'))
const screening = JSON.parse(await readFile(resolve(root, 'data', 'hoi-an-screening.json'), 'utf8'))
const discovery = JSON.parse(await readFile(resolve(root, 'data', 'hoi-an-discovery-snapshot.json'), 'utf8'))
const required = ['id', 'kind', 'name', 'address', 'collection', 'iconType', 'description', 'priceVnd', 'signature', 'mapsUrl', 'verifiedAt']
const failures = []
const MINIMUM_VERIFIED_PHOTOS = 103
const MINIMUM_ARRIVAL_PHOTOS = 90
const ARRIVAL_PHOTO_KINDS = new Set(['storefront', 'building-entrance'])
const SUPPORTED_PHOTO_KINDS = new Set([...ARRIVAL_PHOTO_KINDS, 'venue-identity', 'landmark'])
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/

if (places.length !== 103 + hoiAn.length) failures.push(`Expected baseline 103 + ${hoiAn.length} Hoi An places, found ${places.length}`)
if (places.filter((place) => place.kind === 'restaurant').length !== 97 + hoiAn.filter((place) => place.kind === 'restaurant').length) failures.push('Restaurant count differs from source datasets')
if (places.filter((place) => place.kind === 'attraction').length !== 11) failures.push('Expected 11 attractions')
if (new Set(places.map((place) => place.id)).size !== places.length) failures.push('Place IDs are not unique')

for (const place of places) {
  for (const field of required) if (!place[field]) failures.push(`${place.name}: missing ${field}`)
  if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) failures.push(`${place.name}: missing coordinates`)
  if (place.lat < 15.75 || place.lat > 16.3 || place.lng < 107.9 || place.lng > 108.5) failures.push(`${place.name}: coordinate outside Da Nang / Hoi An bounds`)
  if (!place.priceHkd && !/HK\$/i.test(place.priceVnd)) failures.push(`${place.name}: missing HKD price`)
  const hasHkdMin = Number.isFinite(place.priceHkdMin)
  const hasHkdMax = Number.isFinite(place.priceHkdMax)
  if (hasHkdMin !== hasHkdMax) failures.push(`${place.name}: incomplete HKD range`)
  if (hasHkdMin && place.priceHkdMin > place.priceHkdMax) failures.push(`${place.name}: reversed HKD range`)
  if (place.kind === 'restaurant' && !place.rating) failures.push(`${place.name}: missing Google rating`)
  if (place.kind === 'restaurant' && !place.reviewCount) failures.push(`${place.name}: missing Google review count`)
  if (place.id.startsWith('hoi-an-') && place.kind === 'restaurant') {
    const minimumReviews = place.collection === 'cafe-dessert' ? 300 : 500
    if (place.collection !== 'editor-pick' && (place.rating < 4.8 || place.reviewCount < minimumReviews)) failures.push(`${place.name}: below its screening threshold`)
    if (!place.reviewSourceUrl || !place.reviewAudit || !place.criteria) failures.push(`${place.name}: missing screening evidence`)
  }
  if (place.collection === 'editor-pick' && (place.kind !== 'restaurant' || !place.selectionReason?.trim() || !/^https:\/\//.test(place.selectionSourceUrl || ''))) failures.push(`${place.name}: editorial exception requires a reason and source`)
  if (place.kind === 'attraction' && (!place.markerImageUrl?.startsWith('data:image/') || place.photo?.kind !== 'landmark')) failures.push(`${place.name}: attraction requires an embedded landmark photo marker`)
  if (place.photo) {
    for (const field of ['url', 'alt', 'kind', 'arrivalNote', 'credit', 'sourceUrl', 'rightsNotice']) {
      if (!place.photo[field]) failures.push(`${place.name}: photo missing ${field}`)
    }
    if (!SUPPORTED_PHOTO_KINDS.has(place.photo.kind)) failures.push(`${place.name}: unsupported photo kind`)
    if (!/^https?:\/\//.test(place.photo.sourceUrl)) failures.push(`${place.name}: invalid photo source URL`)
    if (!place.enrichmentVerifiedAt) failures.push(`${place.name}: photo without enrichment verification date`)
  }
  if (place.hoursSourceUrl && !place.hours) failures.push(`${place.name}: hours source URL without hours`)
  if (place.hoursSourceUrl && !/^https?:\/\//.test(place.hoursSourceUrl)) failures.push(`${place.name}: invalid hours source URL`)
  if (place.enrichmentVerifiedAt && !/^\d{4}-\d{2}-\d{2}$/.test(place.enrichmentVerifiedAt)) failures.push(`${place.name}: invalid enrichment verification date`)
  if (place.bookingUrl && !place.bookingAdvice) failures.push(`${place.name}: booking URL without advice`)
  if (place.schedule) {
    if (place.schedule.timezone !== 'Asia/Ho_Chi_Minh') failures.push(`${place.name}: invalid schedule timezone`)
    if (!['official', 'saved', 'guide', 'listing'].includes(place.schedule.source)) failures.push(`${place.name}: invalid schedule source`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(place.schedule.verifiedAt)) failures.push(`${place.name}: invalid schedule verification date`)
    for (const intervals of Object.values(place.schedule.days || {})) {
      for (const interval of intervals) {
        if (!Array.isArray(interval) || interval.length !== 2 || !interval.every((time) => TIME_PATTERN.test(time))) failures.push(`${place.name}: invalid schedule interval`)
      }
    }
  }
}

// Every discovered candidate has a decision; every included decision resolves to a real place.
if (new Set(screening.records.map((record) => record.candidateId)).size !== screening.records.length) failures.push('Duplicate screening candidate IDs')
for (const candidate of discovery.candidates) {
  if (!screening.records.some((record) => record.candidateId === `catalog:${candidate.slug}`)) failures.push(`${candidate.name}: missing screening decision`)
}
for (const record of screening.records) {
  if (!['included', 'rejected', 'hold', 'below-threshold'].includes(record.status) || !record.reason?.trim() || !record.sourceUrl) failures.push(`${record.name}: incomplete screening decision`)
  const place = hoiAn.find((place) => place.id === record.placeId)
  if (record.status === 'below-threshold' && record.snapshotRating === null && !(Number.isFinite(record.liveRating) && record.liveRating < 4.8) && !(Number.isFinite(record.reviewCountEvidence) && record.reviewCountEvidence < 500)) failures.push(`${record.name}: missing metrics cannot count as below threshold`)
  if (record.status === 'included' && (!place || place.kind !== 'restaurant')) failures.push(`${record.name}: included candidate missing from map`)
  if (record.status !== 'included' && record.placeId) failures.push(`${record.name}: non-included candidate has a map ID`)
  if (record.status === 'included' && place && (record.liveRating !== place.rating || !record.googleMapsUrl)) failures.push(`${record.name}: screening evidence differs from map`)
}
for (const place of hoiAn.filter((place) => place.kind === 'restaurant')) {
  if (screening.records.filter((record) => record.status === 'included' && record.placeId === place.id).length !== 1) failures.push(`${place.name}: expected exactly one included screening decision`)
}

const coverage = {
  photos: places.filter((place) => place.photo).length,
  arrivalPhotos: places.filter((place) => ARRIVAL_PHOTO_KINDS.has(place.photo?.kind)).length,
  sourcedHours: places.filter((place) => place.hours && place.hoursSourceUrl).length,
  officialBooking: places.filter((place) => place.bookingUrl).length,
  officialWebsite: places.filter((place) => place.website).length,
  structuredSchedules: places.filter((place) => place.schedule).length
}
if (coverage.photos < MINIMUM_VERIFIED_PHOTOS) failures.push(`Expected at least ${MINIMUM_VERIFIED_PHOTOS} verified restaurant photos, found ${coverage.photos}`)
if (coverage.arrivalPhotos < MINIMUM_ARRIVAL_PHOTOS) failures.push(`Expected at least ${MINIMUM_ARRIVAL_PHOTOS} arrival-identification photos, found ${coverage.arrivalPhotos}`)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

const counts = Object.fromEntries(Object.entries(Object.groupBy(places, (place) => place.collection)).map(([key, value]) => [key, value.length]))
console.log(JSON.stringify({ status: 'ALL_DATA_CONTRACTS_PRESENT', total: places.length, counts, coverage }, null, 2))
