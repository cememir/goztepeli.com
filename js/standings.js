/**
 * Göztepe Fan Sitesi - standings.js
 * Trendyol Süper Lig puan durumu
 *
 * Mimari:
 *  1. localStorage cache kontrolü (1 saatlik TTL)
 *  2. API-Football (RapidAPI) canlı veri çekme
 *  3. Static fallback (API başarısız olursa)
 */

const CACHE_KEY = 'goztep_standings';
const CACHE_TTL = 60 * 60 * 1000; // 1 saat (ms)

// API-Football: Trendyol Süper Lig = league 203, sezon 2024
const API_URL = 'https://api-football-v1.p.rapidapi.com/v3/standings?league=203&season=2024';
const API_HOST = 'api-football-v1.p.rapidapi.com';

// ---- 2024-25 Sezonu Statik Fallback Verisi ----
// (Mart 2025 sonrası tahmini sıralama – API ile otomatik güncellenir)
const STATIC_STANDINGS = [
  { rank: 1,  name: 'Galatasaray',       played: 34, won: 25, drawn: 6,  lost: 3,  goalsFor: 82, goalsAgainst: 31, gd: 51, points: 81, zone: 'champions' },
  { rank: 2,  name: 'Fenerbahçe',        played: 34, won: 24, drawn: 5,  lost: 5,  goalsFor: 75, goalsAgainst: 32, gd: 43, points: 77, zone: 'champions' },
  { rank: 3,  name: 'Beşiktaş',          played: 34, won: 18, drawn: 7,  lost: 9,  goalsFor: 61, goalsAgainst: 44, gd: 17, points: 61, zone: 'champions' },
  { rank: 4,  name: 'Trabzonspor',       played: 34, won: 17, drawn: 8,  lost: 9,  goalsFor: 56, goalsAgainst: 42, gd: 14, points: 59, zone: 'europa' },
  { rank: 5,  name: 'Başakşehir',        played: 34, won: 16, drawn: 7,  lost: 11, goalsFor: 52, goalsAgainst: 45, gd: 7,  points: 55, zone: 'conference' },
  { rank: 6,  name: 'Kasımpaşa',         played: 34, won: 14, drawn: 8,  lost: 12, goalsFor: 48, goalsAgainst: 46, gd: 2,  points: 50, zone: '' },
  { rank: 7,  name: 'Sivasspor',         played: 34, won: 13, drawn: 9,  lost: 12, goalsFor: 44, goalsAgainst: 43, gd: 1,  points: 48, zone: '' },
  { rank: 8,  name: 'Konyaspor',         played: 34, won: 13, drawn: 8,  lost: 13, goalsFor: 41, goalsAgainst: 46, gd: -5, points: 47, zone: '' },
  { rank: 9,  name: 'Göztepe',           played: 34, won: 12, drawn: 9,  lost: 13, goalsFor: 43, goalsAgainst: 47, gd: -4, points: 45, zone: '' },
  { rank: 10, name: 'Kayserispor',       played: 34, won: 12, drawn: 8,  lost: 14, goalsFor: 40, goalsAgainst: 48, gd: -8, points: 44, zone: '' },
  { rank: 11, name: 'Antalyaspor',       played: 34, won: 11, drawn: 9,  lost: 14, goalsFor: 39, goalsAgainst: 49, gd: -10, points: 42, zone: '' },
  { rank: 12, name: 'Alanyaspor',        played: 34, won: 11, drawn: 8,  lost: 15, goalsFor: 43, goalsAgainst: 52, gd: -9, points: 41, zone: '' },
  { rank: 13, name: 'Samsunspor',        played: 34, won: 10, drawn: 10, lost: 14, goalsFor: 38, goalsAgainst: 48, gd: -10, points: 40, zone: '' },
  { rank: 14, name: 'Gaziantep FK',      played: 34, won: 10, drawn: 9,  lost: 15, goalsFor: 37, goalsAgainst: 51, gd: -14, points: 39, zone: '' },
  { rank: 15, name: 'Hatayspor',         played: 34, won: 9,  drawn: 9,  lost: 16, goalsFor: 35, goalsAgainst: 54, gd: -19, points: 36, zone: '' },
  { rank: 16, name: 'Rizespor',          played: 34, won: 8,  drawn: 8,  lost: 18, goalsFor: 34, goalsAgainst: 58, gd: -24, points: 32, zone: '' },
  { rank: 17, name: 'Adana Demirspor',   played: 34, won: 7,  drawn: 7,  lost: 20, goalsFor: 31, goalsAgainst: 63, gd: -32, points: 28, zone: 'relegation' },
  { rank: 18, name: 'Pendikspor',        played: 34, won: 5,  drawn: 6,  lost: 23, goalsFor: 26, goalsAgainst: 72, gd: -46, points: 21, zone: 'relegation' },
  { rank: 19, name: 'İstanbulspor',      played: 34, won: 4,  drawn: 7,  lost: 23, goalsFor: 23, goalsAgainst: 68, gd: -45, points: 19, zone: 'relegation' },
];

