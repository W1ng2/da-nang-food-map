import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { UpdateBanner } from './UpdateBanner'

describe('PWA 更新提示合約', () => {
  it('清楚說明新版本並提供立即更新與稍後選項', () => {
    const markup = renderToStaticMarkup(<UpdateBanner onUpdate={() => {}} onDismiss={() => {}} />)

    expect(markup).toContain('role="status"')
    expect(markup).toContain('地圖有新版')
    expect(markup).toContain('立即更新')
    expect(markup).toContain('稍後')
  })
})
