/* =========================================================
   JORNADA — RPG da vida real
   Todo o progresso é DERIVADO do histórico (nada de XP "solto"):
   desmarcar algo desfaz o ganho; editar o passado recalcula tudo.
   ========================================================= */
const KEY = 'jornada.v1';
const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const dstr = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const hoje = () => dstr(new Date());
const D = s => new Date(s + 'T12:00:00');
const addDays = (s, n) => { const d = D(s); d.setDate(d.getDate() + n); return dstr(d); };
const diffDays = (a, b) => Math.round((D(b) - D(a)) / 864e5);
const weekStart = s => { const d = D(s); const k = (d.getDay() + 6) % 7; d.setDate(d.getDate() - k); return dstr(d); };
const fmtN = n => Math.round(n).toLocaleString('pt-BR');
const fmtD = s => D(s).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

const need = L => 40 * (L - 1) * L;          // XP acumulado para o nível L do herói
const needA = L => 10 * (L - 1) * L;         // XP acumulado para o nível L de uma área
const lvlOf = (xp, f = need) => { let L = 1; while (f(L + 1) <= xp) L++; return L; };
const lvlInfo = (xp, f = need) => { const L = lvlOf(xp, f), a = f(L), b = f(L + 1); return { lvl: L, cur: xp - a, next: b - a, pct: (xp - a) / (b - a) * 100 }; };
const clsB = a => ((CLASSES[db.perfil?.classe] || {}).b || {})[a] || 0;
const mult = run => run >= 30 ? 2 : run >= 14 ? 1.75 : run >= 7 ? 1.5 : run >= 3 ? 1.2 : 1;

const MIGR = 'reset-2026-10-15';
const DEF = () => ({ v: 1, migr: MIGR, criado: null, perfil: null, itens: [], log: {}, desafios: {}, recompensas: [], compras: [], diario: {}, ui: { lvl: 1, areaLv: {}, conq: {}, kills: 0, som: true, vib: true } });
let aPer = 30;
let db = DEF(), S = null, view = 'hoje', diaSel = null, jTab = 'habito', sugArea = 'voce', hitBoss = false;

function load() { try { const r = localStorage.getItem(KEY); if (r) db = Object.assign(DEF(), { migr: null }, JSON.parse(r)); db.ui = Object.assign(DEF().ui, db.ui || {}); } catch (e) { } }
function save() {
  db.savedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { }
  cloudPush();
}
/* Nuvem: quando aberto como link do Claude, guarda o progresso na conta do usuário */
let cloud = null, cloudT = null;
function cloudPush() { if (!cloud) return; clearTimeout(cloudT); cloudT = setTimeout(() => cloud.set({ json: JSON.stringify(db), savedAt: db.savedAt }).catch(() => { }), 800); }
async function cloudInit() {
  try {
    if (!window.claude || !claude.use) return;
    const [cdb, user] = await Promise.all([claude.use('db'), claude.use('user')]);
    if (!cdb || !user) return;
    const ref = cdb.doc('data/users/' + (await user.id()) + '/jornada');
    const snap = await ref.get();
    cloud = ref;
    const r = snap.exists ? snap.data() : null;
    if (r && r.json && (r.savedAt || 0) > (db.savedAt || 0)) {
      db = Object.assign(DEF(), { migr: null }, JSON.parse(r.json)); db.ui = Object.assign(DEF().ui, db.ui || {}); migrar(); aplicarSeeds();
      try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { }
      S = db.perfil ? calc() : null; if (S) celebrate(S, true); OB = null; render();
    } else if (db.perfil) cloudPush();
  } catch (e) { }
}

/* =================== MOTOR DE CÁLCULO =================== */
function bossOf(ws) { const n = Math.floor(diffDays('2024-01-01', ws) / 7); return BOSSES[((n % BOSSES.length) + BOSSES.length) % BOSSES.length]; }
function habAtivo(h, ds) { return h.criado <= ds && !(h.arq && h.arq <= ds) && h.dias.includes(D(ds).getDay()); }
function bossHP(ws) {
  let plan = 0;
  const habs = db.itens.filter(i => i.tipo === 'habito');
  for (let i = 0; i < 7; i++) { const ds = addDays(ws, i); habs.forEach(h => { if (habAtivo(h, ds)) plan += DIF[h.dif].xp; }); }
  return Math.max(200, Math.round(plan * 0.7 / 10) * 10);
}

function calc() {
  const T = hoje();
  const st = { total: 0, area: {}, daily: {}, dailyArea: {}, streaks: {}, habDone: 0, missDone: 0, metaDone: 0, perfect: 0, bosses: [], bossKills: 0, desafios: 0, diario: 0, maxStreak: 0, energia: 80, goldBonus: 0, sched: {} };
  AREA_KEYS.forEach(a => st.area[a] = 0);
  const cls = (CLASSES[db.perfil?.classe] || {}).b || {};
  const add = (a, xp, d) => {
    xp = Math.round(xp * (1 + (a ? cls[a] || 0 : 0)));
    st.total += xp; if (a) st.area[a] += xp;
    st.daily[d] = (st.daily[d] || 0) + xp;
    if (a) { st.dailyArea[d] = st.dailyArea[d] || {}; st.dailyArea[d][a] = (st.dailyArea[d][a] || 0) + xp; }
  };
  const ev = {}, push = (d, f) => (ev[d] = ev[d] || []).push(f);
  db.itens.forEach(it => {
    if (it.tipo === 'missao' && it.feito) push(it.feito, () => { st.missDone++; add(it.area, DIF[it.dif].xp * 2, it.feito); st.energia = Math.min(100, st.energia + 3); });
    if (it.tipo === 'meta') {
      (it.marcos || []).forEach(m => { if (m.feito) push(m.feito, () => add(it.area, 40, m.feito)); });
      if (it.feito) push(it.feito, () => { st.metaDone++; add(it.area, 100 * it.dif, it.feito); });
    }
  });
  Object.entries(db.desafios).forEach(([d, x]) => { if (x.feito) { const s = SUG.find(z => z.id === x.sid); if (s) push(d, () => { st.desafios++; add(s.a, DIF[s.d].xp * 2, d); }); } });
  Object.entries(db.diario).forEach(([d, x]) => { if (x && (x.txt || x.humor)) push(d, () => { st.diario++; add('proposito', 10, d); }); });

  const habs = db.itens.filter(i => i.tipo === 'habito');
  const run = {}, best = {};
  habs.forEach(h => { run[h.id] = 0; best[h.id] = 0; });
  let start = db.criado || T;
  Object.keys(ev).forEach(k => { if (k < start) start = k; });
  habs.forEach(h => { if (h.criado < start) start = h.criado; });

  let wk = null, wXP = 0, wHP = 0, wKill = null;
  const close = () => { if (wk) st.bosses.push({ ws: wk, hp: wHP, dmg: wXP, kill: wKill, boss: bossOf(wk) }); };
  for (let ds = start; ds <= T; ds = addDays(ds, 1)) {
    const ws = weekStart(ds);
    if (ws !== wk) { close(); wk = ws; wXP = 0; wHP = bossHP(ws); wKill = null; }
    const before = st.total;
    let sch = 0, done = 0;
    habs.forEach(h => {
      if (!habAtivo(h, ds)) return;
      sch++;
      if (db.log[ds] && db.log[ds][h.id]) {
        done++; run[h.id]++; best[h.id] = Math.max(best[h.id], run[h.id]); st.habDone++;
        add(h.area, DIF[h.dif].xp * mult(run[h.id]), ds);
        st.energia = Math.min(100, st.energia + 4);
      } else if (ds < T) { run[h.id] = 0; st.energia = Math.max(0, st.energia - 10); }
    });
    st.sched[ds] = { sch, done };
    if (sch >= 3 && done === sch) { st.perfect++; add(null, 30, ds); }
    (ev[ds] || []).forEach(f => f());
    wXP += st.total - before;
    if (!wKill && wXP >= wHP) { wKill = ds; st.bossKills++; add(null, 150, ds); st.goldBonus += 100; }
  }
  close();
  habs.forEach(h => { st.streaks[h.id] = { cur: run[h.id], best: best[h.id] }; st.maxStreak = Math.max(st.maxStreak, best[h.id]); });
  st.lvl = lvlOf(st.total);
  st.areaLv = {}; AREA_KEYS.forEach(a => st.areaLv[a] = lvlOf(st.area[a], needA));
  st.minArea = Math.min(...AREA_KEYS.map(a => st.areaLv[a]));
  st.goldEarned = Math.floor(st.total / 4) + st.goldBonus;
  st.spent = db.compras.reduce((s, c) => s + c.custo, 0);
  st.gold = st.goldEarned - st.spent;
  st.compras = db.compras.length;
  st.tier = AV.tierOf(st.lvl);
  st.mood = st.energia >= 70 ? 'feliz' : st.energia >= 40 ? 'ok' : st.energia >= 15 ? 'cansado' : 'exausto';
  const dom = AREA_KEYS.slice().sort((a, b) => st.area[b] - st.area[a])[0];
  st.dom = st.area[dom] > 0 ? dom : null;
  st.bestCur = Math.max(0, ...habs.filter(h => !h.arq).map(h => run[h.id]));
  return st;
}

function avOpts(st, extra) {
  const p = db.perfil || {};
  return Object.assign({ tier: st.tier, skin: p.pele || AV.SKINS[1], hair: p.cabelo || 'curto', hairColor: p.corCabelo || AV.HAIRC[1], beard: p.barba || 'nenhuma', glasses: !!p.oculos, mood: st.mood, areas: st.areaLv, aura: st.dom ? AREAS[st.dom].cor : '#7c5cff' }, extra || {});
}

/* =================== FEEDBACK / GAMIFICAÇÃO =================== */
let actx;
function snd(type) {
  if (!db.ui.som) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const seq = { ok: [[660, .06], [990, .1]], undo: [[420, .08], [300, .1]], lvl: [[523, .12], [659, .12], [784, .12], [1047, .5]], ach: [[880, .1], [1175, .1], [1568, .3]], coin: [[988, .07], [1319, .22]], boss: [[196, .14], [262, .14], [392, .14], [523, .5]] }[type];
    let t = actx.currentTime;
    seq.forEach(([f, d]) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type === 'boss' ? 'square' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(type === 'boss' ? .08 : .2, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .03); t += d * .85;
    });
  } catch (e) { }
}
const vib = p => { if (db.ui.vib && navigator.vibrate) try { navigator.vibrate(p); } catch (e) { } };

function toast(ic, html, cls = '') {
  const t = document.createElement('div');
  t.className = 'toast ' + cls; t.innerHTML = `<span class="big">${ic}</span><span>${html}</span>`;
  $('toasts').appendChild(t);
  setTimeout(() => { t.style.transition = '.4s'; t.style.opacity = 0; t.style.transform = 'translateY(-10px)'; }, 3200);
  setTimeout(() => t.remove(), 3700);
}
function floatTxt(x, y, txt, g) {
  const f = document.createElement('div');
  f.className = 'floatxp' + (g ? ' g' : ''); f.textContent = txt;
  f.style.left = (x - 30) + 'px'; f.style.top = (y - 20) + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 1200);
}

/* Compara antes/depois e dispara todas as celebrações */
function act(ev, fn) {
  const before = S || calc();
  fn(); save();
  const after = calc();
  const x = ev && ev.clientX ? ev.clientX : innerWidth / 2, y = ev && ev.clientY ? ev.clientY : innerHeight / 2;
  const dxp = after.total - before.total, dg = after.goldEarned - before.goldEarned;
  if (dxp > 0) { floatTxt(x, y, `+${dxp} XP`); if (dg > 0) setTimeout(() => floatTxt(x + 30, y + 10, `+${dg} 🪙`, true), 180); snd('ok'); vib(15); hitBoss = true; }
  else if (dxp < 0) { floatTxt(x, y, `${dxp} XP`); snd('undo'); }
  celebrate(after, false);
  S = after; render();
}

