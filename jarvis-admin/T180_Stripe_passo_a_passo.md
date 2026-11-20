# T180 — Revisão do Stripe, passo a passo (modo real)

> **Para:** Renato · **Prazo:** 18/11 a 12/12/2026 (sem urgência) · **Escrito em:** 17/11/2026
> **O que é:** o roteiro tela por tela para deixar o Stripe com a cara do Stratum
> (marca, dados da empresa, fatura, recibo, portal, checkout e e-mails), com os
> valores já escolhidos para você só digitar ou escolher.
> **Regra de custo:** custo ZERO até o primeiro cliente. O único item pago que
> apareceu (domínio próprio para a página de pagamento) fica marcado
> **"esperar o 1º cliente"**.

**Como ler este documento**

- 🟢 **Grátis** · 💲 **Pago** · ⚠ **A confirmar no painel**: a fonte oficial do
  Stripe não deixou claro; olhe na tela antes de decidir.
- Os nomes dos menus estão em português e, entre parênteses, em inglês, porque o
  painel pode aparecer em qualquer um dos dois.
- Os arquivos da marca estão no repositório. No seu Mac, a pasta é
  `/Users/Renato/Claude/Dev/stratum/` — o caminho de cada arquivo vem a partir dela.
- Um aviso honesto: a pesquisa não conseguiu abrir as páginas do Stripe inteiras
  (a rede desta sessão não alcança docs.stripe.com). As regras e citações vieram
  dos trechos oficiais que a busca devolveu. Por isso há vários ⚠: quando a tela
  do painel disser outra coisa, **vale a tela**.

---

## 0) Antes de começar

### 0.1 O que você precisa

1. Entrar em **dashboard.stripe.com** com a conta da FineApps.
2. Conferir no topo que o **Modo de teste (Test mode) está DESLIGADO**. Tudo aqui é
   no modo real. ⚠ Algumas telas (como Marca) podem valer para os dois modos;
   outras (como o Portal) são separadas — o roteiro de 06/11 já mostrou que a
   configuração do modo de teste **não** passa para o real.
3. Ter o Finder aberto na pasta do Stratum, para subir os arquivos da marca.
4. Uns 40 minutos para as seções 1 a 7. As seções 8 e 9 ficam para depois.

### 0.2 Quanto custa cada item

| Item | Custo | Fonte | Decisão |
|---|---|---|---|
| Marca (ícone, logo, cores) | 🟢 Grátis | docs.stripe.com/get-started/account/branding | Fazer agora |
| Dados públicos (nome, e-mail, endereço, links) | 🟢 Grátis | docs.stripe.com/get-started/account/set-up | Fazer agora |
| Descritor na fatura do cartão | 🟢 Grátis | docs.stripe.com/get-started/account/statement-descriptors | Fazer agora |
| Idioma padrão (português) | 🟢 Grátis | docs.stripe.com/invoicing/customize | Fazer agora |
| Recibos automáticos por e-mail | 🟢 Grátis | docs.stripe.com/receipts | Fazer agora |
| CNPJ da FineApps na fatura | 🟢 Grátis | stripe.com/docs/invoicing/taxes/account-tax-ids · docs.stripe.com/tax/invoicing/tax-ids | Fazer agora |
| Numeração/prefixo da fatura | 🟢 Grátis | docs.stripe.com/invoicing/customize | Opcional, agora |
| Configuração do Portal do cliente | 🟢 Grátis (sem custo além da taxa do Billing que já existe) | docs.stripe.com/customer-management/configure-portal | Fazer agora |
| Modelo de fatura padrão (CNPJ, rodapé, memo) | 🟢 O modelo padrão não é separado por plano; ⚠ nenhum preço publicado foi achado para criar modelos **adicionais** | docs.stripe.com/invoicing/customize · stripe.com/invoicing/pricing (o pago do Invoicing Plus é Orçamentos) | Usar o padrão agora; se pedir preço para modelo adicional, **não criar** |
| Domínio de e-mail próprio (Custom email domain) | ⚠ Nenhum preço publicado foi achado; provavelmente grátis | docs.stripe.com/get-started/account/email-domain | Fazer só se a tela não mostrar preço |
| **Domínio próprio para Checkout e Portal** (ex.: pagamento.stratum-tool.com) | 💲 **US$ 10 por mês** enquanto ligado. Para conta fora dos EUA, o Stripe diz que pode cobrar em moeda local (reais) pelo câmbio do momento, "quando disponível"; se não houver, a cobrança vem em dólar (e aí entram IOF e câmbio do cartão). ⚠ A moeda e um eventual preço em R$: a confirmar em stripe.com/br/pricing ou no painel (Configurações › Domínios personalizados). Cobrado na 1ª semana do mês seguinte, só nos meses em que ficou ligado o mês inteiro. | support.stripe.com/questions/custom-domain-on-stripe-hosted-surfaces-faq · docs.stripe.com/payments/checkout/custom-domains · stripe.com/pricing | **ESPERAR O 1º CLIENTE** |

Taxas que **já existem** com o uso e **não** nascem desta revisão:

- **Billing:** a partir de 0,7% do valor de cada fatura de assinatura (tabela
  global do Stripe: "fees start at 0.7%"). ⚠ O percentual para conta brasileira:
  conferir em stripe.com/br/pricing.
- **Cartão:** cartão nacional **3,99% + R$ 0,39** por cobrança aprovada (mais 2% se
  o cartão for internacional), pela página de preços do Stripe para o Brasil.
  Numa assinatura de R$ 350, cerca de **R$ 14,36** por cobrança. ⚠ A página de
  Billing do Brasil mostra **3,99% + R$ 0,50**: os centavos fixos divergem entre
  as páginas oficiais; conferir no painel qual vale para a conta.
