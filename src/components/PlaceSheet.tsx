import { MAP_ICON_FILES } from '../config'
import { appleMapsUrl, distanceKm, formatReviews, placePhotoUrl } from '../utils'
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

const PHOTO_KIND_LABELS = {
  storefront: '餐廳門面',
  'building-entrance': '所在大廈入口',
  'venue-identity': '餐廳參考照'
} as const

export function PlaceSheet({ place, location, favorite, visited, onClose, onFavorite, onVisited, onShare }: PlaceSheetProps) {
  const iconFile = MAP_ICON_FILES[place.iconType]
  const photoUrl = placePhotoUrl(place)
  return (
    <section className="place-sheet" role="dialog" aria-modal="true" aria-label={place.name}>
      <div className="place-sheet__grabber" />
      <button className="place-sheet__close" type="button" onClick={onClose} aria-label="關閉" autoFocus>×</button>
      {photoUrl && place.photo && (
        <div className="place-sheet__photo-block">
          <figure className="place-sheet__photo">
            <img src={photoUrl} alt={place.photo.alt} decoding="async" referrerPolicy="no-referrer"
              onError={(event) => { event.currentTarget.closest('.place-sheet__photo-block')?.setAttribute('hidden', '') }} />
            <span className="place-sheet__photo-kind">{PHOTO_KIND_LABELS[place.photo.kind]}</span>
            <figcaption>
              <a href={place.photo.sourceUrl} target="_blank" rel="noreferrer">相片：{place.photo.credit}</a>
              <span>{place.photo.rightsNotice}</span>
            </figcaption>
          </figure>
          <p className="place-sheet__arrival-note"><b>到場辨認：</b>{place.photo.arrivalNote}</p>
        </div>
      )}
      <div className="place-sheet__headline">
        <span className="place-sheet__icon" aria-hidden="true">{iconFile ? <img src={`${import.meta.env.BASE_URL}map-icons/${iconFile}.svg`} alt="" /> : place.icon}</span>
        <div>
          <span className="place-sheet__labels">
            {place.michelin && <span className="michelin-badge">M&nbsp; MICHELIN GUIDE · {place.michelin}</span>}
            <span className="eyebrow">{place.type}</span>
          </span>
          <h2>{place.name}</h2>
          <p className="rating-line"><b>★ {place.rating}</b><span>{formatReviews(place.reviewCount)} 則評論</span>{location && <span>{distanceKm(location, place).toFixed(1)} km</span>}</p>
        </div>
      </div>

      <p className="place-sheet__description">{place.description}</p>

      <div className="fact-grid">
        <div><span>不可錯過</span><strong>{place.signature}</strong></div>
        <div><span>人均預算</span><strong>{place.priceVnd}</strong><em>{place.priceHkd}</em></div>
        {place.hours && <div><span>早餐／營業時間</span><strong>{place.hours}</strong></div>}
        {place.bookingAdvice && <div><span>訂座提示</span><strong>{place.bookingAdvice}</strong></div>}
        <div><span>地址</span><strong>{place.address}</strong></div>
      </div>

      {(place.reviewAudit || place.notes || place.enrichmentVerifiedAt) && (
        <details className="audit-note">
          <summary>資料核對與備註</summary>
          {place.reviewAudit && <p><b>反誘評抽查：</b>{place.reviewAudit}</p>}
          {place.notes && <p><b>用餐提示：</b>{place.notes}</p>}
          {place.priceNote && <p><b>價格：</b>{place.priceNote}</p>}
          <p>資料核對：{place.verifiedAt}</p>
          {place.enrichmentVerifiedAt && <p><b>營業／聯絡資料：</b>{place.enrichmentVerifiedAt}{place.hoursSourceUrl && <> · <a href={place.hoursSourceUrl} target="_blank" rel="noreferrer">核對來源</a></>}</p>}
        </details>
      )}

      <div className="quick-actions">
        <button type="button" className={favorite ? 'is-active' : ''} aria-pressed={favorite} onClick={onFavorite}>{favorite ? '♥ 已收藏' : '♡ 收藏'}</button>
        <button type="button" className={visited ? 'is-active' : ''} aria-pressed={visited} onClick={onVisited}>{visited ? '✓ 已去過' : '標記去過'}</button>
        <button type="button" onClick={onShare}>分享</button>
      </div>
      {(place.bookingUrl || place.phone || place.website) && <div className="contact-actions">
        {place.bookingUrl && <a href={place.bookingUrl} target="_blank" rel="noreferrer">官方訂座</a>}
        {place.phone && <a href={`tel:${place.phone}`}>致電</a>}
        {place.website && <a href={place.website} target="_blank" rel="noreferrer">官方網站</a>}
      </div>}
      <div className="route-actions">
        <a href={place.mapsUrl} target="_blank" rel="noreferrer">Google Maps</a>
        <a href={appleMapsUrl(place)} target="_blank" rel="noreferrer">Apple Maps</a>
      </div>
    </section>
  )
}
