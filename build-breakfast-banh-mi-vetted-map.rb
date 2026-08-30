require "csv"
require "uri"

AUDIT_DATE = "2026-08-26"
RATE = 3350.0

rows = [
  {
    name: "An's Cafe",
    rating: 4.7,
    reviews: 892,
    address: "78 Loseby, An Hải, Đà Nẵng 550000, Vietnam",
    icon: "🥣 燕麥／乳酪早餐碗",
    intro: "近美溪海灘的平價早餐咖啡店，健康碗選擇明確，亦有蛋料理、牛油果多士及果汁；不是純素專門店。",
    vnd: "₫50,000–100,000",
    signatures: "Granola＋水果＋乳酪碗、花生醬水果燕麥、Good Morning Smoothie",
    hours: "07:00–17:00；每月5日休息（出發前再核對）",
    filter: "健康早餐碗；Google 4.0+；近期產品評論；非純素專門店；反誘評抽查",
    audit: "抽查 free、review、5 star、discount；只見 Grab 平台折扣，未見與評論或指定星級掛鈎",
    price_note: "2026 可見菜單：Granola／水果燕麥各 ₫50,000；人均含飲品作旅程預算"
  },
  {
    name: "Oh la la! Breakfast, Brunch, Lunch",
    rating: 4.9,
    reviews: 1073,
    address: "64A Mai Thúc Lân, Ngũ Hành Sơn, Đà Nẵng 550000, Vietnam",
    icon: "🥣 燕麥／乳酪早餐碗",
    intro: "安上區的歐式早餐與早午餐店，主打色彩鮮明的 smoothie bowl、yogurt mix、Egg Benedict 及牛油果多士。",
    vnd: "₫90,000–180,000（預算估算）",
    signatures: "Strawberry Smoothie Bowl、Yogurt Mix、Avocado Egg Benedict",
    hours: "08:00–17:00",
    filter: "健康早餐碗；Google 4.0+；近期產品評論；非純素專門店；反誘評抽查",
    audit: "抽查 free、review、5 star、gift；可見迎賓茶、小食及餐後曲奇屬一般招待，未見與評論或指定星級掛鈎",
    price_note: "可見餐飲價帶約 ₫30,000–120,000；人均按一份早餐碗加飲品估算"
  },
  {
    name: "Puna Specialty Coffee & Eatery",
    rating: 4.7,
    reviews: 1300,
    address: "132 Lê Quang Đạo, Bắc Mỹ An, Ngũ Hành Sơn, Đà Nẵng 550000, Vietnam",
    icon: "🥣 燕麥／乳酪早餐碗",
    intro: "自家烘焙精品咖啡與全日早餐店，除 smoothie bowl 外亦有煙三文魚牛油果多士、Egg Benedict 及早餐 burrito。",
    vnd: "₫100,000–200,000",
    signatures: "Smoothie Bowl、Salmon Avocado Toast、Breakfast Burrito、手沖咖啡",
    hours: "07:00–22:00",
    filter: "健康早餐碗；Google 4.0+；近期產品評論；非純素專門店；反誘評抽查",
    audit: "抽查 free、review、5 star、gift、discount；只見試飲及飲用水招待，未見與評論或指定星級掛鈎",
    price_note: "Google 使用者回報人均區間；HKD 以 HK$1≈₫3,350 換算"
  },
  {
    name: "Xôi, Bún măng gà bà Vui",
    rating: 4.6,
    reviews: 271,
    address: "55 Lê Hồng Phong, Hải Châu, Đà Nẵng 550000, Vietnam",
    icon: "🍚 越式早餐｜Xôi gà",
    intro: "專做雞肉糯米飯與竹筍雞湯粉的本地早餐小店，份量簡單實在，清雞湯及自家辣椒醬是特色。",
    vnd: "₫30,000–35,000",
    signatures: "Xôi gà、Bún măng gà、自家辣椒醬",
    hours: "04:00–21:00；早餐建議08:00前",
    filter: "越式早餐；Google 4.0+；近期產品評論；本地食物可信度；反誘評抽查",
    audit: "抽查 free、review、5 star、gift、discount；未見以優惠換取評論或指定星級的明確證據",
    price_note: "小／大份可見價 ₫30,000／₫35,000"
  },
  {
    name: "Quán Bò Né Quốc Minh",
    rating: 4.3,
    reviews: 80,
    address: "28 Phan Đình Phùng, Hải Châu, Đà Nẵng 550000, Vietnam",
    icon: "🍳 越式早餐｜Bò né",
    intro: "數十年本地 bò né 早餐店，以熱鐵板上桌的牛肉、煎蛋、肉丸配法包及清湯，週末早上常滿座。",
    vnd: "₫60,000–70,000（近期評論常見）",
    signatures: "Bò né 牛肉煎蛋鐵板、Xíu mại 肉丸、熱法包",
    hours: "06:00–10:30／11:00",
    filter: "越式早餐；Google 4.0+；近期產品評論；本地食物可信度；反誘評抽查",
    audit: "抽查 free、review、5 star、gift、discount；未見以優惠換取評論或指定星級的明確證據",
    price_note: "舊菜單價帶較低；地圖以 2024–2025 近期評論常見 ₫60,000–70,000 作旅程預算"
  },
  {
    name: "Bánh cuốn Tiến Hưng",
    rating: 4.1,
    reviews: 534,
    address: "190 Trần Phú, Phước Ninh, Hải Châu, Đà Nẵng 550000, Vietnam",
    icon: "🥢 越式早餐｜Bánh cuốn",
    intro: "峴港老字號蒸粉卷店，薄米漿皮配肉碎、木耳、肉鬆、炸乾蔥及魚露，適合清爽早餐。",
    vnd: "₫40,000–50,000",
    signatures: "Bánh cuốn、Chả lụa、炸乾蔥",
    hours: "06:00–19:00",
    filter: "越式早餐；Google 4.0+；500+評論；老字號；反誘評抽查",
    audit: "抽查 free、review、5 star、gift、discount；未見以優惠換取評論或指定星級的明確證據",
    price_note: "近期評論可見一人份約 ₫40,000–48,000"
  },
  {
    name: "Bánh Bèo Nóng - 197 Núi Thành",
    rating: 4.9,
    reviews: 18,
    address: "197 Núi Thành, Hòa Cường Bắc, Hải Châu, Đà Nẵng 550000, Vietnam",
    icon: "🟠 越式早餐｜Bánh bèo",
    intro: "只在早上供應的本地熱 bánh bèo 小店，米糕即點加蝦肉濕餡或蝦鬆乾餡，約10時前有售罄風險。",
    vnd: "₫20,000–30,000",
    signatures: "濕餡 Bánh bèo、乾餡 Bánh bèo、Chả",
    hours: "只售早上；約10:00前或售罄",
    filter: "越式早餐；Google 4.0+；低樣本本地特色；2026 本地報章與近期產品評論交叉核對；反誘評抽查",
    audit: "抽查 free、review、5 star、gift、discount；未見以優惠換取評論或指定星級的明確證據；Google 樣本量低",
    price_note: "近期評論可見6小碗加1件肉約 ₫24,000；屬低樣本特色店"
  },
  {
    name: "2 Ladies Kitchen - Banh mi & coffee",
    rating: 4.8,
    reviews: 1777,
    address: "28 An Thượng 4, Ngũ Hành Sơn, Đà Nẵng 550000, Vietnam",
    icon: "🥖 Bánh mì 越式法包",
    intro: "安上步行街的即叫即製 bánh mì 店，法包外脆內軟、餡料足，並聘用聽障員工；不是純素專門店。",
    vnd: "₫45,000–70,000（預算估算）",
    signatures: "Caramel Pork & Egg Bánh mì、Grilled Pork Bánh mì、Beef Bánh mì",
    hours: "07:30–22:30",
    filter: "Bánh mì 專門；Google 4.0+；近期產品評論；反誘評抽查",
    audit: "抽查 free drink、review、5 star、gift；迎賓蝶豆花水果茶為一般到店招待，未見與評論或指定星級掛鈎",
    price_note: "可見牛肉 bánh mì 約 ₫55,000；人均按一份法包作旅程預算"
  },
  {
    name: "Bánh mì Happy Bread Mì AA",
    rating: 4.6,
    reviews: 6749,
    address: "10 Hùng Vương, Hải Châu, Đà Nẵng 550000, Vietnam",
    icon: "🥖 Bánh mì 越式法包",
    intro: "韓市場附近、較適合旅客的冷氣 bánh mì 店，法包份量大、餡料選擇多，適合快速早餐或午餐。",
    vnd: "₫50,000–60,000",
    signatures: "Traditional Pork Bánh mì、Grilled Chicken Bánh mì、Mango Smoothie",
    hours: "08:00–21:30",
    filter: "Bánh mì 專門；Google 4.0+；500+評論；近期產品評論；反誘評抽查",
    audit: "抽查 free、review、5 star、gift、discount；未見以優惠換取評論或指定星級的明確證據",
    price_note: "近期可見法包約 ₫50,000–60,000；HKD 以 HK$1≈₫3,350 換算"
  },
  {
    name: "Bánh mì Bà Lan",
    rating: 4.1,
    reviews: 884,
    address: "62 Trưng Nữ Vương, Phước Ninh, Hải Châu, Đà Nẵng 550000, Vietnam",
    icon: "🥖 Bánh mì 越式法包",
    intro: "峴港老字號外帶 bánh mì，厚 pâté、豬／牛肉腸及本地香草是特色；原店只在下午至晚上營業。",
    vnd: "₫25,000–40,000",
    signatures: "Bánh mì đặc biệt、Pâté、Chả bò／Chả lụa",
    hours: "15:00–23:00（不是早餐時段）",
    filter: "Bánh mì 專門；Google 4.0+；老字號；500+評論；反誘評抽查",
    audit: "抽查 free、review、5 star、gift、discount；未見以優惠換取評論或指定星級的明確證據",
    price_note: "近期可見價格約 ₫25,000 起；原店為外帶、現金為主"
  },
  {
    name: "Heo nướng lu Ông Phú Đạt",
    rating: 4.7,
    reviews: 864,
    address: "128 Nguyễn Duy Hiệu, An Hải, Đà Nẵng 550000, Vietnam",
    icon: "🥖 Bánh mì 越式法包",
    intro: "主打陶甕烤脆皮豬腩的本地 bánh mì 店，肉在店內現烤、常見本地客排隊，早上5時半開門。",
    vnd: "₫25,000–35,000",
    signatures: "Heo nướng lu 脆皮豬腩 Bánh mì、加肉版",
    hours: "05:30起；中段休息及售罄情況出發前核對",
    filter: "Bánh mì 專門；Google 4.0+；500+評論；近期產品評論；反誘評抽查",
    audit: "抽查 free water、review、5 star、gift；購買法包附樽裝水為一般產品組合，未見與評論或指定星級掛鈎",
    price_note: "基本法包常見 ₫25,000；加肉後預算約 ₫35,000"
  }
]