- Em estorno, a taxa do cartão da cobrança original **não volta** (o Stripe não a
  devolve); estornar cartão não tem taxa extra.

**Regra:** se em qualquer tela aparecer um botão com preço, plano pago, "Upgrade"
ou "Start trial", **pare e não clique**. Anote e me mande. Até o primeiro cliente,
só entra o que é grátis.

---

## 1) Marca

**Onde:** Configurações (engrenagem) › Empresa › **Marca** (Settings › Business › Branding).

**Regras do Stripe para os arquivos:** JPG ou PNG (PNG recomendado), **menos de
512 KB**, no mínimo 128 × 128 pixels. O **ícone tem de ser quadrado**. O **logo**
é a versão "não quadrada" e substitui o ícone em alguns lugares (no topo do
Checkout, ele aparece no lugar do ícone **e** do nome da conta).

### 1.1 O que subir

| Campo | Arquivo (a partir da pasta do Stratum) | Medidas | Por quê |
|---|---|---|---|
| **Ícone** (Icon) | `public/icon-512.png` | 512 × 512, 205 KB, PNG | É o mesmo ícone do app no celular: a marca sobre o quadrado azul-escuro `#111C27`. Como tem fundo próprio, aparece bem em fundo branco e em fundo escuro. |
| **Logo** (Logo) | `public/branding/stratum-lockup-claro.png` | 640 × 578, 457 KB, PNG transparente | É o bloco 3D com o nome "STRATUM" embaixo e, abaixo do nome, o slogan em inglês "EVERY LAYER, IN CONTROL.". Feito para fundo claro. Está abaixo do limite de 512 KB, mas com pouca folga. ⚠ **A confirmar na pré-visualização do Checkout e do recibo** (veja o aviso abaixo). |

Se o ícone com fundo escuro não agradar, a alternativa é
`public/branding/stratum-marca-claro-512.png` (512 × 512, 314 KB, fundo
transparente).

⚠ **Aviso sobre o logo (não foi visto na tela; é o que a regra do Stripe leva a
esperar):** o Stripe pede um logo "não quadrado" e o mostra numa faixa baixa e
larga. Este arquivo é **quase quadrado** (cerca de 1,1 : 1). Espremido nessa
faixa, o desenho, o nome e o slogan tendem a sair pequenos ou ilegíveis. Na
pré-visualização:

- Se ficar legível, mantenha.
- Se ficar pequeno ou ilegível: **deixe o campo Logo vazio** e use só o ícone (o
  nome "Stratum" já aparece pelos Dados públicos, seção 2); ou me peça uma versão
  **horizontal só com o nome, sem o slogan**, gerada por
  `scripts/branding/gerar-marca.py` — é tarefa do agente e não custa nada.
- Se o logo ficar apagado, a saída é a mesma (Logo vazio + só o ícone) ou ajustar
  a cor de destaque (seção 1.2).
- **Não use** `public/branding/stratum-lockup-escuro.png`: ele é só para fundo
  escuro (letras claras, com manchas escuras em volta do desenho). Sobre fundo
  branco fica pior. Não use na fatura nem no Checkout.

⚠ **Não suba** `public/favicon.svg` (o Stripe não aceita SVG, e esse arquivo é só
uma imagem pequena embrulhada) nem os JPG de `public/branding/novo/` (têm fundo
chapado e não são transparentes).

### 1.2 Cores

O Stratum tem duas cores que já se repetem no app, nos e-mails e no ícone:

| Campo no Stripe | Valor a digitar | De onde vem |
|---|---|---|
| **Cor da marca** (Brand color) | `#0085FF` | O azul do Stratum: botões dos e-mails do app e a cor `--brand` do app |
| **Cor de destaque** (Accent color) | `#111C27` | O azul quase preto do ícone, do app no celular e dos títulos dos e-mails |

Digite os valores no campo de texto ao lado do seletor de cor (aceita HEX).

⚠ **Conferir na pré-visualização à direita.** Pela tabela oficial do Stripe:

- a **cor da marca** vale para os e-mails, o Portal e a página e o PDF da fatura;
- a **cor de destaque** vale para o Checkout e os links de pagamento, o Portal, a
  página da fatura e é a **cor de FUNDO dos e-mails**.

Ou seja: com `#111C27` de destaque, o topo dos e-mails (recibo e fatura) fica
**quase preto**. O ícone (quadrado `#111C27`) e o logo "claro" (letras
cinza-escuras) podem sumir sobre esse fundo. Se isso acontecer na prévia do
e-mail, **inverta as duas cores** ou use uma **cor de destaque clara**, e veja de
novo. Escolha a combinação que ficar mais legível.

### 1.3 Conferir depois de salvar

- [ ] O ícone aparece quadrado, sem cortar a marca.
- [ ] O logo aparece inteiro e legível na pré-visualização da fatura/recibo.
- [ ] Os botões aparecem no azul `#0085FF` (ou no escuro, se você inverteu).
- [ ] Abrir a **pré-visualização do e-mail de recibo** e ver se o ícone e o logo
  aparecem sobre o fundo de destaque. Se não aparecerem, inverter as cores ou usar
  destaque claro (seção 1.2).
- [ ] ⚠ Logo no Portal do cliente: a documentação do Stripe se contradiz (uma página
  diz que aparece, outra que não). Só observe; não é defeito se não aparecer.

---

## 2) Dados públicos da empresa

**Onde:** Configurações › Empresa › **Dados da empresa** › **Dados públicos** ›
**Editar** (Settings › Business › Business details › Public details › Edit).

