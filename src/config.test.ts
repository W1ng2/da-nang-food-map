import { describe, expect, it } from 'vitest'
import { MAP_ART_ASSET_REVISION, mapIconAssetPath, mapPinAssetPath } from './config'

describe('map art asset cache contract', () => {
  it('versions SVG and PNG URLs so a deployed redesign replaces cached artwork', () => {
    expect(MAP_ART_ASSET_REVISION).toBe('icons-v2')
    expect(mapIconAssetPath('vietnam')).toBe('map-icons/vietnam.svg?v=icons-v2')
    expect(mapPinAssetPath('cuisine-vietnam')).toBe('map-pins/cuisine-vietnam.png?v=icons-v2')
  })
})
