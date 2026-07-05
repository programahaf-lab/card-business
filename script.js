const QR_CODE = "CND-PAULO-7K42";
const WHATSAPP_NUMBER = "5519999999999";
const STORAGE_KEY = "clareza-para-decidir-state-v4";
const HOLD_DURATION = 1200;
const SCENE_COOLDOWN = 900;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

const appState = {
  isExperienceActive: false,
  isTransitioning: false,
  activeScene: 0,
  savedScene: 0,
  touchStartY: 0,
  isAxisDragging: false,
  holdTimer: null,
  holdStart: 0,
  holdFrame: null,
  three: null,
  mouse: { x: 0, y: 0 },
  scatter: 0
};

const diagnosisState = {
  currentStep: 0,
  answers: {},
  result: ""
};

const priority = [
  "Decisão no Escuro",
  "Operação Fragmentada",
  "Processo Manual Demais",
  "Gargalo Repetitivo",
  "Estoque Cego",
  "Fluxo Invisível"
];

const diagnosisPhrases = {
  "Fluxo Invisível": "Parte da operação provavelmente acontece fora do campo de visão, dificultando acompanhamento, histórico e previsibilidade.",
  "Operação Fragmentada": "A informação parece circular em lugares diferentes, criando ruído entre registro, decisão e execução.",
  "Decisão no Escuro": "As decisões podem estar dependendo mais de percepção do que de indicadores simples e confiáveis.",
  "Processo Manual Demais": "Tarefas repetitivas e conferências manuais podem estar consumindo tempo que deveria apoiar decisões melhores.",
  "Gargalo Repetitivo": "Problemas parecidos parecem voltar com frequência, sinalizando oportunidade para regra, alerta ou automação.",
  "Estoque Cego": "O controle de estoque ou conferência pode estar exigindo esforço excessivo por falta de visibilidade ou validação clara."
};

const questions = [
  {
    question: "Hoje, onde a operação mais perde clareza?",
    options: [
      { label: "Informação espalhada", scores: { "Fluxo Invisível": 2, "Operação Fragmentada": 2 } },
      { label: "Controle manual", scores: { "Processo Manual Demais": 3 } },
      { label: "Falta de indicadores", scores: { "Decisão no Escuro": 3 } },
      { label: "Erros repetidos", scores: { "Gargalo Repetitivo": 2, "Processo Manual Demais": 1 } },
      { label: "Estoque ou conferência", scores: { "Estoque Cego": 3 } },
      { label: "Sistemas separados", scores: { "Operação Fragmentada": 3, "Fluxo Invisível": 1 } }
    ]
  },
  {
    question: "O que mais pesa na rotina?",
    options: [
      { label: "Retrabalho", scores: { "Processo Manual Demais": 2, "Gargalo Repetitivo": 1 } },
      { label: "Atraso", scores: { "Gargalo Repetitivo": 3 } },
      { label: "Falta de visão", scores: { "Decisão no Escuro": 2, "Fluxo Invisível": 1 } },
      { label: "Decisão no improviso", scores: { "Decisão no Escuro": 3 } },
      { label: "Tarefas repetitivas", scores: { "Processo Manual Demais": 3 } },
      { label: "Falta de histórico", scores: { "Fluxo Invisível": 2, "Operação Fragmentada": 1 } }
    ]
  },
  {
    question: "Qual melhoria teria mais impacto agora?",
    options: [
      { label: "Dashboard", scores: { "Decisão no Escuro": 3 } },
      { label: "Automação", scores: { "Processo Manual Demais": 2, "Gargalo Repetitivo": 1 } },
      { label: "Alerta", scores: { "Gargalo Repetitivo": 2, "Estoque Cego": 1 } },
      { label: "Regra de negócio", scores: { "Gargalo Repetitivo": 2, "Processo Manual Demais": 1 } },
      { label: "Organização do fluxo", scores: { "Fluxo Invisível": 2, "Processo Manual Demais": 1 } },
      { label: "Integração de informações", scores: { "Operação Fragmentada": 3 } }
    ]
  }
];

const elements = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  loadState();
  initPreloader();
  initEntry();
  initExperience();
  initDiagnosis();
  initCursor();
  initThreeOrb();
  updateContactPanel();
}

