# Como publicar o Lendário

## O que já está pronto
- App Android e iOS em `mobile/` (Capacitor), com ícone, tela de abertura, lembrete diário, vibração e armazenamento nativo.
- Montagem automática no GitHub a cada atualização (aba Actions → "App Android e iOS"):
  - APK de teste do Android, sempre.
  - Pacote da Play Store (`app-release.aab`), quando a chave de assinatura estiver cadastrada nos Secrets.
  - Verificação de que o app de iPhone compila.
- Textos, capturas de tela, banner e ícone das lojas em `loja/`.
- Política de privacidade: https://renatocorrea2908.github.io/rotinas/jornada/privacidade.html

## Google Play (Android)
1. Crie a conta em https://play.google.com/console (US$ 25, pagamento único). Conta pessoal pede verificação de identidade e um teste fechado com 12 testadores por 14 dias antes de liberar ao público; conta de empresa (CNPJ + D-U-N-S) não exige o teste.
2. Cadastre os 4 Secrets da chave no GitHub (instruções no arquivo enviado à parte, que NÃO fica no repositório).
3. Rode o workflow de novo (Actions → "App Android e iOS" → Run workflow) e baixe `app-release.aab`.
4. No Play Console: Criar app → preencher textos de `loja/TEXTOS-DAS-LOJAS.md` → enviar o `.aab` em "Teste fechado" → depois "Produção".

## Apple App Store (iPhone)
1. Crie a conta em https://developer.apple.com/programs (US$ 99/ano). Como empresa, precisa de D-U-N-S do CNPJ.
2. No App Store Connect, crie o app com o identificador `com.renatocorrea.lendario`.
3. Gere uma chave da API do App Store Connect (Users and Access → Integrations → App Store Connect API) e cadastre no GitHub como Secrets: `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` (conteúdo do arquivo .p8) e `APPLE_TEAM_ID`.
4. Com isso, a montagem assinada e o envio ao TestFlight podem ser automatizados no GitHub (Mac na nuvem), sem precisar de um Mac.
