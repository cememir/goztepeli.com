# Projede Kullanılan Teknolojiler

## Frontend

| Teknoloji | Kullanım Amacı |
|-----------|---------------|
| **HTML5** | Semantik sayfa yapısı (`article`, `section`, `nav`, `header`, `footer`, `aside`) |
| **CSS3** | Özel değişkenler (Custom Properties), Grid, Flexbox, responsive tasarım, animasyonlar |
| **Vanilla JavaScript (ES6+)** | DOM manipülasyonu, Fetch API, async/await, localStorage |

## Servisler ve Araçlar

| Servis | Kullanım Amacı |
|--------|---------------|
| **GitHub Pages** | Statik site hosting (ücretsiz) |
| **API-Football (RapidAPI)** | Trendyol Süper Lig canlı puan durumu verisi |
| **YouTube Embed API** | Video sayfasındaki YouTube embed'leri |
| **Font Awesome 6 (CDN)** | İkon kütüphanesi |

## Geliştirme Ortamı

| Araç | Kullanım Amacı |
|------|---------------|
| **Claude Code** | AI destekli kod geliştirme |
| **Git** | Versiyon kontrolü |
| **GitHub** | Uzak depo ve GitHub Pages deploy |
| **PyCharm** | IDE |

## Mimari Kararlar

- **Sıfır bağımlılık:** `npm`, `node_modules` veya harici build aracı yok
- **Progressive Enhancement:** API key olmadan site statik veriyle çalışır
- **localStorage Cache:** Puan durumu 1 saat önbelleklenir (API istek limiti koruması)
- **Mobile-first:** Tüm bileşenler mobil uyumlu, responsive breakpoint'ler dahil
