import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { ATTRACTION_ORDER, CUISINE_ORDER, MAP_ICON_FILES } from './config'
import { useStoredSet } from './hooks'
import { MapView } from './components/MapView'
import { DecisionFilterSheet } from './components/DecisionFilterSheet'
import { PlaceCard } from './components/PlaceCard'
import { PlaceSheet } from './components/PlaceSheet'
import { UpdateBanner } from './components/UpdateBanner'
import { applyDecisionFilters, distanceKm, filterPlaces, type DecisionFilters } from './utils'
import type { Place, UserLocation } from './types'

type View = 'map' | 'list' | 'favorites'
type ExploreMode = 'restaurant' | 'attraction'

const DEFAULT_DECISION_FILTERS: DecisionFilters = {
  maxPriceHkd: null,
  nearbyKm: null,
  openNow: false
}

export default function App() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW()
  const [places, setPlaces] = useState<Place[]>([])
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('map')
  const [mode, setMode] = useState<ExploreMode>('restaurant')
  const [selectedType, setSelectedType] = useState('')
  const [selected, setSelected] = useState<Place | null>(null)
  const [now, setNow] = useState(Date.now())
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
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}places.json`).then((response) => {
      if (!response.ok) throw new Error('地點資料載入失敗')
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
      const place = id ? places.find((candidate) => candidate.id === id) || null : null
      if (place) setMode(place.kind)
      setSelected(place)
    }
    selectFromHash()
    setDeepLinkReady(true)
    window.addEventListener('hashchange', selectFromHash)
    return () => window.removeEventListener('hashchange', selectFromHash)
  }, [places])

  const modePlaces = useMemo(() => places.filter((place) => place.kind === mode), [places, mode])
  const typeMatches = useMemo(
    () => filterPlaces(modePlaces, query, selectedType, view === 'favorites', favorites),
    [modePlaces, query, selectedType, view, favorites]
  )

  const filtered = useMemo(() => {
    const result = applyDecisionFilters(typeMatches, decisionFilters, userLocation, new Date(now))
    if (!userLocation) return result
    return [...result].sort((a, b) => distanceKm(userLocation, a) - distanceKm(userLocation, b))
  }, [typeMatches, userLocation, decisionFilters, now])

  const placeTypes = useMemo(() => {
    const order = mode === 'restaurant' ? CUISINE_ORDER : ATTRACTION_ORDER
    const available = new Set(modePlaces.map((place) => place.type))
    const ordered = order.filter((type) => available.has(type))
    const remaining = [...available]
      .filter((type) => !(order as readonly string[]).includes(type))
      .sort((a, b) => a.localeCompare(b, 'zh-HK'))
    return [...ordered, ...remaining].map((type) => {
      const sample = modePlaces.find((place) => place.type === type)
      return { type, iconFile: sample ? MAP_ICON_FILES[sample.iconType] : undefined, markerImageUrl: sample?.markerImageUrl || '' }
    })
  }, [mode, modePlaces])
  const draftResultCount = useMemo(
    () => applyDecisionFilters(typeMatches, draftDecisionFilters, userLocation, new Date(now)).length,
    [typeMatches, draftDecisionFilters, userLocation, now]
  )
  const activeDecisionFilterCount = mode === 'restaurant'
    ? Number(decisionFilters.maxPriceHkd !== null) + Number(decisionFilters.nearbyKm !== null) + Number(decisionFilters.openNow)
    : Number(decisionFilters.nearbyKm !== null)

  const switchMode = (nextMode: ExploreMode) => {
    setMode(nextMode)
    setSelectedType('')
    setQuery('')
    setSelected(null)
  }

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
    setDraftDecisionFilters(decisionFilters)
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
      window.alert('地點連結已複製。')
    }
  }, [selected])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand__stamp" aria-hidden="true">峴港<br />食旅</span>
          <div><p>DA NANG · 2026</p><h1>今天想去哪裡？</h1></div>
        </div>
        <button className="install-button" type="button" onClick={() => setShowInstall(true)} aria-label="加入主畫面">＋</button>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder={mode === 'restaurant' ? '搜尋餐廳、名物或菜式' : '搜尋景點、區域或遊覽重點'}
            aria-label={mode === 'restaurant' ? '搜尋餐廳' : '搜尋景點'} />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="清除搜尋">×</button>}
        </label>
        <div className="mode-switch" aria-label="地圖內容">
          <button type="button" className={mode === 'restaurant' ? 'is-active' : ''} aria-pressed={mode === 'restaurant'} onClick={() => switchMode('restaurant')}>
            餐廳 <span>{places.filter((place) => place.kind === 'restaurant').length}</span>
          </button>
          <button type="button" className={mode === 'attraction' ? 'is-active' : ''} aria-pressed={mode === 'attraction'} onClick={() => switchMode('attraction')}>
            景點 <span>{places.filter((place) => place.kind === 'attraction').length}</span>
          </button>
        </div>
        <div className="filter-strip" aria-label={mode === 'restaurant' ? '按菜式篩選' : '按景點類型篩選'}>
          <button type="button" className={!selectedType ? 'is-active' : ''} aria-pressed={!selectedType}
            data-cuisine={mode === 'restaurant' ? 'all' : undefined} data-place-type="all" onClick={() => setSelectedType('')}>
            {mode === 'restaurant' ? '全部菜式' : '全部景點'}
          </button>
          {mode === 'restaurant' && <button type="button" className={decisionFilters.openNow ? 'is-active open-now-filter' : 'open-now-filter'}
            aria-pressed={decisionFilters.openNow} onClick={() => setDecisionFilters((current) => ({ ...current, openNow: !current.openNow }))}>
            現在營業
          </button>}
          {placeTypes.map(({ type, iconFile, markerImageUrl }) => (
            <button key={type} type="button" className={selectedType === type ? 'is-active' : ''}
              aria-pressed={selectedType === type} data-cuisine={mode === 'restaurant' ? type : undefined} data-place-type={type}
              onClick={() => setSelectedType((current) => current === type ? '' : type)}>
              {mode === 'attraction' && markerImageUrl
                ? <img className="is-photo" src={markerImageUrl} alt="" aria-hidden="true" referrerPolicy="no-referrer" />
                : iconFile && <img src={`${import.meta.env.BASE_URL}map-icons/${iconFile}.svg`} alt="" aria-hidden="true" />}
              {type}
            </button>
          ))}
          <button className={`decision-filter-button ${activeDecisionFilterCount ? 'is-active' : ''}`} type="button" onClick={openFilters}>
            {mode === 'restaurant' ? '距離／預算' : '距離'}{activeDecisionFilterCount ? ` · ${activeDecisionFilterCount}` : ''}
          </button>
        </div>
      </header>

      <section className={`content content--${view}`}>
        {view === 'map' ? (
          <>
            <MapView places={filtered} selected={selected} onSelect={setSelected} userLocation={userLocation} now={now} />
            <div className="map-status" role="status"><strong>{filtered.length}</strong> {mode === 'restaurant' ? '間餐廳' : '個景點'}</div>
            <button className="locate-button" type="button" onClick={() => locate()}><span aria-hidden="true">⌖</span>{userLocation ? '重新定位' : '我的位置'}</button>
          </>
        ) : (
          <div className="list-view">
            <div className="list-view__heading">
              <div><span>{view === 'favorites' ? 'MY SAVED PLACES' : 'CURATED IN DA NANG'}</span><h2>{view === 'favorites' ? '我的收藏' : `${filtered.length} ${mode === 'restaurant' ? '間餐廳' : '個景點'}`}</h2></div>
              {!userLocation && <button type="button" onClick={() => locate()}>按距離排序</button>}
            </div>
            {filtered.length ? filtered.map((place) => (
              <PlaceCard key={place.id} place={place} location={userLocation} favorite={favorites.has(place.id)} visited={visited.has(place.id)}
                onSelect={() => setSelected(place)} onFavorite={() => toggleFavorite(place.id)} onVisited={() => toggleVisited(place.id)} now={now} />
            )) : <div className="empty-state"><span aria-hidden="true">⌁</span><h3>暫時沒有{mode === 'restaurant' ? '餐廳' : '景點'}</h3><p>{view === 'favorites' && favorites.size === 0 ? '在地點卡片按下心形，之後可在這裡快速找到。' : `試試選擇「${mode === 'restaurant' ? '全部菜式' : '全部景點'}」、重設距離${mode === 'restaurant' ? '或預算' : ''}，或更改搜尋字詞。`}</p></div>}
          </div>
        )}
      </section>

      {locationError && !showFilters && <div className="toast" role="alert">{locationError}<button type="button" aria-label="關閉定位提示" onClick={() => setLocationError('')}>×</button></div>}
      {needRefresh && <UpdateBanner onUpdate={() => void updateServiceWorker(true)} onDismiss={() => setNeedRefresh(false)} />}

      <nav className="tabbar" aria-label="主要頁面">
        <button type="button" className={view === 'map' ? 'is-active' : ''} aria-current={view === 'map' ? 'page' : undefined} onClick={() => setView('map')}><span aria-hidden="true">⌖</span>地圖</button>
        <button type="button" className={view === 'list' ? 'is-active' : ''} aria-current={view === 'list' ? 'page' : undefined} onClick={() => setView('list')}><span aria-hidden="true">≡</span>清單</button>
        <button type="button" className={view === 'favorites' ? 'is-active' : ''} aria-current={view === 'favorites' ? 'page' : undefined} onClick={() => setView('favorites')}><span aria-hidden="true">♡</span>收藏<em>{favorites.size || ''}</em></button>
      </nav>

      {selected && <>
        <button className="sheet-backdrop" type="button" aria-label="關閉地點詳情" onClick={() => setSelected(null)} />
        <PlaceSheet place={selected} location={userLocation} favorite={favorites.has(selected.id)} visited={visited.has(selected.id)} onClose={() => setSelected(null)}
          onFavorite={() => toggleFavorite(selected.id)} onVisited={() => toggleVisited(selected.id)} onShare={sharePlace} now={now} />
      </>}

      {showInstall && <>
        <button className="sheet-backdrop" type="button" aria-label="關閉安裝說明" onClick={() => setShowInstall(false)} />
        <section className="install-sheet" role="dialog" aria-modal="true">
          <button type="button" className="place-sheet__close" onClick={() => setShowInstall(false)}>×</button>
          <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="峴港食旅 App 圖標" />
          <span className="eyebrow">IPHONE WEB APP</span><h2>放進主畫面，旅途中一按即開</h2>
          <ol><li>在 Safari 按下方的「分享」按鈕 <b>□↑</b></li><li>選擇「加入主畫面」</li><li>開啟「以 Web App 開啟」後按加入</li></ol>
          <p>地點資料會離線保留；首次載入新的地圖區域及景點圖片仍需網絡。</p>
        </section>
      </>}

      {showFilters && <>
        <button className="sheet-backdrop" type="button" aria-label="關閉篩選" onClick={closeFilters} />
        <DecisionFilterSheet filters={draftDecisionFilters} hasLocation={Boolean(userLocation)} resultCount={draftResultCount}
          locationError={locationError} onChange={setDraftDecisionFilters} onRequestLocation={() => locate(true)}
          onReset={() => setDraftDecisionFilters(DEFAULT_DECISION_FILTERS)} onApply={applyFilters} onClose={closeFilters} showBudget={mode === 'restaurant'} />
      </>}
    </main>
  )
}
