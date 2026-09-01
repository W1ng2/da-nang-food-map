import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HeartIcon, PlusIcon } from './UiIcon'

describe('介面圖示幾何合約', () => {
  it('加號使用以中心點 12 為軸的對稱 SVG 座標', () => {
    const markup = renderToStaticMarkup(<PlusIcon />)

    expect(markup).toContain('viewBox="0 0 24 24"')
    expect(markup).toContain('width="20" height="20"')
    expect(markup).toContain('d="M12 5V19M5 12H19"')
  })

  it('空心與實心收藏狀態共用同一個寬版愛心輪廓', () => {
    const outline = renderToStaticMarkup(<HeartIcon />)
    const filled = renderToStaticMarkup(<HeartIcon filled />)
    const outlinePath = outline.match(/d="([^"]+)"/)?.[1]
    const filledPath = filled.match(/d="([^"]+)"/)?.[1]

    expect(outlinePath).toBe(filledPath)
    expect(outline).toContain('width="22" height="20"')
    expect(outline).toContain('fill="none"')
    expect(filled).toContain('fill="currentColor"')
  })
})
