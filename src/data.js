export const QR_CODE = "CND-PAULO-7K42";
export const WHATSAPP_NUMBER = "5519999999999";

export const scenes = [
  {
    id: "signals",
    number: "01",
    label: "Sinais",
    kicker: "a rotina emite sinais",
    title: "Antes do problema virar crise, ele ja deixa rastro.",
    copy: "O atraso nao nasce no atraso. Ele aparece antes, espalhado em estoque incerto, planilha paralela, retrabalho, mensagens soltas e decisao no improviso. A entrada na imersao comeca quando esses sinais deixam de parecer ruido e passam a formar um campo vivo de leitura.",
    tags: ["atraso", "estoque", "planilha", "mensagens", "retrabalho", "improviso"]
  },
  {
    id: "map",
    number: "02",
    label: "Mapa",
    kicker: "o ruido ganha estrutura",
    title: "Quando os sinais se conectam, o fluxo aparece.",
    copy: "O que antes parecia pontual revela um desenho. A dor encontra origem, o gargalo mostra recorrencia e a operacao ganha contorno. Aqui, cada fragmento da cena anterior se organiza em mapa, para que a tecnologia entre no ponto certo e nao como camada extra de confusao.",
    tags: ["origem", "fluxo", "gargalo", "recorrencia", "mapa", "clareza"]
  },
  {
    id: "validation",
    number: "03",
    label: "Validacao",
    kicker: "clareza em forma de teste",
    title: "A resposta nao entra grande. Ela entra precisa.",
    copy: "Com o mapa visivel, a solucao deixa de ser abstrata. Dashboard, automacao, alerta, regra de negocio ou integracao surgem como prototipos enxutos, capazes de provar valor antes de ocupar a rotina inteira. Em vez de promessa ampla, a cena entrega direcao validada.",
    tags: ["dashboard", "automacao", "alerta", "regra", "integracao", "prototipo"]
  },
  {
    id: "reading",
    number: "04",
    label: "Leitura",
    kicker: "o visitante entra na analise",
    title: "Agora o cenario responde de volta.",
    copy: "Depois de percorrer sinais, mapa e validacao, a experiencia deixa de ser apenas observada. Tres respostas bastam para indicar qual tipo de clareza esta faltando primeiro e transformar a narrativa em leitura inicial da propria operacao.",
    tags: ["leitura", "fluxo", "historico", "indicador", "diagnostico", "direcao"]
  },
  {
    id: "contact",
    number: "05",
    label: "Contato",
    kicker: "da imersao para a acao",
    title: "O proximo passo e transformar leitura em desenho real.",
    copy: "A jornada fecha quando o diagnostico deixa de ser sensacao e vira conversa aplicada. O contato nao interrompe a experiencia: ele continua a mesma linha de raciocinio para entender a operacao, mapear dores e definir solucoes viaveis no dia a dia.",
    tags: ["resumo", "diagnostico", "contato", "acao", "proximo passo", "imersao"]
  }
];

export const priority = [
  "Decisao no Escuro",
  "Operacao Fragmentada",
  "Processo Manual Demais",
  "Gargalo Repetitivo",
  "Estoque Cego",
  "Fluxo Invisivel"
];

export const diagnosisPhrases = {
  "Fluxo Invisivel": "Parte da operacao provavelmente acontece fora do campo de visao, dificultando acompanhamento, historico e previsibilidade.",
  "Operacao Fragmentada": "A informacao parece circular em lugares diferentes, criando ruido entre registro, decisao e execucao.",
  "Decisao no Escuro": "As decisoes podem estar dependendo mais de percepcao do que de indicadores simples e confiaveis.",
  "Processo Manual Demais": "Tarefas repetitivas e conferencias manuais podem estar consumindo tempo que deveria apoiar decisoes melhores.",
  "Gargalo Repetitivo": "Problemas parecidos parecem voltar com frequencia, sinalizando oportunidade para regra, alerta ou automacao.",
  "Estoque Cego": "O controle de estoque ou conferencia pode estar exigindo esforco excessivo por falta de visibilidade ou validacao clara."
};

export const questions = [
  {
    question: "Hoje, onde a operacao mais perde clareza?",
    options: [
      { label: "Informacao espalhada", scores: { "Fluxo Invisivel": 2, "Operacao Fragmentada": 2 } },
      { label: "Controle manual", scores: { "Processo Manual Demais": 3 } },
      { label: "Falta de indicadores", scores: { "Decisao no Escuro": 3 } },
      { label: "Erros repetidos", scores: { "Gargalo Repetitivo": 2, "Processo Manual Demais": 1 } },
      { label: "Estoque ou conferencia", scores: { "Estoque Cego": 3 } },
      { label: "Sistemas separados", scores: { "Operacao Fragmentada": 3, "Fluxo Invisivel": 1 } }
    ]
  },
  {
    question: "O que mais pesa na rotina?",
    options: [
      { label: "Retrabalho", scores: { "Processo Manual Demais": 2, "Gargalo Repetitivo": 1 } },
      { label: "Atraso", scores: { "Gargalo Repetitivo": 3 } },
      { label: "Falta de visao", scores: { "Decisao no Escuro": 2, "Fluxo Invisivel": 1 } },
      { label: "Decisao no improviso", scores: { "Decisao no Escuro": 3 } },
      { label: "Tarefas repetitivas", scores: { "Processo Manual Demais": 3 } },
      { label: "Falta de historico", scores: { "Fluxo Invisivel": 2, "Operacao Fragmentada": 1 } }
    ]
  },
  {
    question: "Qual melhoria teria mais impacto agora?",
    options: [
      { label: "Dashboard", scores: { "Decisao no Escuro": 3 } },
      { label: "Automacao", scores: { "Processo Manual Demais": 2, "Gargalo Repetitivo": 1 } },
      { label: "Alerta", scores: { "Gargalo Repetitivo": 2, "Estoque Cego": 1 } },
      { label: "Regra de negocio", scores: { "Gargalo Repetitivo": 2, "Processo Manual Demais": 1 } },
      { label: "Organizacao do fluxo", scores: { "Fluxo Invisivel": 2, "Processo Manual Demais": 1 } },
      { label: "Integracao de informacoes", scores: { "Operacao Fragmentada": 3 } }
    ]
  }
];

export function calculateDiagnosis(answers) {
  const scores = priority.reduce((acc, type) => ({ ...acc, [type]: 0 }), {});

  Object.entries(answers).forEach(([step, answer]) => {
    const option = questions[Number(step)]?.options.find((item) => item.label === answer);
    if (!option) return;
    Object.entries(option.scores).forEach(([type, value]) => {
      scores[type] += value;
    });
  });

  const highestScore = Math.max(...Object.values(scores));
  return priority.find((type) => scores[type] === highestScore) || "Decisao no Escuro";
}

export function buildWhatsAppLink(type) {
  const message = `Ola, vim pelo QR Code ${QR_CODE} e quero conversar sobre a imersao Clareza para Decidir. Meu diagnostico inicial foi: ${type}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildSummary(type) {
  const phrase = diagnosisPhrases[type] || "Leitura inicial ainda nao concluida.";
  return [
    "Diagnostico Clareza para Decidir",
    `Convite: ${QR_CODE}`,
    `Resultado: ${type}`,
    `Resumo: ${phrase}`,
    "Interesse: entender a operacao, mapear dores e identificar solucoes aplicaveis ao dia a dia."
  ].join("\n");
}
