# Jarvis, administração da FineApps: passagem de bastão (20/11/2026)

> Este documento é escrito pelo Jarvis antigo (session_014uWdpnTXEMi8an31kHHfkg) para o Jarvis novo.
> Motivo da troca: em 19/11, o Renato liberou a sessão antiga para usar o Mac dele (edição do ROPA).
> Essa liberação é PERMANENTE. Desde então, os outros chats não conseguem mandar mensagem a ela, e as
> tarefas agendadas que a acordam falham com ACCESS_DENIED (a leitura de hora em hora falhou em 19/11 20:07 UTC; o resumo das 8h37 falhou em 20/11).
> REGRA NOVA: o Jarvis de administração NUNCA pede essa liberação. Se precisar do Mac, crie uma sessão
> SEPARADA (create_session no ambiente bridge "Mac-Renato:stratum", env_01JraqAoobJ5EYiw1QDzzLzN) e só ela pede.

## 1. Quem é o Renato e como trabalhar
- Renato Correa, CEO da FineApps Sistemas Ltda. (CNPJ 27.340.695/0001-07, Jundiaí/SP). **Não é dev.**
- Você é o **Jarvis**: chat de ADMINISTRAÇÃO (contas, domínios, cronograma, decisões, acompanhamento). O código fica nos chats de produto.
- Responda em português direto, sem jargão. Quando a ação for dele, dê o passo a passo clique por clique ("DE-TA-LHE"). Contrarie quando os dados pedirem, como um sócio sênior. Confira os fatos antes de responder e nunca teorize.
- Custo zero até o primeiro cliente. Nada vai para a produção sem o ok dele. Um item por vez, sempre com recomendação. Segredo nunca entra no chat.
- **Autorização permanente (19/11), dada por ele nos chats de produto:** "pode publicar sem me pedir ok quando os testes passarem, a revisão independente aprovar, não houver mudança que apague ou altere dados em produção e estiver fora de congelamento. Me avise depois. Continua precisando do meu ok: preço e cobrança, texto jurídico ou ao cliente, apagar dados, gasto novo e decisão de produto." O Judge acrescentou: mudança de texto mostrado ao usuário é texto ao cliente; mudança no tratamento de dados espera a Política ser atualizada antes.

## 2. A Mesa do Renato (artifact): REGRAS
- Slug **76b45c6a-a878-4908-b6a6-78a84275274e** · https://claude.ai/artifact/FfAzR4uWhhjceAJd86otDB · fonte em `jarvis-admin/FineApps_Mesa_do_Renato.html` (repo rotinas, branch claude/hopeful-ritchie-tjcl3f), igual à versão publicada em 20/11 14:03 UTC.
- A página tem "mesas" que abrem e fecham (`<details class="mesa">`): **Mesa do Renato — só o que depende de você agora** (a 1ª, aberta), uma por chat (Stray, Travis, Herus, Bia, Connor, Mark, Judge), Terceiros, Feito hoje, Feito em 19/11, Feito em 17 e 18/11.
- **REGRA DO RENATO (19/11, gritada):** na mesa dele SÓ entra o que depende DELE AGORA. O resto vai para a mesa do chat responsável e só volta quando precisar dele. Nas mesas dos chats, nunca escrever "sua mesa" nem "para você"; escrever "mesa do Renato".
- Cards: `<div class="card">` (ou `card agora`) com `<span class="n">N</span>`, título `.t`, `.tag`, parágrafos `.rec` e `.resp`. O `.resp` traz a resposta esperada em `<b>"N ok"</b>`. Um script na página transforma cada `<b>"..."</b>` do `.resp` em **botão**: o clique manda a resposta como comentário "Send to Claude", que acorda o dono da página (declarado `capabilities: {comments: {}}`). Há também o botão "Outra resposta…", que abre o compositor de comentário.
- ⚠ ATENÇÃO: os comentários acordam a SESSÃO DONA do artifact. Depois da troca, confira se os comentários da Mesa chegam a você (o dono é o usuário, não a sessão; o aviso de comentário costuma ir para a sessão que publicou por último. Republique a Mesa uma vez a partir da sessão nova).
- ⚠ BUG que já aconteceu: ao REMOVER um card, cortei até o próximo `</div>\n\n` e apaguei o título da mesa do Stray. Ao remover, corte do `<div class="card` até o `</div>` que fecha o card, logo depois do `<p class="resp">…</p>`, e confira com um headless que as `<summary>` continuam todas lá (são 12).
- Numeração atual: o último item foi o **113** (homologação T70, concluída). O próximo item novo é o **114**.
- Hoje (20/11) a mesa do Renato está **VAZIA** ("Nada depende de você agora").

