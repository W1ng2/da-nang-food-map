# 會安擴充核對紀錄

核對日期：2026-09-07。新增 3 間餐廳、5 個景點；不是全會安餐廳普查，沒有更改任何訂位。

## 餐廳篩選與限制

沿用非米芝蓮 Google ≥4.8、Google 評論 ≥500、排除純素食店及具體優惠換評風險。Cafe／甜品及早餐原有規則未更改；這批未新增 Cafe。

Google Maps 可直接看到評分、現址、電話及座標，但顯示「目前只顯示部分內容」，未提供評論總數或完整評論搜尋。評論數採 Restaurant Guru 明確標註 Google 的轉載快照，並以 Wanderlog 交叉核對門檻；App 詳情卡明示來源及限制。核對日期不等於第三方更新日期。

|餐廳|Google 頁面評分|Google 評論轉載快照|現址及來源|
|-|-|-|-|
|Nhan’s Kitchen|4.9|5,783|167 Trần Nhân Tông；[評論來源](https://restaurantguru.com/Nhans-Kitchen-tp-Hoi-An)、[交叉核對](https://wanderlog.com/place/details/1089204/nhans-kitchen)|
|Firefly Restaurant & Bar|4.9|2,820|178 Trần Nhân Tông；[評論來源](https://restaurantguru.com/FireFly-Restaurant-and-Bar-tp-Hoi-An)、[交叉核對](https://wanderlog.com/place/details/1279014/firefly-restaurant--bar)|
|Mate Restaurant and Coffee|5.0|2,400|Hẻm 120 Trần Nhân Tông；[評論來源](https://restaurantguru.com/Mate-Coffee-And-Restaurant-tp-Hoi-An)、[交叉核對](https://wanderlog.com/place/details/1089192/mate-restaurant-and-coffee)、[官方菜單](https://www.materes.com/)|

Mate 採 Google Maps 現址，明示部分第三方仍列 Âu Cơ／Cửa Đại 舊址。官網有雞、牛、豬、蝦；有素食菜單不等於純素食店。

各店搜尋店名搭配 `discount / free / in exchange / review` 並閱讀公開評論摘錄，未見三店優惠換評具體證據；不是全量審核或保證無誘評。一般招待水果不能自行當成換評證據。

Purple Lantern 本次不加入：[旅客描述紀念品換評論](https://www.reddit.com/r/VietNam/comments/1lrlwlk/)。屬未獨立證實的旅客報告，依使用者保守排除偏好處理，不是斷言造假。同文對 Mate 只是因高分而懷疑，沒有此店優惠換評的具體經歷，不混為證據。

三間餐廳尚未取得可確認現址的門面照，保留 `photo: null`，不使用食物照、舊址照或生成圖片。完整官方營業時間未確認，保留 `schedule: null`，不推測即時開關門狀態。人均是預算估算，不是套餐報價；HKD 按 HK$1 ≈ 3,300 VND 概算，非即時匯率。

## 景點資料與圖片

|景點|來源與注意事項|
|-|-|
|會安古城|[越南旅遊局](https://vietnam.travel/places-to-go/central-vietnam/hoi-an)、[古城管理單位聯票參考](https://www.hoianworldheritage.org.vn/en/news/Hoi-An-Travel/hoi-an-diversifies-tourism-products-892.hwh)。定位為西側步行參考點，不是單一入口；120,000 VND 聯票及涵蓋項目現場再核對。|
|日本橋|[越南旅遊局](https://vietnam.travel/places-to-go/central-vietnam/hoi-an)。Google Maps Chùa Cầu 座標；照片攝於 2018 年，已提示修復後外觀可能不同。|
|安邦沙灘|[越南旅遊局](https://vietnam.travel/places-to-go/central-vietnam/hoi-an)。Google Maps 主要遊客區定位；照片不是即時海況，不保證游泳安全。|
|Precious Heritage|[官網](https://www.rehahnphotographer.com/precious-heritage-museum/)。免費；官網同頁列 08:00–20:00 與 08:00–18:00，明示矛盾，暫不計算營業狀態。|
|VinWonders Nam Hội An|[官網](https://vinwonders.com/en/vinwonders-nam-hoi-an/)、[2026 票價](https://vinwonders.com/en/offers/vinwonders-nam-hoi-an-ticket-prices/)。成人標準票 650,000 VND；各區時段不同，出發前再核對。|

五張景點照片來自 Wikimedia Commons，逐張檢視實景；作者、來源及 CC 授權記在 `data/hoi-an-places.json`。本地照片 `public/landmark-images/`、小圖標 `data/landmark-markers/`。建置只讀存檔，不進行網絡查詢或自動選圖。日本橋、VinWonders 都註明是舊照片；博物館圖片為展覽實景，不冒充入口照。

## 酒店與行程

酒店座標 `15.9206981,108.3259055` 由[官方聯絡頁](https://wyndhamroyalhoian.com/contact/)的 Google Maps 短連結解析取得，是地點座標，不是 iframe 視野中心。酒店獨立 WebGL source，不受菜式／景點篩選影響。

9/4–9/9 沿用使用者行程。只有 9/6 19:30 Pizza 4P’s 標記使用者已確認；MỘC、Spa、門票等不擅自標記已預訂。Pizza 目前收錄 74 Bạch Đằng，提醒以確認信分店為準。沒有聯絡店舖、提交訂位或更改訂位監察自動化。
