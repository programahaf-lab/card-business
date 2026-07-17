import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { ArrowDown, Home, Menu, MessageCircle, RotateCcw } from "lucide-react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  QR_CODE,
  buildSummary,
  buildWhatsAppLink,
  calculateDiagnosis,
  diagnosisPhrases,
  questions,
  scenes
} from "./data";
import "./styles.css";

ScrollTrigger.config({ ignoreMobileResize: true });

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const sceneCount = scenes.length;
const getSceneMetrics = (progress, index) => {
  const timeline = progress * (sceneCount - 1);
  const distance = timeline - index;
  const focus = clamp(1 - Math.abs(distance), 0, 1);
  const drift = clamp(distance, -1.4, 1.4);
  return {
    distance,
    focus,
    drift,
    entering: clamp(1 + distance, 0, 1),
    leaving: clamp(1 - distance, 0, 1)
  };
};

function useImmersiveScroll(enabled) {
  const [progress, setProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const rafRef = useRef(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", !enabled);
    document.body.classList.toggle("is-locked", !enabled);
    if (!enabled) window.scrollTo(0, 0);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;

    const lenis = new Lenis({
      duration: 1.18,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.08
    });
    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;

    let ticking = false;
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max <= 0 ? 0 : clamp(window.scrollY / max, 0, 1);
      const index = clamp(Math.round(next * (sceneCount - 1)), 0, sceneCount - 1);
      setProgress(next);
      setActiveScene(index);
      document.documentElement.style.setProperty("--scroll-progress", next.toFixed(4));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  const scrollToScene = useCallback((index) => {
    const target = clamp(index, 0, sceneCount - 1);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const top = max * (target / (sceneCount - 1));
    if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 1.18 });
    else window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return { progress, activeScene, scrollToScene };
}

function IntroGate({ phase, onEnter }) {
  return (
    <section className={`intro-gate intro-gate--${phase}`} aria-labelledby="intro-title">
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-core" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="intro-copy">
        <p>Toraka apresenta</p>
        <strong className="intro-brand">TORAKA</strong>
        <h1 id="intro-title">Clareza para Decidir</h1>
        <button type="button" onClick={onEnter} aria-label="Entrar na imersao">
          <span>ENTRAR</span>
        </button>
        <small>{QR_CODE}</small>
      </div>
      <div className="intro-status" aria-hidden="true">
        <span>gestão</span>
        <span>automação</span>
        <span>inteligência</span>
      </div>
    </section>
  );
}

function FieldParticles({ progress, activeScene, pointer }) {
  const pointsRef = useRef(null);
  const shellRef = useRef(null);

  const particles = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.1 + Math.random() * 1.1;
      positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[index * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      positions[index * 3 + 2] = Math.cos(phi) * radius;
      seeds[index] = Math.random() * 100;
    }

    return { count, positions, base: positions.slice(), seeds };
  }, []);

  useFrame(({ clock, camera }, delta) => {
    const points = pointsRef.current;
    const shell = shellRef.current;
    if (!points || !shell) return;

    const positions = points.geometry.attributes.position.array;
    const t = clock.elapsedTime;
    const morph = progress * (sceneCount - 1);
    const local = morph - Math.floor(morph);

    for (let index = 0; index < particles.count; index += 1) {
      const offset = index * 3;
      const seed = particles.seeds[index];
      let x = particles.base[offset];
      let y = particles.base[offset + 1];
      let z = particles.base[offset + 2];

      if (activeScene === 0) {
        x += Math.sin(t + seed) * 0.32;
        y += Math.cos(t * 0.75 + seed) * 0.22;
      } else if (activeScene === 1) {
        x = Math.sign(x || 1) * (0.45 + Math.abs(x) * 0.55);
        y = Math.round((y + 1.5) * 2) / 2 - 1.5;
        z *= 0.28;
      } else if (activeScene === 2) {
        const pulse = Math.sin(t * 3 + index * 0.08) * 0.16;
        x *= 1 + pulse;
        y *= 0.48 + local * 0.3;
      } else if (activeScene === sceneCount - 2) {
        x *= 1.8;
        y *= 0.28;
        z *= 0.12;
      } else {
        x *= 0.42;
        y *= 0.42;
        z *= 0.42;
      }

      const push = Math.max(0, 0.8 - Math.hypot(pointer.current.x - x * 0.1, pointer.current.y - y * 0.1));
      x += pointer.current.x * push * 0.18;
      y += pointer.current.y * push * 0.18;

      positions[offset] = x;
      positions[offset + 1] = y;
      positions[offset + 2] = z;
    }

    points.geometry.attributes.position.needsUpdate = true;
    shell.rotation.y += delta * (0.08 + progress * 0.12);
    shell.rotation.x = THREE.MathUtils.lerp(shell.rotation.x, pointer.current.y * 0.18, 0.04);
    shell.position.x = THREE.MathUtils.lerp(shell.position.x, window.innerWidth > 780 ? 0.72 : 0, 0.03);
    shell.position.y = THREE.MathUtils.lerp(shell.position.y, activeScene === sceneCount - 1 ? -0.08 : 0, 0.03);
    shell.scale.setScalar(THREE.MathUtils.lerp(shell.scale.x, activeScene === 0 ? 0.78 : activeScene === sceneCount - 1 ? 0.58 : 0.94, 0.035));
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 4.2 - progress * 0.55, 0.025);
  });

  return (
    <group ref={shellRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#f4f4f4" size={0.012} transparent opacity={0.82} depthWrite={false} />
      </points>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.7, 0.004, 12, 220]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.24} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2.4, 0]}>
        <torusGeometry args={[1.18, 0.003, 12, 180]} />
        <meshBasicMaterial color="#9bc3ff" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function ExperienceCanvas({ progress, activeScene, pointer }) {
  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.6]} gl={{ antialias: false, alpha: true }}>
        <color attach="background" args={["#030303"]} />
        <ambientLight intensity={0.45} />
        <Suspense fallback={null}>
          <FieldParticles progress={progress} activeScene={activeScene} pointer={pointer} />
          <EffectComposer>
            <Bloom intensity={0.38} luminanceThreshold={0.16} luminanceSmoothing={0.12} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneOverlay({ scene, index, progress, activeScene, result, onCopy }) {
  const metrics = getSceneMetrics(progress, index);
  const isActive = index === activeScene;
  return (
    <section
      className={`scene-panel ${isActive ? "is-active" : ""}`}
      aria-hidden={metrics.focus < 0.08}
      style={{
        "--scene-focus": metrics.focus.toFixed(3),
        "--scene-drift": metrics.drift.toFixed(3),
        "--scene-entering": metrics.entering.toFixed(3),
        "--scene-leaving": metrics.leaving.toFixed(3)
      }}
    >
      <div className="scene-copy">
        <p>{scene.number} / {scene.kicker}</p>
        <h2>{scene.title}</h2>
        <span>{scene.copy}</span>
      </div>
      {scene.id === "reading" ? (
        <Diagnosis />
      ) : scene.id === "contact" ? (
        <ContactCard result={result} onCopy={onCopy} />
      ) : (
        <VisualCard scene={scene} index={index} progress={progress} active={isActive} />
      )}
    </section>
  );
}

