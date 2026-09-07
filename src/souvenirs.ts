import data from '../data/souvenirs.json'

export type Souvenir = Omit<typeof data[number], 'sources'> & {
  sources: { label: string; url: string; publishedAt?: string }[]
}
export const SOUVENIRS: Souvenir[] = data
export type SouvenirFilter = 'all' | 'popular' | 'recent'
export const SOUVENIR_CHECKED_AT = '2026-09-07'

export function isRecentSouvenir(item: Souvenir, now: number) {
  if (!item.recentAt) return false
  const age = now - Date.parse(`${item.recentAt}T00:00:00+07:00`)
  return age >= 0 && age <= 180 * 86400000
}

export function souvenirPrice(item: Souvenir) {
  const min = Math.round(item.vndMin / 3300), max = Math.round(item.vndMax / 3300)
  return `約 HK$${min}${min === max ? '' : `–${max}`}`
}

export function souvenirMapUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
