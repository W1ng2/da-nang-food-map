import { HOTEL, TRIP_DAYS, vietnamDate, type TripStop } from '../trip'
import type { Place } from '../types'

interface Props {
  places: Place[]; date: string; now: number
  onDate: (date: string) => void; onPlace: (place: Place) => void; onHotel: () => void
}
export function TripView({ places, date, now, onDate, onPlace, onHotel }: Props) {
  const day = TRIP_DAYS.find((day) => day.date === date) ?? TRIP_DAYS[0]
  const today = vietnamDate(now)
  const action = (stop: TripStop) => {
    const place = places.find((place) => place.id === stop.placeId)
    if (stop.hotel) return <button type="button" onClick={onHotel}>在地圖看酒店 ↗</button>
    if (place) return <button type="button" onClick={() => onPlace(place)}>在地圖查看 ↗</button>
    if (stop.query) return <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.query)}`} target="_blank" rel="noreferrer">Google Maps ↗</a>
    return null
  }
  return <div className="trip-view">
    <p className="eyebrow">YOUR SIX DAYS · 越南當地時間</p>
    <h2>{day.date === today ? '今日行程' : '旅程安排'}</h2>
    <div className="trip-dates" aria-label="選擇行程日期">{TRIP_DAYS.map((item, index) =>
      <button key={item.date} type="button" aria-pressed={date === item.date} onClick={() => onDate(item.date)}>
        <small>DAY {index + 1}</small><strong>9/{index + 4}</strong><span>{item.date === today ? '今天' : ['五', '六', '日', '一', '二', '三'][index]}</span>
      </button>
    )}</div>
    <h3>{day.title}</h3>
    <p className="trip-disclaimer">依你的行程整理；只有你明確確認的訂位才標記「已預訂」。並非即時預約紀錄。</p>
    <ol className="trip-timeline">{day.stops.map((stop, index) => <li key={`${day.date}-${index}`}>
      <span className="trip-time">{stop.time || '彈性安排'}</span>
      <div><h4>{stop.title}</h4>{stop.confirmed && <span className="booking-confirmed">已預訂 · 使用者確認</span>}
        {stop.note && <p>{stop.note}</p>}{action(stop)}</div>
    </li>)}</ol>
    <div className="hotel-card"><span className="eyebrow">OUR BASE · 會安北岸</span><h3>{HOTEL.name}</h3>
      <p>酒店固定顯示在地圖，不受餐廳或景點篩選影響。</p>
      <button type="button" onClick={onHotel}>在地圖看酒店</button><a href={HOTEL.mapsUrl} target="_blank" rel="noreferrer">返回酒店 ↗</a>
    </div>
  </div>
}
