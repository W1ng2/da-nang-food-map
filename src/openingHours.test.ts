import { describe, expect, it } from 'vitest'
import { getOpeningStatus } from './openingHours'
import type { OpeningSchedule } from './types'

const schedule: OpeningSchedule = {
  timezone: 'Asia/Ho_Chi_Minh',
  days: {
    tue: [['09:00', '12:00'], ['14:00', '17:00']],
    wed: [['09:00', '17:00']]
  },
  source: 'official',
  verifiedAt: '2026-08-31'
}

describe('峴港營業狀態合約', () => {
  it('按 Asia/Ho_Chi_Minh 時區區分未開門、營業中、暫休及已打烊', () => {
    expect(getOpeningStatus(schedule, new Date('2026-09-01T01:00:00Z')).state).toBe('before-open')
    expect(getOpeningStatus(schedule, new Date('2026-09-01T03:00:00Z')).state).toBe('open')
    expect(getOpeningStatus(schedule, new Date('2026-09-01T06:00:00Z')).state).toBe('between')
    expect(getOpeningStatus(schedule, new Date('2026-09-01T11:30:00Z')).state).toBe('closed')
  })

  it('沒有當日營業時明示休息日，並提供下一次開門時間', () => {
    const result = getOpeningStatus(schedule, new Date('2026-08-31T03:00:00Z'))
    expect(result).toMatchObject({ state: 'rest-day', label: '休息日', isClosed: true })
    expect(result.detail).toContain('星期二 09:00')
  })

  it('未知時間不會被誤判為關門或變成黑白圖標', () => {
    expect(getOpeningStatus(null, new Date('2026-09-01T03:00:00Z'))).toMatchObject({
      state: 'unknown', label: '營業時間待核實', isClosed: false
    })
  })

  it('戶外全天景點維持開放狀態', () => {
    expect(getOpeningStatus({ ...schedule, alwaysOpen: true }, new Date('2026-09-01T03:00:00Z'))).toMatchObject({
      state: 'always-open', label: '全天開放', isClosed: false
    })
  })
})