held_or_excluded = [
  ["Coco Smoocha", 4.9, 260, "暫緩", "菜單高度吻合，但店方在 Google Business Profile 社群披露收到 fake or paid reviews 警告並被移除36則評論；店方有異議，未能證明誘評，但評論完整性風險未消除"],
  ["Bánh mì Cô Tiên", 4.8, 6624, "暫緩", "未見明確誘評證據，但2026-08中旬近期評論出現雞肉硬骨／軟骨及店方未處理的嚴重食安與服務投訴；先觀察後續評論"],
  ["Bánh Mì Ông Tý", 3.8, 154, "排除", "低於既定 Google 4.0 最低門檻"],
  ["Roots Plant-Based Cafe", 4.7, 4000, "排除", "純素專門店，按原有條件排除"],
  ["KURUMI", 4.9, 2500, "排除", "純素／植物性專門店，按原有條件排除"],
  ["IVEGAN SUPERSHOP", 4.9, 2200, "排除", "純素專門店，按原有條件排除"]
]

def hkd_text(vnd)
  nums = vnd.scan(/[\d,]+/).map { |n| n.delete(",").to_i }.select { |n| n >= 1000 }
  return "待核對" if nums.empty?
  converted = nums.first(2).map { |n| (n / RATE).round }
  converted.length == 1 ? "約 HK$#{converted[0]}" : "約 HK$#{converted[0]}–#{converted[1]}"
