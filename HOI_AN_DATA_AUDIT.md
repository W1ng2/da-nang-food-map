# 會安擴充核對紀錄

## 全面補查與修正：2026-09-07（目前版本）

本輪補入 **71 間**，會安現有 **88 間餐飲地點及 5 個景點**；全 App **196 個地點（185 間餐飲地點、11 個景點）**。原有 3 間編輯精選例外保留，其餘 85 間按所屬類別門檻。此節取代下方早期批次的現況數字；下方保留歷史查核記錄。

### 覆蓋範圍及修正原因

- 舊做法只列小量精選，沒有完整候選處理清單，因而漏掉 Mì Quảng 92 等符合條件店。新增凍結的 203 筆目錄、目錄外搜尋結果，合併同店別名後共 **228 個候選**；88 收錄、119 數值不足、11 排除、10 待核實。
- 另查 Google Maps 的範圍包含 77 筆高分候選、24 筆 4.7 分高評論量候選，以及目錄全部 23 筆缺少 Google 數字的候選。低分低量其餘項目仍是目錄快照判斷，並非 228 店均取得即時完整評論；不能宣稱涵蓋 Google Maps 全部商家。
- 缺少 Google 數字不等於低分。補查後新增 Êm、A6 Garden、Bikini Bottom、Ngon Phố Hội、Anabas、Vietnamese Chopsticks；Thìa Gỗ、MẸT 7、Mộc Garden 同店別名合併，避免重複計算。
- Hoshigami 現頁 4.7，不沿用較高舊分；Passion 現頁營業，不因舊目錄標示關閉而漏收。Mr. Son、Red Dragon 現頁升至 4.8，納入。
- 餐廳 Google ≥4.8／≥500；真正 Cafe／甜品 Google ≥4.8／≥300；健康早餐保留菜單確認。名字有 Cafe 不自動放寬餐廳門檻。Nourish、Ellie 有肉類選項，不因主打健康而誤判純素。
- 所有新地點附菜色、VND／HKD 人均預算、地址、座標及可追溯來源。HKD 為 HK$1 ≈ 3,300 VND 的既有預算換算，不是即時報價。新店沒有可靠門面照便保持空白；只有 Nourish 取得完整官方時段（週二至週日 09:00–16:00、週一休息），其餘未知時間不推算打烊。
- 抽查公開用餐評論及店名搭配 discount／free／review 搜尋。Purple Lantern 的紀念品換評報告、Sampan 的好評換 8% 折扣報告按保守偏好排除；均是未獨立證實的旅客描述，不等同判定店方造假，也不保證其餘店沒有誘評。一般水果招待、Happy Hour、投訴退款不視作換評證據。

