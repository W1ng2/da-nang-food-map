import { afterEach, describe, expect, it, vi } from 'vitest'
import { activateAppUpdate, checkAppVersion, fetchPublishedPlaces } from './manualUpdate'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers() })

function registration(overrides: object = {}) {
  return { waiting: null, installing: null, active: {}, update: vi.fn().mockResolvedValue(undefined), ...overrides } as unknown as ServiceWorkerRegistration
}

describe('manual update', () => {
  it('waits for activation even when a first-visit tab has no controller', async () => {
    const worker = Object.assign(new EventTarget(), { state: 'installed', postMessage: vi.fn() })
    let done = false
    const result = activateAppUpdate(registration({ waiting: worker })).then(() => { done = true })
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
    await Promise.resolve()
    expect(done).toBe(false)
    worker.state = 'activated'; worker.dispatchEvent(new Event('statechange'))
    await result
    expect(done).toBe(true)
    await expect(activateAppUpdate(registration())).resolves.toBeUndefined()
    await expect(activateAppUpdate()).rejects.toThrow('未能取得')
  })
  it('does not reload through a failed or stalled activation', async () => {
    vi.useFakeTimers()
    const worker = Object.assign(new EventTarget(), { state: 'installed', postMessage: vi.fn() })
    const failed = expect(activateAppUpdate(registration({ waiting: worker }))).rejects.toThrow('啟用失敗')
    worker.state = 'redundant'; worker.dispatchEvent(new Event('statechange')); await failed
    worker.state = 'installed'
    const stalled = expect(activateAppUpdate(registration({ waiting: worker }))).rejects.toThrow('逾時')
    await vi.advanceTimersByTimeAsync(20001); await stalled
  })
  it('checks the registration, and does not clear stored preferences', async () => {
    localStorage.setItem('danang-food-map:favorites', '["hoi-an-mi-quang-92"]')
    const reg = registration()
    expect(await checkAppVersion(reg)).toBe('latest')
    expect(reg.update).toHaveBeenCalledOnce()
    expect(localStorage.getItem('danang-food-map:favorites')).toContain('hoi-an-mi-quang-92')
  })
  it('finds an already waiting update even after the banner was dismissed', async () => {
    const reg = registration({ waiting: {} })
    expect(await checkAppVersion(reg)).toBe('ready')
    expect(reg.update).not.toHaveBeenCalled()
  })
  it('waits for a downloading worker before reporting the result', async () => {
    const worker = Object.assign(new EventTarget(), { state: 'installing' })
    const result = checkAppVersion(registration({ installing: worker }))
    await Promise.resolve(); await Promise.resolve()
    worker.state = 'installed'; worker.dispatchEvent(new Event('statechange'))
    expect(await result).toBe('ready')
  })
  it('reports failed installs and network errors, not false latest', async () => {
    await expect(checkAppVersion(registration({ update: vi.fn().mockRejectedValue(new Error('network')) }))).rejects.toThrow('network')
    const worker = Object.assign(new EventTarget(), { state: 'redundant' })
    await expect(checkAppVersion(registration({ installing: worker }))).rejects.toThrow('下載失敗')
    expect(await checkAppVersion()).toBe('unavailable')
  })
  it('bounds a stalled update check', async () => {
    vi.useFakeTimers()
    const result = expect(checkAppVersion(registration({ update: () => new Promise(() => {}) }))).rejects.toThrow('逾時')
    await vi.advanceTimersByTimeAsync(15001)
    await result
  })
  it('uses a cache-busting network request and validates data before replacement', async () => {
    const place = { id: 'test', name: 'Test', kind: 'restaurant', lat: 16, lng: 108 }
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => [place] })
    vi.stubGlobal('fetch', fetcher)
    expect(await fetchPublishedPlaces('/da-nang-food-map/')).toEqual([place])
    expect(fetcher).toHaveBeenCalledWith(expect.stringMatching(/^\/da-nang-food-map\/places.json\?refresh=\d+$/), expect.objectContaining({ cache: 'no-store', signal: expect.any(AbortSignal) }))
    fetcher.mockResolvedValue({ ok: true, json: async () => [{ id: 'bad' }] })
    await expect(fetchPublishedPlaces('/')).rejects.toThrow('已保留原有資料')
    fetcher.mockResolvedValue({ ok: false })
    await expect(fetchPublishedPlaces('/')).rejects.toThrow('未能取得')
  })
})
