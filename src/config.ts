import type { CollectionId } from './types'

export const COLLECTIONS: Record<CollectionId, { label: string; shortLabel: string; icon: string; color: string }> = {
  michelin: { label: 'Michelin 推薦', shortLabel: 'Michelin', icon: '✦', color: '#a72e28' },
  'high-rating': { label: '非 Michelin · Google 4.8+', shortLabel: 'Google 4.8+', icon: '★', color: '#d2672c' },
  'cafe-dessert': { label: 'Cafe／甜品', shortLabel: 'Cafe 甜品', icon: '☕', color: '#77583c' },
  breakfast: { label: '早餐／越式法包', shortLabel: '早餐越包', icon: '☀', color: '#cf8d20' }
}

export const MAP_ICON_FILES: Record<string, string> = {
  '🇫🇷 法國／歐洲餐': 'european',
  '🇮🇹 意大利現代菜': 'italy',
  '🇮🇹 意大利菜': 'italy',
  '🍚 雞飯／米飯': 'rice-chicken',
  '🍜 麵食／街頭小吃': 'noodles',
  '🍽️ 越南菜': 'vietnam',
  '🇻🇳 越南菜': 'vietnam',
  '✨ 越南現代料理': 'modern-vietnam',
  '🥘 印度菜': 'india',
  '🇮🇳 印度菜': 'india',
  '🇰🇷 韓式燒肉': 'korea',
  '🥩 牛扒': 'steak',
  '🥩 牛扒／扒房': 'steak',
  '🦐 海鮮': 'seafood',
  '🌇 Rooftop／景觀餐廳': 'rooftop',
  '🌺 Poke／健康碗': 'poke',
  '🍔 漢堡': 'burger',
  '🍱 自助餐': 'buffet',
  '🍺 精釀啤酒': 'beer',
  '☕ 精品咖啡': 'specialty-coffee',
  '🇻🇳 越南咖啡': 'vietnam-coffee',
  '🍨 Gelato／雪糕': 'gelato',
  '🍰 法式甜點／烘焙': 'patisserie',
  '🥭 水果／本地甜品': 'mango',
  '🍚 越式早餐｜Xôi gà': 'rice-chicken',
  '🍳 越式早餐｜Bò né': 'bo-ne',
  '🟠 越式早餐｜Bánh bèo': 'banh-beo',
  '🥖 Bánh mì 越式法包': 'banh-mi',
  '🥢 越式早餐｜Bánh cuốn': 'banh-cuon',
  '🥣 燕麥／乳酪早餐碗': 'yogurt-bowl'
}
