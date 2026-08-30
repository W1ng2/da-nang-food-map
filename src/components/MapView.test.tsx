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
  enrichmentVerifiedAt: '',
  bookingAdvice: '',
  bookingUrl: '',
  phone: '',
  website: '',
  photo: null,
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
        imageId: 'restaurant-pin-michelin-vietnam',
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
    expect(layers.slice(2).map((layer) => layer.type === 'symbol' ? layer.layout?.['icon-size'] : null)).toEqual([1, 1.26])
  })

  it('clusters dense restaurants before individual pins become useful', () => {
    expect(RESTAURANT_CLUSTER_OPTIONS).toEqual({
      cluster: true,
      clusterRadius: 48,
      clusterMaxZoom: 13,
      generateId: true
    })
  })

  it('resolves the precise icon into the matching collection-coloured pin asset', () => {
    expect(restaurantMarkerImageId(place)).toBe('restaurant-pin-michelin-vietnam')
    expect(restaurantMarkerAssetPath(place)).toBe('map-pins/michelin-vietnam.png')
  })

  it('keeps the user location in a WebGL GeoJSON source instead of a DOM marker', () => {
    const visible = createUserLocationFeatureCollection({ lat: 16.06, lng: 108.22 })
    const hidden = createUserLocationFeatureCollection(null)

    expect(visible.features[0].geometry.coordinates).toEqual([108.22, 16.06])
    expect(hidden.features).toEqual([])
  })
})