Esses dados aparecem no extrato do cartão, nos recibos, nas faturas, no Checkout e
no Portal. Podem ser alterados quando quiser.

| Campo | O que digitar | Observação |
|---|---|---|
| Nome público (Public business name) | `Stratum` | É o nome que o cliente conhece. A razão social aparece à parte (vem do cadastro). |
| Site (Website) | `https://app.stratum-tool.com` | Hoje a raiz `stratum-tool.com` ainda mostra a página "Lançamento em breve" da GoDaddy; ela só troca no Launch Gate (T66). Quando a raiz virar o site, troque para `https://stratum-tool.com`. |
| E-mail de suporte (Support email) | `suporte@stratum-tool.com` | O mesmo dos Termos e do app. Recebe pela Cloudflare. |
| Telefone de suporte (Support phone) | **deixar em branco** | O Stratum não tem telefone público: o suporte é só por escrito (Termos, §suporte). ⚠ Se o painel **exigir** telefone, pare: publicar um número é decisão sua, nova. |
| Endereço de suporte (Support address) | Cidade: `Jundiaí` · Estado: `SP` · País: `Brasil` — **sem rua, sem número, sem CEP** | Decisão de 17/11: endereço residencial não aparece em nada público. Veja o alerta abaixo. |
| Site de suporte (Support website) | deixar em branco, ou `https://app.stratum-tool.com` se for obrigatório | ⚠ A confirmar se é obrigatório. |
| Descritor da fatura do cartão | ver seção 3 | |
| Política de privacidade (Privacy policy) | `https://app.stratum-tool.com/privacidade` | Aparece no Checkout e no recibo. |
| Termos de serviço (Terms of service) | `https://app.stratum-tool.com/legal/termos` | Usado pelo Checkout e pelo Portal. |

### ⚠ Alerta sobre o endereço (ponto mais sensível desta revisão)

1. O Stripe diz que, por conformidade, **o recibo SEMPRE mostra** razão social,
   endereço de suporte, e-mail de suporte e link da privacidade. Ou seja: o que
   estiver no endereço de suporte **vai aparecer em todo recibo**.
2. **A confirmar no painel:** se o campo aceita só cidade e estado, sem rua e CEP.
3. **A confirmar no painel:** se, com o endereço de suporte vazio, o Stripe usa o
   **endereço cadastral** (o do cadastro da conta, que é residencial). Por isso
   **não deixe o endereço de suporte vazio** — preencha só `Jundiaí` / `SP`.
4. **Se o painel exigir rua e CEP**, não digite o endereço residencial. Pare e me
   mande um print. As saídas possíveis são todas decisão sua: (a) um endereço
   comercial (escritório virtual tem custo mensal — fora da regra de custo zero);
   (b) manter o residencial (contraria a decisão de 17/11). Lembrete já registrado:
   o Decreto 7.962/2013 pede endereço físico na venda on-line — o que publicar é
   decisão jurídica, sua ou do advogado.
5. O endereço que você deu no cadastro de ativação da conta (KYC) **não é público**
   e não precisa ser mexido.

### Conferir depois de salvar

- [ ] Reabrir a tela e ver se ficou só "Jundiaí, SP" (sem rua aparecendo de volta).
- [ ] Na pré-visualização do recibo (seção 4), conferir o endereço que aparece.

---

## 3) Descritor (o nome no extrato do cartão)

**Onde:** a mesma tela de Dados públicos (Settings › Business › Public details).

**Situação hoje:** já foi definido como `STRATUM` no roteiro de 06/11
(`documentacao/ROTEIRO-STRIPE-LIVE.md`); **não há registro de que ele tenha sido
visto no extrato** (a caixa de conferência do extrato no roteiro ficou
desmarcada). Confira no extrato do cartão usado em 06/11.

**Regras do Stripe:** de **5 a 22 caracteres**, pelo menos uma letra (páginas
antigas dizem "pelo menos 5 letras" — as duas opções abaixo cumprem as duas
versões), sem os caracteres `<` `>` `\` `'` `"` `*`, **só letras latinas** (sem acento
problemático) e precisa **refletir o nome fantasia** (Stratum).

| Opção | Texto | Caracteres | Prós e contras |
|---|---|---|---|
| **A (recomendada — manter)** | `STRATUM` | **7** | É o nome que o cliente conhece e já funciona. Nada a mexer. |
| B | `FINEAPPS STRATUM` | **16** (8 + espaço + 7) | Liga a cobrança à razão social da nota fiscal. Útil se algum cliente estranhar "FineApps" na NFS-e e "Stratum" no cartão. |

**Descritor abreviado (Shortened descriptor)**, se o painel pedir: `STRATUM`
(**7** caracteres; a regra é de 2 a 10). Com ele, se algum dia houver sufixo, o
extrato mostra `STRATUM* <sufixo>`, cortado em 22.

Observações: o Pix não aceita descritor personalizado (e o Stratum só cobra por
cartão); nenhuma regra própria do Brasil foi encontrada.

**Conferir:** o campo aceita e salva sem aviso vermelho. A prova final é o
extrato: o do cartão usado em 06/11 (ainda pendente de conferência) ou o do
primeiro cliente.

---

## 4) Faturas e recibos

### 4.1 Idioma padrão: português

**Onde:** Configurações › Empresa › **E-mails ao cliente** (Customer emails) ›
**Idioma padrão** (Default language).

- Escolher **Português (Brasil)**; se só houver "Português", escolher esse.
- O idioma de e-mails e PDFs segue o idioma do cliente, quando ele tem um; sem
  isso, vale este padrão. Hoje o Stratum **não** marca idioma no cliente (veja a
  seção 9), então **este padrão é o que vale**.
