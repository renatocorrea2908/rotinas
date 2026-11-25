"""Cria e ativa a oferta de lançamento da Be Your Hero Legend na Google Play.

Decisão do Renato (23/11/2026, decisão 176 B / item 109): R$ 29,90 até 02/01/2027 23:59 (Brasília),
só Brasil, na opção 'compra-unica', sem mexer no preço base (R$ 49,90).
Valores fixos no código de propósito: nada vem de entrada livre.
Travas: aborta se o preço base no Brasil não for exatamente R$ 49,90 ou se o fim já passou.
"""
import json, os, sys, datetime as dt, requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

PKG, PROD, OPT, OFFER = 'fineapps.beyourhero', 'beyourhero_legend', 'compra-unica', 'lancamento-2026'
BASE_ESPERADO = (49, 900000000)          # R$ 49,90
DESCONTO = {'currencyCode': 'BRL', 'units': '20', 'nanos': 0}   # 49,90 - 20,00 = 29,90
FIM = '2027-01-03T02:59:59Z'             # 02/01/2027 23:59:59 em Brasília (UTC-3)

c = service_account.Credentials.from_service_account_info(
    json.loads(os.environ['PLAY_JSON']), scopes=['https://www.googleapis.com/auth/androidpublisher'])
c.refresh(Request())
H = {'Authorization': 'Bearer ' + c.token}
B = f'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{PKG}/oneTimeProducts/{PROD}'

def ok(r, o):
    print(f'{o}: HTTP {r.status_code}')
    if r.status_code >= 300:
        print(r.text[:3000]); sys.exit(1)
    return r.json() if r.text.strip() else {}

prod = ok(requests.get(B, headers=H, timeout=60), 'Ler produto')
opt = next(o for o in prod['purchaseOptions'] if o['purchaseOptionId'] == OPT)
br = next(x for x in opt['regionalPricingAndAvailabilityConfigs'] if x['regionCode'] == 'BR')
p = br['price']
print('Preço base BR:', p)
if p.get('currencyCode') != 'BRL' or (int(p.get('units', 0)), int(p.get('nanos', 0))) != BASE_ESPERADO:
    sys.exit('ABORTADO: preço base no Brasil não é R$ 49,90. Nada foi criado.')
agora = dt.datetime.now(dt.timezone.utc)
if agora >= dt.datetime(2027, 1, 3, 2, 59, 59, tzinfo=dt.timezone.utc):
    sys.exit('ABORTADO: a data de fim já passou.')
rv = (prod.get('regionsVersion') or {}).get('version') or '2022/02'
print('regionsVersion:', rv)

oferta = {
    'packageName': PKG, 'productId': PROD, 'purchaseOptionId': OPT, 'offerId': OFFER,
    'discountedOffer': {'startTime': agora.strftime('%Y-%m-%dT%H:%M:%SZ'), 'endTime': FIM},
    'regionalPricingAndAvailabilityConfigs': [
        {'regionCode': 'BR', 'availability': 'AVAILABLE', 'absoluteDiscount': DESCONTO}],
}
ok(requests.post(f'{B}/purchaseOptions/{OPT}/offers:batchUpdate', headers=H, timeout=120, json={'requests': [{
    'oneTimeProductOffer': oferta, 'updateMask': 'discountedOffer,regionalPricingAndAvailabilityConfigs',
    'regionsVersion': {'version': rv}, 'allowMissing': True}]}), 'Criar oferta (rascunho)')

ok(requests.post(f'{B}/purchaseOptions/{OPT}/offers:batchUpdateStates', headers=H, timeout=120, json={'requests': [{
    'activateOneTimeProductOfferRequest': {'packageName': PKG, 'productId': PROD,
                                           'purchaseOptionId': OPT, 'offerId': OFFER}}]}), 'Ativar oferta')

lst = ok(requests.get(f'{B}/purchaseOptions/{OPT}/offers', headers=H, timeout=60), 'Conferir')
for o in lst.get('oneTimeProductOffers', []):
    print(json.dumps({k: o.get(k) for k in ['offerId', 'state', 'discountedOffer', 'regionalPricingAndAvailabilityConfigs']}, ensure_ascii=False))
