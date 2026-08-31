import { describe, expect, it } from 'vitest'
import {
  createRestaurantFeatureCollection,
  createUserLocationFeatureCollection,
  RESTAURANT_CLUSTER_OPTIONS,
  restaurantLayerSpecifications,
  restaurantMarkerAssetPath,
  restaurantMarkerImageId
} from './MapView'
import type { Place } from '../types'

const place: Place = {
  id: 'test-place',
  kind: 'restaurant',
  name: 'Test Place',
  collection: 'michelin',
  iconType: '🇻🇳 越南菜',
  icon: '🇻🇳',
  type: 'Vietnamese',
  michelin: 'Selected',
  lat: 16.067,
  lng: 108.223,
  description: 'Test description',
  signature: 'Test dish',
  priceVnd: '100,000',
  priceHkd: 'HK$31',
  priceHkdMin: 31,
  priceHkdMax: 31,
  rating: 4.8,
  reviewCount: 500,
  reviewCountVerifiedAt: '2026-08-30',
  address: 'Da Nang',
  hours: '08:00-22:00',
  hoursSourceUrl: '',
  schedule: null,
  enrichmentVerifiedAt: '',
  bookingAdvice: '',
  bookingUrl: '',
  phone: '',
  website: '',
  photo: null,
  markerImageUrl: '',
  mapsUrl: 'https://maps.google.com/',
  criteria: 'Test criteria',
  reviewAudit: 'No incentive detected',
  verifiedAt: '2026-08-30',
  priceNote: 'Estimate',
  notes: '',
  geocodeSource: 'test'
}

describe('WebGL restaurant marker contract', () => {
  it('encodes every restaurant as a selected-aware GeoJSON point', () => {
    const collection = createRestaurantFeatureCollection([place], place.id)

    expect(collection.features).toHaveLength(1)
    expect(collection.features[0]).toMatchObject({
      geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
      properties: {
        placeId: place.id,
        imageId: 'restaurant-pin-cuisine-vietnam-michelin',
        michelinLabel: 'Selected',
        selected: true
      }
    })
  })

  it('uses MapLibre symbol layers so pins and the raster map share one WebGL frame', () => {
    const layers = restaurantLayerSpecifications()

    expect(layers).toHaveLength(4)
    expect(layers.every((layer) => layer.source === 'restaurant-places')).toBe(true)
    expect(layers.map((layer) => layer.id)).toEqual([
      'restaurant-clusters', 'restaurant-cluster-count', 'restaurant-pins', 'restaurant-pins-selected'
    ])
  })

  it('clusters dense restaurants before individual pins become useful', () => {
    expect(RESTAURANT_CLUSTER_OPTIONS).toEqual({
      cluster: true,
      clusterRadius: 48,
      clusterMaxZoom: 13,
      generateId: true
    })
  })

  it('resolves the precise cuisine icon into a source-neutral pin asset', () => {
    expect(restaurantMarkerImageId(place)).toBe('restaurant-pin-cuisine-vietnam-michelin')
    expect(restaurantMarkerAssetPath(place)).toBe('map-pins/cuisine-vietnam-michelin.png')
    expect(restaurantMarkerImageId({ ...place, michelin: '' })).toBe('restaurant-pin-cuisine-vietnam')
  })

  it('switches a closed restaurant to the grayscale pin while unknown hours remain coloured', () => {
    const closed = {
      ...place,
      schedule: {
        timezone: 'Asia/Ho_Chi_Minh' as const,
        days: { mon: [['08:00', '10:00'] as [string, string]] },
        source: 'official' as const,
        verifiedAt: '2026-08-31'
      }
    }
    const mondayEvening = Date.parse('2026-08-31T12:00:00Z')
    expect(restaurantMarkerImageId(closed, mondayEvening)).toBe('restaurant-pin-cuisine-vietnam-michelin-closed')
    expect(restaurantMarkerAssetPath(closed, mondayEvening)).toBe('map-pins/cuisine-vietnam-michelin-closed.png')
    expect(restaurantMarkerImageId(place, mondayEvening)).toBe('restaurant-pin-cuisine-vietnam-michelin')
  })

  it('uses a dedicated photo marker identity for attractions', () => {
    expect(restaurantMarkerImageId({ ...place, id: 'dragon-bridge', kind: 'attraction', markerImageUrl: 'https://example.com/dragon.jpg' }))
      .toBe('attraction-photo-dragon-bridge')
  })

  it('keeps the user location in a WebGL GeoJSON source instead of a DOM marker', () => {
    const visible = createUserLocationFeatureCollection({ lat: 16.06, lng: 108.22 })
    const hidden = createUserLocationFeatureCollection(null)

    expect(visible.features[0].geometry.coordinates).toEqual([108.22, 16.06])
    expect(hidden.features).toEqual([])
  })
})
