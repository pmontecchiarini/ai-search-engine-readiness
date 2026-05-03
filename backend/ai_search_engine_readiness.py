import requests
from bs4 import BeautifulSoup
import urllib.robotparser
import re
import socket

class AISearchEngineReadiness:
    def __init__(self, url):
        self.url = url.rstrip('/')
        self.report = {"url": self.url, "checks": {}}

    def fetch_homepage(self):
        """Obtiene el contenido base para todas las pruebas."""
        try:
            r = requests.get(
                self.url, 
                timeout=10, 
                headers={'User-Agent': 'Mozilla/5.0'}, 
                allow_redirects=True
            )
            self.html_content = r.text 
            self.soup = BeautifulSoup(self.html_content, 'html.parser')
            return True
        except Exception:
            return False

    def check_llms_txt(self):
        try:
            r = requests.get(f"{self.url}/llms.txt", timeout=5)
            self.report["checks"]["llms_txt"] = r.status_code == 200
        except:
            self.report["checks"]["llms_txt"] = False
    
    def check_llms_txt_quality(self):
        if not self.report["checks"].get("llms_txt"): return
        try:
            r = requests.get(f"{self.url}/llms.txt", timeout=5)
            size_ok = (len(r.text) / 1024) < 100
            has_headings = bool(re.search(r'^#\s.+|(?<=\n)#\s.+', r.text, re.MULTILINE))
            self.report["checks"]["llms_txt_quality"] = size_ok and has_headings
        except:
            self.report["checks"]["llms_txt_quality"] = False
    
    def check_schema_org(self):
        try:
            schema = self.soup.find('script', type=re.compile(r'ld\+json', re.I))
            self.report["checks"]["json_ld"] = schema is not None
        except:
            self.report["checks"]["json_ld"] = False
    
    def check_token_efficiency(self):
        if not hasattr(self, 'html_content'): return
        density_ok = (len(self.soup.get_text()) / len(self.html_content)) > 0.2
        precision_ok = len(re.findall(r'\d+\.\d{4,}', self.html_content)) < 10 
        schemas = self.soup.find_all('script', type=re.compile(r'ld\+json', re.I))
        flat_json = all(not (s.string and s.string.count('{') > 15) for s in schemas)
        self.report["checks"]["token_efficiency"] = density_ok and precision_ok and flat_json

    def check_citation_triggers(self):
        intro_text = self.soup.get_text()[:2000]
        expert_pattern = r'["\u201c].+["\u201d].+(CEO|Founder|Director|Expert|Dr\.)'
        self.report["checks"]["citation_triggers"] = bool(re.search(expert_pattern, intro_text, re.I))
    
    def check_geo_structure(self):
        intro_text = self.soup.get_text()[:1000]
        self.report["checks"]["geo_optimized"] = bool(re.search(r'\d+%', intro_text))

    def check_waf_protection(self):
        try:
            headers = requests.head(self.url, timeout=5).headers
            self.report["checks"]["bot_verification_ready"] = any(h in headers for h in ['cf-ray', 'x-vercel-cache'])
        except:
            self.report["checks"]["bot_verification_ready"] = False
                
    def check_ai_governance(self):
        try:
            r = requests.get(f"{self.url}/robots.txt", timeout=5)
            content = r.text.lower()
            ai_bots = ['gptbot', 'ccbot', 'anthropic-ai', 'claudebot', 'cohere-ai', 'oai-searchbot', 'perplexitybot']
            self.report["checks"]["ai_governance"] = any(bot in content for bot in ai_bots)
        except:
            self.report["checks"]["ai_governance"] = False

    def check_crawl_governance_advanced(self):
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(f"{self.url}/robots.txt")
        try:
            rp.read()
            self.report["checks"]["crawl_maturity"] = rp.crawl_delay("*") is not None or rp.request_rate("*") is not None
        except:
            self.report["checks"]["crawl_maturity"] = False

    def check_security_headers(self):
        try:
            r = requests.head(self.url, timeout=5, allow_redirects=True)
            self.report["checks"]["security_headers"] = "Content-Security-Policy" in r.headers
        except:
            self.report["checks"]["security_headers"] = False

    def run_audit(self):
        """Ejecuta todas las pruebas y devuelve solo el diccionario de resultados."""
        if self.fetch_homepage():
            self.check_llms_txt()
            self.check_llms_txt_quality()
            self.check_schema_org()
            self.check_ai_governance()
            self.check_token_efficiency()
            self.check_citation_triggers()
            self.check_geo_structure()
            self.check_security_headers()
            self.check_crawl_governance_advanced()
            self.check_waf_protection()
        
        # Devolvemos solo la parte técnica para que el frontend la procese
        return self.report["checks"]