function cacheElements() {
  elements.preloader = document.querySelector("#preloader");
  elements.loaderCount = document.querySelector("#loaderCount");
  elements.loaderLine = document.querySelector("#loaderLine");
  elements.loaderEnter = document.querySelector("#loaderEnter");
  elements.entryChamber = document.querySelector("#entryChamber");
  elements.holdButton = document.querySelector("#holdButton");
  elements.holdRing = document.querySelector("#holdRing");
  elements.skipEntry = document.querySelector("#skipEntry");
  elements.stage = document.querySelector("#experienceStage");
  elements.sceneFlash = document.querySelector("#sceneFlash");
  elements.transitionChamber = document.querySelector("#transitionChamber");
  elements.scenes = [...document.querySelectorAll(".scene")];
  elements.sceneLinks = [...document.querySelectorAll("[data-scene-link]")];
  elements.sceneProgress = document.querySelector("#sceneProgress");
  elements.sceneCounter = document.querySelector("#sceneCounter");
  elements.sceneName = document.querySelector("#sceneName");
  elements.depthValue = document.querySelector("#depthValue");
  elements.prevScene = document.querySelector("#prevScene");
  elements.nextScene = document.querySelector("#nextScene");
  elements.navAxis = document.querySelector("#navAxis");
  elements.axisCore = document.querySelector("#axisCore");
  elements.homeButton = document.querySelector("#homeButton");
  elements.orbCanvas = document.querySelector("#diagnosticOrb");
  elements.orbFallback = document.querySelector("#orbFallback");
  elements.customCursor = document.querySelector("#customCursor");
  elements.noiseSystem = document.querySelector("#noiseSystem");
  elements.organizeNoise = document.querySelector("#organizeNoise");
  elements.signalRadar = document.querySelector(".signal-chamber");
  elements.questionStage = document.querySelector("#questionStage");
  elements.stepLabel = document.querySelector("#stepLabel");
  elements.diagnosisProgress = document.querySelector("#diagnosisProgress");
  elements.backButton = document.querySelector("#backButton");
  elements.contactResult = document.querySelector("#contactResult");
  elements.contactWhatsapp = document.querySelector("#contactWhatsapp");
  elements.contactCopy = document.querySelector("#contactCopy");
  elements.contactReset = document.querySelector("#contactReset");
  elements.contactStatus = document.querySelector("#contactStatus");
}

function initPreloader() {
  let value = 0;
  const step = () => {
    const increment = value < 72 ? 4 : 2;
    value = Math.min(100, value + increment);
    elements.loaderCount.textContent = value;
    elements.loaderLine.style.width = `${value}%`;

    if (value < 100) {
      window.setTimeout(step, 38);
      return;
    }

    elements.loaderEnter.hidden = false;
    document.body.classList.remove("is-preloading");
  };

  step();
  elements.loaderEnter.addEventListener("click", showEntryChamber);
}

function showEntryChamber() {
  elements.preloader.classList.add("is-hidden");
  elements.entryChamber.classList.add("is-visible");
  elements.entryChamber.removeAttribute("aria-hidden");
}

function initEntry() {
  const startHold = (event) => {
    if (appState.isExperienceActive) return;
    event.preventDefault();
    appState.holdStart = performance.now();
    cancelAnimationFrame(appState.holdFrame);
    tickHold();
    appState.holdTimer = window.setTimeout(enterExperience, HOLD_DURATION);
  };

  const cancelHold = () => {
    if (appState.isExperienceActive) return;
    window.clearTimeout(appState.holdTimer);
    cancelAnimationFrame(appState.holdFrame);
    setHoldProgress(0);
  };

  elements.holdButton.addEventListener("pointerdown", startHold);
  elements.holdButton.addEventListener("pointerup", cancelHold);
  elements.holdButton.addEventListener("pointerleave", cancelHold);
  elements.holdButton.addEventListener("pointercancel", cancelHold);
  elements.skipEntry.addEventListener("click", enterExperience);
}

function tickHold() {
  const elapsed = performance.now() - appState.holdStart;
  setHoldProgress(Math.min(1, elapsed / HOLD_DURATION));
  if (elapsed < HOLD_DURATION) {
    appState.holdFrame = requestAnimationFrame(tickHold);
  }
}

function setHoldProgress(progress) {
  const circumference = 339.292;
  elements.holdRing.style.strokeDashoffset = circumference - circumference * progress;
}