- A página da fatura na internet segue o idioma do navegador do cliente.
- ⚠ Se "pt-BR" e "pt" são tratados de forma diferente: a confirmar na
  pré-visualização.

### 4.2 Recibos automáticos

**Onde:** a mesma tela (Customer emails), bloco **Pagamentos** (Payments).

- Ligar **Pagamentos bem-sucedidos** (Successful payments).
- Ligar **Reembolsos** (Refunds).

Por quê: o Stratum só manda um e-mail próprio na **ativação** da assinatura
("Assinatura ativada"). Nos meses seguintes, o cliente não recebe nada a cada
cobrança. Com o recibo do Stripe ligado, ele recebe o comprovante todo mês. No
primeiro mês chegam os dois (ativação + recibo), o que é normal.

⚠ Ver como está hoje: o roteiro de 06/11 registrou que "chegou o recibo no seu
e-mail", então talvez já esteja ligado. Se estiver, só confirme.

### 4.3 CNPJ da FineApps na fatura

**Onde (caminho oficial):** Configurações › Billing › **Modelo de fatura** (Invoice
template) › descer até **Gerenciar informações fiscais** (Manage tax information).

1. Adicionar número fiscal: tipo **Brasil — CNPJ** (`br_cnpj`).
2. Número: `27.340.695/0001-07`.
3. No menu **"…"** do número, escolher **Definir como padrão** (Set as default),
   para aparecer em todo PDF de fatura e nota de crédito.

É a **mesma tela** do modelo de fatura da seção 4.4 — e é para usar normalmente.

Atenção: o Stripe confere só o formato do número, não consulta a Receita. E o
CNPJ entra só nas faturas **novas** (fatura já finalizada não muda).

### 4.4 Modelo de fatura: memo e rodapé

**Onde:** Configurações › Billing › **Modelo de fatura** (Invoice template) — a
mesma tela do CNPJ (4.3). O **modelo padrão**, onde ficam o CNPJ, o memo e o
rodapé, é para usar normalmente: o Stripe não o separa por plano. ⚠ O aviso de
preço vale só para criar modelos **adicionais**: se a tela pedir pagamento ou
"Upgrade" para criar outro modelo, não crie (não precisamos de outro). O recurso
pago conhecido do Invoicing Plus é Orçamentos (Quotes), não o modelo.

**Memo padrão** (texto no corpo da fatura):

```
Assinatura mensal do Stratum. Dúvidas: suporte@stratum-tool.com
```

**Rodapé padrão** (Footer):

```
Stratum é um produto da FineApps Sistemas Ltda. — CNPJ 27.340.695/0001-07 — Jundiaí/SP. Esta fatura não é nota fiscal; a NFS-e é um documento separado.
```

Por que a frase "não é nota fiscal": os Termos (§7) e a Ajuda dizem que a NFS-e é
emitida a cada pagamento, mas ela ainda não está ligada (Nota Nacional desligada,
só a FineApps em teste). A fatura e o recibo do Stripe **não** podem dar a
entender que são a nota. ⚠ Limite de tamanho do rodapé: a confirmar; se não
couber, corte a primeira frase.

**Campos personalizados** (até 4 no cabeçalho): não precisa. Deixe vazio.

### 4.5 Numeração da fatura (opcional)

- **Recomendação: deixar como está** (numeração por cliente, o padrão fora da
  Europa). Funciona e não afeta nada.
- Se quiser um número com a cara do Stratum: em Configurações de fatura, trocar
  para **numeração por conta** e usar o prefixo `STRATUM` (7 caracteres; a regra é
  de 3 a 12 — versões antigas dizem 1 a 12 —, letras maiúsculas e números). Vale
  só para as faturas seguintes. ⚠ A confirmar se a tela oferece essa opção.

### 4.6 Conferir

- [ ] Abrir a **pré-visualização** da fatura e do recibo (Preview) — sem cobrar ninguém.
- [ ] Está em português.
- [ ] Aparece: ícone/logo, "Stratum", razão social **FineApps Sistemas Ltda.**,
  CNPJ `27.340.695/0001-07`, `suporte@stratum-tool.com`, link da privacidade.
- [ ] O endereço aparece **só como Jundiaí, SP**. Se aparecer rua ou CEP, pare e me avise.
- [ ] O rodapé com "não é nota fiscal" aparece.

---

## 5) Portal do cliente

**Onde:** Configurações › Billing › **Portal do cliente** (Customer portal).

O que já foi configurado em 06/11 e **continua igual**:

- [x] Atualizar forma de pagamento — **ligado** (o Stripe exige pelo menos isto)
- [x] Ver histórico de faturas — **ligado**
- [x] Cancelar assinatura — **ligado**, "No fim do período"
- [ ] Trocar de plano — **desligado** (há um plano só)

O que entra agora:

| Campo | Valor | Observação |
|---|---|---|
| **Cabeçalho** (Headline) | `Stratum — cartão, faturas e assinatura da sua empresa.` | Se ficar vazio, aparece em inglês: "Stratum partners with Stripe for simplified billing." |
| Link dos Termos | `https://app.stratum-tool.com/legal/termos` | Se ficar vazio, o portal usa o dos Dados públicos (seção 2). |
| Link da Privacidade | `https://app.stratum-tool.com/privacidade` | Idem. |
| Pedir o motivo do cancelamento (opcional) | Ligar | Grátis; ajuda a saber por que alguém saiu. Não muda nada no app. |

O Stratum não guarda configuração do portal no código: tudo é nesta tela.