## 3. Cronograma Único v2 (artifact)
- Slug **52e3524e-e617-42dc-ad79-3377b1f80170** · https://claude.ai/artifact/BEekexzQ5FQ6jfCKqTzSns · fonte `jarvis-admin/FineApps_Cronograma_Unico_v2.html`.
- O estado fica em `<script type="application/json" id="state">` (tarefas com id, wbs, name, ini, fim, owner, status, pct, notas; fases; historico[0] = texto corrido; apendar nele).
- Manter a v2 até o Renato pedir versão nova. **Sempre que mudar: republicar E mandar o arquivo para baixar** (SendUserFile).
- Tarefas novas de 19/11: T190 (Marco Civil no Stratum), T191 (Marco Civil no site), T192 (Política do Stratum T38 + Anthropic), T193 (ROPA rev. 2, concluída em 20/11), T194 (acordos da Acta com o advogado). T175 (LinkedIn) em andamento, 40%.

## 4. Os chats (equipe nomeada em 19/11)
| Nome | Área | Sessão |
|---|---|---|
| **Stray** | Stratum (código, produção) | session_014uWdpot2e387vopUAzU8sP |
| **Travis** | Plan2Travel | session_014uWdpn4vBeqs3ekVpgbepn |
| **Herus** | Be Your Hero (código, lojas; vigia e-mails da Apple/Google a cada 3h) | session_01LxsooUCbLW2SA9eBXasRYm |
| **Bia** | Site FineApps (fineapps.com.br) | session_014uWdpkQFTybSsUuNfi5ons |
| **Connor** | Contabilidade, fiscal e trabalhista de folha/ponto (faz o papel do contador e do advogado trabalhista) | session_014uWdpnviLeiiqadjZBxfEX |
| **Mark** | Marketing (conteúdo, régua de afirmações, campanhas; código fica com os produtos) | session_014uWdpksK9bPyCY1YWX4LWd |
| **Judge** | Jurídico (termos, privacidade, LGPD, contratos, notas para o advogado humano) | session_014uWdpkrHeEgftKdMCZfwuo |
| Nix | Suporte automático do Stratum (sessão fixa) | session_014uWdpkGjnB5BQXVuaiafZh |
| Mac (ROPA) | Sessão no Mac do Renato (bridge); tarefa encerrada | session_014uWdpmDe28or9uzKxzy2Tr |
- Desde 19/11 os chats escrevem recados ao Jarvis no próprio chat, em linhas "PARA O JARVIS:", porque a sessão antiga não recebia mensagens. **Na primeira coisa que fizer, avise todos que podem voltar a usar send_message para você** (o novo ID).
- O advogado humano não tem contato com os chats: o Judge prepara o texto, o Renato manda pelo WhatsApp e cola a resposta.

## 5. Tarefas agendadas
Já foram reapontadas para a sessão nova pelo Jarvis antigo (confira com list_triggers):
- **Resumo dos chats FineApps** — dias úteis às 8h37 (America/Sao_Paulo): ler todos os chats, atualizar a Mesa e o cronograma, resumo curto ao Renato.
- **Plan2Travel: renovar o segredo do "Entrar com a Apple"** — 04/05/2027. Key ID **FU7QXT8DC4** (NÃO a 79DT7W2RKN, que é do BYH); gerar no Chrome.
- **Crédito do Google Ads: conferir em 04/12.**
- Do Stray: "T181 — novo link da prévia do site" em 23/11 (manda o link ao Jarvis).
- Do Herus: checagem dos e-mails da Apple e do Google a cada 3h.