function enterExperience() {
  window.clearTimeout(appState.holdTimer);
  cancelAnimationFrame(appState.holdFrame);
  setHoldProgress(1);
  appState.isExperienceActive = true;

  elements.entryChamber.classList.add("is-entering");
  elements.stage.classList.add("is-active");
  elements.stage.removeAttribute("aria-hidden");

  window.setTimeout(() => {
    goToScene(0, true);
    updateSceneUI();
  }, prefersReducedMotion ? 0 : 300);
}

function initExperience() {
  initTypographyFX();
  elements.prevScene.addEventListener("click", prevScene);
  elements.nextScene.addEventListener("click", nextScene);

  elements.sceneLinks.forEach((button) => {
    button.addEventListener("click", () => {
      goToScene(Number(button.dataset.sceneLink));
    });
  });

  elements.homeButton.addEventListener("click", () => goToScene(0));
  elements.organizeNoise.addEventListener("click", () => {
    elements.noiseSystem.classList.toggle("is-organized");
  });
  elements.signalRadar.addEventListener("pointerenter", scatterSignalRadar);
  elements.signalRadar.addEventListener("pointerdown", scatterSignalRadar);
  initAxisNavigation();

  window.addEventListener("wheel", handleWheelIntent, { passive: false });
  window.addEventListener("touchstart", (event) => {
    appState.touchStartY = event.touches[0].clientY;
  }, { passive: true });
  window.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    appState.mouse.x = (touch.clientX / window.innerWidth - .5) * 2;
    appState.mouse.y = (touch.clientY / window.innerHeight - .5) * 2;
    appState.scatter = Math.min(1.6, appState.scatter + .12);
  }, { passive: true });
  window.addEventListener("touchend", handleTouchSwipe, { passive: true });
  window.addEventListener("keydown", handleKeyboardNav);
  window.addEventListener("resize", resizeThreeOrb);

  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", nextScene);
  });

  goToScene(0, true);
}

function scatterSignalRadar() {
  elements.signalRadar.classList.add("is-scattered");
  appState.scatter = Math.max(appState.scatter, 1.8);
  window.setTimeout(() => {
    elements.signalRadar.classList.remove("is-scattered");
  }, 760);
}

function initAxisNavigation() {
  const startDrag = (event) => {
    appState.isAxisDragging = true;
    elements.navAxis.classList.add("is-dragging");
    updateAxisFromPointer(event);
    elements.navAxis.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    if (!appState.isAxisDragging) return;
    updateAxisFromPointer(event);
  };

  const endDrag = (event) => {
    if (!appState.isAxisDragging) return;
    appState.isAxisDragging = false;
    elements.navAxis.classList.remove("is-dragging");
    const index = getAxisIndexFromPointer(event);
    goToScene(index);
  };

  elements.navAxis.addEventListener("pointerdown", startDrag);
  elements.navAxis.addEventListener("pointermove", moveDrag);
  elements.navAxis.addEventListener("pointerup", endDrag);
  elements.navAxis.addEventListener("pointercancel", endDrag);
}

function updateAxisFromPointer(event) {
  const rect = elements.navAxis.getBoundingClientRect();
  const rawProgress = ((event.clientX - rect.left) / rect.width) * 100;
  const progress = Math.max(0, Math.min(100, rawProgress));
  elements.navAxis.style.setProperty("--axis-progress", `${progress}%`);
}

function getAxisIndexFromPointer(event) {
  const rect = elements.navAxis.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  return Math.round(ratio * (elements.scenes.length - 1));
}