**Conferir:** clicar em **Pré-visualizar** (Preview) e ver ícone, cores, cabeçalho
em português e os dois links. O texto fixo do portal segue o idioma marcado no
cliente; sem isso, o do navegador. O Portal tem português do Brasil (pt-BR).
Fixar o idioma é tarefa de código (A1, seção 9).

---

## 6) Checkout (a página de pagamento)

**Onde:** Configurações › Empresa › **Marca** › área do **Checkout** (Checkout and
Payment Links). ⚠ O Stripe oferece, além das cores gerais, cor de fundo, cor do
botão, fonte e formato dos cantos; o lugar exato pode variar.

| Campo | Valor | Por quê |
|---|---|---|
| Cor de fundo (Background) | `#FFFFFF` (branco) | Para o logo "claro" aparecer bem e a página ficar limpa. ⚠ A confirmar na prévia se este fundo se sobrepõe à cor de destaque (`#111C27`); se o Checkout continuar escuro, veja a seção 1.2. |
| Cor do botão (Button) | `#0085FF` | O mesmo azul dos botões do app. |
| Fonte (Font) | `Inter`, se estiver na lista; senão, a padrão | É a fonte das telas do app e dos e-mails de cobrança do Stratum. ⚠ A confirmar se a lista tem Inter. |
| Cantos (Shape) | Arredondado (Rounded) | Os botões do app têm cantos arredondados. |

O que **não** se mexe aqui:

- **Idioma:** o código não fixa o idioma; o Checkout usa o do navegador do cliente
  (que, para cliente brasileiro, é português). Fixar em português é tarefa de
  código (seção 9).
- **Aceite dos Termos:** não acontece no Checkout de propósito — o aceite já é
  registrado no cadastro, com versão, data e IP. Não ligue a opção de exigir
  aceite no Checkout.
- **Nome e descrição do produto:** vêm do código. O nome é "Stratum" e a
  descrição é "Suprimentos e Reembolso de Despesas. Usuários sem limite. Suporte
  incluído." (tarefa A4, seção 9).

**Conferir:** a pré-visualização do Checkout à direita da tela de Marca. Não é
preciso pagar nada para ver.

---

## 7) E-mails ao cliente e domínio de e-mail

### 7.1 E-mails que o Stripe manda

**Onde:** Configurações › Empresa › **E-mails ao cliente** (Customer emails), e
Configurações › Billing › **Assinaturas e e-mails** (Subscriptions and emails).

- Recibos: ligados (seção 4.2).
- Aviso de pagamento que falhou: **o Stratum já manda o próprio** (aviso no 1º dia
  e lembrete antes da suspensão, com o prazo de 7 dias dos Termos). ⚠ Se o Stripe
  também estiver mandando o dele, o cliente recebe dois avisos com textos
  diferentes. Recomendação: **deixar o do Stripe desligado** e ficar com o do
  Stratum, que fala do prazo de suspensão.
  **Onde:** procurar a chave **"Enviar e-mails quando pagamentos com cartão
  falharem"** (Send emails when card payments fail) em Configurações › Billing ›
  **Recuperação de receita** (Revenue recovery). Se não estiver lá, procurar em
  Assinaturas e e-mails › **Gerenciar pagamentos que falharam** (Manage failed
  payments). Deixar **desligada**. Confira como está e me diga.
- A aparência (ícone, cores) vem da tela de Marca (seção 1).

### 7.2 Domínio de e-mail próprio (Custom email domain)

Sem isso, os e-mails do Stripe saem de um endereço `@stripe.com`. Com isso, saem
de `@stratum-tool.com` (por exemplo `billing@` ou `receipts@`), o que passa mais
confiança.

**Custo:** ⚠ nenhum preço publicado foi achado. **Só siga se a tela não mostrar
preço.** Se mostrar, pare: fica para depois do 1º cliente.

**Onde:** ⚠ dentro de **E-mails ao cliente** (Customer emails), botão
**Verificar domínio** (Verify domain) — o caminho exato a confirmar no painel.

**Passos:**

1. Adicionar o domínio `stratum-tool.com`.
2. O Stripe mostra os registros de DNS. São três tipos: um **TXT** (prova que o
   domínio é seu), um **CNAME** do "Mail From" (cobre o SPF) e alguns **CNAME** de
   DKIM. **Copie os valores exatamente da tela** — não invente nenhum.
3. Em **dash.cloudflare.com** › stratum-tool.com › **DNS** › **Adicionar registro**,
   criar cada registro **novo** que o Stripe pediu.
4. Voltar ao Stripe e clicar em **Verificar**. Pode levar até 72 horas.
5. Depois de verificado, definir como **domínio de envio**.

**Cuidados na Cloudflare (importante — o e-mail do app depende desses registros):**

- **Não altere nem apague** nenhum registro que já existe: `app`, MX, TXT da raiz,
  `_domainkey`, `send`, `resend`, `_dmarc`.
- **Nunca crie um segundo TXT de SPF na raiz** (`v=spf1 ...`). Dois SPF quebram o
  envio de todos os e-mails. O Stripe cobre o SPF pelo CNAME do "Mail From", então
  não precisa.
- **DMARC:** o Stripe **EXIGE** um DMARC publicado e **NÃO aceita** `aspf=s`
  (alinhamento estrito de SPF) no DMARC — é condição para o recurso funcionar. O
  DMARC atual (medido por você em 19/10, `documentacao/ROTEIRO-DOMINIO-SITE.md`) é
  `p=quarantine` com `aspf=r` (modo relaxado), que é o que o Stripe pede. **Não
  mexa.** Só dê uma olhada no `_dmarc` na Cloudflare antes de começar: se hoje
  aparecer `aspf=s`, pare e me avise — sem tirar isso, o domínio de e-mail do
  Stripe não funciona, e mexer no DMARC afeta os e-mails do app.