## 6. Estado em 20/11/2026 ~11h BRT
**Feito em 19–20/11**
- **Homologação T70 do Stratum APROVADA** (20/11): todas as cenas rodaram de ponta a ponta em produção. **10 achados** com o Stray:
  - 1: celular sem logout;
  - 2, 4, 6, 7: em Suprimentos, a REQUISITANTE não recebe e-mail nem sino (aprovada, cotada, OC, recebida). No Reembolso funciona. Regra do Renato: e-mail E sino;
  - 3: preço da concorrência escondido na coluna "Itens";
  - 5: o botão "Gerar OC" continua depois de gerada (risco de OC duplicada);
  - 8: tela de aprovação de RD quebrada no celular (Confirmar escondido atrás da barra);
  - 9: a reaprovação não aparece na Central de Aprovações (o Renato mandou corrigir);
  - 10: "Valor real R$ 0,00" na reaprovação (o Renato mandou corrigir).
  O Stray manda o plano sem atrasar o passo 5. O comando para ressemear a Empresa Demo vem do Stray e vai à mesa do Renato (opcional, antes da próxima apresentação).
- **A19 (ordem do Renato, "implementar já"):** a frase "lê razão social, CNPJ e contatos, confere o CNPJ e completa o que falta". Hoje só o LER existe. O Stray implementa: dígito verificador + consulta à Receita (BrasilAPI) pelo servidor + preencher os campos vazios com a origem marcada + aviso se a Receita estiver fora. O Mark mantém a A19 barrada até o Stray confirmar NO AR. Avise o Judge de que a BrasilAPI vira fornecedor de consulta.
- **p597** no ar (CNPJ e razão social obrigatórios para assinar). Passo 5 da nota automática: prioridade 1; p598 em 08/12; TRAVA 4 em 20/01; prazo duro ~01/02.
- **Site fineapps.com.br** no ar (19/11): rodapé "Jundiaí, SP", Política v2 (só o site, remetendo a cada produto), Patrion fora. A Vercel está no plano **Pro** (medido; não é Hobby).
- **ROPA (registro LGPD) revisão final:** OneDrive › FineApps/Dev/ropa-fineapps.xlsx (sem nenhum item amarelo); anteriores em arquivo/ropa-backups (v1-ate-19nov, v2-19nov). ⚠ O OneDrive do Mac está ATRASADO em relação à nuvem: não grave nada no OneDrive pelo Mac. Leitura e renomeação pela nuvem com as ferramentas Microsoft 365 (sharepoint_*), que funcionam. Edição de xlsx: só gerando arquivo NOVO (pelo Mac) e trocando nomes pela nuvem.
- Advogado aprovou em 19/11: a base legal do uso do Claude (Anthropic, art. 33, IX c/c art. 7º, V) e os e-mails da campanha T38 (consentimento, guarda de 5 anos, lista de bloqueio, rodapé "Jundiaí/SP", prova da pesquisa T9). A Política do Stratum nova (T192 = T38 + base da Anthropic + DPA v11) está na fila do Stray e precisa do ok do Renato no chat do Stray (texto jurídico). A campanha de e-mails só começa depois disso.
- Acordos de ponto da Acta (banco de horas, 16 cláusulas; ponto por exceção, 11): enviados ao advogado em 19/11 ("104 tudo"). Esperando o parecer → Connor (regras 🔒) e Judge (redação).
- Marco Civil (106 ok): o Stray grava IP, data e hora de cada login por 6 meses (T190, antes das vendas ~25/01). A Bia faz o registro de acesso do site pela Cloudflare (opção A, proxy ligado + Worker + D1; T191, depois da T70; passo a passo dos cliques do Renato vem dela).
- Mark: e-mails do teste T49 aprovados ("108 ok"), no ar antes de 08/12 (Stray). Campanha Google Ads liga ~10/12. A pesquisa T9 está LIBERADA (fonte: OneDrive › FineApps/7. Marketing/7.1/"09 - Pesquisa ICP_concluída.pdf"). Pós-T70: o Mark revisa os 42 textos com 2 ressalvas (requisitante em Suprimentos sem aviso; reaprovação fora da Central).
- LinkedIn T175: app "FineApps Publicador" criado, pedido da Community Management API enviado em 19/11 (Direct Advertiser; Page management + analytics). Esperando o e-mail da Microsoft Vetting em renato@fineapps.com.br.
- Stripe T180: o e-mail com domínio próprio (stratum-tool.com) é grátis; o Stray manda o passo a passo. A página de pagamento com domínio próprio NÃO (cobrada mensalmente; regra do custo zero).
- **Lojas:**
  - **Be Your Hero iPhone APROVADO** pela Apple (19/11 17h55; liberação manual). Espera o Android (Google, 1.0.88 em revisão) para publicar junto. Preço de lançamento R$ 29,90 por 30 dias a partir da publicação, com a data de fim cadastrada nas duas lojas pelo Renato ("109 ok"); o Herus traz o passo a passo no dia.
  - **Plan2Travel** em revisão na Apple (0.1.0 + 3 compras) e no Google (0.1.0 (2), enviado em 19/11). Código de revisor P2T-76FW-773S-9EBH (vence 18/01/2027). Depois da aprovação do Google: o Travis pede o ok do Renato para APAGAR o código. O banco do P2T fica em **us-east-1 (EUA)**: o Judge analisa no inventário do P2T.
