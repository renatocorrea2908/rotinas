"""Publica os posts aprovados do Be Your Hero no Instagram (@beyourhero.official).

API do Instagram com login do Instagram (graph.instagram.com). Segredo: IG_TOKEN.
Agenda: instagram/agenda.json (id, quando em horário de Brasília, imagens, legenda).
Modos (MODO):
  teste    -> não publica: confere token, conta, limite, imagens (links públicos, JPEG, proporção) e legendas.
  agendado -> publica os posts cuja hora chegou (até 20 min antes e até 6 h depois), se ainda não publicados.
  forcar   -> publica agora o post POST_ID (ex.: B1), se ainda não publicado.
Nunca publica duas vezes: confere instagram/publicados.json e os posts recentes da própria conta.
"""
import json, os, sys, time, datetime as dt, requests
from io import BytesIO

G = 'https://graph.instagram.com/v21.0'
TOKEN = os.environ.get('IG_TOKEN', '').strip()
MODO = os.environ.get('MODO', 'teste')
POST_ID = os.environ.get('POST_ID', '').strip().upper()
REPO, SHA = os.environ['GITHUB_REPOSITORY'], os.environ['GITHUB_SHA']
DIR = 'instagram'
agenda = json.load(open(f'{DIR}/agenda.json'))
pub_path = f'{DIR}/publicados.json'
publicados = json.load(open(pub_path)) if os.path.exists(pub_path) else {}
resumo = []

def log(s):
    print(s); resumo.append(s)

def fim(code=0):
    with open(os.environ.get('GITHUB_STEP_SUMMARY', '/dev/null'), 'a') as f:
        f.write('\n'.join(resumo) + '\n')
    sys.exit(code)

def api(method, path, **params):
    params['access_token'] = TOKEN
    try:
        r = requests.request(method, f'{G}/{path}', params=params, timeout=120)
    except requests.RequestException as e:  # não imprimir a URL (tem o token)
        log(f'ERRO de rede em {method} {path}: {type(e).__name__}'); fim(1)
    if r.status_code >= 300:
        log(f'ERRO {method} {path}: HTTP {r.status_code} {r.text[:800]}'); fim(1)
    return r.json()

def url_img(nome):
    return f'https://raw.githubusercontent.com/{REPO}/{SHA}/{DIR}/img/{nome}'

def conferir_imagem(nome):
    from PIL import Image
    r = requests.get(url_img(nome), timeout=60)  # sem login: tem que ser público
    if r.status_code != 200:
        return f'{nome}: link público NÃO abre (HTTP {r.status_code})'
    im = Image.open(BytesIO(r.content)); w, h = im.size; prop = w / h
    ok = im.format == 'JPEG' and 0.8 <= prop <= 1.91 and len(r.content) <= 8 * 1024 * 1024
    return f'{nome}: público, {im.format} {w}x{h}, {len(r.content)//1024} KB' + ('' if ok else '  <-- FORA DO PADRÃO')

def legenda(p):
    return open(f"{DIR}/{p['legenda']}", encoding='utf-8').read().strip()

# 1) Conferências comuns
problemas = []
for p in agenda:
    for n in p['imagens']:
        s = conferir_imagem(n); log('- ' + s)
        if 'NÃO' in s or 'FORA' in s: problemas.append(s)
    c = legenda(p)
    log(f"- {p['id']} {p['quando']}: {len(p['imagens'])} imagem(ns), legenda {len(c)} caracteres, {c.count('#')} hashtags")
    if len(c) > 2200 or c.count('#') > 30: problemas.append(f"{p['id']}: legenda fora do limite")
if not TOKEN:
    log('IG_TOKEN ainda não está nos segredos: parei antes de falar com o Instagram.')
    fim(1 if MODO != 'teste' else 0)
me = api('GET', 'me', fields='user_id,username,account_type')
uid = me['user_id']
log(f"- Conta: @{me.get('username')} tipo={me.get('account_type')}")
lim = api('GET', f'{uid}/content_publishing_limit', fields='quota_usage,config')
log(f"- Limite de publicação: {lim}")
try:
    rt = requests.get('https://graph.instagram.com/refresh_access_token',
                      params={'grant_type': 'ig_refresh_token', 'access_token': TOKEN}, timeout=60)
    if rt.ok:
        dias = rt.json().get('expires_in', 0) // 86400
        log(f'- Token renovado: vale mais {dias} dias' + ('  <-- AVISAR O RENATO' if dias < 10 else ''))
    else:
        log(f'- Renovação do token não feita agora (HTTP {rt.status_code}); normal no 1º dia.')
except Exception as e:
    log(f'- Renovação do token falhou: {type(e).__name__}')
if problemas:
    log('PROBLEMAS: ' + ' | '.join(problemas)); fim(1)
if MODO == 'teste':
    log('TESTE OK: nada foi publicado.'); fim(0)
if MODO not in ('agendado', 'forcar'):
    log(f'MODO inválido: {MODO!r}. Nada publicado.'); fim(1)

# 2) O que publicar
agora = dt.datetime.now(dt.timezone.utc)
if MODO == 'forcar':
    alvo = [p for p in agenda if p['id'] == POST_ID]
    if not alvo:
        log(f'POST_ID inválido: {POST_ID!r}. Nada publicado.'); fim(1)
else:
    alvo = [p for p in agenda
            if dt.timedelta(minutes=-20) <= agora - dt.datetime.fromisoformat(p['quando']) <= dt.timedelta(hours=6)]
recentes = api('GET', f'{uid}/media', fields='caption,permalink,timestamp', limit=25).get('data', [])
for p in alvo:
    c = legenda(p)
    if p['id'] in publicados or any((m.get('caption') or '').strip()[:80] == c[:80] for m in recentes):
        log(f"{p['id']}: já publicado, pulado."); continue
    espera = (dt.datetime.fromisoformat(p['quando']) - agora).total_seconds()
    if MODO == 'agendado' and espera > 0:
        time.sleep(espera)
    if len(p['imagens']) == 1:
        cid = api('POST', f'{uid}/media', image_url=url_img(p['imagens'][0]), caption=c)['id']
    else:
        filhos = [api('POST', f'{uid}/media', image_url=url_img(n), is_carousel_item='true')['id'] for n in p['imagens']]
        cid = api('POST', f'{uid}/media', media_type='CAROUSEL', children=','.join(filhos), caption=c)['id']
    for _ in range(60):
        st = api('GET', cid, fields='status_code').get('status_code')
        if st == 'FINISHED': break
        if st in ('ERROR', 'EXPIRED'): log(f"{p['id']}: preparo falhou ({st})"); fim(1)
        time.sleep(5)
    else:
        log(f"{p['id']}: Instagram não terminou de preparar em 5 min ({st}). Nada publicado; próxima rodada tenta de novo."); fim(1)
    mid = api('POST', f'{uid}/media_publish', creation_id=cid)['id']
    link = api('GET', mid, fields='permalink').get('permalink')
    publicados[p['id']] = {'media_id': mid, 'link': link, 'publicado_em': dt.datetime.now(dt.timezone.utc).isoformat()}
    json.dump(publicados, open(pub_path, 'w'), ensure_ascii=False, indent=2)
    log(f"PUBLICADO {p['id']}: {link}")
if not alvo:
    log('Nenhum post na janela de agora.')
fim(0)
