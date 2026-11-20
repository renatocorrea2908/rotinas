# T70 — Homologação final do Stratum · sexta 20/11 (feriado nacional: Consciência Negra)

Horário: comandos A e B às 9h15 · cena 0 às 9h30 · fim ~11h10. Plano B: segunda 23/11, mesmo horário.
O chat do Stratum congela as publicações das 9h às 12h.

## Ter em mãos
- 3 perfis/navegadores separados (Ana, Carla, reserva) + o celular (Marcos). Janela anônima NÃO serve (divide a sessão).
- Uma senha nova, que você escolhe e digita no Comando A (vale para as 3 pessoas). Não cole no chat.
- Pasta ~/Desktop/T70 com os 3 PDFs (Comando B).
- Uma foto de caixas e uma foto de recibo.
- Painel da Resend aberto (os e-mails @resend.dev não são caixas reais).
- Planilha: cena / passou? / o que vi.
- Endereço: app.stratum-tool.com

## Comando A — às 9h15 (Terminal do Mac)
```bash
cd ~/Claude/Dev/stratum && rm -f .git/HEAD.lock && git pull && read -s "DEMO_SENHA?Senha das três pessoas da Empresa Demo: " && export DEMO_SENHA && unset SUPABASE_ACCESS_TOKEN && node scripts/demo/semear-empresa-demo.mjs --producao --modulos=suprimentos,rd && node scripts/demo/semear-empresa-demo.mjs --producao --conferir
```
Esperado: "as 13 compras estão no estado planejado" e "✓ a demo está pronta para a reunião."
Se aparecer ✗ pré-voo ou ✗ escada: nada foi apagado. Pare e mande print.

## Comando B — logo depois (gera os 3 PDFs em ~/Desktop/T70)
```bash
cd ~/Claude/Dev/stratum && node --input-type=module -e "
import {pdfProposta,FORNECEDORES} from './scripts/demo/plano-suprimentos-rd.mjs'; import {writeFileSync,mkdirSync} from 'node:fs'
const d=process.env.HOME+'/Desktop/T70'; mkdirSync(d,{recursive:true})
for (const [n,arq,u,p] of [['Rede Forte Telecom','rede-forte',1290,12],['Móveis Planalto','moveis-planalto',1340,15],['TechParts Distribuidora','techparts',1150,7]]) { const i=FORNECEDORES.findIndex(f=>f.nome===n), f=FORNECEDORES[i]
 writeFileSync(d+'/proposta-'+arq+'.pdf', pdfProposta({fornecedor:f.razao,cnpj:f.cnpj,requisicao:'REQ nova',itens:[['Monitor 27 polegadas',4,'un',u]],total:4*u,prazoDias:p,email:f.email,telefone:'(11) 3300-2'+String(i).padStart(3,'0'),endereco:'Rua das Industrias, 450 - Barueri - SP - CEP 06455-000'})) }"
```

## Logins (senha do Comando A)
- Ana: delivered+ana.ribeiro@resend.dev
- Marcos (celular): delivered+marcos.tavares@resend.dev
- Carla: delivered+carla.nunes@resend.dev

## Regras
- A pesquisa de nota (0 a 10) aparece no 1º acesso das três: feche no X. No celular ela pode cobrir o botão Aprovar.
- A faixa amarela "Período de teste" é esperada.
- Se uma cena falhar: print, anote e siga. Exceção: se a cena 1 falhar, pare.
- Não clique "Avisar/Cobrar" duas vezes na mesma compra no mesmo dia.

