/* Avatar SVG procedural — evolui por estágio (nível) e por atributos (áreas da vida) */
const AV = (() => {
  let uid = 0;
  const SKINS = ['#f7dcc8', '#ecc3a3', '#d6a079', '#b07548', '#7d4e2d', '#4f301c'];
  const HAIRC = ['#1b1612', '#4a2c17', '#8b5a2b', '#d6a85c', '#a3a3a3', '#e7e5e4', '#7f1d1d'];
  const HAIRS = [['curto', 'Curto'], ['social', 'Social'], ['cacheado', 'Cacheado'], ['longo', 'Longo'], ['calvo', 'Entradas'], ['raspado', 'Raspado']];
  const BEARDS = [['nenhuma', 'Sem barba'], ['barba', 'Barba'], ['cavanhaque', 'Cavanhaque'], ['bigode', 'Bigode']];
  const TIERS = [
    { n: 'Aprendiz', min: 1, d: 'Túnica de linho. Toda lenda começa aqui.' },
    { n: 'Iniciado', min: 5, d: 'Túnica verde, cinto e bolsa de viagem.' },
    { n: 'Desbravador', min: 10, d: 'Manto de viajante e cajado de madeira.' },
    { n: 'Guerreiro', min: 15, d: 'Peitoral de aço, escudo e espada.' },
    { n: 'Campeão', min: 20, d: 'Capa escarlate e acabamentos em ouro.' },
    { n: 'Mestre', min: 30, d: 'Manto arcano e cajado com orbe de poder.' },
    { n: 'Sábio', min: 40, d: 'Vestes brancas, auréola e runas flutuantes.' },
    { n: 'Lenda', min: 50, d: 'Armadura dourada, coroa e asas de luz.' }
  ];
  const tierOf = lvl => { let t = 0; TIERS.forEach((x, i) => { if (lvl >= x.min) t = i; }); return t; };

  function shade(hex, p) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.max(0, Math.min(255, Math.round(p < 0 ? v * (1 + p / 100) : v + (255 - v) * (p / 100))));
    return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function render(o) {
    o = Object.assign({ tier: 0, skin: SKINS[1], hair: 'curto', hairColor: HAIRC[1], beard: 'nenhuma', glasses: false, mood: 'feliz', areas: {}, aura: '#7c5cff', anim: true }, o);
    const id = 'av' + (++uid), t = o.tier, A = o.areas;
    const lv = k => A[k] || 1;
    const s = Math.min(9, Math.floor((lv('saude') - 1) * 0.9)); // ombros mais largos com Vigor
    const SK = o.skin, SKd = shade(SK, -18), HC = o.hairColor, HCd = shade(HC, -25);
    const an = c => o.anim ? ` class="${c}"` : '';
    const L = 84 - s, R = 156 + s;
    let p = [];

    /* ---------- defs ---------- */
    p.push(`<defs>
      <radialGradient id="${id}au" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${o.aura}" stop-opacity="${(0.25 + t * 0.08).toFixed(2)}"/><stop offset=".55" stop-color="${o.aura}" stop-opacity="${(0.08 + t * 0.04).toFixed(2)}"/><stop offset="1" stop-color="${o.aura}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}mt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8fafc"/><stop offset=".5" stop-color="#94a3b8"/><stop offset="1" stop-color="#e2e8f0"/></linearGradient>
      <linearGradient id="${id}gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff7d6"/><stop offset=".45" stop-color="#f59e0b"/><stop offset="1" stop-color="#fde68a"/></linearGradient>
      <linearGradient id="${id}rp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#3b1680"/></linearGradient>
      <linearGradient id="${id}rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c7d2e0"/></linearGradient>
      <linearGradient id="${id}wg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff7d6" stop-opacity=".95"/></linearGradient>
      <radialGradient id="${id}hd" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="${shade(SK, 8)}"/><stop offset="1" stop-color="${SKd}"/></radialGradient>
      <filter id="${id}gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`);

    /* ---------- aura + partículas ---------- */
    p.push(`<g${an('av-aura')}><circle cx="120" cy="165" r="${100 + t * 4}" fill="url(#${id}au)"/></g>`);
    p.push(`<ellipse cx="120" cy="283" rx="${58 + s}" ry="9" fill="#000" opacity=".35"/>`);
    if (t >= 3) {
      for (let i = 0; i < t * 2; i++) {
        const x = 45 + ((i * 53) % 150), d = (i * 0.61) % 4;
        p.push(`<circle cx="${x}" cy="${250 - (i % 3) * 20}" r="${1.4 + (i % 3) * .7}" fill="${t === 7 ? '#fde68a' : o.aura}" ${o.anim ? `class="av-p" style="animation-delay:${d.toFixed(2)}s"` : 'opacity=".6"'}/>`);
      }
    }

    /* ---------- asas de luz ---------- */
    if (t === 7 || lv('proposito') >= 10) {
      const op = t === 7 ? 1 : .55;
      const wing = side => {
        const m = side < 0 ? '' : ` transform="translate(240,0) scale(-1,1)"`;
        let f = '';
        for (let i = 0; i < 5; i++) f += `<path d="M110 140 Q${60 - i * 8} ${100 + i * 12} ${18 + i * 6} ${96 + i * 22} Q${62 - i * 4} ${132 + i * 10} 112 ${158 + i * 4} Z" fill="url(#${id}wg)" opacity="${(0.9 - i * 0.12).toFixed(2)}"/>`;
        return `<g${m}>${f}</g>`;
      };
      p.push(`<g${an('av-wing')} opacity="${op}" filter="url(#${id}gl)">${wing(-1)}${wing(1)}</g>`);
    }

    /* ---------- capa / manto (atrás) ---------- */
    if (t === 2) p.push(`<path d="M90 130 L150 130 L166 236 Q120 246 74 236 Z" fill="#5b3415"/><path d="M90 130 L150 130 L158 150 Q120 158 82 150 Z" fill="#6f4019"/>`);
    if (t === 4) p.push(`<path d="M${L + 4} 130 L${R - 4} 130 L${180 + s} 278 Q120 292 ${60 - s} 278 Z" fill="#b91c1c"/><path d="M${L + 4} 130 L${R - 4} 130 L${180 + s} 278 Q120 292 ${60 - s} 278 Z" fill="none" stroke="#fbbf24" stroke-width="2.5"/>`);
    if (t === 7) p.push(`<path d="M${L + 4} 130 L${R - 4} 130 L${184 + s} 280 Q120 294 ${56 - s} 280 Z" fill="#f8fafc"/><path d="M${L + 4} 130 L${R - 4} 130 L${184 + s} 280 Q120 294 ${56 - s} 280 Z" fill="none" stroke="url(#${id}gd)" stroke-width="4"/>`);

    /* ---------- cabelo de trás ---------- */
    if (o.hair === 'longo') p.push(`<path d="M84 86 Q82 48 120 48 Q158 48 156 86 L160 130 Q150 136 142 128 L142 92 L98 92 L98 128 Q90 136 80 130 Z" fill="${HCd}"/>`);

    /* ---------- pernas / botas ---------- */
    const robe = t === 5 || t === 6;
    const pants = ['#6b5b45', '#374151', '#3f3f2e', '#1f2937', '#1f2937', '#2e1065', '#94a3b8', '#78350f'][t];
    const boots = ['#4a3b2a', '#5b3a1f', '#4a2a12', `url(#${id}mt)`, `url(#${id}mt)`, '#1e1b4b', '#e2e8f0', `url(#${id}gd)`][t];
    if (!robe) p.push(`<rect x="96" y="206" width="21" height="62" rx="7" fill="${pants}"/><rect x="123" y="206" width="21" height="62" rx="7" fill="${pants}"/>`);
    p.push(`<path d="M92 ${t >= 2 ? 250 : 264} h26 v14 q0 4 -4 4 h-22 q-6 0 -6 -6 Z" fill="${boots}"/><path d="M122 ${t >= 2 ? 250 : 264} h26 v12 q0 6 -6 6 h-16 q-4 0 -4 -4 Z" fill="${boots}"/>`);

    /* ---------- itens na mão direita (atrás da mão) ---------- */
    if (t === 2) p.push(`<path d="M171 90 Q168 180 170 282" stroke="#8b5a2b" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M171 90 q10 -8 6 -18 q-10 4 -6 18" fill="#4ade80"/>`);
    if (t === 3 || t === 4 || t === 7) {
      const bl = t === 7 ? `url(#${id}gd)` : `url(#${id}mt)`;
      p.push(`<g${t === 7 ? ` filter="url(#${id}gl)"` : ''}><path d="M166 200 L166 92 L172 80 L178 92 L178 200 Z" fill="${bl}" stroke="#64748b" stroke-width="1"/><rect x="156" y="198" width="32" height="7" rx="3" fill="${t >= 4 ? '#f59e0b' : '#475569'}"/><rect x="168" y="204" width="8" height="18" rx="2" fill="#3f2a14"/><circle cx="172" cy="225" r="4.5" fill="${t >= 4 ? '#f59e0b' : '#64748b'}"/></g>`);
    }
    if (t === 5 || t === 6) {
      const wood = t === 5 ? '#3b2412' : '#e2e8f0';
      p.push(`<path d="M172 70 L172 282" stroke="${wood}" stroke-width="7" stroke-linecap="round"/><path d="M162 72 Q172 52 182 72" stroke="${t === 5 ? '#f59e0b' : '#14b8a6'}" stroke-width="3" fill="none"/>`);
      if (t === 5) p.push(`<g${an('av-float')}><circle cx="172" cy="56" r="11" fill="${o.aura}" filter="url(#${id}gl)"/><circle cx="168" cy="52" r="3.5" fill="#fff" opacity=".8"/></g>`);
      else p.push(`<g${an('av-float')}><path d="M172 34 L182 54 L172 72 L162 54 Z" fill="#a5f3fc" stroke="#ecfeff" stroke-width="1.5" filter="url(#${id}gl)"/></g>`);
    }

    /* ---------- tronco por estágio ---------- */
    const torso = `M${L} 132 Q120 122 ${R} 132 L152 212 L88 212 Z`;
    const robeP = `M${L} 132 Q120 122 ${R} 132 L168 270 Q120 280 72 270 Z`;
    if (t === 0) {
      p.push(`<path d="${torso}" fill="#b8a98f"/><path d="M110 128 L120 150 L130 128" fill="none" stroke="#8f7f63" stroke-width="2"/><path d="M90 196 Q120 202 150 196" stroke="#8b6b3d" stroke-width="4" fill="none"/><path d="M134 199 l4 14 M138 199 l6 12" stroke="#8b6b3d" stroke-width="2.5"/>`);
    } else if (t === 1) {
      p.push(`<path d="${torso}" fill="#2f855a"/><path d="M${L + 6} 136 L150 200" stroke="#6b3e1e" stroke-width="6"/><rect x="88" y="190" width="64" height="9" rx="3" fill="#6b3e1e"/><rect x="114" y="189" width="12" height="11" rx="2" fill="none" stroke="#fbbf24" stroke-width="2.5"/><rect x="140" y="196" width="22" height="20" rx="5" fill="#7c4a1e"/><path d="M140 202 h22" stroke="#5b3415" stroke-width="2"/>`);
    } else if (t === 2) {
      p.push(`<path d="${torso}" fill="#4d7c0f"/><path d="M${L + 8} 134 Q120 128 ${R - 8} 134 L146 206 L94 206 Z" fill="#7c4a1e"/><path d="M120 134 L120 206" stroke="#5b3415" stroke-width="2"/><circle cx="120" cy="150" r="2.5" fill="#fbbf24"/><circle cx="120" cy="168" r="2.5" fill="#fbbf24"/><rect x="88" y="192" width="64" height="9" rx="3" fill="#3f2a14"/><path d="M${L + 2} 128 Q120 146 ${R - 2} 128 L${R - 8} 140 Q120 156 ${L + 8} 140 Z" fill="#6f4019"/>`);
    } else if (t === 3 || t === 4 || t === 7) {
      const plate = t === 7 ? `url(#${id}gd)` : `url(#${id}mt)`;
      const tab = t === 7 ? '#f8fafc' : t === 4 ? '#1e3a8a' : '#1e40af';
      p.push(`<path d="${torso}" fill="#64748b"/><path d="M96 168 L144 168 L148 216 L132 230 L108 230 L92 216 Z" fill="${tab}"/>`);
      p.push(`<path d="M${L + 6} 134 Q120 126 ${R - 6} 134 L148 176 Q120 190 92 176 Z" fill="${plate}" stroke="${t === 7 ? '#b45309' : '#64748b'}" stroke-width="1.2"/><path d="M120 132 L120 182" stroke="${t === 7 ? '#b45309' : '#94a3b8'}" stroke-width="1.5"/>`);
      if (t >= 4) p.push(`<path d="M${L + 6} 134 Q120 126 ${R - 6} 134" stroke="#fbbf24" stroke-width="3" fill="none"/><path d="M96 168 L144 168" stroke="#fbbf24" stroke-width="2.5"/>`);
      if (t === 7) p.push(`<circle cx="120" cy="152" r="7" fill="#38bdf8" stroke="#fde68a" stroke-width="2.5" filter="url(#${id}gl)"/>`);
      p.push(`<rect x="90" y="196" width="60" height="8" rx="3" fill="${t === 7 ? '#92400e' : '#1f2937'}"/>`);
    } else if (t === 5) {
      p.push(`<path d="${robeP}" fill="url(#${id}rp)"/><path d="M120 128 L120 276" stroke="#fbbf24" stroke-width="5"/><path d="M74 266 Q120 276 166 266" stroke="#fbbf24" stroke-width="3" fill="none"/><path d="M${L + 4} 134 Q120 150 ${R - 4} 134" stroke="#fbbf24" stroke-width="3" fill="none"/><path d="M90 190 Q120 200 150 190 L146 200 Q120 210 94 200 Z" fill="#f59e0b"/><path d="M140 198 l6 26 l-8 -2 Z" fill="#f59e0b"/>`);
    } else if (t === 6) {
      p.push(`<path d="${robeP}" fill="url(#${id}rw)"/><path d="M120 128 L120 276" stroke="#14b8a6" stroke-width="5"/><path d="M74 266 Q120 276 166 266" stroke="#14b8a6" stroke-width="3" fill="none"/><path d="M${L + 4} 134 Q120 150 ${R - 4} 134" stroke="#14b8a6" stroke-width="3" fill="none"/><path d="M90 190 Q120 200 150 190 L146 200 Q120 210 94 200 Z" fill="#0d9488"/>`);
    }

    /* ---------- acessórios de atributo no corpo ---------- */
    if (lv('carreira') >= 5) {
      const c = lv('carreira') >= 10 ? `url(#${id}gd)` : `url(#${id}mt)`;
      p.push(`<path d="M138 146 l2.6 5.4 5.9 .8 -4.3 4.1 1 5.9 -5.2 -2.8 -5.2 2.8 1 -5.9 -4.3 -4.1 5.9 -.8 Z" fill="${c}" stroke="#78350f" stroke-width=".6"/>`);
    }
    if (lv('financas') >= 5) p.push(`<path d="M94 198 q-8 4 -8 14 q0 8 12 8 q12 0 12 -8 q0 -10 -8 -14 Z" fill="#a16207"/><path d="M94 198 h8" stroke="#fbbf24" stroke-width="2.5"/><text x="98" y="215" font-size="9" text-anchor="middle" fill="#fde68a" font-weight="900">$</text>`);
    if (lv('saude') >= 10) p.push(`<path d="M104 150 c-4 -6 -12 -2 -9 4 l9 8 9 -8 c3 -6 -5 -10 -9 -4 Z" fill="#ef4444" filter="url(#${id}gl)"/>`);

    /* ---------- braços ---------- */
    const sleeve = ['#b8a98f', '#2f855a', '#4d7c0f', '#64748b', '#64748b', '#6d28d9', '#e2e8f0', '#64748b'][t];
    const sw = robe ? 22 : 17;
    p.push(`<path d="M${L + 3} 138 Q${L - 8} 172 76 202" stroke="${sleeve}" stroke-width="${sw}" fill="none" stroke-linecap="round"/><path d="M${R - 3} 138 Q${R + 8} 172 164 202" stroke="${sleeve}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`);
    if (t === 3 || t === 4 || t === 7) {
      const pl = t === 7 ? `url(#${id}gd)` : `url(#${id}mt)`;
      p.push(`<ellipse cx="${L + 2}" cy="136" rx="17" ry="11" fill="${pl}" stroke="${t === 7 ? '#b45309' : '#64748b'}"/><ellipse cx="${R - 2}" cy="136" rx="17" ry="11" fill="${pl}" stroke="${t === 7 ? '#b45309' : '#64748b'}"/>`);
      if (t === 7) p.push(`<circle cx="${L + 2}" cy="136" r="3.5" fill="#38bdf8"/><circle cx="${R - 2}" cy="136" r="3.5" fill="#38bdf8"/>`);
    }
    if (t === 5 || t === 6) p.push(`<path d="M66 196 l20 -6 l2 16 l-22 4 Z" fill="${t === 5 ? '#fbbf24' : '#14b8a6'}"/><path d="M174 196 l-20 -6 l-2 16 l22 4 Z" fill="${t === 5 ? '#fbbf24' : '#14b8a6'}"/>`);
    p.push(`<circle cx="76" cy="206" r="9" fill="${SK}"/><circle cx="164" cy="206" r="9" fill="${SK}"/>`);

    /* ---------- escudo (mão esquerda) ---------- */
    if (t === 3 || t === 4 || t === 7) {
      const fill = t === 7 ? `url(#${id}gd)` : t === 4 ? '#1e3a8a' : '#1e40af';
      const rim = t >= 4 ? '#fbbf24' : '#cbd5e1';
      p.push(`<g><path d="M52 176 Q72 168 92 176 L90 210 Q84 232 72 240 Q60 232 54 210 Z" fill="${fill}" stroke="${rim}" stroke-width="3.5"/><path d="M72 186 l3.5 7.4 8 1.1 -5.8 5.6 1.4 8 -7.1 -3.8 -7.1 3.8 1.4 -8 -5.8 -5.6 8 -1.1 Z" fill="${t === 7 ? '#fff' : rim}"/></g>`);
    }

    /* ---------- cabeça ---------- */
    p.push(`<rect x="111" y="112" width="18" height="18" rx="5" fill="${SKd}"/>`);
    p.push(`<circle cx="86" cy="92" r="6" fill="${SKd}"/><circle cx="154" cy="92" r="6" fill="${SKd}"/>`);
    p.push(`<circle cx="120" cy="88" r="34" fill="url(#${id}hd)"/>`);

    /* ---------- rosto ---------- */
    const m = o.mood;
    let eyes = '';
    if (m === 'feliz') eyes = `<circle cx="107" cy="90" r="4" fill="#1e1b2e"/><circle cx="133" cy="90" r="4" fill="#1e1b2e"/><circle cx="108.5" cy="88.5" r="1.4" fill="#fff"/><circle cx="134.5" cy="88.5" r="1.4" fill="#fff"/>`;
    else if (m === 'ok') eyes = `<circle cx="107" cy="91" r="3.5" fill="#1e1b2e"/><circle cx="133" cy="91" r="3.5" fill="#1e1b2e"/><circle cx="108" cy="90" r="1.1" fill="#fff"/><circle cx="134" cy="90" r="1.1" fill="#fff"/>`;
    else eyes = `<path d="M102 91 q5 3 10 0" stroke="#1e1b2e" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M128 91 q5 3 10 0" stroke="#1e1b2e" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M102 97 q5 3 10 0 M128 97 q5 3 10 0" stroke="${SKd}" stroke-width="1.6" fill="none"/>`;
    p.push(`<g${an('av-blink')}>${eyes}</g>`);
    const brow = m === 'feliz' ? ['M100 80 q7 -5 14 -1', 'M126 79 q7 -4 14 1'] : m === 'ok' ? ['M100 81 h14', 'M126 81 h14'] : ['M100 79 q7 4 14 3', 'M126 82 q7 1 14 -3'];
    p.push(`<path d="${brow[0]}" stroke="${HCd}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="${brow[1]}" stroke="${HCd}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    const mouth = { feliz: 'M108 104 Q120 116 132 104', ok: 'M110 107 Q120 111 130 107', cansado: 'M111 109 L129 109', exausto: 'M109 112 Q120 104 131 112' }[m] || 'M110 107 Q120 111 130 107';
    if (m === 'feliz') p.push(`<path d="M108 104 Q120 117 132 104 Z" fill="#7f1d1d"/><path d="M111 105 h18" stroke="#fff" stroke-width="2.5"/>`);
    p.push(`<path d="${mouth}" stroke="#4a1d1d" stroke-width="2.6" fill="none" stroke-linecap="round"/>`);
    if (m === 'feliz' || m === 'ok') p.push(`<ellipse cx="100" cy="102" rx="6" ry="3.5" fill="#f43f5e" opacity=".22"/><ellipse cx="140" cy="102" rx="6" ry="3.5" fill="#f43f5e" opacity=".22"/>`);
    if (m === 'exausto') p.push(`<path d="M150 70 q5 9 0 12 q-5 -3 0 -12" fill="#7dd3fc"/>`);
    p.push(`<path d="M119 94 q-3 6 1 8" stroke="${SKd}" stroke-width="2" fill="none" stroke-linecap="round"/>`);

    /* ---------- barba ---------- */
    if (o.beard === 'barba') p.push(`<path d="M87 94 Q88 126 120 128 Q152 126 153 94 Q148 108 136 110 Q128 102 120 104 Q112 102 104 110 Q92 108 87 94 Z" fill="${HC}"/><path d="M108 104 Q120 ${m === 'feliz' ? 114 : 110} 132 104" stroke="#4a1d1d" stroke-width="2.2" fill="none"/>`);
    if (o.beard === 'cavanhaque') p.push(`<path d="M106 102 Q120 96 134 102 Q128 100 120 101 Q112 100 106 102 Z" fill="${HC}"/><path d="M112 114 Q120 126 128 114 Q120 118 112 114 Z" fill="${HC}"/>`);
    if (o.beard === 'bigode') p.push(`<path d="M104 103 Q112 96 120 101 Q128 96 136 103 Q128 101 120 104 Q112 101 104 103 Z" fill="${HC}"/>`);

    /* ---------- óculos ---------- */
    if (o.glasses) p.push(`<g fill="rgba(186,230,253,.18)" stroke="#111827" stroke-width="2.2"><rect x="97" y="82" width="20" height="16" rx="5"/><rect x="123" y="82" width="20" height="16" rx="5"/></g><path d="M117 89 h6 M97 88 l-9 -2 M143 88 l9 -2" stroke="#111827" stroke-width="2.2"/>`);

    /* ---------- cabelo frente ---------- */
    const hairF = {
      curto: `<path d="M85 86 Q83 50 120 50 Q157 50 155 86 Q152 68 136 64 Q118 72 100 66 Q88 72 85 86 Z" fill="${HC}"/>`,
      social: `<path d="M85 88 Q82 50 118 49 Q156 48 156 84 Q154 70 144 64 Q124 58 104 66 Q92 70 85 88 Z" fill="${HC}"/><path d="M104 66 Q118 56 140 60" stroke="${HCd}" stroke-width="2" fill="none"/>`,
      cacheado: [[96, 60, 11], [110, 52, 12], [126, 51, 12], [141, 58, 11], [151, 70, 9], [89, 72, 9], [103, 63, 8], [134, 62, 8]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${HC}"/>`).join(''),
      longo: `<path d="M85 88 Q82 48 120 48 Q158 48 155 88 Q150 66 132 62 Q112 70 98 64 Q88 72 85 88 Z" fill="${HC}"/>`,
      calvo: `<path d="M86 94 Q84 72 94 64 L97 90 Z M154 94 Q156 72 146 64 L143 90 Z" fill="${HC}"/>`,
      raspado: `<path d="M86 86 Q84 52 120 52 Q156 52 154 86 Q150 64 120 60 Q90 64 86 86 Z" fill="${HC}" opacity=".55"/>`
    };
    p.push(hairF[o.hair] || hairF.curto);

    /* ---------- adornos de cabeça ---------- */
    if (t === 3) p.push(`<path d="M86 70 Q120 58 154 70 L154 75 Q120 64 86 75 Z" fill="#1e40af"/>`);
    if (t === 6) p.push(`<g${an('av-spin')}><ellipse cx="120" cy="42" rx="28" ry="7" fill="none" stroke="#fde68a" stroke-width="3.5" filter="url(#${id}gl)"/></g>`);
    if (t === 7) p.push(`<g filter="url(#${id}gl)"><path d="M90 62 L94 36 L106 52 L120 30 L134 52 L146 36 L150 62 Z" fill="url(#${id}gd)" stroke="#b45309" stroke-width="1.2"/><circle cx="120" cy="50" r="4" fill="#ef4444"/><circle cx="102" cy="55" r="2.6" fill="#38bdf8"/><circle cx="138" cy="55" r="2.6" fill="#38bdf8"/></g>`);

    /* ---------- elementos flutuantes ---------- */
    if (lv('mente') >= 5) {
      const gl = lv('mente') >= 10;
      p.push(`<g${an('av-float')}><g transform="translate(34 148) rotate(-12)"${gl ? ` filter="url(#${id}gl)"` : ''}><path d="M0 0 L16 -4 L32 0 L32 22 L16 18 L0 22 Z" fill="${gl ? '#c4b5fd' : '#e0e7ff'}" stroke="#4338ca" stroke-width="1.5"/><path d="M16 -4 L16 18" stroke="#4338ca" stroke-width="1.5"/><path d="M4 5 h8 M4 10 h8 M20 5 h8 M20 10 h8" stroke="#6366f1" stroke-width="1.2"/></g></g>`);
    }
    if (lv('proposito') >= 5) p.push(`<g${an('av-float2')}><circle cx="204" cy="82" r="8" fill="#5eead4" filter="url(#${id}gl)" opacity=".9"/><circle cx="202" cy="80" r="3" fill="#fff"/></g>`);
    if (lv('financas') >= 10) p.push(`<g${an('av-float2')}>${[[208, 150], [218, 172], [200, 190]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="7" fill="url(#${id}gd)" stroke="#b45309"/><text x="${c[0]}" y="${c[1] + 3}" font-size="8" text-anchor="middle" fill="#92400e" font-weight="900">$</text>`).join('')}</g>`);
    if (t === 6) p.push(`<g${an('av-float')} fill="none" stroke="#5eead4" stroke-width="2" filter="url(#${id}gl)" opacity=".85"><path d="M30 110 l8 -10 l8 10 l-8 10 Z"/><path d="M200 120 h12 M206 114 v12"/><circle cx="40" cy="220" r="6"/><path d="M196 228 l10 -6 l0 12 Z"/></g>`);

    /* ---------- companheiro (Relações) ---------- */
    const rel = lv('relacoes');
    if (rel >= 5) {
      const st = rel >= 15 ? 3 : rel >= 10 ? 2 : 1, sc = [0, .9, 1.05, 1.15][st];
      const fur = st === 3 ? '#fb923c' : '#f97316';
      p.push(`<g transform="translate(200 268) scale(${sc})"${st === 3 ? ` filter="url(#${id}gl)"` : ''}>
        <g${an('av-tail')} style="transform-box:fill-box;transform-origin:0% 100%"><path d="M10 -2 Q36 -8 32 -30 Q26 -12 8 -8 Z" fill="${fur}"/><path d="M32 -30 Q34 -22 28 -18 Q28 -26 32 -30 Z" fill="#fff"/></g>
        <ellipse cx="0" cy="0" rx="16" ry="10" fill="${fur}"/><ellipse cx="-2" cy="4" rx="9" ry="5" fill="#fff7ed"/>
        <rect x="-12" y="6" width="5" height="9" rx="2" fill="#7c2d12"/><rect x="6" y="6" width="5" height="9" rx="2" fill="#7c2d12"/>
        <circle cx="-16" cy="-10" r="10" fill="${fur}"/><path d="M-24 -16 L-24 -30 L-15 -19 Z M-13 -19 L-6 -30 L-6 -15 Z" fill="${fur}"/><path d="M-22 -18 L-22 -25 L-17 -19 Z M-11 -19 L-7 -25 L-7 -17 Z" fill="#7c2d12"/>
        <path d="M-26 -8 Q-20 -2 -12 -6 Q-18 -4 -26 -8 Z" fill="#fff"/><circle cx="-27" cy="-8" r="2" fill="#1c1917"/><circle cx="-19" cy="-12" r="1.8" fill="#1c1917"/>
        ${st >= 2 ? '<path d="M-10 -4 Q-2 2 4 -4 L6 4 Q-2 8 -10 4 Z" fill="#ec4899"/><path d="M2 2 l4 10 l-6 -2 Z" fill="#ec4899"/>' : ''}
        ${st === 3 ? '<path d="M-22 -32 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 Z" fill="#fde68a"/>' : ''}
      </g>`);
    }

    return `<svg viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g${an('av-breathe')}>${p.join('')}</g></svg>`;
  }

  return { render, tierOf, TIERS, SKINS, HAIRC, HAIRS, BEARDS, shade };
})();
