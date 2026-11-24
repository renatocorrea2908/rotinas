# Como publicar o Be Your Hero

## O que já está pronto
- App Android e iOS em `mobile/` (Capacitor), com ícone, tela de abertura, lembrete diário, vibração e armazenamento nativo.
- Montagem automática no GitHub a cada atualização (aba Actions → "App Android e iOS"):
  - APK de teste do Android, sempre.
  - Pacote da Play Store (`app-release.aab`), quando a chave de assinatura estiver cadastrada nos Secrets.
  - Verificação de que o app de iPhone compila.
- Textos, capturas de tela, banner e ícone das lojas em `loja/`.
- Política de privacidade: https://fineapps.com.br/privacidade-be-your-hero

## Google Play (Android)
1. Crie a conta em https://play.google.com/console (US$ 25, pagamento único). Conta pessoal pede verificação de identidade e um teste fechado com 12 testadores por 14 dias antes de liberar ao público; conta de empresa (CNPJ + D-U-N-S) não exige o teste.
2. Cadastre os 4 Secrets da chave no GitHub (instruções no arquivo enviado à parte, que NÃO fica no repositório).
3. Rode o workflow de novo (Actions → "App Android e iOS" → Run workflow) e baixe `app-release.aab`.
4. No Play Console: Criar app → preencher textos de `loja/TEXTOS-DAS-LOJAS.md` → enviar o `.aab` em "Teste fechado" → depois "Produção".

## Apple App Store (iPhone)
1. Crie a conta em https://developer.apple.com/programs (US$ 99/ano). Como empresa, precisa de D-U-N-S do CNPJ.
2. No App Store Connect, crie o app com o identificador `fineapps.beyourhero`.
3. Gere uma chave da API do App Store Connect (Users and Access → Integrations → App Store Connect API) e cadastre no GitHub como Secrets: `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` (conteúdo do arquivo .p8) e `APPLE_TEAM_ID`.
4. Com isso, a montagem assinada e o envio ao TestFlight podem ser automatizados no GitHub (Mac na nuvem), sem precisar de um Mac.

## Autorização do Renato para publicar (19/11/2026)
Pode publicar sem pedir ok, avisando depois, quando TODOS valerem:
- testes passaram;
- revisão independente aprovou;
- nenhuma mudança apaga ou altera dados em produção (nos aparelhos dos usuários, inclusive formato do armazenamento `lendario.db`);
- fora de período de congelamento.

Continua precisando do ok do Renato: preço e cobrança; texto jurídico ou ao cliente (lojas, telas, avisos); apagar dados; gasto novo; decisão de produto.

## Regra de 24/11/2026 (confirmada pelo Renato diretamente no chat do Herus) — substitui a de 19/11
1. O **Jarvis** decide em nome do Renato tudo o que tiver revisão de quem cuida do assunto: Judge (jurídico e texto ao cliente), Connor (fiscal), Mark (marketing) ou revisão independente (código). Inclui texto jurídico, texto ao cliente e publicar na main. → Mandar a proposta já revisada ao Jarvis.
2. Fica **só com o Renato**: gasto novo; preço e cobrança; apagar dados de cliente; estratégia (produto/módulo novo, posicionamento, datas de lançamento); e o que só o login dele faz (Apple, Google, Stripe, Vercel, banco, gov.br) — nesses casos, propor chave de acesso que tire o clique dele.
3. Ninguém espera clique de permissão do Renato: se uma ação for recusada, avisar o Jarvis e seguir com o resto.
4. Time: Adm: Jarvis (session_014uWdppSG8XxXbbjSZE7uDQ). Apps: Herus (BYH), Travis (P2T, session_014uWdpmuhJjeqEefk4Quq7o). Empresa: Mark, Bia, Judge, Connor. Stratum: Stray, Stella, Rita, Nix.
