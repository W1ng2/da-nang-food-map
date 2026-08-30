import type { DecisionFilters } from '../utils'

interface DecisionFilterSheetProps {
  filters: DecisionFilters
  cuisines: string[]
  hasLocation: boolean
  onChange: (filters: DecisionFilters) => void
  onRequestLocation: () => void
  onReset: () => void
  onClose: () => void
}

const PRICE_OPTIONS = [null, 100, 200, 300] as const

export function DecisionFilterSheet({
  filters,
  cuisines,
  hasLocation,
  onChange,
  onRequestLocation,
  onReset,
  onClose
}: DecisionFilterSheetProps) {
  const toggleNearby = () => {
    if (!hasLocation) return onRequestLocation()
    onChange({ ...filters, nearbyKm: filters.nearbyKm ? null : 3 })
  }

  return (
    <section className="filter-sheet" role="dialog" aria-modal="true" aria-labelledby="filter-title">
      <div className="place-sheet__grabber" />
      <button className="place-sheet__close" type="button" onClick={onClose} aria-label="關閉篩選" autoFocus>×</button>
      <span className="eyebrow">DECIDE FASTER</span>
      <h2 id="filter-title">縮窄選擇</h2>

      <div className="filter-sheet__group">
        <div><strong>距離</strong><small>{hasLocation ? '按目前位置計算' : '需要先允許定位'}</small></div>
        <button type="button" className={filters.nearbyKm ? 'is-active' : ''} aria-pressed={Boolean(filters.nearbyKm)} onClick={toggleNearby}>
          3 km 內
        </button>
      </div>

      <fieldset className="filter-sheet__fieldset">
        <legend>人均預算上限</legend>
        <div className="filter-sheet__options">
          {PRICE_OPTIONS.map((value) => (
            <button key={value ?? 'all'} type="button" className={filters.maxPriceHkd === value ? 'is-active' : ''}
              aria-pressed={filters.maxPriceHkd === value} onClick={() => onChange({ ...filters, maxPriceHkd: value })}>
              {value ? `HK$${value}` : '不限'}
            </button>
          ))}
        </div>
        <small>以已收錄價錢區間的上限篩選，避免低估預算。</small>
      </fieldset>

      <label className="filter-sheet__select">
        <span>菜式類型</span>
        <select value={filters.cuisine} onChange={(event) => onChange({ ...filters, cuisine: event.target.value })}>
          <option value="">全部菜式</option>
          {cuisines.map((cuisine) => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
        </select>
      </label>

      <div className="filter-sheet__group">
        <div><strong>評分</strong><small>跨全部餐廳分類</small></div>
        <button type="button" className={filters.minRating ? 'is-active' : ''} aria-pressed={Boolean(filters.minRating)}
          onClick={() => onChange({ ...filters, minRating: filters.minRating ? null : 4.8 })}>
          Google 4.8+
        </button>
      </div>

      <div className="filter-sheet__footer">
        <button type="button" onClick={onReset}>重設</button>
        <button type="button" onClick={onClose}>套用篩選</button>
      </div>
    </section>
  )
}
