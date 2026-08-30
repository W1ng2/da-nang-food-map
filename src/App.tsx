import { useCallback, useEffect, useMemo, useState } from 'react'
import { COLLECTIONS } from './config'
import { useStoredSet } from './hooks'
import { MapView } from './components/MapView'
import { DecisionFilterSheet } from './components/DecisionFilterSheet'
import { PlaceCard } from './components/PlaceCard'
import { PlaceSheet } from './components/PlaceSheet'
import { applyDecisionFilters, distanceKm, filterPlaces, type DecisionFilters } from './utils'
import type { CollectionId, Place, UserLocation } from './types'

type View = 'map' | 'list' | 'favorites'

const DEFAULT_DECISION_FILTERS: DecisionFilters = {
  cuisine: '',
  maxPriceHkd: null,
  minRating: null,
  nearbyKm: null
}

export default function App() {
  const [places, setPlaces] = useState<Place[]>([])
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('map')
  const [collections, setCollections] = useState<Set<CollectionId>>(new Set(['michelin']))
  const [selected, setSelected] = useState<Place | null>(null)
  const [deepLinkReady, setDeepLinkReady] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationError, setLocationError] = useState('')
  const [showInstall, setShowInstall] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [decisionFilters, setDecisionFilters] = useState<DecisionFilters>(DEFAULT_DECISION_FILTERS)
  const [draftDecisionFilters, setDraftDecisionFilters] = useState<DecisionFilters>(DEFAULT_DECISION_FILTERS)
  const [favorites, toggleFavorite] = useStoredSet('danang-food-map:favorites')
  const [visited, toggleVisited] = useStoredSet('danang-food-map:visited')

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}places.json`).then((response) => {
      if (!response.ok) throw new Error('餐廳資料載入失敗')
      return response.json()
    }).then(setPlaces).catch((error) => setLocationError(error.message))
  }, [])

  useEffect(() => {
    if (!deepLinkReady) return
    const id = selected?.id
    if (!id) history.replaceState(null, '', window.location.pathname)
    else history.replaceState(null, '', `#place=${encodeURIComponent(id)}`)
  }, [selected, deepLinkReady])

  useEffect(() => {
    if (!places.length) return
    const selectFromHash = () => {
      const id = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('place')
      setSelected(id ? places.find((place) => place.id === id) || null : null)
    }
    selectFromHash()
    setDeepLinkReady(true)
    window.addEventListener('hashchange', selectFromHash)
    return () => window.removeEventListener('hashchange', selectFromHash)
  }, [places])

  const collectionMatches = useMemo(() => {
    const visibleCollections = view === 'favorites'
      ? new Set(Object.keys(COLLECTIONS) as CollectionId[])
      : collections
    return filterPlaces(places, query, visibleCollections, view === 'favorites', favorites)
  }, [places, query, collections, view, favorites])

  const filtered = useMemo(() => {
    const result = applyDecisionFilters(collectionMatches, decisionFilters, userLocation)
    if (!userLocation) return result
    return [...result].sort((a, b) => distanceKm(userLocation, a) - distanceKm(userLocation, b))
  }, [collectionMatches, userLocation, decisionFilters])

  const cuisines = useMemo(() => [...new Set(collectionMatches.map((place) => place.type))].sort((a, b) => a.localeCompare(b, 'zh-HK')), [collectionMatches])
  const draftResultCount = useMemo(
    () => applyDecisionFilters(collectionMatches, draftDecisionFilters, userLocation).length,
    [collectionMatches, draftDecisionFilters, userLocation]
  )
  const activeDecisionFilterCount = Object.values(decisionFilters).filter((value) => value !== '' && value !== null).length

  const toggleCollection = (id: CollectionId) => setCollections((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const locate = (enableNearbyDraft = false) => {
    setLocationError('')
    if (!navigator.geolocation) return setLocationError('此瀏覽器不支援定位。')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy })
        if (enableNearbyDraft) setDraftDecisionFilters((current) => ({ ...current, nearbyKm: 3 }))
      },
      (error) => setLocationError(error.code === 1 ? '請在 Safari 設定允許此網站使用位置。' : '暫時無法取得位置，請稍後再試。'),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    )
  }

  const openFilters = () => {
    setLocationError('')
    setDraftDecisionFilters({
      ...decisionFilters,
      cuisine: cuisines.includes(decisionFilters.cuisine) ? decisionFilters.cuisine : ''
    })
    setShowFilters(true)
  }

  const closeFilters = () => {
    setLocationError('')
    setShowFilters(false)
  }

  const applyFilters = () => {
    setDecisionFilters(draftDecisionFilters)
    setLocationError('')
    setShowFilters(false)
  }

  const sharePlace = useCallback(async () => {
    if (!selected) return
    const url = `${window.location.origin}${window.location.pathname}#place=${encodeURIComponent(selected.id)}`
    const data = { title: selected.name, text: `${selected.name}｜${selected.signature}`, url }
    if (navigator.share) await navigator.share(data)
    else {
      await navigator.clipboard.writeText(url)
      window.alert('餐廳連結已複製。')
    }
  }, [selected])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand__stamp" aria-hidden="true">峴港<br />食旅</span>
          <div><p>DA NANG · 2026</p><h1>今天想吃甚麼？</h1></div>
        </div>
        <button className="install-button" type="button" onClick={() => setShowInstall(true)} aria-label="加入主畫面">＋</button>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋餐廳、名物或菜式" aria-label="搜尋餐廳" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="清除搜尋">×</button>}
        </label>
        {view !== 'favorites' && <div className="filter-strip" aria-label="餐廳分類">
          {(Object.entries(COLLECTIONS) as [CollectionId, typeof COLLECTIONS[CollectionId]][]).map(([id, meta]) => (
            <button key={id} type="button" className={collections.has(id) ? 'is-active' : ''} aria-pressed={collections.has(id)} onClick={() => toggleCollection(id)} style={{ '--chip-color': meta.color } as React.CSSProperties}>
              <span>{meta.icon}</span>{meta.shortLabel}
            </button>
          ))}
          <button className={`decision-filter-button ${activeDecisionFilterCount ? 'is-active' : ''}`} type="button" onClick={openFilters}>
            篩選{activeDecisionFilterCount ? ` · ${activeDecisionFilterCount}` : ''}
          </button>
        </div>}
        {view === 'favorites' && <button className={`decision-filter-button decision-filter-button--standalone ${activeDecisionFilterCount ? 'is-active' : ''}`} type="button" onClick={openFilters}>
          篩選{activeDecisionFilterCount ? ` · ${activeDecisionFilterCount}` : ''}
        </button>}
      </header>

      <section className={`content content--${view}`}>
        {view === 'map' ? (
          <>
            <MapView places={filtered} selected={selected} onSelect={setSelected} userLocation={userLocation} />
            <div className="map-status" role="status"><strong>{filtered.length}</strong> 間符合</div>
            <button className="locate-button" type="button" onClick={() => locate()}><span aria-hidden="true">⌖</span>{userLocation ? '重新定位' : '我的位置'}</button>
          </>
        ) : (
          <div className="list-view">
            <div className="list-view__heading">
              <div><span>{view === 'favorites' ? 'MY SAVED PLACES' : 'CURATED IN DA NANG'}</span><h2>{view === 'favorites' ? '我的收藏' : `${filtered.length} 間餐廳`}</h2></div>
              {!userLocation && <button type="button" onClick={() => locate()}>按距離排序</button>}
            </div>
            {filtered.length ? filtered.map((place) => (
              <PlaceCard key={place.id} place={place} location={userLocation} favorite={favorites.has(place.id)} visited={visited.has(place.id)}
                onSelect={() => setSelected(place)} onFavorite={() => toggleFavorite(place.id)} onVisited={() => toggleVisited(place.id)} />
            )) : <div className="empty-state"><span aria-hidden="true">⌁</span><h3>暫時沒有餐廳</h3><p>{view === 'favorites' && favorites.size === 0 ? '在餐廳卡片按下心形，之後可在這裡快速找到。' : '試試重設條件、開啟其他分類或更改搜尋字詞。'}</p></div>}
          </div>
        )}
      </section>

      {locationError && !showFilters && <div className="toast" role="alert">{locationError}<button type="button" aria-label="關閉定位提示" onClick={() => setLocationError('')}>×</button></div>}

      <nav className="tabbar" aria-label="主要頁面">
        <button type="button" className={view === 'map' ? 'is-active' : ''} aria-current={view === 'map' ? 'page' : undefined} onClick={() => setView('map')}><span aria-hidden="true">⌖</span>地圖</button>
        <button type="button" className={view === 'list' ? 'is-active' : ''} aria-current={view === 'list' ? 'page' : undefined} onClick={() => setView('list')}><span aria-hidden="true">≡</span>清單</button>
        <button type="button" className={view === 'favorites' ? 'is-active' : ''} aria-current={view === 'favorites' ? 'page' : undefined} onClick={() => setView('favorites')}><span aria-hidden="true">♡</span>收藏<em>{favorites.size || ''}</em></button>
      </nav>

      {selected && <>
        <button className="sheet-backdrop" type="button" aria-label="關閉餐廳詳情" onClick={() => setSelected(null)} />
        <PlaceSheet place={selected} location={userLocation} favorite={favorites.has(selected.id)} visited={visited.has(selected.id)} onClose={() => setSelected(null)}
          onFavorite={() => toggleFavorite(selected.id)} onVisited={() => toggleVisited(selected.id)} onShare={sharePlace} />
      </>}

      {showInstall && <>
        <button className="sheet-backdrop" type="button" aria-label="關閉安裝說明" onClick={() => setShowInstall(false)} />
        <section className="install-sheet" role="dialog" aria-modal="true">
          <button type="button" className="place-sheet__close" onClick={() => setShowInstall(false)}>×</button>
          <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="峴港食旅 App 圖標" />
          <span className="eyebrow">IPHONE WEB APP</span><h2>放進主畫面，旅途中一按即開</h2>
          <ol><li>在 Safari 按下方的「分享」按鈕 <b>□↑</b></li><li>選擇「加入主畫面」</li><li>開啟「以 Web App 開啟」後按加入</li></ol>
          <p>餐廳資料會離線保留；首次載入新的地圖區域仍需網絡。</p>
        </section>
      </>}

      {showFilters && <>
        <button className="sheet-backdrop" type="button" aria-label="關閉篩選" onClick={closeFilters} />
        <DecisionFilterSheet filters={draftDecisionFilters} cuisines={cuisines} hasLocation={Boolean(userLocation)} resultCount={draftResultCount}
          locationError={locationError} onChange={setDraftDecisionFilters} onRequestLocation={() => locate(true)}
          onReset={() => setDraftDecisionFilters(DEFAULT_DECISION_FILTERS)} onApply={applyFilters} onClose={closeFilters} />
      </>}
    </main>
  )
}
