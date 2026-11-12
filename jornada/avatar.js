/* Avatar SVG procedural, estilo herói de jogo.
   RAÇA define corpo e rosto; CLASSE define a linha de evolução (8 formas por nível);
   ATRIBUTOS (áreas da vida) acrescentam itens próprios. */
const AV = (() => {
  let uid = 0;
  const SKINS = ['#f3d2bc', '#e5b896', '#cf9a72', '#a8724a', '#7a4c2e', '#4c2e1b'];
  const HAIRC = ['#17120f', '#3d2516', '#7a4a24', '#c99a52', '#9c9c9c', '#e4e2df', '#6e1a1a'];
  const HAIRS = [['curto', 'Curto'], ['social', 'Social'], ['cacheado', 'Cacheado'], ['longo', 'Longo'], ['calvo', 'Entradas'], ['raspado', 'Raspado']];
  const BEARDS = [['nenhuma', 'Sem barba'], ['barba', 'Barba'], ['cavanhaque', 'Cavanhaque'], ['bigode', 'Bigode']];
  const MIN = [1, 5, 10, 15, 20, 30, 40, 50];

  /* ---------- raças: proporção do corpo, cabeça, orelhas e paleta de pele ---------- */
  const RACES = {
    humano:  { n: 'Humano',  ic: '🧑', sx: .9,   sy: .9,    head: 1.12, ears: 'human',  skins: SKINS },
    elfo:    { n: 'Elfo',    ic: '🧝', sx: .85,  sy: .94, head: 1.08, ears: 'elf',    skins: ['#f8e6d8', '#f0d5c0', '#e2c2a6', '#c99c7a', '#a8785a', '#7b5a46'] },
    anao:    { n: 'Anão',    ic: '⛏️', sx: 1.02, sy: .74,  head: 1.24, ears: 'human',  skins: SKINS },
    orc:     { n: 'Orc',     ic: '👹', sx: 1,    sy: .93, head: 1.1,  ears: 'orc',    skins: ['#8fae62', '#76964d', '#5f7d3d', '#7d8a5a', '#8c9e6e', '#4f6a35'], tusks: true },
    goblin:  { n: 'Goblin',  ic: '👺', sx: .8,   sy: .7,   head: 1.36, ears: 'goblin', skins: ['#a9bb5e', '#93a84b', '#b9c26c', '#7f9a5a', '#c2b45a', '#6f8a46'], nose: true },
    gigante: { n: 'Gigante', ic: '🗿', sx: 1.24, sy: 1.06, head: .98, ears: 'human',  skins: ['#e2cdb8', '#c7b29c', '#a8927c', '#8a7866', '#9aa3b2', '#6f7887'] }
  };

  /* ---------- classes: nome e kit visual de cada uma das 8 formas ---------- */
  // tronco: linen | leather | ranger | plate | robe | coat | rogue | druid
  // pose: rest | shield | great | cast | dual     arma: ver weapon()
  const T0 = { torso: 'linen', weapon: 'wood' };
  const CLASSES = {
    guerreiro: { n: 'Guerreiro', ic: '⚔️', tiers: [
      ['Recruta', 'Roupas de treino e espada de madeira.', T0],
      ['Escudeiro', 'Gibão de couro e a primeira lâmina de aço.', { torso: 'leather', c: '#2f6b45', weapon: 'sword', paul: 'leather' }],
      ['Soldado', 'Couro reforçado, ombreira de aço e capa curta.', { torso: 'leather', c: '#7f1d1d', weapon: 'sword', paul: 'steel', cape: '#4a3020', capeShort: true }],
      ['Cavaleiro', 'Armadura de placas, escudo e espada longa.', { torso: 'plate', metal: 'steel', tab: '#1e40af', pose: 'shield', shield: '#1e40af', weapon: 'sword' }],
      ['Campeão', 'Aço negro, capa escarlate e montante.', { torso: 'plate', metal: 'dark', tab: '#7f1d1d', trim: true, pose: 'great', weapon: 'greatsword', cape: '#9f1239', head: 'band' }],
      ['Senhor da Guerra', 'Elmo de chifres, aço negro e ouro.', { torso: 'plate', metal: 'dark', tab: '#450a0a', trim: true, spikes: true, pose: 'great', weapon: 'greatsword', cape: '#7f1d1d', head: 'horns' }],
      ['Paladino', 'Placas de prata e ouro, olhos de luz.', { torso: 'plate', metal: 'steel', tab: '#f8fafc', trim: true, pose: 'shield', shield: '#f8fafc', weapon: 'sword', cape: '#1e3a8a', glow: '#93c5fd', beam: true }],
      ['Lenda', 'Armadura solar, coroa, asas e lâmina flamejante.', { torso: 'plate', metal: 'gold', tab: '#f8fafc', trim: true, spikes: true, pose: 'great', weapon: 'flamesword', cape: '#f8fafc', head: 'crown', wings: 'light', glow: '#fbbf24', rays: true }]
    ] },
    clerigo: { n: 'Clérigo', ic: '✝️', tiers: [
      ['Noviço', 'Túnica simples e bastão de treino.', T0],
      ['Acólito', 'Vestes claras e uma maça abençoada.', { torso: 'robe', c: '#e7e5e4', c2: '#a16207', weapon: 'mace' }],
      ['Peregrino', 'Capuz de viagem e símbolo sagrado.', { torso: 'robe', c: '#f5f5f4', c2: '#1d4ed8', weapon: 'mace', head: 'hood', hoodC: '#d6d3d1' }],
      ['Templário', 'Placas, tabardo branco, escudo e maça.', { torso: 'plate', metal: 'steel', tab: '#f8fafc', cross: true, pose: 'shield', shield: '#f8fafc', weapon: 'mace' }],
      ['Sacerdote', 'Mitra dourada e luz na palma da mão.', { torso: 'robe', c: '#f8fafc', c2: '#b7791f', pose: 'cast', orb: '#fde68a', weapon: 'staffGold', head: 'mitre' }],
      ['Sumo Sacerdote', 'Vestes sagradas e halo rúnico.', { torso: 'robe', c: '#f1f5f9', c2: '#0f766e', pose: 'cast', orb: '#5eead4', weapon: 'staffCrystal', halo: '#5eead4', glow: '#5eead4', runes: '#5eead4' }],
      ['Santo', 'Ouro e branco, asas de luz e coluna celeste.', { torso: 'robe', c: '#fffbeb', c2: '#b7791f', pose: 'cast', orb: '#fde68a', weapon: 'staffGold', halo: '#fde68a', wings: 'light', glow: '#fbbf24', beam: true }],
      ['Lenda', 'Armadura solar, coroa e martelo divino.', { torso: 'plate', metal: 'gold', tab: '#f8fafc', trim: true, cross: true, pose: 'great', weapon: 'hammer', cape: '#f8fafc', head: 'crown', halo: '#fde68a', wings: 'light', glow: '#fbbf24', rays: true }]
    ] },
    mago: { n: 'Mago', ic: '🔮', tiers: [
      ['Aprendiz', 'Roupas de estudo e espada de treino.', T0],
      ['Iniciado', 'Túnica azul e a primeira varinha.', { torso: 'robe', c: '#1e3a8a', c2: '#93c5fd', weapon: 'wand' }],
      ['Adepto', 'Chapéu pontudo e cajado de carvalho.', { torso: 'robe', c: '#1e40af', c2: '#fbbf24', weapon: 'staffWood', head: 'hat', hatC: '#1e3a8a' }],
      ['Feiticeiro', 'Sobretudo arcano e orbe na mão.', { torso: 'coat', c: '#1e3a8a', c2: '#fbbf24', pose: 'cast', orb: '#60a5fa', weapon: 'staffOrb', head: 'hat', hatC: '#172554' }],
      ['Mago de Batalha', 'Púrpura, gola alta e poder concentrado.', { torso: 'coat', c: '#4c1d95', c2: '#fbbf24', collar: true, pose: 'cast', orb: '#a78bfa', weapon: 'staffOrb', head: 'hat', hatC: '#3b0764' }],
      ['Arquimago', 'Selo arcano, coluna de luz e runas.', { torso: 'coat', c: '#2e1065', c2: '#fbbf24', collar: true, sigil: true, pose: 'cast', orb: '#c084fc', weapon: 'staffOrb', beam: true, runes: '#c084fc' }],
      ['Sábio Arcano', 'Vestes do vazio, cristal e olhos que brilham.', { torso: 'robe', c: '#0f172a', c2: '#a78bfa', pose: 'cast', orb: '#a78bfa', weapon: 'staffCrystal', glow: '#c4b5fd', runes: '#a78bfa', halo: '#a78bfa', beam: true }],
      ['Lenda', 'Manto solar, coroa, asas e orbe dourado.', { torso: 'coat', c: '#f8fafc', c2: '#b7791f', collar: true, sigil: true, pose: 'cast', orb: '#fbbf24', weapon: 'staffOrb', head: 'crown', wings: 'light', glow: '#fbbf24', rays: true }]
    ] },
    ladrao: { n: 'Ladrão', ic: '🗡️', tiers: [
      ['Batedor', 'Roupas comuns e uma lâmina de treino.', T0],
      ['Gatuno', 'Couro escuro, cintos e adaga.', { torso: 'rogue', c: '#3f3f46', weapon: 'dagger' }],
      ['Sombra', 'Capuz, capa curta e passos silenciosos.', { torso: 'rogue', c: '#27272a', weapon: 'dagger', head: 'hood', hoodC: '#3f3f46', cape: '#27272a', capeShort: true }],
      ['Ladino', 'Máscara, cachecol vermelho e adagas duplas.', { torso: 'rogue', c: '#18181b', scarf: '#b91c1c', pose: 'dual', weapon: 'dagger', head: 'hood', hoodC: '#27272a', mask: true }],
      ['Assassino', 'Capa carmesim e lâminas afiadas.', { torso: 'rogue', c: '#18181b', scarf: '#7f1d1d', pose: 'dual', weapon: 'dagger', head: 'hood', hoodC: '#18181b', mask: true, cape: '#7f1d1d' }],
      ['Mestre das Sombras', 'Couro púrpura e adagas encantadas.', { torso: 'rogue', c: '#1e1b4b', scarf: '#6d28d9', pose: 'dual', weapon: 'daggerGlow', head: 'hood', hoodC: '#1e1b4b', mask: true, cape: '#312e81', glow: '#c4b5fd' }],
      ['Fantasma', 'Negro e ouro, olhos vermelhos na escuridão.', { torso: 'rogue', c: '#09090b', scarf: '#b7791f', pose: 'dual', weapon: 'daggerGlow', head: 'hood', hoodC: '#09090b', mask: true, cape: '#09090b', glow: '#f87171', wings: 'dark' }],
      ['Lenda', 'Rei das sombras: coroa, asas negras e ouro.', { torso: 'rogue', c: '#09090b', scarf: '#f59e0b', gold: true, pose: 'dual', weapon: 'daggerGold', head: 'crown', mask: true, cape: '#1c1917', glow: '#fbbf24', wings: 'dark', rays: true }]
    ] },
    druida: { n: 'Druida', ic: '🌿', tiers: [
      ['Semente', 'Roupas simples e um galho firme.', T0],
      ['Broto', 'Túnica verde e cajado de madeira viva.', { torso: 'druid', c: '#3f6212', c2: '#a3e635', weapon: 'staffWood' }],
      ['Guardião da Mata', 'Manto de patrulheiro e arco longo.', { torso: 'ranger', weapon: 'bow' }],
      ['Druida', 'Coroa de folhas e magia da natureza.', { torso: 'druid', c: '#365314', c2: '#a3e635', pose: 'cast', orb: '#86efac', weapon: 'staffWood', head: 'leaves' }],
      ['Xamã', 'Galhadas, capa de musgo e cajado vivo.', { torso: 'druid', c: '#14532d', c2: '#bef264', pose: 'cast', orb: '#4ade80', weapon: 'staffWood', head: 'antlers', cape: '#3f6212' }],
      ['Arquidruida', 'Galhadas brilhantes e coluna verde.', { torso: 'druid', c: '#14532d', c2: '#facc15', pose: 'cast', orb: '#22c55e', weapon: 'staffWood', head: 'antlers', antlerGlow: true, cape: '#365314', beam: true, runes: '#86efac' }],
      ['Espírito da Floresta', 'Folhas no ar e olhos de esmeralda.', { torso: 'druid', c: '#052e16', c2: '#facc15', pose: 'cast', orb: '#4ade80', weapon: 'staffWood', head: 'antlers', antlerGlow: true, cape: '#14532d', glow: '#4ade80', leavesFx: true }],
      ['Lenda', 'Galhadas de ouro e asas de folhas.', { torso: 'druid', c: '#14532d', c2: '#fbbf24', pose: 'cast', orb: '#fde047', weapon: 'staffWood', head: 'antlersGold', antlerGlow: true, cape: '#3f6212', glow: '#fbbf24', wings: 'leaf', rays: true, leavesFx: true }]
    ] }
  };
  const TIERS = MIN.map((min, i) => ({ min, n: CLASSES.guerreiro.tiers[i][0], d: CLASSES.guerreiro.tiers[i][1] }));
  const tierOf = lvl => { let t = 0; MIN.forEach((m, i) => { if (lvl >= m) t = i; }); return t; };
  /* Ilustrações prontas (raça-classe → formas disponíveis, 1 a 8). Sem arte, usa o desenho vetorial. */
  const ART = { 'humano-guerreiro': [1, 2, 3, 4, 5, 6, 7, 8], 'humano-clerigo': [1, 2, 3, 4, 5, 6, 7, 8], 'humano-mago': [1, 2, 3, 4, 5, 6, 7, 8], 'humano-ladrao': [1, 2, 3, 4, 5, 6, 7, 8], 'humano-druida': [1, 2, 3, 4, 5, 6, 7, 8], 'gigante-guerreiro': [1, 2, 3, 4, 5, 6, 7, 8], 'gigante-clerigo': [1, 2, 3, 4, 5, 6, 7, 8], 'gigante-mago': [1, 2, 3, 4, 5, 6, 7, 8], 'gigante-ladrao': [1, 2, 3, 4, 5, 6, 7, 8], 'gigante-druida': [1, 2, 3, 4, 5, 6, 7, 8], 'goblin-guerreiro': [1, 2, 3, 4, 5, 6, 7, 8], 'goblin-clerigo': [1, 2, 3, 4, 5, 6, 7, 8], 'goblin-mago': [1, 2, 3, 4, 5, 6, 7, 8], 'goblin-ladrao': [1, 2, 3, 4, 5, 6, 7, 8], 'goblin-druida': [1, 2, 3, 4, 5, 6, 7, 8], 'elfo-guerreiro': [1, 2, 3, 4, 5, 6, 7, 8], 'elfo-clerigo': [1, 2, 3, 4, 5, 6, 7, 8], 'elfo-mago': [1, 2, 3, 4, 5, 6, 7, 8], 'elfo-ladrao': [1, 2, 3, 4, 5, 6, 7, 8], 'elfo-druida': [1, 2, 3, 4, 5, 6, 7, 8] };
  const artOf = (race, cls, t) => { const k = (race || 'humano') + '-' + (cls || 'guerreiro'); return (ART[k] || []).includes(t + 1) ? `art/${k}-${t + 1}.webp` : null; };
  const tierInfo = (cls, i) => { const c = CLASSES[cls] || CLASSES.guerreiro; return { n: c.tiers[i][0], d: c.tiers[i][1], min: MIN[i] }; };
  const OL = '#0a0d17';

  function shade(hex, p) {
    const n = parseInt(hex.slice(1), 16);
    const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.max(0, Math.min(255, Math.round(p < 0 ? v * (1 + p / 100) : v + (255 - v) * (p / 100))));
    return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const mirror = s => `<g transform="translate(240 0) scale(-1 1)">${s}</g>`;

  function render(o) {
    o = Object.assign({ tier: 0, race: 'humano', cls: 'guerreiro', skin: null, hair: 'curto', hairColor: HAIRC[1], beard: 'nenhuma', glasses: false, mood: 'feliz', areas: {}, aura: '#7c5cff', anim: true }, o);
    if (o.art !== false) { const src = artOf(o.race, o.cls, Math.max(0, Math.min(7, o.tier || 0))); if (src) return `<img class="av-art" src="${src}" alt="" decoding="async">`; }
    const R = RACES[o.race] || RACES.humano, C = CLASSES[o.cls] || CLASSES.guerreiro;
    const t = Math.max(0, Math.min(7, o.tier)), K = C.tiers[t][2];
    const id = 'av' + (++uid), A = o.areas, lv = k => A[k] || 1;
    const s = Math.min(8, Math.floor((lv('saude') - 1) * 0.8));
    const an = c => o.anim ? ` class="${c}"` : '';
    const defs = [], gcache = {};
    const glint = (x, y, d = 0) => o.anim ? `<path class="av-glint" style="animation-delay:${d}s" d="M${x} ${y - 7} L${x + 1.6} ${y - 1.6} L${x + 7} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 7} L${x - 1.6} ${y + 1.6} L${x - 7} ${y} L${x - 1.6} ${y - 1.6} Z" fill="#fff"/>` : '';
    // gradiente de material: luz de cima/esquerda
    const M = (c, k = 'v') => {
      const key = c + k; if (gcache[key]) return gcache[key];
      const gid = id + 'm' + Object.keys(gcache).length;
      const xy = k === 'v' ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" y1="0" x2="1" y2="1"';
      defs.push(`<linearGradient id="${gid}" ${xy}><stop offset="0" stop-color="${shade(c, 30)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -45)}"/></linearGradient>`);
      return (gcache[key] = `url(#${gid})`);
    };
    const STEEL = `url(#${id}st)`, GOLD = `url(#${id}gd)`, DARK = `url(#${id}dk)`;
    const METAL = { steel: STEEL, dark: DARK, gold: GOLD };
    const SK = o.skin && R.skins.includes(o.skin) ? o.skin : (o.skin && R === RACES.humano ? o.skin : R.skins[1]);
    const SKd = shade(SK, -22), HC = o.hairColor, HCd = shade(HC, -30), HCl = shade(HC, 25);
    const p = [];
    const pose = K.pose || 'rest';
    const auraC = o.aura;

    defs.push(`
      <radialGradient id="${id}au" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="${auraC}" stop-opacity="${(0.3 + t * .07).toFixed(2)}"/><stop offset=".6" stop-color="${auraC}" stop-opacity="${(0.06 + t * .03).toFixed(2)}"/><stop offset="1" stop-color="${auraC}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}st" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="#cfd8e6"/><stop offset=".55" stop-color="#7d8ba3"/><stop offset=".8" stop-color="#dfe6f0"/><stop offset="1" stop-color="#5b677d"/></linearGradient>
      <linearGradient id="${id}gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset=".3" stop-color="#f7c948"/><stop offset=".6" stop-color="#b7791f"/><stop offset=".85" stop-color="#fde68a"/><stop offset="1" stop-color="#8a5a12"/></linearGradient>
      <linearGradient id="${id}dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b6478"/><stop offset=".35" stop-color="#262c3a"/><stop offset=".7" stop-color="#11141d"/><stop offset="1" stop-color="#3a4152"/></linearGradient>
      <linearGradient id="${id}bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${auraC}" stop-opacity="0"/><stop offset=".5" stop-color="${auraC}" stop-opacity=".28"/><stop offset="1" stop-color="${auraC}" stop-opacity=".05"/></linearGradient>
      <linearGradient id="${id}wl" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fffbe6" stop-opacity=".95"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id}wd" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#3f3f46" stop-opacity=".98"/><stop offset="1" stop-color="#09090b" stop-opacity=".1"/></linearGradient>
      <linearGradient id="${id}wf" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#bef264" stop-opacity=".95"/><stop offset="1" stop-color="#15803d" stop-opacity=".05"/></linearGradient>
      <linearGradient id="${id}fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff7d6"/><stop offset=".5" stop-color="#fbbf24"/><stop offset="1" stop-color="#f97316"/></linearGradient>
      <radialGradient id="${id}fc" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${shade(SK, 10)}"/><stop offset=".7" stop-color="${SK}"/><stop offset="1" stop-color="${SKd}"/></radialGradient>
      <filter id="${id}gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="${id}sh"><feComponentTransfer><feFuncR type="linear" slope=".74"/><feFuncG type="linear" slope=".74"/><feFuncB type="linear" slope=".8"/></feComponentTransfer></filter>
      <filter id="${id}g2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>`);

    /* ================= FUNDO / FX (fora da escala do corpo) ================= */
    if (K.beam) p.push(`<rect x="80" y="0" width="80" height="290" fill="url(#${id}bm)"/>`);
    if (K.rays) {
      let r = '';
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, x1 = 120 + Math.cos(a - .06) * 160, y1 = 70 + Math.sin(a - .06) * 160, x2 = 120 + Math.cos(a + .06) * 160, y2 = 70 + Math.sin(a + .06) * 160; r += `<path d="M120 70 L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} Z"/>`; }
      p.push(`<g${an('av-rays')} fill="${o.cls === 'ladrao' ? '#fbbf24' : o.cls === 'druida' ? '#d9f99d' : '#fde68a'}" opacity=".16">${r}</g>`);
    }
    p.push(`<g${an('av-aura')}><circle cx="120" cy="160" r="${108 + t * 3}" fill="url(#${id}au)"/></g>`);
    if (t >= 3) {
      const top = K.metal === 'gold' || t === 7 ? '#7a5e1c' : o.cls === 'druida' ? '#3f4f2a' : o.cls === 'ladrao' ? '#2a2630' : '#2c3448';
      p.push(`<path d="M44 281 L45 291 Q120 305 195 291 L196 281 Z" fill="${M(shade(top, -35))}" stroke="${OL}" stroke-width="1.2"/><ellipse cx="120" cy="281" rx="76" ry="13" fill="${M(top)}" stroke="${OL}" stroke-width="1.2"/><path d="M60 287 l6 5 M96 293 l3 4 M150 293 l-2 4 M182 287 l-5 5" stroke="${OL}" stroke-width="1" opacity=".6"/><ellipse cx="120" cy="279" rx="68" ry="9" fill="none" stroke="#fff" stroke-opacity=".1"/>`);
      if (o.cls === 'druida') p.push(`<path d="M52 282 q6 -8 10 0 M176 284 q5 -9 10 -1 M88 290 q4 -6 8 0" stroke="#65a30d" stroke-width="2" fill="none"/>`);
    }
    if (t >= 2) {
      const op = (0.25 + t * .09).toFixed(2), c = t === 7 ? '#fbbf24' : auraC;
      p.push(`<g opacity="${op}" fill="none" stroke="${c}"><ellipse cx="120" cy="281" rx="${62 + t * 2}" ry="12" stroke-width="2"/><ellipse${an('av-dash')} cx="120" cy="281" rx="${50 + t * 2}" ry="9" stroke-width="1.2" stroke-dasharray="3 5"/>${t >= 4 ? `<ellipse cx="120" cy="281" rx="${74 + t * 2}" ry="15" stroke-width="1" stroke-dasharray="10 4 2 4"/>` : ''}</g>`);
    }
    p.push(`<ellipse cx="120" cy="281" rx="${(48 + s) * R.sx}" ry="7" fill="#000" opacity=".55"/>`);
    if (t >= 3) for (let i = 0; i < t * 2 + 2; i++) {
      const x = 48 + ((i * 47) % 145), d = (i * .53) % 4;
      const pc = K.glow && t >= 6 ? K.glow : K.metal === 'dark' ? '#fb923c' : auraC;
      p.push(`<circle cx="${x}" cy="${266 - (i % 4) * 14}" r="${1.2 + (i % 3) * .6}" fill="${pc}" ${o.anim ? `class="av-p" style="animation-delay:${d.toFixed(2)}s"` : 'opacity=".7"'}/>`);
    }

    /* ================= CORPO (escala da raça a partir dos pés) ================= */
    const b0 = p.length;

    /* asas */
    const wingType = K.wings || (lv('proposito') >= 10 ? 'light' : null);
    if (wingType) {
      const fill = wingType === 'dark' ? `url(#${id}wd)` : wingType === 'leaf' ? `url(#${id}wf)` : `url(#${id}wl)`;
      let w = '';
      for (let i = 0; i < 7; i++) {
        const ex = 8 + i * 9, ey = 40 + i * 24, op = (1 - i * .1).toFixed(2);
        w += wingType === 'leaf'
          ? `<path d="M112 ${104 + i * 4} Q${70 - i * 6} ${58 + i * 12} ${ex} ${ey} Q${60 - i * 3} ${96 + i * 16} 114 ${124 + i * 6} Z" fill="${fill}" opacity="${op}"/><path d="M112 ${106 + i * 4} Q${78 - i * 6} ${74 + i * 13} ${ex + 6} ${ey + 4}" stroke="#14532d" stroke-width=".8" fill="none" opacity=".6"/>`
          : `<path d="M112 104 Q${70 - i * 6} ${60 + i * 10} ${ex} ${ey} Q${54 - i * 2} ${92 + i * 18} 114 ${124 + i * 6} Z" fill="${fill}" opacity="${op}"/>`;
      }
      p.push(`<g${an('av-wing')} opacity="${K.wings ? 1 : .5}"${wingType === 'light' ? ` filter="url(#${id}gl)"` : ''}>${w}${mirror(w)}</g>`);
    }
    /* halo rúnico */
    if (K.halo) {
      let ticks = '';
      for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; ticks += `<line x1="${(120 + Math.cos(a) * 30).toFixed(1)}" y1="${(54 + Math.sin(a) * 30).toFixed(1)}" x2="${(120 + Math.cos(a) * (i % 2 ? 34 : 37)).toFixed(1)}" y2="${(54 + Math.sin(a) * (i % 2 ? 34 : 37)).toFixed(1)}"/>`; }
      p.push(`<g${an('av-spin')} stroke="${K.halo}" fill="none" filter="url(#${id}gl)"><circle cx="120" cy="54" r="38" stroke-width="2.5"/><circle cx="120" cy="54" r="29" stroke-width="1.2" stroke-dasharray="4 3"/><g stroke-width="1.5">${ticks}</g></g>`);
    }

    /* capas e casacos (atrás) */
    if (K.cape) {
      const cc = M(K.cape), edge = K.cape === '#f8fafc' ? '#d6a63a' : shade(K.cape, -45);
      if (K.capeShort) p.push(`<g${an('av-cape')}><path d="M${86 - s} 100 L${154 + s} 100 L164 236 L148 230 L136 240 L120 232 L104 240 L92 230 L76 236 Z" fill="${cc}" stroke="${OL}" stroke-width="1.5"/></g>`);
      else p.push(`<g${an('av-cape')}><path d="M${86 - s} 98 L${154 + s} 98 L${194 + s} 284 L176 277 L164 288 L146 279 L128 290 L112 280 L94 290 L78 278 L64 286 L${46 - s} 284 Z" fill="${cc}" stroke="${edge}" stroke-width="2"/><path d="M${154 + s} 98 L${194 + s} 284 L176 277 L164 288 L146 279 L140 110 Z" fill="#000" opacity=".18"/><path d="M104 110 L92 270 M136 110 L150 272 M120 112 L120 280" stroke="${edge}" stroke-width="1.5" opacity=".5"/></g>`);
    }
    if (K.torso === 'ranger') p.push(`<g${an('av-cape')}><path d="M${86 - s} 100 L${154 + s} 100 L164 252 L148 246 L136 256 L120 248 L104 256 L92 246 L76 252 Z" fill="${M('#4a3020')}" stroke="${OL}" stroke-width="1.5"/></g>`);
    if (K.torso === 'coat') p.push(`<g${an('av-cape')}><path d="M${86 - s} 100 L${154 + s} 100 L168 262 L144 256 L120 266 L96 256 L72 262 Z" fill="${M(shade(K.c, -20))}" stroke="${OL}" stroke-width="1.5"/></g>`);
    if (K.weapon === 'bow' || K.torso === 'ranger') p.push(`<path d="M152 40 Q206 150 150 262" stroke="${M('#6b4423')}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M152 40 L150 262" stroke="#e7e5e4" stroke-width="1" opacity=".7"/><rect x="92" y="54" width="12" height="62" rx="3" transform="rotate(-28 98 85)" fill="${M('#5b3415')}" stroke="${OL}"/><g transform="rotate(-28 98 85)" stroke="${OL}" stroke-width=".8"><path d="M95 56 L95 40" stroke="#d6c7a8" stroke-width="1.6"/><path d="M101 56 L101 37" stroke="#d6c7a8" stroke-width="1.6"/><path d="M95 40 l-3 -6 l3 2 l3 -2 Z M101 37 l-3 -6 l3 2 l3 -2 Z" fill="#b91c1c"/></g>`);
    if (K.collar) p.push(`<path d="M100 96 L86 52 Q98 62 106 84 Z" fill="${M(K.c)}" stroke="${OL}" stroke-width="1.5"/><path d="M140 96 L154 52 Q142 62 134 84 Z" fill="${M(K.c)}" stroke="${OL}" stroke-width="1.5"/><path d="M88 56 L104 90 M152 56 L136 90" stroke="${K.c2 || '#fbbf24'}" stroke-width="1.5"/>`);

    /* cabeça escalada (traz para trás o cabelo longo e o fundo do capuz) */
    const HEAD = x => `<g transform="translate(120 84) scale(${R.head}) translate(-120 -84)">${x}</g>`;
    const hooded = K.head === 'hood';
    if (hooded) p.push(HEAD(`<path d="M92 92 Q86 18 120 15 Q154 18 148 92 Z" fill="${M(shade(K.hoodC, -25))}" stroke="${OL}" stroke-width="1.5"/>`));
    if (o.hair === 'longo' && !hooded) p.push(HEAD(`<path d="M99 52 Q96 28 120 28 Q144 28 141 52 L144 98 Q134 104 128 96 L128 70 L112 70 L112 96 Q106 104 96 98 Z" fill="${HCd}" stroke="${OL}" stroke-width="1.4"/>`));

    /* pernas e botas */
    const longRobe = K.torso === 'robe' || K.torso === 'druid';
    const plate = K.torso === 'plate', MT = METAL[K.metal] || STEEL;
    const pantsC = K.torso === 'linen' ? '#5b4a37' : K.torso === 'rogue' ? '#18181b' : K.torso === 'coat' ? shade(K.c, -40) : K.torso === 'ranger' ? '#3a3626' : plate ? '#1e2633' : '#2f3640';
    const legs = `M94 170 L146 170 L144 226 L141 266 L124 266 L120 204 L116 266 L99 266 L96 226 Z`;
    if (!longRobe) p.push(`<path d="${legs}" fill="${M(pantsC)}" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/><path d="M131 171 L145 171 L143 226 L140.5 265 L133 265 L129 212 Z" fill="#000" opacity=".22"/><path d="M99 178 L100 258" stroke="#fff" stroke-opacity=".13" stroke-width="2.2" stroke-linecap="round"/>`);
    if (plate) {
      p.push(`<g stroke="${OL}" stroke-width="1.3"><path d="M97 214 L117 214 L115 264 L100 264 Z" fill="${MT}"/><path d="M123 214 L143 214 L141 264 L126 264 Z" fill="${MT}"/><circle cx="107" cy="220" r="7" fill="${MT}"/><circle cx="133" cy="220" r="7" fill="${MT}"/></g>`);
      if (K.trim) p.push(`<path d="M100 236 L115 236 M126 236 L141 236" stroke="#f7c948" stroke-width="1.6"/>`);
    }
    const tallBoot = K.torso === 'leather' || K.torso === 'ranger' || K.torso === 'rogue';
    const bootM = plate ? MT : M(K.torso === 'linen' ? '#3b2a1c' : K.torso === 'rogue' ? '#0c0a09' : longRobe ? shade(K.c, -45) : K.torso === 'coat' ? '#120a22' : '#4a2c16');
    const by = tallBoot ? 238 : 254;
    p.push(`<g stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"><path d="M98 ${by} L117 ${by} L118 278 L88 279 Q87 268 98 262 Z" fill="${bootM}"/><path d="M123 ${by} L142 ${by} L142 262 Q153 268 152 279 L122 278 Z" fill="${bootM}"/></g>`);
    if (K.torso === 'linen') p.push(`<path d="M99 246 L116 250 M99 254 L116 258 M124 250 L141 246 M124 258 L141 254" stroke="#d6c7a8" stroke-width="2"/>`);
    if (K.torso === 'rogue') p.push(`<path d="M99 246 h18 M123 246 h18" stroke="#52525b" stroke-width="2"/>`);

    /* vestes longas (robe / druida) */
    if (longRobe) {
      p.push(`<path d="M${88 - s} 100 Q120 92 ${152 + s} 100 L166 274 Q120 284 74 274 Z" fill="${M(K.c)}" stroke="${OL}" stroke-width="1.6"/><path d="M108 168 L132 168 L136 278 L120 284 L104 278 Z" fill="${M(K.torso === 'druid' ? shade(K.c, -30) : K.c2)}" stroke="${OL}" stroke-width="1.2"/>`);
      if (K.torso === 'robe') p.push(`<path d="M110 176 h20 M111 240 h18" stroke="${K.c2 === '#b7791f' ? '#fde68a' : '#f7c948'}" stroke-width="2"/><path d="M120 190 l6 10 l-6 10 l-6 -10 Z" fill="#f7c948"/><path d="M76 268 Q120 278 164 268" stroke="${K.c2}" stroke-width="3" fill="none"/>`);
      else {
        // barra de folhas e cinto de corda
        let lf = '';
        for (let i = 0; i < 9; i++) { const x = 80 + i * 10; lf += `<path d="M${x} ${271 + (i % 2) * 2} q5 -10 10 0 q-5 6 -10 0 Z" fill="${K.c2}" opacity=".85"/>`; }
        p.push(lf + `<path d="M92 170 Q120 178 148 170" stroke="#a16207" stroke-width="3" fill="none"/><path d="M140 172 q2 12 -2 22 M144 172 q4 10 2 20" stroke="#a16207" stroke-width="2" fill="none"/><path d="M112 200 q8 -8 16 0 q-8 6 -16 0 Z M110 230 q10 -8 20 0 q-10 6 -20 0 Z" fill="${K.c2}" opacity=".7"/>`);
      }
    }

    /* armas atrás da mão direita */
    const hx = 161 + s * .3;
    const weaponBack = w => {
      if (w === 'wood') return `<g stroke="${OL}" stroke-width="1.2"><path d="M${hx - 4.5} 194 L${hx + 4.5} 194 L${hx + 4.5} 258 L${hx} 268 L${hx - 4.5} 258 Z" fill="${M('#c99060')}"/><path d="M${hx - 1} 198 L${hx - 1} 258" stroke="#f3d3a8" stroke-width="1.2"/><rect x="${hx - 11}" y="189" width="22" height="6" rx="2.5" fill="${M('#6b4423')}"/></g>`;
      if (w === 'sword') return `<g stroke="${OL}" stroke-width="1.2"><path d="M${hx - 4} 196 L${hx + 4} 196 L${hx + 20} 276 L${hx + 13} 282 Z" fill="${STEEL}"/><path d="M${hx} 198 L${hx + 15} 276" stroke="#fff" stroke-width="1" opacity=".7"/>${glint(hx + 9, 238, 1.2)}<rect x="${hx - 12}" y="190" width="24" height="6" rx="2" fill="${M(K.trim ? '#b7791f' : '#475569')}"/></g>`;
      if (w === 'mace') return `<g stroke="${OL}" stroke-width="1.2"><rect x="${hx - 2.5}" y="190" width="5" height="50" rx="2" fill="${M('#5b3a1f')}"/><path d="M${hx - 10} 240 L${hx + 10} 240 L${hx + 7} 258 L${hx - 7} 258 Z" fill="${t >= 3 ? GOLD : STEEL}"/><path d="M${hx - 13} 246 l3 -4 l0 8 Z M${hx + 13} 246 l-3 -4 l0 8 Z M${hx} 262 l-4 -4 h8 Z" fill="${STEEL}"/></g>`;
      if (w === 'wand') return `<g><path d="M${hx} 188 L${hx + 18} 214" stroke="${M('#7c2d12')}" stroke-width="4" stroke-linecap="round"/><g${an('av-float')}><circle cx="${hx + 20}" cy="217" r="6" fill="${K.c2 || '#93c5fd'}" filter="url(#${id}gl)"/></g></g>`;
      if (w === 'dagger' || w === 'daggerGlow' || w === 'daggerGold') {
        const bl = w === 'daggerGold' ? GOLD : STEEL;
        return `<g stroke="${OL}" stroke-width="1.1"${w !== 'dagger' ? ` filter="url(#${id}gl)"` : ''}><path d="M${hx - 3.5} 196 L${hx + 3.5} 196 L${hx + 1} 228 L${hx} 233 L${hx - 1} 228 Z" fill="${bl}"/><rect x="${hx - 8}" y="191" width="16" height="5" rx="2" fill="${M(w === 'daggerGold' ? '#b7791f' : '#27272a')}"/></g>${w === 'daggerGlow' ? `<path d="M${hx} 198 L${hx} 228" stroke="${K.glow}" stroke-width="2" opacity=".8"/>` : ''}${glint(hx, 214, 2)}`;
      }
      return '';
    };
    const staff = () => {
      const sx = 164 + s * .3, w = K.weapon, top = pose === 'cast' ? 46 : 60;
      if (w === 'staffWood') {
        const leaf = K.torso === 'druid' || o.cls === 'druida';
        return `<path d="M${sx} ${top} Q${sx - 4} 160 ${sx} 284" stroke="${M('#5b3a1f')}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${sx} ${top + 4} q-12 -10 -6 -24 M${sx} ${top + 4} q12 -8 8 -22" stroke="#5b3a1f" stroke-width="4" fill="none" stroke-linecap="round"/>${leaf ? `<path d="M${sx - 10} ${top - 12} q-8 -6 -2 -12 q6 4 2 12 Z M${sx + 12} ${top - 10} q8 -6 2 -12 q-6 4 -2 12 Z M${sx + 4} ${top + 20} q10 -2 10 -10 q-10 0 -10 10 Z" fill="${K.c2 || '#84cc16'}" stroke="${OL}" stroke-width=".8"/>` : ''}${pose === 'cast' ? `<g${an('av-float')}><circle cx="${sx}" cy="${top - 10}" r="9" fill="${K.orb}" filter="url(#${id}g2)" opacity=".9"/><circle cx="${sx}" cy="${top - 10}" r="4" fill="#fff" opacity=".9"/></g>` : `<circle cx="${sx}" cy="${top - 6}" r="4" fill="${K.c2 || '#93c5fd'}" filter="url(#${id}gl)"/>`}`;
      }
      if (w === 'staffOrb') return `<rect x="${sx - 3.5}" y="46" width="7" height="238" rx="3.5" fill="${M('#3a2010', 'd')}" stroke="${OL}" stroke-width="1.2"/><path d="M${sx} 60 Q${sx - 14} 46 ${sx - 8} 28 M${sx} 60 Q${sx + 14} 46 ${sx + 8} 28" stroke="#b7791f" stroke-width="3" fill="none"/><g${an('av-float')}><circle cx="${sx}" cy="38" r="14" fill="${K.orb}" filter="url(#${id}g2)" opacity=".9"/><circle cx="${sx}" cy="38" r="9" fill="${shade(K.orb, 40)}"/><circle cx="${sx - 3}" cy="35" r="3" fill="#fff"/></g><g${an('av-spin')} fill="none" stroke="${shade(K.orb, 30)}" stroke-width="1.3" opacity=".9"><ellipse cx="${sx}" cy="38" rx="20" ry="6"/><ellipse cx="${sx}" cy="38" rx="6" ry="20"/></g>`;
      if (w === 'staffCrystal' || w === 'staffGold') return `<rect x="${sx - 3.5}" y="60" width="7" height="224" rx="3.5" fill="${GOLD}" stroke="${OL}" stroke-width="1.2"/><path d="M${sx - 12} 64 Q${sx} 54 ${sx + 12} 64 L${sx + 8} 70 L${sx - 8} 70 Z" fill="${GOLD}" stroke="${OL}"/><g${an('av-float')}><path d="M${sx} 14 L${sx + 9} 40 L${sx} 60 L${sx - 9} 40 Z" fill="${w === 'staffGold' ? '#fef3c7' : shade(K.orb, 50)}" stroke="#fff" stroke-width="1.5" filter="url(#${id}gl)"/></g>`;
      return '';
    };
    if (pose !== 'great') p.push(weaponBack(K.weapon));

    /* tronco */
    const torsoD = `M${80 - s} 100 Q120 90 ${160 + s} 100 L${154 + s * .5} 140 L146 174 L94 174 L${86 - s * .5} 140 Z`;
    if (!longRobe) {
      const tc = { linen: '#cdbb98', leather: K.c || '#2f6b45', ranger: '#2f4a24', plate: '#3d4656', coat: shade(K.c || '#2e1065', -30), rogue: K.c || '#27272a' }[K.torso];
      p.push(`<path d="${torsoD}" fill="${M(tc)}" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/>`);
    }
    if (K.torso === 'linen') p.push(`<path d="M110 94 L120 116 L130 94" fill="none" stroke="#8f7c5c" stroke-width="2"/><path d="M98 120 Q104 132 100 150 M142 120 Q136 132 140 150" stroke="#a8946f" stroke-width="1.5" fill="none" opacity=".7"/><path d="M92 166 Q120 172 148 166 L148 176 Q120 182 92 176 Z" fill="${M('#6b4a2a')}" stroke="${OL}"/>`);
    if (K.torso === 'leather') p.push(`<path d="M${90 - s * .5} 104 Q120 98 ${150 + s * .5} 104 L146 168 L94 168 Z" fill="${M('#7a4a24')}" stroke="${OL}" stroke-width="1.4"/><path d="M120 102 L120 168" stroke="#3b2414" stroke-width="1.5"/><path d="M106 112 h28 M106 124 h28 M106 136 h28 M106 148 h28" stroke="#3b2414" stroke-width="1" opacity=".55"/><path d="M${84 - s} 104 L150 172" stroke="${M('#3b2414')}" stroke-width="7"/><path d="M92 164 L148 164 L148 176 L92 176 Z" fill="${M('#3b2414')}" stroke="${OL}"/><rect x="113" y="163" width="14" height="14" rx="2" fill="none" stroke="#f7c948" stroke-width="2.5"/><path d="M104 88 Q120 100 136 88 L138 98 Q120 108 102 98 Z" fill="${M(K.c === '#7f1d1d' ? '#a8a29e' : '#b91c1c')}" stroke="${OL}"/>`);
    if (K.torso === 'ranger') p.push(`<path d="M${82 - s} 100 L104 100 L110 176 L${86 - s * .5} 176 Z" fill="${M('#5a3a24')}" stroke="${OL}" stroke-width="1.4"/><path d="M${158 + s} 100 L136 100 L130 176 L${154 + s * .5} 176 Z" fill="${M('#5a3a24')}" stroke="${OL}" stroke-width="1.4"/><path d="M${82 - s} 98 Q120 84 ${158 + s} 98 Q150 112 136 108 Q120 104 104 108 Q90 112 ${82 - s} 98 Z" fill="${M('#a8a29e')}" stroke="${OL}" stroke-width="1.4"/><path d="M90 102 q4 4 0 8 M100 104 q4 4 0 8 M140 104 q4 4 0 8 M150 102 q4 4 0 8" stroke="#78716c" stroke-width="1.2" fill="none"/><path d="M104 108 L146 160 M136 108 L94 160" stroke="${M('#2a1a10')}" stroke-width="5"/><circle cx="120" cy="134" r="5" fill="#b7791f" stroke="${OL}"/><path d="M94 166 L146 166 L146 176 L94 176 Z" fill="${M('#2a1a10')}" stroke="${OL}"/>`);
    if (K.torso === 'rogue') {
      const gold = K.gold;
      p.push(`<path d="M${88 - s * .5} 104 L114 104 L118 170 L92 170 Z" fill="${M(shade(K.c, 18))}" stroke="${OL}" stroke-width="1.2"/><path d="M${84 - s} 104 L148 168 M${156 + s} 104 L94 168" stroke="${M(gold ? '#78350f' : '#3f2a14')}" stroke-width="5"/><circle cx="120" cy="136" r="4.5" fill="${gold ? '#fbbf24' : '#a1a1aa'}" stroke="${OL}"/><path d="M92 164 L148 164 L148 176 L92 176 Z" fill="${M('#1c1917')}" stroke="${OL}"/><rect x="98" y="166" width="10" height="12" rx="2" fill="${M('#3f2a14')}" stroke="${OL}"/><rect x="132" y="166" width="10" height="12" rx="2" fill="${M('#3f2a14')}" stroke="${OL}"/><rect x="114" y="164" width="12" height="12" rx="2" fill="none" stroke="${gold ? '#fbbf24' : '#71717a'}" stroke-width="2.2"/>`);
      if (K.scarf) p.push(`<path d="M102 90 Q120 104 138 90 L140 102 Q120 114 100 102 Z" fill="${M(K.scarf)}" stroke="${OL}" stroke-width="1.2"/><path d="M106 102 L100 130 L108 128 L112 106 Z" fill="${M(K.scarf)}" stroke="${OL}" stroke-width="1"/>`);
    }
    if (plate) {
      const tr = K.metal === 'steel' && !K.trim ? '#94a3b8' : '#f7c948';
      p.push(`<path d="M106 168 L134 168 L136 246 L120 254 L104 246 Z" fill="${M(K.tab)}" stroke="${OL}" stroke-width="1.4"/>`);
      if (K.cross) p.push(`<path d="M120 182 V232 M108 196 H132" stroke="${K.metal === 'gold' ? '#b7791f' : '#b91c1c'}" stroke-width="5"/>`);
      else if (K.tab === '#1e40af') p.push(`<path d="M120 190 l8 8 l-8 18 l-8 -18 Z" fill="#e2e8f0" opacity=".9"/>`);
      else p.push(`<path d="M120 186 l6 10 l-6 18 l-6 -18 Z" fill="#f7c948"/>`);
      p.push(`<g stroke="${OL}" stroke-width="1.4" stroke-linejoin="round">
        <path d="M${86 - s * .5} 102 Q120 94 ${154 + s * .5} 102 L150 146 Q120 160 90 146 Z" fill="${MT}"/>
        <path d="M92 148 Q120 160 148 148 L147 158 Q120 170 93 158 Z" fill="${MT}"/>
        <path d="M93 160 Q120 172 147 160 L146 172 Q120 182 94 172 Z" fill="${MT}"/>
        <path d="M104 90 Q120 100 136 90 L138 102 Q120 110 102 102 Z" fill="${MT}"/></g>
        <path d="M120 100 L120 156" stroke="${K.metal === 'steel' && !K.trim ? '#fff' : tr}" stroke-width="1.4" opacity=".8"/>
        <path d="M96 122 Q108 132 120 124 Q132 132 144 122" stroke="${OL}" stroke-width="1.3" fill="none" opacity=".6"/>
        <path d="M94 108 Q104 102 112 108" stroke="#fff" stroke-width="2" fill="none" opacity=".55"/>`);
      if (K.trim) p.push(`<path d="M${88 - s * .5} 104 Q120 96 ${152 + s * .5} 104" stroke="${tr}" stroke-width="2.2" fill="none"/><path d="M100 132 q8 -6 14 0 q6 -6 14 0 q-14 10 -28 0 Z" fill="${tr}" opacity=".9"/>`);
      if (K.metal === 'gold') p.push(`<circle cx="120" cy="120" r="7" fill="#fff7d6" filter="url(#${id}gl)"/><circle cx="120" cy="120" r="4.5" fill="#f97316"/>`);
    }
    if (K.torso === 'coat') {
      p.push(`<path d="M${84 - s} 100 L106 100 L112 176 L${88 - s * .5} 176 Z" fill="${M(K.c)}" stroke="${OL}" stroke-width="1.4"/><path d="M${156 + s} 100 L134 100 L128 176 L${152 + s * .5} 176 Z" fill="${M(K.c)}" stroke="${OL}" stroke-width="1.4"/><path d="M106 102 L112 176 M134 102 L128 176" stroke="${K.c2}" stroke-width="2"/><path d="M94 164 L146 164 L146 176 L94 176 Z" fill="${M(K.c2 === '#fbbf24' ? '#b7791f' : K.c2)}" stroke="${OL}"/>`);
      if (K.sigil) p.push(`<g fill="none" stroke="${shade(K.orb, 35)}" stroke-width="1.4" filter="url(#${id}gl)"><circle cx="120" cy="128" r="12"/><path d="M120 117.5 L129 133 L111 133 Z M120 138.5 L111 123 L129 123 Z"/></g>`);
    }
    if (pose === 'cast' || K.weapon === 'staffWood') p.push(staff());

    /* volume: lado direito na sombra, borda esquerda com luz */
    if (!longRobe) p.push(`<path d="M127 95 Q${148 + s} 95 ${160 + s} 100 L${154 + s * .5} 140 L146 174 L129 174 Q134 136 127 95 Z" fill="#000" opacity=".2"/><path d="M${83 - s} 104 L${89 - s * .5} 140 L96 171" stroke="#fff" stroke-opacity=".22" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
    else p.push(`<path d="M127 95 L${152 + s} 100 L166 274 Q150 278 135 280 Q138 180 127 95 Z" fill="#000" opacity=".14"/>`);

    /* acessórios de atributo no peito/cinto */
    if (lv('carreira') >= 5) p.push(`<path d="M104 112 l2.4 5 5.4 .7 -4 3.8 1 5.4 -4.8 -2.6 -4.8 2.6 1 -5.4 -4 -3.8 5.4 -.7 Z" fill="${lv('carreira') >= 10 ? GOLD : STEEL}" stroke="${OL}" stroke-width=".8"${lv('carreira') >= 10 ? ` filter="url(#${id}gl)"` : ''}/>`);
    if (lv('financas') >= 5) p.push(`<g stroke="${OL}" stroke-width="1.2"><path d="M138 172 q-9 5 -9 15 q0 8 12 8 q12 0 12 -8 q0 -10 -9 -15 Z" fill="${M('#8a5a12')}"/><path d="M137 172 h8" stroke="#f7c948" stroke-width="2.5"/></g><text x="141" y="190" font-size="9" text-anchor="middle" fill="#fde68a" font-weight="900">$</text>`);
    if (lv('saude') >= 10) p.push(`<path d="M120 174 l-5 -5 q-3 -4 1 -6 q3 -1 4 2 q1 -3 4 -2 q4 2 1 6 Z" fill="#ef4444" filter="url(#${id}gl)"/>`);

    /* braços */
    const sleeveC = { linen: '#cdbb98', leather: K.c || '#2f6b45', ranger: '#4a3020', robe: K.c, druid: K.c, coat: K.c, rogue: K.c || '#27272a' }[K.torso];
    const armM = plate ? MT : M(sleeveC);
    const gaunt = plate ? MT : K.torso === 'rogue' ? M('#0c0a09') : (K.torso === 'robe' || K.torso === 'druid') ? M(K.c2 && K.torso === 'robe' ? K.c2 : shade(K.c, -25)) : K.torso === 'coat' ? M(shade(K.c, -45)) : M('#5b3a1f');
    const handC = plate ? null : SK;
    const hand = (x, y) => `<path d="M${x - 8} ${y - 6} h16 v7 q0 10 -8 10 q-8 0 -8 -10 Z" fill="${handC || gaunt}" stroke="${OL}" stroke-width="1.3"/>`;
    const wide = longRobe || K.torso === 'coat' ? 4 : 0;
    const upper = `<path d="M${78 - s} 102 Q${67 - s - wide} 122 ${70 - s - wide} 142 L${87 - s} 145 Q${88 - s} 124 ${95 - s} 106 Z" fill="${armM}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`;
    const fRest = `<path d="M${70 - s - wide} 142 L${87 - s} 145 L${87 - s * .3} 180 L${71 - s * .3 - wide} 180 Z" fill="${gaunt}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`;
    const armRest = upper + fRest + hand(79 - s * .3, 186);
    const fGreat = `<path d="M${70 - s} 140 L${87 - s} 145 L118 168 L110 182 Z" fill="${gaunt}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`;
    const armGreat = upper + fGreat;

    const paul = () => {
      if (K.paul === 'leather') return `<path d="M${68 - s} 112 Q${70 - s} 96 ${90 - s} 98 Q${98 - s} 104 ${96 - s} 114 Q${82 - s} 120 ${68 - s} 112 Z" fill="${M('#7a4a24')}" stroke="${OL}" stroke-width="1.4"/>`;
      if (!plate && K.paul !== 'steel') return '';
      const pm = plate ? MT : STEEL;
      let g = `<g stroke="${OL}" stroke-width="1.4" stroke-linejoin="round">`;
      if (K.spikes) g += `<path d="M${74 - s} 98 L${66 - s} 74 L${84 - s} 94 Z" fill="${pm}"/><path d="M${86 - s} 94 L${86 - s} 70 L${96 - s} 94 Z" fill="${pm}"/>`;
      g += `<path d="M${60 - s} 116 Q${60 - s} 90 ${92 - s} 92 Q${104 - s} 96 ${102 - s} 110 Q${82 - s} 122 ${60 - s} 116 Z" fill="${pm}"/>`;
      if (plate) g += `<path d="M${61 - s} 116 Q${82 - s} 124 ${102 - s} 112 L${100 - s} 121 Q${80 - s} 132 ${63 - s} 125 Z" fill="${pm}"/><path d="M${63 - s} 125 Q${80 - s} 133 ${99 - s} 122 L${97 - s} 130 Q${80 - s} 140 ${66 - s} 133 Z" fill="${pm}"/>`;
      g += `</g><path d="M${66 - s} 104 Q${76 - s} 94 ${90 - s} 96" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>`;
      if (K.trim) g += `<path d="M${62 - s} 116 Q${82 - s} 124 ${102 - s} 112" stroke="#f7c948" stroke-width="2" fill="none"/>`;
      if (K.metal === 'gold') g += `<circle cx="${80 - s}" cy="104" r="3.5" fill="#f97316" stroke="#fff7d6"/>`;
      return g;
    };

    const dim = x => `<g filter="url(#${id}sh)">${x}</g>`;
    if (pose === 'rest' || pose === 'shield') { p.push(armRest); p.push(dim(mirror(armRest))); }
    if (pose === 'dual') {
      p.push(mirror(weaponBack(K.weapon)) + armRest);
      p.push(dim(mirror(armRest)));
    }
    if (pose === 'great') { p.push(armGreat); p.push(dim(mirror(armGreat))); }
    if (pose === 'cast') {
      const raise = `<path d="M${78 - s} 102 Q${66 - s - wide} 120 ${64 - s - wide} 140 L${80 - s} 146 Q${86 - s} 124 ${95 - s} 106 Z" fill="${armM}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/><path d="M${64 - s - wide} 140 L${80 - s} 146 L72 112 L58 112 Z" fill="${gaunt}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/><path d="M57 114 q-2 -12 8 -14 q10 2 8 14 Z" fill="${handC || gaunt}" stroke="${OL}" stroke-width="1.3"/>`;
      p.push(raise); p.push(dim(mirror(armRest)));
      const oc = K.orb || auraC;
      p.push(`<g${an('av-float')}><circle cx="65" cy="90" r="16" fill="${oc}" filter="url(#${id}g2)" opacity=".9"/><circle cx="65" cy="90" r="8" fill="${shade(oc, 55)}"/><circle cx="65" cy="90" r="4" fill="#fff"/></g><g${an('av-spin')} fill="none" stroke="${shade(oc, 40)}" stroke-width="1.2"><circle cx="65" cy="90" r="13" stroke-dasharray="2 4"/></g>`);
      if (o.cls === 'druida') p.push(`<g${an('av-float2')}><path d="M50 78 q6 -6 10 0 q-5 4 -10 0 Z M78 74 q6 -6 10 0 q-5 4 -10 0 Z" fill="${K.c2}"/></g>`);
    }
    p.push(paul()); p.push(dim(mirror(paul())));

    /* escudo / montante / martelo */
    if (pose === 'shield') {
      const fld = M(K.shield || '#1e40af'), rim = K.trim ? GOLD : STEEL;
      const emb = K.cross || K.shield === '#f8fafc' ? `<path d="M72 140 L72 200 M60 158 L84 158" stroke="${K.trim ? '#b7791f' : '#b91c1c'}" stroke-width="5"/>` : `<path d="M72 140 L72 200 M60 158 L84 158" stroke="#e2e8f0" stroke-width="5"/>`;
      p.push(`<g stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"><path d="M50 128 Q72 118 94 128 L92 176 Q86 206 72 222 Q58 206 52 176 Z" fill="${rim}"/><path d="M56 132 Q72 125 88 132 L87 175 Q82 199 72 212 Q62 199 57 175 Z" fill="${fld}"/></g>${emb}<path d="M58 134 Q66 130 74 131" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`);
    }
    if (pose === 'great') {
      const gm = K.metal === 'gold' ? GOLD : DARK;
      if (K.weapon === 'hammer') {
        p.push(`<g stroke="${OL}" stroke-width="1.4" stroke-linejoin="round"><rect x="116" y="150" width="8" height="96" rx="3" fill="${M('#5b3a1f')}"/><path d="M96 238 L144 238 L148 272 L92 272 Z" fill="${GOLD}"/><path d="M92 252 L148 252" stroke="#b7791f" stroke-width="2"/><circle cx="120" cy="150" r="6" fill="${gm}"/></g><circle cx="120" cy="255" r="6" fill="#fff7d6" filter="url(#${id}gl)"/>`);
      } else {
        const bl = K.weapon === 'flamesword' ? `url(#${id}fl)` : STEEL;
        if (K.weapon === 'flamesword') p.push(`<path d="M114 182 L126 182 L122 282 L118 282 Z" fill="#fbbf24" filter="url(#${id}g2)" opacity=".85"/>`);
        p.push(`<g stroke="${OL}" stroke-width="1.4" stroke-linejoin="round"><path d="M113 184 L127 184 L124 270 L120 284 L116 270 Z" fill="${bl}"/><path d="M92 176 Q120 168 148 176 L146 184 Q120 178 94 184 Z" fill="${gm}"/><rect x="116" y="152" width="8" height="24" rx="2" fill="${M('#3b2414')}"/><circle cx="120" cy="150" r="6" fill="${gm}"/></g><path d="M120 186 L120 272" stroke="#fff" stroke-width="1.2" opacity=".8"/><circle cx="120" cy="178" r="3" fill="${K.weapon === 'flamesword' ? '#f97316' : '#ef4444'}"/>`);
      }
      p.push(hand(113, 172) + hand(127, 172) + glint(120, 228, .6));
    }

    /* ================= CABEÇA ================= */
    const h0 = p.length;
    p.push(`<path d="M111 76 L129 76 L131 96 L109 96 Z" fill="${SKd}" stroke="${OL}" stroke-width="1.3"/>`);
    const ear = {
      human: `<ellipse cx="100.5" cy="60" rx="4" ry="6" fill="${SKd}" stroke="${OL}" stroke-width="1.2"/>`,
      elf: `<path d="M102 55 L82 40 L101 67 Z" fill="${SKd}" stroke="${OL}" stroke-width="1.2" stroke-linejoin="round"/><path d="M99 57 L88 47" stroke="${shade(SK, -35)}" stroke-width="1.2"/>`,
      orc: `<path d="M102 54 L90 49 L101 66 Z" fill="${SKd}" stroke="${OL}" stroke-width="1.2" stroke-linejoin="round"/>`,
      goblin: `<path d="M102 54 L72 48 Q80 60 101 67 Z" fill="${SKd}" stroke="${OL}" stroke-width="1.2" stroke-linejoin="round"/><path d="M99 58 L80 52" stroke="${shade(SK, -35)}" stroke-width="1.2"/>`
    }[R.ears];
    if (!hooded) p.push(ear + mirror(ear));
    p.push(`<path d="M101 50 Q101 32 120 31 Q139 32 139 50 L139 62 Q138 75 129 82 Q120 87 111 82 Q102 75 101 62 Z" fill="url(#${id}fc)" stroke="${OL}" stroke-width="1.6"/>`);
    p.push(`<path d="M133 50 Q139 62 134 74 Q130 80 124 84 Q132 72 133 50 Z" fill="${SKd}" opacity=".45"/>`);

    /* rosto */
    const m = o.mood, glow = K.glow;
    const iris = glow || (o.race === 'goblin' ? '#a16207' : o.race === 'orc' ? '#7c2d12' : '#2b1d14');
    let eyes = `<path d="M106 60 Q112 55.5 118 60 Q112 63.5 106 60 Z" fill="${o.race === 'goblin' ? '#fef9c3' : '#fff'}"/><path d="M122 60 Q128 55.5 134 60 Q128 63.5 122 60 Z" fill="${o.race === 'goblin' ? '#fef9c3' : '#fff'}"/><circle cx="112" cy="59.8" r="2.3" fill="${iris}"/><circle cx="128" cy="59.8" r="2.3" fill="${iris}"/>`;
    if (glow) eyes += `<g filter="url(#${id}gl)"><circle cx="112" cy="59.8" r="2" fill="${iris}"/><circle cx="128" cy="59.8" r="2" fill="${iris}"/></g>`;
    if (m === 'cansado' || m === 'exausto') eyes += `<path d="M105 60 Q112 54 119 60 L119 58 Q112 53 105 58 Z" fill="${SK}"/><path d="M121 60 Q128 54 135 60 L135 58 Q128 53 121 58 Z" fill="${SK}"/><path d="M105 59.5 Q112 57.5 119 59.5 M121 59.5 Q128 57.5 135 59.5" stroke="${OL}" stroke-width="1.4"/><path d="M107 65 q5 2 10 0 M123 65 q5 2 10 0" stroke="${SKd}" stroke-width="1.2" fill="none"/>`;
    else eyes += `<path d="M105.5 60 Q112 55 118.5 60 M121.5 60 Q128 55 134.5 60" stroke="${OL}" stroke-width="1.5" fill="none"/>`;
    p.push(`<g${an('av-blink')}>${eyes}</g>`);
    const heavy = o.race === 'orc' || o.race === 'anao';
    const brows = m === 'exausto' ? ['M104 52 L118 54.5 L118 56.5 L104 55 Z', 'M136 52 L122 54.5 L122 56.5 L136 55 Z'] : heavy ? ['M103 51 L118 55 L118 58.5 L104 56 Z', 'M137 51 L122 55 L122 58.5 L136 56 Z'] : ['M104 53 L118 55.5 L118 58 L105 56 Z', 'M136 53 L122 55.5 L122 58 L135 56 Z'];
    const browC = o.race === 'orc' && (o.hair === 'calvo' || o.hair === 'raspado') ? shade(SK, -45) : HCd;
    p.push(`<path d="${brows[0]}" fill="${browC}"/><path d="${brows[1]}" fill="${browC}"/>`);
    if (R.nose) p.push(`<path d="M120 60 Q114 72 112 74 Q116 79 124 76 Q127 74 124 70 Q122 64 120 60 Z" fill="${shade(SK, -12)}" stroke="${OL}" stroke-width="1.2"/>`);
    else p.push(`<path d="M120 61 L117.5 70 Q120 71.5 122.5 70" stroke="${SKd}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`);
    const mouth = { feliz: 'M112.5 75 Q121 79 128.5 73.5', ok: 'M114 75.5 L127 75', cansado: 'M114 76.5 Q120 75 127 76.5', exausto: 'M113.5 77.5 Q120 73 126.5 77.5' }[m] || 'M114 75.5 L127 75';
    const mouthY = R.nose ? 3 : 0;
    p.push(`<path d="${mouth}" transform="translate(0 ${mouthY})" stroke="#5a2a22" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
    if (R.tusks) p.push(`<path d="M113 77 L111.5 69 L116 76 Z M127 77 L128.5 69 L124 76 Z" fill="#fefce8" stroke="${OL}" stroke-width=".9" stroke-linejoin="round"/>`);
    if (m === 'exausto') p.push(`<path d="M138 44 q4 7 0 10 q-4 -3 0 -10" fill="#7dd3fc"/>`);

    /* barba (anão sempre com barba farta) */
    const beard = o.race === 'anao' && o.beard === 'nenhuma' ? 'barba' : o.beard;
    if (beard === 'barba') {
      const long = o.race === 'anao';
      p.push(`<path d="M101 60 Q101 ${long ? 100 : 84} 120 ${long ? 110 : 90} Q139 ${long ? 100 : 84} 139 60 Q136 72 128 74 Q124 70 120 71 Q116 70 112 74 Q104 72 101 60 Z" fill="${HC}" stroke="${OL}" stroke-width="1.2"/><path d="M112.5 76 Q121 ${m === 'feliz' ? 80 : 78} 128.5 75" stroke="#3a1a14" stroke-width="1.6" fill="none"/><path d="M106 72 q3 6 2 10 M134 72 q-3 6 -2 10${long ? ' M114 88 q2 8 0 14 M126 88 q-2 8 0 14' : ''}" stroke="${HCl}" stroke-width="1" fill="none" opacity=".6"/>`);
      if (long) p.push(`<rect x="116" y="100" width="8" height="5" rx="1.5" fill="${GOLD}" stroke="${OL}" stroke-width=".8"/>`);
      if (R.tusks) p.push(`<path d="M113 77 L111.5 69 L116 76 Z M127 77 L128.5 69 L124 76 Z" fill="#fefce8" stroke="${OL}" stroke-width=".9"/>`);
    }
    if (beard === 'cavanhaque') p.push(`<path d="M111 72 Q120 68 129 72 Q124 71 120 71.5 Q116 71 111 72 Z" fill="${HC}"/><path d="M114 79 Q120 90 126 79 Q120 82 114 79 Z" fill="${HC}" stroke="${OL}" stroke-width="1"/>`);
    if (beard === 'bigode') p.push(`<path d="M109 73.5 Q115 68.5 120 71 Q125 68.5 131 73.5 Q125 72 120 73.5 Q115 72 109 73.5 Z" fill="${HC}" stroke="${OL}" stroke-width=".8"/>`);

    /* máscara de ladrão */
    if (K.mask) p.push(`<path d="M101 64 Q120 70 139 64 L138 74 Q134 84 120 88 Q106 84 102 74 Z" fill="${M(K.scarf || '#18181b')}" stroke="${OL}" stroke-width="1.3"/><path d="M106 72 Q120 77 134 72" stroke="#000" stroke-width="1" opacity=".35" fill="none"/>`);

    /* óculos */
    if (o.glasses) p.push(`<g fill="rgba(186,230,253,.15)" stroke="#0f141f" stroke-width="1.8"><rect x="104" y="54.5" width="16" height="11" rx="3"/><rect x="120" y="54.5" width="16" height="11" rx="3"/></g><path d="M101 58 l3 1 M136 59 l3 -1" stroke="#0f141f" stroke-width="1.8"/><path d="M106 57 l4 -1.5" stroke="#fff" stroke-width="1" opacity=".6"/>`);

    /* cabelo (frente) */
    const H = {
      curto: `<path d="M100 56 Q97 30 120 29 Q143 30 140 56 Q139 44 131 41 Q121 46 110 41 Q102 45 100 56 Z" fill="${HC}" stroke="${OL}" stroke-width="1.4"/><path d="M108 36 Q118 32 130 35" stroke="${HCl}" stroke-width="1.5" fill="none"/>`,
      social: `<path d="M100 58 Q96 28 123 28 Q144 30 141 54 Q139 42 129 39 Q115 38 107 45 Q102 50 100 58 Z" fill="${HC}" stroke="${OL}" stroke-width="1.4"/><path d="M107 45 Q116 33 136 37" stroke="${HCd}" stroke-width="1.6" fill="none"/><path d="M114 33 Q124 30 134 33" stroke="${HCl}" stroke-width="1.4" fill="none"/>`,
      cacheado: [[104, 42, 7], [112, 35, 8], [122, 32, 8], [132, 36, 8], [138, 45, 6], [101, 51, 5], [127, 41, 5], [115, 42, 5]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${HC}" stroke="${OL}" stroke-width="1.2"/>`).join(''),
      longo: `<path d="M100 58 Q96 28 120 28 Q144 28 140 58 Q138 42 128 38 Q118 46 108 40 Q101 46 100 58 Z" fill="${HC}" stroke="${OL}" stroke-width="1.4"/>`,
      calvo: `<path d="M101 62 Q100 48 104 42 L106 60 Z M139 62 Q140 48 136 42 L134 60 Z" fill="${HC}" stroke="${OL}" stroke-width="1"/>`,
      raspado: `<path d="M101 54 Q100 31 120 31 Q140 31 139 54 Q136 40 120 38 Q104 40 101 54 Z" fill="${HC}" opacity=".5"/>`
    };
    if (!hooded) p.push(H[o.hair] || H.curto);

    /* chapéus, capuzes e coroas */
    const hd = K.head;
    if (hooded) p.push(`<path d="M94 92 Q88 20 120 17 Q152 20 146 92 L140 92 Q142 56 134 44 Q120 34 106 44 Q98 56 100 92 Z" fill="${M(K.hoodC)}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/><path d="M106 44 Q120 34 134 44" stroke="#000" stroke-width="3" opacity=".35" fill="none"/>`);
    if (hd === 'band') p.push(`<path d="M100 46 Q120 38 140 46" stroke="#7f1d1d" stroke-width="3" fill="none"/>`);
    if (hd === 'horns') p.push(`<g stroke="${OL}" stroke-width="1.3" stroke-linejoin="round"><path d="M100 46 Q120 36 140 46 L140 50 Q120 42 100 50 Z" fill="${DARK}"/><path d="M102 46 Q84 40 80 18 Q90 32 106 40 Z" fill="${M('#e7e5e4')}"/><path d="M138 46 Q156 40 160 18 Q150 32 134 40 Z" fill="${M('#e7e5e4')}"/></g><circle cx="120" cy="44" r="2.5" fill="#ef4444"/>`);
    if (hd === 'hat') p.push(`<g stroke="${OL}" stroke-width="1.4" stroke-linejoin="round"><path d="M104 40 Q112 22 120 12 Q128 2 146 4 Q132 10 132 22 L138 40 Z" fill="${M(K.hatC)}"/><ellipse cx="120" cy="41" rx="30" ry="6" fill="${M(shade(K.hatC, -15))}"/><path d="M106 36 Q120 32 136 36" stroke="${K.c2 || '#fbbf24'}" stroke-width="3" fill="none"/></g><path d="M121 26 l2 -4 l2 4 l4 1 l-4 1 l-2 4 l-2 -4 l-4 -1 Z" fill="#fde68a"/>`);
    if (hd === 'mitre') p.push(`<g stroke="${OL}" stroke-width="1.3" stroke-linejoin="round"><path d="M104 44 Q104 22 120 6 Q136 22 136 44 Q120 40 104 44 Z" fill="${M('#f8fafc')}"/><path d="M120 10 V40 M112 22 H128" stroke="#b7791f" stroke-width="2.5"/><path d="M104 44 Q120 40 136 44" stroke="#b7791f" stroke-width="3" fill="none"/></g>`);
    if (hd === 'leaves') {
      let lf = '';
      for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8, x = 120 + Math.cos(a) * 21, y = 44 + Math.sin(a) * 12; lf += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} q-4 -8 2 -12 q4 6 -2 12 Z" fill="${i % 2 ? '#65a30d' : '#84cc16'}" stroke="${OL}" stroke-width=".7"/>`; }
      p.push(lf);
    }
    if (hd === 'antlers' || hd === 'antlersGold') {
      const ac = hd === 'antlersGold' ? GOLD : M('#a16207');
      const one = `<path d="M106 40 Q100 26 92 18 M100 28 Q92 26 86 30 M96 22 Q96 12 100 6 M92 18 Q84 12 80 4" stroke="${OL}" stroke-width="6.5" fill="none" stroke-linecap="round"/><path d="M106 40 Q100 26 92 18 M100 28 Q92 26 86 30 M96 22 Q96 12 100 6 M92 18 Q84 12 80 4" stroke="${ac}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      p.push(`<g${K.antlerGlow ? ` filter="url(#${id}gl)"` : ''}>${one}${mirror(one)}</g>`);
    }
    if (hd === 'crown') p.push(`<g filter="url(#${id}gl)" stroke="${OL}" stroke-width="1.2" stroke-linejoin="round"><path d="M100 40 L102 18 L110 32 L114 10 L120 28 L126 10 L130 32 L138 18 L140 40 Q120 34 100 40 Z" fill="${o.cls === 'ladrao' ? DARK : GOLD}"/></g><circle cx="120" cy="34" r="3" fill="${o.cls === 'ladrao' ? '#fbbf24' : '#ef4444'}"/><circle cx="108" cy="36" r="2" fill="#38bdf8"/><circle cx="132" cy="36" r="2" fill="#38bdf8"/>`);

    p.push(HEAD(p.splice(h0).join('')));

    /* fecha o grupo do corpo com a escala da raça */
    const body = p.splice(b0).join('');
    p.push( `<g transform="translate(120 281) scale(${R.sx} ${R.sy}) translate(-120 -281)">${body}</g>`);

    /* ================= FLUTUANTES ================= */
    if (lv('mente') >= 5) {
      const g = lv('mente') >= 10;
      p.push(`<g${an('av-float')}><g transform="translate(18 132) rotate(-14)"${g ? ` filter="url(#${id}gl)"` : ''}><path d="M0 0 L18 -5 L36 0 L36 24 L18 19 L0 24 Z" fill="${g ? '#7c3aed' : '#4338ca'}" stroke="${OL}" stroke-width="1.4"/><path d="M3 2 L18 -2 L33 2 L33 21 L18 17 L3 21 Z" fill="#f5f3ff"/><path d="M18 -2 L18 17" stroke="${OL}"/><path d="M6 6 h9 M6 10 h9 M21 6 h9 M21 10 h9" stroke="${g ? '#a855f7' : '#6366f1'}" stroke-width="1.3"/></g></g>`);
    }
    if (lv('proposito') >= 5) p.push(`<g${an('av-float2')}><circle cx="206" cy="64" r="10" fill="#5eead4" filter="url(#${id}g2)"/><circle cx="206" cy="64" r="4" fill="#fff"/></g>`);
    if (lv('financas') >= 10) p.push(`<g${an('av-float2')}>${[[210, 132], [222, 154], [206, 174]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="7" fill="${GOLD}" stroke="${OL}"/><text x="${c[0]}" y="${c[1] + 3}" font-size="8" text-anchor="middle" fill="#7c4a03" font-weight="900">$</text>`).join('')}</g>`);
    if (K.runes) p.push(`<g${an('av-float')} fill="none" stroke="${K.runes}" stroke-width="1.8" filter="url(#${id}gl)" opacity=".9"><path d="M26 110 l8 -10 l8 10 l-8 10 Z"/><path d="M204 118 h12 M210 112 v12"/><circle cx="34" cy="214" r="6"/><path d="M200 220 l10 -6 v12 Z"/></g>`);
    if (K.leavesFx) p.push(`<g${an('av-float2')}>${[[30, 100], [210, 110], [40, 200], [200, 210], [60, 60], [180, 50]].map((c, i) => `<path d="M${c[0]} ${c[1]} q6 -10 12 0 q-6 6 -12 0 Z" fill="${i % 2 ? '#84cc16' : '#facc15'}" opacity=".85" transform="rotate(${i * 40} ${c[0] + 6} ${c[1]})"/>`).join('')}</g>`);

    /* ================= LOBO (Relações) ================= */
    const rel = lv('relacoes');
    if (rel >= 5) {
      const st = rel >= 15 ? 3 : rel >= 10 ? 2 : 1, sc = [0, .8, 1, 1.1][st];
      const fur = st === 3 ? '#a5f3fc' : st === 2 ? '#64748b' : '#94a3b8', furD = shade(fur, -35), belly = st === 3 ? '#ecfeff' : '#e2e8f0';
      p.push(`<g transform="translate(204 272) scale(${sc})"${st === 3 ? ` filter="url(#${id}gl)" opacity=".92"` : ''}><g stroke="${OL}" stroke-width="1.3" stroke-linejoin="round">
        <g${an('av-tail')} style="transform-box:fill-box;transform-origin:0% 80%"><path d="M12 -15 Q30 -16 37 -32 Q41 -18 32 -9 Q24 -4 13 -7 Z" fill="${M(fur)}"/><path d="M33 -26 Q37 -22 34 -15" stroke="${belly}" stroke-width="2" fill="none"/></g>
        <path d="M6 -10 L13 -10 L13 6 L7 6 Z M-11 -10 L-5 -10 L-6 6 L-12 6 Z" fill="${furD}"/>
        <path d="M-15 -21 Q-2 -27 14 -19 Q19 -11 14 -5 Q0 -2 -11 -5 Q-18 -11 -15 -21 Z" fill="${M(fur)}"/>
        <path d="M10 -10 L16 -10 L16 6 L10 6 Z M-14 -10 L-8 -10 L-9 6 L-15 6 Z" fill="${M(fur)}"/>
        <path d="M-15 -21 Q-21 -30 -19 -38 L-8 -33 Q-5 -24 -9 -15 Z" fill="${M(fur)}"/>
        <path d="M-17 -45 Q-9 -47 -6 -39 Q-6 -33 -12 -30 L-21 -29 Q-24 -36 -17 -45 Z" fill="${M(fur)}"/>
        <path d="M-20 -37 L-33 -33 Q-34 -29 -31 -28 L-19 -29 Z" fill="${M(fur)}"/>
        <path d="M-15 -44 L-13 -55 L-9 -43 Z M-11 -43 L-7 -53 L-5 -41 Z" fill="${M(fur)}"/></g>
        <path d="M-18 -29 Q-14 -24 -10 -28" stroke="${belly}" stroke-width="2" fill="none"/>
        <circle cx="-32.5" cy="-31.5" r="1.6" fill="${OL}"/>
        <path d="M-18 -38 L-14 -37" stroke="${st === 3 ? '#0e7490' : '#fbbf24'}" stroke-width="2" stroke-linecap="round"/>
        ${st >= 2 ? `<path d="M-19 -26 Q-12 -20 -7 -25 L-6 -21 Q-12 -14 -19 -21 Z" fill="#b91c1c" stroke="${OL}" stroke-width="1"/>` : ''}
        ${st === 3 ? '<path d="M-14 -64 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 Z" fill="#fff"/>' : ''}
      </g>`);
    }

    return `<svg viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs.join('')}</defs><g${an('av-breathe')}>${p.join('')}</g></svg>`;
  }

  return { render, artOf, tierOf, tierInfo, TIERS, MIN, RACES, CLASSES, SKINS, HAIRC, HAIRS, BEARDS, shade };
})();