function goToScene(index, instant = false) {
  const nextIndex = Math.max(0, Math.min(index, elements.scenes.length - 1));
  if (nextIndex === appState.activeScene && !instant) return;
  if (appState.isTransitioning && !instant) return;

  const currentScene = elements.scenes[appState.activeScene];
  const next = elements.scenes[nextIndex];
  appState.isTransitioning = true;
  lockScrollDuringTransition();

  if (window.gsap && !prefersReducedMotion && !instant) {
    const currentItems = currentScene ? [...currentScene.children] : [];
    const nextItems = [...next.children];
    const nextWords = [...next.querySelectorAll(".split-word")];
    next.classList.add("active");

    window.gsap.timeline({
      onComplete: () => completeSceneTransition(nextIndex)
    })
      .to(currentItems, {
        opacity: 0,
        y: -18,
        x: window.innerWidth > 780 ? -34 : 0,
        scale: .92,
        filter: "blur(14px)",
        duration: .52,
        ease: "power2.inOut",
        stagger: .025
      }, 0)
      .set(currentScene, { autoAlpha: 0 }, .52)
      .set(next, { autoAlpha: 1 }, .28)
      .fromTo(nextItems, {
        opacity: 0,
        y: 26,
        x: window.innerWidth > 780 ? 40 : 0,
        scale: 1.05,
        filter: "blur(18px)"
      }, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: .86,
        ease: "expo.out",
        stagger: .07
      }, .34)
      .fromTo(nextWords, {
        opacity: 0,
        yPercent: 115
      }, {
        opacity: 1,
        yPercent: 0,
        duration: .9,
        ease: "expo.out",
        stagger: .018
      }, .44);
  } else {
    if (currentScene) currentScene.classList.remove("active");
    next.classList.add("active");
    window.setTimeout(() => completeSceneTransition(nextIndex), instant ? 0 : 520);
  }

  appState.activeScene = nextIndex;
  fireSceneTransition();
  updateSceneUI();
  updateOrbState(nextIndex);
  saveState();
}

function completeSceneTransition(index) {
  elements.scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("active", sceneIndex === index);
    if (window.gsap) {
      window.gsap.set(scene, { clearProps: "visibility,opacity,transform,filter" });
      window.gsap.set([...scene.children], { clearProps: "opacity,transform,filter" });
    }
  });
}

function fireSceneTransition() {
  if (!elements.sceneFlash || prefersReducedMotion) return;
  elements.sceneFlash.classList.remove("is-firing");
  elements.transitionChamber.classList.remove("is-active");
  void elements.sceneFlash.offsetWidth;
  elements.sceneFlash.classList.add("is-firing");
  elements.transitionChamber.classList.add("is-active");
  appState.scatter = Math.max(appState.scatter, 2.8);

  window.setTimeout(() => {
    elements.transitionChamber.classList.remove("is-active");
  }, 980);
}

function lockScrollDuringTransition() {
  window.setTimeout(() => {
    appState.isTransitioning = false;
  }, SCENE_COOLDOWN);
}

function nextScene() {
  goToScene(appState.activeScene + 1);
}

function prevScene() {
  goToScene(appState.activeScene - 1);
}

function handleWheelIntent(event) {
  if (!appState.isExperienceActive) return;
  if (allowPanelScroll(event)) return;
  event.preventDefault();
  if (appState.isTransitioning || Math.abs(event.deltaY) < 24) return;
  if (event.deltaY > 0) nextScene();
  if (event.deltaY < 0) prevScene();
}

function allowPanelScroll(event) {
  if (!event.target || !event.target.closest) return false;
  const panel = event.target.closest(".visual-panel");
  if (!panel || panel.scrollHeight <= panel.clientHeight) return false;

  const movingDown = event.deltaY > 0;
  const canScrollDown = panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
  const canScrollUp = panel.scrollTop > 0;
  return movingDown ? canScrollDown : canScrollUp;
}

function handleTouchSwipe(event) {
  if (!appState.isExperienceActive || appState.isTransitioning) return;
  const endY = event.changedTouches[0].clientY;
  const delta = appState.touchStartY - endY;
  if (Math.abs(delta) < 48) return;
  if (delta > 0) nextScene();
  if (delta < 0) prevScene();
}

function handleKeyboardNav(event) {
  if (!appState.isExperienceActive) return;
  if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    nextScene();
  }
  if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault();
    prevScene();
  }
}

function updateSceneUI() {
  const maxIndex = elements.scenes.length - 1;
  const scene = elements.scenes[appState.activeScene];
  const sceneName = scene.dataset.name;
  const progress = maxIndex ? (appState.activeScene / maxIndex) * 100 : 0;

  elements.stage.classList.remove("scene-0", "scene-1", "scene-2", "scene-3", "scene-4");
  elements.stage.classList.add(`scene-${appState.activeScene}`);
  elements.sceneCounter.textContent = `${String(appState.activeScene + 1).padStart(2, "0")} / ${String(elements.scenes.length).padStart(2, "0")}`;
  elements.sceneName.textContent = sceneName;
  elements.sceneProgress.style.width = `${progress}%`;
  if (elements.depthValue) {
    elements.depthValue.textContent = `${String(Math.round(progress)).padStart(2, "0")}%`;
  }
  elements.prevScene.disabled = appState.activeScene === 0;
  elements.nextScene.disabled = appState.activeScene === maxIndex;
  elements.navAxis.style.setProperty("--axis-progress", `${progress}%`);

  elements.sceneLinks.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.sceneLink) === appState.activeScene);
  });
}

