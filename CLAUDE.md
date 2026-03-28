# Claude Code Proje Rehberi — Göztepe Fan Sitesi

## Proje Özeti

Göztepe Spor Kulübü fan sitesi. Pure HTML/CSS/Vanilla JS. Sunucu gerektirmez, GitHub Pages'de çalışır.
Aynı zamanda 185.130.57.42 adresindeki VPS sunucusuna da deploy edilmiştir.

## Dizin Yapısı

```
goztepeli.com/
├── index.html          # Ana sayfa — Süper Lig puan durumu
├── marslar.html        # Marşlar ve sözler
├── tarihce.html        # Göztepe tarihçesi (timeline formatında)
├── css/style.css       # Tüm stiller — BU DOSYAYI DEĞİŞTİR
├── js/main.js          # Ortak JS (nav, hamburger, scroll)
├── js/standings.js     # Puan durumu API + cache + fallback
├── js/config.js        # API key (GİTİGNORE — elle oluşturulur)
└── js/config.js.example # Kullanıcı için örnek
```

## Renk Paleti

```css
--goztep-red:    #E30613   /* Ana renk */
--goztep-yellow: #FFD700   /* Vurgu rengi */
--goztep-dark:   #1a1a1a   /* Footer, koyu arka plan */
```

Her zaman `css/style.css`'teki CSS custom properties kullanın. Inline renk kullanmayın.

## API Bilgisi

- **Servis:** API-Football (RapidAPI)
- **Endpoint:** `https://api-football-v1.p.rapidapi.com/v3/standings?league=203&season=2025`
- **League ID:** 203 (Trendyol Süper Lig)
- **Season:** 2025 (2025-26 sezonu)
- **Key dosyası:** `js/config.js` → `API_CONFIG.RAPIDAPI_KEY`
- **Cache:** localStorage, 1 saatlik TTL (`CACHE_KEY = 'goztep_standings'`)

## Önemli Kurallar

1. **`js/config.js` asla commit edilmez** — .gitignore'da
2. Site, `config.js` olmadan da çalışmalıdır (static fallback)
3. Tüm dış linkler `target="_blank" rel="noopener noreferrer"` ile açılmalı
4. Yeni sayfa eklenirken tüm `<nav>` elementleri güncellenmeli (3 HTML dosyası)
5. Resmi Göztepe sitesi: `https://www.goztepe.org.tr/`
6. Co-Authored-By kullanma.
7. wikipedia linki https://tr.wikipedia.org/wiki/G%C3%B6ztepe_(futbol_tak%C4%B1m%C4%B1)

## Yeni Sayfa Eklerken

1. Mevcut bir sayfayı şablon olarak kopyala
2. `<head>` başlığını ve meta description'ı güncelle
3. Nav'daki `active` linkini ayarla (main.js otomatik halleder)
4. Footer'ı aynı tut

## Puan Durumu Güncellerken

- `js/standings.js` içindeki `STATIC_STANDINGS` array'ini güncelle
- Her nesne: `{ rank, name, played, won, drawn, lost, goalsFor, goalsAgainst, gd, points, zone }`
- `zone` değerleri: `'champions'`, `'europa'`, `'conference'`, `'relegation'`, `''` (boş)

## GitHub Pages

- Branch: `main`, Folder: `/ (root)`
- `index.html` otomatik serve edilir
- Push sonrası 1-2 dakika içinde güncellenir

## VPS Sunucu Deployment (Windows)

- **Sunucu:** 185.130.57.42 (root)
- **Web dizini:** `/var/www/html/goztepelicom/`
- **Web sunucusu:** nginx
- **SSH anahtarı:** `~/.ssh/goztepeli_deploy` (OpenSSH ed25519, gitignore'da)
- **PuTTY:** `C:\Program Files\PuTTY\` — plink.exe ve pscp.exe kullanılır

### Deployment Adımları (Windows/PuTTY)

```bash
# 1. Yedeği al
plink -i ~/.ssh/goztepeli_deploy root@185.130.57.42 "cp -r /var/www/html/goztepelicom /var/www/html/goztepelicom_backup_$(date +%Y%m%d)"

# 2. Dosyaları kopyala (pscp ile)
pscp -i ~/.ssh/goztepeli_deploy -r C:\Users\cemem\PycharmProjects\goztepeli.com\*.html root@185.130.57.42:/var/www/html/goztepelicom/
pscp -i ~/.ssh/goztepeli_deploy -r C:\Users\cemem\PycharmProjects\goztepeli.com\css root@185.130.57.42:/var/www/html/goztepelicom/
pscp -i ~/.ssh/goztepeli_deploy -r C:\Users\cemem\PycharmProjects\goztepeli.com\js root@185.130.57.42:/var/www/html/goztepelicom/

# 3. nginx'i yeniden başlat
plink -i ~/.ssh/goztepeli_deploy root@185.130.57.42 "systemctl restart nginx"
```

> **Not:** SSH anahtarı commit edilmez. Public key sunucunun `~/.ssh/authorized_keys` dosyasında olmalıdır.
