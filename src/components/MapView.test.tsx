import { describe, expect, it, vi } from 'vitest'
import { createPlaceMarkerElement } from './MapView'
import type { Place } from '../types'

const place: Place = {
  id: 'test-place',
  name: 'Test Place',
  collection: 'michelin',
  iconType: 'vietnamese',
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

describe('place marker rendering contract', () => {
  it('keeps MapLibre positioning on an unanimated outer element', () => {
    const marker = createPlaceMarkerElement(place, true, vi.fn())
    const visual = marker.querySelector<HTMLElement>('.map-pin')

    expect(marker.classList.contains('map-marker')).toBe(true)
    expect(marker.classList.contains('is-selected')).toBe(true)
    expect(visual).not.toBeNull()
    expect(visual).not.toBe(marker)
    expect(visual?.classList.contains('is-selected')).toBe(true)
  })

  it('never animates the positioning transform', () => {
    const marker = createPlaceMarkerElement(place, false, vi.fn())

    expect(marker.style.transition).toBe('none')
    expect(marker.querySelector('.map-pin')).not.toBe(marker)
  })
})
