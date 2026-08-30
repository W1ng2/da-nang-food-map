import { COLLECTIONS, MAP_ICON_FILES } from '../config'
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
}

export function PlaceCard({ place, location, favorite, visited, onSelect, onFavorite, onVisited }: PlaceCardProps) {
  const iconFile = MAP_ICON_FILES[place.iconType]
  const photoUrl = placePhotoUrl(place)
  return (
    <article className="place-card">
      <button className="place-card__main" type="button" onClick={onSelect}>
        <span className="place-card__icon" aria-hidden="true">
          {iconFile ? <img src={`${import.meta.env.BASE_URL}map-icons/${iconFile}.svg`} alt="" /> : place.icon}
          {photoUrl && <img className="place-card__photo" src={photoUrl} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"
            onError={(event) => { event.currentTarget.hidden = true }} />}
        </span>
        <span className="place-card__body">
          <span className="eyebrow">{COLLECTIONS[place.collection].shortLabel} · {place.type}</span>
          <strong>{place.name}</strong>
          <span className="place-card__meta"><b>★ {place.rating}</b> · {formatReviews(place.reviewCount)} 則{location ? ` · ${distanceKm(location, place).toFixed(1)} km` : ''}</span>
          <span className="place-card__price">{place.priceHkd}{place.bookingAdvice ? ' · 建議訂座' : ''}</span>
          <span className="place-card__dish">名物：{place.signature}</span>
        </span>
      </button>
      <div className="place-card__actions">
        <button type="button" className={favorite ? 'is-active' : ''} aria-label={favorite ? '取消收藏' : '收藏'} aria-pressed={favorite} onClick={onFavorite}>{favorite ? '♥' : '♡'}</button>
        <button type="button" className={visited ? 'is-active' : ''} aria-label={visited ? '取消已去過' : '標記已去過'} aria-pressed={visited} onClick={onVisited}>{visited ? '✓ 去過' : '去過'}</button>
      </div>
    </article>
  )
}
