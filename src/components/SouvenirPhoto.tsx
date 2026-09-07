import { useState } from 'react'
import type { Souvenir } from '../souvenirs'

export function SouvenirPhoto({ item }: { item: Souvenir }) {
  const [failed, setFailed] = useState(false)
  const { photo } = item
  return <figure className="souvenir-photo">
    {failed ? <div className="souvenir-photo__fallback"><p>圖片暫未能載入</p><a href={photo.sourceUrl} target="_blank" rel="noreferrer">查看品牌／來源頁 ↗</a></div>
      : <a className="souvenir-photo__image" href={photo.url} target="_blank" rel="noreferrer" aria-label={`查看${item.name}大圖（新分頁）`}>
        <img src={photo.url} alt={photo.alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
        <span>點圖放大 ↗</span>
      </a>}
    <figcaption><strong>{photo.label}</strong> {photo.caption}<a href={photo.sourceUrl} target="_blank" rel="noreferrer">圖片來源：{photo.credit} ↗</a></figcaption>
  </figure>
}
