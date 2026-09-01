import {
  mdiBaguette,
  mdiBarley,
  mdiBeer,
  mdiBowl,
  mdiBowlMix,
  mdiBuffet,
  mdiChiliHot,
  mdiChiliMedium,
  mdiCoffee,
  mdiCoffeeMaker,
  mdiCupcake,
  mdiEggFried,
  mdiFire,
  mdiFish,
  mdiFoodDrumstick,
  mdiFoodSteak,
  mdiFruitCherries,
  mdiFruitCitrus,
  mdiGlassCocktail,
  mdiGlassWine,
  mdiGrill,
  mdiHamburger,
  mdiIceCream,
  mdiKnife,
  mdiLeaf,
  mdiNoodles,
  mdiPizza,
  mdiPotSteam,
  mdiRice,
  mdiSausage,
  mdiShimmer,
  mdiSilverwareFork,
  mdiSilverwareForkKnife,
  mdiSilverwareVariant,
  mdiSprout,
  mdiWater,
  mdiWeatherSunsetUp
} from '@mdi/js'

export const MAP_ICON_COLORS = {
  green: '#123f34',
  ivory: '#fff8e8',
  coral: '#e85b3f',
  gold: '#d89b2b'
}

export const MAP_ICON_SPECS = {
  'banh-beo': { main: mdiBowl, accent: mdiShimmer, accentColor: 'gold' },
  'banh-cuon': { main: mdiSausage, accent: mdiSilverwareFork, accentColor: 'gold' },
  'banh-mi': { main: mdiBaguette, accent: mdiLeaf, accentColor: 'coral' },
  beer: { main: mdiBeer, accent: mdiBarley, accentColor: 'gold' },
  'bo-ne': { main: mdiEggFried, accent: mdiFire, accentColor: 'coral' },
  buffet: { main: mdiBuffet, accent: mdiSilverwareVariant, accentColor: 'gold' },
  burger: { main: mdiHamburger, accent: mdiLeaf, accentColor: 'coral' },
  european: { main: mdiSilverwareForkKnife, accent: mdiGlassWine, accentColor: 'gold' },
  gelato: { main: mdiIceCream, accent: mdiShimmer, accentColor: 'coral' },
  india: { main: mdiPotSteam, accent: mdiChiliHot, accentColor: 'gold' },
  italy: { main: mdiPizza, accent: mdiLeaf, accentColor: 'coral' },
  korea: { main: mdiGrill, accent: mdiFire, accentColor: 'coral' },
  mango: { main: mdiFruitCitrus, accent: mdiLeaf, accentColor: 'gold' },
  'modern-vietnam': { main: mdiSilverwareForkKnife, accent: mdiShimmer, accentColor: 'coral' },
  noodles: { main: mdiNoodles, accent: mdiChiliMedium, accentColor: 'coral' },
  patisserie: { main: mdiCupcake, accent: mdiShimmer, accentColor: 'gold' },
  poke: { main: mdiBowlMix, accent: mdiSprout, accentColor: 'coral' },
  'rice-chicken': { main: mdiRice, accent: mdiFoodDrumstick, accentColor: 'coral' },
  rooftop: { main: mdiWeatherSunsetUp, accent: mdiGlassCocktail, accentColor: 'gold' },
  seafood: { main: mdiFish, accent: mdiWater, accentColor: 'coral' },
  'specialty-coffee': { main: mdiCoffee, accent: mdiSprout, accentColor: 'gold' },
  steak: { main: mdiFoodSteak, accent: mdiKnife, accentColor: 'coral' },
  'vietnam-coffee': { main: mdiCoffeeMaker, accent: mdiWater, accentColor: 'gold' },
  vietnam: { main: mdiBowlMix, accent: mdiLeaf, accentColor: 'coral' },
  'yogurt-bowl': { main: mdiBowlMix, accent: mdiFruitCherries, accentColor: 'gold' }
}

export const MAP_ICON_NAMES = Object.freeze(Object.keys(MAP_ICON_SPECS))

export function renderMapIconSvg(name) {
  const spec = MAP_ICON_SPECS[name]
  if (!spec) throw new Error(`Unknown map icon: ${name}`)
  const accent = MAP_ICON_COLORS[spec.accentColor]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img">
  <metadata>Visual system based on selected ImageGen direction; pictograms from Material Design Icons (Apache-2.0).</metadata>
  <circle cx="48" cy="48" r="44" fill="${MAP_ICON_COLORS.green}"/>
  <g transform="translate(16 16) scale(2.6666667)" fill="${MAP_ICON_COLORS.ivory}"><path d="${spec.main}"/></g>
  <g transform="translate(54 54) scale(.9)" fill="${accent}" stroke="${MAP_ICON_COLORS.green}" stroke-width="1" paint-order="stroke"><path d="${spec.accent}"/></g>
</svg>
`
}
