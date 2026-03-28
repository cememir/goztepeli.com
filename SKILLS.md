# Projede Kullanılan Teknolojiler

## Frontend

| Teknoloji | Kullanım Amacı |
|-----------|---------------|
| **HTML5** | Semantik sayfa yapısı (`article`, `section`, `nav`, `header`, `footer`) |
| **CSS3** | Custom Properties, Grid, Flexbox, responsive tasarım, animasyonlar |
| **Vanilla JavaScript (ES6+)** | DOM manipülasyonu, Fetch API, async/await, localStorage |

## Servisler ve Araçlar

| Servis | Kullanım Amacı |
|--------|---------------|
| **GitHub Pages** | Statik site hosting (ücretsiz) |
| **API-Football (RapidAPI)** | Trendyol Süper Lig canlı puan durumu verisi |
| **Font Awesome 6 (CDN)** | İkon kütüphanesi |

## Geliştirme Ortamı

| Araç | Kullanım Amacı |
|------|---------------|
| **Claude Code** | AI destekli kod geliştirme |
| **Git** | Versiyon kontrolü |
| **GitHub** | Uzak depo ve GitHub Pages deploy |
| **PyCharm** | IDE |
| **PuTTY (plink / pscp)** | Windows'tan VPS sunucusuna SSH bağlantısı ve dosya transferi |

## Sunucu Altyapısı

| Bileşen | Detay |
|---------|-------|
| **VPS** | 185.130.57.42 — Linux, root erişimi |
| **nginx** | Web sunucusu |
| **OpenSSH** | Anahtar tabanlı kimlik doğrulama (ed25519) |

## Mimari Kararlar

- **Sıfır bağımlılık:** `npm`, `node_modules` veya harici build aracı yok
- **Progressive Enhancement:** API key olmadan site statik veriyle çalışır
- **localStorage Cache:** Puan durumu 1 saat önbelleklenir (API istek limiti koruması)
- **Mobile-first:** Tüm bileşenler mobil uyumlu, responsive breakpoint'ler dahil
- **Çift deploy:** GitHub Pages (CDN) + VPS (nginx) — iki ortamda da çalışır
