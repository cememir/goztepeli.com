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

// API-Football: Trendyol Süper Lig = league 203, sezon 2025
const API_URL = 'https://api-football-v1.p.rapidapi.com/v3/standings?league=203&season=2025';
const API_HOST = 'api-football-v1.p.rapidapi.com';

// ---- 2025-26 Sezonu Statik Fallback Verisi ----
// 26. Hafta sonuçları — Mart 2026 (Kaynak: Hürriyet Spor)
const STATIC_STANDINGS = [
  { rank: 1,  name: 'Galatasaray',        played: 26, won: 20, drawn: 4,  lost: 2,  goalsFor: 65, goalsAgainst: 22, gd: 43, points: 64, zone: 'champions' },
  { rank: 2,  name: 'Fenerbahçe',         played: 26, won: 17, drawn: 6,  lost: 3,  goalsFor: 55, goalsAgainst: 28, gd: 27, points: 57, zone: 'champions' },
  { rank: 3,  name: 'Trabzonspor',        played: 26, won: 18, drawn: 3,  lost: 5,  goalsFor: 52, goalsAgainst: 30, gd: 22, points: 57, zone: 'champions' },
  { rank: 4,  name: 'Beşiktaş',           played: 26, won: 13, drawn: 7,  lost: 6,  goalsFor: 45, goalsAgainst: 35, gd: 10, points: 46, zone: 'europa' },
  { rank: 5,  name: 'Göztepe',            played: 26, won: 12, drawn: 7,  lost: 7,  goalsFor: 38, goalsAgainst: 33, gd: 5,  points: 43, zone: 'europa' },
  { rank: 6,  name: 'RAMS Başakşehir',    played: 26, won: 12, drawn: 6,  lost: 8,  goalsFor: 37, goalsAgainst: 35, gd: 2,  points: 42, zone: 'conference' },
  { rank: 7,  name: 'Kocaelispor',        played: 26, won: 9,  drawn: 6,  lost: 11, goalsFor: 30, goalsAgainst: 38, gd: -8, points: 33, zone: '' },
  { rank: 8,  name: 'Gaziantep FK',       played: 26, won: 9,  drawn: 6,  lost: 11, goalsFor: 28, goalsAgainst: 36, gd: -8, points: 33, zone: '' },
  { rank: 9,  name: 'Samsunspor',         played: 26, won: 9,  drawn: 5,  lost: 12, goalsFor: 30, goalsAgainst: 40, gd: -10, points: 32, zone: '' },
  { rank: 10, name: 'Çaykur Rizespor',    played: 26, won: 8,  drawn: 6,  lost: 12, goalsFor: 26, goalsAgainst: 40, gd: -14, points: 30, zone: '' },
  { rank: 11, name: 'Alanyaspor',         played: 26, won: 7,  drawn: 7,  lost: 12, goalsFor: 29, goalsAgainst: 42, gd: -13, points: 28, zone: '' },
  { rank: 12, name: 'Konyaspor',          played: 26, won: 7,  drawn: 6,  lost: 13, goalsFor: 27, goalsAgainst: 42, gd: -15, points: 27, zone: '' },
  { rank: 13, name: 'Gençlerbirliği',     played: 26, won: 7,  drawn: 4,  lost: 15, goalsFor: 25, goalsAgainst: 44, gd: -19, points: 25, zone: '' },
  { rank: 14, name: 'Antalyaspor',        played: 26, won: 6,  drawn: 6,  lost: 14, goalsFor: 22, goalsAgainst: 42, gd: -20, points: 24, zone: '' },
  { rank: 15, name: 'Eyüpspor',           played: 26, won: 6,  drawn: 4,  lost: 16, goalsFor: 24, goalsAgainst: 48, gd: -24, points: 22, zone: '' },
  { rank: 16, name: 'Kasımpaşa',          played: 26, won: 6,  drawn: 3,  lost: 17, goalsFor: 22, goalsAgainst: 50, gd: -28, points: 21, zone: 'relegation' },
  { rank: 17, name: 'Kayserispor',        played: 26, won: 5,  drawn: 5,  lost: 16, goalsFor: 20, goalsAgainst: 48, gd: -28, points: 20, zone: 'relegation' },
  { rank: 18, name: 'Fatih Karagümrük',   played: 26, won: 4,  drawn: 5,  lost: 17, goalsFor: 22, goalsAgainst: 52, gd: -30, points: 17, zone: 'relegation' },
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
