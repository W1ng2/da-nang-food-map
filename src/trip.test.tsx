import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FOOD_GROUPS, HOTEL, TRIP_DAYS, foodGroup, initialTripDate, placeRegion, vietnamDate } from './trip'
import { TripView } from './components/TripView'
import { NORTH_UP_CAMERA, createUserLocationFeatureCollection } from './components/MapView'
import { CUISINE_ORDER, MAP_ICON_FILES } from './config'
import hoiAn from '../data/hoi-an-places.json'

describe('travel map additions', () => {
  it('keeps north-up reset independent from zoom and location', () => {
    expect(NORTH_UP_CAMERA).toEqual({ bearing: 0, pitch: 0, duration: 350 })
    expect(NORTH_UP_CAMERA).not.toHaveProperty('center')
    expect(NORTH_UP_CAMERA).not.toHaveProperty('zoom')
  })
  it('keeps the hotel in its own point source and uses the official linked destination', () => {
    expect(createUserLocationFeatureCollection(HOTEL).features[0].geometry.coordinates).toEqual([108.3259055, 15.9206981])
    expect(HOTEL.source).toBe('https://wyndhamroyalhoian.com/contact/')
  })
  it('groups every cuisine without using awards or rating as a filter', () => {
    for (const type of CUISINE_ORDER) expect(FOOD_GROUPS).toContain(foodGroup(type))
    expect(foodGroup('越南咖啡')).toBe('Cafe／甜品')
    expect(foodGroup('越式早餐｜Bò né')).toBe('早餐／輕食')
    expect(foodGroup('海鮮')).toBe('海鮮')
    expect(foodGroup('越南菜')).toBe('越南料理')
    expect(foodGroup('意大利菜')).toBe('各國料理')
  })
  it('uses Vietnam date, not Hong Kong midnight, and bounds the trip outside travel dates', () => {
    const beforeVietnamMidnight = Date.parse('2026-09-06T16:30:00Z')
    expect(vietnamDate(beforeVietnamMidnight)).toBe('2026-09-06')
    expect(initialTripDate(beforeVietnamMidnight)).toBe('2026-09-06')
    expect(initialTripDate(Date.parse('2026-09-06T17:01:00Z'))).toBe('2026-09-07')
    expect(initialTripDate(Date.parse('2026-08-01'))).toBe('2026-09-04')
    expect(initialTripDate(Date.parse('2026-10-01'))).toBe('2026-09-09')
  })
  it('does not invent reservations: only the user-confirmed Pizza booking is confirmed', () => {
    const confirmed = TRIP_DAYS.flatMap((day) => day.stops.filter((stop) => stop.confirmed).map((stop) => ({ date: day.date, ...stop })))
    expect(confirmed).toHaveLength(1)
    expect(confirmed[0]).toMatchObject({ date: '2026-09-06', time: '19:30', placeId: 'high-rating-pizza-4p-s' })
    expect(TRIP_DAYS[1].stops.find((stop) => stop.placeId === 'michelin-moc-quan-seafood')?.confirmed).toBeUndefined()
  })
  it('labels only the current Vietnam date as today, without displaying a stale itinerary as today', () => {
    const props = { places: [], now: Date.parse('2026-09-07T05:00:00Z'), onDate: () => {}, onPlace: () => {}, onHotel: () => {} }
    expect(renderToStaticMarkup(<TripView {...props} date="2026-09-07" />)).toContain('<h2>今日行程</h2>')
    expect(renderToStaticMarkup(<TripView {...props} date="2026-09-06" />)).toContain('<h2>旅程安排</h2>')
  })
  it('preserves screening thresholds except for explicitly sourced editorial picks', () => {
    expect(hoiAn.filter((place) => place.kind === 'restaurant')).toHaveLength(17)
    expect(hoiAn.filter((place) => place.collection === 'editor-pick')).toHaveLength(3)
    expect(hoiAn.filter((place) => place.kind === 'attraction')).toHaveLength(5)
    expect(new Set(hoiAn.map((place) => place.id)).size).toBe(hoiAn.length)
    for (const place of hoiAn) {
      expect(placeRegion(place)).toBe('hoi-an')
      if (place.kind === 'restaurant') {
        if (place.collection === 'editor-pick') {
          expect(place.selectionReason).toContain('門檻')
          expect(place.selectionSourceUrl).toMatch(/^https:/)
          expect(place.criteria).toContain('例外')
        } else {
          expect(place.rating).toBeGreaterThanOrEqual(4.8)
          expect(place.reviewCount).toBeGreaterThanOrEqual(500)
        }
        expect(MAP_ICON_FILES[place.iconType]).toBeTruthy()
        expect(place.reviewSourceUrl).toMatch(/^https:/)
        expect(place.reviewAudit).toContain('並非全量')
        expect(place.priceHkd).toContain('HK$')
      } else {
        expect(place.photo?.kind).toBe('landmark')
        expect(place.markerImageFile).toMatch(/^data\/landmark-markers\//)
      }
    }
  })
})
