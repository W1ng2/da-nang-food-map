// @vitest-environment node
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getOpeningStatus } from '../src/openingHours'

execFileSync(process.execPath, ['scripts/build-data.mjs'], { cwd: new URL('..', import.meta.url) })
const places = JSON.parse(readFileSync(new URL('../public/places.json', import.meta.url), 'utf8'))
const get = (id) => places.find((place) => place.id === id)

describe('official hours enrichment reaches every data source', () => {
  it('keeps non-official provenance and does not confuse midnight with noon', () => {
    expect(get('michelin-quan-nhan').schedule.source).toBe('guide')
    expect(get('michelin-quan-nhan').schedule.days.mon).toEqual([['08:00', '00:00']])
    expect(get('cafe-dessert-gioia-gelati-gelati-are-joy').schedule.source).toBe('listing')
    expect(get('cafe-dessert-gioia-gelati-gelati-are-joy').schedule.note).toContain('Tripadvisor')
    for (const id of ['hoi-an-mi-quang-92', 'hoi-an-firefly', 'michelin-banh-xeo-76']) {
      expect(get(id).schedule).toBeNull()
      expect(get(id).hours).toContain('暫不判定營業狀態')
    }
  })
  it('applies Hoi An restaurant hours with the explicit weekly rest day', () => {
    const mate = get('hoi-an-mate')
    expect(mate.schedule.days.sun).toEqual([])
    expect(mate.schedule.days.sat).toEqual([['11:00', '21:30']])
    expect(mate.hoursSourceUrl).toBe('https://www.materes.com/')
    expect(mate.enrichmentVerifiedAt).toBe('2026-09-09')
  })

  it('preserves meal breaks and attraction weekday/weekend differences', () => {
    expect(get('hoi-an-red-bean-restaurant').schedule.days.mon).toEqual([['06:30', '10:00'], ['11:30', '22:00']])
    expect(get('hoi-an-vinwonders').schedule.days.fri).toEqual([['09:00', '18:00']])
    expect(get('hoi-an-vinwonders').schedule.days.sat).toEqual([['09:00', '19:00']])
  })

  it('does not turn partial or conflicting hours into a closed-day schedule', () => {
    for (const id of ['michelin-le-comptoir', 'michelin-my-hanh-seafood', 'hoi-an-precious-heritage']) {
      expect(get(id).schedule).toBeNull()
      expect(get(id).hours).toContain('暫不判定營業狀態')
      expect(get(id).hoursSourceUrl).toMatch(/^https:/)
    }
  })
})

describe('complete September 9 missing-hours audit', () => {
  const audit = JSON.parse(readFileSync(new URL('../data/opening-hours-comprehensive-audit-2026-09-09.json', import.meta.url), 'utf8'))
  const scope = JSON.parse(readFileSync(new URL('../data/hours-audit-scope-2026-09-09.json', import.meta.url), 'utf8'))
  const at = (id, time) => getOpeningStatus(get(id).schedule, new Date(time))

  it('accounts for every original missing place exactly once', () => {
    expect(scope.targets).toHaveLength(149)
    expect(audit.places).toHaveLength(149)
    expect(new Set(audit.places.map(p => p.id)).size).toBe(149)
    expect(audit.places.map(p => p.id).sort()).toEqual(scope.targets.map(p => p.id).sort())
    const counts = {}
    for (const row of audit.places) counts[row.status] = (counts[row.status] || 0) + 1
    expect(counts).toEqual({ added: 65, conflict: 77, incomplete: 6, inaccessible: 1 })
    expect(audit.resultCounts).toEqual(counts)
    expect(places.filter(p => p.schedule)).toHaveLength(112)
  })

  it('publishes audited schedules, provenance and explicit unresolved reasons', () => {
    for (const row of audit.places) {
      const place = get(row.id)
      expect(place.hoursSourceUrl, row.id).toBe(row.sourceUrl)
      expect(place.enrichmentVerifiedAt, row.id).toBe('2026-09-09')
      expect(row.sources.length, row.id).toBeGreaterThan(0)
      expect(row.reason, row.id).toBeTruthy()
      for (const source of row.sources) {
        expect(source.url).toMatch(/^https:\/\//)
        expect(['web-page-extract', 'indexed-page-extract', 'unavailable']).toContain(source.access)
      }
      if (row.status === 'added') {
        expect(place.schedule.source).toBe(row.source)
        expect(place.schedule.timezone).toBe('Asia/Ho_Chi_Minh')
        expect(place.schedule.note).toContain('非即時店況')
        if (row.alwaysOpen) expect(place.schedule.alwaysOpen).toBe(true)
        else {
          expect(Object.keys(place.schedule.days).sort()).toEqual(['fri', 'mon', 'sat', 'sun', 'thu', 'tue', 'wed'])
          expect(place.schedule.days).toEqual(row.days)
        }
      } else {
        expect(row.reason.length, row.id).toBeGreaterThan(20)
        expect(place.schedule, row.id).toBeNull()
        expect(place.hours).toContain(row.reason)
        expect(place.hours).toContain('暫不判定營業狀態')
        expect(getOpeningStatus(place.schedule).isClosed).toBe(false)
      }
    }
  })

  it('handles actual new overnight, rest-day and different-day schedules', () => {
    expect(at('high-rating-claypot-bar-and-restaurant', '2026-09-09T01:59:00+07:00').state).toBe('open')
    expect(at('high-rating-claypot-bar-and-restaurant', '2026-09-09T02:00:00+07:00').state).toBe('before-open')
    expect(at('hoi-an-maazi-hoi-an', '2026-09-09T00:30:00+07:00').state).toBe('open')
    for (const id of ['high-rating-gypsy-rooftop-restaurant-bar', 'hoi-an-le-petit-bistro-hoi-an']) {
      expect(at(id, '2026-09-07T19:00:00+07:00').state).toBe('rest-day')
    }
    for (const id of ['hoi-an-claypot-hoi-an', 'hoi-an-red-dragon-restaurant-cooking-class']) {
      expect(at(id, '2026-09-06T19:00:00+07:00').state).toBe('rest-day')
    }
    expect(at('cafe-dessert-freezedom-da-nang', '2026-09-07T12:00:00+07:00').state).toBe('before-open')
    expect(at('cafe-dessert-freezedom-da-nang', '2026-09-08T12:00:00+07:00').state).toBe('open')
    expect(at('high-rating-mama-masala-indian-cuisine-da-nang', '2026-09-05T10:30:00+07:00').state).toBe('before-open')
    expect(at('high-rating-mama-masala-indian-cuisine-da-nang', '2026-09-06T10:30:00+07:00').state).toBe('open')
    expect(get('michelin-si-dining').schedule.source).toBe('official')
    expect(get('michelin-si-dining').schedule.days.mon).toEqual([['17:30', '21:30']])
  })
})
