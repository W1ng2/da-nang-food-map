import { describe, expect, it } from 'vitest'
import { distanceKm, filterPlaces, normalizeSearch } from './utils'
import type { Place } from './types'

const place = (overrides: Partial<Place> = {}): Place => ({
  id: 'banh-xeo', name: 'Bánh Xèo Bà Dưỡng', address: 'Đà Nẵng', collection: 'michelin',
  iconType: '🍽️ 越南菜', icon: '🍽️', type: '越南菜', michelin: '必比登', rating: 4.3,
  reviewCount: 1000, reviewCountVerifiedAt: '2026-08-18', description: '越式煎餅', priceVnd: '₫100,000', priceHkd: '約 HK$30',
  signature: 'Bánh xèo', hours: '', mapsUrl: 'https://maps.google.com', criteria: '', reviewAudit: '',
  verifiedAt: '2026-08-18', priceNote: '', notes: '', lat: 16.0589, lng: 108.2162,
  geocodeSource: 'Nominatim / OpenStreetMap', ...overrides
})

describe('餐廳搜尋與篩選合約', () => {
  it('越南文搜尋不受重音符號影響', () => {
    expect(normalizeSearch('Bánh Xèo')).toBe(normalizeSearch('Banh Xeo'))
  })

  it('只回傳已啟用分類並可搜尋名物', () => {
    const places = [place(), place({ id: 'coffee', name: 'Roost', collection: 'cafe-dessert', signature: 'Cold Brew' })]
    expect(filterPlaces(places, 'banh xeo', new Set(['michelin']))).toEqual([places[0]])
    expect(filterPlaces(places, 'cold brew', new Set(['michelin']))).toEqual([])
  })

  it('收藏模式只顯示已收藏項目', () => {
    const places = [place(), place({ id: 'second' })]
    expect(filterPlaces(places, '', new Set(['michelin']), true, new Set(['second']))).toEqual([places[1]])
  })
})

describe('距離計算合約', () => {
  it('峴港市內短距離可正確換算為公里', () => {
    const distance = distanceKm({ lat: 16.0589, lng: 108.2162 }, { lat: 16.0689, lng: 108.2162 })
    expect(distance).toBeGreaterThan(1.1)
    expect(distance).toBeLessThan(1.12)
  })
})