function celebrate(st, silent) {
  const ui = db.ui;
  // conquistas
  CONQ.forEach(c => {
    if (!ui.conq[c.id] && c.t(st)) {
      ui.conq[c.id] = hoje();
      if (!silent) setTimeout(() => { toast(c.ic, `<div class="small mut">Conquista ${({ comum: 'comum', raro: 'rara', epico: 'épica', lendario: 'LENDÁRIA' })[c.r]}</div>${esc(c.n)}`, 'ach-t'); snd('ach'); }, 500);
    }
  });
  // chefão
  if (st.bossKills > (ui.kills || 0) && !silent) {
    const b = st.bosses[st.bosses.length - 1];
    setTimeout(() => { toast(b.boss.ic, `<b>${esc(b.boss.n)}</b> derrotado!<div class="small mut">+150 XP · +100 ouro</div>`, 'ach-t'); snd('boss'); vib([30, 50, 30, 50, 80]); }, 300);
  }
  ui.kills = st.bossKills;
  // níveis de área
  AREA_KEYS.forEach(a => {
    const o = ui.areaLv[a] || 1, n = st.areaLv[a];
    if (n > o && !silent) {
      const perk = [5, 10, 15].includes(n) ? '<div class="small" style="color:var(--gold)">Novo item no seu avatar!</div>' : '';
      setTimeout(() => toast(AREAS[a].ic, `${AREAS[a].attr} subiu para <b>Nv ${n}</b>${perk}`), 200);
    }
    ui.areaLv[a] = n;
  });
  // nível do herói
  if (st.lvl > ui.lvl && !silent) levelUp(ui.lvl, st);
  ui.lvl = st.lvl;
  save();
}

function levelUp(old, st) {
  const tOld = AV.tierOf(old), tNew = st.tier, T = AV.TIERS[tNew];
  const el = document.createElement('div'); el.id = 'lvlup';
  el.innerHTML = `<canvas></canvas><div class="small mut" style="letter-spacing:4px;text-transform:uppercase;font-weight:800">Subiu de nível</div>
    <div class="av">${AV.render(avOpts(st, { mood: 'feliz' }))}</div>
    <div class="big">NÍVEL ${st.lvl}</div>
    <div class="sub tier">${T.n}</div>
    ${tNew > tOld ? `<div class="unl">✦ NOVA FORMA DESBLOQUEADA ✦<br><span style="color:#e0e7ff;font-weight:500">${T.d}</span></div>` : `<div class="unl" style="color:#c4b5fd">Próximo nível: ${fmtN(need(st.lvl + 1) - st.total)} XP</div>`}
    <button class="btn gold" style="margin-top:22px">Continuar jornada</button>`;
  document.body.appendChild(el);
  snd('lvl'); vib([40, 60, 40, 60, 120]);
  confetti(el.querySelector('canvas'));
  const close = () => el.remove();
  el.querySelector('button').onclick = close;
  setTimeout(() => { if (el.isConnected) el.onclick = close; }, 800);
}

function confetti(cv) {
  const ctx = cv.getContext('2d'), W = cv.width = innerWidth * devicePixelRatio, H = cv.height = innerHeight * devicePixelRatio;
  const cols = ['#fbbf24', '#7c5cff', '#22d3ee', '#f472b6', '#4ade80', '#fff'];
  const ps = Array.from({ length: 160 }, () => ({ x: W / 2, y: H * .45, vx: (Math.random() - .5) * 26 * devicePixelRatio, vy: (Math.random() * -22 - 6) * devicePixelRatio, s: (4 + Math.random() * 6) * devicePixelRatio, c: cols[Math.floor(Math.random() * cols.length)], r: Math.random() * 6, vr: (Math.random() - .5) * .3 }));
  let f = 0;
  (function loop() {
    if (!cv.isConnected || f++ > 240) return;
    ctx.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .55 * devicePixelRatio; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - f / 240); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    requestAnimationFrame(loop);
  })();
}

/* =================== AÇÕES =================== */
function togHab(ev, id) { const d = diaSel; act(ev, () => { db.log[d] = db.log[d] || {}; if (db.log[d][id]) delete db.log[d][id]; else db.log[d][id] = 1; if (!Object.keys(db.log[d]).length) delete db.log[d]; }); }
function togMiss(ev, id) { const it = db.itens.find(i => i.id === id); act(ev, () => { it.feito = it.feito ? null : hoje(); }); }
function togMarco(ev, id, mid) { const it = db.itens.find(i => i.id === id); const m = it.marcos.find(x => x.id === mid); act(ev, () => { m.feito = m.feito ? null : hoje(); }); }
function concluirMeta(ev, id) {
  const it = db.itens.find(i => i.id === id);
  if (it.feito) { ask('Reabrir este épico? O XP da conclusão será removido.', () => act(null, () => { it.feito = null; }), 'Reabrir'); return; }
  act(ev, () => { it.feito = hoje(); });
  setTimeout(() => toast('🏆', `Épico concluído: <b>${esc(it.nome)}</b>`, 'ach-t'), 100);
}
function desafioFeito(ev) { const T = hoje(); act(ev, () => { db.desafios[T].feito = !db.desafios[T].feito; }); }
function desafioTrocar() { const T = hoje(); const d = db.desafios[T]; if (d.trocas >= 1) return; const n = pickDesafio(T, d.sid); if (n) { d.sid = n; d.trocas = 1; save(); render(); } }
function salvarDiario(ev) {
  const T = hoje(), txt = $('dTxt').value.trim(), humor = +($('dMood').dataset.v || 0);
  if (!txt && !humor) { toast('✍️', 'Escreva algo ou escolha um humor.'); return; }
  act(ev, () => { db.diario[T] = { humor, txt }; });
  toast('✍️', 'Reflexão registrada. +10 XP em Espírito');
}

/* Desafio do dia: puxa da área mais fraca dos últimos 14 dias */
function areaFraca(st) {
  const T = hoje(), sum = {}; AREA_KEYS.forEach(a => sum[a] = 0);
  for (let i = 0; i < 14; i++) { const da = st.dailyArea[addDays(T, -i)] || {}; AREA_KEYS.forEach(a => sum[a] += da[a] || 0); }
  return AREA_KEYS.slice().sort((a, b) => sum[a] - sum[b] || st.area[a] - st.area[b]);
}
function pickDesafio(T, excl) {
  const nomes = new Set(db.itens.filter(i => !i.arq).map(i => i.nome.toLowerCase()));
  const ord = areaFraca(S || calc());
  let seed = [...T].reduce((s, c) => s * 31 + c.charCodeAt(0), 7) >>> 0;
  for (const a of ord.slice(0, 3)) {
    const pool = SUG.filter(s => s.a === a && s.t !== 'e' && s.id !== excl && !nomes.has(s.n.toLowerCase()));
    if (pool.length) return pool[seed % pool.length].id;
  }
  const pool = SUG.filter(s => s.t !== 'e' && s.id !== excl);
  return pool[seed % pool.length].id;
}
function desafioHoje() {
  const T = hoje();
  if (!db.desafios[T]) { db.desafios[T] = { sid: pickDesafio(T), feito: false, trocas: 0 }; save(); }
  return db.desafios[T];
}

/* =================== NAVEGAÇÃO =================== */
const VIEWS = { hoje: ['Hoje', renderHoje], jornada: ['Jornada', renderJornada], heroi: ['Herói', renderHeroi], loja: ['Tesouro', renderLoja], analise: ['Análise', renderAnalise] };
function ir(v, sub) { view = v; if (sub) jTab = sub; render(); scrollTo(0, 0); }
function render() {
  if (!db.perfil) return renderOnboarding();
  $('app').classList.remove('hide'); $('ob').classList.add('hide');
  S = S || calc();
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.v === view));
  $('ttl').textContent = VIEWS[view][0];
  $('hLvl').textContent = 'Nv ' + S.lvl;
  $('hGold').textContent = '🪙 ' + fmtN(S.gold);
  $('main').innerHTML = VIEWS[view][1]();
  if (hitBoss) { const f = document.querySelector('.boss .face:not(.dead)'); if (f) f.classList.add('hit'); hitBoss = false; }
}

