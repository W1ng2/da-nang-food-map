require "csv"

input = ARGV.fetch(0)
output = ARGV.fetch(1)
rate = 3350.0
old_header = "人均消費（VND，約）"
new_header = old_header

rows = CSV.read(input, headers: true)
headers = rows.headers.map { |header| header == old_header ? new_header : header }

CSV.open(output, "w", write_headers: true, headers: headers, force_quotes: true) do |csv|
  rows.each do |row|
    price = row[old_header]
    bounds = price.scan(/[\d,]+/).map { |value| value.delete(",").to_i }
    hkd = bounds.map { |value| ((value / rate) / 5).round * 5 }
    converted = "#{price} VND（約 HK$#{hkd[0].to_s.reverse.scan(/.{1,3}/).join(',').reverse}–#{hkd[1].to_s.reverse.scan(/.{1,3}/).join(',').reverse}）"
    summary = "#{row['餐廳簡介']}｜人均：#{converted}"
    csv << headers.map do |header|
      if header == new_header
        converted
      elsif header == "餐廳簡介"
        summary
      else
        row[header]
      end
    end
  end
end
