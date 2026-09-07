// @vitest-environment node
import { mkdtemp, mkdir, readFile, writeFile, copyFile, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

let fixture
let inputs
beforeEach(async () => {
  fixture = await mkdtemp(join(tmpdir(), 'danang-build-test-'))
  await mkdir(join(fixture, 'scripts'))
  await mkdir(join(fixture, 'data'))
  await mkdir(join(fixture, 'public'))
  await symlink(resolve(import.meta.dirname, '../node_modules'), join(fixture, 'node_modules'))
  await copyFile(resolve(import.meta.dirname, 'build-data.mjs'), join(fixture, 'scripts/build-data.mjs'))
  inputs = {
    'da-nang-michelin-restaurants-hkd.csv': '餐廳名稱,圖標類型,地址\nTest Restaurant,🇻🇳 越南菜,Da Nang\n',
    'da-nang-non-michelin-google-48-map.csv': '餐廳名稱\n',
    'da-nang-cafe-dessert-vetted-map.csv': '店名\n',
    'da-nang-breakfast-banh-mi-vetted-map.csv': '店名\n',
    'data/geocoding-cache.json': '{"Test Restaurant":{"lat":16.06,"lng":108.22,"source":"saved"}}',
    'data/manual-geocodes.json': '{"Test Restaurant":{"lat":16.07,"lng":108.23,"source":"manual"}}',
    'data/google-place-metadata.json': '{}',
    'data/place-enrichment.json': '{}',
    'data/opening-hours.json': '{}',
    'data/attractions.json': '[]',
    'data/hoi-an-places.json': '[]'
  }
  await Promise.all(Object.entries(inputs).map(([path, content]) => writeFile(join(fixture, path), content)))
  await writeFile(join(fixture, 'public/places.json'), 'previous output')
})

afterEach(async () => { await rm(fixture, { recursive: true, force: true }) })

function build() {
  const script = pathToFileURL(join(fixture, 'scripts/build-data.mjs')).href
  return execFileSync(process.execPath, ['--input-type=module', '-e',
    `globalThis.fetch = () => { throw new Error('Network access forbidden in data build') }; await import(${JSON.stringify(script)});`
  ], { encoding: 'utf8', stdio: 'pipe' })
}

describe('saved-data build contract', () => {
  it('builds without network or source mutations, retaining manual coordinates and unknown review counts', async () => {
    build()
    const output = await readFile(join(fixture, 'public/places.json'), 'utf8')
    expect(JSON.parse(output)[0]).toMatchObject({ lat: 16.07, lng: 108.23, geocodeSource: 'manual', reviewCount: null, reviewCountVerifiedAt: '' })
    for (const [path, content] of Object.entries(inputs)) {
      expect(await readFile(join(fixture, path), 'utf8')).toBe(content)
    }
    build()
    expect(await readFile(join(fixture, 'public/places.json'), 'utf8')).toBe(output)
  })

  it('missing coordinates stop the build before replacing the previous output', async () => {
    await writeFile(join(fixture, 'data/geocoding-cache.json'), '{}')
    await writeFile(join(fixture, 'data/manual-geocodes.json'), '{}')
    expect(build).toThrow(/Missing saved coordinates: Test Restaurant/)
    expect(await readFile(join(fixture, 'public/places.json'), 'utf8')).toBe('previous output')
  })

  it('invalid source JSON stops the build instead of silently dropping saved information', async () => {
    await writeFile(join(fixture, 'data/place-enrichment.json'), '{broken')
    expect(build).toThrow(/SyntaxError/)
    expect(await readFile(join(fixture, 'public/places.json'), 'utf8')).toBe('previous output')
  })
})
