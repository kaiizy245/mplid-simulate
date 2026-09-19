/* ==========================================================
   MPL ID SIMULATE — sim.js (clean, no bugs)
   ========================================================== */

const SIM_KEY          = 'mplid_sim_overrides';
const PLAYER_STATS_KEY = 'mplid_player_stats_overrides';
const WEEKLY_STATS_KEY = 'mplid_weekly_stats';
const POINTS_KEY       = 'mplid_points';
const ROLE_UTAMA       = ['EXP Laner','Jungler','Mid Laner','Gold Laner','Roamer'];

/* ── Power Score ── */
const POWER_SCORE = {
  teamliquidid:93, bigetron:88, alterego:84, navi:80,
  rrq:76, onic:73, evos:70, dewaunited:67, geekfam:64,
};

function winChance(tA, tB) {
  const pA = POWER_SCORE[tA] || 75;
  const pB = POWER_SCORE[tB] || 75;
  const base  = pA / (pA + pB);
  const noise = (Math.random() - 0.5) * 0.16;
  return Math.min(0.90, Math.max(0.10, base + noise));
}

/* ── Hero pool ── */
const HERO_POOL = [
 {name:'Barats',  role:'EXP Laner',  pick:0.72,ban:0.55},
 {name:'Uranus',  role:'EXP Laner',  pick:0.72,ban:0.55},
  {name:'Badang',    role:'Roamer',  pick:0.65,ban:0.48},
  {name:'Guinevere',      role:'Jungler',  pick:0.58,ban:0.42},
  {name:'Nolan',     role:'Jungler',     pick:0.70,ban:0.60},
  {name:'Valentina', role:'Mid Laner',   pick:0.55,ban:0.50},
  {name:'Miya',      role:'Gold Laner',  pick:0.68,ban:0.45},
  {name:'Hanabi',     role:'Gold Laner',      pick:0.62,ban:0.40},
  {name:'Leomord',     role:'Jungler',     pick:0.60,ban:0.52},
  {name:'Suyou',       role:'Jungler',     pick:0.66,ban:0.58},
  {name:'Novaria',   role:'Mid Laner',   pick:0.50,ban:0.38},
  {name:'Melissa',   role:'Gold Laner',  pick:0.54,ban:0.35},
  {name:'Kimmy',    role:'Mid Laner',   pick:0.48,ban:0.30},
  {name:'Gatotkaca',    role:'Roamer',      pick:0.58,ban:0.44},
  {name:'Carmilla',    role:'Roamer',      pick:0.52,ban:0.36},
  {name:'Mathilda',  role:'Roamer',      pick:0.60,ban:0.55},
  {name:'Hylos', role:'EXP Laner',  pick:0.55,ban:0.40},
  {name:'Paquito',   role:'EXP Laner',  pick:0.48,ban:0.32},
  {name:'Brody',     role:'Gold Laner',  pick:0.62,ban:0.48},
  {name:'Bruno',   role:'Gold Laner',  pick:0.58,ban:0.42},
  {name:'Karrie',    role:'Gold Laner',  pick:0.50,ban:0.35},
  {name:'Freya',    role:'Gold Laner',     pick:0.55,ban:0.45},
  {name:'Lancelot',  role:'Jungler',     pick:0.60,ban:0.50},
  {name:'Fanny',     role:'Jungler',     pick:0.45,ban:0.62},
  {name:'Pharsa',    role:'Mid Laner',   pick:0.52,ban:0.38},
  {name:"Yi Sun-Shin",   role:'Jungler',   pick:0.48,ban:0.30},
  {name:'Yve',       role:'Mid Laner',   pick:0.55,ban:0.40},
  {name:'Belerick',   role:'Roamer',      pick:0.42,ban:0.28},
  {name:'Atlas',     role:'Roamer',      pick:0.58,ban:0.48},
  {name:'Khufra',    role:'Roamer',      pick:0.50,ban:0.38},
  {name:'Terizla',   role:'EXP Laner',  pick:0.45,ban:0.30},
  {name:'Yu Zhong',  role:'EXP Laner',  pick:0.52,ban:0.38},
  {name:'Esmeralda', role:'EXP Laner',  pick:0.48,ban:0.35},
  {name:'Claude',    role:'Gold Laner',  pick:0.45,ban:0.40},
  {name:'Granger',    role:'Gold Laner',  pick:0.55,ban:0.50},
  {name:'Harley',     role:'Gold Laner',  pick:0.42,ban:0.28},
  {name:'Hirara',    role:'Jungler',     pick:0.52,ban:0.42},
  {name:'Hayabusa',  role:'Jungler',     pick:0.48,ban:0.38},
  {name:'Lylia',    role:'Mid Laner',   pick:0.50,ban:0.42},
  {name:'Selena',     role:'Mid Laner',   pick:0.45,ban:0.32},
  {name:'Minotaur',     role:'EXP Laner',   pick:0.45,ban:0.32},
  {name:'Chou',     role:'Roamer',   pick:0.45,ban:0.32},
  {name:'Khaleed',     role:'Roamer',   pick:0.45,ban:0.32},
  {name:'Sora',     role:'EXP Laner',   pick:0.45,ban:0.32},
];

