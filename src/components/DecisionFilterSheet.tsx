import type { DecisionFilters } from '../utils'

interface DecisionFilterSheetProps {
  filters: DecisionFilters
  cuisines: string[]
  hasLocation: boolean
  resultCount: number
  locationError: string
  onChange: (filters: DecisionFilters) => void
  onRequestLocation: () => void
  onReset: () => void
  onApply: () => void
  onClose: () => void
}

const DISTANCE_OPTIONS = [null, 1, 3, 5] as const
const PRICE_OPTIONS = [null, 50, 100, 200, 300] as const
const RATING_OPTIONS = [null, 4.5, 4.8] as const

export function DecisionFilterSheet({
  filters,
  cuisines,
  hasLocation,
  resultCount,
  locationError,
  onChange,
  onRequestLocation,
  onReset,
  onApply,
  onClose
}: DecisionFilterSheetProps) {
  return (
    <section className="filter-sheet" role="dialog" aria-modal="true" aria-labelledby="filter-title">
      <div className="place-sheet__grabber" />
      <button className="place-sheet__close" type="button" onClick={onClose} aria-label="關閉篩選" autoFocus>×</button>
      <span className="eyebrow">DECIDE FASTER</span>
      <h2 id="filter-title">縮窄選擇</h2>
      <p className="filter-sheet__summary">調整條件時先預覽結果，按下方按鈕才會套用。</p>

      {hasLocation ? (
        <fieldset className="filter-sheet__fieldset">
          <legend>距離</legend>
          <div className="filter-sheet__options filter-sheet__options--four">
            {DISTANCE_OPTIONS.map((value) => (
              <button key={value ?? 'all'} type="button" className={filters.nearbyKm === value ? 'is-active' : ''}
                aria-pressed={filters.nearbyKm === value} onClick={() => onChange({ ...filters, nearbyKm: value })}>
                {value ? `${value} km` : '不限'}
              </button>
            ))}
          </div>
          <small>按目前位置的直線距離計算。</small>
        </fieldset>
      ) : (
        <div className="filter-sheet__location">
          <div><strong>距離</strong><small>啟用定位後可選擇 1、3 或 5 km。</small></div>
          <button type="button" onClick={onRequestLocation}>啟用目前位置</button>
          {locationError && <p className="filter-sheet__inline-alert" role="alert">{locationError}</p>}
        </div>
      )}

      <fieldset className="filter-sheet__fieldset">
        <legend>每位預算上限</legend>
        <div className="filter-sheet__options filter-sheet__options--budget">
          {PRICE_OPTIONS.map((value) => (
            <button key={value ?? 'all'} type="button" className={filters.maxPriceHkd === value ? 'is-active' : ''}
              aria-pressed={filters.maxPriceHkd === value} onClick={() => onChange({ ...filters, maxPriceHkd: value })}>
              {value ? `≤ HK$${value}` : '不限'}
            </button>
          ))}
        </div>
        <small>以餐廳已收錄價錢區間的上限篩選，避免低估預算。</small>
      </fieldset>

      <label className="filter-sheet__select">
        <span>菜式類型</span>
        <select value={filters.cuisine} onChange={(event) => onChange({ ...filters, cuisine: event.target.value })}>
          <option value="">全部菜式</option>
          {cuisines.map((cuisine) => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
        </select>
      </label>

      <fieldset className="filter-sheet__fieldset">
        <legend>Google 評分</legend>
        <div className="filter-sheet__options filter-sheet__options--rating">
          {RATING_OPTIONS.map((value) => (
            <button key={value ?? 'all'} type="button" className={filters.minRating === value ? 'is-active' : ''}
              aria-pressed={filters.minRating === value} onClick={() => onChange({ ...filters, minRating: value })}>
              {value ? `${value}+` : '不限'}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="filter-sheet__footer">
        <button type="button" onClick={onReset}>清除全部</button>
        <button type="button" onClick={onApply}>顯示 {resultCount} 間</button>
      </div>
    </section>
  )
}