/* =================== HOJE =================== */
function hudCard() {
  const li = lvlInfo(S.total), T = AV.TIERS[S.tier], cl = CLASSES[db.perfil.classe];
  const td = S.daily[hoje()] || 0;
  const enC = S.energia >= 70 ? '' : S.energia >= 40 ? 'background:linear-gradient(90deg,#d97706,#fbbf24)' : 'background:linear-gradient(90deg,#b91c1c,#f87171)';
  const moodTxt = { feliz: 'Motivado', ok: 'Estável', cansado: 'Cansado', exausto: 'Exausto — retome hoje!' }[S.mood];
  return `<div class="card glow"><div class="hud">
    <div class="av" onclick="ir('heroi')">${AV.render(avOpts(S))}<div class="lvl-badge">NV ${S.lvl}</div></div>
    <div class="info">
      <div class="nm">${esc(db.perfil.nome)}</div>
      <div class="tier">${T.n} · ${cl ? cl.ic + ' ' + cl.n : ''}</div>
      <div class="stat-l"><span>XP</span><b class="mono">${fmtN(li.cur)} / ${fmtN(li.next)}</b></div>
      <div class="bar xp"><i style="width:${li.pct.toFixed(1)}%"></i></div>
      <div class="stat-l"><span>Energia · ${moodTxt}</span><b class="mono">${S.energia}%</b></div>
      <div class="bar en"><i style="width:${S.energia}%;${enC}"></i></div>
      <div class="row" style="margin-top:11px;gap:6px;flex-wrap:wrap">
        <span class="chip gold">🪙 ${fmtN(S.gold)}</span>
        <span class="chip" title="Melhor sequência ativa">🔥 ${S.bestCur}</span>
        <span class="chip" style="color:#a5f3fc">+${fmtN(td)} hoje</span>
      </div>
    </div></div></div>`;
}
function bossCard() {
  const b = S.bosses[S.bosses.length - 1]; if (!b) return '';
  const left = Math.max(0, b.hp - b.dmg), pct = left / b.hp * 100;
  const fim = diffDays(hoje(), addDays(b.ws, 6));
  return `<div class="card"><div class="boss">
    <div class="face ${b.kill ? 'dead' : ''}">${b.boss.ic}</div>
    <div style="flex:1;min-width:0">
      <div class="mut small" style="text-transform:uppercase;letter-spacing:1.2px;font-weight:800">Chefão da semana</div>
      <div style="font-weight:800;font-size:16px;margin:2px 0 8px" class="title">${esc(b.boss.n)}</div>
      ${b.kill ? `<div style="color:var(--ok);font-weight:800">⚔️ Derrotado! +150 XP · +100 🪙</div>` :
      `<div class="bar boss"><i style="width:${pct.toFixed(1)}%"></i></div>
       <div class="row between small mut mono" style="margin-top:6px"><span>❤ ${fmtN(left)} / ${fmtN(b.hp)} HP</span><span>${fim === 0 ? 'último dia!' : fim + 'd restantes'}</span></div>`}
    </div></div>
    ${b.kill ? '' : '<div class="mut small" style="margin-top:10px">Cada XP que você ganha esta semana é dano no chefão.</div>'}</div>`;
}
function desafioCard() {
  const d = desafioHoje(), s = SUG.find(x => x.id === d.sid); if (!s) return '';
  const A = AREAS[s.a], xp = Math.round(DIF[s.d].xp * 2 * (1 + clsB(s.a)));
  return `<div class="card challenge">
    <div class="row between"><span class="small" style="color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:1.2px">🎲 Desafio do dia</span><span class="xpchip" style="background:rgba(251,191,36,.18);color:var(--gold)">+${xp} XP · 2x</span></div>
    <div style="font-size:17px;font-weight:800;margin:8px 0 4px;${d.feito ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(s.n)}</div>
    <div class="mut small">${A.ic} ${A.nome} — sua área com menos atenção nas últimas 2 semanas.</div>
    <div class="row" style="margin-top:12px">
      <button class="btn ${d.feito ? 'ghost' : 'gold'} sm" style="flex:1" onclick="desafioFeito(event)">${d.feito ? '↺ Desfazer' : '✓ Cumpri!'}</button>
      ${!d.feito && !d.trocas ? `<button class="btn ghost sm" onclick="desafioTrocar()">🔄 Trocar</button>` : ''}
    </div></div>`;
}
function habItem(h, ds) {
  const ok = !!(db.log[ds] && db.log[ds][h.id]), A = AREAS[h.area], stv = S.streaks[h.id] || { cur: 0 };
  const isT = ds === hoje(), next = isT ? (ok ? stv.cur : stv.cur + 1) : 1;
  const xp = Math.round(DIF[h.dif].xp * mult(next) * (1 + clsB(h.area)));
  const m = mult(next);
  return `<div class="item ${ok ? 'done' : ''}"><div class="area-dot" style="background:${A.cor}"></div>
    <div class="chk ${ok ? 'on' : ''}" onclick="togHab(event,'${h.id}')">${ok ? '✓' : ''}</div>
    <div style="flex:1;min-width:0" onclick="editar('${h.id}')"><div class="nm">${esc(h.nome)}</div>
      <div class="meta"><span>${A.ic} ${A.attr}</span><span class="xpchip">+${xp} XP${m > 1 && isT ? ` · ${m}x` : ''}</span>${isT && stv.cur >= 2 ? `<span class="fire">🔥 ${stv.cur}</span>` : ''}</div>
    </div></div>`;
}
function prazoTxt(p) {
  if (!p) return '';
  const n = diffDays(hoje(), p);
  return n < 0 ? `<span class="late">atrasada ${-n}d</span>` : n === 0 ? '<span class="late">vence hoje</span>' : `<span>em ${n}d · ${fmtD(p)}</span>`;
}
function missItem(it) {
  const A = AREAS[it.area];
  return `<div class="item ${it.feito ? 'done' : ''}"><div class="area-dot" style="background:${A.cor}"></div>
    <div class="chk ${it.feito ? 'on' : ''}" onclick="togMiss(event,'${it.id}')">${it.feito ? '✓' : ''}</div>
    <div style="flex:1;min-width:0" onclick="editar('${it.id}')"><div class="nm">${esc(it.nome)}</div>
      <div class="meta"><span>📜 Missão · ${A.ic} ${A.attr}</span><span class="xpchip">+${DIF[it.dif].xp * 2} XP</span>${it.feito ? `<span>feita ${fmtD(it.feito)}</span>` : prazoTxt(it.prazo)}</div>
    </div></div>`;
}
function metaCard(it, full) {
  const A = AREAS[it.area], ms = it.marcos || [], dn = ms.filter(m => m.feito).length;
  const pct = it.feito ? 100 : ms.length ? dn / ms.length * 100 : 0;
  return `<div class="card" style="border-left:3px solid ${A.cor}">
    <div class="row between" onclick="editar('${it.id}')" style="cursor:pointer"><div><div class="mut small">🏆 Épico · ${A.ic} ${A.attr}${it.prazo ? ' · até ' + fmtD(it.prazo) : ''}</div><div style="font-weight:800;font-size:16px;margin-top:3px">${esc(it.nome)}</div></div><span class="xpchip">+${100 * it.dif} XP</span></div>
    <div class="row" style="margin-top:10px"><div class="bar xp" style="flex:1"><i style="width:${pct}%"></i></div><b class="small mono">${Math.round(pct)}%</b></div>
    ${full ? ms.map(m => `<div class="row" style="margin-top:10px"><div class="chk ${m.feito ? 'on' : ''}" style="width:26px;height:26px;min-width:26px;font-size:14px;border-radius:8px" onclick="togMarco(event,'${it.id}','${m.id}')">${m.feito ? '✓' : ''}</div><span style="flex:1;${m.feito ? 'text-decoration:line-through;opacity:.55' : ''}">${esc(m.nome)}</span><span class="mut small">+40</span></div>`).join('') +
      `<button class="btn ${it.feito ? 'ghost' : 'gold'} sm full" style="margin-top:12px" ${!it.feito && dn < ms.length ? 'disabled' : ''} onclick="concluirMeta(event,'${it.id}')">${it.feito ? '↺ Reabrir épico' : dn < ms.length ? `Conclua os marcos (${dn}/${ms.length})` : '🏆 Concluir épico'}</button>` : `<div class="mut small" style="margin-top:6px">${dn}/${ms.length} marcos</div>`}
  </div>`;
}
function renderHoje() {
  const T = hoje();
  const minD = addDays(T, -7);
  if (!diaSel || diaSel > T || diaSel < minD) diaSel = T;
  const ds = diaSel, isT = ds === T;
  const habs = db.itens.filter(i => i.tipo === 'habito' && habAtivo(i, ds));
  const ok = habs.filter(h => db.log[ds] && db.log[ds][h.id]).length, pct = habs.length ? ok / habs.length * 100 : 0;
  const lbl = isT ? 'Hoje' : ds === addDays(T, -1) ? 'Ontem' : DOW[D(ds).getDay()];
  const miss = db.itens.filter(i => i.tipo === 'missao' && !i.arq && (!i.feito || i.feito === T)).sort((a, b) => (!!a.feito - !!b.feito) || ((a.prazo || '9') < (b.prazo || '9') ? -1 : 1));
  const metas = db.itens.filter(i => i.tipo === 'meta' && !i.arq && !i.feito);
  const frase = FRASES[diffDays('2024-01-01', T) % FRASES.length];
  const di = db.diario[T] || {};
  let h = hudCard();
  h += `<div class="mut small" style="text-align:center;margin:-2px 8px 14px;font-style:italic;line-height:1.4">“${frase}”</div>`;
  h += bossCard();
  if (isT) h += desafioCard();
  h += `<div class="sec-h"><h2>Hábitos</h2><div class="row" style="gap:6px">
      <button class="btn ghost sm" ${ds <= minD ? 'disabled' : ''} onclick="diaSel=addDays(diaSel,-1);render()">‹</button>
      <span class="small" style="min-width:74px;text-align:center;font-weight:700">${lbl} <span class="mut">${fmtD(ds)}</span></span>
      <button class="btn ghost sm" ${isT ? 'disabled' : ''} onclick="diaSel=addDays(diaSel,1);render()">›</button></div></div>`;
  if (habs.length) {
    h += `<div class="row" style="margin:0 2px 10px"><div class="bar" style="flex:1"><i style="width:${pct}%;background:${pct === 100 ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : 'linear-gradient(90deg,#16a34a,#4ade80)'}"></i></div><b class="small mono">${ok}/${habs.length}</b></div>`;
    if (pct === 100 && habs.length >= 3) h += `<div class="small" style="color:var(--gold);font-weight:800;margin:-4px 2px 10px">💎 Dia perfeito! +30 XP de bônus</div>`;
    else if (habs.length >= 3) h += `<div class="mut small" style="margin:-4px 2px 10px">Complete todos para o bônus 💎 Dia perfeito (+30 XP)</div>`;
    h += habs.map(x => habItem(x, ds)).join('');
  } else h += `<div class="empty">Nenhum hábito para ${isT ? 'hoje' : 'este dia'}.<br><button class="btn sm" style="margin-top:12px" onclick="abrirSug()">💡 Ver sugestões</button></div>`;
  if (!isT) h += `<div class="mut small" style="text-align:center">Você está lançando um dia passado (até 7 dias).</div>`;
  if (isT) {
    h += `<div class="sec-h"><h2>Missões</h2><button class="btn ghost sm" onclick="novo('missao')">+ Missão</button></div>`;
    h += miss.length ? miss.map(missItem).join('') : `<div class="mut small" style="margin:0 2px 8px">Nenhuma missão aberta. Missões são tarefas únicas que valem XP em dobro.</div>`;
    if (metas.length) { h += `<div class="sec-h"><h2>Épicos em andamento</h2><button class="btn ghost sm" onclick="ir('jornada','meta')">Ver todos</button></div>`; h += metas.slice(0, 3).map(m => metaCard(m, false)).join(''); }
    h += `<div class="sec-h"><h2>Reflexão do dia</h2>${di.txt || di.humor ? '<span class="small" style="color:var(--ok);font-weight:700">✓ registrada</span>' : '<span class="xpchip">+10 XP</span>'}</div>
      <div class="card"><div class="moods" id="dMood" data-v="${di.humor || 0}">${['😫', '😕', '😐', '🙂', '🤩'].map((e, i) => `<span class="${di.humor === i + 1 ? 'on' : ''}" onclick="pickMood(${i + 1})">${e}</span>`).join('')}</div>
      <textarea id="dTxt" style="margin-top:12px" placeholder="Vitória do dia, aprendizado ou o que fazer melhor amanhã…">${esc(di.txt || '')}</textarea>
      <button class="btn ghost sm full" style="margin-top:10px" onclick="salvarDiario(event)">Salvar reflexão</button></div>`;
  }
  return h;
}
function pickMood(v) { const el = $('dMood'); el.dataset.v = v; [...el.children].forEach((s, i) => s.classList.toggle('on', i + 1 === v)); }