/* ================================================================
   Ana Fonksiyon – Sayfa yüklendiğinde çağrılır
   ================================================================ */
async function initStandings() {
  const container = document.getElementById('standings-body');
  const badge = document.getElementById('data-badge');

  if (!container) return;

  // 1. Cache kontrolü
  const cached = getCache();
  if (cached) {
    renderStandings(cached, container);
    setBadge(badge, 'live', 'Önbellekten');
    return;
  }

  // 2. API key kontrolü
  if (typeof API_CONFIG === 'undefined' || !API_CONFIG.RAPIDAPI_KEY || API_CONFIG.RAPIDAPI_KEY === 'BURAYA_RAPIDAPI_KEY_GIRIN') {
    renderStandings(STATIC_STANDINGS, container);
    setBadge(badge, 'static', 'Statik Veri');
    return;
  }

  // 3. Yükleniyor göster
  showLoading(container);

  try {
    const data = await fetchFromAPI();
    const teams = transformAPIData(data);

    if (teams && teams.length > 0) {
      setCache(teams);
      renderStandings(teams, container);
      setBadge(badge, 'live', 'Canlı Veri');
    } else {
      throw new Error('Boş veri');
    }
  } catch (err) {
    console.warn('API hatası, statik veri kullanılıyor:', err.message);
    renderStandings(STATIC_STANDINGS, container);
    setBadge(badge, 'error', 'Statik Veri (API Hatası)');
  }
}

/* ---- API Çağrısı ---- */
async function fetchFromAPI() {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_CONFIG.RAPIDAPI_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

/* ---- API Verisini Dönüştür ---- */
function transformAPIData(data) {
  try {
    const standings = data.response[0].league.standings[0];
    return standings.map(team => ({
      rank: team.rank,
      name: team.team.name,
      played: team.all.played,
      won: team.all.win,
      drawn: team.all.draw,
      lost: team.all.lose,
      goalsFor: team.all.goals.for,
      goalsAgainst: team.all.goals.against,
      gd: team.goalsDiff,
      points: team.points,
      zone: getZone(team.rank)
    }));
  } catch {
    return null;
  }
}

/* ---- Zon Belirleme ---- */
function getZone(rank) {
  if (rank <= 2) return 'champions';
  if (rank === 3) return 'europa';
  if (rank === 4 || rank === 5) return 'conference';
  if (rank >= 17) return 'relegation';
  return '';
}

/* ---- Tabloyu Render Et ---- */
function renderStandings(teams, container) {
  container.innerHTML = '';

  teams.forEach(team => {
    const row = document.createElement('tr');
    const isGoztep = team.name.toLowerCase().includes('göztepe') ||
                     team.name.toLowerCase().includes('goztepe');

    if (isGoztep) row.classList.add('goztep-row');
    if (team.zone) row.classList.add(`zone-${team.zone}`);

    row.innerHTML = `
      <td class="rank-cell">${team.rank}</td>
      <td>${isGoztep ? '<strong>⭐ ' + team.name + '</strong>' : team.name}</td>
      <td>${team.played}</td>
      <td>${team.won}</td>
      <td>${team.drawn}</td>
      <td>${team.lost}</td>
      <td>${team.goalsFor}</td>
      <td>${team.goalsAgainst}</td>
      <td>${team.gd > 0 ? '+' + team.gd : team.gd}</td>
      <td class="points-cell">${team.points}</td>
    `;

    container.appendChild(row);
  });
}

/* ---- Yükleniyor ---- */
function showLoading(container) {
  container.innerHTML = `
    <tr>
      <td colspan="10" style="padding: 2rem; text-align: center; color: #666;">
        <div style="display:inline-flex; align-items:center; gap:0.75rem;">
          <div class="spinner-ring"></div>
          <span>Puan durumu yükleniyor...</span>
        </div>
      </td>
    </tr>
  `;
}

/* ---- Badge Güncelle ---- */
function setBadge(badge, type, text) {
  if (!badge) return;
  badge.className = `data-badge ${type}`;

  const icons = { live: '🟢', static: '🟡', error: '🔴' };
  badge.innerHTML = `${icons[type] || ''} ${text}`;
}

/* ---- localStorage Cache ---- */
function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage doluysa sessizce geç
  }
}

/* ---- Başlat ---- */
document.addEventListener('DOMContentLoaded', initStandings);
