/* Recursos nativos (só ativos dentro do app instalado; no navegador tudo vira no-op) */
const NATIVE = (() => {
  const C = window.Capacitor;
  const on = !!(C && C.isNativePlatform && C.isNativePlatform());
  const P = on ? C.Plugins : {};
  const KEY_PREF = 'lendario.db';

  const MSGS = [
    'Seus hábitos de hoje esperam por você, herói.',
    'O chefão da semana não vai se derrotar sozinho. ⚔️',
    'Um passo hoje, uma lenda amanhã.',
    'Sua sequência está em jogo. Bora manter a chama acesa 🔥',
    'O ouro do dia ainda está na mesa. 🪙',
    'Feche o dia como um campeão: marque o que você cumpriu.',
    'Pequenas vitórias, juros compostos na vida.'
  ];

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

  async function lembrete(ativo, hora) {
    if (!on || !P.LocalNotifications) return 'indisponivel';
    const LN = P.LocalNotifications;
    try {
      const pend = await LN.getPending();
      if (pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
      if (!ativo) return 'desligado';
      let perm = await LN.checkPermissions();
      if (perm.display !== 'granted') perm = await LN.requestPermissions();
      if (perm.display !== 'granted') return 'negado';
      const [h, m] = (hora || '20:00').split(':').map(Number);
      await LN.schedule({
        notifications: [1, 2, 3, 4, 5, 6, 7].map(wd => ({
          id: 100 + wd, title: 'Be Your Hero', body: MSGS[wd - 1],
          schedule: { on: { weekday: wd, hour: h, minute: m }, allowWhileIdle: true }
        }))
      });
      return 'ok';
    } catch (e) { return 'erro'; }
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

  return { on, haptic, persist, restore, lembrete, init };
})();
