import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronLeft,
  CircleAlert,
  CircleCheck,
  Clock3,
  Code2,
  GraduationCap,
  HeartHandshake,
  LockKeyhole,
  ListChecks,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import {
  formatTopicTitle,
  getTopicPresentationTitle,
  getTopicSlides,
} from "./data/presentations";
import {
  fetchTopics,
  fetchQuestions,
  isSupabaseConfigured,
  submitQuiz,
  type QuizKind,
  type QuizQuestion,
  type QuizResult,
  type TopicRecord,
} from "./lib/supabase";
import "./styles.css";

const progressKey = "cuidarnos:progress";
const visitorKey = "cuidarnos:visitor";
type TopicProgress = { passed: boolean; score: number; completedAt: string };
type ProgressMap = Record<string, TopicProgress>;

function readProgress(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(progressKey) ?? "{}") as ProgressMap;
  } catch {
    return {};
  }
}

function getVisitorId() {
  let visitorId = localStorage.getItem(visitorKey);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(visitorKey, visitorId);
  }
  return visitorId;
}

function App() {
  const [progress, setProgress] = useState<ProgressMap>(readProgress);
  function savePass(topicSlug: string, score: number) {
    const next = {
      ...readProgress(),
      [topicSlug]: {
        passed: true,
        score,
        completedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem(progressKey, JSON.stringify(next));
    setProgress(next);
  }
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Cuidarnos en red, inicio">
          <span className="brand-mark">
            <ShieldCheck size={21} />
          </span>
          <span className="brand-name">
            CUIDARNOS<span>EN RED</span>
          </span>
        </Link>
        <nav className="header-nav" aria-label="Navegación principal">
          <Link to="/">Temas</Link>
          <Link to="/desarrolladores">Desarrolladores</Link>
          <span className="nav-divider" />
          <span className="anonymous-label">
            <span /> aprendizaje anónimo
          </span>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home progress={progress} />} />
          <Route path="/desarrolladores" element={<DevelopersPage />} />
          <Route
            path="*"
            element={<TopicRoutes progress={progress} onPass={savePass} />}
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>Una iniciativa de prevención y cuidado digital</span>
        <span>Tu avance queda guardado en este dispositivo</span>
      </footer>
    </div>
  );
}

