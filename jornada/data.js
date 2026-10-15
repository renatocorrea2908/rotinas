/* Catálogo: áreas, classes, sugestões, chefões, conquistas */
const AREAS = {
  saude:     { nome: 'Saúde',     attr: 'Vigor',     ic: '❤️', cor: '#ef4444', perk: 'Nv 5+: ombros mais largos · Nv 10: coração radiante' },
  mente:     { nome: 'Mente',     attr: 'Sabedoria', ic: '🧠', cor: '#8b5cf6', perk: 'Nv 5: grimório flutuante · Nv 10: grimório arcano' },
  carreira:  { nome: 'Carreira',  attr: 'Maestria',  ic: '💼', cor: '#3b82f6', perk: 'Nv 5: insígnia de prata · Nv 10: insígnia de ouro' },
  financas:  { nome: 'Finanças',  attr: 'Riqueza',   ic: '💰', cor: '#eab308', perk: 'Nv 5: bolsa de ouro · Nv 10: moedas orbitando' },
  relacoes:  { nome: 'Relações',  attr: 'Vínculos',  ic: '🤝', cor: '#ec4899', perk: 'Nv 5: filhote de raposa · Nv 10: raposa adulta · Nv 15: raposa espiritual' },
  proposito: { nome: 'Propósito', attr: 'Espírito',  ic: '✨', cor: '#14b8a6', perk: 'Nv 5: espírito-guia · Nv 10: asas de luz' }
};
const AREA_KEYS = Object.keys(AREAS);

const CLASSES = {
  estrategista: { n: 'Estrategista', ic: '♟️', d: '+15% XP em Carreira e Finanças', b: { carreira: .15, financas: .15 } },
  guardiao:     { n: 'Guardião',     ic: '🛡️', d: '+15% XP em Saúde e Relações',   b: { saude: .15, relacoes: .15 } },
  sabio:        { n: 'Sábio',        ic: '📜', d: '+15% XP em Mente e Propósito',  b: { mente: .15, proposito: .15 } },
  polimata:     { n: 'Polímata',     ic: '🌐', d: '+5% XP em todas as áreas',      b: { saude: .05, mente: .05, carreira: .05, financas: .05, relacoes: .05, proposito: .05 } }
};

const DIF = { 1: { n: 'Leve', xp: 10 }, 2: { n: 'Média', xp: 25 }, 3: { n: 'Épica', xp: 50 } };
const TIPOS = { habito: 'Hábito', missao: 'Missão', meta: 'Épico' };