function VisualCard({ scene, index, progress, active }) {
  const previousScene = scenes[index - 1];
  const nextScene = scenes[index + 1];
  const metrics = getSceneMetrics(progress, index);
  const orbitShift = metrics.distance * 18;

  return (
    <div className={`visual-card visual-card--${scene.id} ${active ? "is-awake" : ""}`}>
      <div className="visual-card__halo" />
      <div className="card-scan" />
      {scene.pillars ? (
        <div className="pillar-grid">
          {scene.pillars.map((pillar) => (
            <article key={pillar.name}>
              <small>frente</small>
              <strong>{pillar.name}</strong>
              <p>{pillar.detail}</p>
            </article>
          ))}
        </div>
      ) : null}
      {previousScene && !scene.pillars ? (
        <div className="tag-layer tag-layer--past" aria-hidden="true">
          {previousScene.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={`${scene.id}-past-${tag}`}
              style={{ "--i": tagIndex, "--shift": `${orbitShift - 16}px` }}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className={`tag-layer tag-layer--current ${scene.pillars ? "is-hidden" : ""}`}>
        {scene.tags.map((tag, tagIndex) => (
          <span
            key={tag}
            style={{ "--i": tagIndex, "--shift": `${orbitShift}px` }}
          >
            {tag}
          </span>
        ))}
      </div>
      {nextScene && !scene.pillars ? (
        <div className="tag-layer tag-layer--future" aria-hidden="true">
          {nextScene.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={`${scene.id}-future-${tag}`}
              style={{ "--i": tagIndex, "--shift": `${orbitShift + 16}px` }}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="visual-card__caption">
        <small>transicao de cenario</small>
        <strong>{scene.kicker}</strong>
      </div>
      <div className="visual-card__bridge" aria-hidden="true">
        <span>{previousScene?.label || "entrada"}</span>
        <i />
        <span>{nextScene?.label || "acao"}</span>
      </div>
    </div>
  );
}

function Diagnosis() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(() => localStorage.getItem("cnd-result") || "");

  const choose = (answer) => {
    const nextAnswers = { ...answers, [step]: answer };
    setAnswers(nextAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }
    const nextResult = calculateDiagnosis(nextAnswers);
    localStorage.setItem("cnd-result", nextResult);
    window.dispatchEvent(new CustomEvent("cnd:diagnosis", { detail: nextResult }));
    setResult(nextResult);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult("");
    localStorage.removeItem("cnd-result");
    window.dispatchEvent(new CustomEvent("cnd:diagnosis", { detail: "" }));
  };

  if (result) {
    return (
      <div className="diagnosis-card">
        <p>leitura inicial</p>
        <h3>{result}</h3>
        <span>{diagnosisPhrases[result]}</span>
        <div className="diagnosis-actions">
          <a className="primary-action" href={buildWhatsAppLink(result)} target="_blank" rel="noreferrer">
            <MessageCircle size={17} /> Agendar conversa
          </a>
          <button type="button" onClick={reset}>
            <RotateCcw size={16} /> Refazer
          </button>
        </div>
      </div>
    );
  }

  const current = questions[step];
  return (
    <div className="diagnosis-card">
      <p>etapa {step + 1} de {questions.length}</p>
      <h3>{current.question}</h3>
      <div className="option-grid">
        {current.options.map((option) => (
          <button key={option.label} type="button" onClick={() => choose(option.label)}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactCard({ result, onCopy }) {
  const type = result || "Leitura inicial pendente";
  return (
    <div className="contact-card">
      <p>{QR_CODE}</p>
      <h3>{type}</h3>
      <span>{result ? diagnosisPhrases[result] : "Complete a cena 04 para gerar um resumo antes do contato."}</span>
      <div className="diagnosis-actions">
        <a className="primary-action" href={buildWhatsAppLink(type)} target="_blank" rel="noreferrer">
          <MessageCircle size={17} /> Agendar conversa
        </a>
        <button type="button" onClick={() => onCopy(type)}>Copiar resumo</button>
      </div>
    </div>
  );
}

function Navigation({ activeScene, progress, scrollToScene }) {
  return (
    <>
      <header className="topbar">
        <button type="button" onClick={() => scrollToScene(0)} aria-label="Voltar ao inicio">
          <Home size={17} />
        </button>
        <span><b>TORAKA</b> · Clareza para Decidir</span>
        <strong>{QR_CODE}</strong>
      </header>
      <aside className="scene-rail" aria-label="Navegacao por cenas">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            className={index === activeScene ? "is-active" : ""}
            type="button"
            onClick={() => scrollToScene(index)}
          >
            <small>{scene.number}</small>
            <span>{scene.label}</span>
          </button>
        ))}
      </aside>
      <div className="depth-meter" aria-hidden="true">
        <span>depth</span>
        <strong>{String(Math.round(progress * 100)).padStart(2, "0")}%</strong>
      </div>
      <button className="mobile-menu" type="button" aria-label="Menu de cenas">
        <Menu size={17} />
      </button>
    </>
  );
}

function ScrollWorld({ activeScene, progress, result, onCopy }) {
  return (
    <main className="scroll-world" style={{ "--scene-count": scenes.length }}>
      <div className="sticky-stage">
        {scenes.map((scene, index) => (
          <SceneOverlay
            key={scene.id}
            scene={scene}
            index={index}
            progress={progress}
            activeScene={activeScene}
            result={result}
            onCopy={onCopy}
          />
        ))}
      </div>
      {scenes.map((scene) => (
        <div key={`${scene.id}-spacer`} className="scroll-snap-spacer" aria-hidden="true" />
      ))}
    </main>
  );
}

function App() {
  const [phase, setPhase] = useState("idle");
  const [entered, setEntered] = useState(false);
  const [result, setResult] = useState(() => localStorage.getItem("cnd-result") || "");
  const [copyStatus, setCopyStatus] = useState("");
  const pointer = useRef({ x: 0, y: 0 });
  const { progress, activeScene, scrollToScene } = useImmersiveScroll(entered);

  useEffect(() => {
    const onPointer = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty("--px", pointer.current.x.toFixed(3));
      document.documentElement.style.setProperty("--py", (-pointer.current.y).toFixed(3));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  useEffect(() => {
    const onDiagnosis = (event) => setResult(event.detail || "");
    window.addEventListener("cnd:diagnosis", onDiagnosis);
    return () => window.removeEventListener("cnd:diagnosis", onDiagnosis);
  }, []);

  const enter = () => {
    if (phase !== "idle") return;
    setPhase("charge");
    window.setTimeout(() => setPhase("burst"), 720);
    window.setTimeout(() => setPhase("reveal"), 1180);
    window.setTimeout(() => {
      setEntered(true);
      setPhase("settled");
    }, 1750);
  };

  const copySummary = async (type) => {
    const summary = buildSummary(type);
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Resumo copiado.");
    } catch {
      setCopyStatus("Resumo pronto para copiar.");
    }
    window.setTimeout(() => setCopyStatus(""), 2200);
  };

  return (
    <>
      <ExperienceCanvas progress={entered ? progress : 0} activeScene={entered ? activeScene : 0} pointer={pointer} />
      <div className="grain" aria-hidden="true" />
      <IntroGate phase={phase} onEnter={enter} />
      <Navigation activeScene={activeScene} progress={progress} scrollToScene={scrollToScene} />
      <ScrollWorld activeScene={activeScene} progress={progress} result={result} onCopy={copySummary} />
      <div className={`copy-toast ${copyStatus ? "is-visible" : ""}`} role="status">
        {copyStatus}
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <ArrowDown size={16} />
        <span>scroll</span>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
