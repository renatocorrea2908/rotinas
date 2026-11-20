# FineApps — Plano Único de Lançamento

**Versão 1 · 13/11/2026 (sexta)** · Empresa: FineApps Sistemas Ltda. · Produtos: Lendário, Plan2Travel (lojas Apple e Google) e Stratum (site)

Levantado dos repositórios em 13/11/2026: `rotinas` (Lendário), `Plan-2-Travel`, `stratum`, `fineapps-site`. Cada status abaixo saiu do código, do histórico de commits ou da documentação dos projetos — nada estimado sem fonte. Onde não foi possível conferir daqui, está escrito **"a conferir"**.

---

## 1. Painel geral

| Produto | Canal | Situação hoje | O que trava | Lançamento-alvo |
|---|---|---|---|---|
| **Stratum** | Site (stratum-tool.com) + app.stratum-tool.com | Produto em produção (p571), cobrança real pela Stripe validada em 06/11, site pronto na prévia desde 19/10 | Só o **Launch Gate**: apontar o domínio (20 min, roteiro pronto) + 2 decisões de segurança do cadastro (FD-79, FD-80) | **25/11/2026** |
| **Lendário** | Google Play + App Store | App pronto (Android e iPhone compilam no GitHub). Grátis, sem conta, sem coleta de dados. Ilustrações em 21 de 30 combinações | **Contas de desenvolvedor da FineApps** (dependem do D-U-N-S) + 9 combinações de arte + troca do identificador | Android **09/12** · iPhone **até 18/12** |
| **Plan2Travel** | Google Play + App Store (+ site já em produção com Mercado Pago) | App pronto (Android e iPhone compilam). Compra pela loja, restaurar e reembolso prontos. Textos legais aprovados pelo advogado (12–13/11) | **Contas de desenvolvedor** + contrato de apps pagos (Apple) + produtos cadastrados + domínio definitivo da base | Android **16/12** · iPhone **enviar até 18/12**; contingência **04–08/01/2027** |

**Caminho crítico da empresa:** `D-U-N-S → contas Apple e Google (como empresa) → cadastro dos apps → envio`. Tudo o que é dos apps espera isso. O Stratum não depende dele.

**Ponto de incerteza principal:** o prazo do D-U-N-S. A Apple fala em até 5 dias úteis, mas pode chegar a 30 dias. Se atrasar, as datas dos dois apps andam juntas, o Stratum não muda.

**Janela de recesso da Apple:** a revisão da App Store costuma parar entre o Natal e o Ano Novo. Envio para a Apple até **18/12** ou só a partir de **28/12**. (Confirmar o aviso oficial da Apple no início de dezembro.)

---

## 2. Cronograma consolidado (semana a semana)

| Semana | Comum (FineApps) | Lendário | Plan2Travel | Stratum |
|---|---|---|---|---|
| **S1 · 16–20/11** | **Pedir D-U-N-S (seg 16/11)** · Decidir identidade (C-03) · Páginas dos apps em fineapps.com.br · E-mail da empresa para as contas | Terminar as 9 combinações de arte · Trocar identificador · Teste no celular Android · Chave de assinatura | Decidir domínio da base · Teste no celular Android · Confirmar 1ª compra real no site | Decidir FD-79 e FD-80 · Agendar o Launch Gate |
| **S2 · 23–27/11** | Receber D-U-N-S (estimado) · **Abrir as contas Google Play e Apple como empresa** | Capturas novas das lojas (arte final) | Capturas (celular + iPad) · Corrigir ficha de privacidade (agora há conta) | Corrigir FD-79/80 · **Launch Gate 25/11** · DMARC |
| **S3 · 30/11–04/12** | Verificação Apple (estimada) · Inscrição no programa de 15% · Banco e impostos nas lojas | Criar o app nas duas lojas · Enviar AAB ao teste interno · Ligar TestFlight | Contrato de apps pagos · Cadastrar produtos e preços · Sign in with Apple | 1–2 empresas reais se cadastrando sozinhas (funil) |
| **S4 · 07–11/12** | — | **Android: produção (09/12)** · iPhone: enviar à revisão | Teste de compra nas lojas (sandbox e testadores) · Enviar Android à revisão | Primeira venda → configurar NFS-e |
| **S5 · 14–18/12** | — | **iPhone publicado** | **Android publicado (16/12)** · **iPhone: enviar à Apple até 18/12** | — |
| **Recesso · 21/12–02/01** | Sem envio à Apple | Acompanhar avaliações | Responder à revisão se voltar com pedido | — |
| **S8 · 04–08/01/2027** | Retrospectiva + plano do 1º trimestre | — | **Contingência do iPhone** (se a Apple pedir ajuste) | — |