- Se a Cloudflare oferecer a "nuvem laranja" (proxy) num CNAME, deixe **cinza (DNS
  only)**. ⚠ Não confirmado na fonte do Stripe; é a escolha segura para registro
  de e-mail.

Depois de configurado, o Stripe continua conferindo os registros. Se algum quebrar,
ele avisa e dá 48 horas para consertar; senão, volta a mandar por `@stripe.com`
(nada para de funcionar).

**Conferir:** a tela mostra o domínio como **verificado**; um recibo de
pré-visualização ou teste mostra o remetente `@stratum-tool.com`.

---

## 8) Domínio próprio para a página de pagamento

💲 **PAGO — ESPERAR O 1º CLIENTE.**

**O que é:** em vez de `checkout.stripe.com/...`, o cliente veria, por exemplo,
`pagamento.stratum-tool.com` no Checkout e no Portal.

**Custo:** **US$ 10 por mês** enquanto estiver ligado. Para conta fora dos EUA, o
Stripe diz que pode cobrar em moeda local (reais) pelo câmbio do momento, "quando
disponível"; se não houver, a cobrança vem em dólar (e aí entram IOF e câmbio do
cartão). ⚠ A moeda e um eventual preço em R$: a confirmar em stripe.com/br/pricing
ou no painel (Configurações › Domínios personalizados). É cobrado na
primeira semana do mês seguinte, e só nos meses em que o domínio ficou ligado o
mês inteiro. Pode ser desligado a qualquer momento (botão **Disconnect**) — mas,
desligado, os links de pagamento e de portal que usam o domínio próprio param de
funcionar. Fontes: support.stripe.com/questions/custom-domain-on-stripe-hosted-surfaces-faq,
docs.stripe.com/payments/checkout/custom-domains e stripe.com/pricing.

**Recomendação:** **não ligar agora.** A página `checkout.stripe.com` é conhecida e
confiável, e com a marca (seções 1 e 6) ela já fica com a cara do Stratum. Ligar
depois do 1º cliente pagante, se fizer sentido.

**Limites:** um só domínio por conta, que serve ao mesmo tempo para Checkout,
links de pagamento e Portal. ⚠ Disponibilidade para conta brasileira: nenhuma
página diz que não há; conferir em Configurações › **Domínios personalizados**
(Custom domains).

**Quando for a hora (para não esquecer):**

1. Stripe: Configurações › **Domínios personalizados** › **Adicionar domínio** (Add
   your domain) › digitar `pagamento.stratum-tool.com`.
2. Cloudflare › DNS › **dois registros novos**:
   - **CNAME** · nome `pagamento` · destino `hosted-checkout.stripecdn.com` · TTL 300
     segundos (ou "Auto") · ⚠ nuvem **cinza (DNS only)**, a confirmar.
   - **TXT** · nome `_acme-challenge.pagamento` · valor: **copiar do Stripe** em
     **Ver instruções** (View instructions).
3. Esperar uns 10 minutos e o Stripe verificar e ativar.
4. Não muda nada no código do app (o Stratum manda o cliente para o Stripe por
   redirecionamento) e não depende do Launch Gate da raiz do site.

---

## 9) O que está no código

### 9.1 O que já está certo e não precisa mexer

- O Checkout é criado em `src/app/api/billing/checkout/route.ts`: assinatura
  mensal em reais, só cartão, cupom liberado, preço lido do banco.
- O Portal é aberto por `src/app/api/billing/portal/route.ts`, sem configuração no
  código — tudo vem do painel (seção 5).
- Marca, cores, descritor, dados públicos, e-mails, recibos e modelo de fatura:
  **nada disso está no código**. É 100% painel.
- O aceite dos Termos é registrado no cadastro, não no Checkout.
- A página de pagamento é aberta por redirecionamento; ligar domínio próprio no
  futuro não exige mudança no app.

### 9.2 Tarefas para o agente (não feitas agora; cada uma precisa do seu "ok")