function weightedPick(pool, key) {
  const total = pool.reduce((s,h) => s + h[key], 0);
  let r = Math.random() * total;
  for (const h of pool) { r -= h[key]; if (r <= 0) return h; }
  return pool[pool.length - 1];
}

function generateDraft() {
  let avail = [...HERO_POOL];
  const bans_a = [], bans_b = [];
  for (let i = 0; i < 5; i++) {
    const h = weightedPick(avail, 'ban'); bans_a.push(h.name);
    avail = avail.filter(x => x.name !== h.name);
  }
  for (let i = 0; i < 5; i++) {
    const h = weightedPick(avail, 'ban'); bans_b.push(h.name);
    avail = avail.filter(x => x.name !== h.name);
  }
  const picks_a = [], picks_b = [];
  ROLE_UTAMA.forEach(role => {
    const pool = avail.filter(h => h.role === role);
    const h    = pool.length ? weightedPick(pool, 'pick') : weightedPick(avail, 'pick');
    picks_a.push({name: h.name, role});
    avail = avail.filter(x => x.name !== h.name);
  });
  ROLE_UTAMA.forEach(role => {
    const pool = avail.filter(h => h.role === role);
    const h    = pool.length ? weightedPick(pool, 'pick') : weightedPick(avail, 'pick');
    picks_b.push({name: h.name, role});
    avail = avail.filter(x => x.name !== h.name);
  });
  return {bans_a, bans_b, picks_a, picks_b};
}

/* ── Skor & game generation ── */
function randomSkor(format, teamAId, teamBId) {
  const butuh = format === 'Bo7' ? 4 : format === 'Bo5' ? 3 : 2;
  const chance = (teamAId && teamBId) ? winChance(teamAId, teamBId) : 0.5;
  const aWin   = Math.random() < chance;
  const pWin   = aWin ? (POWER_SCORE[teamAId]||75) : (POWER_SCORE[teamBId]||75);
  const pLoss  = aWin ? (POWER_SCORE[teamBId]||75) : (POWER_SCORE[teamAId]||75);
  const clean  = Math.min(0.75, 0.35 + Math.max(0, pWin - pLoss) * 0.005);
  const kalah  = Math.random() < clean ? 0 : Math.floor(Math.random() * butuh);
  return aWin
    ? {score_a: butuh, score_b: kalah}
    : {score_a: kalah, score_b: butuh};
}

function generateGames(score_a, score_b, teamAId, teamBId) {
  const total  = score_a + score_b;
  const games  = [];
  const chance = winChance(teamAId, teamBId);
  let wA = 0, wB = 0;
  for (let g = 1; g <= total; g++) {
    const nA = score_a - wA, nB = score_b - wB, rem = total - g + 1;
    let gw;
    if      (nA === rem) gw = teamAId;
    else if (nB === rem) gw = teamBId;
    else                 gw = Math.random() < chance ? teamAId : teamBId;
    if (gw === teamAId) wA++; else wB++;
    games.push({game: g, winner: gw, draft: generateDraft()});
  }
  return games;
}

