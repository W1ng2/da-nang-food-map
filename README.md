# 峴港食旅地圖 PWA

iPhone 優先的峴港餐廳地圖，收錄 Michelin、非 Michelin Google 4.8+、Cafe／甜品、早餐及越式法包。支援分類及文字搜尋、目前位置、餐廳詳情、收藏／已去過、Google Maps／Apple Maps 導航與加入主畫面。

## 本機執行

```bash
npm install
npm run dev
```

## 驗證與建置

```bash
npm test
npm run validate:data
npm run build
```

`scripts/build-data.mjs` 把四組經篩選 CSV 合併為 `public/places.json`。餐廳評分、評論、價錢及營業時間會隨時間改變，出發前應再次核對 Google Maps 及最新菜單。

## 資料與地圖來源

- 餐廳選擇與備註：本 repository 內的 CSV 與稽核檔案
- 底圖：OpenStreetMap contributors
- 座標：OpenStreetMap Nominatim 及 Google Maps 地址／名稱核對
