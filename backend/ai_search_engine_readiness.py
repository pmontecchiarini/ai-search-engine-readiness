import requests
from bs4 import BeautifulSoup
import urllib.robotparser
import re

class AISearchEngineReadiness:
    def __init__(self, url):
        self.url = url.rstrip('/')
        self.results = {}

    def fetch_homepage(self):
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            r = requests.get(self.url, timeout=15, headers=headers, allow_redirects=True)
            if r.status_code != 200: return False
            self.html_content, self.soup = r.text, BeautifulSoup(r.text, 'html.parser')
            return True
        except: return False

    def check_llms_txt(self):
        try:
            r = requests.get(f"{self.url}/llms.txt", timeout=5)
            self.results["llms_txt"] = r.status_code == 200
        except: self.results["llms_txt"] = False
    
    def check_llms_txt_quality(self):
        if not self.results.get("llms_txt"): 
            self.results["llms_txt_quality"] = False
            return
        try:
            r = requests.get(f"{self.url}/llms.txt", timeout=5)
            size_ok = (len(r.text) / 1024) < 100
            has_headings = bool(re.search(r'^#\s.+|(?<=\n)#\s.+', r.text, re.MULTILINE))
            self.results["llms_txt_quality"] = size_ok and has_headings
        except: self.results["llms_txt_quality"] = False
    
    def check_schema_org(self):
        try:
            schema = self.soup.find('script', type=re.compile(r'ld\+json', re.I))
            self.results["json_ld"] = schema is not None
        except: self.results["json_ld"] = False
    
    def check_token_efficiency(self):
        try:
            density_ok = (len(self.soup.get_text()) / len(self.html_content)) > 0.2
            precision_ok = len(re.findall(r'\d+\.\d{4,}', self.html_content)) < 10 
            schemas = self.soup.find_all('script', type=re.compile(r'ld\+json', re.I))
            flat_json = all(not (s.string and s.string.count('{') > 15) for s in schemas)
            self.results["token_efficiency"] = density_ok and precision_ok and flat_json
        except: self.results["token_efficiency"] = False

    def check_citation_triggers(self):
        try:
            intro_text = self.soup.get_text()[:2000]
            expert_pattern = r'["\u201c].+["\u201d].+(CEO|Founder|Director|Expert|Dr\.)'
            self.results["citation_triggers"] = bool(re.search(expert_pattern, intro_text, re.I))
        except: self.results["citation_triggers"] = False
    
    def check_geo_structure(self):
        try:
            intro_text = self.soup.get_text()[:1000]
            self.results["geo_optimized"] = bool(re.search(r'\d+%', intro_text))
        except: self.results["geo_optimized"] = False

    def check_waf_protection(self):
        try:
            headers = requests.head(self.url, timeout=5).headers
            self.results["bot_verification_ready"] = any(h in headers for h in ['cf-ray', 'x-vercel-cache'])
        except: self.results["bot_verification_ready"] = False
                
    def check_ai_governance(self):
        try:
            r = requests.get(f"{self.url}/robots.txt", timeout=5)
            ai_bots = ['gptbot', 'ccbot', 'anthropic-ai', 'claudebot', 'cohere-ai', 'oai-searchbot', 'perplexitybot']
            self.results["ai_governance"] = any(bot in r.text.lower() for bot in ai_bots)
        except: self.results["ai_governance"] = False

    def check_crawl_governance_advanced(self):
        try:
            rp = urllib.robotparser.RobotFileParser()
            rp.set_url(f"{self.url}/robots.txt")
            rp.read()
            self.results["crawl_maturity"] = rp.crawl_delay("*") is not None or rp.request_rate("*") is not None
        except: self.results["crawl_maturity"] = False

    def check_security_headers(self):
        try:
            r = requests.head(self.url, timeout=5, allow_redirects=True)
            self.results["security_headers"] = "Content-Security-Policy" in r.headers
        except: self.results["security_headers"] = False

    def run_audit(self):
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
        else:
            keys = ["llms_txt", "llms_txt_quality", "json_ld", "ai_governance", "token_efficiency", 
                    "citation_triggers", "geo_optimized", "security_headers", "crawl_maturity", "bot_verification_ready"]
            self.results = {k: False for k in keys}
        return self.results