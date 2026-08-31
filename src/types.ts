export type CollectionId = 'michelin' | 'high-rating' | 'cafe-dessert' | 'breakfast' | 'attraction'
export type PlaceKind = 'restaurant' | 'attraction'
export type Weekday = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'

export interface OpeningSchedule {
  timezone: 'Asia/Ho_Chi_Minh'
  days?: Partial<Record<Weekday, Array<[string, string]>>>
  alwaysOpen?: boolean
  monthlyClosedDates?: number[]
  source: 'official' | 'saved'
  verifiedAt: string
  note?: string
}

export interface PlacePhoto {
  url: string
  alt: string
  kind: 'storefront' | 'building-entrance' | 'venue-identity' | 'landmark'
  arrivalNote: string
  credit: string
  sourceUrl: string
  rightsNotice: string
}

export interface Place {
  id: string
  kind: PlaceKind
  name: string
  address: string
  collection: CollectionId
  iconType: string
  icon: string
  type: string
  michelin: string
  rating: number | null
  reviewCount: number | null
  reviewCountVerifiedAt: string
  description: string
  priceVnd: string
  priceHkd: string
  priceHkdMin: number | null
  priceHkdMax: number | null
  signature: string
  hours: string
  hoursSourceUrl: string
  schedule: OpeningSchedule | null
  enrichmentVerifiedAt: string
  bookingAdvice: string
  bookingUrl: string
  phone: string
  website: string
  photo: PlacePhoto | null
  markerImageUrl: string
  mapsUrl: string
  criteria: string
  reviewAudit: string
  verifiedAt: string
  priceNote: string
  notes: string
  lat: number
  lng: number
  geocodeSource: string
}

export interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
}