/* =================== JORNADA (cadastro) =================== */
function renderJornada() {
  const tabs = [['habito', 'Hábitos'], ['missao', 'Missões'], ['meta', 'Épicos'], ['arq', 'Arquivo']];
  let h = `<div class="row" style="margin-bottom:12px"><button class="btn" style="flex:1" onclick="novo(jTab==='arq'?'habito':jTab)">+ Novo</button><button class="btn ghost" style="flex:1" onclick="abrirSug()">💡 Sugestões</button></div>`;
  h += `<div class="seg">${tabs.map(([k, n]) => `<button class="${jTab === k ? 'on' : ''}" onclick="jTab='${k}';render()">${n}</button>`).join('')}</div>`;
  const ativos = db.itens.filter(i => !i.arq);
  if (jTab === 'habito') {
    const l = ativos.filter(i => i.tipo === 'habito');
    h += `<button class="btn ghost sm full" style="margin-bottom:12px" onclick="trazerRotinas()">📥 Trazer rotinas do app Rotinas</button>`;
    h += `<div class="mut small" style="margin:0 2px 10px">Rotinas recorrentes. Sequências multiplicam o XP: 3d 1.2x · 7d 1.5x · 14d 1.75x · 30d 2x.</div>`;
    h += l.length ? l.map(it => {
      const A = AREAS[it.area], st = S.streaks[it.id] || { cur: 0, best: 0 };
      return `<div class="item" onclick="editar('${it.id}')" style="cursor:pointer"><div class="area-dot" style="background:${A.cor}"></div><div style="flex:1;min-width:0">
        <div class="nm">${esc(it.nome)}</div>
        <div class="meta"><span>${A.ic} ${A.attr}</span><span>${it.dias.length === 7 ? 'Todo dia' : it.dias.join() === '1,2,3,4,5' ? 'Dias úteis' : it.dias.map(d => DOW[d]).join(' ')}</span><span class="xpchip">${DIF[it.dif].n} · ${DIF[it.dif].xp} XP</span></div>
        ${it.nota ? `<div class="mut small" style="margin-top:4px;font-style:italic">“${esc(it.nota)}”</div>` : ''}
      </div><div style="text-align:right"><div class="fire">🔥 ${st.cur}</div><div class="mut small">rec. ${st.best}</div></div></div>`;
    }).join('') : `<div class="empty">Nenhum hábito ainda.</div>`;
  } else if (jTab === 'missao') {
    const ab = ativos.filter(i => i.tipo === 'missao' && !i.feito).sort((a, b) => (a.prazo || '9') < (b.prazo || '9') ? -1 : 1);
    const fe = ativos.filter(i => i.tipo === 'missao' && i.feito).sort((a, b) => b.feito < a.feito ? -1 : 1).slice(0, 15);
    h += `<div class="mut small" style="margin:0 2px 10px">Tarefas únicas com prazo opcional. Valem XP em dobro.</div>`;
    h += ab.length ? ab.map(missItem).join('') : `<div class="empty">Nenhuma missão aberta.</div>`;
    if (fe.length) h += `<div class="sec-h"><h2>Concluídas</h2></div>` + fe.map(missItem).join('');
  } else if (jTab === 'meta') {
    const l = ativos.filter(i => i.tipo === 'meta').sort((a, b) => !!a.feito - !!b.feito);
    h += `<div class="mut small" style="margin:0 2px 10px">Metas de longo prazo divididas em marcos. Cada marco +40 XP; concluir o épico dá o grande prêmio.</div>`;
    h += l.length ? l.map(m => metaCard(m, true)).join('') : `<div class="empty">Nenhum épico ainda. Que tal “Lançar o MVP do Stratum”?</div>`;
  } else {
    const l = db.itens.filter(i => i.arq);
    h += `<div class="mut small" style="margin:0 2px 10px">Itens arquivados mantêm o XP já conquistado.</div>`;
    h += l.length ? l.map(it => `<div class="item"><div style="flex:1"><div class="nm">${esc(it.nome)}</div><div class="meta">${TIPOS[it.tipo]} · ${AREAS[it.area].ic} ${AREAS[it.area].nome} · arquivado ${fmtD(it.arq)}</div></div><button class="btn ghost sm" onclick="restaurar('${it.id}')">Restaurar</button></div>`).join('') : `<div class="empty">Arquivo vazio.</div>`;
  }
  return h;
}
function restaurar(id) { const it = db.itens.find(i => i.id === id); it.arq = null; save(); S = calc(); render(); }

/* ---------- formulário (modal) ---------- */
let F = null;
function novo(tipo, pre) {
  F = Object.assign({ id: null, tipo: tipo || 'habito', nome: '', area: 'saude', dif: 1, dias: [0, 1, 2, 3, 4, 5, 6], prazo: '', marcos: [], nota: '' }, pre || {});
  openForm();
}
function editar(id) { const it = db.itens.find(i => i.id === id); if (!it) return; F = JSON.parse(JSON.stringify(it)); F.marcos = F.marcos || []; openForm(); }
function openForm() {
  const isNew = !F.id;
  const html = `<h2 class="title">${isNew ? 'Novo item' : 'Editar ' + TIPOS[F.tipo].toLowerCase()}</h2>
    ${isNew ? `<div class="seg" style="margin-top:12px">${Object.entries(TIPOS).map(([k, n]) => `<button class="${F.tipo === k ? 'on' : ''}" onclick="F.nome=$('fNome').value;F.nota=$('fNota').value;F.tipo='${k}';openForm()">${n}</button>`).join('')}</div>
      <div class="mut small">${{ habito: 'Algo que se repete em dias da semana.', missao: 'Tarefa única, com prazo opcional. XP em dobro.', meta: 'Objetivo grande, dividido em marcos.' }[F.tipo]}</div>` : ''}
    <label>Nome</label><input id="fNome" value="${esc(F.nome)}" placeholder="${{ habito: 'Ex.: Treino de força', missao: 'Ex.: Renovar seguro do carro', meta: 'Ex.: Lançar o MVP do Stratum' }[F.tipo]}">
    <label>Área da vida</label><div>${AREA_KEYS.map(a => `<span class="pill ${F.area === a ? 'on' : ''}" onclick="F.area='${a}';[...this.parentNode.children].forEach(e=>e.classList.remove('on'));this.classList.add('on')">${AREAS[a].ic} ${AREAS[a].nome}</span>`).join('')}</div>
    <label>Dificuldade</label><div>${[1, 2, 3].map(d => `<span class="pill ${F.dif === d ? 'on' : ''}" onclick="F.dif=${d};[...this.parentNode.children].forEach(e=>e.classList.remove('on'));this.classList.add('on')">${DIF[d].n} · ${F.tipo === 'meta' ? 100 * d : F.tipo === 'missao' ? DIF[d].xp * 2 : DIF[d].xp} XP</span>`).join('')}</div>
    ${F.tipo === 'habito' ? `<label>Dias da semana</label><div id="fDias">${DOW.map((d, i) => `<span class="pill ${F.dias.includes(i) ? 'on' : ''}" onclick="togDia(${i})">${d}</span>`).join('')}</div>
      <div class="row small" style="gap:6px"><span class="pill" onclick="F.dias=[0,1,2,3,4,5,6];syncDias()">Todos</span><span class="pill" onclick="F.dias=[1,2,3,4,5];syncDias()">Úteis</span><span class="pill" onclick="F.dias=[0,6];syncDias()">Fim de semana</span></div>` : ''}
    ${F.tipo !== 'habito' ? `<label>Prazo (opcional)</label><input type="date" id="fPrazo" value="${F.prazo || ''}">` : ''}
    ${F.tipo === 'meta' ? `<label>Marcos</label><div id="fMarcos">${F.marcos.map((m, i) => `<div class="row" style="margin-bottom:8px"><input value="${esc(m.nome)}" oninput="F.marcos[${i}].nome=this.value"><button class="btn ghost sm" onclick="F.marcos.splice(${i},1);keepForm()">✕</button></div>`).join('')}</div>
      <button class="btn ghost sm" onclick="F.marcos.push({id:uid(),nome:'',feito:null});keepForm()">+ Marco</button>` : ''}
    <label>Por que isso importa? (opcional)</label><input id="fNota" value="${esc(F.nota || '')}" placeholder="Sua motivação — aparece no card">
    <div class="row" style="margin-top:18px"><button class="btn" style="flex:1" onclick="salvarItem()">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>
    ${!isNew ? `<div class="row" style="margin-top:10px"><button class="btn ghost sm" style="flex:1" onclick="arquivar('${F.id}')">📦 Arquivar (mantém XP)</button><button class="btn danger sm" style="flex:1" onclick="excluir('${F.id}')">Excluir</button></div>` : ''}`;
  modal(html);
}
function keepForm() { F.nome = $('fNome').value; F.nota = $('fNota').value; if ($('fPrazo')) F.prazo = $('fPrazo').value; openForm(); }
function togDia(i) { F.dias = F.dias.includes(i) ? F.dias.filter(x => x !== i) : [...F.dias, i].sort(); syncDias(); }
function syncDias() { [...$('fDias').children].forEach((e, i) => e.classList.toggle('on', F.dias.includes(i))); }
function salvarItem() {
  F.nome = $('fNome').value.trim(); F.nota = $('fNota').value.trim();
  if ($('fPrazo')) F.prazo = $('fPrazo').value;
  if (!F.nome) { $('fNome').focus(); toast('✏️', 'Dê um nome ao item.'); return; }
  if (F.tipo === 'habito' && !F.dias.length) { toast('📅', 'Escolha ao menos um dia.'); return; }
  if (F.tipo === 'meta') F.marcos = F.marcos.filter(m => m.nome.trim());
  const isNew = !F.id;
  act(null, () => {
    if (isNew) { F.id = uid(); F.criado = hoje(); if (F.tipo !== 'meta') delete F.marcos; if (F.tipo !== 'habito') delete F.dias; db.itens.push(F); }
    else { const i = db.itens.findIndex(x => x.id === F.id); db.itens[i] = F; }
  });
  closeModal();
  if (isNew) { toast('✨', `<b>${esc(F.nome)}</b> adicionado à jornada`); if (view === 'jornada') { jTab = F.tipo; render(); } }
}
function arquivar(id) { act(null, () => { db.itens.find(i => i.id === id).arq = hoje(); }); closeModal(); toast('📦', 'Arquivado. O XP conquistado continua seu.'); }
function excluir(id) {
  ask('Excluir definitivamente? Todo o XP que este item gerou será removido. <b>Arquivar mantém o XP.</b>', () => act(null, () => { db.itens = db.itens.filter(i => i.id !== id); Object.values(db.log).forEach(l => delete l[id]); }), 'Excluir', true);
}

/* ---------- sugestões ---------- */
function abrirSug() { sugArea = 'voce'; renderSug(); }
function renderSug() {
  const nomes = new Set(db.itens.filter(i => !i.arq).map(i => i.nome.toLowerCase()));
  const ord = areaFraca(S);
  let list;
  if (sugArea === 'voce') {
    list = [];
    ord.slice(0, 3).forEach(a => list.push(...SUG.filter(s => s.a === a && !nomes.has(s.n.toLowerCase())).slice(0, 3)));
  } else list = SUG.filter(s => s.a === sugArea);
  const tl = { h: 'Hábito', m: 'Missão', e: 'Épico' };
  const html = `<h2 class="title">💡 Sugestões</h2><div class="mut small" style="margin-bottom:12px">Curadas para seu momento: executivo, founder e investidor. Toque em + para adicionar — você pode editar depois.</div>
    <div style="margin-bottom:8px"><span class="pill ${sugArea === 'voce' ? 'on' : ''}" onclick="sugArea='voce';renderSug()">⭐ Para você</span>${AREA_KEYS.map(a => `<span class="pill ${sugArea === a ? 'on' : ''}" onclick="sugArea='${a}';renderSug()">${AREAS[a].ic} ${AREAS[a].nome}</span>`).join('')}</div>
    ${sugArea === 'voce' ? `<div class="insight" style="border-color:${AREAS[ord[0]].cor}">Suas áreas com menos atenção: <b>${ord.slice(0, 3).map(a => AREAS[a].nome).join(', ')}</b>. Equilíbrio acelera a evolução do avatar.</div>` : ''}
    ${list.map(s => {
    const has = nomes.has(s.n.toLowerCase()), A = AREAS[s.a];
    return `<div class="sug"><div style="font-size:22px">${A.ic}</div><div style="flex:1;min-width:0"><div class="nm">${esc(s.n)}</div>
        <div class="mut small">${tl[s.t]} · ${DIF[s.d].n}${s.dias ? ' · ' + (s.dias.length === 7 ? 'todo dia' : s.dias.map(d => DOW[d]).join(' ')) : ''}${s.marcos ? ' · ' + s.marcos.length + ' marcos' : ''}</div>
        ${s.why ? `<div class="small" style="color:#c4b5fd;margin-top:3px">${esc(s.why)}</div>` : ''}</div>
        ${has ? '<span class="small" style="color:var(--ok);font-weight:800">✓</span>' : `<button class="btn sm" onclick="addSug(event,'${s.id}')">+</button>`}</div>`;
  }).join('') || '<div class="empty">Você já adicionou todas as sugestões desta lista. 👏</div>'}
    <button class="btn ghost full" style="margin-top:10px" onclick="closeModal()">Fechar</button>`;
  modal(html);
}
function addSug(ev, sid) {
  const s = SUG.find(x => x.id === sid);
  const it = { id: uid(), tipo: { h: 'habito', m: 'missao', e: 'meta' }[s.t], nome: s.n, area: s.a, dif: s.d, criado: hoje(), nota: s.why || '' };
  if (s.t === 'h') it.dias = s.dias.slice();
  if (s.t === 'e') it.marcos = s.marcos.map(n => ({ id: uid(), nome: n, feito: null }));
  if (s.t !== 'h') it.prazo = '';
  act(ev, () => db.itens.push(it));
  snd('coin'); toast('✨', `<b>${esc(s.n)}</b> adicionado`);
  renderSug();
}

