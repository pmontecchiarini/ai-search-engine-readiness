'use client';
import { AUDIT_METRICS_DATA } from './constants/metrics';
import {
  CHECK_ORDER,
  calculateReadinessScore,
  scoreColorClasses,
  priorityFor,
  topPriorityKeys,
} from './constants/phases';
import type { MetricContent, AuditResults } from './constants/types';
import { useEffect, useState } from 'react';

type Lang = 'en' | 'es';
type Status = 'optimized' | 'needs_improvement' | 'action_required';
type Band = 'red' | 'yellow' | 'green';

const BAND_STYLES: Record<Band, { ring: string; badgeBg: string; badgeText: string; dot: string }> = {
  red: { ring: 'bg-status-bad-bg', badgeBg: 'bg-status-bad-bg', badgeText: 'text-status-bad', dot: 'bg-status-bad' },
  yellow: {
    ring: 'bg-status-warn-bg',
    badgeBg: 'bg-status-warn-bg',
    badgeText: 'text-status-warn',
    dot: 'bg-status-warn',
  },
  green: {
    ring: 'bg-status-good-bg',
    badgeBg: 'bg-status-good-bg',
    badgeText: 'text-status-good',
    dot: 'bg-status-good',
  },
};

// Friendly, language-aware label for a check's raw priority string (which
// already differs by language, e.g. "CRITICAL" vs "CRITICO").
const PRIORITY_META: Record<string, { en: string; es: string; dot: string }> = {
  CRITICAL: { en: 'Fix this first', es: 'Arreglá esto primero', dot: 'bg-status-bad' },
  CRITICO: { en: 'Fix this first', es: 'Arreglá esto primero', dot: 'bg-status-bad' },
  HIGH: { en: 'High impact', es: 'Alto impacto', dot: 'bg-status-bad' },
  ALTO: { en: 'High impact', es: 'Alto impacto', dot: 'bg-status-bad' },
  MEDIUM: { en: 'Worth fixing', es: 'Vale la pena arreglar', dot: 'bg-status-warn' },
  MEDIO: { en: 'Worth fixing', es: 'Vale la pena arreglar', dot: 'bg-status-warn' },
  LOW: { en: 'Nice to have', es: 'Si tenés tiempo', dot: 'bg-muted' },
  BAJO: { en: 'Nice to have', es: 'Si tenés tiempo', dot: 'bg-muted' },
};

/* ------------------------------------------------------------------ *
 * Readiness summary — score, traffic-light verdict, and (if any
 * CRITICAL/HIGH checks failed) the concrete "fix this first" list, all
 * in one block so the diagnosis and the fix are never separated by a
 * scroll — no need to go hunting for what the score sentence means.
 * ------------------------------------------------------------------ */
