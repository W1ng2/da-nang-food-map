require "csv"
require "uri"

AUDIT_DATE = "2026-08-18"
RATE = 3350.0

rows = [
  ["Pizza 4P’s", 4.9, 12401, "74 Bạch Đằng, Hải Châu, Đà Nẵng, Vietnam", "🇮🇹 意大利菜", "人氣極高的日越風格薄餅餐廳，以自家製芝士和開放式烤爐見稱。", "₫200,000–700,000", "自家製 Burrata、Half-half Pizza、Margherita Pizza"],
  ["Nhà hàng Nhà Gỗ Việt Đà Nẵng", 4.9, 6745, "49 Nguyễn Thái Học, Hải Châu, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "木屋風格的越南菜餐廳，適合多人分享中部及經典越南菜。", "₫100,000–300,000", "Bánh xèo、越式春卷、越南家常菜拼盤"],
  ["All Seasons Buffet Da Nang", 4.9, 5486, "193 Nguyễn Văn Thoại, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🍱 自助餐", "大型自助餐餐廳，主打海鮮、燒烤、熱盤及甜品，適合想一次試多款食物。", "₫1,000,000 以上", "海鮮自助餐、即燒肉類、甜品區"],
  ["Nhà hàng Làn Gió", 4.9, 4641, "169 Trần Phú, Hải Châu, Đà Nẵng, Vietnam", "🦐 海鮮", "市中心越南海鮮餐廳，菜式選擇廣，適合多人共享。", "₫200,000–700,000", "蒜油蟶子、海鮮菜式、Bánh xèo"],
  ["Vietnam Daily Cuisine", 4.9, 2900, "10 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "旅客區內的越南料理店，環境容易入門，供應多款經典越南菜。", "₫100,000–200,000", "牛肉河粉、香脆春卷、蛋咖啡"],
  ["Gypsy Rooftop Restaurant & Bar", 4.9, 2443, "20 Đống Đa, Hải Châu, Đà Nẵng, Vietnam", "🌇 Rooftop／景觀餐廳", "位於高層的現代餐廳及酒吧，以城市景觀、精緻餐飲和調酒為賣點。", "₫1,000,000 以上", "季節性主廚菜單、扒類、招牌調酒"],
  ["Bistecca - Italian Restaurant in Da Nang", 4.9, 2207, "20 Đống Đa, Hải Châu, Đà Nẵng, Vietnam", "🇮🇹 意大利菜", "酒店內意大利餐廳，主打扒類、意粉和經典西式菜。", nil, "牛扒、意粉、意式薄餅"],
  ["Hùng 68 Restaurant - Food and Drink", 4.9, 1988, "110 Trường Sa, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "近海邊的親民越南家常菜餐廳，價格較容易控制。", "₫100,000 以下", "越南家常小炒、麵食、海鮮菜式"],
  ["Hoang’s Kitchen Đà Nẵng - Vietnamese & Vegan Food", 4.9, 1960, "40 Hà Bổng, An Hải, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "同時供應傳統越南菜及純素選項的混合餐廳，並非素食專門店。", "₫100,000–300,000", "Bánh xèo、河粉、越式春卷、純素選項"],
  ["NGON DA NANG - VIETNAMESE CUISINE RESTAURANT", 4.9, 1889, "88B Lê Quang Đạo, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "近美溪海灘的現代越南菜餐廳，環境舒適，菜式涵蓋多個地區。", "₫100,000–600,000", "河粉、烤海鮮、鮮春卷、Bánh xèo"],
  ["Vietnom Local Eatery", 4.9, 1731, "97 Mai Thúc Lân, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "現代小館形式的越南菜餐廳，擺盤較精緻，蔬菜比例高。", "₫100,000–200,000", "越式春卷、米紙卷、越南家常菜"],
  ["Riverside Terrace Restaurant", 4.9, 1466, "493 Trần Hưng Đạo, Sơn Trà, Đà Nẵng, Vietnam", "🇮🇹 意大利菜", "河畔露台餐廳，以意大利及西式菜配合河景，適合晚餐。", "₫200,000–600,000", "意粉、薄餅、烤海鮮"],
  ["Cá Gỗ Vietnamese Restaurant", 4.9, 1454, "278 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "海邊一帶的越南菜餐廳，菜單橫跨越南北中南風味。", "₫100,000–300,000", "越南三地家常菜、Bánh xèo、烤魚"],
  ["MAMA MASALA INDIAN CUISINE Da Nang", 4.9, 881, "376 Trần Hưng Đạo, Sơn Trà, Đà Nẵng, Vietnam", "🇮🇳 印度菜", "印度菜餐廳，主打香料咖喱、烤爐菜和薄餅。", "₫100,000–200,000", "Butter Chicken、Tandoori、Garlic Naan"],
  ["Gravel House BBQ Restaurant Da Nang", 4.9, 816, "91 Trần Phú, Hải Châu, Đà Nẵng, Vietnam", "🇰🇷 韓式燒肉", "韓式燒肉店，以廚房代烤方式減少油煙，鄰近韓市場。", "₫200,000–800,000", "韓式五花腩、豬頸肉、韓式小菜及湯飯"],
  ["ClayPot Bar and Restaurant", 4.9, 628, "32 Võ Nghĩa, Sơn Trà, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "結合越南菜與酒吧氣氛的餐廳，營業至較夜時間。", "₫100,000–300,000", "Bún chả、砂鍋菜、越南小食"],
  ["Ky Vat - Vietnamese Restaurant", 4.9, 603, "56A Lê Hồng Phong, Hải Châu, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "市中心較精緻的越南料理店，適合想在舒適環境試本地菜。", nil, "越南地方菜、米紙卷、季節性菜式"],
  ["Nhà hàng Thiên Kim", 4.8, 12439, "166 Bạch Đằng, Hải Châu, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "漢江附近的高人氣越南餐廳，菜式廣泛，適合家庭或多人用餐。", "₫100,000–300,000", "越南家常菜、炒飯、海鮮菜式"],
  ["Thèm Hải Sản", 4.8, 10521, "39 Trần Bạch Đằng, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🦐 海鮮", "美溪海灘附近的大型海鮮餐廳，適合多人挑選鮮活海產。", nil, "燒蝦、貝類、時價鮮活海鮮"],
  ["Nhà Bếp Xưa Restaurant", 4.8, 9010, "64 Hà Bổng, Sơn Trà, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "人氣越南餐廳，裝潢帶懷舊感，供應旅客易接受的傳統菜。", "₫100,000–200,000", "Bánh xèo、越式春卷、河粉"],
  ["Burger House Da Nang", 4.8, 7622, "253 D. Đình Nghệ, An Hải, Đà Nẵng, Vietnam", "🍔 漢堡", "專門漢堡店，評論量高，主打足料牛肉漢堡及多款芝士配搭。", "₫100,000–200,000", "芝士牛肉漢堡、Blue Cheese Burger、Roast Garlic Burger"],
  ["Miss NHI", 4.8, 6868, "39 An Thượng 30, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "安上區的越南菜餐廳，經典菜及海鮮選擇豐富。", "₫100,000–200,000", "椰子炒飯、辣鹽烤蝦、河粉"],
  ["Nhà hàng NHÀ BẾP CHỢ HÀN", 4.8, 6702, "22 Hùng Vương, Hải Châu, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "鄰近韓市場的越南菜餐廳，位置方便，主打價格相對親民的經典菜。", "₫100,000–200,000", "Bánh xèo、越式春卷、烤肉米線"],
  ["MAAZI Da Nang", 4.8, 4516, "264 Trần Phú, Hải Châu, Đà Nẵng, Vietnam", "🇮🇳 印度菜", "市中心印度餐廳及酒吧，咖喱、烤爐菜及素食選項齊全。", "₫100,000–300,000", "Butter Chicken、Biryani、Naan"],
  ["LoCo Restaurant - Danang Seafood Restaurant", 4.8, 4078, "1C Lê Duẩn, Hải Châu, Đà Nẵng, Vietnam", "🦐 海鮮", "漢江北端附近的越南海鮮餐廳，提供適合分享的拼盤及本地菜。", "₫100,000–600,000", "海鮮拼盤、燒海鮮、越南菜拼盤"],
  ["Nhà An - Vietnamese local food restaurant and vegan", 4.8, 3462, "101 Hồ Nghinh, An Hải, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "供應越南本地菜及純素選項的混合餐廳，並非素食專門店。", "₫100,000–200,000", "豬肉米紙卷、素河粉、Bánh xèo"],
  ["EMO'S HOMECOOKED VIETNAMESE CUISINE", 4.8, 3200, "16 Đường Mỹ Khê 4, An Hải, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "以家常風味為主的越南菜餐廳，菜式親切、環境休閒。", "₫100,000–200,000", "EMO 招牌飯、焦糖豬腩、鮮春卷"],
  ["BHOJAN INDIAN RESTAURANT", 4.8, 2796, "20-22 Lê Quang Đạo, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇮🇳 印度菜", "美溪一帶的印度餐廳，菜單涵蓋北印度咖喱及烤爐菜。", "₫100,000–300,000", "Biryani、Tandoori Chicken、Butter Chicken"],
  ["Butcher Steak", 4.8, 2632, "64 Lê Quang Đạo, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🥩 牛扒／扒房", "專門牛扒及燒烤肉類的休閒扒房，適合肉食愛好者。", nil, "牛扒、烤肉拼盤、配菜"],
  ["Bếp Lụa Vietnamese Restaurant", 4.8, 2264, "94 Bạch Đằng, Hải Châu, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "白藤街上的平價越南餐廳，供應家常菜及常見越南主食。", "₫100,000 以下", "河粉、春卷、炒飯"],
  ["Nazaare - Indian Beach Restaurant and Bar", 4.8, 2021, "Lô 02 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng, Vietnam", "🇮🇳 印度菜", "海濱印度餐廳及酒吧，景觀和用餐氣氛較突出。", "₫200,000–800,000", "Tandoori、Biryani、印度咖喱、調酒"],
  ["Rainbowl Poke", 4.8, 1679, "97 Mai Thúc Lân, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🌺 Poke／健康碗", "主打夏威夷 Poke、健康碗和輕食的休閒餐廳。", "₫100,000–200,000", "Spicy Cay Cay Poke、Smoothie Bowl、Sushi Taco"],
  ["Nhà hàng Mr.Anh", 4.8, 1529, "340 Ông Ích Khiêm, Thanh Khê, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "帶中部越南風格的本地餐廳，距離遊客區較遠，適合配合市區行程。", "₫100,000–200,000", "烤肉米線配 Nem lụi、蒜炒通菜"],
  ["MiRi Hôm Vietnamese Cuisine", 4.8, 1320, "199 Nguyễn Văn Thoại, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇻🇳 越南菜", "近美溪海灘的較精緻越南餐廳，環境安靜，適合晚餐。", "₫200,000–600,000", "越式海鮮、春卷、越南家常主菜"],
  ["MANVAR Rasoi Indian Restaurant", 4.8, 1083, "37 Chế Lan Viên, Ngũ Hành Sơn, Đà Nẵng, Vietnam", "🇮🇳 印度菜", "印度菜餐廳，菜式由街頭小食、咖喱到烤爐菜均有。", "₫100,000–200,000", "Chilli Gobi、Chicken Tikka、Biryani、Gulab Jamun"],
  ["Sky View Restaurant", 4.8, 917, "216 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng, Vietnam", "🌇 Rooftop／景觀餐廳", "海景酒店高層餐廳，賣點是景觀及較正式的西式用餐體驗。", nil, "牛扒、烤海鮮、景觀調酒"],
  ["Vị Brewhouse", 4.8, 627, "37 Quang Trung, Hải Châu, Đà Nẵng, Vietnam", "🍺 精釀啤酒", "本地精釀啤酒餐廳，適合配越南小食或晚間聚會。", "₫100,000–200,000", "店釀啤酒、啤酒試飲組合、越南小食"],
  ["DOM Bistro", 4.8, 623, "3 Phan Bội Châu, Hải Châu, Đà Nẵng, Vietnam", "🥩 牛扒／扒房", "市中心牛扒與葡萄酒餐廳，氣氛較適合約會或正式晚餐。", nil, "T-Bone、Rib-eye、Tomahawk、Wine Pairing"]
]

def hkd_text(vnd)
  return "Google Maps 未提供公開人均區間" unless vnd
  nums = vnd.scan(/[\d,]+/).map { |n| n.delete(",").to_i }.reject(&:zero?)
  if vnd.include?("以上")
    "約 HK$#{(nums.first / RATE).round} 以上"
  elsif vnd.include?("以下")
    "約 HK$#{(nums.first / RATE).round} 以下"
  else
    "約 HK$#{(nums[0] / RATE).round}–#{(nums[1] / RATE).round}"
  end
end

out = "da-nang-non-michelin-google-48-map.csv"
CSV.open(out, "w", write_headers: true, headers: [
  "餐廳名稱", "地址", "圖標類型", "Google評分", "Google評論數",
  "餐廳簡介", "人均消費（VND）", "人均消費（HKD）", "餐廳名物",
  "Google Maps", "篩選條件", "核對日期", "價格備註"
]) do |csv|
  rows.each do |name, rating, reviews, address, icon, intro, vnd, signatures|
    csv << [
      name, address, icon, format("%.1f", rating), reviews, intro,
      vnd || "Google Maps 未提供公開人均區間", hkd_text(vnd), signatures,
      "https://www.google.com/maps/search/?api=1&query=#{URI.encode_www_form_component(name + " Da Nang")}",
      "非 Michelin；Google 評論 500+；評分 4.8+；非素食專門店",
      AUDIT_DATE,
      vnd ? "Google Maps 使用者回報區間；未含酒水，海鮮或特殊食材或按重量／時價" : "未自行估價；請查看餐廳最新菜單"
    ]
  end
end

puts "WROTE #{out}: #{rows.length} rows"