/* =================== HERÓI =================== */
function radar() {
  const N = 6, cx = 160, cy = 150, R = 105, mx = Math.max(5, ...AREA_KEYS.map(a => S.areaLv[a]));
  const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  let g = '';
  [.25, .5, .75, 1].forEach(f => g += `<polygon points="${AREA_KEYS.map((_, i) => pt(i, R * f).join(',')).join(' ')}" fill="none" stroke="rgba(148,163,184,.18)"/>`);
  AREA_KEYS.forEach((a, i) => { const [x, y] = pt(i, R); g += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(148,163,184,.18)"/>`; });
  const poly = AREA_KEYS.map((a, i) => pt(i, Math.max(.06, S.areaLv[a] / mx) * R).join(',')).join(' ');
  g += `<polygon points="${poly}" fill="rgba(124,92,255,.35)" stroke="#a78bfa" stroke-width="2.5"/>`;
  AREA_KEYS.forEach((a, i) => { const [x, y] = pt(i, Math.max(.06, S.areaLv[a] / mx) * R); g += `<circle cx="${x}" cy="${y}" r="4.5" fill="${AREAS[a].cor}" stroke="#fff" stroke-width="1.5"/>`; });
  AREA_KEYS.forEach((a, i) => { const [x, y] = pt(i, R + 26); g += `<text x="${x}" y="${y - 2}" text-anchor="middle" font-size="16">${AREAS[a].ic}</text><text x="${x}" y="${y + 13}" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-weight="700">${AREAS[a].nome} ${S.areaLv[a]}</text>`; });
  return `<svg viewBox="0 0 320 300">${g}</svg>`;
}
function renderHeroi() {
  const li = lvlInfo(S.total), T = AV.TIERS[S.tier], nx = AV.TIERS[S.tier + 1], cl = CLASSES[db.perfil.classe];
  const nConq = CONQ.filter(c => db.ui.conq[c.id]).length;
  let h = `<div class="card glow" style="text-align:center">
    <div style="width:230px;height:288px;margin:0 auto">${AV.render(avOpts(S))}</div>
    <div class="title" style="font-size:24px;font-weight:900;margin-top:4px">${esc(db.perfil.nome)}</div>
    <div class="tier" style="font-size:15px">Nível ${S.lvl} · ${T.n}</div>
    <div class="mut small" style="margin-top:3px">${cl ? cl.ic + ' ' + cl.n + ' — ' + cl.d : ''}</div>
    <div class="bar xp" style="margin:14px 10px 6px"><i style="width:${li.pct.toFixed(1)}%"></i></div>
    <div class="mut small mono">${fmtN(li.cur)} / ${fmtN(li.next)} XP · total ${fmtN(S.total)}</div>
    ${nx ? `<div class="small" style="margin-top:10px;color:var(--gold)">Próxima forma: <b>${nx.n}</b> no nível ${nx.min} — faltam ${fmtN(need(nx.min) - S.total)} XP</div>` : '<div class="small" style="margin-top:10px;color:var(--gold)">Forma máxima alcançada. Você é uma Lenda.</div>'}
    <button class="btn ghost sm" style="margin-top:14px" onclick="personalizar()">🎨 Personalizar avatar</button>
  </div>`;
  h += `<div class="sec-h"><h2>Evolução</h2><span class="mut small">${S.tier + 1}/8 formas</span></div><div class="card"><div class="road">${AV.TIERS.map((t, i) => `<div class="st ${i === S.tier ? 'cur' : ''} ${i > S.tier ? 'locked' : ''}">${AV.render(avOpts(S, { tier: i, anim: false, mood: 'feliz' }))}<div class="n">${t.n}</div><div class="mut small">Nv ${t.min}</div></div>`).join('')}</div>
    <div class="mut small">Cada forma desbloqueia roupas e equipamentos. Os <b>atributos</b> abaixo adicionam itens próprios ao avatar.</div></div>`;
  h += `<div class="sec-h"><h2>Atributos</h2></div><div class="card">${AREA_KEYS.map(a => {
    const A = AREAS[a], i = lvlInfo(S.area[a], needA);
    return `<div class="attr"><div class="ic" style="background:${A.cor}22">${A.ic}</div><div style="flex:1;min-width:0">
      <div class="row between"><b>${A.attr} <span class="mut small" style="font-weight:600">· ${A.nome}</span></b><span class="mut small mono">${fmtN(i.cur)}/${fmtN(i.next)}</span></div>
      <div class="bar" style="margin-top:6px"><i style="width:${i.pct.toFixed(1)}%;background:${A.cor}"></i></div>
      <div class="mut" style="font-size:10.5px;margin-top:4px">${A.perk}</div></div><div class="lv" style="color:${A.cor}">${i.lvl}</div></div>`;
  }).join('')}</div>`;
  h += `<div class="sec-h"><h2>Roda da vida</h2></div><div class="card radar">${radar()}</div>`;
  h += `<div class="sec-h"><h2>Conquistas</h2><span class="mut small">${nConq}/${CONQ.length}</span></div><div class="card"><div class="ach-grid">${CONQ.map(c => { const u = db.ui.conq[c.id]; return `<div class="ach ${c.r} ${u ? '' : 'lock'}"><div class="i">${c.ic}</div><div class="n">${esc(c.n)}</div><div class="d">${esc(c.d)}</div>${u ? `<div class="d" style="color:var(--gold)">${fmtD(u)}</div>` : ''}</div>`; }).join('')}</div></div>`;
  return h;
}

/* ---------- personalização (também usada no onboarding) ---------- */
let P = null;
function avPicker(target) {
  return `<label>Tom de pele</label><div>${AV.SKINS.map(c => `<span class="swatch ${P.pele === c ? 'on' : ''}" style="background:${c}" onclick="P.pele='${c}';${target}()"></span>`).join('')}</div>
    <label>Cabelo</label><div>${AV.HAIRS.map(([k, n]) => `<span class="pill ${P.cabelo === k ? 'on' : ''}" onclick="P.cabelo='${k}';${target}()">${n}</span>`).join('')}</div>
    <label>Cor do cabelo</label><div>${AV.HAIRC.map(c => `<span class="swatch ${P.corCabelo === c ? 'on' : ''}" style="background:${c}" onclick="P.corCabelo='${c}';${target}()"></span>`).join('')}</div>
    <label>Barba</label><div>${AV.BEARDS.map(([k, n]) => `<span class="pill ${P.barba === k ? 'on' : ''}" onclick="P.barba='${k}';${target}()">${n}</span>`).join('')}</div>
    <label>Acessório</label><div><span class="pill ${P.oculos ? 'on' : ''}" onclick="P.oculos=!P.oculos;${target}()">👓 Óculos</span></div>`;
}
function personalizar() { P = Object.assign({}, db.perfil); renderPers(); }
function renderPers() {
  const st = S;
  modal(`<h2 class="title">🎨 Personalizar</h2>
    <div style="width:180px;height:225px;margin:0 auto">${AV.render(Object.assign(avOpts(st), { skin: P.pele, hair: P.cabelo, hairColor: P.corCabelo, beard: P.barba, glasses: P.oculos }))}</div>
    <label>Nome do herói</label><input id="pNome" value="${esc(P.nome)}" oninput="P.nome=this.value">
    ${avPicker('renderPers')}
    <label>Classe</label>${Object.entries(CLASSES).map(([k, c]) => `<div class="classcard ${P.classe === k ? 'on' : ''}" onclick="P.classe='${k}';renderPers()"><b>${c.ic} ${c.n}</b><div class="mut small">${c.d}</div></div>`).join('')}
    <div class="mut small">Mudar de classe recalcula o bônus em todo o histórico.</div>
    <div class="row" style="margin-top:16px"><button class="btn" style="flex:1" onclick="salvarPers()">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`, true);
}
function salvarPers() { if (!P.nome.trim()) return toast('✏️', 'Dê um nome ao herói.'); act(null, () => { db.perfil = P; }); closeModal(); }

/* =================== TESOURO (loja) =================== */
function renderLoja() {
  let h = `<div class="card" style="text-align:center;background:linear-gradient(135deg,rgba(251,191,36,.16),rgba(20,29,52,.7))">
    <div style="font-size:44px">🪙</div><div class="title" style="font-size:34px;font-weight:900;color:var(--gold)">${fmtN(S.gold)}</div>
    <div class="mut small">ouro disponível · ${fmtN(S.goldEarned)} ganho no total · ${fmtN(S.spent)} gasto</div>
    <div class="small" style="margin-top:10px;color:#fde68a">1 ouro a cada 4 XP · +100 por chefão derrotado</div></div>`;
  h += `<div class="sec-h"><h2>Recompensas</h2><button class="btn ghost sm" onclick="formRec()">+ Nova</button></div>`;
  h += `<div class="mut small" style="margin:0 2px 10px">Defina prêmios reais e só se permita resgatar quando tiver ouro. É o seu sistema de “merecimento”.</div>`;
  h += db.recompensas.length ? db.recompensas.map(r => `<div class="reward"><div class="ic" onclick="formRec('${r.id}')">${r.ic}</div><div style="flex:1;min-width:0" onclick="formRec('${r.id}')"><div style="font-weight:700">${esc(r.nome)}</div><div class="price">🪙 ${fmtN(r.custo)}</div></div>
      <button class="btn gold sm" ${S.gold < r.custo ? 'disabled' : ''} onclick="comprar(event,'${r.id}')">${S.gold < r.custo ? 'faltam ' + fmtN(r.custo - S.gold) : 'Resgatar'}</button></div>`).join('') : '<div class="empty">Nenhuma recompensa cadastrada.</div>';
  const hist = db.compras.slice().reverse().slice(0, 12);
  if (hist.length) h += `<div class="sec-h"><h2>Resgates</h2></div><div class="card">${hist.map(c => `<div class="row between" style="padding:6px 0;border-bottom:1px solid var(--line)"><span>${esc(c.ic || '🎁')} ${esc(c.nome)}</span><span class="mut small mono">${fmtD(c.data)} · 🪙 ${fmtN(c.custo)}</span></div>`).join('')}</div>`;
  return h;
}
function comprar(ev, id) {
  const r = db.recompensas.find(x => x.id === id);
  if (S.gold < r.custo) return;
  const x = ev.clientX, y = ev.clientY;
  ask(`Resgatar <b>${esc(r.ic + ' ' + r.nome)}</b> por 🪙 ${fmtN(r.custo)}?`, () => comprarOk(r, x, y), 'Resgatar');
}
function comprarOk(r, x, y) {
  db.compras.push({ rid: r.id, nome: r.nome, ic: r.ic, custo: r.custo, data: hoje() }); save();
  const st = calc(); celebrate(st, false); S = st;
  floatTxt(x, y, `-${r.custo} 🪙`, true); snd('coin'); vib(20);
  toast(r.ic, `Aproveite: <b>${esc(r.nome)}</b>. Você mereceu.`); render();
}
let R = null;
const EMOJIS = ['🎁', '🍷', '🍰', '📺', '📚', '🎧', '🏖️', '✈️', '🎮', '⛳', '🍣', '💆', '👟', '⌚', '🎬', '🛍️'];
function formRec(id) { R = id ? Object.assign({}, db.recompensas.find(r => r.id === id)) : { id: null, nome: '', custo: 100, ic: '🎁' }; renderRec(); }
function renderRec() {
  modal(`<h2 class="title">${R.id ? 'Editar' : 'Nova'} recompensa</h2>
    <label>Ícone</label><div>${EMOJIS.map(e => `<span class="pill ${R.ic === e ? 'on' : ''}" style="font-size:18px" onclick="R.nome=$('rNome').value;R.custo=+$('rCusto').value;R.ic='${e}';renderRec()">${e}</span>`).join('')}</div>
    <label>Recompensa</label><input id="rNome" value="${esc(R.nome)}" placeholder="Ex.: Jantar especial">
    <label>Custo em ouro</label><input id="rCusto" type="number" min="1" value="${R.custo}">
    <div class="mut small" style="margin-top:6px">Referência: um dia bom rende ~30–50 de ouro.</div>
    <div class="row" style="margin-top:16px"><button class="btn" style="flex:1" onclick="salvarRec()">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>
    ${R.id ? `<button class="btn danger sm full" style="margin-top:10px" onclick="db.recompensas=db.recompensas.filter(r=>r.id!=='${R.id}');save();closeModal();render()">Excluir recompensa</button>` : ''}`);
}
function salvarRec() {
  R.nome = $('rNome').value.trim(); R.custo = Math.max(1, Math.round(+$('rCusto').value || 0));
  if (!R.nome) return toast('✏️', 'Dê um nome à recompensa.');
  if (R.id) db.recompensas[db.recompensas.findIndex(r => r.id === R.id)] = R; else { R.id = uid(); db.recompensas.push(R); }
  save(); closeModal(); render();
}

/* =================== ANÁLISE =================== */
function aderencia() {
  const T = hoje(), habs = db.itens.filter(i => i.tipo === 'habito');
  const ph = {}, pa = {}, pw = Array(7).fill(0).map(() => ({ s: 0, d: 0 }));
  let s = 0, d = 0, perf = 0, dias = 0;
  for (let i = aPer - 1; i >= 0; i--) {
    const ds = addDays(T, -i), dow = D(ds).getDay();
    let ds_s = 0, ds_d = 0;
    habs.forEach(h => {
      if (!habAtivo(h, ds)) return;
      const ok = !!(db.log[ds] && db.log[ds][h.id]);
      ds_s++; if (ok) ds_d++;
      (ph[h.id] = ph[h.id] || { h, s: 0, d: 0 }).s++; if (ok) ph[h.id].d++;
      (pa[h.area] = pa[h.area] || { s: 0, d: 0 }).s++; if (ok) pa[h.area].d++;
    });
    if (ds_s) { dias++; s += ds_s; d += ds_d; pw[dow].s += ds_s; pw[dow].d += ds_d; if (ds_d === ds_s) perf++; }
  }
  return { s, d, perf, dias, ph: Object.values(ph).map(x => Object.assign(x, { r: x.d / x.s })).sort((a, b) => b.r - a.r || b.s - a.s), pa, pw };
}
function aCor(r) { return r >= .8 ? 'var(--ok)' : r >= .5 ? 'var(--warn)' : 'var(--bad)'; }
function aBar(label, r, extra) {
  return `<div style="margin-bottom:11px"><div class="row between small"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${label}</span><b class="mono" style="color:${aCor(r)}">${Math.round(r * 100)}%${extra ? ` <span class="mut" style="font-weight:500">${extra}</span>` : ''}</b></div><div class="bar" style="margin-top:5px;height:7px"><i style="width:${(r * 100).toFixed(1)}%;background:${aCor(r)}"></i></div></div>`;
}
function renderAderencia() {
  const a = aderencia(), r = a.s ? a.d / a.s : 0;
  let h = `<div class="sec-h"><h2>Aderência</h2><div>${[7, 30, 90].map(p => `<span class="pill ${p === aPer ? 'on' : ''}" style="margin:0 0 0 6px" onclick="aPer=${p};render()">${p}d</span>`).join('')}</div></div>`;
  if (!a.s) return h + `<div class="card mut small">Sem hábitos programados neste período.</div>`;
  h += `<div class="card"><div class="grid3">
      <div><div style="font-size:11px;color:var(--mut);font-weight:700;text-transform:uppercase;letter-spacing:.8px">Aderência</div><div class="title" style="font-size:30px;font-weight:900;color:${aCor(r)}">${Math.round(r * 100)}%</div></div>
      <div><div style="font-size:11px;color:var(--mut);font-weight:700;text-transform:uppercase;letter-spacing:.8px">Cumpridos</div><div class="mono" style="font-size:20px;font-weight:800;margin-top:6px">${a.d}/${a.s}</div></div>
      <div><div style="font-size:11px;color:var(--mut);font-weight:700;text-transform:uppercase;letter-spacing:.8px">Dias 100%</div><div class="mono" style="font-size:20px;font-weight:800;margin-top:6px">${a.perf}/${a.dias}</div></div>
    </div><div class="mut small" style="margin-top:8px">Últimos ${aPer} dias, incluindo hoje.</div></div>`;
  const top = a.ph.slice(0, 3), bot = a.ph.length > 3 ? a.ph.slice(-3).reverse() : a.ph.slice().reverse().filter(x => !top.includes(x) || a.ph.length < 2);
  const lin = x => `<div class="row between small" style="padding:6px 0"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x.h.nome)}</span><b class="mono" style="color:${aCor(x.r)}">${Math.round(x.r * 100)}% <span class="mut" style="font-weight:500">(${x.d}/${x.s})</span></b></div>`;
  h += `<div class="card"><b style="color:var(--ok)">✔ Faço bem</b><div style="margin-top:6px">${top.map(lin).join('')}</div>
    ${a.ph.length > 3 ? `<div style="height:1px;background:var(--line);margin:10px 0"></div><b style="color:var(--bad)">✖ Faço mal</b><div style="margin-top:6px">${bot.map(lin).join('')}</div>` : ''}</div>`;
  h += `<div class="card"><div class="mut small" style="margin-bottom:10px;font-weight:700">Por hábito</div>${a.ph.map(x => aBar(`${AREAS[x.h.area].ic} ${esc(x.h.nome)}${x.h.arq ? ' <span class="mut">(arquivado)</span>' : ''}`, x.r, `${x.d}/${x.s}`)).join('')}</div>`;
  h += `<div class="card"><div class="mut small" style="margin-bottom:10px;font-weight:700">Por área</div>${AREA_KEYS.filter(k => a.pa[k]).sort((x, y) => a.pa[y].d / a.pa[y].s - a.pa[x].d / a.pa[x].s).map(k => aBar(`${AREAS[k].ic} ${AREAS[k].nome}`, a.pa[k].d / a.pa[k].s, `${a.pa[k].d}/${a.pa[k].s}`)).join('')}</div>`;
  const wk = [1, 2, 3, 4, 5, 6, 0].filter(i => a.pw[i].s);
  h += `<div class="card"><div class="mut small" style="margin-bottom:10px;font-weight:700">Por dia da semana</div><div class="bars" style="height:110px;align-items:flex-end">${wk.map(i => { const v = a.pw[i].d / a.pw[i].s; return `<div style="height:${Math.max(3, v * 100)}%;background:${aCor(v)};opacity:.85" title="${DOW[i]}: ${Math.round(v * 100)}%"></div>`; }).join('')}</div>
    <div class="row small mut" style="gap:3px;margin-top:6px">${wk.map(i => `<span style="flex:1;text-align:center">${DOW[i]}<br><b class="mono" style="color:${aCor(a.pw[i].d / a.pw[i].s)}">${Math.round(a.pw[i].d / a.pw[i].s * 100)}%</b></span>`).join('')}</div></div>`;
  return h;
}
function renderAnalise() {
  const T = hoje();
  const sumR = (a, b) => { let s = 0; for (let i = a; i < b; i++) s += S.daily[addDays(T, -i)] || 0; return s; };
  const x7 = sumR(0, 7), x7p = sumR(7, 14), x30 = sumR(0, 30);
  const trend = x7p ? Math.round((x7 - x7p) / x7p * 100) : null;
  const kills = S.bosses.filter(b => b.kill).length;
  let h = renderAderencia() + `<div class="sec-h"><h2>Evolução</h2></div><div class="grid2">
    <div class="kpi"><div class="l">XP 7 dias</div><div class="v">${fmtN(x7)}</div><div class="small" style="color:${trend == null ? 'var(--mut)' : trend >= 0 ? 'var(--ok)' : 'var(--bad)'}">${trend == null ? '—' : (trend >= 0 ? '▲ ' : '▼ ') + Math.abs(trend) + '% vs semana anterior'}</div></div>
    <div class="kpi"><div class="l">Média diária (30d)</div><div class="v">${fmtN(x30 / 30)}</div><div class="mut small">XP por dia</div></div>
    <div class="kpi"><div class="l">Maior sequência</div><div class="v">🔥 ${S.maxStreak}</div><div class="mut small">dias seguidos</div></div>
    <div class="kpi"><div class="l">Dias perfeitos</div><div class="v">💎 ${S.perfect}</div><div class="mut small">100% dos hábitos</div></div>
    <div class="kpi"><div class="l">Chefões</div><div class="v">⚔️ ${kills}/${S.bosses.length}</div><div class="mut small">semanas vencidas</div></div>
    <div class="kpi"><div class="l">Concluídos</div><div class="v">${fmtN(S.habDone + S.missDone)}</div><div class="mut small">${S.habDone} hábitos · ${S.missDone} missões</div></div>
  </div>`;
  // barras 30 dias
  let bars = '', mx = 1;
  for (let i = 29; i >= 0; i--) mx = Math.max(mx, S.daily[addDays(T, -i)] || 0);
  for (let i = 29; i >= 0; i--) { const v = S.daily[addDays(T, -i)] || 0; bars += `<div class="${i === 0 ? 'today' : ''}" style="height:${Math.max(2, v / mx * 100)}%" title="${fmtD(addDays(T, -i))}: ${v} XP"></div>`; }
  h += `<div class="sec-h"><h2>XP — últimos 30 dias</h2><span class="mut small">máx ${fmtN(mx)}</span></div><div class="card"><div class="bars">${bars}</div></div>`;
  // heatmap 18 semanas
  const end = T, startW = addDays(end, -(D(end).getDay()) - 7 * 17);
  let cells = '';
  for (let ds = startW; ds <= addDays(startW, 18 * 7 - 1); ds = addDays(ds, 1)) {
    const sc = S.sched[ds];
    let bg = 'rgba(255,255,255,.05)';
    if (ds > T) bg = 'transparent';
    else if (sc && sc.sch) { const r = sc.done / sc.sch; bg = r === 0 ? 'rgba(239,68,68,.22)' : `rgba(124,92,255,${(.2 + r * .8).toFixed(2)})`; if (r === 1 && sc.sch >= 3) bg = '#fbbf24'; }
    cells += `<div style="background:${bg}" title="${fmtD(ds)}${sc && sc.sch ? `: ${sc.done}/${sc.sch}` : ''}"></div>`;
  }
  h += `<div class="sec-h"><h2>Consistência — 18 semanas</h2></div><div class="card"><div class="heat">${cells}</div>
    <div class="row small mut" style="margin-top:10px;gap:12px;flex-wrap:wrap"><span><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:rgba(239,68,68,.35)"></i> nada feito</span><span><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:rgba(124,92,255,.6)"></i> parcial</span><span><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#fbbf24"></i> dia perfeito</span></div></div>`;
  // insights
  h += `<div class="sec-h"><h2>Leitura do Jarvis</h2></div>` + insights().map(t => `<div class="insight">${t}</div>`).join('');
  return h;
}
function insights() {
  const T = hoje(), out = [];
  const a30 = {}; AREA_KEYS.forEach(a => a30[a] = 0);
  for (let i = 0; i < 30; i++) { const da = S.dailyArea[addDays(T, -i)] || {}; AREA_KEYS.forEach(a => a30[a] += da[a] || 0); }
  const ord = AREA_KEYS.slice().sort((a, b) => a30[b] - a30[a]), tot = AREA_KEYS.reduce((s, a) => s + a30[a], 0);
  const usados = diffDays(db.criado || T, T) + 1;
  if (!tot || usados < 7) return [`Ainda é cedo para ler padrões (${usados} ${usados === 1 ? 'dia' : 'dias'} de jornada). Com 7 dias de uso eu aponto seu ponto forte, seu ponto cego e o hábito que precisa de ajuste.`];
  const fo = ord[0], fr = ord[ord.length - 1];
  out.push(`💪 <b>Ponto forte:</b> ${AREAS[fo].ic} ${AREAS[fo].nome} concentrou <b>${Math.round(a30[fo] / tot * 100)}%</b> do seu XP em 30 dias.`);
  if (a30[fr] / tot < .08) out.push(`⚠️ <b>Ponto cego:</b> ${AREAS[fr].ic} ${AREAS[fr].nome} recebeu só <b>${Math.round(a30[fr] / tot * 100)}%</b> da sua energia. Um hábito leve aqui já muda o equilíbrio. <a href="#" onclick="sugArea='${fr}';renderSug();return false" style="color:#a78bfa">Ver sugestões →</a>`);
  // por hábito
  const habs = db.itens.filter(i => i.tipo === 'habito' && !i.arq), taxa = [];
  habs.forEach(hb => { let s = 0, d = 0; for (let i = 1; i <= 30; i++) { const ds = addDays(T, -i); if (habAtivo(hb, ds)) { s++; if (db.log[ds] && db.log[ds][hb.id]) d++; } } if (s >= 3) taxa.push({ hb, r: d / s, s, d }); });
  taxa.sort((a, b) => b.r - a.r);
  if (taxa.length) {
    const b = taxa[0]; out.push(`🏅 <b>Mais consistente:</b> “${esc(b.hb.nome)}” — ${Math.round(b.r * 100)}% de cumprimento (${b.d}/${b.s}).`);
    const w = taxa[taxa.length - 1];
    if (taxa.length > 1 && w.r < .5) out.push(`🔧 <b>Precisa de ajuste:</b> “${esc(w.hb.nome)}” está em ${Math.round(w.r * 100)}%. Reduza a dificuldade ou a frequência — constância vale mais que ambição.`);
  }
  // dia da semana
  const dw = Array(7).fill(0).map(() => ({ s: 0, d: 0 }));
  for (let i = 1; i <= 56; i++) { const ds = addDays(T, -i), sc = S.sched[ds]; if (sc && sc.sch) { const k = D(ds).getDay(); dw[k].s += sc.sch; dw[k].d += sc.done; } }
  const dr = dw.map((x, i) => ({ i, r: x.s ? x.d / x.s : null })).filter(x => x.r != null);
  if (dr.length >= 4) { dr.sort((a, b) => b.r - a.r); out.push(`📅 Seu melhor dia é <b>${DOW[dr[0].i]}</b> (${Math.round(dr[0].r * 100)}%); o mais fraco é <b>${DOW[dr[dr.length - 1].i]}</b> (${Math.round(dr[dr.length - 1].r * 100)}%). Planeje o dia fraco com antecedência.`); }
  if (S.energia < 40) out.push(`🪫 Sua energia está em ${S.energia}%. Hábitos perdidos drenam energia; cumpridos recarregam. Foque nos 2 mais fáceis hoje para virar o jogo.`);
  const nx = AV.TIERS[S.tier + 1];
  if (nx) { const avg = Object.keys(S.daily).length ? (() => { let s = 0; for (let i = 0; i < 14; i++) s += S.daily[addDays(T, -i)] || 0; return s / 14; })() : 0; if (avg > 0) out.push(`🔮 No ritmo atual (~${fmtN(avg)} XP/dia), você vira <b>${nx.n}</b> em cerca de <b>${Math.ceil((need(nx.min) - S.total) / avg)} dias</b>.`); }
  return out;
}

/* =================== MODAL / CONFIG =================== */
function modal(html, keepScroll) {
  let m = $('modal');
  const sc = m && keepScroll ? m.querySelector('.sheet').scrollTop : 0;
  if (!m) { m = document.createElement('div'); m.id = 'modal'; m.className = 'modal'; m.onclick = e => { if (e.target === m) closeModal(); }; document.body.appendChild(m); }
  m.innerHTML = `<div class="sheet">${html}</div>`;
  if (keepScroll) m.querySelector('.sheet').scrollTop = sc;
}
function ask(msg, yes, okTxt = 'Confirmar', danger = false) {
  window.__ask = yes;
  modal(`<h2 class="title">Confirmar</h2><p style="line-height:1.5">${msg}</p><div class="row" style="margin-top:16px"><button class="btn ${danger ? 'danger' : ''}" style="flex:1" onclick="closeModal();window.__ask()">${okTxt}</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`);
}
function closeModal() { const m = $('modal'); if (m) m.remove(); }
function config() {
  modal(`<h2 class="title">⚙️ Configurações</h2>
    <div class="row between" style="margin-top:14px"><span>🔊 Sons</span><span class="pill ${db.ui.som ? 'on' : ''}" onclick="db.ui.som=!db.ui.som;save();config()">${db.ui.som ? 'Ligado' : 'Desligado'}</span></div>
    <div class="row between"><span>📳 Vibração</span><span class="pill ${db.ui.vib ? 'on' : ''}" onclick="db.ui.vib=!db.ui.vib;save();config()">${db.ui.vib ? 'Ligada' : 'Desligada'}</span></div>
    <label>Como o jogo funciona</label>
    <div class="small" style="line-height:1.6;color:#cbd5e1">
      • <b>Hábitos</b>: 10 / 25 / 50 XP (leve/média/épica), multiplicados pela sequência (até 2x).<br>
      • <b>Missões</b>: XP em dobro. <b>Épicos</b>: +40 por marco e 100–300 ao concluir.<br>
      • <b>Dia perfeito</b> (todos os hábitos, mín. 3): +30 XP.<br>
      • <b>Chefão semanal</b>: HP = 70% do XP planejado da semana. Derrotar: +150 XP e +100 ouro.<br>
      • <b>Desafio do dia</b>: XP em dobro, sempre na área mais negligenciada.<br>
      • <b>Energia</b>: +4 por hábito cumprido, −10 por hábito perdido. Define o humor do avatar.<br>
      • <b>Ouro</b>: 1 a cada 4 XP. Troque por recompensas reais no Tesouro.<br>
      • <b>Avatar</b>: muda de forma nos níveis 5, 10, 15, 20, 30, 40 e 50, e ganha itens conforme cada atributo evolui.</div>
    <label>Seus dados</label><div class="mut small" style="margin-bottom:8px">Ficam salvos neste aparelho. Faça backup de vez em quando.</div>
    <button class="btn ghost full" style="margin-bottom:8px" onclick="exportar()">⬇ Exportar backup</button>
    <button class="btn ghost full" style="margin-bottom:8px" onclick="$('imp').click()">⬆ Importar backup</button>
    <button class="btn ghost full" style="margin-bottom:8px" onclick="trazerRotinas()">📥 Trazer rotinas do app Rotinas</button>
    <button class="btn danger full" style="margin-bottom:8px" onclick="zerarProgresso()">↺ Zerar progresso (mantém herói e itens)</button>
    <button class="btn danger full" onclick="zerar()">Apagar tudo e recomeçar</button>
    <button class="btn ghost full" style="margin-top:14px" onclick="closeModal()">Fechar</button>`);
}
async function exportar() {
  const data = JSON.stringify(db, null, 2), filename = 'jornada-backup-' + hoje() + '.json';
  try { const dl = window.claude && claude.use ? await claude.use('downloads') : null; if (dl) { await dl.save({ filename, data }); return; } } catch (e) { return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }));
  a.download = 'jornada-backup-' + hoje() + '.json'; a.click();
}
function importar(e) {
  const f = e.target.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => { try { const j = JSON.parse(rd.result); if (Array.isArray(j.rotinas) && !j.itens) { closeModal(); return rotinasPreview(j.rotinas); } if (!j.itens || !j.perfil) throw 0; db = Object.assign(DEF(), j); db.ui = Object.assign(DEF().ui, j.ui || {}); save(); S = calc(); celebrate(S, true); closeModal(); render(); toast('✅', 'Backup importado.'); } catch (x) { toast('⚠️', 'Arquivo inválido.'); } };
  rd.readAsText(f); e.target.value = '';
}
/* ---------- importação de rotinas do app Rotinas (sem histórico) ---------- */
const CAT_AREA = { 'Saúde': 'saude', 'Trabalho': 'carreira', 'Pessoal': 'proposito', 'Financeiro': 'financas', 'Família': 'relacoes', 'Estudo': 'mente' };
let RI = null;
function trazerRotinas() {
  let local = null;
  try { const r = localStorage.getItem('rotinasApp.v1'); if (r) local = JSON.parse(r); } catch (e) { }
  if (local && Array.isArray(local.rotinas) && local.rotinas.length) return rotinasPreview(local.rotinas);
  modal(`<h2 class="title">📥 Trazer rotinas do Rotinas</h2>
    <p style="line-height:1.55">1. Abra o app <b>Rotinas</b> e toque em <b>⋯</b> (ou na aba <b>Dados</b>).<br>2. Toque em <b>Exportar backup (.json)</b>.<br>3. Volte aqui e selecione o arquivo baixado.</p>
    <div class="mut small">Só as rotinas vêm para cá, como hábitos. O histórico de dias marcados não é importado.</div>
    <button class="btn full" style="margin-top:16px" onclick="$('imp').click()">Selecionar arquivo do Rotinas</button>
    <button class="btn ghost full" style="margin-top:8px" onclick="closeModal()">Cancelar</button>`);
}
function rotinasPreview(rots) {
  const nomes = new Set(db.itens.filter(i => i.tipo === 'habito' && !i.arq).map(i => i.nome.trim().toLowerCase()));
  RI = rots.filter(r => r && r.nome && !r.arq).map(r => ({
    nome: String(r.nome).trim(), area: CAT_AREA[r.cat] || 'proposito', cat: r.cat || '',
    dias: Array.isArray(r.dias) && r.dias.length ? r.dias.map(Number).filter(d => d >= 0 && d <= 6).sort() : [0, 1, 2, 3, 4, 5, 6],
    dup: nomes.has(String(r.nome).trim().toLowerCase()), on: !nomes.has(String(r.nome).trim().toLowerCase())
  }));
  if (!RI.length) return toast('⚠️', 'Nenhuma rotina encontrada nesse arquivo.');
  renderRI();
}
function renderRI() {
  const n = RI.filter(r => r.on).length;
  modal(`<h2 class="title">📥 ${RI.length} rotinas encontradas</h2>
    <div class="mut small" style="margin-bottom:12px">Entram como hábitos, nível Leve, nos mesmos dias da semana. Ajuste área e dificuldade depois, se quiser.</div>
    ${RI.map((r, i) => `<div class="sug" style="cursor:pointer;${r.on ? 'border-color:var(--acc);background:rgba(124,92,255,.12)' : ''}" onclick="RI[${i}].on=!RI[${i}].on;renderRI()">
      <div class="chk ${r.on ? 'on' : ''}" style="width:26px;height:26px;min-width:26px;font-size:14px">${r.on ? '✓' : ''}</div>
      <div style="flex:1;min-width:0"><div class="nm">${esc(r.nome)}</div>
      <div class="mut small">${esc(r.cat)} → ${AREAS[r.area].ic} ${AREAS[r.area].nome} · ${r.dias.length === 7 ? 'todo dia' : r.dias.map(d => DOW[d]).join(' ')}${r.dup ? ' · <span style="color:var(--warn)">já existe aqui</span>' : ''}</div></div></div>`).join('')}
    <button class="btn full" style="margin-top:14px" ${n ? '' : 'disabled'} onclick="importarRI()">Importar ${n} ${n === 1 ? 'rotina' : 'rotinas'}</button>
    <button class="btn ghost full" style="margin-top:8px" onclick="closeModal()">Cancelar</button>`);
}
function importarRI() {
  const sel = RI.filter(r => r.on); if (!sel.length) return;
  act(null, () => sel.forEach(r => db.itens.push({ id: uid(), tipo: 'habito', nome: r.nome, area: r.area, dif: 1, dias: r.dias, criado: hoje(), nota: '' })));
  closeModal(); RI = null; jTab = 'habito'; ir('jornada');
  toast('📥', `<b>${sel.length}</b> ${sel.length === 1 ? 'rotina importada' : 'rotinas importadas'} como hábitos`);
}
/* Zera XP/nível/histórico e recomeça hoje; mantém perfil, itens ativos e recompensas */
function resetProgress() {
  const T = hoje();
  db.criado = T; db.log = {}; db.desafios = {}; db.diario = {}; db.compras = [];
  db.itens = db.itens.filter(i => !i.arq).map(i => { i.criado = T; if (i.feito) i.feito = null; (i.marcos || []).forEach(m => m.feito = null); return i; });
  db.ui = Object.assign(db.ui || {}, { lvl: 1, areaLv: {}, conq: {}, kills: 0 });
}
/* Rotinas trazidas do app Rotinas (cadastradas uma única vez) */
const TODO_DIA = [0, 1, 2, 3, 4, 5, 6], SEG_SEX = [1, 2, 3, 4, 5];
const SEEDS = [{ id: 'rotinas-2026-10-15', itens: [
  ...[1, 2, 3, 4].map(n => ({ nome: `Beber 700 ml de água (${n}/4)`, area: 'saude', dif: 1, dias: TODO_DIA })),
  { nome: 'Academia', area: 'saude', dif: 2, dias: SEG_SEX },
  { nome: 'Ler 10 páginas', area: 'mente', dif: 1, dias: TODO_DIA },
  ...['manhã', 'tarde', 'noite'].map(p => ({ nome: `Sem doces pela ${p}`, area: 'saude', dif: 1, dias: TODO_DIA })),
  ...['café da manhã', 'almoço', 'jantar'].map(p => ({ nome: `Comer corretamente no ${p}`, area: 'saude', dif: 1, dias: TODO_DIA })),
  ...['na Acta', 'no Stratum', 'no OS'].map(p => ({ nome: `Trabalhar ${p}`, area: 'carreira', dif: 2, dias: SEG_SEX })),
  { nome: 'Estudar', area: 'mente', dif: 2, dias: SEG_SEX },
  { nome: 'Sessão de TV à noite', area: 'proposito', dif: 1, dias: TODO_DIA },
  { nome: 'Tempo com a Nenê', area: 'relacoes', dif: 2, dias: TODO_DIA },
  { nome: 'Tempo com a Carol', area: 'relacoes', dif: 2, dias: TODO_DIA }
] }];
function aplicarSeeds() {
  if (!db.perfil) return false;
  db.seeds = db.seeds || [];
  let mudou = false;
  SEEDS.forEach(sd => {
    if (db.seeds.includes(sd.id)) return;
    const nomes = new Set(db.itens.filter(i => !i.arq).map(i => i.nome.toLowerCase()));
    sd.itens.forEach(x => { if (!nomes.has(x.nome.toLowerCase())) db.itens.push({ id: uid(), tipo: 'habito', nome: x.nome, area: x.area, dif: x.dif, dias: x.dias.slice(), criado: hoje(), nota: '' }); });
    db.seeds.push(sd.id); mudou = true;
  });
  if (mudou) save();
  return mudou;
}
function migrar() {
  if (db.migr === MIGR) return false;
  if (db.perfil) resetProgress();
  db.migr = MIGR; save(); return true;
}
function zerarProgresso() { ask('Zerar nível, XP, ouro, conquistas e histórico, e recomeçar hoje? <b>Seu herói, itens e recompensas ficam.</b>', () => { resetProgress(); save(); S = calc(); celebrate(S, true); diaSel = null; view = 'hoje'; render(); toast('⚔️', 'Nova jornada começa hoje.'); }, 'Zerar progresso', true); }
function zerar() { ask('Apagar <b>todo</b> o progresso, itens e conquistas? Isso não pode ser desfeito.', () => { db = DEF(); save(); S = null; render(); }, 'Apagar tudo', true); }

