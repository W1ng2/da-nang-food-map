import { describe, expect, it } from 'vitest'
import indexHtml from '../index.html?raw'

describe('PWA browser capability contract', () => {
  it('declares both the standard and Apple standalone web app capabilities', () => {
    expect(indexHtml).toContain('<meta name="mobile-web-app-capable" content="yes" />')
    expect(indexHtml).toContain('<meta name="apple-mobile-web-app-capable" content="yes" />')
  })
})
