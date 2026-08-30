import type { CollectionId, Place, UserLocation } from './types'

export interface DecisionFilters {
  cuisine: string
  maxPriceHkd: number | null
  minRating: number | null
  nearbyKm: number | null
}

export const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('zh-HK')

export function filterPlaces(places: Place[], query: string, collections: Set<CollectionId>, favoritesOnly = false, favorites = new Set<string>()) {
  const needle = normalizeSearch(query.trim())
  return places.filter((place) => {
    if (!collections.has(place.collection)) return false
    if (favoritesOnly && !favorites.has(place.id)) return false
    if (!needle) return true
    const haystack = normalizeSearch([place.name, place.address, place.type, place.description, place.signature, place.michelin].join(' '))
    return haystack.includes(needle)
  })
}

export function distanceKm(a: UserLocation, b: Pick<Place, 'lat' | 'lng'>) {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLng = (b.lng - a.lng) * rad
  const lat1 = a.lat * rad
  const lat2 = b.lat * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export function applyDecisionFilters(
  places: Place[],
  filters: DecisionFilters,
  location: UserLocation | null
) {
  return places.filter((place) => {
    if (filters.cuisine && place.type !== filters.cuisine) return false
    if (filters.minRating && place.rating < filters.minRating) return false
    if (filters.maxPriceHkd && (!place.priceHkdMax || place.priceHkdMax > filters.maxPriceHkd)) return false
    if (filters.nearbyKm && location && distanceKm(location, place) > filters.nearbyKm) return false
    return true
  })
}

export function placePhotoUrl(place: Pick<Place, 'photo'>) {
  const url = place.photo?.url
  if (!url || /^https?:\/\//i.test(url)) return url || ''
  return `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`
}

export const formatReviews = (count: number | null) => count ? new Intl.NumberFormat('zh-HK').format(count) : '未收錄'

export function appleMapsUrl(place: Place) {
  const params = new URLSearchParams({ daddr: `${place.lat},${place.lng}`, q: place.name, dirflg: 'w' })
  return `https://maps.apple.com/?${params.toString()}`
}