## Cenas
0 · Carla (5 min): Suprimentos > "Onde estão paradas" > REQ-0008 (cadeiras) > Avisar. Passa: só a REQ-0008 e o toner atrasados; Marcos recebe sino e e-mail "[Stratum]…".
1 · Ana (6 min): Nova requisição — CDC Operações; "Verba — valor estimado desta compra" 6000; data daqui a 15 dias; entrega na Sede; item "Monitor 27 polegadas", "Full HD, entrada HDMI", qtd 4 > Enviar Requisição. Passa: "Requisição enviada!" com Marcos Tavares; anote o número (deve ser REQ-0014); Marcos recebe e-mail.
2 · Marcos, celular (6 min): feche a pesquisa; antes, confirme que a Ana não tem botão de aprovar a própria compra. Aprovações > "Aprovar REQ-<número anotado>" > Revisar > Aprovar. Atenção: a REQ-0012 "Monitor 27" já está pendente com ele; não confunda. Passa: valor e verba visíveis no celular; Ana recebe "aprovada".
3 · Carla (8 min): abra a REQ > nova concorrência > Rede Forte (1.290/un, 12 dias), Móveis Planalto (1.340, 15), TechParts (1.150, 7, com o PDF techparts) > marque TechParts > Salvar > Fechar concorrência. Passa: "Concorrência fechada!" e botão "Gerar OC"; Ana recebe e-mail "cotada" (sem sino: esperado).
3b · Carla (6 min): clique em Voltar e REABRA a REQ (atualizar a página não serve: defeito conhecido) > espere "Lendo a proposta…" > confira > "Revisei — completar o cadastro". Passa: a IA mostra razão social, CNPJ, e-mail e telefone e propõe completar o endereço; nada é gravado antes do clique; Fornecedores > TechParts mostra o completado.
4 · Carla (6 min): Gerar OC desta concorrência > condição "30 dias" > previsão em 7 dias > Criar OC > Visualizar. Passa: sai a OC-2026-007; a tela diz que o e-mail foi ao fornecedor; a Resend mostra o pedido para delivered+fornecedor2@resend.dev e o aviso para a Ana.
5 · Carla (6 min): Recebimento > número da OC > Buscar > local de estoque > três "Sim" > foto > Confirmar recebimento. Passa: "Recebimento confirmado!"; Ana recebe e-mail.
6 · Ana (6 min): Reembolso > Novo (modelo "Reembolso") > Operações > período de hoje > "Visita ao cliente em Campinas" > Alimentação > "Almoço com o cliente" > 86,40 > recibo > Enviar para aprovação. Passa: "RD enviado para aprovação!" (anote o RD-…); Marcos recebe aviso.
7 · Marcos, celular (4 min): Aprovações > "Aprovar RD-…" > Revisar > Aprovado em cada item > Confirmar decisão. Passa: aprovado; Ana recebe aviso.
8 · Carla (5 min): Reembolso > Financeiro > o RD > Lançar (data de hoje) > reabra > Confirmar pagamento. Passa: "Pago"; Ana recebe "lançado" e "pago".
3c · opcional (15 min): Ana cria REQ com verba 1000 > Marcos aprova pela Central > Carla faz concorrência com 1 proposta de 1.500 > vencedora > Fechar > a REQ vai sozinha para "Ag. Reaprovação" e o Marcos recebe e-mail > Marcos abre por Suprimentos > Requisições > a REQ (a reaprovação NÃO aparece na Central de Aprovações) > Aprovar Reaprovação > Ana recebe "Reaprovação aprovada". "Valor real: R$ 0,00" no quadro é defeito conhecido, não reprova.

## No fim
a) Confira na Resend cada e-mail, em especial o pedido ao fornecedor (cena 4), o "cotada" (3) e o "Reaprovação aprovada" (3c).
b) Mande ao chat do Stratum a tabela cena/passou?/o que vi, com prints.
c) Resemeie: o Comando A sem a parte da senha (o chat do Stratum te passa).

Defeitos já conhecidos (não reprovam): quadro da IA só aparece reabrindo a REQ; "Valor real R$ 0,00" na reaprovação.
Decisão de marketing pendente: frase A19 → sugestão "lê razão social, CNPJ e contatos, confere o CNPJ e completa o que falta".
