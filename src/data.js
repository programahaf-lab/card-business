export const QR_CODE = "TORAKA / EXPERIENCE 01";
export const WHATSAPP_NUMBER = "5519999999999";

export const scenes = [
  { id: "growth", number: "01", label: "Crescimento", kicker: "o negócio avançou", title: "Sua empresa cresceu. A operação acompanhou?", copy: "Mais clientes, produtos e decisões aumentam também a complexidade. O que funcionava no começo passa a gerar estoque incerto, controles paralelos, retrabalho e decisões no improviso. A Toraka começa exatamente nesse ponto: quando crescer exige enxergar melhor.", tags: ["expansão", "estoque", "vendas", "planilhas", "retrabalho", "decisão"] },
  { id: "diagnosis", number: "02", label: "Diagnóstico", kicker: "primeiro, entender", title: "Antes da tecnologia, vem a leitura da operação.", copy: "Conhecemos a história da empresa, os sistemas, as pessoas e o fluxo real do dia a dia. Escutamos as dores e conectamos sinais que pareciam isolados. Assim, a solução nasce do contexto do negócio — não de uma ferramenta escolhida antes do problema.", tags: ["história", "rotina", "sistemas", "pessoas", "gargalos", "contexto"] },
  { id: "pillars", number: "03", label: "Oportunidades", kicker: "três lentes, uma operação", title: "Transformamos sinais em oportunidades aplicáveis.", copy: "Cada oportunidade é organizada por aquilo que pode mudar no negócio: mais controle para gerir, menos esforço para operar e mais inteligência para decidir. As frentes se conectam em uma solução única, adequada à maturidade e à realidade da empresa.", tags: ["gestão", "automação", "inteligência"], pillars: [
    { name: "Gestão", detail: "Dashboards, estoque, vendas e acompanhamento." },
    { name: "Automação", detail: "Processos, alertas, integrações e comunicação." },
    { name: "Inteligência", detail: "Giro, rupturas, padrões e oportunidades nos dados." }
  ] },
  { id: "validation", number: "04", label: "Prioridade", kicker: "impacto antes de complexidade", title: "A melhor solução começa pelo que gera valor primeiro.", copy: "As iniciativas são comparadas por impacto, urgência e esforço. Protótipos e validações reduzem risco antes da implantação. Dashboard, automação, alerta, regra de negócio ou sistema entram na ordem certa — com escopo claro e resultado observável.", tags: ["impacto", "esforço", "urgência", "protótipo", "validação", "roadmap"] },
  { id: "reading", number: "05", label: "Leitura", kicker: "o visitante entra na análise", title: "Agora, olhe para a sua própria operação.", copy: "Depois de conhecer o método Toraka, três respostas ajudam a identificar onde sua empresa pode estar perdendo clareza. Não é o diagnóstico completo: é um primeiro sinal para orientar a conversa inicial.", tags: ["leitura", "fluxo", "histórico", "indicador", "diagnóstico", "direção"] },
  { id: "contact", number: "06", label: "Conversa", kicker: "clareza para decidir", title: "Sua operação pode mostrar mais do que mostra hoje.", copy: "A conversa inicial é gratuita. Vamos conhecer o momento da empresa, entender as principais dificuldades e verificar onde a Toraka pode gerar valor. Sem solução genérica e sem compromisso antes de existir contexto.", tags: ["contexto", "diagnóstico", "oportunidade", "prioridade", "solução", "próximo passo"] }
];

export const priority = ["Decisão no Escuro", "Operação Fragmentada", "Processo Manual Demais", "Gargalo Repetitivo", "Estoque Cego", "Fluxo Invisível"];

