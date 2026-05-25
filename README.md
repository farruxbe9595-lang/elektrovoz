# Elektrovozlarni ta’mirlovchi ishchi-xodimlar uchun bilimlarni sinash platformasi

Bu loyiha GitHub Pages uchun tayyor statik test platforma.

## Tarkib

- `index.html` — asosiy sahifa
- `style.css` — professional temir yo‘l/elektrovoz dizayni, gradient, glow, hover animatsiyalar
- `script.js` — test mantiqi, savol/javoblarni aralashtirish, Latin/Kirill rejimi, natija va CSV eksport
- `question_bank.js` — savollar bazasi
- `data_report.json` — savollar soni bo‘yicha qisqa hisobot

## Savollar statistikasi

- Yo‘nalishlar: 7
- Yakuniy savollar: 337
- Xom ajratilgan yozuvlar: 423

## Ishga tushirish

Oddiy usul: `index.html` faylini brauzerda oching.

GitHub Pages uchun: barcha fayllarni repository root qismiga yuklang va Pages xizmatini yoqing.

## Muhim

Bu versiya frontend asosida ishlaydi. Natijalar brauzer `localStorage` xotirasiga yoziladi va CSV qilib yuklab olish mumkin. Rasmiy imtihon rejimi uchun keyingi bosqichda Firebase/Supabase yoki Google Sheets bazasiga natija yozish moduli qo‘shish tavsiya etiladi.