---

## 3. Seção comum — atividades que afetam todos

| ID | Ação | Dono | Prazo | Depende de | Status |
|---|---|---|---|---|---|
| C-01 | **Pedir o D-U-N-S da FineApps Sistemas Ltda.** (gratuito; pela ferramenta de consulta da própria Apple, com o CNPJ e o endereço exatamente como no cartão CNPJ) | Renato | **16/11** | CNPJ (existe desde 08/10) | ⏳ não iniciado |
| C-02 | Criar um e-mail da empresa para as contas das lojas (ex.: `apps@fineapps.com.br` ou usar `contato@`) — a Apple pede e-mail e site com o domínio da empresa | Renato | 18/11 | — | ⏳ a conferir quais caixas existem |
| C-03 | **Decidir o padrão de identidade dos apps** — o identificador não muda depois do 1º envio. Hoje: Plan2Travel = `fineapps.plan2travel`; Lendário = `com.renatocorrea.lendario` (nome pessoal). **Recomendação: `fineapps.lendario`**, igual ao padrão do Plan2Travel | Renato decide · Jarvis troca | 18/11 | — | ⏳ decisão |
| C-04 | **Site fineapps.com.br:** incluir Lendário e Plan2Travel (hoje lista só Stratum e Valora) + página de privacidade e de suporte de cada app no domínio da empresa | Jarvis | 20/11 | C-03 | ⏳ |
| C-05 | **Conta Google Play como organização** (US$ 25, uma vez). Conta de empresa dispensa o teste fechado de 12 pessoas por 14 dias que a conta pessoal exige | Renato | 25/11 | C-01, C-02, C-04 | ⏳ |
| C-06 | **Apple Developer Program como organização** (US$ 99/ano). A Apple confirma por telefone que o Renato pode assinar pela empresa | Renato | 25/11 (verificação até ~04/12) | C-01, C-02, C-04 | ⏳ |
| C-07 | Conta bancária PJ e dados fiscais nas duas lojas (recebimento) | Renato | 04/12 | C-05, C-06 | ⏳ |
| C-08 | Inscrição na comissão de 15% (Apple Small Business Program; nível de 15% no Play Console) — sem isso a loja fica com 30% | Renato | 04/12 | C-05, C-06 | ⏳ |
| C-09 | Definir com o contador o tratamento da receita paga pelas lojas e a emissão de nota (vale também para Mercado Pago e Stripe) | Renato | 11/12 | primeira venda em qualquer canal | ⏳ |
| C-10 | Celulares de teste: um Android (APK de teste do GitHub) e um iPhone (TestFlight) | Renato | S1 / S3 | — | ⏳ |
| C-11 | Ritual semanal: 30 min às sextas para revisar este plano e mover datas | Renato + Jarvis | toda sexta | — | proposta |

**Custos de entrada da empresa:** US$ 25 (Google, uma vez) + US$ 99/ano (Apple) + domínio do Plan2Travel se decidido (C-03/P-01).

---

## 4. Lendário (hábitos em RPG — grátis, sem anúncio, sem conta)

**Repositório:** `rotinas` · **Pacote:** Capacitor (Android + iPhone) · **Situação:** pronto para loja do lado técnico desde 10/11; arte em produção desde então (59 commits em 4 dias).

**O que já está pronto**
- App Android e iPhone (`mobile/`), lembrete diário, vibração, armazenamento no aparelho, funciona offline.
- Montagem automática no GitHub: APK de teste sempre; pacote da Play Store quando a chave estiver cadastrada; envio ao TestFlight quando a chave da Apple estiver cadastrada.
- Textos das lojas, ícone, banner e 6 capturas por loja (`loja/`).
- Política de privacidade publicada (hoje em endereço pessoal do GitHub).
- Ilustrações completas: Humano, Elfo, Gigante, Goblin (5 classes cada) + Orc Guerreiro = **21 de 30 combinações**.

