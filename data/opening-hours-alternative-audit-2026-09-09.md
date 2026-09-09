# 不依賴登入的營業時間補查

歷史批次紀錄；最新結果請看[全面補查](opening-hours-comprehensive-audit-2026-09-09.md)。以下數字不是目前覆蓋率。

核對日期：2026-09-09。此日期是查閱日，不是各網站的更新日。使用者要求改用其他方法後，補充米芝蓮指南及旅遊平台來源；既有官網資料不覆蓋。

## 方法及限制

Google Maps 未登入版只顯示當日時間，未外推至每週；Facebook 限制讀取。米芝蓮部分即時頁面要求 JavaScript／驗證，因此使用公開搜尋工具回傳的完整已索引頁面內容（含地址及七日時間），不是只看短摘要。索引保存時間可能較現在落後，App 明示「非即時店況」。未繞過登入、驗證碼或存取限制。

## 新增完整時間表（5 個）

|地點|分店|時間／來源|
|-|-|-|
|Bún Chả Cá Hờn|113/03 Nguyen Chi Thanh|每日 06:00–21:00，米芝蓮指南；搜尋內容標示上週抓取。|
|Bà Đông|145 Huynh Thuc Khang|每日 06:00–19:00，米芝蓮指南；4 天前抓取。Foodle 時間亦相同。Nova Circle 的自動概述與其自身七日表相衝突，不採其概述凌駕指南。|
|Quán Nhân|83 Phan Tu|每日 08:00–翌日 00:00，米芝蓮指南；2 天前抓取。|
|Bánh Xèo Bà Dưỡng|280/23 Hoang Dieu|每日 09:30–21:30，米芝蓮指南；6 天前抓取。|
|GioiA Gelati|59 An Thuong 2|每日 12:00–23:00，Tripadvisor 已認領商戶頁；完整七日表，平台不是官網。|

以上實際來源連結均保存於 data/opening-hours.json 的 sourceUrl。餐廳狀態是按刊載時間推算，不表示店家即時確認。

## 衝突資料只補說明，不產生開關門狀態

- Mì Quảng 92：同一地址 112A Trần Cao Vân；[Wanderlog](https://wanderlog.com/place/details/7475275/) 列 06:30–20:00；[Tripadvisor](https://www.tripadvisor.com/Restaurant_Review-g298082-d27422211-Reviews-Mi_Qu_ng_92-Hoi_An_Quang_Nam_Province.html) 列 06:00–20:30。
- Firefly：[Tripadvisor](https://www.tripadvisor.com/Restaurant_Review-g298082-d14985756-Reviews-Firefly_restaurant_Bar-Hoi_An_Quang_Nam_Province.html) 列 11:30–21:30；[Wanderlog](https://wanderlog.com/place/details/1279014/firefly-garden--restaurant--bar) 列 11:00–21:30。
- Bánh Xèo 76：[Restaurant Guru](https://restaurantguru.com/Banh-xeo-76-Da-Nang) 及 [Wanderlog](https://wanderlog.com/place/details/7024999/) 列每日 10:00–21:00，但 [Si Dining 餐廳介紹](https://sidiningdanang.com/category/food-and-drink/) 指星期一休息。
- Si Dining：[米芝蓮指南](https://guide.michelin.com/hk/zh_HK/da-nang-region/da-nang_2984390/restaurant/si-dining) 列 17:30–21:30；前批查閱的 [Food Tour Da Nang](https://www.foodtourdanang.vn/en/nha-hang-si-dining?food=77) 列 17:00–21:30。

另查 Nhan's Kitchen、Bếp Hên、Bún Chả Cá 109、Rainbowl：不同平台時間或地址有差異，未填入結構化時間。其餘米芝蓮搜尋多僅回傳名單而非個店時間，不採用名單的開放日篩選數量推算個店時間。

本批後共有 47／196 個地點具完整時間表；149 個仍無可靠的完整時間表。這是部分補充，不代表全面完成。