end

headers = [
  "店名", "地址", "圖標類型", "Google評分", "Google評論數", "店鋪簡介",
  "人均消費（VND）", "人均消費（HKD）", "招牌項目", "早餐／營業時間",
  "Google Maps", "篩選條件", "誘評抽查", "核對日期", "價格備註"
]

CSV.open("da-nang-breakfast-banh-mi-vetted-map.csv", "w", write_headers: true, headers: headers) do |csv|
  rows.each do |r|
    csv << [
      r[:name], r[:address], r[:icon], format("%.1f", r[:rating]), r[:reviews], r[:intro],
      r[:vnd], hkd_text(r[:vnd]), r[:signatures], r[:hours],
      "https://www.google.com/maps/search/?api=1&query=#{URI.encode_www_form_component(r[:name] + " Da Nang")}",
      r[:filter], r[:audit], AUDIT_DATE, r[:price_note]
    ]
  end
end

CSV.open("da-nang-breakfast-banh-mi-review-incentive-audit.csv", "w", write_headers: true, headers: [
  "店名", "Google評分", "Google評論數", "審核結果", "誘評／品質證據判斷", "核對日期"
]) do |csv|
  rows.each do |r|
    csv << [r[:name], format("%.1f", r[:rating]), r[:reviews], "通過", r[:audit] + "；搜尋樣本未見不等於永久保證", AUDIT_DATE]
  end
  held_or_excluded.each { |r| csv << r + [AUDIT_DATE] }
end

puts "WROTE da-nang-breakfast-banh-mi-vetted-map.csv: #{rows.length} rows"
puts "WROTE da-nang-breakfast-banh-mi-review-incentive-audit.csv: #{rows.length + held_or_excluded.length} rows"
