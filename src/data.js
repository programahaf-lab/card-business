export const QR_CODE = "CND-PAULO-7K42";
export const WHATSAPP_NUMBER = "5519999999999";

export const scenes = [
  {
    id: "signals",
    number: "01",
    label: "Sinais",
    kicker: "sinais vivos",
    title: "A rotina ja esta falando.",
    copy: "Atraso, estoque incerto, planilha paralela, retrabalho e decisao no improviso deixam rastros. A imersao comeca quando esses pontos param de parecer ruido.",
    tags: ["atraso", "estoque", "planilha", "WhatsApp", "retrabalho", "decisao"]
  },
  {
    id: "map",
    number: "02",
    label: "Mapa",
    kicker: "mapa de clareza",
    title: "Do ruido ao mapa.",
    copy: "Antes da solucao, vem o fluxo. A dor vira sinal, o sinal vira oportunidade e a oportunidade aponta o tipo certo de tecnologia.",
    tags: ["Dor", "Sinal", "Oportunidade"]
  },
  {
    id: "validation",
    number: "03",
    label: "Validacao",
    kicker: "solucao testada",
    title: "A solucao nasce pequena e precisa.",
    copy: "Dashboard, automacao, alerta, regra de negocio ou integracao entram como prototipos claros antes de virar compromisso operacional.",
    tags: ["Dashboard", "Automacao", "Alerta", "Validar", "Testar", "Integrar"]
  },
  {
    id: "reading",
    number: "04",
    label: "Leitura",
    kicker: "leitura inicial",
    title: "Leia o sinal principal.",
    copy: "Tres respostas bastam para apontar qual tipo de clareza pode estar faltando primeiro.",
    tags: ["Fluxo", "Historico", "Indicador"]
  },
  {
    id: "contact",
    number: "05",
    label: "Contato",
    kicker: "proximo passo",
    title: "Transforme rotina em clareza.",
    copy: "O proximo passo e uma analise inicial para entender sua operacao, mapear dores e identificar solucoes aplicaveis ao seu dia a dia.",
    tags: ["Resumo", "Contato", "Acao"]
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