function initTypographyFX() {
  if (!window.SplitType || prefersReducedMotion) return;

  const targets = [...document.querySelectorAll(".entry-content h1, .scene-copy h2")];
  elements.splitHeadlines = targets.map((target) => new window.SplitType(target, {
    types: "lines, words",
    lineClass: "split-line",
    wordClass: "split-word"
  }));
}

function updateProgress() {
  updateSceneUI();
}

function initDiagnosis() {
  elements.backButton.addEventListener("click", () => {
    if (diagnosisState.currentStep <= 0 || diagnosisState.result) return;
    diagnosisState.currentStep -= 1;
    saveState();
    renderQuestion();
  });

  elements.contactCopy.addEventListener("click", () => copySummary(diagnosisState.result || "Leitura inicial pendente", elements.contactStatus));
  elements.contactReset.addEventListener("click", resetDiagnosis);

  if (diagnosisState.result) {
    renderDiagnosisResult();
    return;
  }

  renderQuestion();
}

function renderQuestion() {
  const question = questions[diagnosisState.currentStep];
  const selected = diagnosisState.answers[diagnosisState.currentStep];
  updateDiagnosisProgress();

  transitionQuestion(() => {
    elements.questionStage.innerHTML = `
      <h3 class="question-title">${question.question}</h3>
      <div class="option-grid">
        ${question.options.map((option) => `
          <button class="option-button ${selected === option.label ? "is-selected" : ""}" type="button" data-answer="${option.label}">
            ${option.label}
          </button>
        `).join("")}
      </div>
    `;

    elements.questionStage.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => handleAnswer(button.dataset.answer));
    });
  });
}

function handleAnswer(answer) {
  diagnosisState.answers[diagnosisState.currentStep] = answer;

  if (diagnosisState.currentStep < questions.length - 1) {
    diagnosisState.currentStep += 1;
    saveState();
    renderQuestion();
    return;
  }

  diagnosisState.result = calculateDiagnosis();
  saveState();
  renderDiagnosisResult();
  updateContactPanel();
}

function calculateDiagnosis() {
  const scores = priority.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});

  Object.entries(diagnosisState.answers).forEach(([step, answer]) => {
    const option = questions[Number(step)].options.find((item) => item.label === answer);
    if (!option) return;
    Object.entries(option.scores).forEach(([type, value]) => {
      scores[type] += value;
    });
  });

  const highestScore = Math.max(...Object.values(scores));
  return priority.find((type) => scores[type] === highestScore) || "Decisão no Escuro";
}

function renderDiagnosisResult() {
  const type = diagnosisState.result || calculateDiagnosis();
  const phrase = diagnosisPhrases[type];
  updateDiagnosisProgress(true);

  transitionQuestion(() => {
    elements.questionStage.innerHTML = `
      <div class="result-shell">
        <span class="result-badge">Leitura inicial</span>
        <div>
          <h3 class="result-title">${type}</h3>
          <p>
            Esse resultado não é uma conclusão fechada. É um primeiro sinal sobre onde pode
            existir oportunidade de clareza, controle e melhoria operacional.
          </p>
        </div>
        <p class="result-note">${phrase}</p>
        <div class="result-actions">
          <a class="button button-primary" href="${buildWhatsAppLink(type)}" target="_blank" rel="noopener">Falar pelo WhatsApp</a>
          <button class="button button-ghost" type="button" id="copyButton">Copiar resumo</button>
          <button class="button button-ghost" type="button" id="resetButton">Refazer leitura</button>
        </div>
        <p class="copy-status" id="copyStatus" aria-live="polite"></p>
      </div>
    `;

    elements.questionStage.querySelector("#copyButton").addEventListener("click", () => {
      copySummary(type, elements.questionStage.querySelector("#copyStatus"));
    });
    elements.questionStage.querySelector("#resetButton").addEventListener("click", resetDiagnosis);
  });
}