| ID | Ação | Dono | Prazo | Depende de | Status |
|---|---|---|---|---|---|
| L-01 | Terminar as ilustrações: **Orc** (Clérigo, Druida, Ladrão, Mago) e **Anão** (5 classes) = 9 combinações × 8 formas | Jarvis (com aprovação do Renato) | 20/11 | — | ⏳ 21/30 |
| L-02 | Trocar o identificador para o padrão escolhido em C-03 (Android, iPhone, link do app) | Jarvis | 19/11 | C-03 | ⏳ |
| L-03 | Mudar privacidade e suporte para fineapps.com.br (hoje: github.io pessoal e "issues" do GitHub — passa imagem de projeto pessoal) | Jarvis | 20/11 | C-04 | ⏳ |
| L-04 | Instalar o APK de teste no Android e percorrer: criar herói, hábitos, lembrete, conquistas | Renato | 20/11 | L-01 | ⏳ |
| L-05 | Gerar a chave de assinatura do Android e cadastrar os 4 segredos no GitHub (instrução vai à parte, nunca no repositório) | Jarvis prepara · Renato cadastra | 20/11 | L-02 | ⏳ |
| L-06 | **Refazer as capturas das lojas** — as atuais são de 10/11, antes da arte final e da retirada da personalização de pele/cabelo (12/11) | Jarvis | 27/11 | L-01 | ⏳ |
| L-07 | Google Play: criar o app, ficha (textos prontos), segurança de dados ("não coleta"), classificação Livre, enviar o AAB ao teste interno | Renato (Jarvis guia passo a passo) | 02/12 | C-05, L-05, L-06 | ⏳ |
| L-08 | Apple: criar o app no App Store Connect, gerar a chave da API e cadastrar os 4 segredos → envio automático ao TestFlight | Renato | 04/12 | C-06, L-02 | ⏳ |
| L-09 | Teste final no TestFlight (iPhone) e no teste interno (Android) | Renato | 08/12 | L-07, L-08 | ⏳ |
| L-10 | **Android: liberar em produção** | Renato | **09/12** | L-09 | ⏳ |
| L-11 | **iPhone: enviar à revisão** (notas para o revisor já escritas em inglês) | Renato | 10/12 | L-09 | ⏳ |
| L-12 | iPhone publicado (margem para 1 rodada de ajuste antes do recesso) | — | **até 18/12** | L-11 | ⏳ |

**Fora do caminho crítico:** sem compras e sem anúncios, o Lendário não precisa do contrato de apps pagos nem de conta bancária para ir ao ar — é o app que destrava as contas e serve de "primeiro envio" da FineApps.

---

## 5. Plan2Travel (plano de mudança de país — pago: Básico R$ 197 / Completo R$ 697)

**Repositório:** `Plan-2-Travel` · **Pacote:** Capacitor (Android + iPhone) · **Situação:** site vendendo em modo produção (Mercado Pago, liberação assinada pelo servidor); app tecnicamente pronto desde 11/11; conta do cliente com login por e-mail, Google e Microsoft; termos, privacidade, suporte e reembolso aprovados pelo advogado em 12–13/11; 886 testes passando (11/11).

**O que já está pronto**
- Compra dentro do app (dois produtos de compra única), restaurar compras, plano reembolsado deixa de abrir.
- Funciona offline; base de fatos atualizada sem versão nova do app.
- Ícone e tela de abertura definitivos; e-mail de suporte `contato@fineapps.com.br`.
- Riscos de recusa da Apple (app "site embrulhado", diretriz 4.2) tratados no desenho; continua sendo um risco de julgamento do revisor.

