export type CollectionId = 'michelin' | 'high-rating' | 'cafe-dessert' | 'breakfast'

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
  signature: string
  hours: string
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