/* ── Override helpers ── */
function getOverrides()    { try{ return JSON.parse(localStorage.getItem(SIM_KEY))||{};           }catch(e){ return{}; } }
function saveOverrides(o)  { localStorage.setItem(SIM_KEY, JSON.stringify(o)); }

/* ── PUBLIC: simulasi satu match ── */
function simulasikanSatu(matchId, format, teamAId, teamBId) {
  const ov   = getOverrides();
  const skor = randomSkor(format, teamAId, teamBId);
  const games = generateGames(skor.score_a, skor.score_b, teamAId, teamBId);
  ov[matchId] = {...skor, games, team_a: teamAId, team_b: teamBId};
  saveOverrides(ov);
  return {...skor, games};
}

/* ── PUBLIC: simulasi semua match sekaligus ── */
async function simulasikanSemua(jadwalGabungan) {
  const ov = getOverrides();
  for (const m of jadwalGabungan) {
    if (m.status !== 'finished') {
      const skor  = randomSkor(m.format, m.team_a, m.team_b);
      const games = generateGames(skor.score_a, skor.score_b, m.team_a, m.team_b);
      ov[m.match_id] = {...skor, games, team_a: m.team_a, team_b: m.team_b};
    }
  }
  saveOverrides(ov);
}

/* ── Gabungkan schedule.json + overrides ── */
async function getScheduleGabungan() {
  const res  = await fetch('schedule.json');
  const asli = await res.json();
  const ov   = getOverrides();
  return asli.map(m => {
    if (ov[m.match_id]) return {...m, ...ov[m.match_id], status: 'finished'};
    return m;
  });
}

function resetSimulasi() {
  localStorage.removeItem(SIM_KEY);
  localStorage.removeItem(PLAYER_STATS_KEY);
  localStorage.removeItem(WEEKLY_STATS_KEY);
  localStorage.removeItem(POINTS_KEY);
}

/* ── Player stats ── */
function getPlayerStatsOverrides()   { try{ return JSON.parse(localStorage.getItem(PLAYER_STATS_KEY))||{}; }catch(e){ return{}; } }
function savePlayerStatsOverrides(o) { localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(o)); }

