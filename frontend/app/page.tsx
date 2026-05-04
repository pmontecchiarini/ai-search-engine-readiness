'use client';
import { AUDIT_METRICS_DATA } from './constants/metrics';
import { useEffect, useState } from 'react';

interface MetricContent {
  title: string;
  priority: string;
  description: string;
  impact_if_false: string;
  recommendation: string;
}

interface AuditResults {
  [key: string]: boolean;
}

export default function AuditorHome() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
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
          'X-Internal-Audit-Token': process.env.NEXT_PUBLIC_INTERNAL_TOKEN || ''
        }
      });
      if (!response.ok) throw new Error('Backend error');
      const data = await response.json();
      setResults(data.results); 
    } catch (error) {
      console.error("Audit failed", error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
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
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">AI Readiness Auditor</h1>
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
          <section className="grid gap-6">
            {Object.entries(results)
              .sort(([keyA], [keyB]) => {
                const order: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                const metricsEN = AUDIT_METRICS_DATA["en"] as Record<string, MetricContent>;
                const pA = metricsEN[keyA]?.priority ?? "LOW";
                const pB = metricsEN[keyB]?.priority ?? "LOW";
                return (order[pA] ?? 99) - (order[pB] ?? 99);
              })
              .map(([key, passed]) => {
                const currentLang = AUDIT_METRICS_DATA[lang] as Record<string, MetricContent>;
                const content = currentLang[key];
                const p = (AUDIT_METRICS_DATA["en"] as Record<string, MetricContent>)[key]?.priority ?? "LOW";
                if (!content) return null;

                return (
                  <article key={key} className={`relative p-8 rounded-3xl bg-slate-900/80 border border-slate-800 ${passed ? 'ring-1 ring-green-500/20' : 'ring-1 ring-red-500/10'}`}>
                    <div className="absolute top-6 right-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${passed ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {passed ? (lang === 'en' ? 'Optimized' : 'Optimizado') : (lang === 'en' ? 'Action Required' : 'Acción Requerida')}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase border border-slate-700 text-slate-400">{p}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{content.title}</h3>
                    <p className="text-slate-400 text-sm mb-6">{content.description}</p>
                    {!passed && (
  <div className="space-y-4 pt-6 border-t border-slate-800">
    {/* Risk Section */}
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">
        {lang === 'en' ? 'Risk Assessment' : 'Evaluación de Riesgo'}
      </span>
      <p className="text-sm text-slate-300">{content.impact_if_false}</p>
    </div>

    {/* Recommendation Section */}
    <div className="flex flex-col gap-1 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-2">
        {lang === 'en' ? 'Technical Recommendation' : 'Recomendación Técnica'}
      </span>

          {/* Check if it's an array of many steps or a single string */}
          {Array.isArray(content.recommendation) ? (
            <ul className="space-y-3">
              {content.recommendation.map((step: string, index: number) => (
                <li key={index} className="flex gap-3 text-sm text-blue-100 font-medium leading-relaxed">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-blue-100 font-medium leading-relaxed">
              {content.recommendation}
            </p>
          )}
        </div>
      </div>
    )}
                  </article>
                );
              })}
          </section>
        )}
      {/* Disclaimer */}
        <section className="mt-16 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 text-slate-500">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-slate-400">
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
        <p>© 2026 PM. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
      </footer>
    </div>
  );
}