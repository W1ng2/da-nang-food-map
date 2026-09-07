import { useRef, useState } from 'react'
import { checkAppVersion, fetchPublishedPlaces, withTimeout } from '../manualUpdate'
import type { Place } from '../types'
import { RefreshIcon } from './UiIcon'

export function ManualUpdate({ onPlaces, onReady }: { onPlaces: (places: Place[]) => void; onReady: () => void }) {
  const [busy, setBusy] = useState(false)
  const locked = useRef(false)
  const [message, setMessage] = useState('更新不會清除收藏')
  const check = async () => {
    if (locked.current) return
    locked.current = true
    setBusy(true); setMessage('正在連線檢查…')
    try {
      if (!navigator.onLine) throw new Error('目前離線，已保留原有資料；連線後再試。')
      const data = await fetchPublishedPlaces(import.meta.env.BASE_URL)
      onPlaces(data)
      const registration = 'serviceWorker' in navigator ? await withTimeout(navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL)) : undefined
      const version = await checkAppVersion(registration)
      if (version === 'ready') { onReady(); setMessage('新版已下載，請按「立即更新」。') }
      else setMessage(version === 'latest' ? '已是最新版本；地點資料已重新取得。' : '地點資料已更新；此環境無法確認 App 版本。')
    } catch (error) {
      setMessage(error instanceof Error && /[\u3400-\u9fff]/.test(error.message) ? error.message : '更新未完成，請檢查網絡後重試。收藏不受影響。')
    } finally { locked.current = false; setBusy(false) }
  }
  return <div className="manual-update">
    <span role="status" aria-live="polite">{message}</span>
    <button type="button" onClick={() => void check()} disabled={busy} aria-busy={busy}><RefreshIcon />{busy ? '檢查中…' : '檢查更新'}</button>
  </div>
}
