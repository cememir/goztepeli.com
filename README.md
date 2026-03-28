# Göztepe Fan Sitesi

Göztepe Spor Kulübü taraftarları için hazırlanmış statik HTML/CSS/JavaScript fan web sitesi.
GitHub Pages üzerinde ücretsiz olarak yayınlanmaktadır.

---

## Sayfalar

| Sayfa | Dosya | İçerik |
|-------|-------|--------|
| Ana Sayfa | `index.html` | Trendyol Süper Lig puan durumu tablosu |
| Marşlar | `marslar.html` | Göztepe marşları ve söz kitabı |
| Videolar | `videolar.html` | YouTube maç özetleri ve tribün videoları |
| Tarihçe | `tarihce.html` | 1925'ten günümüze Göztepe'nin hikayesi |

---

## Kurulum (Yerel)

```bash
# 1. Repoyu klonla
git clone https://github.com/KULLANICI_ADI/goztepeli.com.git
cd goztepeli.com

# 2. (Opsiyonel) API key dosyasını oluştur
cp js/config.js.example js/config.js
# Açılan dosyada RAPIDAPI_KEY değerini kendi key'inizle değiştirin

# 3. index.html'yi tarayıcıda aç — sunucu gerekmez!
```

---

## API Key Kurulumu (Canlı Puan Durumu)

Canlı Trendyol Süper Lig verisi için **ücretsiz** bir RapidAPI hesabı yeterlidir.

1. [RapidAPI](https://rapidapi.com/api-sports/api/api-football) adresinde ücretsiz hesap oluşturun
2. "API-Football" servisine abone olun (ücretsiz plan: 100 istek/gün)
3. API key'inizi kopyalayın
4. Projede `js/config.js` dosyası oluşturun:
   ```javascript
   const API_CONFIG = {
     RAPIDAPI_KEY: 'API_KEY_BURAYA'
   };
   ```
5. Sayfa yenilendiğinde canlı veriler otomatik yüklenir

> **Not:** `js/config.js` `.gitignore`'dadır — asla commit etmeyin!
>
> API key olmadan site yine çalışır, 2024–25 sezonu statik verisi gösterilir.

---

## GitHub Pages'e Deploy

1. GitHub'da repoyu açın: **Settings** → **Pages**
2. **Branch:** `main`, **Folder:** `/ (root)` seçin
3. **Save** tıklayın
4. Birkaç dakika sonra siteniz şu adreste yayında:
   `https://KULLANICI_ADI.github.io/goztepeli.com/`

---

## Dosya Yapısı

```
goztepeli.com/
├── index.html              # Ana sayfa — Puan durumu
├── marslar.html            # Marşlar sayfası
├── videolar.html           # YouTube videoları
├── tarihce.html            # Göztepe tarihçesi
├── css/
│   └── style.css           # Tüm stiller
├── js/
│   ├── main.js             # Ortak JavaScript (nav, scroll)
│   ├── standings.js        # Puan durumu mantığı (API + cache + fallback)
│   ├── config.js           # API key — GİTİGNORE'DA (elle oluşturulur)
│   └── config.js.example   # Örnek config dosyası
├── images/                 # Görseller
├── README.md
├── SKILLS.md
└── CLAUDE.md
```

---

## Teknoloji

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Hosting:** GitHub Pages
- **Puan Durumu API:** API-Football via RapidAPI (opsiyonel)
- **Videolar:** YouTube Embed API
- **İkonlar:** Font Awesome 6

---

## Resmi Bağlantılar

- **Göztepe Spor Kulübü:** [goztepespor.org](https://www.goztepespor.org/)
- **Wikipedia:** [Göztepe S.K.](https://tr.wikipedia.org/wiki/G%C3%B6ztepe_S.K.)
- **TFF:** [tff.org](https://www.tff.org)

---

> Bu site bir fan projesidir. Göztepe Spor Kulübü ile resmi bir bağlantısı yoktur.
