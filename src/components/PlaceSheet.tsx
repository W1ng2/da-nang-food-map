import { COLLECTIONS, MAP_ICON_FILES } from '../config'
import { appleMapsUrl, distanceKm, formatReviews } from '../utils'
import type { Place, UserLocation } from '../types'

interface PlaceSheetProps {
  place: Place
  location: UserLocation | null
  favorite: boolean
  visited: boolean
  onClose: () => void
  onFavorite: () => void
  onVisited: () => void
  onShare: () => void
}

export function PlaceSheet({ place, location, favorite, visited, onClose, onFavorite, onVisited, onShare }: PlaceSheetProps) {
  const iconFile = MAP_ICON_FILES[place.iconType]
  return (
    <section className="place-sheet" role="dialog" aria-modal="true" aria-label={place.name}>
      <div className="place-sheet__grabber" />
      <button className="place-sheet__close" type="button" onClick={onClose} aria-label="關閉">×</button>
      <div className="place-sheet__headline">
        <span className="place-sheet__icon" aria-hidden="true">{iconFile ? <img src={`${import.meta.env.BASE_URL}map-icons/${iconFile}.svg`} alt="" /> : place.icon}</span>
        <div>
          <span className="eyebrow">{COLLECTIONS[place.collection].label}{place.michelin ? ` · ${place.michelin}` : ''}</span>
          <h2>{place.name}</h2>
          <p className="rating-line"><b>★ {place.rating}</b><span>{formatReviews(place.reviewCount)} 則評論</span>{location && <span>{distanceKm(location, place).toFixed(1)} km</span>}</p>
        </div>
      </div>

      <p className="place-sheet__description">{place.description}</p>

      <div className="fact-grid">
        <div><span>不可錯過</span><strong>{place.signature}</strong></div>
        <div><span>人均預算</span><strong>{place.priceVnd}</strong><em>{place.priceHkd || 'HKD 已包含於價格'}</em></div>
        {place.hours && <div><span>早餐／營業時間</span><strong>{place.hours}</strong></div>}
        <div><span>地址</span><strong>{place.address}</strong></div>
      </div>

      {(place.reviewAudit || place.notes) && (
        <details className="audit-note">
          <summary>資料核對與備註</summary>
          {place.reviewAudit && <p><b>反誘評抽查：</b>{place.reviewAudit}</p>}
          {place.notes && <p><b>用餐提示：</b>{place.notes}</p>}
          {place.priceNote && <p><b>價格：</b>{place.priceNote}</p>}
          <p>資料核對：{place.verifiedAt}</p>
        </details>
      )}

      <div className="quick-actions">
        <button type="button" className={favorite ? 'is-active' : ''} onClick={onFavorite}>{favorite ? '♥ 已收藏' : '♡ 收藏'}</button>
        <button type="button" className={visited ? 'is-active' : ''} onClick={onVisited}>{visited ? '✓ 已去過' : '標記去過'}</button>
        <button type="button" onClick={onShare}>分享</button>
      </div>
      <div className="route-actions">
        <a href={place.mapsUrl} target="_blank" rel="noreferrer">Google Maps</a>
        <a href={appleMapsUrl(place)} target="_blank" rel="noreferrer">Apple Maps</a>
      </div>
    </section>
  )
}
