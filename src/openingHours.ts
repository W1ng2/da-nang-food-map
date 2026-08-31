import type { OpeningSchedule, Weekday } from './types'

export type OpeningState = 'open' | 'always-open' | 'before-open' | 'between' | 'closed' | 'rest-day' | 'unknown'

export interface OpeningStatus {
  state: OpeningState
  label: string
  detail: string
  isClosed: boolean
}

const WEEKDAYS: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const WEEKDAY_LABELS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function zonedNow(now: Date, timezone: OpeningSchedule['timezone']) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value || ''
  const weekday = WEEKDAYS.findIndex((day) => day === part('weekday').toLowerCase().slice(0, 3))
  return { weekday, dayOfMonth: Number(part('day')), minute: Number(part('hour')) * 60 + Number(part('minute')) }
}

function nextOpening(schedule: OpeningSchedule, weekday: number, minute: number) {
  for (let offset = 0; offset <= 7; offset += 1) {
    const dayIndex = (weekday + offset) % 7
    const ranges = schedule.days?.[WEEKDAYS[dayIndex]] || []
    const candidate = ranges.find(([start]) => offset > 0 || toMinutes(start) > minute)
    if (candidate) return `${offset === 0 ? '今日' : WEEKDAY_LABELS[dayIndex]} ${candidate[0]} 開門`
  }
  return '下一次營業時間待核實'
}

export function getOpeningStatus(schedule: OpeningSchedule | null | undefined, now = new Date()): OpeningStatus {
  if (!schedule) return { state: 'unknown', label: '營業時間待核實', detail: '未有足夠資料判斷，出發前請向店家核實。', isClosed: false }
  if (schedule.alwaysOpen) return { state: 'always-open', label: '全天開放', detail: schedule.note || '戶外空間可隨時到訪。', isClosed: false }

  const { weekday, dayOfMonth, minute } = zonedNow(now, schedule.timezone)
  if (schedule.monthlyClosedDates?.includes(dayOfMonth)) {
    return { state: 'rest-day', label: '休息日', detail: nextOpening(schedule, weekday, 1440), isClosed: true }
  }
  const today = schedule.days?.[WEEKDAYS[weekday]] || []
  const previousDay = schedule.days?.[WEEKDAYS[(weekday + 6) % 7]] || []
  const overnightFromYesterday = previousDay.find(([start, end]) => toMinutes(end) < toMinutes(start) && minute < toMinutes(end))
  if (overnightFromYesterday) {
    return { state: 'open', label: '營業中', detail: `今日 ${overnightFromYesterday[1]} 打烊`, isClosed: false }
  }

  const sorted = [...today].sort((a, b) => toMinutes(a[0]) - toMinutes(b[0]))
  for (const [start, end] of sorted) {
    const startMinute = toMinutes(start)
    const endMinute = toMinutes(end)
    const open = endMinute < startMinute ? minute >= startMinute : minute >= startMinute && minute < endMinute
    if (open) return { state: 'open', label: '營業中', detail: `${endMinute < startMinute ? '明日' : '今日'} ${end} 打烊`, isClosed: false }
  }

  if (!sorted.length) return { state: 'rest-day', label: '休息日', detail: nextOpening(schedule, weekday, minute), isClosed: true }

  const nextToday = sorted.find(([start]) => toMinutes(start) > minute)
  if (nextToday) {
    const state = minute < toMinutes(sorted[0][0]) ? 'before-open' : 'between'
    return {
      state,
      label: state === 'before-open' ? '未開門' : '暫時休息',
      detail: `今日 ${nextToday[0]} ${state === 'before-open' ? '開門' : '再開'}`,
      isClosed: true
    }
  }

  return { state: 'closed', label: '已打烊', detail: nextOpening(schedule, weekday, minute), isClosed: true }
}