function updateDiagnosisProgress(isComplete = false) {
  const visibleStep = Math.min(diagnosisState.currentStep + 1, questions.length);
  elements.stepLabel.textContent = isComplete ? "Leitura inicial concluída" : `Etapa ${visibleStep} de ${questions.length}`;
  elements.diagnosisProgress.style.width = `${isComplete ? 100 : (visibleStep / questions.length) * 100}%`;
  elements.backButton.disabled = diagnosisState.currentStep === 0 || isComplete;
}

function transitionQuestion(callback) {
  if (prefersReducedMotion) {
    callback();
    return;
  }

  elements.questionStage.classList.add("is-leaving");
  window.setTimeout(() => {
    callback();
    elements.questionStage.classList.remove("is-leaving");
  }, 180);
}

function updateContactPanel() {
  const type = diagnosisState.result;
  if (!type) {
    elements.contactResult.textContent = "Leitura inicial pendente. Complete a cena 04 para gerar um resumo antes do contato.";
    elements.contactWhatsapp.href = buildWhatsAppLink("Leitura inicial pendente");
    return;
  }

  elements.contactResult.textContent = `Leitura inicial: ${type}. ${diagnosisPhrases[type]}`;
  elements.contactWhatsapp.href = buildWhatsAppLink(type);
}

