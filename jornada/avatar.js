/* Avatar SVG procedural, estilo herói de jogo.
   Evolui por FORMA (nível) e ganha itens por ATRIBUTO (áreas da vida). */
const AV = (() => {
  let uid = 0;
  const SKINS = ['#f3d2bc', '#e5b896', '#cf9a72', '#a8724a', '#7a4c2e', '#4c2e1b'];
  const HAIRC = ['#17120f', '#3d2516', '#7a4a24', '#c99a52', '#9c9c9c', '#e4e2df', '#6e1a1a'];
  const HAIRS = [['curto', 'Curto'], ['social', 'Social'], ['cacheado', 'Cacheado'], ['longo', 'Longo'], ['calvo', 'Entradas'], ['raspado', 'Raspado']];
  const BEARDS = [['nenhuma', 'Sem barba'], ['barba', 'Barba'], ['cavanhaque', 'Cavanhaque'], ['bigode', 'Bigode']];
  const TIERS = [
    { n: 'Aprendiz', min: 1, d: 'Roupas de treino e espada de madeira. Toda lenda começa aqui.' },
    { n: 'Iniciado', min: 5, d: 'Gibão de couro, braçadeiras e a primeira lâmina de aço.' },
    { n: 'Desbravador', min: 10, d: 'Sobretudo de patrulheiro, gola de pele e arco longo.' },
    { n: 'Guerreiro', min: 15, d: 'Armadura de placas completa, escudo e espada longa.' },
    { n: 'Campeão', min: 20, d: 'Aço negro com filigrana de ouro, capa escarlate e montante.' },
    { n: 'Mestre', min: 30, d: 'Sobretudo arcano, cajado de cristal e magia na palma da mão.' },
    { n: 'Sábio', min: 40, d: 'Vestes sagradas, halo rúnico e olhos que brilham.' },
    { n: 'Lenda', min: 50, d: 'Armadura solar, coroa, asas de luz e lâmina flamejante.' }
  ];
  const tierOf = lvl => { let t = 0; TIERS.forEach((x, i) => { if (lvl >= x.min) t = i; }); return t; };
  const OL = '#0a0d17';

  function shade(hex, p) {
    const n = parseInt(hex.slice(1), 16);
    const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.max(0, Math.min(255, Math.round(p < 0 ? v * (1 + p / 100) : v + (255 - v) * (p / 100))));
    return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const mirror = s => `<g transform="translate(240 0) scale(-1 1)">${s}</g>`;

  function render(o) {
    o = Object.assign({ tier: 0, skin: SKINS[1], hair: 'curto', hairColor: HAIRC[1], beard: 'nenhuma', glasses: false, mood: 'feliz', areas: {}, aura: '#7c5cff', anim: true }, o);
    const id = 'av' + (++uid), t = o.tier, A = o.areas, lv = k => A[k] || 1;
    const s = Math.min(8, Math.floor((lv('saude') - 1) * 0.8));
    const an = c => o.anim ? ` class="${c}"` : '';
    const defs = [], gcache = {};
    // gradiente de material: luz de cima/esquerda
    const M = (c, k = 'v') => {
      const key = c + k; if (gcache[key]) return gcache[key];
      const gid = id + 'g' + Object.keys(gcache).length;
      const xy = k === 'v' ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" y1="0" x2="1" y2="1"';
      defs.push(`<linearGradient id="${gid}" ${xy}><stop offset="0" stop-color="${shade(c, 30)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -45)}"/></linearGradient>`);
      return (gcache[key] = `url(#${gid})`);
    };
    const STEEL = `url(#${id}st)`, GOLD = `url(#${id}gd)`, DARK = `url(#${id}dk)`;
    const SK = o.skin, SKd = shade(SK, -22), HC = o.hairColor, HCd = shade(HC, -30), HCl = shade(HC, 25);
    const p = [];
    const pose = t === 4 || t === 7 ? 'great' : t === 5 || t === 6 ? 'cast' : t === 3 ? 'shield' : 'rest';

    defs.push(`
      <radialGradient id="${id}au" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="${o.aura}" stop-opacity="${(0.3 + t * .07).toFixed(2)}"/><stop offset=".6" stop-color="${o.aura}" stop-opacity="${(0.06 + t * .03).toFixed(2)}"/><stop offset="1" stop-color="${o.aura}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}st" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="#cfd8e6"/><stop offset=".55" stop-color="#7d8ba3"/><stop offset=".8" stop-color="#dfe6f0"/><stop offset="1" stop-color="#5b677d"/></linearGradient>
      <linearGradient id="${id}gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset=".3" stop-color="#f7c948"/><stop offset=".6" stop-color="#b7791f"/><stop offset=".85" stop-color="#fde68a"/><stop offset="1" stop-color="#8a5a12"/></linearGradient>
      <linearGradient id="${id}dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b6478"/><stop offset=".35" stop-color="#262c3a"/><stop offset=".7" stop-color="#11141d"/><stop offset="1" stop-color="#3a4152"/></linearGradient>
      <linearGradient id="${id}bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.aura}" stop-opacity="0"/><stop offset=".5" stop-color="${o.aura}" stop-opacity=".28"/><stop offset="1" stop-color="${o.aura}" stop-opacity=".05"/></linearGradient>
      <linearGradient id="${id}wg" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fffbe6" stop-opacity=".95"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id}fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff7d6"/><stop offset=".5" stop-color="#fbbf24"/><stop offset="1" stop-color="#f97316"/></linearGradient>
      <radialGradient id="${id}fc" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${shade(SK, 10)}"/><stop offset=".7" stop-color="${SK}"/><stop offset="1" stop-color="${SKd}"/></radialGradient>
      <filter id="${id}gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="${id}g2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>`);

    /* ================= FUNDO / FX ================= */
    if (t >= 5) p.push(`<rect x="80" y="0" width="80" height="290" fill="url(#${id}bm)"/>`);
    if (t === 7) {
      let r = '';
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, x1 = 120 + Math.cos(a - .06) * 160, y1 = 70 + Math.sin(a - .06) * 160, x2 = 120 + Math.cos(a + .06) * 160, y2 = 70 + Math.sin(a + .06) * 160; r += `<path d="M120 70 L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} Z"/>`; }
      p.push(`<g${an('av-rays')} fill="#fde68a" opacity=".16">${r}</g>`);
    }
    p.push(`<g${an('av-aura')}><circle cx="120" cy="160" r="${108 + t * 3}" fill="url(#${id}au)"/></g>`);
    // círculo mágico no chão
    if (t >= 2) {
      const op = (0.25 + t * .09).toFixed(2), c = t === 7 ? '#fbbf24' : o.aura;
      p.push(`<g opacity="${op}" fill="none" stroke="${c}"><ellipse cx="120" cy="281" rx="${62 + t * 2}" ry="12" stroke-width="2"/><ellipse cx="120" cy="281" rx="${50 + t * 2}" ry="9" stroke-width="1.2" stroke-dasharray="3 5"/>${t >= 4 ? `<ellipse cx="120" cy="281" rx="${74 + t * 2}" ry="15" stroke-width="1" stroke-dasharray="10 4 2 4"/>` : ''}</g>`);
    }
    p.push(`<ellipse cx="120" cy="281" rx="${48 + s}" ry="7" fill="#000" opacity=".55"/>`);
    if (t >= 3) for (let i = 0; i < t * 2 + 2; i++) {
      const x = 48 + ((i * 47) % 145), d = (i * .53) % 4;
      p.push(`<circle cx="${x}" cy="${266 - (i % 4) * 14}" r="${1.2 + (i % 3) * .6}" fill="${t === 7 ? '#fde68a' : t === 4 ? '#fb923c' : o.aura}" ${o.anim ? `class="av-p" style="animation-delay:${d.toFixed(2)}s"` : 'opacity=".7"'}/>`);
    }

    /* ================= ASAS ================= */
    if (t === 7 || lv('proposito') >= 10) {
      let w = '';
      for (let i = 0; i < 7; i++) {
        const ex = 8 + i * 9, ey = 40 + i * 24, op = (1 - i * .1).toFixed(2);
        w += `<path d="M112 104 Q${70 - i * 6} ${60 + i * 10} ${ex} ${ey} Q${54 - i * 2} ${92 + i * 18} 114 ${124 + i * 6} Z" fill="url(#${id}wg)" opacity="${op}"/>`;
      }
      p.push(`<g${an('av-wing')} opacity="${t === 7 ? 1 : .5}" filter="url(#${id}gl)">${w}${mirror(w)}</g>`);
    }
    /* halo rúnico (Sábio) */
    if (t === 6) {
      let ticks = '';
      for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; ticks += `<line x1="${(120 + Math.cos(a) * 30).toFixed(1)}" y1="${(56 + Math.sin(a) * 30).toFixed(1)}" x2="${(120 + Math.cos(a) * (i % 2 ? 34 : 37)).toFixed(1)}" y2="${(56 + Math.sin(a) * (i % 2 ? 34 : 37)).toFixed(1)}"/>`; }
      p.push(`<g${an('av-spin')} stroke="#5eead4" fill="none" filter="url(#${id}gl)"><circle cx="120" cy="56" r="38" stroke-width="2.5"/><circle cx="120" cy="56" r="29" stroke-width="1.2" stroke-dasharray="4 3"/><g stroke-width="1.5">${ticks}</g></g>`);
    }

    /* ================= CAPAS / CASACOS (atrás) ================= */
    if (t === 4 || t === 7) {
      const cc = t === 4 ? M('#9f1239') : M('#f8fafc'), edge = t === 4 ? '#4c0519' : '#d6a63a';
      p.push(`<path d="M${86 - s} 98 L${154 + s} 98 L${194 + s} 284 L176 277 L164 288 L146 279 L128 290 L112 280 L94 290 L78 278 L64 286 L${46 - s} 284 Z" fill="${cc}" stroke="${edge}" stroke-width="2"/>`);
      p.push(`<path d="M104 110 L92 270 M136 110 L150 272 M120 112 L120 280" stroke="${t === 4 ? '#4c0519' : '#cbd5e1'}" stroke-width="1.5" opacity=".5"/>`);
    }
    if (t === 2) p.push(`<path d="M${86 - s} 100 L${154 + s} 100 L164 252 L148 246 L136 256 L120 248 L104 256 L92 246 L76 252 Z" fill="${M('#4a3020')}" stroke="${OL}" stroke-width="1.5"/>`);
    if (t === 5) p.push(`<path d="M${86 - s} 100 L${154 + s} 100 L168 262 L144 256 L120 266 L96 256 L72 262 Z" fill="${M('#3b1a6e')}" stroke="${OL}" stroke-width="1.5"/>`);
    // arco e aljava nas costas (Desbravador)
    if (t === 2) p.push(`<path d="M152 40 Q206 150 150 262" stroke="${M('#6b4423')}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M152 40 L150 262" stroke="#e7e5e4" stroke-width="1" opacity=".7"/><rect x="92" y="54" width="12" height="62" rx="3" transform="rotate(-28 98 85)" fill="${M('#5b3415')}" stroke="${OL}"/><g transform="rotate(-28 98 85)" stroke="${OL}" stroke-width=".8"><path d="M95 56 L95 40" stroke="#d6c7a8" stroke-width="1.6"/><path d="M101 56 L101 37" stroke="#d6c7a8" stroke-width="1.6"/><path d="M95 40 l-3 -6 l3 2 l3 -2 Z M101 37 l-3 -6 l3 2 l3 -2 Z" fill="#b91c1c"/></g>`);
    // gola alta (Mestre)
    if (t === 5) p.push(`<path d="M100 96 L86 52 Q98 62 106 84 Z" fill="${M('#4c1d95')}" stroke="${OL}" stroke-width="1.5"/><path d="M140 96 L154 52 Q142 62 134 84 Z" fill="${M('#4c1d95')}" stroke="${OL}" stroke-width="1.5"/><path d="M88 56 L104 90 M152 56 L136 90" stroke="#fbbf24" stroke-width="1.5"/>`);

    /* cabelo longo (atrás) */
    if (o.hair === 'longo') p.push(`<path d="M99 52 Q96 28 120 28 Q144 28 141 52 L144 98 Q134 104 128 96 L128 70 L112 70 L112 96 Q106 104 96 98 Z" fill="${HCd}" stroke="${OL}" stroke-width="1.4"/>`);

    /* ================= PERNAS ================= */
    const robe = t === 6;
    const pantsC = ['#5b4a37', '#2f3640', '#3a3626', '#1e2633', '#141821', '#1e1236', '#cbd5e1', '#141821'][t];
    const legs = `M94 170 L146 170 L144 226 L141 266 L124 266 L120 204 L116 266 L99 266 L96 226 Z`;
    if (!robe) p.push(`<path d="${legs}" fill="${M(pantsC)}" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/>`);
    // grevas
    if (t === 3 || t === 4 || t === 7) {
      const gm = t === 3 ? STEEL : t === 4 ? DARK : GOLD;
      p.push(`<g stroke="${OL}" stroke-width="1.3"><path d="M97 214 L117 214 L115 264 L100 264 Z" fill="${gm}"/><path d="M123 214 L143 214 L141 264 L126 264 Z" fill="${gm}"/><circle cx="107" cy="220" r="7" fill="${gm}"/><circle cx="133" cy="220" r="7" fill="${gm}"/></g>`);
      if (t >= 4) p.push(`<path d="M100 236 L115 236 M126 236 L141 236" stroke="#f7c948" stroke-width="1.6"/>`);
    }
    // botas
    const bootC = ['#3b2a1c', '#4a2c16', '#3b2414', null, null, '#120a22', '#e2e8f0', null][t];
    const bootM = t === 3 ? STEEL : t === 4 ? DARK : t === 7 ? GOLD : M(bootC);
    p.push(`<g stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"><path d="M98 ${t === 2 || t === 1 ? 238 : 254} L117 ${t === 2 || t === 1 ? 238 : 254} L118 278 L88 279 Q87 268 98 262 Z" fill="${bootM}"/><path d="M123 ${t === 2 || t === 1 ? 238 : 254} L142 ${t === 2 || t === 1 ? 238 : 254} L142 262 Q153 268 152 279 L122 278 Z" fill="${bootM}"/></g>`);
    if (t === 0) p.push(`<path d="M99 246 L116 250 M99 254 L116 258 M124 250 L141 246 M124 258 L141 254" stroke="#d6c7a8" stroke-width="2"/>`);

    /* robe (Sábio) */
    if (robe) p.push(`<path d="M${88 - s} 100 Q120 92 ${152 + s} 100 L166 274 Q120 284 74 274 Z" fill="${M('#f1f5f9')}" stroke="${OL}" stroke-width="1.6"/><path d="M108 168 L132 168 L136 278 L120 284 L104 278 Z" fill="${M('#0f766e')}" stroke="${OL}" stroke-width="1.2"/><path d="M110 176 h20 M111 240 h18" stroke="#f7c948" stroke-width="2"/><path d="M120 190 l6 10 l-6 10 l-6 -10 Z" fill="#f7c948"/>`);

    /* ================= ARMAS ATRÁS DA MÃO ================= */
    const hx = 161 + s * .3; // mão direita
    if (t === 0) p.push(`<g stroke="${OL}" stroke-width="1.2"><path d="M${hx - 3} 194 L${hx + 3} 194 L${hx + 3} 256 L${hx} 264 L${hx - 3} 256 Z" fill="${M('#a47148')}"/><rect x="${hx - 9}" y="190" width="18" height="5" rx="2" fill="${M('#5b3a1f')}"/></g>`);
    if (t === 3) p.push(`<g stroke="${OL}" stroke-width="1.2"><path d="M${hx - 4} 196 L${hx + 4} 196 L${hx + 20} 276 L${hx + 13} 282 Z" fill="${STEEL}"/><path d="M${hx} 198 L${hx + 15} 276" stroke="#fff" stroke-width="1" opacity=".7"/><rect x="${hx - 12}" y="190" width="24" height="6" rx="2" fill="${M('#475569')}"/><circle cx="${hx}" cy="170" r="4" fill="${M('#475569')}"/></g>`);
    /* ================= TRONCO ================= */
    const torsoD = `M${80 - s} 100 Q120 90 ${160 + s} 100 L${154 + s * .5} 140 L146 174 L94 174 L${86 - s * .5} 140 Z`;
    const torsoC = ['#cdbb98', '#2f6b45', '#2f4a24', '#3d4656', '#1b1f2a', '#2e1065', '#f1f5f9', '#1b1f2a'][t];
    if (!robe) p.push(`<path d="${torsoD}" fill="${M(torsoC)}" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/>`);
    if (t === 0) p.push(`<path d="M110 94 L120 116 L130 94" fill="none" stroke="#8f7c5c" stroke-width="2"/><path d="M98 120 Q104 132 100 150 M142 120 Q136 132 140 150" stroke="#a8946f" stroke-width="1.5" fill="none" opacity=".7"/><path d="M92 166 Q120 172 148 166 L148 176 Q120 182 92 176 Z" fill="${M('#6b4a2a')}" stroke="${OL}"/>`);
    if (t === 1) p.push(`<path d="M${90 - s * .5} 104 Q120 98 ${150 + s * .5} 104 L146 168 L94 168 Z" fill="${M('#7a4a24')}" stroke="${OL}" stroke-width="1.4"/><path d="M120 102 L120 168" stroke="#3b2414" stroke-width="1.5"/><path d="M106 112 h28 M106 124 h28 M106 136 h28 M106 148 h28" stroke="#3b2414" stroke-width="1" opacity=".55"/><path d="M${84 - s} 104 L150 172" stroke="${M('#3b2414')}" stroke-width="7"/><path d="M92 164 L148 164 L148 176 L92 176 Z" fill="${M('#3b2414')}" stroke="${OL}"/><rect x="113" y="163" width="14" height="14" rx="2" fill="none" stroke="#f7c948" stroke-width="2.5"/><path d="M104 88 Q120 100 136 88 L138 98 Q120 108 102 98 Z" fill="${M('#b91c1c')}" stroke="${OL}"/>`);
    if (t === 2) p.push(`<path d="M${82 - s} 100 L104 100 L110 176 L${86 - s * .5} 176 Z" fill="${M('#5a3a24')}" stroke="${OL}" stroke-width="1.4"/><path d="M${158 + s} 100 L136 100 L130 176 L${154 + s * .5} 176 Z" fill="${M('#5a3a24')}" stroke="${OL}" stroke-width="1.4"/><path d="M${82 - s} 98 Q120 84 ${158 + s} 98 Q150 112 136 108 Q120 104 104 108 Q90 112 ${82 - s} 98 Z" fill="${M('#a8a29e')}" stroke="${OL}" stroke-width="1.4"/><path d="M90 102 q4 4 0 8 M100 104 q4 4 0 8 M140 104 q4 4 0 8 M150 102 q4 4 0 8" stroke="#78716c" stroke-width="1.2" fill="none"/><path d="M104 108 L146 160 M136 108 L94 160" stroke="${M('#2a1a10')}" stroke-width="5"/><circle cx="120" cy="134" r="5" fill="#b7791f" stroke="${OL}"/><path d="M94 166 L146 166 L146 176 L94 176 Z" fill="${M('#2a1a10')}" stroke="${OL}"/>`);
    if (t === 3 || t === 4 || t === 7) {
      const pm = t === 3 ? STEEL : t === 4 ? DARK : GOLD, tr = t === 3 ? '#94a3b8' : '#f7c948';
      const tab = t === 3 ? M('#1e40af') : t === 4 ? M('#7f1d1d') : M('#f8fafc');
      p.push(`<path d="M106 168 L134 168 L136 246 L120 254 L104 246 Z" fill="${tab}" stroke="${OL}" stroke-width="1.4"/>`);
      if (t === 3) p.push(`<path d="M120 190 l8 8 l-8 18 l-8 -18 Z" fill="#e2e8f0" opacity=".9"/>`);
      if (t === 4) p.push(`<path d="M120 186 l6 10 l-6 18 l-6 -18 Z" fill="#f7c948"/>`);
      p.push(`<g stroke="${OL}" stroke-width="1.4" stroke-linejoin="round">
        <path d="M${86 - s * .5} 102 Q120 94 ${154 + s * .5} 102 L150 146 Q120 160 90 146 Z" fill="${pm}"/>
        <path d="M92 148 Q120 160 148 148 L147 158 Q120 170 93 158 Z" fill="${pm}"/>
        <path d="M93 160 Q120 172 147 160 L146 172 Q120 182 94 172 Z" fill="${pm}"/>
        <path d="M104 90 Q120 100 136 90 L138 102 Q120 110 102 102 Z" fill="${pm}"/></g>
        <path d="M120 100 L120 156" stroke="${t === 3 ? '#fff' : tr}" stroke-width="1.4" opacity=".8"/>
        <path d="M96 122 Q108 132 120 124 Q132 132 144 122" stroke="${OL}" stroke-width="1.3" fill="none" opacity=".6"/>
        <path d="M94 108 Q104 102 112 108" stroke="#fff" stroke-width="2" fill="none" opacity=".55"/>`);
      if (t >= 4) p.push(`<path d="M${88 - s * .5} 104 Q120 96 ${152 + s * .5} 104" stroke="${tr}" stroke-width="2.2" fill="none"/><path d="M100 132 q8 -6 14 0 q6 -6 14 0 q-14 10 -28 0 Z" fill="${tr}" opacity=".9"/>`);
      if (t === 7) p.push(`<circle cx="120" cy="120" r="7" fill="#fff7d6" filter="url(#${id}gl)"/><circle cx="120" cy="120" r="4.5" fill="#f97316"/>`);
    }
    if (t === 5) p.push(`<path d="M${84 - s} 100 L106 100 L112 176 L${88 - s * .5} 176 Z" fill="${M('#4c1d95')}" stroke="${OL}" stroke-width="1.4"/><path d="M${156 + s} 100 L134 100 L128 176 L${152 + s * .5} 176 Z" fill="${M('#4c1d95')}" stroke="${OL}" stroke-width="1.4"/><path d="M106 102 L112 176 M134 102 L128 176" stroke="#f7c948" stroke-width="2"/><g fill="none" stroke="${shade(o.aura, 35)}" stroke-width="1.4" filter="url(#${id}gl)"><circle cx="120" cy="128" r="9"/><path d="M120 116 v24 M108 128 h24"/></g><path d="M94 164 L146 164 L146 176 L94 176 Z" fill="${M('#b7791f')}" stroke="${OL}"/>`);

    if (t === 5 || t === 6) {
      const sx = 164 + s * .3;
      if (t === 5) p.push(`<rect x="${sx - 3.5}" y="46" width="7" height="238" rx="3.5" fill="${M('#3a2010', 'd')}" stroke="${OL}" stroke-width="1.2"/><path d="M${sx} 60 Q${sx - 14} 46 ${sx - 8} 28 M${sx} 60 Q${sx + 14} 46 ${sx + 8} 28" stroke="#b7791f" stroke-width="3" fill="none"/><g${an('av-float')}><circle cx="${sx}" cy="38" r="14" fill="${o.aura}" filter="url(#${id}g2)" opacity=".9"/><circle cx="${sx}" cy="38" r="9" fill="${shade(o.aura, 40)}"/><circle cx="${sx - 3}" cy="35" r="3" fill="#fff"/></g><g${an('av-spin')} fill="none" stroke="${shade(o.aura, 30)}" stroke-width="1.3" opacity=".9"><ellipse cx="${sx}" cy="38" rx="20" ry="6"/><ellipse cx="${sx}" cy="38" rx="6" ry="20"/></g>`);
      else p.push(`<rect x="${sx - 3.5}" y="60" width="7" height="224" rx="3.5" fill="${GOLD}" stroke="${OL}" stroke-width="1.2"/><path d="M${sx - 12} 64 Q${sx} 54 ${sx + 12} 64 L${sx + 8} 70 L${sx - 8} 70 Z" fill="${GOLD}" stroke="${OL}"/><g${an('av-float')}><path d="M${sx} 14 L${sx + 9} 40 L${sx} 60 L${sx - 9} 40 Z" fill="#a5f3fc" stroke="#ecfeff" stroke-width="1.5" filter="url(#${id}gl)"/></g>`);
    }

    /* acessórios de atributo no peito/cinto */
    if (lv('carreira') >= 5) p.push(`<path d="M104 112 l2.4 5 5.4 .7 -4 3.8 1 5.4 -4.8 -2.6 -4.8 2.6 1 -5.4 -4 -3.8 5.4 -.7 Z" fill="${lv('carreira') >= 10 ? GOLD : STEEL}" stroke="${OL}" stroke-width=".8"${lv('carreira') >= 10 ? ` filter="url(#${id}gl)"` : ''}/>`);
    if (lv('financas') >= 5) p.push(`<g stroke="${OL}" stroke-width="1.2"><path d="M138 172 q-9 5 -9 15 q0 8 12 8 q12 0 12 -8 q0 -10 -9 -15 Z" fill="${M('#8a5a12')}"/><path d="M137 172 h8" stroke="#f7c948" stroke-width="2.5"/></g><text x="141" y="190" font-size="9" text-anchor="middle" fill="#fde68a" font-weight="900">$</text>`);
    if (lv('saude') >= 10) p.push(`<path d="M120 174 l-5 -5 q-3 -4 1 -6 q3 -1 4 2 q1 -3 4 -2 q4 2 1 6 Z" fill="#ef4444" filter="url(#${id}gl)"/>`);

    /* ================= BRAÇOS ================= */
    const sleeveC = ['#cdbb98', '#2f6b45', '#4a3020', null, null, '#3b1a6e', '#f1f5f9', null][t];
    const armM = t === 3 ? STEEL : t === 4 ? DARK : t === 7 ? GOLD : M(sleeveC);
    const gaunt = t === 3 ? STEEL : t === 4 ? DARK : t === 7 ? GOLD : t === 1 || t === 2 || t === 0 ? M('#5b3a1f') : t === 5 ? M('#1e1236') : M('#e2e8f0');
    const handC = (t >= 3 && t !== 5 && t !== 6) ? null : SK;
    const hand = (x, y) => handC ? `<path d="M${x - 8} ${y - 6} h16 v7 q0 10 -8 10 q-8 0 -8 -10 Z" fill="${handC}" stroke="${OL}" stroke-width="1.3"/>` : `<path d="M${x - 8} ${y - 6} h16 v7 q0 10 -8 10 q-8 0 -8 -10 Z" fill="${gaunt}" stroke="${OL}" stroke-width="1.3"/>`;
    const upper = `<path d="M${78 - s} 102 Q${67 - s} 122 ${70 - s} 142 L${87 - s} 145 Q${88 - s} 124 ${95 - s} 106 Z" fill="${armM}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`;
    const fRest = `<path d="M${70 - s} 142 L${87 - s} 145 L${87 - s * .3} 180 L${71 - s * .3} 180 Z" fill="${gaunt}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`;
    const armRest = upper + fRest + hand(79 - s * .3, 186);
    const fGreat = `<path d="M${70 - s} 140 L${87 - s} 145 L118 168 L110 182 Z" fill="${gaunt}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`;
    const armGreat = upper + fGreat;

    // pauldrons (desenhados sobre o braço)
    const paul = () => {
      if (!(t === 3 || t === 4 || t === 7)) {
        if (t === 1) return `<path d="M${68 - s} 112 Q${70 - s} 96 ${90 - s} 98 Q${98 - s} 104 ${96 - s} 114 Q${82 - s} 120 ${68 - s} 112 Z" fill="${M('#7a4a24')}" stroke="${OL}" stroke-width="1.4"/>`;
        return '';
      }
      const pm = t === 3 ? STEEL : t === 4 ? DARK : GOLD;
      let g = `<g stroke="${OL}" stroke-width="1.4" stroke-linejoin="round">`;
      if (t >= 4) g += `<path d="M${74 - s} 98 L${66 - s} 74 L${84 - s} 94 Z" fill="${pm}"/><path d="M${86 - s} 94 L${86 - s} 70 L${96 - s} 94 Z" fill="${pm}"/>`;
      g += `<path d="M${60 - s} 116 Q${60 - s} 90 ${92 - s} 92 Q${104 - s} 96 ${102 - s} 110 Q${82 - s} 122 ${60 - s} 116 Z" fill="${pm}"/>
        <path d="M${61 - s} 116 Q${82 - s} 124 ${102 - s} 112 L${100 - s} 121 Q${80 - s} 132 ${63 - s} 125 Z" fill="${pm}"/>
        <path d="M${63 - s} 125 Q${80 - s} 133 ${99 - s} 122 L${97 - s} 130 Q${80 - s} 140 ${66 - s} 133 Z" fill="${pm}"/></g>
        <path d="M${66 - s} 104 Q${76 - s} 94 ${90 - s} 96" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>`;
      if (t >= 4) g += `<path d="M${62 - s} 116 Q${82 - s} 124 ${102 - s} 112" stroke="#f7c948" stroke-width="2" fill="none"/>`;
      if (t === 7) g += `<circle cx="${80 - s}" cy="104" r="3.5" fill="#f97316" stroke="#fff7d6"/>`;
      return g;
    };

    if (pose === 'rest' || pose === 'shield') { p.push(armRest); p.push(mirror(armRest)); }
    if (pose === 'great') { p.push(armGreat); p.push(mirror(armGreat)); }
    if (pose === 'cast') {
      const raise = `<path d="M${78 - s} 102 Q${66 - s} 120 ${64 - s} 140 L${80 - s} 146 Q${86 - s} 124 ${95 - s} 106 Z" fill="${armM}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/><path d="M${64 - s} 140 L${80 - s} 146 L72 112 L58 112 Z" fill="${gaunt}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/><path d="M57 114 q-2 -12 8 -14 q10 2 8 14 Z" fill="${SK}" stroke="${OL}" stroke-width="1.3"/>`;
      p.push(raise); p.push(mirror(armRest));
      const oc = t === 6 ? '#5eead4' : o.aura;
      p.push(`<g${an('av-float')}><circle cx="65" cy="90" r="16" fill="${oc}" filter="url(#${id}g2)" opacity=".9"/><circle cx="65" cy="90" r="8" fill="${shade(oc, 55)}"/><circle cx="65" cy="90" r="4" fill="#fff"/></g><g${an('av-spin')} fill="none" stroke="${shade(oc, 40)}" stroke-width="1.2"><circle cx="65" cy="90" r="13" stroke-dasharray="2 4"/></g>`);
    }
    p.push(paul()); p.push(mirror(paul()));

    /* ================= ESCUDO / MONTANTE ================= */
    if (pose === 'shield') p.push(`<g stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"><path d="M50 128 Q72 118 94 128 L92 176 Q86 206 72 222 Q58 206 52 176 Z" fill="${STEEL}"/><path d="M56 132 Q72 125 88 132 L87 175 Q82 199 72 212 Q62 199 57 175 Z" fill="${M('#1e40af')}"/></g><path d="M72 140 L72 200 M60 158 L84 158" stroke="#e2e8f0" stroke-width="5"/><path d="M58 134 Q66 130 74 131" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`);
    if (pose === 'great') {
      const bl = t === 7 ? `url(#${id}fl)` : STEEL, gm = t === 7 ? GOLD : DARK;
      if (t === 7) p.push(`<path d="M114 182 L126 182 L122 282 L118 282 Z" fill="#fbbf24" filter="url(#${id}g2)" opacity=".85"/>`);
      p.push(`<g stroke="${OL}" stroke-width="1.4" stroke-linejoin="round"><path d="M113 184 L127 184 L124 270 L120 284 L116 270 Z" fill="${bl}"/><path d="M92 176 Q120 168 148 176 L146 184 Q120 178 94 184 Z" fill="${gm}"/><rect x="116" y="152" width="8" height="24" rx="2" fill="${M('#3b2414')}"/><circle cx="120" cy="150" r="6" fill="${gm}"/></g><path d="M120 186 L120 272" stroke="#fff" stroke-width="1.2" opacity=".8"/>`);
      if (t >= 4) p.push(`<circle cx="120" cy="178" r="3" fill="${t === 7 ? '#f97316' : '#ef4444'}"/>`);
      p.push(hand(113, 172) + hand(127, 172));
    }

    /* ================= CABEÇA ================= */
    p.push(`<path d="M111 76 L129 76 L131 96 L109 96 Z" fill="${SKd}" stroke="${OL}" stroke-width="1.3"/>`);
    p.push(`<ellipse cx="100.5" cy="60" rx="4" ry="6" fill="${SKd}" stroke="${OL}" stroke-width="1.2"/><ellipse cx="139.5" cy="60" rx="4" ry="6" fill="${SKd}" stroke="${OL}" stroke-width="1.2"/>`);
    p.push(`<path d="M101 50 Q101 32 120 31 Q139 32 139 50 L139 62 Q138 75 129 82 Q120 87 111 82 Q102 75 101 62 Z" fill="url(#${id}fc)" stroke="${OL}" stroke-width="1.6"/>`);
    p.push(`<path d="M133 50 Q139 62 134 74 Q130 80 124 84 Q132 72 133 50 Z" fill="${SKd}" opacity=".45"/>`);

    /* rosto */
    const m = o.mood, glow = t >= 6;
    const iris = glow ? (t === 7 ? '#fbbf24' : '#5eead4') : '#2b1d14';
    let eyes = `<path d="M106 60 Q112 55.5 118 60 Q112 63.5 106 60 Z" fill="#fff"/><path d="M122 60 Q128 55.5 134 60 Q128 63.5 122 60 Z" fill="#fff"/><circle cx="112" cy="59.8" r="2.3" fill="${iris}"/><circle cx="128" cy="59.8" r="2.3" fill="${iris}"/>`;
    if (glow) eyes += `<g filter="url(#${id}gl)"><circle cx="112" cy="59.8" r="2" fill="${iris}"/><circle cx="128" cy="59.8" r="2" fill="${iris}"/></g>`;
    if (m === 'cansado' || m === 'exausto') eyes += `<path d="M105 60 Q112 54 119 60 L119 58 Q112 53 105 58 Z" fill="${SK}"/><path d="M121 60 Q128 54 135 60 L135 58 Q128 53 121 58 Z" fill="${SK}"/><path d="M105 59.5 Q112 57.5 119 59.5 M121 59.5 Q128 57.5 135 59.5" stroke="${OL}" stroke-width="1.4"/><path d="M107 65 q5 2 10 0 M123 65 q5 2 10 0" stroke="${SKd}" stroke-width="1.2" fill="none"/>`;
    else eyes += `<path d="M105.5 60 Q112 55 118.5 60 M121.5 60 Q128 55 134.5 60" stroke="${OL}" stroke-width="1.5" fill="none"/>`;
    p.push(`<g${an('av-blink')}>${eyes}</g>`);
    const brows = m === 'exausto' ? ['M104 52 L118 54.5 L118 56.5 L104 55 Z', 'M136 52 L122 54.5 L122 56.5 L136 55 Z'] : ['M104 53 L118 55.5 L118 58 L105 56 Z', 'M136 53 L122 55.5 L122 58 L135 56 Z'];
    p.push(`<path d="${brows[0]}" fill="${HCd}"/><path d="${brows[1]}" fill="${HCd}"/>`);
    p.push(`<path d="M120 61 L117.5 70 Q120 71.5 122.5 70" stroke="${SKd}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`);
    const mouth = { feliz: 'M112.5 75 Q121 79 128.5 73.5', ok: 'M114 75.5 L127 75', cansado: 'M114 76.5 Q120 75 127 76.5', exausto: 'M113.5 77.5 Q120 73 126.5 77.5' }[m] || 'M114 75.5 L127 75';
    p.push(`<path d="${mouth}" stroke="#5a2a22" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
    if (m === 'exausto') p.push(`<path d="M138 44 q4 7 0 10 q-4 -3 0 -10" fill="#7dd3fc"/>`);

    /* barba */
    if (o.beard === 'barba') p.push(`<path d="M101 60 Q101 84 120 90 Q139 84 139 60 Q136 72 128 74 Q124 70 120 71 Q116 70 112 74 Q104 72 101 60 Z" fill="${HC}" stroke="${OL}" stroke-width="1.2"/><path d="M112.5 76 Q121 ${m === 'feliz' ? 80 : 78} 128.5 75" stroke="#3a1a14" stroke-width="1.6" fill="none"/><path d="M106 72 q3 6 2 10 M134 72 q-3 6 -2 10" stroke="${HCl}" stroke-width="1" fill="none" opacity=".6"/>`);
    if (o.beard === 'cavanhaque') p.push(`<path d="M111 72 Q120 68 129 72 Q124 71 120 71.5 Q116 71 111 72 Z" fill="${HC}"/><path d="M114 79 Q120 90 126 79 Q120 82 114 79 Z" fill="${HC}" stroke="${OL}" stroke-width="1"/>`);
    if (o.beard === 'bigode') p.push(`<path d="M109 73.5 Q115 68.5 120 71 Q125 68.5 131 73.5 Q125 72 120 73.5 Q115 72 109 73.5 Z" fill="${HC}" stroke="${OL}" stroke-width=".8"/>`);

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
    p.push(H[o.hair] || H.curto);

    /* coroa (Lenda) */
    if (t === 7) p.push(`<g filter="url(#${id}gl)" stroke="${OL}" stroke-width="1.2" stroke-linejoin="round"><path d="M100 40 L102 18 L110 32 L114 10 L120 28 L126 10 L130 32 L138 18 L140 40 Q120 34 100 40 Z" fill="${GOLD}"/></g><circle cx="120" cy="34" r="3" fill="#ef4444"/><circle cx="108" cy="36" r="2" fill="#38bdf8"/><circle cx="132" cy="36" r="2" fill="#38bdf8"/>`);
    if (t === 4) p.push(`<path d="M100 46 Q120 38 140 46" stroke="#7f1d1d" stroke-width="3" fill="none"/>`);

    /* ================= FLUTUANTES ================= */
    if (lv('mente') >= 5) {
      const g = lv('mente') >= 10;
      p.push(`<g${an('av-float')}><g transform="translate(18 132) rotate(-14)"${g ? ` filter="url(#${id}gl)"` : ''}><path d="M0 0 L18 -5 L36 0 L36 24 L18 19 L0 24 Z" fill="${g ? '#7c3aed' : '#4338ca'}" stroke="${OL}" stroke-width="1.4"/><path d="M3 2 L18 -2 L33 2 L33 21 L18 17 L3 21 Z" fill="#f5f3ff"/><path d="M18 -2 L18 17" stroke="${OL}"/><path d="M6 6 h9 M6 10 h9 M21 6 h9 M21 10 h9" stroke="${g ? '#a855f7' : '#6366f1'}" stroke-width="1.3"/></g></g>`);
    }
    if (lv('proposito') >= 5) p.push(`<g${an('av-float2')}><circle cx="206" cy="64" r="10" fill="#5eead4" filter="url(#${id}g2)"/><circle cx="206" cy="64" r="4" fill="#fff"/></g>`);
    if (lv('financas') >= 10) p.push(`<g${an('av-float2')}>${[[210, 132], [222, 154], [206, 174]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="7" fill="${GOLD}" stroke="${OL}"/><text x="${c[0]}" y="${c[1] + 3}" font-size="8" text-anchor="middle" fill="#7c4a03" font-weight="900">$</text>`).join('')}</g>`);
    if (t === 6) p.push(`<g${an('av-float')} fill="none" stroke="#5eead4" stroke-width="1.8" filter="url(#${id}gl)" opacity=".9"><path d="M26 110 l8 -10 l8 10 l-8 10 Z"/><path d="M204 118 h12 M210 112 v12"/><circle cx="34" cy="214" r="6"/><path d="M200 220 l10 -6 v12 Z"/></g>`);

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

  return { render, tierOf, TIERS, SKINS, HAIRC, HAIRS, BEARDS, shade };
})();
