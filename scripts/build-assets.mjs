import { cp, mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

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

const mapIcons = [
  'banh-beo', 'banh-cuon', 'banh-mi', 'beer', 'bo-ne', 'buffet', 'burger',
  'european', 'gelato', 'india', 'italy', 'korea', 'mango', 'modern-vietnam',
  'noodles', 'patisserie', 'poke', 'rice-chicken', 'rooftop', 'seafood',
  'specialty-coffee', 'steak', 'vietnam-coffee', 'vietnam', 'yogurt-bowl'
]

await Promise.all(mapIcons.map((name) => cp(resolve(root, `map-icon-${name}.svg`), resolve(mapIconDir, `${name}.svg`))))

const collectionColors = {
  cuisine: '#d2672c',
  michelin: '#a72e28',
  'high-rating': '#d2672c',
  'cafe-dessert': '#77583c',
  breakfast: '#cf8d20'
}

async function buildMapPin(name, outputName, color, michelinBadge = false) {
  const icon = await readFile(resolve(root, `map-icon-${name}.svg`))
  const iconData = icon.toString('base64')
  const pin = `
    <svg xmlns="http://www.w3.org/2000/svg" width="74" height="84" viewBox="0 0 74 84">
      <defs>
        <filter id="shadow" x="-25%" y="-20%" width="150%" height="155%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#18352e" flood-opacity="0.28"/>
        </filter>
      </defs>
      <path d="M37 3C18.2 3 3 18.2 3 37c0 23.2 27.5 40.9 34 44 6.5-3.1 34-20.8 34-44C71 18.2 55.8 3 37 3Z" fill="${color}" stroke="#fffaf0" stroke-width="4" filter="url(#shadow)"/>
      <circle cx="37" cy="35" r="24" fill="#fffaf0"/>
      <image href="data:image/svg+xml;base64,${iconData}" x="19" y="17" width="36" height="36" preserveAspectRatio="xMidYMid meet"/>
      ${michelinBadge ? '<circle cx="59" cy="14" r="10" fill="#f2b84b" stroke="#fffaf0" stroke-width="3"/><text x="59" y="18" text-anchor="middle" fill="#653f08" font-family="Arial, sans-serif" font-size="11" font-weight="900">M</text>' : ''}
    </svg>`
  await sharp(Buffer.from(pin)).png().toFile(resolve(mapPinDir, outputName))
}

await Promise.all([
  ...Object.entries(collectionColors).flatMap(([collection, color]) => mapIcons.map((name) =>
    buildMapPin(name, `${collection}-${name}.png`, color)
  )),
  ...mapIcons.map((name) => buildMapPin(name, `cuisine-${name}-michelin.png`, collectionColors.cuisine, true))
])

await cp(resolve(root, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs'), resolve(assetDir, 'maplibre-gl-worker.mjs'))
await cp(resolve(root, 'node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs'), resolve(assetDir, 'maplibre-gl-shared.mjs'))
console.log(`Built app icons, synced ${mapIcons.length} map icons, generated ${mapIcons.length * (Object.keys(collectionColors).length + 1)} WebGL map pins, and bundled the MapLibre worker modules.`)
