# 峴港・會安慢遊地圖 PWA

新增會安區域、北向重設、獨立酒店標記及 9/4–9/9 行程頁。首頁以料理大類再選細分類；米芝蓮只作推薦標記。詳情卡優先展示實景、開放狀態、HKD 預算與導航。重設方向不更改地圖中心及縮放，仍使用 WebGL 圖標避免拖曳延遲。

目前 196 個地點（185 間餐飲地點、11 個景點）。會安共 88 間餐飲地點和 5 個景點：85 間依類別門檻收錄（餐廳 Google ≥4.8／≥500 則、Cafe／甜品 ≥4.8／≥300 則），另 3 間沿用已公開理由的「編輯精選」例外。228 個候選都有收錄、排除、數值不足或待核實決定，但不是 Google Maps 全量普查。來源與誘評抽查限制見 [HOI_AN_DATA_AUDIT.md](HOI_AN_DATA_AUDIT.md)。Google 現頁評分與評論數轉載快照分開處理；後者不是即時數字。會安餐廳門面照仍待確認，營業時間不完整或互相矛盾時不猜測開關門。行程只將使用者確認的 Pizza 4P’s 訂位標記為已預訂，不會自動訂位。

iPhone 優先的峴港食旅地圖。餐廳按越南菜、海鮮、早餐、咖啡甜品及各國菜式直接分類；Michelin 是額外推薦識別，不會限制搜尋結果。景點以獨立模式及實景照片圖標顯示，與餐廳 pin 清楚分開。另支援越南時區營業狀態、地圖聚合、距離／預算條件、目前位置、相片詳情、官方訂座、收藏／已去過、Google Maps／Apple Maps 導航與加入主畫面。

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

`scripts/build-data.mjs` 把四組经篩選 CSV、`data/opening-hours.json`、`data/attractions.json` 及 `data/hoi-an-places.json` 合併為 `public/places.json`。會安景點圖標來自已保存的 `data/landmark-markers/`。餐廳評分、評論、價錢及營業時間會隨時間改變，出發前應再次核對 Google Maps 及最新菜單。只有已結構化並標明來源／核對日期的時間才會判斷營業狀態；未知時間不會被誤判為關門。

建置只讀取已保存的資料，不會連網抓取評論、猜測分店座標或改寫來源檔案。新增餐廳前，請先核對分店並在 `data/manual-geocodes.json` 保存座標；缺少座標或 JSON 檔案損壞會停止建置，保留上次輸出。營業狀態依已收錄時間推算，不代表餐廳即時回報。訂座建議以詳情頁的原文為準；Apple Maps 由使用者選擇交通方式。

餐廳相片、官方訂座及聯絡資料集中在 `data/place-enrichment.json`。相片只用於到場辨認：街舖顯示門面／招牌，樓上餐廳顯示所屬大廈入口及樓層提示。加入新相片前請依照 `CONTRIBUTING_PHOTOS.md` 核對分店、現址、出處及使用權；沒有可靠到場相片的餐廳會保留精準菜式圖標。營業時間另記來源網址及核對日期，詳情頁可直接打開來源複核。

## 資料與地圖來源

- 餐廳選擇與備註：本 repository 內的 CSV 與稽核檔案
- 底圖：OpenStreetMap contributors
- 座標：OpenStreetMap Nominatim 及 Google Maps 地址／名稱核對
- 到場相片：餐廳門面，或酒店／商場入口；介面內逐張標示用途、辨認提示及來源