| # | Tarefa | Por quê | Onde |
|---|---|---|---|
| A1 | Marcar o idioma **português** no cadastro do cliente no Stripe (`preferred_locales`), no Checkout (`locale`) e ao abrir o Portal (`locale: "pt-BR"`) | Hoje vale o padrão da conta (seção 4.1) e o idioma do navegador. Fixar evita fatura, Checkout e Portal em inglês para quem usa navegador em inglês. O Portal segue esta ordem: `locale` da sessão, depois o idioma preferido do cliente, por último o navegador. ⚠ Testar se o Checkout aceita `pt-BR` ou só `pt`. | `src/app/api/billing/checkout/route.ts` · `src/app/api/billing/portal/route.ts` |
| A2 | Mandar ao Stripe o **CNPJ e a razão social do cliente** | Hoje a fatura sai com o nome fantasia da empresa cliente e sem o CNPJ dela; o banco já tem `billing_cnpj` e `billing_razao_social`, mas eles nunca chegam ao Stripe. Empresa cliente costuma pedir o CNPJ dela na fatura. Não basta mudar a criação (`customers.create` só roda quando o cliente ainda não existe): também é preciso **atualizar o cliente que já existe** no Stripe (nome, CNPJ e razão social) quando já houver `stripe_customer_id` e quando a Plataforma salvar dados novos de cobrança. | `src/app/api/billing/checkout/route.ts:56-69` (criação) · `src/app/api/platform/route.ts:997-1004` (onde a Plataforma salva os dados de cobrança) |
| A3 | Opcional: uma frase curta no Checkout (`custom_text`), ex.: "Cobrança mensal no cartão. Cancele quando quiser pela tela Assinatura." | Dá contexto ao cliente na hora de pagar. | `checkout/route.ts` |
| A4 | Rever o texto do produto, se você quiser outro. Nome: "Stratum". Descrição: "Suprimentos e Reembolso de Despesas. Usuários sem limite. Suporte incluído." | É o que aparece no Checkout e na fatura. | `src/app/api/billing/checkout/route.ts:97-98` (nome e descrição). A primeira parte da descrição vem de `src/lib/billing/pacote.ts:28` (`PACOTE_EM_PALAVRAS`), que **outras telas também usam** — mexer só lá muda esses outros lugares e não muda "Usuários sem limite. Suporte incluído." |
| A5 | **Endereço público**: o rodapé do site e os Termos §1 ("Quem somos") ainda mostram o endereço completo (com "casa 327" nos Termos) | Contraria a decisão de 17/11. Mudar o site é simples; mudar os Termos é texto jurídico e só com sua aprovação ou do advogado (há o alerta do Decreto 7.962/2013). ⚠ Confirmar no banco o texto vigente. | `site/gerar.mjs:258` · Termos (`legal_documentos`) |
| A6 | Corrigir os documentos internos, alinhando todos a "só Jundiaí/SP" | `documentacao/ROTEIRO-STRIPE-LIVE.md` (linha 148) manda manter o endereço completo nos Termos — contradiz 17/11. `documentacao/GO-LIVE-JURIDICO-E-STRIPE-LIVE.md` (linha 16) manda incluir o "endereço da sede" nos Termos e na Privacidade — também contradiz 17/11. `documentacao/HANDOFF-ATUAL.md` (linha 301) registra como "pronto" o rodapé do site com o endereço completo. E a linha 68 do GO-LIVE cita uma chave pública que o Stratum não usa. | documentação |
| A7 | Alinhar a promessa de NFS-e | Termos §7 e a Ajuda dizem que a NFS-e "é emitida a cada pagamento", mas ela ainda não está ligada. Ou liga a nota antes do 1º cliente, ou ajusta o texto (Termos: só com sua aprovação). | Ajuda: `src/app/(app)/help/content/billing/plano-fatura.md` |

---

## 10) Checklist final de conferência

**Não faça compra de teste no modo real.** Uma compra real cobra de verdade e a
taxa do cartão de uma cobrança estornada não volta (o Stripe não devolve a taxa
da cobrança original). Em cartão nacional são 3,99% + R$ 0,39 por cobrança, cerca
de R$ 14 numa de R$ 350 (⚠ a página de Billing do Brasil mostra R$ 0,50 fixos:
conferir qual vale para a conta no painel) — isso fere a regra de custo zero. A prova de ponta a ponta já foi feita em 06/11
(cobrança de R$ 1,00 com cupom e estorno). Confira tudo pelas **pré-visualizações**
do painel:

- [ ] **Marca:** ícone e logo aparecem certos; cores `#0085FF` e `#111C27` (ou invertidas).
- [ ] **Prévia do e-mail de recibo:** o ícone e o logo aparecem sobre o fundo de
  destaque (senão, inverter as cores ou usar destaque claro).
- [ ] **Logo:** legível na prévia do Checkout e do recibo; se não, campo Logo vazio
  (só o ícone).
- [ ] **Dados públicos:** nome "Stratum", `suporte@stratum-tool.com`, sem telefone,
  endereço **só Jundiaí, SP**, links de privacidade e termos.
- [ ] **Descritor:** `STRATUM` (7) ou `FINEAPPS STRATUM` (16), salvo sem erro.
- [ ] **Extrato do cartão usado em 06/11:** aparece `STRATUM`? (ainda não conferido)
- [ ] **Idioma padrão:** Português.
- [ ] **Recibos:** "Pagamentos bem-sucedidos" e "Reembolsos" ligados.
- [ ] **CNPJ** `27.340.695/0001-07` como número fiscal padrão.
- [ ] **Pré-visualização da fatura:** português, CNPJ, razão social, rodapé "não é
  nota fiscal", endereço só Jundiaí/SP.
- [ ] **Pré-visualização do recibo:** idem — e **nenhuma rua ou CEP**.
- [ ] **Portal:** pré-visualização com cabeçalho em português e as quatro opções como na seção 5.
- [ ] **Checkout:** pré-visualização com fundo branco, botão azul, logo legível.
- [ ] **E-mail:** chave "Send emails when card payments fail" desligada (o Stratum manda o dele);
  domínio de e-mail verificado **ou** anotado como "pago, esperar" se a tela mostrou preço.
- [ ] **Domínio de pagamento:** **NÃO ligado** (esperar o 1º cliente).
- [ ] Nenhuma tela pediu "Upgrade" ou cobrança nova — se pediu, foi anotada e não clicada.
- [ ] Me mandar prints de qualquer item ⚠ que ficou diferente do esperado.

A prova definitiva (o extrato do cartão e o recibo que chega na caixa do cliente)
vem com o **primeiro cliente**: peça um print do recibo dele e confira os mesmos itens.

---

## Fontes oficiais

