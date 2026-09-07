import type { Place } from './types'

export type Region = 'all' | 'da-nang' | 'hoi-an'
export const HOTEL = {
  name: 'Wyndham Royal Beachfront Resort & Spa',
  lat: 15.9206981, lng: 108.3259055,
  source: 'https://wyndhamroyalhoian.com/contact/',
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=15.9206981,108.3259055'
}

export function placeRegion(place: Pick<Place, 'id'>): Exclude<Region, 'all'> {
  return place.id.startsWith('hoi-an-') ? 'hoi-an' : 'da-nang'
}

export const FOOD_GROUPS = ['越南料理', '海鮮', '各國料理', '早餐／輕食', 'Cafe／甜品'] as const
export function foodGroup(type: string): typeof FOOD_GROUPS[number] {
  if (/咖啡|甜品|甜點|烘焙|雪糕/.test(type)) return 'Cafe／甜品'
  if (/早餐|法包|Poke/.test(type)) return '早餐／輕食'
  if (/海鮮/.test(type)) return '海鮮'
  if (/越南|麵食|雞飯/.test(type)) return '越南料理'
  return '各國料理'
}

export interface TripStop { title: string; time?: string; placeId?: string; query?: string; note?: string; confirmed?: boolean; hotel?: boolean }
export const TRIP_DAYS: { date: string; title: string; stops: TripStop[] }[] = [
  { date: '2026-09-04', title: '抵達 · 會安初見', stops: [
    { time: '15:20', title: '抵達峴港機場', query: 'Da Nang International Airport' },
    { title: '酒店 Check-in', hotel: true },
    { title: '會安晚餐、古城及水燈', placeId: 'hoi-an-old-town' },
    { title: '指甲 Spa／拍攝', note: '指甲 Spa 視時間安排；未有預約紀錄。' }
  ] },
  { date: '2026-09-05', title: '海上活動 · 海鮮', stops: [
    { title: '沙灘潛水／酒店、Cafe、Spa', note: '分組活動；集合地點及供應商待確認。' },
    { title: '回酒店休息', hotel: true },
    { time: '19:20', title: 'MỘC Quán Seafood', placeId: 'michelin-moc-quan-seafood', note: '行程所列時間；未收到訂位確認。' },
    { title: '逛超市後回酒店', hotel: true }
  ] },
  { date: '2026-09-06', title: '峴港 Shopping · Pizza', stops: [
    { title: '早餐／酒店休息', hotel: true },
    { time: '中午', title: 'Lê Duẩn 女裝店', query: 'Le Duan shopping street Da Nang' },
    { time: '午餐', title: 'Bếp Cuốn', placeId: 'michelin-bep-cuon' },
    { title: 'Han Market → Cafe → Spa', query: 'Han Market Da Nang', note: 'Cafe、Spa 尚未指定店舖。' },
    { time: '19:30', title: 'Pizza 4P’s', placeId: 'high-rating-pizza-4p-s', confirmed: true, note: '你已確認預訂；地圖收錄 74 Bạch Đằng，請以確認信的分店為準。' }
  ] },
  { date: '2026-09-07', title: '會安 · 海灘慢遊', stops: [
    { title: '酒店海灘／泳池', hotel: true },
    { title: 'An Bang Beach → Cafe', placeId: 'hoi-an-an-bang-beach' },
    { time: '下午', title: '會安古城 → Spa', placeId: 'hoi-an-old-town', note: 'Spa 未有預約紀錄。' },
    { title: '會安晚餐及夜遊', placeId: 'hoi-an-japanese-bridge' },
    { title: 'Hoi An Memories Show', query: 'Hoi An Memories Land', note: '未有出票紀錄；先確認當天場次，再倒推晚餐及入場時間。' }
  ] },
  { date: '2026-09-08', title: 'VinWonders · 酒店晚上', stops: [
    { title: 'VinWonders Nam Hoi An', placeId: 'hoi-an-vinwonders', note: 'Safari、水上樂園及遊樂設施；門票與各區開放時間待核對。' },
    { title: '回酒店及簡單晚餐', hotel: true },
    { time: '20:00', title: '開 Live', note: '預留回程及準備時間。' },
    { title: 'Live 後 Spa', note: '待確認營業時間及四人接待能力，未預約。' }
  ] },
  { date: '2026-09-09', title: '早餐 · 返香港', stops: [
    { title: '早餐、Check-out、附近午餐', hotel: true },
    { time: '13:15–13:30', title: '出發去峴港機場', query: 'Da Nang International Airport', note: '沿用你的行程時間；出發前再確認車程及航空公司報到要求。' },
    { time: '16:20', title: '航班起飛' }
  ] }
]

export function vietnamDate(now: number) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const part = (type: string) => parts.find((p) => p.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}
export function initialTripDate(now: number) {
  const date = vietnamDate(now)
  return TRIP_DAYS.find((day) => day.date === date)?.date ?? (date < TRIP_DAYS[0].date ? TRIP_DAYS[0].date : TRIP_DAYS[5].date)
}
