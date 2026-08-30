import { describe, expect, it } from 'vitest'
import {
  createRestaurantFeatureCollection,
  createUserLocationFeatureCollection,
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
  rating: 4.8,
  reviewCount: 500,
  reviewCountVerifiedAt: '2026-08-30',
  address: 'Da Nang',
  hours: '08:00-22:00',
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
      id: place.id,
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

    expect(layers).toHaveLength(2)
    expect(layers.every((layer) => layer.type === 'symbol' && layer.source === 'restaurant-places')).toBe(true)
    expect(layers.map((layer) => layer.layout?.['icon-size'])).toEqual([1, 1.26])
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