const TODOS = [0, 1, 2, 3, 4, 5, 6], UTEIS = [1, 2, 3, 4, 5];
/* t: h=hábito, m=missão, e=épico (meta com marcos) */
const SUG = [
  // SAÚDE
  { id: 's1', a: 'saude', t: 'h', n: 'Treino de força 45 min', d: 2, dias: [1, 3, 5], why: 'Massa muscular é o melhor seguro de longevidade depois dos 40.' },
  { id: 's2', a: 'saude', t: 'h', n: 'Caminhada ou cardio 30 min', d: 1, dias: [2, 4, 6], why: 'Base aeróbica reduz estresse e melhora a clareza mental.' },
  { id: 's3', a: 'saude', t: 'h', n: 'Dormir 7h ou mais', d: 2, dias: TODOS, why: 'Sono é o multiplicador de todas as outras áreas.' },
  { id: 's4', a: 'saude', t: 'h', n: 'Beber 2,5 L de água', d: 1, dias: TODOS },
  { id: 's5', a: 'saude', t: 'h', n: 'Zero álcool de segunda a quinta', d: 2, dias: [1, 2, 3, 4] },
  { id: 's6', a: 'saude', t: 'h', n: 'Mobilidade / alongamento 10 min', d: 1, dias: TODOS },
  { id: 's7', a: 'saude', t: 'm', n: 'Fazer check-up médico completo', d: 2 },
  { id: 's8', a: 'saude', t: 'e', n: 'Correr 10 km', d: 3, marcos: ['Correr 3 km sem parar', 'Correr 5 km', 'Correr 8 km', 'Completar 10 km'] },
  { id: 's9', a: 'saude', t: 'h', n: 'Almoço sem ultraprocessados', d: 1, dias: UTEIS },
  // MENTE
  { id: 'm1', a: 'mente', t: 'h', n: 'Ler 20 páginas', d: 1, dias: TODOS, why: '20 páginas/dia ≈ 25 livros/ano.' },
  { id: 'm2', a: 'mente', t: 'h', n: 'Estudar IA aplicada a finanças 30 min', d: 2, dias: [2, 4], why: 'Diferencial direto para Stratum e Valora.' },
  { id: 'm3', a: 'mente', t: 'h', n: 'Diário: 3 aprendizados do dia', d: 1, dias: UTEIS },
  { id: 'm4', a: 'mente', t: 'h', n: '1h de foco profundo sem celular', d: 2, dias: UTEIS },
  { id: 'm5', a: 'mente', t: 'e', n: 'Ler 12 livros no ano', d: 3, marcos: ['3 livros', '6 livros', '9 livros', '12 livros'] },
  { id: 'm6', a: 'mente', t: 'm', n: 'Concluir um curso que está parado', d: 2 },
  { id: 'm7', a: 'mente', t: 'h', n: 'Podcast/aula no trânsito', d: 1, dias: UTEIS },
  // CARREIRA
  { id: 'c1', a: 'carreira', t: 'h', n: 'Bloco de 90 min no Stratum/Valora', d: 3, dias: UTEIS, why: 'Produto não avança em brechas — precisa de bloco protegido.' },
  { id: 'c2', a: 'carreira', t: 'h', n: 'Planejar a semana (top 3 prioridades)', d: 2, dias: [0], why: 'Quem não planeja a semana vive a agenda dos outros.' },
  { id: 'c3', a: 'carreira', t: 'h', n: 'Revisão semanal de pipeline IMTW', d: 2, dias: [5] },
  { id: 'c4', a: 'carreira', t: 'h', n: 'Café/call com 1 contato estratégico', d: 2, dias: [3] },
  { id: 'c5', a: 'carreira', t: 'e', n: 'Lançar o MVP do Stratum', d: 3, marcos: ['Escopo fechado', 'Protótipo navegável', '3 clientes piloto', 'Primeira receita', 'Lançamento oficial'] },
  { id: 'c6', a: 'carreira', t: 'e', n: 'Fechar a rodada Seed da Acta', d: 3, marcos: ['Data room pronto', 'Pitch validado', '10 investidores abordados', 'Term sheet', 'Closing'] },
  { id: 'c7', a: 'carreira', t: 'm', n: 'Atualizar materiais institucionais da IMTW', d: 2 },
  { id: 'c8', a: 'carreira', t: 'h', n: 'Inbox zero no fim do dia', d: 1, dias: UTEIS },
  { id: 'c9', a: 'carreira', t: 'm', n: 'Definir OKRs do próximo trimestre', d: 3 },
  // FINANÇAS
  { id: 'f1', a: 'financas', t: 'h', n: 'Revisar orçamento pessoal', d: 2, dias: [0], why: 'O CFO da própria vida também fecha o mês.' },
  { id: 'f2', a: 'financas', t: 'm', n: 'Fazer o aporte do mês', d: 1 },
  { id: 'f3', a: 'financas', t: 'm', n: 'Rebalancear a carteira de investimentos', d: 2 },
  { id: 'f4', a: 'financas', t: 'e', n: 'Reserva de emergência de 12 meses', d: 3, marcos: ['3 meses', '6 meses', '9 meses', '12 meses'] },
  { id: 'f5', a: 'financas', t: 'm', n: 'Revisar seguros e previdência', d: 2 },
  { id: 'f6', a: 'financas', t: 'e', n: 'Planejamento patrimonial e sucessório', d: 3, marcos: ['Inventário de ativos', 'Conversa com advogado', 'Estrutura definida', 'Documentos assinados'] },
  { id: 'f7', a: 'financas', t: 'h', n: 'Registrar gastos do dia', d: 1, dias: TODOS },
  { id: 'f8', a: 'financas', t: 'm', n: 'Cancelar assinaturas que não uso', d: 1 },
  // RELAÇÕES
  { id: 'r1', a: 'relacoes', t: 'h', n: 'Jantar em família sem celular', d: 2, dias: TODOS, why: 'Presença real vale mais que tempo total.' },
  { id: 'r2', a: 'relacoes', t: 'h', n: 'Ligar para um amigo', d: 1, dias: [6] },
  { id: 'r3', a: 'relacoes', t: 'h', n: 'Programa a dois', d: 2, dias: [5] },
  { id: 'r4', a: 'relacoes', t: 'h', n: 'Reconhecer alguém do time', d: 1, dias: [1, 3, 5] },
  { id: 'r5', a: 'relacoes', t: 'h', n: 'Visitar ou ligar para os pais', d: 2, dias: [0] },
  { id: 'r6', a: 'relacoes', t: 'e', n: 'Viagem especial em família', d: 2, marcos: ['Destino escolhido', 'Datas bloqueadas', 'Reservas feitas', 'Viagem realizada'] },
  { id: 'r7', a: 'relacoes', t: 'm', n: 'Reencontrar um amigo antigo', d: 2 },
  // PROPÓSITO
  { id: 'p1', a: 'proposito', t: 'h', n: 'Meditação 10 min', d: 1, dias: TODOS, why: '10 minutos de pausa protegem as outras 16 horas.' },
  { id: 'p2', a: 'proposito', t: 'h', n: 'Escrever 3 gratidões', d: 1, dias: TODOS },
  { id: 'p3', a: 'proposito', t: 'h', n: 'Mentorar alguém', d: 2, dias: [2] },
  { id: 'p4', a: 'proposito', t: 'm', n: 'Escrever minha visão de 10 anos', d: 3 },
  { id: 'p5', a: 'proposito', t: 'm', n: 'Ação voluntária ou doação do mês', d: 2 },
  { id: 'p6', a: 'proposito', t: 'h', n: '1h de hobby sem culpa', d: 1, dias: [6] },
  { id: 'p7', a: 'proposito', t: 'h', n: 'Tempo na natureza', d: 1, dias: [0] }
];