資料帳本：[候選逐項決定](data/hoi-an-screening.json)、[發現目錄快照](data/hoi-an-discovery-snapshot.json)。目錄改編自 [RestaurantsHoiAn.com](https://restaurantshoian.com/data)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；只保留必要欄位，現頁評分／地址另查，詳情頁保留來源及授權。轉載評論數不是即時總數，2026-09-07 是核對日，不冒充來源更新日。

### 本輪新增

|餐廳|現頁分數|Google 評論數紀錄／快照|菜式及數量來源|
|-|-|-|-|
|Red Bean Hoi An|5|1,699|越南菜；[數量](https://www.google.com/maps/place/Red+Bean+Hoi+An/@15.8799905,108.3163563,17z/data=!3m1!4b1!4m6!3m5!1s0x31420f67ba58d479:0xff793fb1dc531d88!8m2!3d15.8799905!4d108.3163563!16s%2Fg%2F11ft0lp37v)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d9750905-Reviews-Red_Bean_Restaurant-Hoi_An_Quang_Nam_Province.html)|
|The Temple Restaurant & Lounge|5|704|法國／歐洲餐；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://lasiestaresorts.com/wp-content/uploads/2025/11/MENU-ALACARTE-THE-TEMPLE.pdf-2_compressed.pdf)|
|Tuan Restaurant & Cafe|4.9|5,562|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d9748200-Reviews-Restaurant_Cafe_Tu_n-Hoi_An_Quang_Nam_Province.html)|
|Faifoo Central Restaurant|4.9|2,256|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://faifoocentralrestaurant.com/wp-content/uploads/2024/09/FAIFOO-MENU-IN-ENGLISH-.pdf)|
|Phan Gia Riverside Restaurant|4.9|1,700|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d17287969-Reviews-Phan_Gia-Hoi_An_Quang_Nam_Province.html)|
|Cua Dai Central Restaurant & Cooking Class|4.9|1,071|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.co.uk/Restaurant_Review-g298082-d25105784-Reviews-Cua_Dai_Central_Restaurant-Hoi_An_Quang_Nam_Province.html)|
|Le Petit Bistro Hội An|4.9|1,103|法國／歐洲餐；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d23742916-Reviews-Le_Petit_Bistro_Hoi_An-Hoi_An_Quang_Nam_Province.html)|
|Silent Garden Hội An|4.9|1,171|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d14927502-Reviews-Silent_Garden_Restaurant-Hoi_An_Quang_Nam_Province.html)|
|Breeze Restaurant & Basket Boat|5|733|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d14981852-Reviews-Breeze_Restaurant_and_Basket_Boat-Hoi_An_Quang_Nam_Province.html)|
|Grandma Kitchen - Hoi An|4.8|1,218|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://es.restaurantguru.com/Grandma-Kitchen-Hoi-An-tp-Hoi-An/menu)|
|Hoi An Heart Restaurants - Vietnamese cuisine & Vegetarian|4.9|3,025|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://hoianheartrestaurant.com/menus/)|
|Circle Hoi An Restaurant ／ Burgers, Mexican and Vietnamese food by Circle|4.9|1,163|漢堡；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d8075317-Reviews-Circle-Hoi_An_Quang_Nam_Province.html)|
|Baba's Kitchen|4.8|6,946|印度菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g25379304-d10189667-Reviews-Baba_s_Kitchen_Hoi_An-Minh_An_Hoi_An_Quang_Nam_Province.html)|
|Restaurant JAN ( Local food )|4.9|1,029|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com.vn/Restaurant_Review-g298082-d25376153-Reviews-JAN_Restaurant_Local_Food-Hoi_An_Quang_Nam_Province.html)|
|Phi banh mi|4.8|3,077|Bánh mì 越式法包；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://wanderlog.com/place/details/459400/phi-banh-mi)|
|nourish eatery. / Café & Restaurant|4.9|1,718|燕麥／乳酪早餐碗；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://nourisheatery.com/menu/)|
|Hi Restaurant|4.9|534|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://goodmorning-hoian.com/meilleurs-restaurants-hoi-an/)|
|LA BURGER HOIAN|4.9|1,957|漢堡；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d25430111-Reviews-La_Burger_Hoi_An-Hoi_An_Quang_Nam_Province.html)|
|HOME Hoi An|4.8|2,964|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.co.uk/Restaurant_Review-g298082-d25223043-Reviews-Home_Hoi_An_Home_Vietnamese_Restaurant-Hoi_An_Quang_Nam_Province.html)|
|LENCO CAFE & BAR|4.9|958|越南咖啡；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://wanderlog.com/place/details/5669748)|
|Little Flower Restaurant|4.8|743|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://restaurantguru.com/Zalo-Restaurant-and-Coffee-tp-Hoi-An)|
|Claypot Hoi An|4.8|648|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://wanderlog.com/place/details/2624410/claypot)|
|The Boat Riverside Restaurant & Bar|5|938|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d32747217-Reviews-The_Boat_Restaurants_Riverside-Hoi_An_Quang_Nam_Province.html)|
|Cabanon|4.8|721|法國／歐洲餐；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d11707159-Reviews-Le_Cabanon_Hoi_An-Hoi_An_Quang_Nam_Province.html)|
|Blue Sea Hoi An Restaurants|4.9|571|海鮮；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d19041739-Reviews-Blue_Sea_Hoi_An_Restaurant-Hoi_An_Quang_Nam_Province.html)|
|NOODLE House by STREETS (A hospitality & tourism social enterprise initiative) - Local Noodles, Rice & Clay Pot Cuisines|4.9|1,069|麵食／街頭小吃；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.streetsinternational.org/visit-us)|
|Restaurant 328|4.8|869|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://restaurantguru.com/Restaurant-328-tp-Hoi-An)|
|Bánh Mì Sum|4.8|1,027|Bánh mì 越式法包；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d8106913-Reviews-Banh_Mi_Sum-Hoi_An_Quang_Nam_Province.html)|
|Mr Hoà's Kitchen restaurant ( Home made PIZZA) , PASTA and Vietnamese food )|4.9|635|意大利菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d24175744-Reviews-Mr_Hoa_s_Kitchen_Restaurant-Hoi_An_Quang_Nam_Province.html)|
|Passion Restaurant & Bar (An Bang Beach Hoi An)|4.9|509|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d12617218-Reviews-Passion_Restaurant_Bar-Hoi_An_Quang_Nam_Province.html)|
|Greek Souvlaki Hội An - Nhà hàng ẩm thực Hy Lạp|4.8|2,420|希臘菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d11668353-Reviews-Greek_Souvlaki-Hoi_An_Quang_Nam_Province.html)|
|MAAZI Hoi An|4.8|2,564|印度菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.co.uk/Restaurant_Review-g298082-d25420069-Reviews-MAAZI_Hoi_An-Hoi_An_Quang_Nam_Province.html)|
|The Son Bistro – Vietnamese Restaurant, Craft Beer & Bar|4.8|1,619|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://restaurantguru.com/The-Son-Bistro-Hoi-An-OldTown-tp-Hoi-An)|
|IBERICO - TAPAS y VINO Hoi An|4.9|657|西班牙菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.weareiberico.com/)|
|Búp café|4.8|584|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://restaurantguru.com/Bup-Cafe-tp-Hoi-An)|
|Bao Han Restaurant|4.8|1,161|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://restaurantguru.com/Bao-Han-tp-Hoi-An)|
|The Basket Boat Cafe & Restaurant|4.8|612|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](http://thebasketboat.com/)|
|Ellie's Cafe Hoi An - Healthy Breakfast- Brunch- Lunch|4.8|1,477|燕麥／乳酪早餐碗；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://elliescafehoian.com/menus/Ellies-Cafe-Clean-Eating-Hoi-An-2026-1.pdf)|
|Seashell by Nu Eatery|4.8|601|越南現代料理；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d8532687-Reviews-The_Sea_Shell_by_Nu_Eatery-Hoi_An_Quang_Nam_Province.html)|
|Son Hoian|4.8|971|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.co.uk/Restaurant_Review-g298082-d1552999-Reviews-Son_Hoi_An_Restaurant-Hoi_An_Quang_Nam_Province.html)|
|Baby Mustard|4.8|933|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d3680703-Reviews-Baby_Mustard_Restaurant-Hoi_An_Quang_Nam_Province.html)|
|Morning Glory Mother's Kitchen|4.8|1,061|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://restaurantguru.com/Morning-Glory-Countryside-Vietnam)|
|Tiệm Bánh mì Ty ( Ty’s Bread )|5|897|Bánh mì 越式法包；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d27118439-Reviews-Ti_m_Banh_Mi_Ty_Ty_s_Bread-Hoi_An_Quang_Nam_Province.html)|
|Madame Hien ( Cô Mai)|4.8|524|越南現代料理；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://madamehien.com/wp-content/uploads/2025/07/MDH-HOI-AN-Menu-2025.pdf.pdf)|
|Tra Que Water Wheel Restaurant & Cooking classes|4.9|653|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://restaurantguru.com/Water-Wheel-tp-Hoi-An)|
|Hoa Hiên - Vietnamese Restaurant Hoian|4.8|2,393|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://wanderlog.com/place/details/1136855/hoa-hi%C3%AAn-restaurant)|
|Herbal Pizza and Steak Hoi An|4.8|1,829|意大利菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://wanderlog.com/place/details/2945201/herbal-pizza-and-steak-hoi-an)|
|Mr. Sơn Restaurant|4.8|917|越南菜；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d1847234-Reviews-Mr_Son-Hoi_An_Quang_Nam_Province.html)|
|Red Dragon Restaurant and Cooking Class|4.8|826|越南現代料理；[數量](https://restaurantshoian.com/data/hoi-an-restaurants.json)、[菜式](https://www.tripadvisor.com/Restaurant_Review-g298082-d1993411-Reviews-Red_Dragon_Restaurant_Cooking_Class-Hoi_An_Quang_Nam_Province.html)|
|Mì Quảng 92 - Mì quảng cá lóc, bò, mì tôm thịt|4.9|1,401|麵食／街頭小吃；[數量](https://wanderlog.com/place/details/7475275/m%C3%AC-qu%E1%BA%A3ng-92-m%C3%AC-qu%E1%BA%A3ng-c%C3%A1-l%C3%B3c-b%C3%B2-m%C3%AC-t%C3%B4m-th%E1%BB%8Bt)、[菜式](https://theordinarykatalog.com/mi-quang-92-hoi-an/)|
|Phở Tùng|4.8|691|麵食／街頭小吃；[數量](https://wanderlog.com/place/details/1472574/ph%E1%BB%9F-t%C3%B9ng)、[菜式](https://wanderlog.com/place/details/1472574/ph%E1%BB%9F-t%C3%B9ng)|
|All Day Bánh Mì - Serving History in Every Bite - Hoi An|4.8|5,521|Bánh mì 越式法包；[數量](https://wanderlog.com/place/details/9576496)、[菜式](https://wanderlog.com/place/details/9576496)|
|Nom Cafe and Bistro|4.9|630|越南菜；[數量](https://wanderlog.com/place/details/5885348/nom-cafe-and-bistro)、[菜式](https://wanderlog.com/place/details/5885348/nom-cafe-and-bistro)|
|Thìa Gỗ Vietnamese Restaurant Hoi An|4.8|1,165|越南菜；[數量](https://wanderlog.com/place/details/12570749/th%C3%ACa-g%E1%BB%97-vietnamese-restaurant-hoi-an)、[菜式](https://wanderlog.com/place/details/12570749/th%C3%ACa-g%E1%BB%97-vietnamese-restaurant-hoi-an)|
|Hỷ|4.9|866|越南菜；[數量](https://restaurantguru.com/Hy-Vietnamese-Restaurant-in-Hoi-An-tp-Hoi-An)、[菜式](https://restaurantguru.com/Hy-Vietnamese-Restaurant-in-Hoi-An-tp-Hoi-An)|
|The Spice Route by Ms Vy|4.9|571|越南菜；[數量](https://restaurantguru.com/Spice-Route-by-Ms-Vy-103-Nguyen-Thai-Hoc-tp-Hoi-An)、[菜式](https://restaurantguru.com/Spice-Route-by-Ms-Vy-103-Nguyen-Thai-Hoc-tp-Hoi-An)|
|Mê Hội An Rooftop Coffee & Kitchen|4.9|2,644|越南咖啡；[數量](https://wanderlog.com/place/details/8985265)、[菜式](https://wanderlog.com/place/details/8985265)|
|Hoi An Coffee Hub|4.9|1,048|越南咖啡；[數量](https://wanderlog.com/place/details/4726146/hoi-an-coffee-hub)、[菜式](https://wanderlog.com/place/details/4726146/hoi-an-coffee-hub)|
|Coconut Coffee Hội An|4.9|380|越南咖啡；[數量](https://restaurantguru.com/Rio-Coffee-Vietnam-10)、[菜式](https://restaurantguru.com/Rio-Coffee-Vietnam-10)|
|Dudu Cafe Hoi An|4.8|1,035|越南咖啡；[數量](https://wanderlog.com/place/details/5673643)、[菜式](https://wanderlog.com/place/details/5673643)|
|Phin Coffee Restaurant|4.8|2,876|精品咖啡；[數量](https://restaurantguru.com/Phin-coffee-tp-Hoi-An)、[菜式](https://restaurantguru.com/Phin-coffee-tp-Hoi-An)|
|MẸT Hội An - Vietnamese restaurant & Vegetarian Food MET 10|4.9|5,259|越南菜；[數量](https://wanderlog.com/place/details/13657331/m%E1%BA%B9t-h%E1%BB%99i-an-vietnamese-restaurant--vegetarian-food-met-10)、[菜式](https://wanderlog.com/place/details/13657331/m%E1%BA%B9t-h%E1%BB%99i-an-vietnamese-restaurant--vegetarian-food-met-10)|
|MẸT Hội An - Vietnamese cuisine & Vegetarian options 7|4.9|12,677|越南菜；[數量](https://wanderlog.com/place/details/9325237/m%E1%BA%B9t-h%E1%BB%99i-an-vietnamese-cuisine--vegetarian-options-7)、[菜式](https://wanderlog.com/place/details/9325237/m%E1%BA%B9t-h%E1%BB%99i-an-vietnamese-cuisine--vegetarian-options-7)|
|MẸT Hội An - Vietnamese restaurant & Vegetarian Food 6|4.9|15,494|越南菜；[數量](https://wanderlog.com/place/details/9566710/m%E1%BA%B9t-h%E1%BB%99i-an-vietnamese-restaurant--vegetarian-food-6)、[菜式](https://wanderlog.com/place/details/9566710/m%E1%BA%B9t-h%E1%BB%99i-an-vietnamese-restaurant--vegetarian-food-6)|
|MẸT Hội An - Vietnamese restaurant & Vegetarian Food MET 9|4.9|7,957|越南菜；[數量](https://restaurantguru.com/MET-Hoi-An-Vietnamese-restaurant-and-Vegetarian-Food-MET-9-tp-Hoi-An)、[菜式](https://www.top-rated.online/cities/H%E1%BB%99i%2BAn/place/p/13379765/M%E1%BA%B8T%2BH%E1%BB%99i%2BAn%2B-%2BVietnamese%2Brestaurant%2B%26%2BVegetarian%2BFood%2BMET%2B9)|
|Bikini Bottom Express Riverside Hoi An|4.8|719|漢堡；[數量](https://wanderlog.com/place/details/14794082/bikini-bottom-express-riverside-hoi-an)、[菜式](https://wanderlog.com/place/details/14794082/bikini-bottom-express-riverside-hoi-an)|
|A6 Garden- Smokehouse & Craft Beer|4.8|976|牛扒／扒房；[數量](https://wanderlog.com/place/details/8829445/a6-garden-smokehouse--craft-beer)、[菜式](https://wanderlog.com/place/details/8829445/a6-garden-smokehouse--craft-beer)|
|Êm - Comfort Food|4.9|1,434|越南現代料理；[數量](https://wanderlog.com/place/details/8638168/%C3%AAm-comfort-food)、[菜式](https://wanderlog.com/place/details/8638168/%C3%AAm-comfort-food)|
|Ngon Phố Hội|4.8|1,254|越南菜；[數量](https://restaurantguru.com/The-Salt-Restaurant-Vietnamese-Restaurant-Hoi-An-tp-Hoi-An)、[菜式](https://restaurantguru.com/The-Salt-Restaurant-Vietnamese-Restaurant-Hoi-An-tp-Hoi-An)|
|Anabas Restaurant - Cá Rô Đồng Quán - Hoi An restaurant - 호이안 로컬 레스토랑|4.8|2,588|越南菜；[數量](https://wanderlog.com/place/details/5684310/anabas-restaurant-c%C3%A1-r%C3%B4-%C4%91%E1%BB%93ng-qu%C3%A1n)、[菜式](https://wanderlog.com/place/details/5684310/anabas-restaurant-c%C3%A1-r%C3%B4-%C4%91%E1%BB%93ng-qu%C3%A1n)|
|Vietnamese Chopsticks - Dua Viet Restaurant|4.9|762|越南菜；[數量](https://wanderlog.com/place/details/3002529)、[菜式](https://wanderlog.com/place/details/3002529)|

### 排除及待核實（不隱藏原因）

|候選|處理|原因及來源|
|-|-|-|
|Purple Lantern( An Bang Beach Hoi An)|不收錄|旅客描述紀念品換評論；按使用者保守偏好排除。未獨立證實，不斷言店方造假。 [來源](https://www.reddit.com/r/VietNam/comments/1lrlwlk/)|
|The Faifo Factory|待核實|Google 現頁為 coffee making class，與舊目錄餐廳定位不同；需確認是否仍接受一般 Cafe 單點及其菜單。 [來源](https://restaurantshoian.com/data/hoi-an-restaurants.json)|
|The Secret Oasis|不收錄|Google 現頁標示永久歇業。 [來源](https://restaurantshoian.com/data/hoi-an-restaurants.json)|
|La Silk Riverside Restaurant|待核實|Google 搜尋對應 Silk River Hoi An Retreat 酒店，未能確認獨立餐廳的評論數；不可拿酒店評分收錄餐廳。 [來源](https://restaurantshoian.com/data/hoi-an-restaurants.json)|
|Sampan Seafood & Bar|不收錄|旅客明確描述好評換 8% 折扣；按使用者保守偏好排除。未獨立證實，不斷言造假。 [來源](https://www.tripadvisor.com/Restaurant_Review-g298082-d26229136-Reviews-Sampan_Seafood_Bar-Hoi_An_Quang_Nam_Province.html)|
|V Vegan|不收錄|Google 類別為純素餐廳。 [來源](https://restaurantshoian.com/data/hoi-an-restaurants.json)|
|Jack's Cat Cafe|待核實|Cafe 達到數值門檻，但餐饮及素食限定仍待核實；不自行當作一般早餐 Cafe。 [來源](https://restaurantshoian.com/data/hoi-an-restaurants.json)|
|Flower Restaurant|不收錄|Google 現頁標示暫時關閉。 [來源](https://restaurantshoian.com/data/hoi-an-restaurants.json)|
|Lê Hội Bánh Mì Chay (Le Hoi Vegan Banh Mi)|不收錄|純素 Bánh mì 專門店。 [來源](https://wanderlog.com/place/details/1323626/l%C3%AA-h%E1%BB%99i-b%C3%A1nh-m%C3%AC-chay-le-hoi-vegan-banh-mi)|
|Herbs And Spices Cooking classes|不收錄|Google 現頁標示永久歇業。 [來源](https://www.google.com/maps/place/Herbs+%26+Spices+Cooking+School/@15.8791874,108.3285237,17z/data=!3m1!4b1!4m6!3m5!1s0x31420e7934b2957d:0xd75efb152ae475c4!8m2!3d15.8791874!4d108.3285237!16s%2Fg%2F11ck1xcqhh?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|Chickpea Eatery: Vegan Restaurant & Vegan Cooking Class Hoi An|不收錄|Google 現頁為純素餐廳。 [來源](https://restaurantshoian.com/data/hoi-an-restaurants.json)|
|Charm Hoi An Restaurant|待核實|搜尋混入酒店及近似名稱餐廳，未確認同一餐廳實體。 [來源](https://www.google.com/maps/search/Charm+Hoi+An+Restaurant++Hoi+An/@15.8765758,108.3230204,18z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|Gia Thiện Cơm Nhà|不收錄|Google 現頁標示永久歇業。 [來源](https://www.google.com/maps/place/Gia+Thi%E1%BB%87n+C%C6%A1m+Nh%C3%A0/@15.8752315,108.3249822,17z/data=!3m1!4b1!4m6!3m5!1s0x31420ffaf77ff663:0xfc5e0d92c6215c3e!8m2!3d15.8752315!4d108.3249822!16s%2Fg%2F11khh93ppp?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|Spring Onion Restaurant|待核實|Google 分類為料理教室；尚未確認可獨立預約一般餐飲及相應菜單，不將課程評價直接當一般餐廳。 [來源](https://www.google.com/maps/place/Spring+Onion+Cooking+Class+and+Restaurant/@15.9035181,108.3343438,17z/data=!3m1!4b1!4m6!3m5!1s0x31420d3e6191c381:0xe51503b5869926b4!8m2!3d15.9035181!4d108.3343438!16s%2Fg%2F11gl21s66r?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|9Steps In - Resraurant|待核實|現頁地址與舊資料不同，未核實現址餐廳 Google 評論數。 [來源](https://www.google.com/maps/place/9Steps+In+Restaurant/@15.8781591,108.3365846,17z/data=!3m1!4b1!4m6!3m5!1s0x314219854a0eaf31:0x897aabbc0414a577!8m2!3d15.8781591!4d108.3365846!16s%2Fg%2F11nc4767yz?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|KURUMI - Healthy Vegan Food & Desserts - Hoi An|不收錄|Google 現頁明確分類為純素餐廳。 [來源](https://www.google.com/maps/place/KURUMI/@15.8835506,108.3269919,17z/data=!3m1!4b1!4m6!3m5!1s0x31420fc911a38d5f:0x84eaca8ec0b0dd35!8m2!3d15.8835506!4d108.3269919!16s%2Fg%2F11wqw6g47s?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|Hoang's Kitchen Hoi An - Vietnamese Cuisine & Vegan food|待核實|搜尋混入 Hoang’s Kitchen 2；原分店評論數未可靠核實。 [來源](https://www.google.com/maps/search/Hoang's+Kitchen+Hoi+An+-+Vietnamese+Cuisine+%26+Vegan+food++Hoi+An/@15.8782822,108.3261158,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|Faifoo Central Restaurant 2 - Vietnamese Food & Cooking Class|待核實|已找到 70B Nguyễn Phúc Tần 分店及 Google 5.0，未核實 Google 評論總數；不以 Tripadvisor 數量代替。 [來源](https://www.google.com/maps/place/Faifoo+Central+Restaurant+2+-+Vietnamese+Food+%26+Cooking+Class/@15.875181,108.324233,17z/data=!3m1!4b1!4m6!3m5!1s0x31420f5841492b61:0x89a5ec1fa2114dc3!8m2!3d15.875181!4d108.324233!16s%2Fg%2F11m6s7bkt8?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|The 1990's Hội An Restaurant And Bar|不收錄|Google 現頁標示暫時關閉；恢復營業後才重新評估。 [來源](https://www.google.com/maps/place/The+1990's+H%E1%BB%99i+An+Restaurant+and+Bar+-+%ED%98%B8%EC%9D%B4%EC%95%88+%EB%A0%88%EC%8A%A4%ED%86%A0%EB%9E%91/@15.8766577,108.3172309,17z/data=!3m1!4b1!4m6!3m5!1s0x31420fcfd59b8ea3:0xe0d5ecc6200d50f9!8m2!3d15.8766577!4d108.3172309!16s%2Fg%2F11k41lm60x?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D)|
|An Thoi（40 Nguyễn Phúc Tần）|待核實|搜尋有兩間近似店名，未取得此分店可確認的 Google 評論數。 [來源](https://www.tripadvisor.com.vn/Restaurant_Review-g298082-d33972277-Reviews-An_Thoi_Hoi_An-Hoi_An_Quang_Nam_Province.html)|
|Trốn Hội An Coffee & Brunch|待核實|Google 現頁評分 4.8，但未取得可靠的 Google 評論總數，無法確認是否 ≥300。 [來源](https://thecupscoffee.vn/tron-hoi-an-coffee-brunch/)|

自動驗證會檢查：每個目錄候選有決定、每個收錄決定對應地圖資料、不得重複、缺少數字不可當成不合格，以及所屬類別門檻和港幣預算。這些是資料一致性檢查，不能代替來源真實性或出發前重新查核。

## 早期批次記錄

核對日期：2026-09-07。首批新增 3 間餐廳、5 個景點；第二批再加 14 間餐廳，會安合計 17 間餐廳、5 個景點。不是全會安餐廳普查，沒有更改任何訂位。

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

## 第二批擴充：2026-09-07

依「繼續擴充」及「滄海遺珠也加入」授權，另加 14 間：11 間門檻收錄、3 間明確例外。會安合計 **17 間餐廳（14 間門檻收錄、3 間編輯精選）及 5 個景點**；全 App 合計 125 個地點（114 間餐廳、11 個景點）。這是有範圍的精選，不是會安所有合格餐廳的完整普查。

### 評分、數量與現址

以下評分、分店地址、座標及 Google 電話於 2026-09-07 直接打開 Google Maps 核對；評論數取下列頁面明確標註 Google 的轉載部分，不取混合平台 aggregateRating。Google 頁面提示只顯示部分內容，無法取得原生完整評論列表／總數；核對日不等於來源快照更新日。

|新增餐廳|Google 現頁分數|評論數快照|收錄方式|數量來源|
|-|-|-|-|-|
|An Bang Beach Village Restaurant|4.8|1,693|門檻收錄|[評論數快照](https://restaurantguru.com/An-Bang-Beach-Village-tp-Hoi-An)|
|Tuyết An Bàng Seafood|4.8|2,111|門檻收錄|[評論數快照](https://restaurantguru.com/Tuyet-tp-Hoi-An)|
|Nhà Hàng QQ|4.9|7,124|門檻收錄|[評論數快照](https://restaurantguru.com/QQ-restaurant-Hoi-An-tp-Hoi-An)|
|Pause and Enjoy Restaurant|4.9|5,315|門檻收錄|[評論數快照](https://restaurantguru.com/Pause-and-Enjoy-Restaurant-tp-Hoi-An)|
|A Little Kitchen Restaurant – Bếp Nhỏ|4.8|1,619|門檻收錄|[評論數快照](https://restaurantguru.com/A-Little-Kitchen-Bep-Nho-tp-Hoi-An)|
|Bà Hiếu – Local Foods|4.9|696|門檻收錄|[評論數快照](https://restaurantguru.com/Quan-Banh-trang-cuon-thit-heo-Hoi-An-Vietnam)|
|The Soul Restaurant|4.9|827|門檻收錄|[評論數快照](https://restaurantguru.com/The-Soul-Restaurant-tp-Hoi-An-2)|
|JEERA – Indian Restaurant|4.8|1,102|門檻收錄|[評論數快照](https://restaurantguru.com/MAAZI-Hoi-An-2-tp-Hoi-An)|
|Bánh Mì Hai Cây Xoài – Two Mango Tree Bread|4.9|616|門檻收錄|[評論數快照](https://wanderlog.com/place/details/1475926/b%C3%A1nh-m%C3%AC-hai-c%C3%A2y-xo%C3%A0i-two-mango-tree-bread)|
|SRI SPICES INDIAN FAMILY RESTAURANT|4.8|1,033|門檻收錄|[評論數快照](https://restaurantguru.com/Sri-Spices-Indian-and-Sri-Lankan-Restaurant-tp-Hoi-An)|
|Phở Ngân Hội An|4.9|1,433|門檻收錄|[評論數快照](https://restaurantguru.com/Pho-Ngan-Hoi-An-tp-Hoi-An)|
|Quán Cao Lầu Thanh|4.6|2,391|編輯精選例外|[評論數快照](https://wanderlog.com/place/details/1121735/qu%C3%A1n-cao-l%E1%BA%A7u-thanh)|
|Mỳ Quảng Bích|4.5|396|編輯精選例外|[評論數快照](https://wanderlog.com/place/details/1089200/m%E1%BB%B3-qu%E1%BA%A3ng-b%C3%ADch)|
|Bánh Xèo, Thịt Nướng, Nem Lụi Bà 9|4.7|183|編輯精選例外|[評論數快照](https://restaurantguru.com/Banh-Xeo-Thit-Nuong-Nem-Lui-Ba-9-Vietnam)|

A Little Kitchen 現頁 4.8（轉載仍列 4.9）；Phở Ngân 現頁 4.9（轉載 5.0）；Mỳ Quảng Bích 現頁 4.5（轉載 4.4）。不以較高舊分數覆蓋當前頁面。Two Mango Tree 使用越文店名、124 Nguyễn Phan Vinh 確認分店，並非搜尋英文泛稱時誤中的古城 Mango Mango。

跨來源數量亦有差異，但門檻判斷一致：An Bang Beach Village [Wanderlog](https://wanderlog.com/place/details/1169721/an-bang-beach-village-restaurant) 1,633；QQ [Wanderlog](https://wanderlog.com/place/details/7217730/nh%C3%A0-h%C3%A0ng-qq) 6,953；Pause [Wanderlog](https://wanderlog.com/place/details/3452008) 5,047；Bà Hiếu [Wanderlog](https://wanderlog.com/place/details/3697408) 646；The Soul [Wanderlog](https://wanderlog.com/place/details/2624403) 772；JEERA [Wanderlog](https://wanderlog.com/place/details/10021360/jeera-indian-restaurant) 1,094；Two Mango Tree [Restaurant Guru](https://restaurantguru.com/Banh-Mi-Hai-Cay-Xoai-Vietnam) 558。不要把各頁不同時點數字平均或合計。

### 三間編輯精選的具體依據

- **Cao Lầu Thanh**：專做高樓麵；[越南航空指南](https://www.vietnamairlines.com/gb/en/plan-book/travel/travel-guide/cao-lau-hoi-an)及 [Heritage 2024 會安／峴港指南](https://heritagevietnamairlines.cdn.vccloud.vn/wp-content/uploads/2024/07/HG.HA-DN.072024.ENG_.pdf)有名稱與 Thái Phiên 地址。分數 4.6，公開例外，不是假稱 4.8 以上。
- **Mỳ Quảng Bích**：蝦豬肉廣南麵；[飲食指南](https://tasteofvietnam.vn/my-quang.html)、[旅客飲食記錄](https://www.sophieservesup.com/articles/the-ultimate-hoi-an-vietnam-guide-what-to-do-eat-drink/)及 [Tripadvisor 個別用餐評論](https://www.tripadvisor.com/Restaurant_Review-g298082-d13307414-Reviews-My_Quang_Cao_Lau_Bich-Hoi_An_Quang_Nam_Province.html)提供菜色依據。4.5／396 均不達門檻，且位置在古城西側，不宣稱步行核心。
- **Bánh Xèo Bà 9**：煎餅、烤肉及香茅肉串；[會安旅遊介紹](https://antuonghoian.com.vn/Blog/Banh-xeo-hoi-an)及 Google 對應巷內分店的評論摘錄。4.7／183 均不達門檻，Google 現址為 Kiệt 92 Phan Châu Trinh，不混用其他分店地址。

這些是有來源的編輯判斷，不是親自試食、米芝蓮認證或品質保證。清單和詳情卡都有「編輯精選 · 門檻例外」，詳情直接展示理由和參考連結；仍按菜式分類。

### 菜色、預算、營業與訂位

[An Bang Beach Village 官網](https://anbangbeachvillage.com/)支持蕉葉魚、扇貝及蝦菜色，並有[訂位申請](https://anbangbeachvillage.com/reservation/)；[Pause 官網](https://pauseandenjoyhoian.com/)有菜色、時間及表格；[The Soul 官網](https://thesoulhoian.com/)有會安拼盤、河內烤肉米粉、蝦及早午晚餐安排。其他菜色採對應餐廳公開菜單／用餐評論摘錄，不把平台生成的總結當成官方菜單。QQ 另參考 [Tripadvisor](https://www.tripadvisor.com/Restaurant_Review-g298082-d26083792-Reviews-QQ_Restaurant_Hoi_An-Hoi_An_Quang_Nam_Province.html)，A Little Kitchen 參考 [Tripadvisor](https://www.tripadvisor.com/Restaurant_Review-g298082-d25102013-Reviews-A_Little_Kitchen_Bep_Nho-Hoi_An_Quang_Nam_Province.html)。

- 人均均為預算，附 VND／HKD 區間及 HK$1 ≈ 3,300 VND 非即時概算說明，非保證報價。海鮮按普通共享菜估算，不包括龍蝦等高價海鮮；提示先問重量、單價及烹調費。
- Pause 採官網每日 09:00–22:00 結構化時段，優先於第三方；僅用來推算，非店內即時回報。
- Tuyết [首頁](https://tuyetbienanbang.com/) 09:00 與[訂位頁](https://tuyetbienanbang.com/book-table/) 10:00 開門互相矛盾，保留未知狀態。The Soul 22:00 是最後點餐，沒有偷換為確切關門時間。
- 其他未核實完整官方時間的餐廳保留 schedule:null，卡內可顯示有來源的參考時間及矛盾，不誤判已打烊。Phở Ngân 明示不同關門時間。
- 網站／社交頁連結只用已識別的店方頁；不把 Tripadvisor、Wanderlog 等當作官方訂位。官網有表格才填 bookingUrl，提交仍需店方確認。Google 與官網電話不同時採官網並註明。
- 全部 14 間新增餐廳 photo:null：尚未驗證現址門面照，不用菜色照或生成圖片冒充外觀。

### 優惠換評篩查及未收錄候選

對新增店名搭配 discount／free／in exchange／review 作公開索引搜尋、閱讀可取得的評論摘錄。未見新增 14 店有具體利益交換評論證據；這不是全量評論審核，也不能保證每則評論真實。Google 原生評論存取受限。

一般招待水果、送小孩鑰匙圈、Happy Hour 或投訴後退款，不等於「必須評分才有優惠」。Bà Hiếu 的[舊遊記](https://minhtrangdao.wordpress.com/2022/06/)提及邀請好評，未描述利益交換，資料卡保留此區別。

|候選|這次處理|可追溯依據|
|-|-|-|
|Purple Lantern|依使用者保守偏好排除；是未獨立證實的旅客指控，不斷言造假|[旅客描述紀念品換評論](https://www.reddit.com/r/VietNam/comments/1lrlwlk/)|
|The 1990’s|暫緩，來源標示暫停營業，不能以高分假定正在開門|[來源](https://restaurantguru.com/The-1990s-Hoi-An-Restaurant-and-Bar-tp-Hoi-An)|
|La Bottega Cua Dai|4.9／423，評論數不足；未另選為例外|[來源](https://restaurantguru.com/La-Bottega-Cua-Dai-tp-Hoi-An)|
|Ăn Gì|4.9／137，評論數不足|[來源](https://es.restaurantguru.com/%EC%95%99%EC%A7%80An-Gi-tp-Hoi-An)|
|Bánh Xèo Khuê|4.9／291，評論數不足|[來源](https://restaurantguru.com/Banh-xeo-Khue-Dac-san-Hoi-An-tp-Hoi-An)|
|Châu Kitchen & Bar|4.7／1,033，未達評分門檻；未選為例外|[來源](https://restaurantguru.com/CHAU-Kitchen-and-Bar-tp-Hoi-An)|
|AN GIA cottage|4.7／610，未達評分門檻|[來源](https://es.restaurantguru.com/AN-GIA-cottage-tp-Hoi-An)|
|Maharaja Indian|4.6／485，未達門檻|[來源](https://es.restaurantguru.com/Maharaja-Indian-Restaurant-Hoi-An-tp-Hoi-An)|
|Lê Hội Vegan Bánh Mì|純素食店，依原規則排除|[來源](https://restaurantguru.com/Banh-MI-Chay-Vegan-Banh-Mi-tp-Hoi-An)|
|White Sails|地址／店名及 Google 數字來源不一致，暫不混合分店資料收錄|[交叉來源](https://wanderlog.com/place/details/8490154/nh-hng-cnh-bum-trng-seafood-hoi-an-white-sails-restaurant-nh-hng-hi-sn-hi-an--)|
|Red Bean、Faifoo Central|未納入本批；評論有不滿後補償情節，但沒有足夠依據把補償認定為換評，不列作誘評黑名單|[Red Bean 評論](https://www.tripadvisor.com/Restaurant_Review-g298082-d9750905-Reviews-Red_Bean_Restaurant-Hoi_An_Quang_Nam_Province.html)、[Faifoo 用餐記錄](https://cavinteo.blogspot.com/2024/09/faifoo-central-restaurant-hoi-in-vietnam.html)|

沒有聯絡店舖、預約、取消訂位或更改自動化。

## 酒店與行程

酒店座標 `15.9206981,108.3259055` 由[官方聯絡頁](https://wyndhamroyalhoian.com/contact/)的 Google Maps 短連結解析取得，是地點座標，不是 iframe 視野中心。酒店獨立 WebGL source，不受菜式／景點篩選影響。

9/4–9/9 沿用使用者行程。只有 9/6 19:30 Pizza 4P’s 標記使用者已確認；MỘC、Spa、門票等不擅自標記已預訂。Pizza 目前收錄 74 Bạch Đằng，提醒以確認信分店為準。沒有聯絡店舖、提交訂位或更改訂位監察自動化。
