'use client';
import { AUDIT_METRICS_DATA } from './constants/metrics';
import {
  PHASE_1_KEYS,
  PHASE_2_KEYS,
  ADDITIONAL_KEYS,
  calculateReadinessScore,
  scoreColorClasses,
  priorityFor,
} from './constants/phases';
import { useEffect, useState } from 'react';

interface MetricContent {
  title: string;
  priority: string;
  description: string;
  impact_if_false: string;
  recommendation: string | string[];
}

interface AuditResults {
  [key: string]: boolean;
}

type Lang = 'en' | 'es';
type Variant = 'infra' | 'content';
type Status = 'optimized' | 'needs_improvement' | 'action_required';

/* ------------------------------------------------------------------ *
 * Global score hero — animated SVG circular ring, color-coded.
 * Ring starts empty (offset = circumference) and transitions to its
 * score-derived offset on mount so the fill animates in cleanly.
 * ------------------------------------------------------------------ */
function ScoreHero({ score, lang }: { score: number; lang: Lang }) {
  const { ring, text, band } = scoreColorClasses(score);
  const RADIUS = 84;
  const circumference = 2 * Math.PI * RADIUS;
  const [offset, setOffset] = useState(circumference); // fully empty first paint

  useEffect(() => {
    const target = circumference - (score / 100) * circumference;
    const id = requestAnimationFrame(() => setOffset(target));
    return () => cancelAnimationFrame(id);
  }, [score, circumference]);

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
    <section className="mb-16 flex flex-col items-center text-center p-10 rounded-3xl bg-slate-900/50 border border-slate-800">
      <div className="relative" style={{ width: 200, height: 200 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
          <circle cx="100" cy="100" r={RADIUS} fill="none" strokeWidth="14" className="stroke-slate-800" />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            className={`${ring} transition-[stroke-dashoffset] duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-extrabold tabular-nums ${text}`}>{score}</span>
          <span className="text-slate-500 text-xs font-mono mt-1">/ 100</span>
        </div>
      </div>
      <h2 className="mt-6 text-[11px] font-mono font-black uppercase tracking-[0.3em] text-slate-400">
        {lang === 'en' ? 'AI Readiness Score' : 'Puntuación de Preparación IA'}
      </h2>
      <p className="mt-3 max-w-md text-sm text-slate-400">{verdict}</p>
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

/* ------------------------------------------------------------------ *
 * Single check card, reused across both phases and the extras section.
 * `variant` swaps the recommendation-panel accent; status drives the
 * pill + ring (optimized/needs-improvement/action-required).
 * ------------------------------------------------------------------ */
function CheckCard({
  content,
  priority,
  status,
  variant,
  lang,
  titleOverride,
  recommendationOverride,
}: {
  content: MetricContent;
  priority: string;
  status: Status;
  variant: Variant;
  lang: Lang;
  titleOverride?: string;
  recommendationOverride?: string | string[];
}) {
  const en = lang === 'en';

  const statusMeta: Record<Status, { label: string; pill: string; ring: string }> = {
    optimized: {
      label: en ? 'Optimized' : 'Optimizado',
      pill: 'text-green-400 bg-green-500/10',
      ring: 'ring-green-500/20',
    },
    needs_improvement: {
      label: en ? 'Needs Improvement' : 'Requiere Mejoras',
      pill: 'text-amber-300 bg-amber-500/10',
      ring: 'ring-amber-500/20',
    },
    action_required: {
      label: en ? 'Action Required' : 'Acción Requerida',
      pill: 'text-red-400 bg-red-500/10',
      ring: 'ring-red-500/10',
    },
  };

  const accent =
    variant === 'infra'
      ? {
          rounded: 'rounded-2xl',
          panel: 'bg-cyan-500/5 border-cyan-500/10',
          label: 'text-cyan-400',
          bullet: 'text-cyan-500',
          text: 'text-cyan-100',
        }
      : {
          rounded: 'rounded-3xl',
          panel: 'bg-purple-500/5 border-purple-500/10',
          label: 'text-purple-300',
          bullet: 'text-purple-400',
          text: 'text-purple-100',
        };

  const meta = statusMeta[status];
  const showDetails = status !== 'optimized';
  const recommendation = recommendationOverride ?? content.recommendation;

  return (
    <article
      className={`relative p-8 ${accent.rounded} bg-slate-900/80 border border-slate-800 ring-1 ${meta.ring}`}
    >
      <div className="absolute top-6 right-8">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${meta.pill}`}>
          {meta.label}
        </span>
      </div>
      <div className="mb-4">
        <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase border border-slate-700 text-slate-400">
          {priority}
        </span>
      </div>
      <h3 className="text-2xl font-mono font-bold text-white mb-3 pr-28">{titleOverride ?? content.title}</h3>
      <p className="text-slate-400 text-sm mb-6">{content.description}</p>

      {showDetails && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          {/* Risk Section */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">
              {en ? 'Risk Assessment' : 'Evaluación de Riesgo'}
            </span>
            <p className="text-sm text-slate-300">{content.impact_if_false}</p>
          </div>

          {/* Recommendation Section */}
          <div className={`flex flex-col gap-1 p-4 rounded-xl border ${accent.panel}`}>
            <span className={`text-[10px] font-bold ${accent.label} uppercase tracking-widest block mb-2`}>
              {en ? 'Technical Recommendation' : 'Recomendación Técnica'}
            </span>
            <Recommendation recommendation={recommendation} bulletCls={accent.bullet} textCls={accent.text} />
          </div>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ *
 * Phase section header — cool/mono for infra, warm/editorial for content.
 * ------------------------------------------------------------------ */
function PhaseHeader({ variant, lang }: { variant: Variant; lang: Lang }) {
  const en = lang === 'en';
  if (variant === 'infra') {
    return (
      <div className="mb-8 border-l-2 border-cyan-500/30 pl-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400">{'// PHASE_01'}</span>
        <h2 className="text-2xl font-bold text-white font-mono mt-1">
          {en ? 'Code & Governance' : 'Código y Gobernanza'}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {en
            ? 'Quick wins — set-and-forget technical patches you deploy once.'
            : 'Victorias rápidas — parches técnicos que implementás una vez y te olvidás.'}
        </p>
      </div>
    );
  }
  return (
    <div className="mb-8 border-l-2 border-purple-500/30 pl-4">
      <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300 italic">
        {en ? 'Phase 02 · Strategy' : 'Fase 02 · Estrategia'}
      </span>
      <h2 className="text-2xl font-mono font-bold text-white mt-1">
        {en ? 'Content Optimization' : 'Optimización de Contenido'}
      </h2>
      <p className="text-slate-500 text-sm mt-1">
        {en
          ? 'Ongoing strategy — how AI comes to trust, quote, and cite you.'
          : 'Estrategia continua — cómo la IA aprende a confiar en vos y citarte.'}
      </p>
    </div>
  );
}

export default function AuditorHome() {
  const [lang, setLang] = useState<Lang>('en');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AuditResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
    setProgress(0);

    try {
      // NOTE: lang is removed from query here to match cleaned Python backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audit?url=${encodeURIComponent(url)}`, {
        headers: {
          'X-Internal-Audit-Token': process.env.NEXT_PUBLIC_INTERNAL_TOKEN || '',
        },
      });
      if (!response.ok) throw new Error('Backend error');
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Audit failed', error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  // Look up display copy for a check key in the active language.
  const metrics = (results && (AUDIT_METRICS_DATA[lang] as Record<string, MetricContent>)) || {};

  // Renders a standard (non-merged) check card for a given key + variant.
  const renderCard = (key: string, variant: Variant) => {
    const content = metrics[key];
    if (!content || !results) return null;
    const status: Status = results[key] ? 'optimized' : 'action_required';
    return <CheckCard key={key} content={content} priority={priorityFor(key)} status={status} variant={variant} lang={lang} />;
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
        variant="infra"
        lang={lang}
        titleOverride={lang === 'en' ? 'AI Agent Map (/llms.txt)' : 'Mapa para Agentes de IA (/llms.txt)'}
        recommendationOverride={recommendation}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col">
      <main className="max-w-4xl mx-auto flex-1 w-full">
        {/* Language Switcher */}
        <nav className="flex justify-end gap-2 mb-12">
          <div className="flex bg-slate-900 p-1 rounded-full border border-slate-800">
            <button onClick={() => setLang('en')} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => setLang('es')} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${lang === 'es' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>ES</button>
          </div>
        </nav>
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-mono font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">GEO Readiness Auditor</h1>
          <p className="text-slate-400 text-lg text-center">
            {lang === 'en'
              ? 'AI search engines like Perplexity and SearchGPT are replacing traditional Google searches. If your site isn\'t optimized for AI discovery, your business becomes invisible. Scan your domain in seconds to find out where you stand.'
              : 'Los motores de búsqueda con IA como Perplexity y SearchGPT están reemplazando las búsquedas tradicionales de Google. Si tu sitio no está optimizado para ser descubierto por IA, tu negocio se vuelve invisible. Escaneá tu dominio en segundos para saber dónde estás parado.'}
          </p>
        </header>
        {/* Input Section */}
        <section className="flex gap-3 mb-16 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && startAudit()} placeholder="example.com" className="flex-1 bg-transparent p-4 outline-none text-white" />
          <button onClick={startAudit} disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold disabled:opacity-50">
            {loading ? '...' : (lang === 'en' ? 'Scan' : 'Escanear')}
          </button>
        </section>
        {/* Progress Bar */}
        {loading && (
          <div className="mb-12">
            <div className="flex justify-between mb-2 text-[10px] font-mono text-slate-500 uppercase">
              <span>{lang === 'en' ? 'Analyzing' : 'Analizando'}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        {/* Results Section */}
        {results && (
          <div>
            {/* Global score hero */}
            <ScoreHero score={calculateReadinessScore(results)} lang={lang} />

            {/* Phase 1 — Code & Governance (technical infrastructure) */}
            <section className="mb-16">
              <PhaseHeader variant="infra" lang={lang} />
              <div className="grid gap-6">
                {PHASE_1_KEYS.map((key) => (key === 'llms_txt' ? renderLlmsCard() : renderCard(key, 'infra')))}
              </div>
            </section>

            {/* Phase 2 — Content Optimization (content strategy) */}
            <section className="mb-12">
              <PhaseHeader variant="content" lang={lang} />
              <div className="grid gap-6">
                {PHASE_2_KEYS.map((key) => renderCard(key, 'content'))}
              </div>
            </section>

            {/* Additional Technical Checks — collapsed, uncontrolled <details> */}
            <details className="group rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
              <summary className="cursor-pointer list-none flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-200">
                <span>{lang === 'en' ? 'Additional Technical Checks' : 'Verificaciones Técnicas Adicionales'}</span>
                <span className="text-slate-600 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="grid gap-6 mt-6">
                {ADDITIONAL_KEYS.map((key) => renderCard(key, 'infra'))}
              </div>
            </details>
          </div>
        )}
        {/* Disclaimer */}
        <section className="mt-16 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 text-slate-500">
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 text-slate-400">
            {lang === 'en' ? 'Legal Disclaimer' : 'Aviso Legal'}
          </h2>
          <p className="text-xs leading-relaxed">
            {lang === 'en'
              ? "This report is provided for informational purposes only. Findings do not constitute professional legal or technical advice. No liability is assumed for actions taken based on this data."
              : "Este informe se proporciona solo con fines informativos. Los hallazgos no constituyen asesoramiento legal o técnico profesional. No se asume responsabilidad por las acciones tomadas basadas en estos datos."}
          </p>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto w-full py-12 mt-12 border-t border-slate-900 text-center text-slate-600 text-xs">
        <p>© 2026 Patricia Montecchiarini. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
      </footer>
    </div>
  );
}
