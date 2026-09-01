import { MAP_ICON_FILES, mapIconAssetPath } from '../config'
import { getOpeningStatus } from '../openingHours'
import { distanceKm, formatReviews, placePhotoUrl } from '../utils'
import type { Place, UserLocation } from '../types'

interface PlaceCardProps {
  place: Place
  location: UserLocation | null
  favorite: boolean
  visited: boolean
  onSelect: () => void
  onFavorite: () => void
  onVisited: () => void
  now: number
}

export function PlaceCard({ place, location, favorite, visited, onSelect, onFavorite, onVisited, now }: PlaceCardProps) {
  const iconFile = MAP_ICON_FILES[place.iconType]
  const photoUrl = place.kind === 'attraction' && place.markerImageUrl ? place.markerImageUrl : placePhotoUrl(place)
  const opening = getOpeningStatus(place.schedule, new Date(now))
  return (
    <article className="place-card">
      <button className="place-card__main" type="button" onClick={onSelect}>
        <span className={`place-card__icon ${place.kind === 'attraction' ? 'is-attraction' : ''}`} aria-hidden="true">
          {iconFile ? <img src={`${import.meta.env.BASE_URL}${mapIconAssetPath(iconFile)}`} alt="" /> : place.icon}
          {photoUrl && <img className="place-card__photo" src={photoUrl} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"
            onError={(event) => { event.currentTarget.hidden = true }} />}
        </span>
        <span className="place-card__body">
          <span className="place-card__labels">
            {place.michelin && <span className="michelin-badge">M&nbsp; MICHELIN · {place.michelin}</span>}
            <span className="eyebrow">{place.type}</span>
          </span>
          <strong>{place.name}</strong>
          <span className="place-card__meta">
            {place.kind === 'restaurant' && <><b>★ {place.rating}</b> · {formatReviews(place.reviewCount)} 則</>}
            {location ? `${place.kind === 'restaurant' ? ' · ' : ''}${distanceKm(location, place).toFixed(1)} km` : ''}
          </span>
          <span className={`opening-pill opening-pill--${opening.state}`}>{opening.label}</span>
          <span className="place-card__price">{place.kind === 'attraction' ? `費用：${place.priceHkd}` : `${place.priceHkd}${place.bookingAdvice ? ' · 建議訂座' : ''}`}</span>
          <span className="place-card__dish">{place.kind === 'attraction' ? '遊覽重點' : '名物'}：{place.signature}</span>
        </span>
      </button>
      <div className="place-card__actions">
        <button type="button" className={favorite ? 'is-active' : ''} aria-label={favorite ? '取消收藏' : '收藏'} aria-pressed={favorite} onClick={onFavorite}>{favorite ? '♥' : '♡'}</button>
        <button type="button" className={visited ? 'is-active' : ''} aria-label={visited ? '取消已去過' : '標記已去過'} aria-pressed={visited} onClick={onVisited}>{visited ? '✓ 去過' : '去過'}</button>
      </div>
    </article>
  )
}
