export const MAP_ART_ASSET_REVISION = 'icons-v2'

export function mapIconAssetPath(iconFile: string) {
  return `map-icons/${iconFile}.svg?v=${MAP_ART_ASSET_REVISION}`
}

export function mapPinAssetPath(filename: string) {
  return `map-pins/${filename}.png?v=${MAP_ART_ASSET_REVISION}`
}

export const MAP_ICON_FILES: Record<string, string> = {
  '🇫🇷 法國／歐洲餐': 'european',
  '🇬🇷 希臘菜': 'european',
  '🇪🇸 西班牙菜': 'european',
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

export const CUISINE_ORDER = [
  '越南菜', '越南現代料理', '麵食／街頭小吃', '雞飯／米飯', '海鮮',
  'Bánh mì 越式法包', '越式早餐｜Xôi gà', '越式早餐｜Bò né',
  '越式早餐｜Bánh cuốn', '越式早餐｜Bánh bèo', '燕麥／乳酪早餐碗',
  '精品咖啡', '越南咖啡', 'Gelato／雪糕', '法式甜點／烘焙', '水果／本地甜品',
  '印度菜', '意大利菜', '意大利現代菜', '法國／歐洲餐', '希臘菜', '西班牙菜', '韓式燒肉',
  '牛扒／扒房', '牛扒', 'Poke／健康碗', '漢堡', '自助餐', '精釀啤酒',
  'Rooftop／景觀餐廳'
] as const

export const ATTRACTION_ORDER = [
  '城市地標', '自然／宗教', '寺廟／景觀', '海灘', '博物館', '建築／宗教'
] as const