- O BYH vigia os e-mails das lojas. Aprovação = "PARA O JARVIS: URGENTE".

**Lembretes**
- Pendência menor do ROPA: arquivar o PDF do DPA da Oracle vigente (oracle.com/contracts).
- O DPA da Stripe já está no Drive (Stratum/Compliance/DPAs/stripe-dpa-2026-09-01.pdf, versão de 18/11/2025).
- 23/11 (seg): o Stray manda o link novo da prévia do site do Stratum (T181) → mesa do Renato para revisão (até 05/12).
- 24/11: começa a fila de posts T176a (Stray constrói; Mark faz régua e modelos; o Renato testa e aprova até 05/12; 1º post 10/12).
- 04/12: conferir campanhas e crédito do Google Ads.

## 7. Ferramentas e acessos que funcionam
- claude-code-remote: list_sessions, list_events (kinds ["result"] mostra as respostas finais), send_message, create/update/delete_trigger.
- Artifacts: publish_files / edit_version (Mesa e cronograma), comments (reply_comment às vezes dá "not found": responda na conversa).
- Microsoft 365 (OneDrive do Renato): sharepoint_search, read_resource (lê xlsx/pdf como texto), move/rename.
- Google Drive/Gmail (Renato): leitura.
- Supabase MCP: projetos AI Company OS (sa-east-1) e plan2travel (us-east-1) na org do OS. O Stratum de produção (hvkmwdinnfpprhgxpfzw) não está nesse MCP.
- Vercel MCP (team FineApps team_SEqmefBjQpaO7MdjQJAJLGdd).
- stripe.com e oracle.com são bloqueados pelo proxy desta nuvem.

## 8. Primeiros passos do Jarvis novo
1. Leia este documento e os arquivos de `jarvis-admin/` (repo rotinas, branch claude/hopeful-ritchie-tjcl3f).
2. Avise TODOS os chats do seu ID e de que voltaram a usar send_message.
3. Republique a Mesa a partir desta sessão (mesmo conteúdo) e teste um botão com o Renato, para garantir que os comentários acordam você.
4. Confira as tarefas agendadas (list_triggers) e se o resumo das 8h37 aponta para você.
5. Diga ao Renato, em 3 linhas, que assumiu e que a mesa dele está vazia.
