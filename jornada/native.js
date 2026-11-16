/* Recursos nativos (só ativos dentro do app instalado; no navegador tudo vira no-op) */
const NATIVE = (() => {
  const C = window.Capacitor;
  const on = !!(C && C.isNativePlatform && C.isNativePlatform());
  const P = on ? C.Plugins : {};
  const KEY_PREF = 'lendario.db';

  async function haptic(kind) {
    if (!on || !P.Haptics) return false;
    try {
      if (kind === 'heavy') await P.Haptics.notification({ type: 'SUCCESS' });
      else await P.Haptics.impact({ style: kind === 'medium' ? 'MEDIUM' : 'LIGHT' });
      return true;
    } catch (e) { return false; }
  }

  // espelho do progresso em armazenamento nativo (mais durável que o do navegador)
  function persist(json) { if (on && P.Preferences) P.Preferences.set({ key: KEY_PREF, value: json }).catch(() => { }); }
  async function restore() {
    if (!on || !P.Preferences) return null;
    try { const r = await P.Preferences.get({ key: KEY_PREF }); return r && r.value ? r.value : null; } catch (e) { return null; }
  }

  async function permitir() {
    if (!on || !P.LocalNotifications) return false;
    try { let p = await P.LocalNotifications.checkPermissions(); if (p.display !== 'granted') p = await P.LocalNotifications.requestPermissions(); return p.display === 'granted'; } catch (e) { return false; }
  }

  // troca todos os avisos agendados pela lista nova [{id,title,body,at}]
  let fila = Promise.resolve();
  function agendar(lista) {
    if (!on || !P.LocalNotifications) return Promise.resolve('indisponivel');
    const LN = P.LocalNotifications;
    fila = fila.then(async () => {
      try {
        const pend = await LN.getPending();
        if (pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
        if (!lista.length) return 'ok';
        const perm = await LN.checkPermissions();
        if (perm.display !== 'granted') return 'negado';
        await LN.schedule({ notifications: lista.map(n => ({ id: n.id, title: n.title, body: n.body, schedule: { at: n.at, allowWhileIdle: true }, isExactNotification: false })) });
        return 'ok';
      } catch (e) { return 'erro'; }
    });
    return fila;
  }

  // compartilha uma imagem (dataURL PNG); no navegador usa o compartilhamento do sistema ou baixa o arquivo
  async function compartilhar(dataUrl, nome, texto) {
    if (on && P.Share && P.Filesystem) {
      const w = await P.Filesystem.writeFile({ path: nome, data: dataUrl.split(',')[1], directory: 'CACHE' });
      await P.Share.share({ title: 'Be Your Hero', text: texto, files: [w.uri], dialogTitle: 'Compartilhar evolução' }).catch(() => { });
      return 'ok';
    }
    try {
      const blob = await (await fetch(dataUrl)).blob(), file = new File([blob], nome, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: texto }); return 'ok'; }
    } catch (e) { if (e && e.name === 'AbortError') return 'ok'; }
    const a = document.createElement('a'); a.href = dataUrl; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
    return 'baixado';
  }

  /* Compra do Be Your Hero Lenda pela loja (Google Play Billing / StoreKit), sem servidor.
     Se houver oferta de lançamento ativa, a loja devolve a oferta mais barata e ela é usada. */
  const LJ = () => (on && P.NativePurchases) || null;
  async function oferta(id) {
    const L = LJ(); if (!L) return null;
    try { const r = await L.getProducts({ productIdentifiers: [id], productType: 'inapp' }); const ps = (r.products || []).filter(x => x.identifier === id); return ps.sort((a, b) => a.price - b.price)[0] || null; } catch (e) { return null; }
  }
  async function preco(id) { const o = await oferta(id); return o ? o.priceString + (o.fullPrice && o.fullPrice > o.price ? ' (preço de lançamento)' : '') : null; }
  const valida = t => t && (t.purchaseState === undefined || t.purchaseState === '1') && !t.revocationDate;
  async function comprar(id) {
    const L = LJ(); if (!L) return 'erro';
    try {
      const o = await oferta(id);
      const t = await L.purchaseProduct(Object.assign({ productIdentifier: id, productType: 'inapp' }, o && o.offerToken ? { offerToken: o.offerToken } : {}));
      if (valida(t)) return 'ok';
      return t && t.purchaseState === '0' ? 'pendente' : 'erro';
    } catch (e) { const m = String(e && (e.code || e.message) || '').toLowerCase(); return m.includes('cancel') ? 'cancelado' : 'erro'; }
  }
  // true = tem a compra; false = a loja confirmou que não tem; null = não deu para consultar
  async function temCompra(id, silencioso) {
    const L = LJ(); if (!L) return null;
    try {
      if (!silencioso) await L.restorePurchases().catch(() => { });
      const r = await L.getPurchases({ productType: 'inapp', onlyCurrentEntitlements: true });
      return (r.purchases || []).some(t => t.productIdentifier === id && valida(t));
    } catch (e) { return null; }
  }

  async function init() {
    if (!on) return;
    try { if (P.StatusBar) { await P.StatusBar.setStyle({ style: 'DARK' }); if (C.getPlatform() === 'android') await P.StatusBar.setBackgroundColor({ color: '#070b16' }); } } catch (e) { }
    try {
      if (P.App) P.App.addListener('backButton', () => {
        const lv = document.getElementById('lvlup'); if (lv) return lv.remove();
        if (document.getElementById('modal')) return closeModal();
        if (typeof view !== 'undefined' && view !== 'hoje' && db.perfil) return ir('hoje');
        P.App.minimizeApp();
      });
      if (P.App) P.App.addListener('resume', () => { if (db.perfil) { S = calc(); celebrate(S, true); render(); } });
    } catch (e) { }
  }

  return { on, haptic, persist, restore, permitir, agendar, compartilhar, preco, comprar, temCompra, init };
})();