function DevelopersPage() {
  return (
    <div className="developers-page page-wrap">
      <div className="eyebrow">
        <span className="eyebrow-line" /> SOBRE EL PROYECTO
      </div>
      <section className="developers-hero">
        <div className="developers-hero-icon" aria-hidden="true">
          <UsersRound size={30} />
        </div>
        <p className="kicker">Cuidarnos en red</p>
        <h1>
          Conoce al equipo
          <br />
          <em>detrás del proyecto.</em>
        </h1>
        <p>
          Una plataforma educativa para aprender sobre prevención y cuidado
          digital, creada como proyecto académico.
        </p>
      </section>

      <section className="developers-team" aria-labelledby="team-title">
        <div className="developers-section-heading">
          <UsersRound size={20} />
          <h2 id="team-title">Presentación del equipo</h2>
        </div>
        <article className="developer-card">
          <div className="developer-avatar" aria-hidden="true">
            DE
          </div>
          <div>
            <p className="section-index">PROYECTO DESARROLLADO POR</p>
            <h3>Daniel Cristian Escobar Sejas</h3>
            <p>Desarrollo y diseño de Cuidarnos en red.</p>
          </div>
        </article>
      </section>

      <section className="developers-grid" aria-label="Detalles del proyecto">
        <article className="developer-info-card">
          <div className="developers-section-heading">
            <HeartHandshake size={20} />
            <h2>Propósito del proyecto</h2>
          </div>
          <p>
            Ofrecer un espacio accesible para aprender a reconocer riesgos en
            entornos digitales, verificar ofertas laborales y conocer formas
            más seguras de buscar apoyo, con contenidos de prevención claros y
            respetuosos.
          </p>
        </article>

        <article className="developer-info-card">
          <div className="developers-section-heading">
            <Code2 size={20} />
            <h2>Tecnologías utilizadas</h2>
          </div>
          <ul className="technology-list">
            <li>React y TypeScript</li>
            <li>Vite</li>
            <li>Supabase y PostgreSQL</li>
            <li>React Router</li>
            <li>CSS</li>
          </ul>
        </article>

        <article className="developer-info-card developer-features">
          <div className="developers-section-heading">
            <ListChecks size={20} />
            <h2>Funcionalidades implementadas</h2>
          </div>
          <ul className="feature-list">
            <li>Catálogo de módulos educativos publicados.</li>
            <li>Presentaciones organizadas en diapositivas.</li>
            <li>Práctica opcional y Quiz General por tema.</li>
            <li>Evaluación automática con puntaje mínimo de aprobación.</li>
            <li>Seguimiento local del avance y constancia de demostración.</li>
          </ul>
          <p className="developer-disclaimer">
            Las constancias son demostrativas y no constituyen credenciales
            verificables.
          </p>
        </article>
      </section>

      <section className="developers-credits" aria-labelledby="credits-title">
        <div className="developers-section-heading">
          <GraduationCap size={20} />
          <h2 id="credits-title">Créditos académicos</h2>
        </div>
        <dl className="credits-list">
          <div>
            <dt>Institución</dt>
            <dd>
              Instituto Técnico Nacional de Comercio “Federico Álvarez Plata”
              Nocturno
            </dd>
          </div>
          <div>
            <dt>Carrera</dt>
            <dd>Sistemas Informáticos</dd>
          </div>
          <div>
            <dt>Asignatura</dt>
            <dd>Diseño y Programación Web III</dd>
          </div>
          <div>
            <dt>Docente</dt>
            <dd>Pavel Cáceres</dd>
          </div>
          <div>
            <dt>Gestión</dt>
            <dd>2026</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function TopicRoutes({
  progress,
  onPass,
}: {
  progress: ProgressMap;
  onPass: (topicSlug: string, score: number) => void;
}) {
  const { pathname } = useLocation();
  const path = pathname.replace(/^\/+|\/+$/g, "");
  if (!path) return <Navigate to="/" replace />;

  const isCertificate = path.endsWith("-certificado");
  const isQuiz = path.endsWith("-quiz");
  const topicSlug = path.replace(/-(certificado|quiz)$/, "");
  if (!getTopicSlides(topicSlug).length) return <Navigate to="/" replace />;

  if (isCertificate)
    return <CertificatePage progress={progress} topicSlug={topicSlug} />;
  if (isQuiz) return <QuizPage topicSlug={topicSlug} onPass={onPass} />;
  return <TopicPage topicSlug={topicSlug} />;
}

const localTopics: TopicRecord[] = [
  {
    slug: "redes-sociales",
    title: "Redes sociales y cuidado digital",
    description:
      "Reconoce riesgos, protege tu información y aprende qué hacer ante un contacto que te incomoda.",
    image_url:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    position: 1,
  },
  {
    slug: "trabajos-falsos",
    title: "Trabajos falsos y ofertas laborales engañosas",
    description:
      "Aprende a verificar ofertas de empleo, detectar presiones y buscar apoyo seguro en Bolivia.",
    image_url:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    position: 2,
  },
  {
    slug: "trata-estafas-digitales",
    title: "Trata para cometer estafas digitales",
    description:
      "Aprende a reconocer ofertas falsas usadas para captar personas y a distinguir estafa de trata con fines de criminalidad forzada.",
    image_url:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85",
    position: 3,
  },
];

function Home({ progress }: { progress: ProgressMap }) {
  const [topics, setTopics] = useState<TopicRecord[]>(localTopics);

  useEffect(() => {
    let active = true;
    fetchTopics()
      .then((publishedTopics) => {
        if (active && publishedTopics.length) {
          setTopics((currentTopics) => {
            const topicsBySlug = new Map(
              currentTopics.map((topic) => [topic.slug, topic]),
            );
            for (const topic of publishedTopics) {
              topicsBySlug.set(topic.slug, topic);
            }
            return [...topicsBySlug.values()].sort(
              (first, second) => first.position - second.position,
            );
          });
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="home-page page-wrap">
      <div className="eyebrow">
        <span className="eyebrow-line" /> APRENDER PARA PREVENIR{" "}
        <span>{String(topics.length).padStart(2, "0")} TEMAS</span>
      </div>
      <section className="home-intro">
        <div>
          <p className="kicker">Herramientas para cuidarnos</p>
          <h1>
            La seguridad
            <br />
            <em>también se aprende.</em>
          </h1>
        </div>
        <p className="intro-copy">
          Conocer las señales y saber dónde pedir ayuda puede abrir una puerta a
          tiempo. Explora cada tema a tu ritmo.
        </p>
      </section>
      <section className="topic-section" aria-labelledby="topic-heading">
        <div className="section-heading">
          <div>
            <p className="section-index">TU RUTA DE APRENDIZAJE</p>
            <h2 id="topic-heading">Temas disponibles</h2>
          </div>
          <span className="topic-count">
            {topics.length} {topics.length === 1 ? "tema" : "temas"}
          </span>
        </div>
        <div className="topic-list">
          {topics.map((topic, index) => {
            const passed = progress[topic.slug]?.passed;
            return (
              <Link
                className="topic-card"
                to={`/${topic.slug}`}
                key={topic.slug}
              >
                <div
                  className="topic-photo"
                  role="img"
                  aria-label={topic.title}
                  style={{ backgroundImage: `url("${topic.image_url}")` }}
                />
                <div className="topic-card-body">
                  <div className="topic-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="meta-dot" />
                    <span>Presentación y evaluación</span>
                  </div>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  <span
                    className={`completion-state ${passed ? "is-passed" : ""}`}
                  >
                    {passed ? (
                      <>
                        <CircleCheck size={17} /> Tema aprobado
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={16} /> Aún por completar
                      </>
                    )}
                  </span>
                  <span className="topic-open" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="care-note">
        <div className="care-icon">
          <Sparkles size={18} />
        </div>
        <p>
          <strong>Un espacio sin juicios.</strong> La responsabilidad nunca es
          de quien sufre explotación. Pedir apoyo es un acto de cuidado.
        </p>
        <span>01</span>
      </section>
    </div>
  );
}

function TopicPage({ topicSlug }: { topicSlug: string }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showOptionalQuiz, setShowOptionalQuiz] = useState(false);
  const slides = getTopicSlides(topicSlug);
  const slide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;
  return (
    <div className="learning-page page-wrap">
      <Link className="back-link" to="/">
        <ArrowLeft size={16} /> Todos los temas
      </Link>
      <div className="learning-heading">
        <div>
          <p className="section-index">
            TEMA <span className="meta-dot" />{" "}
            {formatTopicTitle(topicSlug).toLocaleUpperCase("es")}
          </p>
          <h1>{getTopicPresentationTitle(topicSlug)}</h1>
        </div>
        <div className="reading-time">
          <Clock3 size={16} /> 6 min <span>·</span> {slides.length} diapositivas
        </div>
      </div>
      <section className="slide-frame" aria-live="polite">
        <div className={`slide-art art-${slide.art}`}>
          <span className="art-index">0{slideIndex + 1}</span>
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-symbol">
            {slide.art === "signal" ? (
              <CircleAlert size={54} />
            ) : slide.art === "shield" ? (
              <ShieldCheck size={58} />
            ) : slide.art === "steps" ? (
              <ArrowRight size={58} />
            ) : (
              <LockKeyhole size={54} />
            )}
          </div>
          <span className="art-caption">CUIDADO DIGITAL / 2026</span>
        </div>
        <div className="slide-copy">
          <div className="slide-topline">
            <span>DIAPOSITIVA {String(slideIndex + 1).padStart(2, "0")}</span>
            <span>{String(slides.length).padStart(2, "0")}</span>
          </div>
          <h2>{slide.title}</h2>
          <p className="slide-lead">{slide.lead}</p>
          <ul className="slide-points">
            {slide.points.map((point) => (
              <li key={point}>
                <span>
                  <Check size={14} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="slide-bottom">
            <div
              className="slide-progress"
              aria-label={`Diapositiva ${slideIndex + 1} de ${slides.length}`}
            >
              {slides.map((item, index) => (
                <span
                  key={item.title}
                  className={index <= slideIndex ? "active" : ""}
                />
              ))}
            </div>
            <div className="slide-controls">
              <button
                className="icon-button"
                type="button"
                onClick={() => setSlideIndex((value) => Math.max(0, value - 1))}
                disabled={slideIndex === 0}
                aria-label="Diapositiva anterior"
              >
                <ChevronLeft size={19} />
              </button>
              {isLastSlide ? (
                <button
                  className="button button-dark"
                  type="button"
                  onClick={() => setShowOptionalQuiz(true)}
                >
                  Probar lo aprendido <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="icon-button next-button"
                  type="button"
                  onClick={() =>
                    setSlideIndex((value) =>
                      Math.min(slides.length - 1, value + 1),
                    )
                  }
                  aria-label="Siguiente diapositiva"
                >
                  <ArrowRight size={19} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="learning-bottom">
        <p>
          <BookOpen size={16} /> El cuestionario breve de 5 preguntas es
          opcional. Para aprobar el tema y obtener tu constancia, responde el
          Quiz General de 10 preguntas.
        </p>
        <Link to={`/${topicSlug}-quiz`}>
          Obtén el certificado respondiendo al Quiz General{" "}
          <ArrowUpRight size={15} />
        </Link>
      </div>
      {showOptionalQuiz && (
        <QuizModal
          topicSlug={topicSlug}
          onClose={() => setShowOptionalQuiz(false)}
        />
      )}
    </div>
  );
}

function QuizModal({
  topicSlug,
  onClose,
}: {
  topicSlug: string;
  onClose: () => void;
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="quiz-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="optional-title"
      >
        <button
          className="icon-button modal-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar cuestionario"
        >
          <X size={18} />
        </button>
        <p className="section-index">PRÁCTICA OPCIONAL</p>
        <h2 id="optional-title">
          Un momento para
          <br />
          <em>comprobar lo aprendido.</em>
        </h2>
        <Quiz topicSlug={topicSlug} kind="optional" onPass={() => undefined} />
      </section>
    </div>
  );
}

function QuizPage({
  topicSlug,
  onPass,
}: {
  topicSlug: string;
  onPass: (topicSlug: string, score: number) => void;
}) {
  return (
    <div className="quiz-page page-wrap">
      <Link className="back-link" to={`/${topicSlug}`}>
        <ArrowLeft size={16} /> Volver al tema
      </Link>
      <div className="quiz-page-heading">
        <p className="section-index">
          QUIZ GENERAL <span className="meta-dot" /> EVALUACIÓN FINAL
        </p>
        <h1>
          Lo que sabes
          <br />
          <em>también te protege.</em>
        </h1>
        <p>
          Responde las preguntas para aprobar. Necesitas al menos 80% de
          respuestas correctas.
        </p>
      </div>
      <Quiz
        topicSlug={topicSlug}
        kind="required"
        onPass={(score) => onPass(topicSlug, score)}
      />
    </div>
  );
}

function Quiz({
  topicSlug,
  kind,
  onPass,
}: {
  topicSlug: string;
  kind: QuizKind;
  onPass: (score: number) => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isRequired = kind === "required";

  useEffect(() => {
    let active = true;
    fetchQuestions(topicSlug, kind)
      .then((items) => {
        if (active) setQuestions(items);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : "No fue posible cargar las preguntas.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [kind, topicSlug]);

  async function handleSubmit() {
    if (Object.keys(answers).length !== questions.length) return;
    setSubmitting(true);
    setError("");
    try {
      const quizResult = await submitQuiz(
        topicSlug,
        kind,
        getVisitorId(),
        answers,
      );
      setResult(quizResult);
      if (isRequired && quizResult.passed) onPass(quizResult.score);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No fue posible enviar tus respuestas.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setAnswers({});
    setResult(null);
  }
  if (loading)
    return (
      <div className="quiz-status">
        <span className="loader" /> Cargando preguntas…
      </div>
    );
  if (error && questions.length === 0)
    return (
      <div className="quiz-unavailable">
        <CircleAlert size={22} />
        <div>
          <strong>No se pudo cargar el cuestionario</strong>
          <p>{error}</p>
        </div>
      </div>
    );
  if (questions.length === 0)
    return (
      <div className="quiz-unavailable">
        <LockKeyhole size={22} />
        <div>
          <strong>Cuestionario no disponible todavía</strong>
          <p>
            {isSupabaseConfigured
              ? "Aún no hay preguntas aprobadas publicadas para este tema."
              : "Conecta Supabase y publica el banco de preguntas revisado para activar esta evaluación."}
          </p>
        </div>
      </div>
    );
  if (result)
    return (
      <section
        className={`quiz-result ${result.passed ? "result-passed" : "result-retry"}`}
      >
        <div className="result-icon">
          {result.passed ? <BadgeCheck size={27} /> : <RotateCcw size={24} />}
        </div>
        <p className="section-index">
          {result.passed ? "EVALUACIÓN APROBADA" : "SIGUE PRACTICANDO"}
        </p>
        <h2>
          {result.score}
          <span>%</span>
        </h2>
        <p>
          {result.passed
            ? "Has completado el tema. Tu constancia ya está disponible."
            : "Necesitas 80% para aprobar. Repasa el tema e inténtalo de nuevo."}
        </p>
        <div className="result-actions">
          {result.passed && isRequired && (
            <button
              className="button button-dark"
              type="button"
              onClick={() => navigate(`/${topicSlug}-certificado`)}
            >
              Ver mi constancia <ArrowRight size={16} />
            </button>
          )}
          {!result.passed && isRequired && (
            <button
              className="button button-dark"
              type="button"
              onClick={retry}
            >
              Intentar de nuevo <RotateCcw size={15} />
            </button>
          )}
          {!isRequired && (
            <button
              className="button button-dark"
              type="button"
              onClick={retry}
            >
              Volver a practicar <RotateCcw size={15} />
            </button>
          )}
        </div>
      </section>
    );
  return (
    <div
      className={`quiz-content ${isRequired ? "required-quiz" : "optional-quiz"}`}
    >
      <div className="quiz-progress-label">
        <span>{questions.length} preguntas</span>
        <span>
          {Object.keys(answers).length} de {questions.length} respondidas
        </span>
      </div>
      {questions.map((question, questionIndex) => (
        <fieldset className="question-block" key={question.id}>
          <legend>
            <span>{String(questionIndex + 1).padStart(2, "0")}</span>
            {question.prompt}
          </legend>
          <div className="answer-list">
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;
              return (
                <button
                  className={`answer-option ${selected ? "selected" : ""}`}
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setAnswers((previous) => ({
                      ...previous,
                      [question.id]: optionIndex,
                    }))
                  }
                >
                  <span className="answer-marker">
                    {selected ? (
                      <Check size={14} />
                    ) : (
                      String.fromCharCode(65 + optionIndex)
                    )}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      {error && (
        <p className="inline-error">
          <CircleAlert size={15} />
          {error}
        </p>
      )}
      <button
        className="button button-dark quiz-submit"
        type="button"
        disabled={
          submitting || Object.keys(answers).length !== questions.length
        }
        onClick={handleSubmit}
      >
        {submitting
          ? "Revisando…"
          : isRequired
            ? "Enviar respuestas"
            : "Ver resultado"}{" "}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function CertificatePage({
  progress,
  topicSlug,
}: {
  progress: ProgressMap;
  topicSlug: string;
}) {
  const completion = progress[topicSlug];
  if (!completion?.passed)
    return <Navigate to={`/${topicSlug}-quiz`} replace />;
  const completedDate = new Intl.DateTimeFormat("es", {
    dateStyle: "long",
  }).format(new Date(completion.completedAt));
  return (
    <div className="certificate-page page-wrap">
      <Link className="back-link" to="/">
        <ArrowLeft size={16} /> Volver a mis temas
      </Link>
      <div className="certificate-label">
        <BadgeCheck size={17} /> CONSTANCIA DE APRENDIZAJE
      </div>
      <article className="certificate">
        <div className="certificate-top">
          <span className="certificate-brand">
            <ShieldCheck size={20} /> CUIDARNOS EN RED
          </span>
          <span>01 — 2026</span>
        </div>
        <div className="certificate-center">
          <div className="certificate-seal">
            <BadgeCheck size={39} />
          </div>
          <p>SE RECONOCE QUE</p>
          <h1>
            Has completado
            <br />
            <em>el tema de aprendizaje</em>
          </h1>
          <div className="certificate-rule" />
          <h2>
            {topicSlug === "redes-sociales"
              ? "Redes sociales y cuidado digital"
              : formatTopicTitle(topicSlug)}
          </h2>
          <p className="certificate-description">
            Por participar y aprobar la evaluación de prevención y cuidado en
            entornos digitales.
          </p>
        </div>
        <div className="certificate-bottom">
          <div>
            <span>FECHA DE FINALIZACIÓN</span>
            <strong>{completedDate}</strong>
          </div>
          <div>
            <span>RESULTADO</span>
            <strong>{completion.score}% · APROBADO</strong>
          </div>
          <div className="certificate-stamp">
            PREVENCIÓN
            <br />Y CUIDADO
          </div>
        </div>
      </article>
      <p className="certificate-note">
        <CircleAlert size={15} /> Constancia de demostración. Tu avance se
        guarda localmente en este dispositivo.
      </p>
      <Link className="text-link" to="/">
        Continuar aprendiendo <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default App;
