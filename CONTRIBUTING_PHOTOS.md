# 餐廳相片加入指引

相片的唯一用途是協助旅途中認出正確門面、入口、樓層或招牌；不要使用生成圖片、純食物、室內氣氛照或無法確認分店的相片。街舖必須使用門面；位於酒店／商場內的餐廳，則使用所屬大廈入口並寫明樓層。

## 同事自行拍攝或已獲授權的相片

1. 把相片裁成橫向 3:2，建議寬度 1200–1600 px、WebP 或 JPEG、檔案小於 500 KB。
2. 放進 `public/restaurant-images/`，以餐廳 ID 命名，例如 `high-rating-pizza-4p-s.webp`。
3. 在 `data/place-enrichment.json` 對應餐廳加入 `photo`：

```json
{
  "url": "restaurant-images/high-rating-pizza-4p-s.webp",
  "alt": "可辨認門面、招牌及入口位置的客觀描述",
  "kind": "storefront",
  "arrivalNote": "由哪個入口進入，以及需要留意的招牌或樓層",
  "credit": "攝影者姓名",
  "sourceUrl": "https://可核對來源的網址",
  "rightsNotice": "攝影者授權本旅遊地圖使用"
}
```

4. 執行 `npm run data:build && npm run validate:data && npm test && npm run build`。

## 餐廳官方網站相片

優先填入官方網站直接公開的相片 URL，並同時填寫官方頁面、出處及權利聲明。App 不會把這類相片下載或加入離線快取；網站撤下相片時會自動失效。不要使用 `googleusercontent.com`、Instagram 或其他會過期的直接網址。

若官方網站沒有現址門面，可使用可公開索引、能回到原頁的第三方實景相片，但必須逐項核對現址、店名／舊名及拍攝時間，並如實標示作者、平台與權利狀態。無法確認時不要加入；不要以室內照冒充門面照。

若同時補充營業時間，請加入 `hoursSourceUrl` 及 `enrichmentVerifiedAt`（`YYYY-MM-DD`）。營業時間必須來自餐廳官方網站；只有餐廳未設官網時，才使用可識別主管機構的旅遊網站。若無法確認分店或更新日期，寧可留空。
