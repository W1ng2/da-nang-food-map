export type CollectionId = 'michelin' | 'high-rating' | 'cafe-dessert' | 'breakfast'

export interface PlacePhoto {
  url: string
  alt: string
  credit: string
  sourceUrl: string
  rightsNotice: string
}

export interface Place {
  id: string
  name: string
  address: string
  collection: CollectionId
  iconType: string
  icon: string
  type: string
  michelin: string
  rating: number
  reviewCount: number | null
  reviewCountVerifiedAt: string
  description: string
  priceVnd: string
  priceHkd: string
  priceHkdMin: number | null
  priceHkdMax: number | null
  signature: string
  hours: string
  bookingAdvice: string
  bookingUrl: string
  phone: string
  website: string
  photo: PlacePhoto | null
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
