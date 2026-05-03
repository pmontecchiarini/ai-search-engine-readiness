'use client';

import { useEffect, useState } from 'react';

interface AuditMetric {
  passed: boolean;
  title: string;
  priority: string;
  description: string;
  impact_if_false: string;
  recommendation: string;
}

interface AuditResults {
  [key: string]: AuditMetric;
}

export default function AuditorHome() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AuditResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulated progress logic for a smoother UX
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; // Hold at 90% until response arrives
          return prev + Math.floor(Math.random() * 10) + 2;
        });
      }, 400);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const startAudit = async () => {
    if (!url) return;
    setLoading(true);
    setResults(null); 
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audit?url=${encodeURIComponent(url)}&lang=${lang}`, {
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 selection:bg-purple-500/30 flex flex-col">
      <main className="max-w-4xl mx-auto flex-1 w-full">
        
        {/* Language Switcher - Aria-label added for accessibility */}
        <nav className="flex justify-end gap-2 mb-12" aria-label={lang === 'en' ? 'Language selection' : 'Selección de idioma'}>
          <div className="flex bg-slate-900 p-1 rounded-full border border-slate-800">
            <button 
              onClick={() => setLang('en')} 
              aria-pressed={lang === 'en'}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >EN</button>
            <button 
              onClick={() => setLang('es')} 
              aria-pressed={lang === 'es'}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${lang === 'es' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >ES</button>
          </div>
        </nav>

        {/* Semantic Header */}
        <header className="mb-12">
          <h1 className="text-5xl text-center font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            AI Search Engine Readiness Auditor
          </h1>
          <p className="text-slate-400 text-lg text-center">
            {lang === 'en' 
              ? 'Scan your domain to see if your site is optimized for discovery by AI agents like Perplexity and SearchGPT.' 
              : 'Escanea tu dominio para ver si está optimizado para ser descubierto por agentes de IA como Perplexity y SearchGPT.'}
          </p>
        </header>

        {/* Input Section */}
        <section className="flex gap-3 mb-16 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm shadow-2xl" aria-labelledby="input-label">
          <label id="input-label" className="sr-only">{lang === 'en' ? 'Enter website URL' : 'Ingrese la URL del sitio web'}</label>
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
            placeholder="example.com"
            className="flex-1 bg-transparent p-4 rounded-xl outline-none text-white placeholder:text-slate-600 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
          <button 
            onClick={startAudit}
            disabled={loading}
            aria-busy={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-purple-900/20 disabled:opacity-50 active:scale-95"
          >
            {loading ? '...' : (lang === 'en' ? 'Scan' : 'Escanear')}
          </button>
        </section>
        {/* ADD THIS: Progress Bar Section */}
        {loading && (
          <div className="mb-12 animate-in fade-in duration-500">
            <div className="flex justify-between mb-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>{lang === 'en' ? 'Analyzing technical markers' : 'Analizando marcadores técnicos'}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        {/* Results Section */}
        {results && (
          <section className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {Object.entries(results)
              .sort(([, a], [, b]) => {
                const order: { [key: string]: number } = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                return (order[a.priority] ?? 99) - (order[b.priority] ?? 99);
              })
              .map(([key, metric]) => (
                <article 
                  key={key} 
                  className={`relative p-8 rounded-3xl bg-slate-900/80 border border-slate-800 transition-all hover:border-slate-700 shadow-2xl overflow-hidden
                    ${metric.passed ? 'ring-1 ring-green-500/20' : 'ring-1 ring-red-500/10'}`}
                >
                  {/* Status Indicator (Top Right) */}
                  <div className="absolute top-6 right-8">
                    {metric.passed ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {lang === 'en' ? 'Optimized' : 'Optimizado'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {lang === 'en' ? 'Action Required' : 'Acción Requerida'}
                      </span>
                    )}
                  </div>

                  {/* Priority Badge */}
                  <div className="mb-4">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.15em] border ${
                      metric.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      metric.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {metric.priority}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 max-w-[80%]">{metric.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{metric.description}</p>

                  {!metric.passed && (
                    <div className="space-y-4 pt-6 border-t border-slate-800">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                          {lang === 'en' ? 'Risk Assessment' : 'Evaluación de Riesgo'}
                        </span>
                        <p className="text-sm text-slate-300 italic">{metric.impact_if_false}</p>
                      </div>
                      <div className="flex flex-col gap-1 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                          {lang === 'en' ? 'Technical Recommendation' : 'Recomendación Técnica'}
                        </span>
                        <p className="text-sm text-blue-100 font-medium">{metric.recommendation}</p>
                      </div>
                    </div>
                  )}
                </article>
              ))}
          </section>
        )}

        {/* Legal Disclaimer Section */}
        <section className="mt-16 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 text-slate-500">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-slate-400">
            {lang === 'en' ? 'Legal Disclaimer' : 'Aviso Legal'}
          </h2>
          <p className="text-xs leading-relaxed">
            {lang === 'en' 
              ? "This report is provided for informational and research purposes only. The 'AI Search Engine Readiness Auditor' is an experimental technical utility. Its findings do not constitute professional legal, technical, or financial advice. We make no guarantees regarding the accuracy of the audit or its impact on search engine rankings, and we assume no liability for any actions taken based on this data."
              : "Este informe se proporciona únicamente con fines informativos y de investigación. El 'Auditor de Preparación para Motores de Búsqueda de IA' es una utilidad técnica experimental. Sus hallazgos no constituyen asesoramiento legal, técnico o financiero profesional. No garantizamos la exactitud de la auditoría ni su impacto en el posicionamiento en buscadores, y no asumimos ninguna responsabilidad por las acciones tomadas basadas en estos datos."}
          </p>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="max-w-4xl mx-auto w-full py-12 mt-12 border-t border-slate-900 text-center text-slate-600 text-xs">
        <p>© 2026 PM. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
        <p className="mt-2 text-slate-800 uppercase tracking-widest font-bold">
          {lang === 'en' ? 'Technical Research Utility' : 'Utilidad de Investigación Técnica'}
        </p>
      </footer>
    </div>
  );
}