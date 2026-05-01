# backend/main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from ai_search_engine_readiness import AISearchEngineReadiness

app = FastAPI()

# Crucial for local development: allows Next.js (port 3000) to talk to FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/audit")
async def audit(url: str, lang: str = "en"):
    # Fix: Ensure protocol exists
    clean_url = url.strip()
    if not clean_url.startswith(('http://', 'https://')):
        clean_url = f"https://{clean_url}"
    
    auditor = AISearchEngineReadiness(clean_url)
    report = auditor.run_audit()
    
    from config import AUDIT_METRICS
    translations = AUDIT_METRICS.get(lang, AUDIT_METRICS["en"])
    
    detailed_results = {}
    for key, passed in report["checks"].items():
        if key in translations:
            detailed_results[key] = {
                "passed": passed,
                **translations[key]
            }
    
    return {"url": clean_url, "results": detailed_results}