const BOSSES = [
  { n: 'Procrastinação, a Lenta', ic: '🦥' },
  { n: 'Hidra da Distração', ic: '🐉' },
  { n: 'Golem do Sedentarismo', ic: '🗿' },
  { n: 'Espectro da Ansiedade', ic: '👻' },
  { n: 'Dragão do Caos Financeiro', ic: '🐲' },
  { n: 'Kraken das Notificações', ic: '🐙' },
  { n: 'Lorde do Cansaço', ic: '🧟' },
  { n: 'Sereia do Scroll Infinito', ic: '🧜' },
  { n: 'Ogro da Desorganização', ic: '👹' },
  { n: 'Vampiro do Tempo', ic: '🧛' },
  { n: 'Basilisco do Perfeccionismo', ic: '🐍' },
  { n: 'Titã da Complacência', ic: '🦣' }
];

/* raridade: comum, raro, epico, lendario */
const CONQ = [
  { id: 'start', n: 'Primeiro Passo', d: 'Ganhe seu primeiro XP', ic: '👣', r: 'comum', t: s => s.total > 0 },
  { id: 'st3', n: 'Faísca', d: 'Sequência de 3 dias', ic: '🕯️', r: 'comum', t: s => s.maxStreak >= 3 },
  { id: 'st7', n: 'Em Chamas', d: 'Sequência de 7 dias', ic: '🔥', r: 'raro', t: s => s.maxStreak >= 7 },
  { id: 'st30', n: 'Inabalável', d: 'Sequência de 30 dias', ic: '⚡', r: 'epico', t: s => s.maxStreak >= 30 },
  { id: 'st100', n: 'Disciplina de Aço', d: 'Sequência de 100 dias', ic: '🗡️', r: 'lendario', t: s => s.maxStreak >= 100 },
  { id: 'h50', n: 'Ritmo', d: '50 hábitos cumpridos', ic: '🥁', r: 'comum', t: s => s.habDone >= 50 },
  { id: 'h250', n: 'Máquina', d: '250 hábitos cumpridos', ic: '⚙️', r: 'raro', t: s => s.habDone >= 250 },
  { id: 'h1000', n: 'Lenda Viva', d: '1.000 hábitos cumpridos', ic: '🏛️', r: 'lendario', t: s => s.habDone >= 1000 },
  { id: 'pf1', n: 'Dia Perfeito', d: '100% dos hábitos num dia (mín. 3)', ic: '💎', r: 'comum', t: s => s.perfect >= 1 },
  { id: 'pf10', n: 'Colecionador de Diamantes', d: '10 dias perfeitos', ic: '💠', r: 'raro', t: s => s.perfect >= 10 },
  { id: 'pf50', n: 'Lapidário', d: '50 dias perfeitos', ic: '👑', r: 'epico', t: s => s.perfect >= 50 },
  { id: 'mi1', n: 'Missão Dada', d: 'Conclua 1 missão', ic: '📜', r: 'comum', t: s => s.missDone >= 1 },
  { id: 'mi25', n: 'Executor', d: 'Conclua 25 missões', ic: '🎯', r: 'raro', t: s => s.missDone >= 25 },
  { id: 'ep1', n: 'Conquistador', d: 'Conclua 1 épico', ic: '🏆', r: 'epico', t: s => s.metaDone >= 1 },
  { id: 'ep5', n: 'Arquiteto do Destino', d: 'Conclua 5 épicos', ic: '🗺️', r: 'lendario', t: s => s.metaDone >= 5 },
  { id: 'b1', n: 'Matador de Chefões', d: 'Derrote o 1º chefão semanal', ic: '⚔️', r: 'raro', t: s => s.bossKills >= 1 },
  { id: 'b10', n: 'Caçador Implacável', d: 'Derrote 10 chefões', ic: '🐉', r: 'epico', t: s => s.bossKills >= 10 },
  { id: 'dc10', n: 'Aceito o Desafio', d: '10 desafios do dia', ic: '🎲', r: 'raro', t: s => s.desafios >= 10 },
  { id: 'di7', n: 'Cronista', d: '7 reflexões no diário', ic: '✍️', r: 'comum', t: s => s.diario >= 7 },
  { id: 'di30', n: 'Filósofo', d: '30 reflexões no diário', ic: '🦉', r: 'raro', t: s => s.diario >= 30 },
  { id: 'eq3', n: 'Equilíbrio', d: 'Todas as áreas no nível 3', ic: '☯️', r: 'raro', t: s => s.minArea >= 3 },
  { id: 'eq10', n: 'Vida Plena', d: 'Todas as áreas no nível 10', ic: '🌳', r: 'lendario', t: s => s.minArea >= 10 },
  { id: 'lv5', n: 'Iniciado', d: 'Alcance o nível 5', ic: '🌱', r: 'comum', t: s => s.lvl >= 5 },
  { id: 'lv15', n: 'Guerreiro', d: 'Alcance o nível 15', ic: '🛡️', r: 'raro', t: s => s.lvl >= 15 },
  { id: 'lv30', n: 'Mestre', d: 'Alcance o nível 30', ic: '🔮', r: 'epico', t: s => s.lvl >= 30 },
  { id: 'lv50', n: 'Lenda', d: 'Alcance o nível 50', ic: '🌟', r: 'lendario', t: s => s.lvl >= 50 },
  { id: 'shop1', n: 'Merecido', d: 'Resgate 1 recompensa', ic: '🎁', r: 'comum', t: s => s.compras >= 1 },
  { id: 'gold1k', n: 'Tesouro', d: 'Acumule 1.000 de ouro ganho', ic: '🪙', r: 'raro', t: s => s.goldEarned >= 1000 }
];

const RECOMP_PADRAO = [
  { nome: 'Episódio de série sem culpa', custo: 40, ic: '📺' },
  { nome: 'Café especial / sobremesa', custo: 60, ic: '🍰' },
  { nome: 'Jantar no restaurante favorito', custo: 300, ic: '🍷' },
  { nome: 'Livro novo', custo: 200, ic: '📚' },
  { nome: 'Manhã de folga', custo: 500, ic: '🏖️' },
  { nome: 'Gadget / equipamento desejado', custo: 1500, ic: '🎧' }
];

const FRASES = [
  'Você não sobe ao nível dos seus objetivos. Cai ao nível dos seus sistemas.',
  'Disciplina é escolher entre o que você quer agora e o que você mais quer.',
  'Pequenas vitórias diárias, juros compostos na vida.',
  'O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor é hoje.',
  'Constância vence intensidade.',
  'O que é medido é gerenciado.',
  'Feito é melhor que perfeito.',
  'A dor da disciplina pesa gramas; a do arrependimento, toneladas.',
  'Foco é dizer não a mil coisas boas.',
  'Cuide do corpo: é o único lugar onde você tem que morar.'
];
