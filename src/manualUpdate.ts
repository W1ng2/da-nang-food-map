import type { Place } from './types'

// First-visit tabs may not have a controller yet. Wait for activation, not only
// Workbox's controlling event, before the caller explicitly reloads the page.
export async function activateAppUpdate(registration?: ServiceWorkerRegistration): Promise<void> {
  if (!registration) throw new Error('未能取得 App 版本，請重新開啟。')
  const worker = registration.waiting
  if (!worker) {
    if (registration.active) return // Another tab may already have applied it.
    throw new Error('新版尚未準備好，請再按檢查更新。')
  }
  await new Promise<void>((resolve, reject) => {
    const finish = (error?: Error) => {
      clearTimeout(timer)
      worker.removeEventListener('statechange', changed)
      if (error) reject(error)
      else resolve()
    }
    const changed = () => {
      if (worker.state === 'activated') finish()
      else if (worker.state === 'redundant') finish(new Error('新版啟用失敗，請重試。'))
    }
    const timer = setTimeout(() => finish(new Error('新版啟用逾時，請再按檢查更新。')), 20000)
    worker.addEventListener('statechange', changed)
    try { worker.postMessage({ type: 'SKIP_WAITING' }); changed() }
    catch (error) { finish(error instanceof Error ? error : new Error('新版啟用失敗。')) }
  })
}

export function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('更新逾時，請稍後重試。')), ms)
    promise.then((value) => { clearTimeout(timer); resolve(value) }, (error) => { clearTimeout(timer); reject(error) })
  })
}

export async function checkAppVersion(registration?: ServiceWorkerRegistration): Promise<'ready' | 'latest' | 'unavailable'> {
  if (!registration) return 'unavailable'
  if (registration.waiting) return 'ready'
  await withTimeout(registration.update())
  if (registration.waiting) return 'ready'
  const worker = registration.installing
  if (!worker) return 'latest'
  // update() may finish while precaching is still running: wait before reporting success.
  return new Promise((resolve, reject) => {
    const finish = (error?: Error) => {
      clearTimeout(timer)
      worker.removeEventListener('statechange', changed)
      if (error) reject(error)
      else resolve(registration.waiting || (worker.state === 'installed' && registration.active) ? 'ready' : 'latest')
    }
    const changed = () => {
      if (worker.state === 'redundant') finish(new Error('新版下載失敗，請重試。'))
      else if (['installed', 'activated'].includes(worker.state)) finish()
    }
    const timer = setTimeout(() => finish(new Error('新版仍在下載，請稍後再檢查。')), 20000)
    worker.addEventListener('statechange', changed)
    changed()
  })
}

export async function fetchPublishedPlaces(base: string): Promise<Place[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  try {
    // Bypass the offline fallback: cached data must not be reported as a fresh network result.
    const response = await fetch(`${base}places.json?refresh=${Date.now()}`, { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error('未能取得最新地點資料。')
    const data: unknown = await response.json()
    if (!Array.isArray(data) || !data.length || !data.every((place) => place && typeof place.id === 'string' && typeof place.name === 'string' && ['restaurant', 'attraction'].includes(place.kind) && Number.isFinite(place.lat) && Number.isFinite(place.lng))) throw new Error('新版資料格式不完整，已保留原有資料。')
    return data as Place[]
  } finally { clearTimeout(timer) }
}
