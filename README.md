# 峴港食旅地圖 PWA

iPhone 優先的峴港餐廳地圖，收錄 Michelin、非 Michelin Google 4.8+、Cafe／甜品、早餐及越式法包。支援地圖聚合、分類及條件篩選、目前位置、餐廳相片與詳情、官方訂座、收藏／已去過、Google Maps／Apple Maps 導航與加入主畫面。

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

餐廳相片、官方訂座及聯絡資料集中在 `data/place-enrichment.json`。相片只用於到場辨認：街舖顯示門面／招牌，樓上餐廳顯示所屬大廈入口及樓層提示。加入新相片前請依照 `CONTRIBUTING_PHOTOS.md` 核對分店、現址、出處及使用權；沒有可靠到場相片的餐廳會保留精準菜式圖標。營業時間另記來源網址及核對日期，詳情頁可直接打開來源複核。

## 資料與地圖來源

- 餐廳選擇與備註：本 repository 內的 CSV 與稽核檔案
- 底圖：OpenStreetMap contributors
- 座標：OpenStreetMap Nominatim 及 Google Maps 地址／名稱核對
- 到場相片：餐廳門面，或酒店／商場入口；介面內逐張標示用途、辨認提示及來源