function buildWhatsAppLink(type) {
  const message = `Olá, vim pelo QR Code ${QR_CODE} e quero conversar sobre a imersão Clareza para Decidir. Meu diagnóstico inicial foi: ${type}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildSummary(type) {
  const phrase = diagnosisPhrases[type] || "Leitura inicial ainda não concluída.";
  return [
    "Diagnóstico Clareza para Decidir",
    `Convite: ${QR_CODE}`,
    `Resultado: ${type}`,
    `Resumo: ${phrase}`,
    "Interesse: entender a operação, mapear dores e identificar soluções aplicáveis ao dia a dia."
  ].join("\n");
}

async function copySummary(type, statusElement) {
  const summary = buildSummary(type);
  try {
    await navigator.clipboard.writeText(summary);
    statusElement.textContent = "Resumo copiado.";
  } catch {
    fallbackCopy(summary);
    statusElement.textContent = "Resumo copiado.";
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function resetDiagnosis() {
  diagnosisState.currentStep = 0;
  diagnosisState.answers = {};
  diagnosisState.result = "";
  saveState();
  renderQuestion();
  updateContactPanel();
  goToScene(3);
}

function initCursor() {
  if (isTouchDevice) return;

  window.addEventListener("mousemove", (event) => {
    document.documentElement.style.setProperty("--pointer-x", ((event.clientX / window.innerWidth - .5) * 2).toFixed(3));
    document.documentElement.style.setProperty("--pointer-y", ((event.clientY / window.innerHeight - .5) * 2).toFixed(3));
    elements.customCursor.classList.add("is-visible");
    elements.customCursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    appState.mouse.x = (event.clientX / window.innerWidth - .5) * 2;
    appState.mouse.y = (event.clientY / window.innerHeight - .5) * 2;
    appState.scatter = Math.min(1.8, appState.scatter + .08);
  });

  document.querySelectorAll("button, a").forEach((item) => {
    item.addEventListener("mouseenter", () => elements.customCursor.classList.add("is-cta"));
    item.addEventListener("mouseleave", () => elements.customCursor.classList.remove("is-cta"));
  });
}

function initThreeOrb() {
  if (!window.THREE || prefersReducedMotion) {
    elements.orbFallback.classList.add("is-visible");
    return;
  }

  const particleCount = isTouchDevice ? 420 : 780;
  const scene = new window.THREE.Scene();
  const camera = new window.THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .1, 100);
  const renderer = new window.THREE.WebGLRenderer({
    canvas: elements.orbCanvas,
    alpha: true,
    antialias: true
  });
  const group = new window.THREE.Group();
  const positions = new Float32Array(particleCount * 3);
  const base = [];

  for (let index = 0; index < particleCount; index += 1) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 1.3 + Math.random() * .9;
    const point = {
      x: Math.sin(phi) * Math.cos(theta) * radius,
      y: Math.sin(phi) * Math.sin(theta) * radius,
      z: Math.cos(phi) * radius,
      seed: Math.random() * 10
    };
    base.push(point);
    positions[index * 3] = point.x;
    positions[index * 3 + 1] = point.y;
    positions[index * 3 + 2] = point.z;
  }

  const geometry = new window.THREE.BufferGeometry();
  geometry.setAttribute("position", new window.THREE.BufferAttribute(positions, 3));
  const material = new window.THREE.PointsMaterial({
    color: 0xd7d7d7,
    size: isTouchDevice ? .016 : .012,
    transparent: true,
    opacity: .78,
    depthWrite: false
  });
  const points = new window.THREE.Points(geometry, material);
  const ringGeometry = new window.THREE.TorusGeometry(1.72, .003, 12, 180);
  const ringMaterial = new window.THREE.MeshBasicMaterial({ color: 0xc9c9c9, transparent: true, opacity: .24 });
  const ringA = new window.THREE.Mesh(ringGeometry, ringMaterial);
  const ringB = new window.THREE.Mesh(ringGeometry, ringMaterial.clone());

  ringB.rotation.x = Math.PI / 2.7;
  group.add(points, ringA, ringB);
  scene.add(group);
  camera.position.z = 5.4;

  appState.three = { scene, camera, renderer, group, geometry, positions, base, material, ringA, ringB };
  resizeThreeOrb();
  animateThreeOrb();
}

function animateThreeOrb() {
  if (!appState.three) return;
  const { renderer, scene, camera, group, geometry, positions, base, ringA, ringB } = appState.three;
  const time = performance.now() * .001;
  const mode = appState.activeScene;

  base.forEach((point, index) => {
    const offset = index * 3;
    let x = point.x;
    let y = point.y;
    let z = point.z;

    if (mode === 0) {
      x += Math.sin(time + point.seed) * .42;
      y += Math.cos(time * .8 + point.seed) * .34;
    } else if (mode === 2) {
      const pulse = Math.sin(time * 3 + index * .06) * .18;
      x *= 1 + pulse;
      y *= 1 + pulse;
    } else if (mode === 1) {
      x = Math.sign(point.x || 1) * (Math.abs(point.x) > .65 ? 1.45 : .55);
      y = Math.sign(point.y || 1) * (Math.abs(point.y) > .65 ? 1.1 : .38);
      z *= .42;
    } else if (mode === 3) {
      x *= 1.55;
      y *= .42;
      z *= .16;
    } else if (mode === 4) {
      x *= .62;
      y *= .62;
      z *= .62;
    }

    if (appState.scatter > .01) {
      const push = appState.scatter * (.28 + (point.seed % 1) * .4);
      x += Math.sign(point.x || Math.sin(point.seed)) * push;
      y += Math.sign(point.y || Math.cos(point.seed)) * push;
      z += Math.sin(point.seed + time) * push * .55;
    }

    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = z;
  });

  geometry.attributes.position.needsUpdate = true;
  group.rotation.y += .0028 + appState.mouse.x * .0008;
  group.rotation.x += .0012 + appState.mouse.y * .0005;
  ringA.rotation.z += .003;
  ringB.rotation.y -= .002;
  appState.scatter *= .92;
  renderer.render(scene, camera);
  requestAnimationFrame(animateThreeOrb);
}

function updateOrbState(index) {
  if (!appState.three) return;
  const { group, material, ringA, ringB } = appState.three;
  const targetScale = index === 0 ? .72 : index === 8 ? .58 : 1;
  const targetX = window.innerWidth > 780 ? 1.25 : 0;
  const targetY = index === 7 ? -.18 : 0;

  if (window.gsap && !prefersReducedMotion) {
    window.gsap.to(group.position, { x: targetX, y: targetY, duration: .9, ease: "power3.out" });
    window.gsap.to(group.scale, { x: targetScale, y: targetScale, z: targetScale, duration: .9, ease: "power3.out" });
    window.gsap.to(material, { opacity: index === 3 ? .52 : .78, duration: .7 });
    window.gsap.to([ringA.material, ringB.material], { opacity: index >= 4 && index <= 6 ? .42 : .24, duration: .7 });
  } else {
    group.position.x = targetX;
    group.position.y = targetY;
    group.scale.setScalar(targetScale);
  }
}

function resizeThreeOrb() {
  if (!appState.three) return;
  const { renderer, camera } = appState.three;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  updateOrbState(appState.activeScene);
}

function saveState() {
  appState.savedScene = appState.activeScene;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    scene: appState.activeScene,
    diagnosis: diagnosisState
  }));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    appState.savedScene = Number(parsed.scene) || 0;
    Object.assign(diagnosisState, parsed.diagnosis || {});
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}
