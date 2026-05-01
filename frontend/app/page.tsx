'use client';

import { useState } from 'react';

// 1. Define the technical interface for the Audit Result
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

export default function SentinelHome() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AuditResults | null>(null);
  const [loading, setLoading] = useState(false);

  const startAudit = async () => {
    if (!url) return;
    setLoading(true);
    setResults(null); // Clear previous results
    
    try {
      // Use 127.0.0.1 to avoid IPv6 issues common on macOS
      const response = await fetch(`http://127.0.0.1:8000/api/audit?url=${encodeURIComponent(url)}&lang=${lang}`);
      
      if (!response.ok) throw new Error('Backend error');
      
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Audit failed", error);
      alert(lang === 'en' ? "Ensure your FastAPI server is running!" : "¡Asegúrate de que el servidor FastAPI esté corriendo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Language Switcher */}
        <div className="flex justify-end gap-4 mb-6 text-sm font-medium">
          <button 
            onClick={() => setLang('en')} 
            className={lang === 'en' ? 'text-blue-600 underline' : 'text-slate-400'}
          >English</button>
          <button 
            onClick={() => setLang('es')} 
            className={lang === 'es' ? 'text-blue-600 underline' : 'text-slate-400'}
          >Español</button>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">AI Sentinel</h1>
        <p className="text-slate-600 mb-8">
          {lang === 'en' 
            ? 'Technical Auditor for the 2026 Citation Economy.' 
            : 'Auditor Técnico para la Economía de Citación 2026.'}
        </p>

        {/* Input Area */}
        <div className="flex gap-4 mb-12">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
            placeholder="https://nytimes.com"
            className="flex-1 p-4 rounded-lg border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
          />
          <button 
            onClick={startAudit}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? (lang === 'en' ? 'Scanning...' : 'Escaneando...') : (lang === 'en' ? 'Scan' : 'Escanear')}
          </button>
        </div>

        {/* Results Grid */}
        {results && (
          <div className="space-y-8">
            {/* Sort results by Priority: CRITICAL -> HIGH -> OPTIMIZATION */}
            {Object.entries(results)
              .sort(([, a], [, b]) => {
                const order: { [key: string]: number } = { CRITICAL: 0, HIGH: 1, OPTIMIZATION: 2 };
                return order[a.priority] - order[b.priority];
              })
              .map(([key, metric]) => (
                <div 
                  key={key} 
                  className={`p-6 rounded-xl border-l-8 bg-white shadow-sm transition-all 
                    ${metric.passed ? 'border-green-500' : 
                      metric.priority === 'CRITICAL' ? 'border-red-600' : 
                      metric.priority === 'HIGH' ? 'border-orange-500' : 'border-blue-400'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-black px-2 py-1 rounded ${
                      metric.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {metric.priority}
                    </span>
                    <span className="text-2xl">{metric.passed ? '✅' : '❌'}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">{metric.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">{metric.description}</p>

                  {!metric.passed && (
                    <div className="mt-4 space-y-3">
                      <div className="text-sm">
                        <span className="font-bold text-slate-700 underline">Impact:</span>
                        <p className="text-slate-600 mt-1">{metric.impact_if_false}</p>
                      </div>
                      <div className="text-sm bg-blue-50 p-3 rounded-md">
                        <span className="font-bold text-blue-800 italic">Recommended Action:</span>
                        <p className="text-blue-700 mt-1">{metric.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}