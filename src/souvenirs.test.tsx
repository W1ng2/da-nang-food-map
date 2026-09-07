import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { SOUVENIRS, isRecentSouvenir, souvenirMapUrl, souvenirPrice } from './souvenirs'
import { SouvenirView } from './components/SouvenirView'

const now = Date.parse('2026-09-07T12:00:00+07:00')

describe('souvenir guide', () => {
  it('has sourced prices, shopping leads and real dated evidence for recent picks', () => {
    expect(SOUVENIRS).toHaveLength(8)
    expect(new Set(SOUVENIRS.map((item) => item.id)).size).toBe(8)
    for (const item of SOUVENIRS) {
      expect(item.vndMin).toBeGreaterThan(0)
      expect(item.vndMax).toBeGreaterThanOrEqual(item.vndMin)
      expect(souvenirPrice(item)).toContain('HK$')
      expect(item.caution && item.buy && item.priceBasis && item.evidence).toBeTruthy()
      expect(item.sources.length).toBeGreaterThan(0)
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
  it('filters by recommendation and shopping region without changing restaurant filters', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div'), root = createRoot(host)
    document.body.append(host)
    try {
      await act(async () => root.render(<SouvenirView now={now} />))
      expect(host.querySelectorAll('article')).toHaveLength(8)
      const recent = [...host.querySelectorAll('button')].find((button) => button.textContent === '近期熱門')!
      await act(async () => recent.click())
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