| ID | Ação | Dono | Prazo | Depende de | Status |
|---|---|---|---|---|---|
| P-01 | **Decidir o domínio definitivo da base de fatos.** Hoje o app busca a base em `plan2travel.renato-correa-2908.workers.dev` — endereço pessoal que fica **gravado no app**: se mudar depois, as versões já instaladas param de receber atualização. Opções: `plan2travel.com.br` ou `plan2travel.fineapps.com.br` | Renato decide · Jarvis ajusta | 18/11 | — | ⏳ decisão |
| P-02 | Instalar o APK de teste no Android e percorrer: questionário, diagnóstico, compra simulada, plano, voltar, compartilhar, login | Renato | 20/11 | — | ⏳ |
| P-03 | Confirmar a 1ª compra real no site (Mercado Pago produção): pagar, liberar, reembolsar — fecha a lista de 13 pontos "a confirmar no primeiro pagamento" do `servidor/LEIAME.md` | Renato compra · Jarvis confere | 20/11 | — | ⏳ a conferir se já foi feita |
| P-04 | **Corrigir a resposta de privacidade das lojas.** O documento das lojas diz "o aplicativo não coleta dados", mas desde 12/11 há conta (e-mail) e o plano é sincronizado no servidor. A ficha precisa declarar e-mail e conteúdo do usuário, vinculados à conta | Jarvis prepara · Renato preenche | 27/11 | — | ⏳ |
| P-05 | Capturas de tela (celular e iPad — o app gira no tablet) e descrição da ficha | Jarvis | 27/11 | P-01 | ⏳ |
| P-06 | Decidir países de venda (hoje só português → recomendação: só Brasil no lançamento) | Renato | 27/11 | — | ⏳ decisão |
| P-07 | Decidir o complemento Básico → Completo (hoje desligado; quem tem o Básico paga o Completo cheio) | Renato | 27/11 | — | ⏳ decisão |
| P-08 | Apple: **contrato de apps pagos**, banco e formulários fiscais — sem isso a compra dentro do app não funciona | Renato | 04/12 | C-06, C-07 | ⏳ |
| P-09 | **Sign in with Apple:** configurar no Apple Developer e no Supabase. A Apple exige essa opção quando o app oferece login com Google | Renato (Jarvis guia) | 04/12 | C-06 | ⏳ |
| P-10 | Cadastrar o app nas duas lojas (`fineapps.plan2travel`) e os produtos `…basico` e `…completo`. As lojas usam tabela de preço própria: R$ 197 / R$ 697 podem não existir exatos — escolher o mais próximo | Renato | 04/12 | C-05, C-06 | ⏳ |
| P-11 | Chave de assinatura do Android e segredos da Apple no GitHub | Jarvis prepara · Renato cadastra | 04/12 | C-05, C-06 | ⏳ |
| P-12 | **Teste de compra real nas lojas** (testadores da Play; sandbox/TestFlight da Apple): comprar, restaurar, reembolsar | Renato | 11/12 | P-08, P-10, P-11 | ⏳ |
| P-13 | Android: enviar à revisão → **produção 16/12** | Renato | 11/12 | P-12 | ⏳ |
| P-14 | **iPhone: enviar à Apple até 18/12** (ficha destacando funcionamento offline e plano interativo) | Renato | 18/12 | P-12 | ⏳ |
| P-15 | Contingência: responder a pedidos de ajuste da Apple | Jarvis + Renato | 04–08/01 | P-14 | — |

**Números para decisão (do próprio projeto):** líquido por venda com comissão de 15% — Básico R$ 167,45 · Completo R$ 592,45 (com 30%: R$ 137,90 · R$ 487,90), antes dos impostos.

**Documento das lojas desatualizado:** `docs/app-lojas.md` ainda diz textos "provisórios" (já aprovados) e "não coleta dados" (deixou de valer). Atualizar junto com P-04.

---

## 6. Stratum (ERP — lança no site, R$ 350/mês, 60 dias grátis, venda 100% on-line)

**Repositório:** `stratum` · **Situação:** produção na p571 (13/11); Stripe em modo real validado de ponta a ponta em 06/11; login com Google em produção; site `stratum-tool.com` pronto desde 19/10, com preço lido do app; domínio ainda mostra "Lançamento em breve" (estado medido em 16/10 — a conferir no dia).

| ID | Ação | Dono | Prazo | Depende de | Status |
|---|---|---|---|---|---|
| S-01 | **Decidir FD-79** — o limite de 3 links de cadastro por e-mail em 24 h pode ser esgotado por terceiros (alguém se cadastra 3× com o e-mail de outra pessoa e trava o cadastro dela). Relevante assim que o cadastro for público | Renato | 18/11 | — | ⏳ decisão |
| S-02 | **Decidir FD-80** — membro removido de uma empresa mantém as liberações de módulo se voltar | Renato | 18/11 | — | ⏳ decisão |
| S-03 | Implementar S-01 e S-02 | Jarvis | 24/11 | S-01, S-02 | ⏳ |
| S-04 | DMARC: editar o registro, manter `quarantine`, relatórios para `dmarc@stratum-tool.com` (pode ser antes do Launch Gate) | Renato | 20/11 | — | ⏳ |
| S-05 | **Launch Gate:** ligar `stratum-tool.com` ao projeto do site na Vercel e trocar 2 registros na Cloudflare (roteiro de 20 min em `documentacao/ROTEIRO-DOMINIO-SITE.md`) → Jarvis publica a versão que manda visitante sem conta para o site | Renato + Jarvis | **25/11** | S-03 | ⏳ |
| S-06 | Trazer 1–2 empresas reais para se cadastrarem sozinhas; acompanhar onde param no funil | Renato | 30/11–11/12 | S-05 | ⏳ |
| S-07 | Primeira venda → configurar a nota fiscal de serviço (a Stripe cobra, não emite) | Renato | na 1ª venda | S-05 | ⏳ |
| S-08 | Testar o login com Microsoft com o primeiro usuário que tenha Microsoft 365 | Renato | com o 1º usuário | — | ⏳ |
| S-09 | Anúncios do Google e aviso de cookies: prontos e **desligados** até a Política (seção 5) revisada pelo jurídico. Só ligar se houver campanha paga | Renato | quando decidir anunciar | jurídico | ⏸ |
| S-10 | Revisão jurídica dos termos de estágio e bolsa (FD-70b) | Renato | sem data | — | ⏸ fora do pacote vendido |
| S-11 | Homologar a 1ª transmissão do eSocial (FD-67b) — adiado pelo Renato em 13/11 | — | quando houver cliente de Folha | — | ⏸ |