function acak(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function pilihStarter(players, teamId) {
  const roster  = players.filter(p => p.team_id === teamId && !/sub/i.test(p.role));
  const starter = [];
  ROLE_UTAMA.forEach(role => {
    const k = roster.filter(p => p.role === role && !starter.includes(p));
    if (k.length) starter.push(k[Math.floor(Math.random() * k.length)]);
  });
  if (starter.length < 5) {
    const sisa = roster.filter(p => !starter.includes(p));
    while (starter.length < 5 && sisa.length) starter.push(sisa.shift());
  }
  return starter.slice(0, 5);
}

const KILL_WEIGHT   = {'Gold Laner':5,'Jungler':4,'Mid Laner':3,'EXP Laner':2,'Roamer':1};
const ASSIST_WEIGHT = {'Roamer':5,'EXP Laner':4,'Mid Laner':3,'Jungler':2,'Gold Laner':1};

function rolePerformanceScore(role, k, d, a, won) {
  const kw = KILL_WEIGHT[role]||1, aw = ASSIST_WEIGHT[role]||1;
  return k * kw + a * aw - d * 1.5 + (won ? 8 : 0);
}

async function generateDetailedStatsForMatch(matchId, week, teamAId, teamBId, games) {
  const res     = await fetch('players.json');
  const players = await res.json();

  const weeklyStats = getWeeklyStats();
  const points      = getPoints();
  if (!weeklyStats[week]) weeklyStats[week] = {};

  const starterA = pilihStarter(players, teamAId);
  const starterB = pilihStarter(players, teamBId);
  const allStats = {};

  const init = (p, team) => {
    if (!allStats[p.id]) allStats[p.id] = {
      kills:0, deaths:0, assists:0, mvps:0, role:p.role,
      team, name:p.name, gamesPlayed:0, perfScore:0
    };
  };
  starterA.forEach(p => init(p, teamAId));
  starterB.forEach(p => init(p, teamBId));

  games.forEach(game => {
    const wonA = game.winner === teamAId;
    let mvpId = null, mvpSc = -1;

    const processPlayer = (p, won) => {
      const k = won ? acak(3,12) : acak(0,8);
      const d = won ? acak(0,5)  : acak(2,9);
      const a = won ? acak(4,15) : acak(2,10);
      allStats[p.id].kills   += k;
      allStats[p.id].deaths  += d;
      allStats[p.id].assists += a;
      allStats[p.id].gamesPlayed++;
      allStats[p.id].perfScore += rolePerformanceScore(p.role, k, d, a, won);
      const sc = k*2 + a + (won?5:0);
      if (sc > mvpSc) { mvpSc = sc; mvpId = p.id; }
    };

    starterA.forEach(p => processPlayer(p, wonA));
    starterB.forEach(p => processPlayer(p, !wonA));

    if (mvpId) {
      allStats[mvpId].mvps++;
      if (!points[mvpId]) points[mvpId] = 0;
      points[mvpId] += 5;
    }
  });

  // Akumulasi ke weekly stats
  Object.entries(allStats).forEach(([id, st]) => {
    if (!weeklyStats[week][id]) weeklyStats[week][id] = {
      kills:0, deaths:0, assists:0, mvps:0, perfScore:0,
      gamesPlayed:0, role:st.role, team:st.team, name:st.name
    };
    const w = weeklyStats[week][id];
    w.kills       += st.kills;
    w.deaths      += st.deaths;
    w.assists     += st.assists;
    w.mvps        += st.mvps;
    w.perfScore   += st.perfScore;
    w.gamesPlayed += st.gamesPlayed;
  });

  saveWeeklyStats(weeklyStats);

  // POTW & TOTW
  const wp = Object.entries(weeklyStats[week]).filter(([k]) => k !== '_awards');
  if (wp.length) {
    const sorted = wp.sort((a,b) => b[1].perfScore - a[1].perfScore);
    const potwId = sorted[0][0];
    if (!points[potwId]) points[potwId] = 0;
    points[potwId] += 1;

    const totwIds = [];
    ROLE_UTAMA.forEach(role => {
      const c = wp.filter(([,st]) => st.role === role);
      if (!c.length) return;
      const best = c.sort((a,b) => b[1].perfScore - a[1].perfScore)[0];
      totwIds.push(best[0]);
    });
    totwIds.forEach(id => { if (!points[id]) points[id]=0; points[id]+=2; });

    if (!weeklyStats[week]._awards) {
      weeklyStats[week]._awards = {potw: potwId, totw: totwIds};
    }
    saveWeeklyStats(weeklyStats);
  }

  savePoints(points);

  // Sinkronisasi ke global player stats
  const po = getPlayerStatsOverrides();
  Object.entries(allStats).forEach(([id, st]) => {
    if (!po[id]) po[id] = {kills:0, deaths:0, assists:0, mvp_count:0};
    po[id].kills     += st.kills;
    po[id].deaths    += st.deaths;
    po[id].assists   += st.assists;
    po[id].mvp_count += st.mvps;
  });
  savePlayerStatsOverrides(po);
}

async function getPlayerStatsGabungan() {
  const res     = await fetch('players.json');
  const players = await res.json();
  const po      = getPlayerStatsOverrides();
  return players.map(p => {
    const o = po[p.id];
    if (!o) return p;
    return {...p, stats: {
      kills:     p.stats.kills     + o.kills,
      deaths:    p.stats.deaths    + o.deaths,
      assists:   p.stats.assists   + o.assists,
      mvp_count: p.stats.mvp_count + o.mvp_count,
    }};
  });
}

/* ── Weekly & points helpers ── */
function getWeeklyStats()    { try{ return JSON.parse(localStorage.getItem(WEEKLY_STATS_KEY))||{}; }catch(e){ return{}; } }
function saveWeeklyStats(o)  { localStorage.setItem(WEEKLY_STATS_KEY, JSON.stringify(o)); }
function getPoints()         { try{ return JSON.parse(localStorage.getItem(POINTS_KEY))||{};       }catch(e){ return{}; } }
function savePoints(o)       { localStorage.setItem(POINTS_KEY, JSON.stringify(o)); }