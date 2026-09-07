import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { SOUVENIRS, isRecentSouvenir, souvenirMapUrl, souvenirPrice } from './souvenirs'
import { SouvenirView } from './components/SouvenirView'
import { SouvenirPhoto } from './components/SouvenirPhoto'

const now = Date.parse('2026-09-07T12:00:00+07:00')

describe('souvenir guide', () => {
  it('has sourced prices, shopping leads and real dated evidence for recent picks', () => {
    expect(SOUVENIRS).toHaveLength(11)
    expect(new Set(SOUVENIRS.map((item) => item.id)).size).toBe(11)
    for (const item of SOUVENIRS) {
      expect(item.vndMin).toBeGreaterThan(0)
      expect(item.vndMax).toBeGreaterThanOrEqual(item.vndMin)
      expect(souvenirPrice(item)).toContain('HK$')
      expect(item.caution && item.buy && item.priceBasis && item.evidence).toBeTruthy()
      expect(item.sources.length).toBeGreaterThan(0)
      expect(item.photo.url).toMatch(/^https:\/\//)
      expect(item.photo.sourceUrl).toMatch(/^https:\/\//)
      expect(item.photo.alt && item.photo.caption && item.photo.credit && item.photo.verifiedAt).toBeTruthy()
      for (const source of item.sources) expect(source.url).toMatch(/^https:\/\//)
      if (item.group === 'recent') expect(item.sources.some((source) => source.publishedAt === item.recentAt)).toBe(true)
      expect(new URL(souvenirMapUrl(item.mapQuery)).searchParams.get('query')).toBe(item.mapQuery)
    }
    expect(SOUVENIRS.filter((item) => isRecentSouvenir(item, now))).toHaveLength(2)
  })
  it('never keeps a stale or future discussion labelled recent', () => {
    const marou = SOUVENIRS.find((item) => item.id === 'marou')!
    expect(isRecentSouvenir(marou, now)).toBe(true)
    expect(isRecentSouvenir(marou, Date.parse('2027-09-07'))).toBe(false)
    expect(isRecentSouvenir(marou, Date.parse('2026-01-01'))).toBe(false)
    expect(renderToStaticMarkup(<SouvenirView now={Date.parse('2027-09-07')} />)).toContain('較早話題')
  })
  it('opens the exact product image and falls back honestly if the remote image fails', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div'), root = createRoot(host), item = SOUVENIRS[0]
    document.body.append(host)
    try {
      await act(async () => root.render(<SouvenirPhoto item={item} />))
      expect(host.querySelector('img')?.alt).toBe(item.photo.alt)
      expect(host.querySelector('.souvenir-photo__image')?.getAttribute('href')).toBe(item.photo.url)
      expect(host.querySelector('.souvenir-photo__image')?.getAttribute('target')).toBe('_blank')
      await act(async () => host.querySelector('img')!.dispatchEvent(new Event('error')))
      expect(host.querySelector('img')).toBeNull()
      expect(host.textContent).toContain('圖片暫未能載入')
      expect(host.querySelector('.souvenir-photo__fallback a')?.getAttribute('href')).toBe(item.photo.sourceUrl)
    } finally { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals() }
  })
  it('filters by recommendation and shopping region without changing restaurant filters', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div'), root = createRoot(host)
    document.body.append(host)
    try {
      await act(async () => root.render(<SouvenirView now={now} />))
      expect(host.querySelectorAll('article')).toHaveLength(11)
      const categoryGroup = host.querySelector('[aria-label="手信種類"]')!
      const categoryButton = (text: string) => [...categoryGroup.querySelectorAll('button')].find((button) => button.textContent === text)!
      for (const [category, count] of [['零食', 6], ['咖啡', 2], ['工藝', 2], ['護理', 1]] as const) {
        await act(async () => categoryButton(category).click())
        expect(host.querySelectorAll('article')).toHaveLength(count)
        expect(categoryButton(category).getAttribute('aria-pressed')).toBe('true')
      }
      const recent = [...host.querySelectorAll('button')].find((button) => button.textContent === '近期熱門')!
      await act(async () => recent.click())
      expect(host.querySelectorAll('article')).toHaveLength(1)
      expect(host.querySelector('article')?.textContent).toContain('Cocoon')
      await act(async () => categoryButton('咖啡').click())
      expect(host.querySelectorAll('article')).toHaveLength(0)
      expect(host.textContent).toContain('試試「全部種類」')
      await act(async () => categoryButton('全部種類').click())
      expect(host.querySelectorAll('article')).toHaveLength(2)
      const select = host.querySelector('select')!
      await act(async () => { select.value = 'hoi-an'; select.dispatchEvent(new Event('change', { bubbles: true })) })
      expect(host.querySelectorAll('article')).toHaveLength(1)
      expect(host.querySelector('article')?.textContent).toContain('MAROU')
      expect(host.querySelector('.souvenir-map-link')?.getAttribute('href')).toContain('Maison%20Marou%20Hoi%20An')
      expect(host.textContent).toContain('不是銷量或即時熱搜榜')
    } finally { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals() }
  })
})
