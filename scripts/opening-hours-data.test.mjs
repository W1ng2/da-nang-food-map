// @vitest-environment node
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

execFileSync(process.execPath, ['scripts/build-data.mjs'], { cwd: new URL('..', import.meta.url) })
const places = JSON.parse(readFileSync(new URL('../public/places.json', import.meta.url), 'utf8'))
const get = (id) => places.find((place) => place.id === id)

describe('official hours enrichment reaches every data source', () => {
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
