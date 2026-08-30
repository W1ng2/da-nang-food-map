import { renderToStaticMarkup } from 'react-dom/server'
import type { ComponentProps } from 'react'
import { describe, expect, it } from 'vitest'
import { DecisionFilterSheet } from './DecisionFilterSheet'
import type { DecisionFilters } from '../utils'

const filters: DecisionFilters = {
  maxPriceHkd: null,
  nearbyKm: null
}

const renderSheet = (overrides: Partial<ComponentProps<typeof DecisionFilterSheet>> = {}) => renderToStaticMarkup(
  <DecisionFilterSheet
    filters={filters}
    hasLocation={false}
    resultCount={12}
    locationError=""
    onChange={() => {}}
    onRequestLocation={() => {}}
    onReset={() => {}}
    onApply={() => {}}
    onClose={() => {}}
    {...overrides}
  />
)

describe('條件篩選決策合約', () => {
  it('未定位時清楚說明用途，並在主按鈕預覽結果數量', () => {
    const markup = renderSheet()

    expect(markup).toContain('啟用目前位置')
    expect(markup).toContain('啟用定位後可選擇 1、3 或 5 km')
    expect(markup).toContain('顯示 12 間')
  })

  it('定位後提供距離及預算，但不再提供米芝蓮、評分或菜式來源篩選', () => {
    const markup = renderSheet({ hasLocation: true, resultCount: 4 })

    expect(markup).toContain('1 km')
    expect(markup).toContain('3 km')
    expect(markup).toContain('5 km')
    expect(markup).toContain('每位預算上限')
    expect(markup).not.toContain('Google 評分')
    expect(markup).not.toContain('Michelin')
    expect(markup).not.toContain('菜式類型')
    expect(markup).toContain('顯示 4 間')
  })

  it('定位錯誤留在篩選面板內，不會遮擋底部操作', () => {
    const markup = renderSheet({ locationError: '暫時無法取得位置，請稍後再試。' })

    expect(markup).toContain('role="alert"')
    expect(markup).toContain('暫時無法取得位置，請稍後再試。')
  })
})
