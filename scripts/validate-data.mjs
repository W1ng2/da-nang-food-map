import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const places = JSON.parse(await readFile(resolve(root, 'public', 'places.json'), 'utf8'))
const required = ['id', 'name', 'address', 'collection', 'iconType', 'description', 'priceVnd', 'signature', 'mapsUrl', 'verifiedAt']
const failures = []
const MINIMUM_VERIFIED_PHOTOS = 11
const ARRIVAL_PHOTO_KINDS = new Set(['storefront', 'building-entrance'])

if (places.length !== 97) failures.push(`Expected 97 places, found ${places.length}`)
if (new Set(places.map((place) => place.id)).size !== places.length) failures.push('Place IDs are not unique')

for (const place of places) {
  for (const field of required) if (!place[field]) failures.push(`${place.name}: missing ${field}`)
  if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) failures.push(`${place.name}: missing coordinates`)
  if (place.lat < 15.8 || place.lat > 16.3 || place.lng < 107.9 || place.lng > 108.5) failures.push(`${place.name}: coordinate outside Da Nang bounds`)
  if (!place.priceHkd && !/HK\$/i.test(place.priceVnd)) failures.push(`${place.name}: missing HKD price`)
  const hasHkdMin = Number.isFinite(place.priceHkdMin)
  const hasHkdMax = Number.isFinite(place.priceHkdMax)
  if (hasHkdMin !== hasHkdMax) failures.push(`${place.name}: incomplete HKD range`)
  if (hasHkdMin && place.priceHkdMin > place.priceHkdMax) failures.push(`${place.name}: reversed HKD range`)
  if (!place.rating) failures.push(`${place.name}: missing Google rating`)
  if (!place.reviewCount) failures.push(`${place.name}: missing Google review count`)
  if (place.photo) {
    for (const field of ['url', 'alt', 'kind', 'arrivalNote', 'credit', 'sourceUrl', 'rightsNotice']) {
      if (!place.photo[field]) failures.push(`${place.name}: photo missing ${field}`)
    }
    if (!ARRIVAL_PHOTO_KINDS.has(place.photo.kind)) failures.push(`${place.name}: photo is not an arrival-identification image`)
    if (!/^https?:\/\//.test(place.photo.sourceUrl)) failures.push(`${place.name}: invalid photo source URL`)
    if (!place.enrichmentVerifiedAt) failures.push(`${place.name}: photo without enrichment verification date`)
  }
  if (place.hoursSourceUrl && !place.hours) failures.push(`${place.name}: hours source URL without hours`)
  if (place.hoursSourceUrl && !/^https?:\/\//.test(place.hoursSourceUrl)) failures.push(`${place.name}: invalid hours source URL`)
  if (place.enrichmentVerifiedAt && !/^\d{4}-\d{2}-\d{2}$/.test(place.enrichmentVerifiedAt)) failures.push(`${place.name}: invalid enrichment verification date`)
  if (place.bookingUrl && !place.bookingAdvice) failures.push(`${place.name}: booking URL without advice`)
}

const coverage = {
  photos: places.filter((place) => place.photo).length,
  arrivalPhotos: places.filter((place) => ARRIVAL_PHOTO_KINDS.has(place.photo?.kind)).length,
  sourcedHours: places.filter((place) => place.hours && place.hoursSourceUrl).length,
  officialBooking: places.filter((place) => place.bookingUrl).length,
  officialWebsite: places.filter((place) => place.website).length
}
if (coverage.photos < MINIMUM_VERIFIED_PHOTOS) failures.push(`Expected at least ${MINIMUM_VERIFIED_PHOTOS} verified restaurant photos, found ${coverage.photos}`)
if (coverage.arrivalPhotos < MINIMUM_VERIFIED_PHOTOS) failures.push(`Expected at least ${MINIMUM_VERIFIED_PHOTOS} arrival-identification photos, found ${coverage.arrivalPhotos}`)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

const counts = Object.fromEntries(Object.entries(Object.groupBy(places, (place) => place.collection)).map(([key, value]) => [key, value.length]))
console.log(JSON.stringify({ status: 'ALL_DATA_CONTRACTS_PRESENT', total: places.length, counts, coverage }, null, 2))