**Contraponto do Jarvis:** a "bateria de testes pré-go-live" (172 casos) ainda aparece como pendência do go-live, mas foi escrita na p184 (julho) e o produto está na p571 — boa parte cobre módulos que **não estão no pacote vendido** (R$ 350 = Suprimentos + Reembolso de Despesas + Suporte). **Recomendação:** não segurar o Launch Gate por ela; rodar só o recorte do que se vende (cadastro, teste grátis, Suprimentos, Reembolso, cobrança) antes de 25/11, e o resto vira backlog.

**Pendências internas que não travam o lançamento:** p550 (provas do AI Company OS, M721 não aplicada) e p524/M702 (saída do Company OS antigo) — não mergeadas.

---

## 7. Decisões que dependem do Renato (em ordem de urgência)

| # | Decisão | Por que agora | Recomendação do Jarvis | Até |
|---|---|---|---|---|
| 1 | Pedir o D-U-N-S (C-01) | É o caminho crítico dos dois apps | Fazer na segunda, 16/11 | 16/11 |
| 2 | Identificador do Lendário (C-03) | Não muda depois do 1º envio | `fineapps.lendario` | 18/11 |
| 3 | Domínio da base do Plan2Travel (P-01) | Fica gravado no app instalado | `plan2travel.com.br` (marca própria; serve também ao site de venda) | 18/11 |
| 4 | FD-79 e FD-80 do Stratum (S-01, S-02) | Precedem o cadastro público | Corrigir os dois antes do Launch Gate | 18/11 |
| 5 | Data do Launch Gate (S-05) | Stratum não depende das lojas | 25/11 | 20/11 |
| 6 | Valora no site da FineApps | O site institucional lista Valora, que não está neste plano | Tirar do site até ter data, ou incluir aqui | 20/11 |
| 7 | Países de venda e complemento do Plan2Travel (P-06, P-07) | Entram no cadastro dos produtos | Só Brasil; complemento desligado no lançamento | 27/11 |

---

## 8. Riscos

| Risco | Efeito | Como tratar |
|---|---|---|
| D-U-N-S demorar até 30 dias | Apps escorregam para janeiro | Pedir já; se passar de 27/11 sem número, ligar para a Dun & Bradstreet. O Stratum segue em 25/11 de qualquer jeito |
| Apple recusar o Plan2Travel como "site embrulhado" (4.2) | Atraso no iPhone | Já tratado no desenho; ficha destacando offline e plano interativo; contingência em 04–08/01 |
| Recesso da Apple | Envio de 19/12 em diante só anda em janeiro | Envios do iPhone até 18/12 |
| Tempo do Renato | Três frentes na mesma semana (S1–S3) | Jarvis faz tudo que é técnico; para o Renato ficam só contas, decisões e testes no celular, cada um com passo a passo |
| Ficha de privacidade errada (Plan2Travel) | Recusa ou remoção da loja | P-04 antes do cadastro |

---

## 9. Fora deste plano

- **Valora** — tem Termos de Uso publicados no site da FineApps, mas não entrou na lista de produtos (decisão 6).
- **AI Company OS II** — ferramenta interna da empresa; não é produto de loja.
- **Financial App Control** — controle financeiro pessoal; não é produto da FineApps.

## 10. Fontes

- Lendário: `rotinas/PUBLICAR.md`, `rotinas/loja/TEXTOS-DAS-LOJAS.md`, `rotinas/.github/workflows/android.yml`, `rotinas/jornada/art/`
- Plan2Travel: `Plan-2-Travel/docs/app-lojas.md`, `Plan-2-Travel/servidor/LEIAME.md`, `site/config.publicado.json`, `app/config.json`, histórico até 13/11
- Stratum: `stratum/CLAUDE.md`, `documentacao/HANDOFF-ATUAL.md`, `documentacao/ROADMAP-GO-LIVE.md`, `documentacao/ROTEIRO-DOMINIO-SITE.md`, `documentacao/FILA-DEPOIS.md`
- Site institucional: `fineapps-site/LEIA-ME.md`, `fineapps-site/index.html`
