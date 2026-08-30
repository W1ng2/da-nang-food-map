# 餐廳相片加入指引

相片的用途是協助旅途中認出正確門面、入口、樓層或招牌；不要使用生成圖片、純食物示意圖或無法確認分店的相片。

## 同事自行拍攝或已獲授權的相片

1. 把相片裁成橫向 3:2，建議寬度 1200–1600 px、WebP 或 JPEG、檔案小於 500 KB。
2. 放進 `public/restaurant-images/`，以餐廳 ID 命名，例如 `high-rating-pizza-4p-s.webp`。
3. 在 `data/place-enrichment.json` 對應餐廳加入 `photo`：

```json
{
  "url": "restaurant-images/high-rating-pizza-4p-s.webp",
  "alt": "可辨認門面、招牌及入口位置的客觀描述",
  "credit": "攝影者姓名",
  "sourceUrl": "https://可核對來源的網址",
  "rightsNotice": "攝影者授權本旅遊地圖使用"
}
```

4. 執行 `npm run data:build && npm run validate:data && npm test && npm run build`。

## 餐廳官方網站相片

只可填入官方網站直接公開的相片 URL，必須同時填寫官方頁面、出處及權利聲明。App 不會把這類相片下載或加入離線快取；網站撤下相片時會自動失效。不要使用 Google Maps、Instagram 或其他用戶上載相片的直接網址。
