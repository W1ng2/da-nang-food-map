import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { MAP_ICON_COLORS, MAP_ICON_NAMES, renderMapIconSvg } from './map-icon-system.mjs'

const root = resolve(import.meta.dirname, '..')
const publicDir = resolve(root, 'public')
const iconDir = resolve(publicDir, 'icons')
const mapIconDir = resolve(publicDir, 'map-icons')
const mapPinDir = resolve(publicDir, 'map-pins')
const assetDir = resolve(publicDir, 'assets')

await mkdir(iconDir, { recursive: true })
await mkdir(mapIconDir, { recursive: true })
await mkdir(mapPinDir, { recursive: true })
await mkdir(assetDir, { recursive: true })

const source = resolve(publicDir, 'app-icon.svg')
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['icon-maskable-512.png', 512], ['../apple-touch-icon.png', 180]]) {
  await sharp(source).resize(size, size).png().toFile(resolve(iconDir, name))
}

await Promise.all(MAP_ICON_NAMES.map((name) => writeFile(resolve(mapIconDir, `${name}.svg`), renderMapIconSvg(name))))

async function buildMapPin(name, outputName, color, michelinBadge = false, grayscale = false) {
  const icon = await readFile(resolve(mapIconDir, `${name}.svg`))
  const iconData = icon.toString('base64')
  const pin = `
    <svg xmlns="http://www.w3.org/2000/svg" width="74" height="84" viewBox="0 0 74 84">
      <defs>
        <filter id="shadow" x="-25%" y="-20%" width="150%" height="155%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#18352e" flood-opacity="0.28"/>
        </filter>
      </defs>
      <path d="M37 3C18.2 3 3 18.2 3 37c0 23.2 27.5 40.9 34 44 6.5-3.1 34-20.8 34-44C71 18.2 55.8 3 37 3Z" fill="${color}" stroke="#fffaf0" stroke-width="4" filter="url(#shadow)"/>
      <image href="data:image/svg+xml;base64,${iconData}" x="12" y="10" width="50" height="50" preserveAspectRatio="xMidYMid meet"/>
      ${michelinBadge ? '<circle cx="59" cy="14" r="10" fill="#f2b84b" stroke="#fffaf0" stroke-width="3"/><text x="59" y="18" text-anchor="middle" fill="#653f08" font-family="Arial, sans-serif" font-size="11" font-weight="900">M</text>' : ''}
    </svg>`
  const pipeline = sharp(Buffer.from(pin))
  if (grayscale) pipeline.grayscale()
  await pipeline.png().toFile(resolve(mapPinDir, outputName))
}

await Promise.all([
  ...MAP_ICON_NAMES.map((name) => buildMapPin(name, `cuisine-${name}.png`, MAP_ICON_COLORS.green)),
  ...MAP_ICON_NAMES.map((name) => buildMapPin(name, `cuisine-${name}-michelin.png`, MAP_ICON_COLORS.green, true)),
  ...MAP_ICON_NAMES.map((name) => buildMapPin(name, `cuisine-${name}-closed.png`, MAP_ICON_COLORS.green, false, true)),
  ...MAP_ICON_NAMES.map((name) => buildMapPin(name, `cuisine-${name}-michelin-closed.png`, MAP_ICON_COLORS.green, true, true))
])

await cp(resolve(root, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs'), resolve(assetDir, 'maplibre-gl-worker.mjs'))
await cp(resolve(root, 'node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs'), resolve(assetDir, 'maplibre-gl-shared.mjs'))
console.log(`Built app icons, generated ${MAP_ICON_NAMES.length} map icons and ${MAP_ICON_NAMES.length * 4} WebGL map pins, and bundled the MapLibre worker modules.`)