- Marca: https://docs.stripe.com/get-started/account/branding
- Dados públicos: https://docs.stripe.com/get-started/account/set-up
- Recibos (o que é obrigatório no recibo): https://docs.stripe.com/receipts
- Descritor: https://docs.stripe.com/get-started/account/statement-descriptors
- Pix e descritor: https://docs.stripe.com/payments/pix
- Fatura (idioma, memo, rodapé, numeração): https://docs.stripe.com/invoicing/customize
- CNPJ na fatura: https://stripe.com/docs/invoicing/taxes/account-tax-ids?locale=pt-BR, https://docs.stripe.com/tax/invoicing/tax-ids e https://support.stripe.com/questions/merchant-tax-ids-on-invoices
- Planos do Invoicing (Plus = Orçamentos): https://stripe.com/invoicing/pricing
- E-mails de pagamento que falhou: https://docs.stripe.com/billing/revenue-recovery/customer-emails
- Idioma do Portal: https://docs.stripe.com/api/customer_portal/sessions/object e https://docs.stripe.com/customer-management
- Aparência do Checkout (o logo substitui ícone e nome): https://docs.stripe.com/payments/checkout/customization/appearance
- Taxa em estorno: https://support.stripe.com/questions/understanding-fees-for-refunded-payments
- Taxa do cartão no Brasil: https://stripe.com/en-br/pricing/local-payment-methods e https://stripe.com/en-BR/pricing (3,99% + R$ 0,39) · https://stripe.com/en-br/billing/pricing (3,99% + R$ 0,50, divergente)
- Billing (a partir de 0,7%): https://stripe.com/billing/pricing e https://support.stripe.com/questions/stripe-invoicing-pricing
- Links de pagamento e privacidade: https://docs.stripe.com/payment-links/customize
- Idiomas do Checkout: https://support.stripe.com/questions/supported-languages-for-stripe-checkout-and-payment-links
- Portal do cliente: https://docs.stripe.com/customer-management/configure-portal
- Domínio de e-mail: https://docs.stripe.com/get-started/account/email-domain e https://support.stripe.com/questions/custom-email-domain
- Domínio próprio (custo e DNS): https://support.stripe.com/questions/custom-domain-on-stripe-hosted-surfaces-faq e https://docs.stripe.com/payments/checkout/custom-domains
- Preços: https://stripe.com/pricing (para conta brasileira: stripe.com/br/pricing)

### Resumo do que ficou "a confirmar no painel"

1. Se o endereço de suporte aceita só "Jundiaí/SP" e se, vazio, o Stripe usa o endereço cadastral.
2. Se o telefone de suporte é obrigatório.
3. Preço do domínio de e-mail próprio e de modelos de fatura **adicionais** (nenhum publicado; o modelo padrão é para usar).
4. Caminho exato do domínio de e-mail no painel.
5. Disponibilidade do domínio próprio de pagamento para conta brasileira, se a cobrança vem em reais ou em dólar e se há preço fixo em R$.
6. Se o logo aparece no Portal, e se o logo (quase quadrado, com slogan) fica legível no Checkout e no recibo.
7. "pt-BR" × "pt" no Checkout e nos e-mails.
8. Tamanho do prefixo da fatura (3 a 12 ou 1 a 12) e do rodapé.
9. Se a Marca vale para os dois modos (teste e real).
10. Nuvem cinza (DNS only) na Cloudflare para os registros do Stripe.
11. Fonte Inter na lista do Checkout.
12. Se o fundo de destaque `#111C27` deixa o ícone e o logo visíveis nos e-mails, e se o fundo branco do Checkout se sobrepõe à cor de destaque.
13. Taxa fixa do cartão: R$ 0,39 ou R$ 0,50 por cobrança (as páginas oficiais divergem).
14. Percentual do Billing para conta brasileira.

---

## RESUMO PARA A MENSAGEM

Renato, a revisão do Stripe (T180) está em `documentacao/stripe/T180-REVISAO-STRIPE-PASSO-A-PASSO.md`. Resumo:

1. **Custo:** quase tudo é grátis. O único item pago é o domínio próprio da página
   de pagamento (pagamento.stratum-tool.com): **US$ 10/mês** — o Stripe pode cobrar
   em reais pelo câmbio "quando disponível", senão em dólar (a confirmar) —
   **esperar o 1º cliente**.
2. **Marca:** subir `public/icon-512.png` (ícone) e
   `public/branding/stratum-lockup-claro.png` (logo); cores `#0085FF` e `#111C27`.
   Conferir na prévia do Checkout e do e-mail de recibo: se o logo ficar ilegível ou
   o fundo escuro esconder a marca, deixar o Logo vazio ou inverter as cores.
3. **Dados públicos:** nome "Stratum", suporte@stratum-tool.com, **sem telefone**,
   endereço **só Jundiaí/SP**. Atenção: o recibo SEMPRE mostra o endereço de suporte;
   se o Stripe exigir rua e CEP, pare e me mande um print.
4. **Descritor:** manter `STRATUM` (7 caracteres) ou trocar para `FINEAPPS STRATUM` (16).
   Ainda falta ver no extrato do cartão de 06/11 se ele aparece.
5. **Fatura:** idioma português, CNPJ 27.340.695/0001-07 como padrão e um rodapé
   dizendo que a fatura **não é nota fiscal**.
6. **Recibos:** ligar "Pagamentos bem-sucedidos" e "Reembolsos".
7. **Portal:** mesmas opções de 06/11 + cabeçalho em português e links de termos e privacidade.
8. **Domínio de e-mail:** só se a tela não mostrar preço; na Cloudflare, só registros novos,
   sem segundo SPF. O DMARC atual (`aspf=r`) já atende o Stripe: não mexa.
9. **Sem compra de teste no modo real:** conferir tudo pelas pré-visualizações.
10. Do lado do código, deixei 7 tarefas para o agente (idioma fixo no Checkout, na
    fatura e no Portal; CNPJ do cliente na fatura, inclusive para quem já é cliente;
    endereço completo que ainda aparece no site, nos Termos e em documentos
    internos; promessa de NFS-e). Nenhuma foi feita; cada uma espera o seu "ok".