function ReadinessSummary({
  score,
  lang,
  priorityKeys,
  metrics,
}: {
  score: number;
  lang: Lang;
  priorityKeys: string[];
  metrics: Record<string, MetricContent>;
}) {
  const { band } = scoreColorClasses(score);
  const styles = BAND_STYLES[band];
  const en = lang === 'en';

  const verdict = {
    red:
      lang === 'en'
        ? 'Critical gaps — your site is largely invisible to AI search engines.'
        : 'Brechas críticas — tu sitio es prácticamente invisible para los motores de IA.',
    yellow:
      lang === 'en'
        ? 'On the right track — key fixes remain to earn AI trust and citations.'
        : 'Vas por buen camino — faltan ajustes clave para ganar la confianza y las citas de la IA.',
    green:
      lang === 'en'
        ? 'Strong readiness — your site is well optimized for AI discovery.'
        : 'Excelente preparación — tu sitio está bien optimizado para el descubrimiento por IA.',
  }[band];

  return (
    <section className="mb-10 flex flex-col items-center text-center p-10 rounded-3xl bg-surface border border-border">
      <div className={`flex items-center justify-center w-36 h-36 rounded-full ${styles.badgeBg}`}>
        <span className={`text-5xl font-extrabold tabular-nums ${styles.badgeText}`}>{score}</span>
      </div>
      <div className="flex items-center gap-2 mt-6">
        {(['red', 'yellow', 'green'] as const).map((b) => (
          <span
            key={b}
            className={`w-3 h-3 rounded-full ${b === band ? BAND_STYLES[b].dot : 'bg-border'}`}
          />
        ))}
      </div>
      <h2 className="mt-4 text-xs font-bold uppercase tracking-widest text-muted">
        {lang === 'en' ? 'AI Readiness Score' : 'Puntuación de Preparación IA'}
      </h2>
      <p className="mt-3 max-w-md text-base text-foreground/80">{verdict}</p>

      {priorityKeys.length > 0 && (
        <div className="mt-8 pt-8 w-full max-w-xl border-t border-border text-left">
          <h3 className="text-sm font-bold text-foreground mb-4 text-center">
            {en ? 'Fix these first' : 'Arreglá esto primero'}
          </h3>
          <div className="space-y-3">
            {priorityKeys.map((key) => {
              const content = metrics[key];
              if (!content) return null;
              const firstStep = Array.isArray(content.recommendation)
                ? content.recommendation[0]
                : content.recommendation;
              return (
                <div
                  key={key}
                  className="flex items-start gap-3 p-4 rounded-xl bg-status-bad-bg/50 border border-status-bad/20"
                >
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-status-bad shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{content.friendlyTitle}</p>
                    <p className="text-sm text-muted mt-0.5">{firstStep}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Renders a recommendation that may be a single string or a list.
 * ------------------------------------------------------------------ */
function Recommendation({
  recommendation,
  bulletCls,
  textCls,
}: {
  recommendation: string | string[];
  bulletCls: string;
  textCls: string;
}) {
  if (Array.isArray(recommendation)) {
    return (
      <ul className="space-y-3">
        {recommendation.map((step, index) => (
          <li key={index} className={`flex gap-3 text-sm ${textCls} font-medium leading-relaxed`}>
            <span className={`${bulletCls} font-bold`}>•</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className={`text-sm ${textCls} font-medium leading-relaxed`}>{recommendation}</p>;
}

// Shared recommendation-panel accent — one scheme now that there's a single
// flat list of checks instead of two thematic phases.
const ACCENT = { panel: 'bg-blue-50 border-blue-100', label: 'text-blue-700', bullet: 'text-blue-500', text: 'text-blue-900' };

/* ------------------------------------------------------------------ *
 * Single check card; status drives the badge color.
 * ------------------------------------------------------------------ */
function CheckCard({
  content,
  priority,
  status,
  lang,
  titleOverride,
  recommendationOverride,
}: {
  content: MetricContent;
  priority: string;
  status: Status;
  lang: Lang;
  titleOverride?: string;
  recommendationOverride?: string | string[];
}) {
  const en = lang === 'en';

  const statusMeta: Record<Status, { label: string; badge: string }> = {
    optimized: {
      label: en ? 'Optimized' : 'Optimizado',
      badge: 'text-status-good bg-status-good-bg',
    },
    needs_improvement: {
      label: en ? 'Needs work' : 'Necesita ajustes',
      badge: 'text-status-warn bg-status-warn-bg',
    },
    action_required: {
      label: en ? 'Action needed' : 'Necesita acción',
      badge: 'text-status-bad bg-status-bad-bg',
    },
  };

  const meta = statusMeta[status];
  const priorityMeta = PRIORITY_META[priority] ?? PRIORITY_META.LOW;
  const showDetails = status !== 'optimized';
  const recommendation = recommendationOverride ?? content.recommendation;

  return (
    <article className="relative p-6 rounded-2xl bg-surface border border-border">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{titleOverride ?? content.friendlyTitle}</h3>
          <p className="text-xs text-muted font-mono mt-0.5">{content.title}</p>
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
      </div>

      {showDetails && (
        <div className="flex items-center gap-1.5 mt-3 mb-4">
          <span className={`w-1.5 h-1.5 rounded-full ${priorityMeta.dot}`} />
          <span className="text-xs text-muted">{en ? priorityMeta.en : priorityMeta.es}</span>
        </div>
      )}

      <p className={`text-sm text-muted mb-4 ${showDetails ? '' : 'mt-3'}`}>{content.description}</p>

      {showDetails && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide block">
              {en ? "What's going on" : 'Qué pasa'}
            </span>
            <p className="text-sm text-muted">{content.impact_if_false}</p>
          </div>

          <div className={`flex flex-col gap-1 p-4 rounded-xl border ${ACCENT.panel}`}>
            <span className={`text-xs font-semibold ${ACCENT.label} uppercase tracking-wide block mb-2`}>
              {en ? 'How to fix it' : 'Cómo arreglarlo'}
            </span>
            <Recommendation recommendation={recommendation} bulletCls={ACCENT.bullet} textCls={ACCENT.text} />
          </div>
        </div>
      )}
    </article>
  );
}

export default function AuditorHome() {
  const [lang, setLang] = useState<Lang>('en');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AuditResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.floor(Math.random() * 10) + 2;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const startAudit = async () => {
    if (!url) return;
    setLoading(true);
    setResults(null);
    setErrorMessage(null);
    setProgress(0);

    try {
      const response = await fetch(`/api/audit?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Audit failed');
      setResults(data.results);
    } catch (error) {
      console.error('Audit failed', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : lang === 'en'
            ? 'Something went wrong. Please try again.'
            : 'Algo salió mal. Probá de nuevo.'
      );
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  // Look up display copy for a check key in the active language.
  const metrics = (results && (AUDIT_METRICS_DATA[lang] as Record<string, MetricContent>)) || {};

  // Renders a standard (non-merged) check card for a given key.
  const renderCard = (key: string) => {
    const content = metrics[key];
    if (!content || !results) return null;
    const status: Status = results[key] ? 'optimized' : 'action_required';
    return <CheckCard key={key} content={content} priority={priorityFor(key)} status={status} lang={lang} />;
  };

  // Merged /llms.txt card: combines the discovery ('llms_txt') and quality
  // ('llms_txt_quality') checks into a single "AI Agent Map" card with a
  // three-state status.
  const renderLlmsCard = () => {
    if (!results) return null;
    const base = metrics['llms_txt'];
    const quality = metrics['llms_txt_quality'];
    if (!base) return null;

    const exists = !!results['llms_txt'];
    const goodQuality = !!results['llms_txt_quality'];

    let status: Status;
    let recommendation: string | string[];
    if (exists && goodQuality) {
      status = 'optimized';
      recommendation = base.recommendation;
    } else if (!exists) {
      status = 'action_required';
      recommendation = base.recommendation; // add the file
    } else {
      status = 'needs_improvement';
      recommendation = quality?.recommendation ?? base.recommendation; // polish existing file
    }

    return (
      <CheckCard
        key="llms_txt"
        content={base}
        priority={priorityFor('llms_txt')}
        status={status}
        lang={lang}
        titleOverride={lang === 'en' ? 'AI Agent Map (/llms.txt)' : 'Mapa para Agentes de IA (/llms.txt)'}
        recommendationOverride={recommendation}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex flex-col">
      <main className="max-w-4xl mx-auto flex-1 w-full">
        {/* Language Switcher */}
        <nav className="flex justify-end gap-2 mb-12">
          <div className="flex bg-surface p-1 rounded-full border border-border">
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-accent text-accent-foreground' : 'text-muted'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${lang === 'es' ? 'bg-accent text-accent-foreground' : 'text-muted'}`}
            >
              ES
            </button>
          </div>
        </nav>
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-foreground">GEO Readiness Auditor</h1>
          <p className="text-muted text-lg text-center">
            {lang === 'en'
              ? "AI search engines like Perplexity and SearchGPT are replacing traditional Google searches. If your site isn't optimized for AI discovery, your business becomes invisible."
              : 'Los motores de búsqueda con IA como Perplexity y SearchGPT están reemplazando las búsquedas tradicionales de Google. Si tu sitio no está optimizado para ser descubierto por IA, tu negocio se vuelve invisible.'}
          </p>
        </header>
        {/* Scan prompt */}
        <p className="text-foreground text-lg font-semibold text-center mb-4">
          {lang === 'en'
            ? 'Scan your domain in seconds to find out where you stand.'
            : 'Escaneá tu dominio en segundos para saber dónde estás parado.'}
        </p>
        {/* Input Section */}
        <section className="flex gap-3 mb-4 p-2 bg-surface border border-border rounded-2xl">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
            placeholder="example.com"
            className="flex-1 bg-transparent p-4 outline-none text-foreground placeholder:text-muted"
          />
          <button
            onClick={startAudit}
            disabled={loading}
            className="bg-accent text-accent-foreground px-10 py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? '...' : lang === 'en' ? 'Scan' : 'Escanear'}
          </button>
        </section>
        {/* Error message */}
        {errorMessage && (
          <p className="mb-12 text-sm text-status-bad text-center">{errorMessage}</p>
        )}
        {/* Progress Bar */}
        {loading && (
          <div className="mb-12 mt-8">
            <div className="flex justify-between mb-2 text-[10px] font-mono text-muted uppercase">
              <span>{lang === 'en' ? 'Analyzing' : 'Analizando'}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        {/* Results Section */}
        {results && !loading && (
          <div className="mt-8">
            {/* Score, verdict, and (if any) the top fixes — one block */}
            <ReadinessSummary
              score={calculateReadinessScore(results)}
              lang={lang}
              priorityKeys={topPriorityKeys(results)}
              metrics={metrics}
            />

            {/* Checks grid */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-1 text-center">
                {lang === 'en' ? 'What we checked' : 'Qué revisamos'}
              </h2>
              <p className="text-muted text-sm mb-6 max-w-xl mx-auto text-center">
                {lang === 'en'
                  ? 'These are simple, practical technical checks you can act on today. AI citation is not an exact science but these tips are a sensible starting point.'
                  : 'Estos son chequeos técnicos simples y prácticos que podés accionar hoy. La citación por IA no es una ciencia exacta, pero estos consejos son un buen punto de partida.'}
              </p>
              <div className="grid gap-6">
                {CHECK_ORDER.map((key) => (key === 'llms_txt' ? renderLlmsCard() : renderCard(key)))}
              </div>
            </section>
          </div>
        )}
        {/* Disclaimer */}
        <section className="mt-4 p-6 rounded-2xl bg-surface border border-border text-muted">
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 text-muted">
            {lang === 'en' ? 'Legal Disclaimer' : 'Aviso Legal'}
          </h2>
          <p className="text-xs leading-relaxed">
            {lang === 'en'
              ? 'This report is provided for informational purposes only. Findings do not constitute professional legal or technical advice. No liability is assumed for actions taken based on this data.'
              : 'Este informe se proporciona solo con fines informativos. Los hallazgos no constituyen asesoramiento legal o técnico profesional. No se asume responsabilidad por las acciones tomadas basadas en estos datos.'}
          </p>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto w-full py-12 mt-12 border-t border-border text-center text-muted text-xs">
        <p>© 2026 Patricia Montecchiarini. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
      </footer>
    </div>
  );
}
