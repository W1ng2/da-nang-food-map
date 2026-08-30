require "csv"
require "uri"

AUDIT_DATE = "2026-08-18"
RATE = 3350.0

rows = [
  ["Roost Coffee Roasters | Da Nang", 4.9, 477, "57 Bà Huyện Thanh Quan, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "☕ 精品咖啡", "自家烘焙的小型精品咖啡店，主打自家農場 Fine Robusta、現場烘豆及手沖。", "₫50,000–100,000（預算估算）", "Gia Lai Natural Fine Robusta、Espresso、Cold Brew", "抽查 free、review、5 star；未見以優惠換取評分的明確證據"],
  ["ACACIA coffee and more", 4.8, 705, "05 An Cư 5, An Hải, Đà Nẵng, Vietnam", "☕ 精品咖啡", "帶花園與貓咪的悠閒咖啡店，適合慢坐，創意咖啡和甜點選擇突出。", "₫1–100,000", "Salted Cream Coffee、Peanut Butter Coffee、Flan", "抽查 free、review、discount；未見以優惠換取評分的明確證據"],
  ["Trình cà phê", 4.8, 7438, "25 Phạm Hồng Thái, Hải Châu, Đà Nẵng, Vietnam", "🇻🇳 越南咖啡", "懷舊越南風格咖啡店，適合體驗本地咖啡與舊式家居氛圍。", "₫1–100,000", "Coconut Coffee、Egg Coffee、越南滴漏咖啡", "抽查 free、5 star；未見以優惠換取評分的明確證據"],
  ["Outta da Blue Đà Nẵng", 4.9, 453, "66 Pasteur, Hải Châu, Đà Nẵng, Vietnam", "☕ 精品咖啡", "色彩鮮明的精品咖啡店，重視咖啡豆與冷萃，環境適合短休或工作。", "₫1–100,000", "Orange Cold Brew、Cold Brew、巴西芝士麵包", "抽查 free、5 star；有一般贈飲描述，但未見與指定評分掛鈎"],
  ["Passport Coffee Lab | Specialty Coffee & Brunch", 4.8, 480, "78 Mai Thúc Lân, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "☕ 精品咖啡", "鄰近美溪海灘的精品咖啡與早午餐店，樓上較安靜，適合工作。", "₫1–100,000", "Flat White、手沖咖啡、Pastry", "抽查 free、5 star；未見以優惠換取評分的明確證據"],
  ["O2o First Roast", 4.9, 383, "18/3B Phan Tứ, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "☕ 精品咖啡", "以選豆和沖煮交流為核心的小型精品店，常見 V60、Cold Brew 及咖啡 tasting。", "₫1–100,000", "V60、Cold Brew、Cappuccino", "抽查 free、5 star；試飲及豆折扣未見與評論或指定評分掛鈎"],
  ["[91cc] 91 Concept Coffee", 4.8, 325, "91 Trần Quốc Toản, Hải Châu, Đà Nẵng, Vietnam", "🇻🇳 越南咖啡", "市中心氣氛舒適的咖啡店，越南風味創意咖啡選擇較多。", "₫1–100,000", "Honey Butter Latte、Coconut Coffee、Egg Coffee", "抽查 free、5 star；未見以優惠換取評分的明確證據"],
  ["Freezedom Da Nang", 4.9, 643, "156 Mai Thúc Lân, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🍨 Gelato／雪糕", "甜品雪糕專門店，口味與配料選擇多，適合海灘區飯後甜品。", "₫50,000–100,000（預算估算）", "Key Lime Cheesecake、Oreo Cookie Crumbs 雪糕", "抽查 free、review；未見以優惠換取評分的明確證據"],
  ["Nang Ngot Patisserie", 4.8, 343, "20 Phan Bội Châu, Hải Châu, Đà Nẵng, Vietnam", "🍰 法式甜點／烘焙", "市中心法式甜點店，蛋糕定價相對親民，適合下午茶或外帶。", "₫50,000–150,000（預算估算）", "Blueberry Cheesecake、Hibiscus Orange Tea", "抽查 free、review；未見以優惠換取評分的明確證據"],
  ["GioiA Gelati - Gelati are joy", 4.8, 435, "59 An Thượng 2, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🍨 Gelato／雪糕", "安上區 Gelato 專門店，提供多款口味，亦有無奶與純素口味可選。", "₫50,000–100,000（預算估算）", "Salted Caramel Gelato、每日口味 Gelato", "抽查 free、review；只見無奶選項，未見以優惠換取評分的明確證據"],
  ["Little Mango", 4.9, 1494, "15 Ngô Thì Sĩ, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🥭 水果／本地甜品", "以新鮮芒果飲品和甜品為主的高人氣小店，適合炎熱天氣補充水果。", "₫1–100,000", "Mango Smoothie、芒果甜品", "抽查 free、review；未見以優惠換取評分的明確證據"],
  ["Kem bơ Bé Huệ", 4.9, 668, "11B4 An Thượng 38, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🥭 水果／本地甜品", "本地牛油果雪糕店，以無加糖奶的純牛油果蓉配手工椰子雪糕。", "₫30,000–70,000（預算估算）", "Kem bơ（牛油果＋椰子雪糕）", "抽查 free；只見免費占卜描述，未見以優惠換取評分的明確證據"]
]

excluded = [
  ["Oslow Coffee", 5.0, 1070, "排除", "多名評論者指店方以免費曲奇換取 5 星評論；證據明確且重複出現"],
  ["Zi Coffee & Roastery（34 Lê Quang Đạo）", 4.8, 527, "排除", "評論指免費飲品及回訪折扣推高評分；店方回覆承認向支持者提供相關答謝"],
  ["다낭과일집&빙수 Trái cây - Bingsu Đà Nẵng", 4.8, 1315, "排除", "評論明確提及以免費零食／椰子餅換取評論及 5 星"],
  ["ALLUVIA CHOCOLATE ĐÀ NẴNG", 4.9, 1065, "排除", "多則評論明確提及留評可獲免費朱古力或禮物"],
  ["The Cups Coffee Roastery", 4.7, 4561, "排除", "未達 4.8；另有評論稱留評後沒有收到免費禮物，屬誘評風險"],
  ["XLIII Specialty Coffee", 4.7, 9727, "排除", "未達 4.8；另有評論指職員催促顧客留下評論"]
]

def hkd_text(vnd)
  nums = vnd.scan(/[\d,]+/).map { |n| n.delete(",").to_i }.reject(&:zero?)
  "約 HK$#{(nums[0] / RATE).round}–#{(nums[1] / RATE).round}"
end

CSV.open("da-nang-cafe-dessert-vetted-map.csv", "w", write_headers: true, headers: [
  "店名", "地址", "圖標類型", "Google評分", "Google評論數", "店鋪簡介",
  "人均消費（VND）", "人均消費（HKD）", "招牌項目", "Google Maps", "篩選條件",
  "誘評抽查", "核對日期", "價格備註"
]) do |csv|
  rows.each do |name, rating, reviews, address, icon, intro, vnd, signatures, audit|
    csv << [
      name, address, icon, format("%.1f", rating), reviews, intro, vnd, hkd_text(vnd), signatures,
      "https://www.google.com/maps/search/?api=1&query=#{URI.encode_www_form_component(name + " Da Nang")}",
      "Cafe／甜品；Google 評分 4.8+；評論 300+；排除明確誘評證據", audit, AUDIT_DATE,
      vnd.include?("預算估算") ? "Google Maps 未顯示公開人均；以店種及可見菜單／產品作旅程預算估算，出發前請核對最新菜單" : "Google Maps 使用者回報區間；HKD 以 HK$1≈₫3,350 換算"
    ]
  end
end

CSV.open("da-nang-cafe-dessert-review-incentive-audit.csv", "w", write_headers: true, headers: [
  "店名", "Google評分", "Google評論數", "審核結果", "誘評證據／判斷", "核對日期"
]) do |csv|
  rows.each { |r| csv << [r[0], format("%.1f", r[1]), r[2], "通過", r[8] + "；搜尋樣本未見不等於永久保證", AUDIT_DATE] }
  excluded.each { |r| csv << r + [AUDIT_DATE] }
end

puts "WROTE da-nang-cafe-dessert-vetted-map.csv: #{rows.length} rows"
puts "WROTE da-nang-cafe-dessert-review-incentive-audit.csv: #{rows.length + excluded.length} rows"
