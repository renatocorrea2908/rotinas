"""Cria e ativa a oferta de lançamento da Be Your Hero Legend na Google Play.

Decisão do Renato (23/11/2026, decisão 176 B / item 109): R$ 29,90 até 02/01/2027 23:59 (Brasília),
só Brasil, na opção 'compra-unica', sem mexer no preço base (R$ 49,90).
Valores fixos no código de propósito: nada vem de entrada livre.
Travas: aborta se o preço base no Brasil não estiver entre R$ 49,90 e R$ 49,99 ou se o fim já passou.
"""
import json, os, sys, datetime as dt, requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

PKG, PROD, OPT, OFFER = 'fineapps.beyourhero', 'beyourhero_legend', 'compra-unica', 'lancamento-2026'
ALVO_CENTAVOS = 2990                      # preço final da oferta: R$ 29,90
BASE_ACEITO = range(4990, 5000)           # base aceito: R$ 49,90 a R$ 49,99 (a Play mostrou R$ 49,99)
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
base_c = int(p.get('units', 0)) * 100 + int(p.get('nanos', 0)) // 10_000_000
if p.get('currencyCode') != 'BRL' or base_c not in BASE_ACEITO:
    sys.exit('ABORTADO: preço base no Brasil fora de R$ 49,90–49,99. Nada foi criado.')
d = base_c - ALVO_CENTAVOS
DESCONTO = {'currencyCode': 'BRL', 'units': str(d // 100), 'nanos': (d % 100) * 10_000_000}
print(f'Desconto: R$ {d/100:.2f} -> preço final R$ {(base_c - d)/100:.2f}'.replace('.', ','))
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
