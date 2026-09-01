import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { MAP_ICON_COLORS, MAP_ICON_NAMES, MAP_ICON_SPECS, renderMapIconSvg } from './map-icon-system.mjs'

describe('selected ImageGen map icon system', () => {
  it('covers all 25 cuisine assets with one coherent vector contract', () => {
    expect(MAP_ICON_NAMES).toHaveLength(25)
    expect(new Set(MAP_ICON_NAMES).size).toBe(25)
    expect(Object.keys(MAP_ICON_SPECS)).toEqual(MAP_ICON_NAMES)
  })

  it('uses the selected deep-green, ivory and one-warm-accent visual system', () => {
    for (const name of MAP_ICON_NAMES) {
      const svg = renderMapIconSvg(name)
      expect(svg).toContain('viewBox="0 0 96 96"')
      expect(svg).toContain(MAP_ICON_COLORS.green)
      expect(svg).toContain(MAP_ICON_COLORS.ivory)
      expect([svg.includes(MAP_ICON_COLORS.coral), svg.includes(MAP_ICON_COLORS.gold)]).toContain(true)
      expect(svg).not.toMatch(/<text|🇻🇳|🇮🇳|🇮🇹|🇫🇷|🇰🇷/u)
    }
  })

  it('rejects unknown icon names instead of silently showing the wrong cuisine', () => {
    expect(() => renderMapIconSvg('unknown')).toThrow('Unknown map icon: unknown')
  })

  it('covers every icon name used by the app configuration', async () => {
    const config = await readFile(resolve(process.cwd(), 'src/config.ts'), 'utf8')
    const mapBlock = config.match(/MAP_ICON_FILES:[\s\S]*?= \{([\s\S]*?)\n\}/)?.[1]
    expect(mapBlock).toBeTruthy()
    const configuredNames = [...mapBlock.matchAll(/: '([^']+)'/g)].map((match) => match[1])
    expect([...new Set(configuredNames)].sort()).toEqual([...MAP_ICON_NAMES].sort())
  })
})
