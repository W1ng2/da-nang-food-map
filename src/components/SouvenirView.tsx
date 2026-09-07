import { useState } from 'react'
import { SouvenirPhoto } from './SouvenirPhoto'
import { SOUVENIRS, SOUVENIR_CHECKED_AT, isRecentSouvenir, souvenirMapUrl, souvenirPrice, type SouvenirFilter } from '../souvenirs'

export function SouvenirView({ now }: { now: number }) {
  const [filter, setFilter] = useState<SouvenirFilter>('all')
  const [region, setRegion] = useState('all')
  const [category, setCategory] = useState('all')
  const categories = [...new Set(SOUVENIRS.map((item) => item.category))]
  const items = SOUVENIRS.filter((item) => (category === 'all' || item.category === category) && (region === 'all' || item.regions.includes(region)) && (filter === 'all' || filter === 'popular' && item.group === 'popular' || filter === 'recent' && isRecentSouvenir(item, now)))
  return <div className="souvenir-view">
    <header className="souvenir-intro">
      <span className="eyebrow">LITTLE THINGS, LONG MEMORIES</span>
      <h2>把越南帶回家。</h2>
      <p>好分享的小食，和值得留住的手作。</p>
      <small>資料核對 <time dateTime={SOUVENIR_CHECKED_AT}>{SOUVENIR_CHECKED_AT}</time> · 價格非即時</small>
    </header>
    <div className="souvenir-filters">
      <div role="group" aria-label="手信推薦類別">
        {([['all', '全部選物'], ['popular', '大眾推薦'], ['recent', '近期熱門']] as const).map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      <label>購買區域<select aria-label="手信購買區域" value={region} onChange={(event) => setRegion(event.target.value)}><option value="all">峴港＋會安</option><option value="da-nang">峴港</option><option value="hoi-an">會安</option></select></label>
      <div className="souvenir-category-filter" role="group" aria-label="手信種類">
        <span>種類</span>
        <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>全部種類</button>
        {categories.map((value) => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}
      </div>
    </div>
    <details className="souvenir-method"><summary>熱門怎樣選？不是銷量榜 ↗</summary><p>「大眾推薦」綜合旅遊指南及口碑；「近期熱門」指近 180 日有具日期的討論訊號，不是銷量或即時熱搜榜。過期項目保留在全部選物，不再標作近期。</p></details>
    <p className="souvenir-count" role="status">{items.length} 款選物 · 點圖片放大，現場對照包裝</p>
    <p className="souvenir-method">圖片為品牌包裝或款式參考，不代表同款現貨或圖中整套的售價。包裝可能更新；圖片版權屬原權利人，以來源網站外連顯示，需網絡載入。</p>
    <div className="souvenir-grid">
      {items.map((item) => <article className="souvenir-card" key={item.id}>
        <div className="souvenir-card__top"><span>{item.category} / {item.regions.length === 2 ? '峴港・會安' : item.regions[0] === 'hoi-an' ? '會安' : '峴港'}</span><span className={isRecentSouvenir(item, now) ? 'souvenir-badge is-recent' : 'souvenir-badge'}>{item.group === 'popular' ? '大眾推薦' : isRecentSouvenir(item, now) ? '近期熱門' : '較早話題'}</span></div>
        <p className="souvenir-local-name">{item.localName}</p><h3>{item.name}</h3>
        <p className="souvenir-for">送給 {item.forWhom}</p>
        <SouvenirPhoto item={item} />
        <p>{item.summary}</p>
        <div className="souvenir-price"><strong>{souvenirPrice(item)}</strong><span>{item.vndMin.toLocaleString('en-US')}{item.vndMin !== item.vndMax ? `–${item.vndMax.toLocaleString('en-US')}` : ''} VND</span><small>{item.priceBasis}</small></div>
        <p><b>怎樣揀</b> {item.pick}</p>
        <p className="souvenir-caution"><b>帶走前</b> {item.caution}</p>
        <p><b>在哪買</b> {item.buy}</p>
        <a className="souvenir-map-link" href={souvenirMapUrl(region === 'hoi-an' && item.hoiAnMapQuery ? item.hoiAnMapQuery : item.mapQuery)} target="_blank" rel="noreferrer">搜尋購買地點 ↗</a>
        <details><summary>推薦依據、順路安排及來源</summary><p>{item.recentLabel && <b>{item.recentLabel}。</b>}{item.evidence}</p><p><b>順路安排</b> {item.route}</p><ul>{item.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>{source.publishedAt && <small> · {source.publishedAt}</small>}</li>)}</ul></details>
      </article>)}
    </div>
    {!items.length && <p className="souvenir-method">此條件下暫無已核實的推薦，試試「全部種類」、「全部選物」或另一個區域。</p>}
    <aside className="souvenir-footnote"><h3>少踩一個坑</h3><p>Pheva 雖常出現在舊攻略，但近期有 <a href="https://danang-holic.com/shop/souvenir/pheva-chocolate/" target="_blank" rel="noreferrer">2026 年 8 月停業報告</a>；與仍在線的官網資訊未完全一致，未獨立證實前不建議專程前往。</p><p>購買地點連結是搜尋線索，不代表庫存已確認，也沒有替你下單。手信不是餐廳評分榜，沒有套用 Google 4.8／500 則餐廳門檻。</p><p>港幣按 HK$1 ≈ 3,300 VND 概算。包裝、份量與分店價可能不同；保留標籤，出發前查核航空公司及入境地攜帶規定。</p><p>按「檢查更新」可取得我們已發布的版本；不會即時抓取網上熱度或店舖存貨。</p></aside>
  </div>
}
