# backend/main.py
import socket
from urllib.parse import urlparse
from fastapi import FastAPI, Header, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from ai_search_engine_readiness import AISearchEngineReadiness
from config import AUDIT_METRICS

# 1. Initialize Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()

# 2. Attach Limiter and Exception Handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 3. Security: CORS Lockdown
origins = [
    "http://localhost:3000",       # Local development
    "http://127.0.0.1:3000",     # Local development alternative
    # "https://your-domain.com",  # Add your production domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# 4. Security: SSRF Protection Logic
def validate_public_url(url: str):
    """Prevents the server from fetching internal/private network resources."""
    try:
        hostname = urlparse(url).hostname
        if not hostname:
            return False
        ip_address = socket.gethostbyname(hostname)
        
        # Block reserved and private IP ranges
        private_ranges = ['127.', '10.', '172.16.', '192.168.', '169.254.', '0.', '::1']
        if any(ip_address.startswith(r) for r in private_ranges):
            return False
        return True
    except Exception:
        return False

# 5. Security: Internal Token Verification
async def verify_internal_token(x_internal_audit_token: str = Header(None)):
    # In production, use os.getenv("INTERNAL_TOKEN")
    if x_internal_audit_token != "your-secure-shared-secret-key":
        raise HTTPException(status_code=403, detail="Unauthorized internal access")
    return x_internal_audit_token

# 6. Primary Audit Endpoint
@app.get("/api/audit")
@limiter.limit("5/minute")
async def audit(
    request: Request, 
    url: str, 
    lang: str = "en", 
    token: str = Depends(verify_internal_token)
):
    # --- Input Sanitization ---
    clean_url = url.strip().lower()
    if not clean_url.startswith(('http://', 'https://')):
        clean_url = f"https://{clean_url}"
    clean_url = clean_url.rstrip('/')

    # --- SSRF Validation ---
    if not validate_public_url(clean_url):
        raise HTTPException(
            status_code=400, 
            detail="Access to private or invalid network addresses is prohibited."
        )

    # --- Audit Execution ---
    try:
        auditor = AISearchEngineReadiness(clean_url)
        # Ensure the auditor class handles the language parameter correctly internally
        report = auditor.run_audit(lang=lang)
        
        translations = AUDIT_METRICS.get(lang, AUDIT_METRICS["en"])
        
        detailed_results = {}
        for key, passed in report.get("checks", {}).items():
            if key in translations:
                detailed_results[key] = {
                    "passed": passed,
                    **translations[key]
                }
        
        return {"url": clean_url, "results": detailed_results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audit execution error: {str(e)}")