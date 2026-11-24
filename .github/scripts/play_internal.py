"""Envia o AAB do Be Your Hero para a faixa de TESTE INTERNO da Google Play.

Só mexe na faixa 'internal'. Nunca toca em produção, beta ou alpha.
Uso: python play_internal.py caminho/app-release.aab
Precisa da variável PLAY_JSON (conteúdo do segredo PLAY_SERVICE_ACCOUNT_JSON).
"""
import json, os, sys, requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

PACKAGE = 'fineapps.beyourhero'
TRACK = 'internal'  # fixo de propósito

aab = sys.argv[1]
raw = os.environ.get('PLAY_JSON', '').strip()
if not raw:
    print('PLAY_SERVICE_ACCOUNT_JSON vazio: envio à Play pulado (nada foi feito).')
    raise SystemExit(0)
info = json.loads(raw)
cred = service_account.Credentials.from_service_account_info(
    info, scopes=['https://www.googleapis.com/auth/androidpublisher'])
cred.refresh(Request())
H = {'Authorization': 'Bearer ' + cred.token}
API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/' + PACKAGE
UP = 'https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/' + PACKAGE


def ok(r, what):
    print(f'{what}: {r.status_code}')
    if r.status_code >= 300:
        print(r.text[:2000])
        raise SystemExit(1)
    return r.json() if r.content else {}


eid = ok(requests.post(f'{API}/edits', headers=H, json={}, timeout=60), 'Abrir edição')['id']
committed = False
try:
    with open(aab, 'rb') as f:
        b = ok(requests.post(f'{UP}/edits/{eid}/bundles?uploadType=media',
                             headers={**H, 'Content-Type': 'application/octet-stream'}, data=f, timeout=600),
               'Enviar AAB')
    vc = str(b['versionCode'])
    print('versionCode enviado:', vc)
    ok(requests.put(f'{API}/edits/{eid}/tracks/{TRACK}', headers=H, json={
        'track': TRACK,
        'releases': [{'versionCodes': [vc], 'status': 'completed', 'name': f'{vc} (teste interno automático)'}],
    }, timeout=60), 'Atualizar faixa de teste interno')
    ok(requests.post(f'{API}/edits/{eid}:commit', headers=H, timeout=60), 'Confirmar edição')
    committed = True
    print(f'OK: versão {vc} na faixa de teste interno.')
finally:
    if not committed:
        requests.delete(f'{API}/edits/{eid}', headers=H, timeout=60)
        print('Edição descartada (nada foi publicado).')
