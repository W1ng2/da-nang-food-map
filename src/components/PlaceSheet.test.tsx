import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PlaceSheet } from './PlaceSheet'
import type { Place } from '../types'

const place: Place = {
  id: 'official-photo-place',
  name: 'Official Photo Place',
  address: 'Da Nang',
  collection: 'michelin',
  iconType: '🇻🇳 越南菜',
  icon: '🇻🇳',
  type: '越南菜',
  michelin: 'Selected',
  rating: 4.8,
  reviewCount: 500,
  reviewCountVerifiedAt: '2026-08-30',
  description: 'Test description',
  priceVnd: '₫100,000',
  priceHkd: '約 HK$31',
  priceHkdMin: 31,
  priceHkdMax: 31,
  signature: 'Test dish',
  hours: '每日 11:00–22:00',
  hoursSourceUrl: 'https://restaurant.example/hours',
  enrichmentVerifiedAt: '2026-08-31',
  bookingAdvice: '建議預約',
  bookingUrl: 'https://restaurant.example/reserve',
  phone: '+84123456789',
  website: 'https://restaurant.example/',
  photo: {
    url: 'https://restaurant.example/entrance.jpg',
    alt: '餐廳門面及入口',
    kind: 'storefront',
    arrivalNote: '留意黑色招牌及玻璃入口。',
    credit: '餐廳官方網站',
    sourceUrl: 'https://restaurant.example/gallery',
    rightsNotice: '遠端顯示，未儲存於本 App'
  },
  mapsUrl: 'https://maps.google.com/',
  criteria: '',
  reviewAudit: '',
  verifiedAt: '2026-08-30',
  priceNote: '',
  notes: '',
  lat: 16.067,
  lng: 108.223,
  geocodeSource: 'test'
}

describe('餐廳官方資料顯示合約', () => {
  it('相片、營業時間及其核對來源可在詳情頁追溯', () => {
    const markup = renderToStaticMarkup(
      <PlaceSheet
        place={place}
        location={null}
        favorite={false}
        visited={false}
        onClose={() => {}}
        onFavorite={() => {}}
        onVisited={() => {}}
        onShare={() => {}}
      />
    )

    expect(markup).toContain('餐廳門面及入口')
    expect(markup).toContain('餐廳門面')
    expect(markup).toContain('到場辨認：</b>留意黑色招牌及玻璃入口。')
    expect(markup).toContain('相片：餐廳官方網站')
    expect(markup).toContain('每日 11:00–22:00')
    expect(markup).toContain('營業／聯絡資料：</b>2026-08-31')
    expect(markup).toContain('href="https://restaurant.example/hours"')
  })

  it('場地參考照不會被誤標為餐廳門面', () => {
    const referencePhotoPlace: Place = {
      ...place,
      photo: { ...place.photo!, kind: 'venue-identity', alt: '同一餐廳的場地參考照片' }
    }
    const markup = renderToStaticMarkup(
      <PlaceSheet
        place={referencePhotoPlace}
        location={null}
        favorite={false}
        visited={false}
        onClose={() => {}}
        onFavorite={() => {}}
        onVisited={() => {}}
        onShare={() => {}}
      />
    )

    expect(markup).toContain('餐廳參考照')
    expect(markup).not.toContain('>餐廳門面</span>')
  })
})
