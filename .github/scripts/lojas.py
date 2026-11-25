"""Consulta e (sob ordem) libera o Be Your Hero nas lojas, sem clique do Renato.

Ações (variável ACAO):
  consultar   -> só leitura: estado das versões iOS no App Store Connect, busca pública
                 da App Store Brasil e faixas da Google Play.
  liberar_ios -> libera a versão iOS indicada em VERSAO_IOS, SÓ se ela estiver
                 "PENDING_DEVELOPER_RELEASE" (aprovada aguardando liberação manual).
Segredos: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8, PLAY_JSON (opcional).
"""
import json, os, sys, time, urllib.parse
import jwt, requests

APP_ID = '6836347782'
PKG = 'fineapps.beyourhero'
ASC = 'https://api.appstoreconnect.apple.com/v1'
ACAO = os.environ.get('ACAO', 'consultar')


def asc_headers():
    tok = jwt.encode({'iss': os.environ['ASC_ISSUER_ID'], 'iat': int(time.time()),
                      'exp': int(time.time()) + 900, 'aud': 'appstoreconnect-v1'},
                     os.environ['ASC_KEY_P8'], algorithm='ES256',
                     headers={'kid': os.environ['ASC_KEY_ID'], 'typ': 'JWT'})
    return {'Authorization': 'Bearer ' + tok}


def versoes_ios(H, versao=None):
    params = {'filter[platform]': 'IOS', 'limit': 10,
              'fields[appStoreVersions]': 'versionString,appStoreState,releaseType,createdDate'}
    if versao:
        params['filter[versionString]'] = versao
    r = requests.get(f'{ASC}/apps/{APP_ID}/appStoreVersions', params=params,
                     headers=H, timeout=60)
    print('App Store Connect versões:', r.status_code)
    r.raise_for_status()
    vs = r.json()['data']
    for v in vs:
        a = v['attributes']
        print(f"- iOS {a['versionString']}: estado={a['appStoreState']} liberação={a.get('releaseType')}")
    return vs


def busca_publica():
    print('Loja pública (Brasil):')
    r = requests.get('https://itunes.apple.com/lookup', params={'id': APP_ID, 'country': 'br'}, timeout=60)
    res = r.json().get('results', []) if r.ok else []
    if res:
        a = res[0]
        print(f"- lookup: {a.get('trackName')} versão {a.get('version')} preço={a.get('formattedPrice')} {a.get('currency')}")
    else:
        print('- lookup: ainda não aparece na loja do Brasil')
    for termo in ['beyourhero', 'be your hero', 'be your hero habitos']:
        r = requests.get('https://itunes.apple.com/search',
                         params={'term': termo, 'country': 'br', 'entity': 'software', 'limit': 50}, timeout=60)
        ids = [str(x.get('trackId')) for x in r.json().get('results', [])] if r.ok else []
        pos = ids.index(APP_ID) + 1 if APP_ID in ids else None
        print(f"- busca '{termo}': " + (f'posição {pos} de {len(ids)}' if pos else f'não está nos {len(ids)} primeiros'))


def play_publica():
    url = f'https://play.google.com/store/apps/details?id={PKG}&hl=pt_BR&gl=BR'
    r = requests.get(url, timeout=60, headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'pt-BR'})
    import re
    m = re.search(r'<title[^>]*>([^<]*)</title>', r.text or '')
    print(f"- Ficha pública Play: HTTP {r.status_code} título={m.group(1).strip() if m else None!r}")


def play_oferta(H, base):
    for u in [f'{base}/oneTimeProducts/beyourhero_legend',
              f'{base}/oneTimeProducts/beyourhero_legend/purchaseOptions/-/offers']:
        r = requests.get(u, headers=H, timeout=60)
        print(f"- GET {u.split(PKG)[1]}: HTTP {r.status_code}")
        print('  ' + (r.text or '')[:1500].replace('\n', ' '))


def play():
    raw = os.environ.get('PLAY_JSON', '').strip()
    if not raw:
        print('Play: chave ausente, pulado.'); return
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    c = service_account.Credentials.from_service_account_info(
        json.loads(raw), scopes=['https://www.googleapis.com/auth/androidpublisher'])
    c.refresh(Request())
    H = {'Authorization': 'Bearer ' + c.token}
    base = f'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{PKG}'
    e = requests.post(f'{base}/edits', headers=H, json={}, timeout=60)
    e.raise_for_status()
    eid = e.json()['id']
    try:
        t = requests.get(f'{base}/edits/{eid}/tracks', headers=H, timeout=60)
        t.raise_for_status()
        for tr in t.json().get('tracks', []):
            for rel in tr.get('releases', []) or [{}]:
                print(f"- Play {tr['track']}: status={rel.get('status')} versionCodes={rel.get('versionCodes')}")
    finally:
        requests.delete(f'{base}/edits/{eid}', headers=H, timeout=60)
    play_oferta(H, base)


H = asc_headers()
vs = versoes_ios(H, os.environ.get('VERSAO_IOS', '').strip() if ACAO == 'liberar_ios' else None)
if ACAO == 'consultar':
    busca_publica()
    play_publica()
    play()
elif ACAO == 'liberar_ios':
    alvo = os.environ.get('VERSAO_IOS', '').strip()
    v = next((x for x in vs if x['attributes']['versionString'] == alvo), None)
    if not v:
        sys.exit(f'Versão {alvo!r} não encontrada.')
    if v['attributes']['appStoreState'] != 'PENDING_DEVELOPER_RELEASE':
        sys.exit(f"Não liberado: a {alvo} está em {v['attributes']['appStoreState']}, não em PENDING_DEVELOPER_RELEASE.")
    r = requests.post(f'{ASC}/appStoreVersionReleaseRequests', headers=H, timeout=60, json={
        'data': {'type': 'appStoreVersionReleaseRequests',
                 'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': v['id']}}}}})
    print('Pedido de liberação:', r.status_code)
    if r.status_code >= 300:
        print(r.text[:1500]); sys.exit(1)
    print(f'OK: iOS {alvo} liberado (até 24 h para aparecer na loja).')
else:
    sys.exit('ACAO desconhecida: ' + ACAO)
