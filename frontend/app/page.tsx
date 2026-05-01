'use client';

import { useState } from 'react';

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

  const startAudit = async () => {
    if (!url) return;
    setLoading(true);
    setResults(null); 
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/audit?url=${encodeURIComponent(url)}&lang=${lang}`);
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
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            AI Search Engine Readiness Auditor
          </h1>
          <p className="text-slate-400 text-lg">
            {lang === 'en' 
              ? 'Technical utility for the 2026 Citation Economy.' 
              : 'Utilidad técnica para la Economía de Citación 2026.'}
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
            placeholder="https://nytimes.com"
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

        {/* Results Section */}
        {results && (
          <section className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700" aria-label={lang === 'en' ? 'Audit results' : 'Resultados de la auditoría'}>
            {Object.entries(results)
              .sort(([, a], [, b]) => {
                const order: { [key: string]: number } = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                return (order[a.priority] ?? 99) - (order[b.priority] ?? 99);
              })
              .map(([key, metric]) => (
                <article 
                  key={key} 
                  className={`relative p-6 rounded-2xl bg-slate-900 border border-slate-800 transition-all hover:border-slate-700 shadow-2xl border-l-4 
                    ${metric.passed ? 'border-l-green-500' : 
                      metric.priority === 'CRITICAL' ? 'border-l-red-600' : 
                      metric.priority === 'HIGH' ? 'border-l-orange-500' : 'border-l-blue-500'}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
                      metric.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                      metric.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {metric.priority}
                    </span>
                    <span className="text-xl" aria-hidden="true">{metric.passed ? '✨' : '⚠️'}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 mb-2">{metric.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{metric.description}</p>

                  {!metric.passed && (
                    <div className="mt-4 grid gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                      <div>
                        <strong className="block text-[10px] font-bold text-red-400 uppercase mb-1">{lang === 'en' ? 'Risk' : 'Riesgo'}</strong>
                        <p className="text-sm text-slate-300">{metric.impact_if_false}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-800">
                        <strong className="block text-[10px] font-bold text-blue-400 uppercase mb-1">{lang === 'en' ? 'Recommendation' : 'Recomendación'}</strong>
                        <p className="text-sm text-slate-300 italic">{metric.recommendation}</p>
                      </div>
                    </div>
                  )}
                </article>
              ))}
          </section>
        )}
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