/* =================== ONBOARDING =================== */
let OB = null;
const STARTER = ['s3', 's1', 'm1', 'c1', 'c2', 'f1', 'r1', 'p1', 's2', 'p2', 'c5', 'f4'];
function renderOnboarding() {
  $('app').classList.add('hide'); $('ob').classList.remove('hide');
  if (!OB) { OB = { step: 0, sel: new Set(['s3', 'm1', 'c1', 'r1', 'p1']) }; P = { nome: '', pele: AV.SKINS[1], cabelo: 'social', corCabelo: AV.HAIRC[4], barba: 'nenhuma', oculos: false, classe: 'estrategista' }; }
  const prev = (tier, mood) => AV.render({ tier, skin: P.pele, hair: P.cabelo, hairColor: P.corCabelo, beard: P.barba, glasses: P.oculos, mood: mood || 'feliz', areas: {}, aura: '#7c5cff' });
  let h = '';
  if (OB.step === 0) {
    h = `<div class="hero-av">${prev(7)}</div>
      <h1 class="title" style="text-align:center;font-size:30px;margin:10px 0 6px">Sua vida é o jogo.</h1>
      <p class="mut" style="text-align:center;line-height:1.5">Cada hábito cumprido, missão entregue e meta conquistada evolui seu herói — de <b>Aprendiz</b> a <b>Lenda</b>.</p>
      <label>Como chamamos seu herói?</label><input id="obNome" value="${esc(P.nome)}" placeholder="Seu nome" oninput="P.nome=this.value">
      <button class="btn full" style="margin-top:18px" onclick="if(!P.nome.trim()){toast('✏️','Digite um nome.');return}OB.step=1;renderOnboarding()">Começar →</button>`;
  } else if (OB.step === 1) {
    h = `<div class="mut small" style="text-align:center">Passo 1 de 3</div><h1 class="title" style="text-align:center;font-size:24px;margin:6px 0">Crie seu avatar</h1>
      <div class="hero-av">${prev(0)}</div>${avPicker('renderOnboarding')}
      <div class="row" style="margin-top:18px"><button class="btn ghost" onclick="OB.step=0;renderOnboarding()">←</button><button class="btn" style="flex:1" onclick="OB.step=2;renderOnboarding()">Continuar →</button></div>`;
  } else if (OB.step === 2) {
    h = `<div class="mut small" style="text-align:center">Passo 2 de 3</div><h1 class="title" style="text-align:center;font-size:24px;margin:6px 0 14px">Escolha sua classe</h1>
      ${Object.entries(CLASSES).map(([k, c]) => `<div class="classcard ${P.classe === k ? 'on' : ''}" onclick="P.classe='${k}';renderOnboarding()"><div style="font-size:18px;font-weight:800">${c.ic} ${c.n}</div><div class="mut small">${c.d}</div></div>`).join('')}
      <div class="mut small" style="margin-top:6px">Dá para trocar depois.</div>
      <div class="row" style="margin-top:18px"><button class="btn ghost" onclick="OB.step=1;renderOnboarding()">←</button><button class="btn" style="flex:1" onclick="OB.step=3;renderOnboarding()">Continuar →</button></div>`;
  } else {
    h = `<div class="mut small" style="text-align:center">Passo 3 de 3</div><h1 class="title" style="text-align:center;font-size:24px;margin:6px 0">Primeiras missões</h1>
      <p class="mut small" style="text-align:center">Comece com 3 a 6. Menos é mais: constância vence ambição.</p>
      ${STARTER.map(id => { const s = SUG.find(x => x.id === id), A = AREAS[s.a], on = OB.sel.has(id); return `<div class="sug" style="cursor:pointer;${on ? 'border-color:var(--acc);background:rgba(124,92,255,.14)' : ''}" onclick="OB.sel.has('${id}')?OB.sel.delete('${id}'):OB.sel.add('${id}');renderOnboarding()"><div class="chk ${on ? 'on' : ''}" style="width:26px;height:26px;min-width:26px;font-size:14px">${on ? '✓' : ''}</div><div style="flex:1"><div class="nm">${esc(s.n)}</div><div class="mut small">${A.ic} ${A.nome} · ${{ h: 'Hábito', m: 'Missão', e: 'Épico' }[s.t]}</div></div></div>`; }).join('')}
      <div class="row" style="margin-top:18px"><button class="btn ghost" onclick="OB.step=2;renderOnboarding()">←</button><button class="btn gold" style="flex:1" onclick="finishOB()">⚔️ Iniciar jornada</button></div>`;
  }
  $('ob').innerHTML = `<div class="ob">${h}</div>`;
  scrollTo(0, 0);
}
function finishOB() {
  const T = hoje();
  db = DEF(); db.criado = T; db.perfil = Object.assign({}, P);
  OB.sel.forEach(id => {
    const s = SUG.find(x => x.id === id);
    const it = { id: uid(), tipo: { h: 'habito', m: 'missao', e: 'meta' }[s.t], nome: s.n, area: s.a, dif: s.d, criado: T, nota: s.why || '' };
    if (s.t === 'h') it.dias = s.dias.slice();
    if (s.t === 'e') it.marcos = s.marcos.map(n => ({ id: uid(), nome: n, feito: null }));
    db.itens.push(it);
  });
  db.recompensas = RECOMP_PADRAO.map(r => Object.assign({ id: uid() }, r));
  aplicarSeeds();
  save(); S = calc(); celebrate(S, true); OB = null; view = 'hoje';
  render();
  setTimeout(() => toast('⚔️', `Bem-vindo, <b>${esc(db.perfil.nome)}</b>. Sua jornada começa agora.`), 300);
}

/* =================== BOOT =================== */
load();
migrar();
aplicarSeeds();
if (db.perfil) { S = calc(); celebrate(S, true); }
render();
cloudInit();
$('imp').onchange = importar;
// virada do dia com o app aberto
let lastDay = hoje();
setInterval(() => { if (hoje() !== lastDay) { lastDay = hoje(); diaSel = null; S = calc(); render(); } }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && db.perfil) { S = calc(); celebrate(S, true); render(); } });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