export const diagnosisPhrases = {
  "Fluxo Invisível": "Parte da operação provavelmente acontece fora do campo de visão, dificultando acompanhamento, histórico e previsibilidade.",
  "Operação Fragmentada": "A informação parece circular em lugares diferentes, criando ruído entre registro, decisão e execução.",
  "Decisão no Escuro": "As decisões podem estar dependendo mais de percepção do que de indicadores simples e confiáveis.",
  "Processo Manual Demais": "Tarefas repetitivas e conferências manuais podem estar consumindo tempo que deveria apoiar decisões melhores.",
  "Gargalo Repetitivo": "Problemas parecidos parecem voltar com frequência, sinalizando oportunidade para regra, alerta ou automação.",
  "Estoque Cego": "O controle de estoque ou conferência pode estar exigindo esforço excessivo por falta de visibilidade ou validação clara."
};

export const questions = [
  { question: "Hoje, onde a operação mais perde clareza?", options: [
    { label: "Informação espalhada", scores: { "Fluxo Invisível": 2, "Operação Fragmentada": 2 } },
    { label: "Controle manual", scores: { "Processo Manual Demais": 3 } },
    { label: "Falta de indicadores", scores: { "Decisão no Escuro": 3 } },
    { label: "Erros repetidos", scores: { "Gargalo Repetitivo": 2, "Processo Manual Demais": 1 } },
    { label: "Estoque ou conferência", scores: { "Estoque Cego": 3 } },
    { label: "Sistemas separados", scores: { "Operação Fragmentada": 3, "Fluxo Invisível": 1 } }
  ] },
  { question: "O que mais pesa na rotina?", options: [
    { label: "Retrabalho", scores: { "Processo Manual Demais": 2, "Gargalo Repetitivo": 1 } },
    { label: "Atraso", scores: { "Gargalo Repetitivo": 3 } },
    { label: "Falta de visão", scores: { "Decisão no Escuro": 2, "Fluxo Invisível": 1 } },
    { label: "Decisão no improviso", scores: { "Decisão no Escuro": 3 } },
    { label: "Tarefas repetitivas", scores: { "Processo Manual Demais": 3 } },
    { label: "Falta de histórico", scores: { "Fluxo Invisível": 2, "Operação Fragmentada": 1 } }
  ] },
  { question: "Qual melhoria teria mais impacto agora?", options: [
    { label: "Dashboard", scores: { "Decisão no Escuro": 3 } },
    { label: "Automação", scores: { "Processo Manual Demais": 2, "Gargalo Repetitivo": 1 } },
    { label: "Alerta", scores: { "Gargalo Repetitivo": 2, "Estoque Cego": 1 } },
    { label: "Regra de negócio", scores: { "Gargalo Repetitivo": 2, "Processo Manual Demais": 1 } },
    { label: "Organização do fluxo", scores: { "Fluxo Invisível": 2, "Processo Manual Demais": 1 } },
    { label: "Integração de informações", scores: { "Operação Fragmentada": 3 } }
  ] }
];

export function calculateDiagnosis(answers) {
  const scores = priority.reduce((acc, type) => ({ ...acc, [type]: 0 }), {});
  Object.entries(answers).forEach(([step, answer]) => {
    const option = questions[Number(step)]?.options.find((item) => item.label === answer);
    if (!option) return;
    Object.entries(option.scores).forEach(([type, value]) => { scores[type] += value; });
  });
  const highestScore = Math.max(...Object.values(scores));
  return priority.find((type) => scores[type] === highestScore) || "Decisão no Escuro";
}

export function buildWhatsAppLink(type) {
  const message = `Olá, conheci a Toraka pela experiência "Clareza para Decidir". Minha leitura inicial foi: ${type}. Quero agendar uma conversa sobre a minha operação.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildSummary(type) {
  const phrase = diagnosisPhrases[type] || "Leitura inicial ainda não concluída.";
  return ["Leitura inicial Toraka — Clareza para Decidir", `Experiência: ${QR_CODE}`, `Resultado: ${type}`, `Resumo: ${phrase}`, "Interesse: entender a operação, mapear oportunidades e identificar soluções aplicáveis ao dia a dia."].join("\n");
}
