import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '..')
const publicDir = resolve(root, 'public')
const iconDir = resolve(publicDir, 'icons')
const mapIconDir = resolve(publicDir, 'map-icons')
const assetDir = resolve(publicDir, 'assets')

await mkdir(iconDir, { recursive: true })
await mkdir(mapIconDir, { recursive: true })
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
await cp(resolve(root, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs'), resolve(assetDir, 'maplibre-gl-worker.mjs'))
console.log(`Built app icons, synced ${mapIcons.length} map icons, and bundled the MapLibre worker.`)
