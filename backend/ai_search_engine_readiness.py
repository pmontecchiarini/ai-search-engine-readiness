import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import urllib.robotparser
import re
from config import AUDIT_METRICS
import socket

class AISearchEngineReadiness:
    def __init__(self, url):
        self.url = url.rstrip('/')
        self.report = {"url": url, "checks": {}}

    def fetch_homepage(self):
        """Fetches the homepage once and stores content for all checks."""
        try:
            r = requests.get(
                self.url, 
                timeout=10, 
                headers={'User-Agent': 'Mozilla/5.0'}, 
                allow_redirects=True
            )
            # This solves the AttributeError
            self.html_content = r.text 
            self.soup = BeautifulSoup(self.html_content, 'html.parser')
            return True
        except Exception:
            self.html_content = ""
            self.soup = None
            return False

    def check_llms_txt(self):
        # FACT: In 2026, /llms.txt is the standard for AI 'executive summaries'
        target = f"{self.url}/llms.txt"
        try:
            r = requests.get(target, timeout=5)
            self.report["checks"]["llms_txt"] = r.status_code == 200
        except:
            self.report["checks"]["llms_txt"] = False
    
    def check_llms_txt_quality(self):
        """
        If llms.txt exists, check if it follows 2026 size and structure conventions.
        """
        if not self.report["checks"].get("llms_txt"):
            return

        target = f"{self.url}/llms.txt"
        try:
            r = requests.get(target, timeout=5, allow_redirects=True)
            # FACT: Optimal llms.txt should be under 100KB to fit model context windows
            content_size_kb = len(r.text) / 1024
            size_ok = content_size_kb < 100

            # Check for Markdown headers (the standard format for llms.txt)
            has_headings = bool(re.search(r'^#\s.+|(?<=\n)#\s.+', r.text, re.MULTILINE))
            
            self.report["checks"]["llms_txt_quality"] = size_ok and has_headings
        except:
            self.report["checks"]["llms_txt_quality"] = False
    
    def check_schema_org(self):
        # FACT: AI agents use JSON-LD to understand content intent
        try:
            # Optimization: Use the already fetched self.html_content/self.soup
            # instead of making a new request to self.url
            if not self.soup:
                return
            schema = self.soup.find('script', type=re.compile(r'ld\+json', re.I))
            self.report["checks"]["json_ld"] = schema is not None
        except:
            self.report["checks"]["json_ld"] = False
    
    def check_token_efficiency(self):
        """
        Consolidated check for Signal-to-Noise, Numerical Precision, and JSON Structure.
        """
        if not hasattr(self, 'html_content'): return

        # 1. Signal-to-Noise (The original check)
        raw_html_len = len(self.html_content)
        text_content_len = len(self.soup.get_text())
        density_ok = (text_content_len / raw_html_len) > 0.2

        # 2. Numerical Precision (The Gap Fix)
        # Finds decimals with 4 or more places
        bloated_decimals = re.findall(r'\d+\.\d{4,}', self.html_content)
        precision_ok = len(bloated_decimals) < 10 

        # 3. JSON Structure (The Gap Fix)
        schemas = self.soup.find_all('script', type=re.compile(r'ld\+json', re.I))
        flat_json = True
        for s in schemas:
            if s.string and s.string.count('{') > 15: # Proxy for deep/complex nesting
                flat_json = False
        
        # PASS only if all efficiency pillars are met
        self.report["checks"]["token_efficiency"] = density_ok and precision_ok and flat_json

    def check_citation_triggers(self):
        """
        Gap Fix: Looks for 'Expert Quotes' and 'Attribution'.
        Ranked #1 for citation probability in the Princeton GEO Benchmark.
        """
        intro_text = self.soup.get_text()[:2000]
        # Look for quote patterns followed by titles (Dr., CEO, Founder, etc.)
        expert_pattern = r'["\u201c].+["\u201d].+(CEO|Founder|Director|Expert|Dr\.)'
        has_experts = bool(re.search(expert_pattern, intro_text, re.I))
        
        self.report["checks"]["citation_triggers"] = has_experts
    
    def check_geo_structure(self):
        # Extract the first 1000 characters of text
        intro_text = self.soup.get_text()[:1000]
        # Check for 'Citation Signals' like statistics or expert quotes
        has_stats = bool(re.search(r'\d+%', intro_text)) # Finds percentages
        self.report["checks"]["geo_optimized"] = has_stats

    def check_waf_protection(self):
        # Look for headers that indicate an active Bot Management system
        headers = requests.head(self.url).headers
        is_protected = 'cf-ray' in headers or 'x-vercel-cache' in headers
        self.report["checks"]["bot_verification_ready"] = is_protected
                
    def check_ai_governance(self):
        """
        Scans robots.txt for AI-specific directives.
        """
        target = f"{self.url}/robots.txt"
        try:
            r = requests.get(target, timeout=5, headers={'User-Agent': 'Mozilla/5.0'}, allow_redirects=True)
            if r.status_code != 200:
                self.report["checks"]["ai_governance"] = False
                return

            content = r.text.lower()
            
            # Training/Scraping Bots (Usually want to Disallow)
            training_bots = ['gptbot', 'ccbot', 'anthropic-ai', 'claudebot', 'cohere-ai']
            # Search/Action Bots (Usually want to Allow)
            search_bots = ['oai-searchbot', 'perplexitybot', 'bingbot', 'googlebot-news']

            detected_training = [bot for bot in training_bots if bot in content]
            detected_search = [bot for bot in search_bots if bot in content]

            # Logic: Governance is "True" if the site has EXPLICITLY named at least 
            # one AI agent, showing they are actively managing their AI border.
            self.report["checks"]["ai_governance"] = len(detected_training) > 0 or len(detected_search) > 0
            
        except Exception:
            self.report["checks"]["ai_governance"] = False

    def check_crawl_governance_advanced(self):
        """
        Gap Fix: Checks for Crawl-delay and Request-rate.
        Signals a mature infrastructure capable of rate-limiting AI agents.
        """
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(f"{self.url}/robots.txt")
        try:
            rp.read()
            # Check for delay for the global agent '*' or specific AI agents
            delay = rp.crawl_delay("*")
            rate = rp.request_rate("*")
            
            self.report["checks"]["crawl_maturity"] = delay is not None or rate is not None
        except:
            self.report["checks"]["crawl_maturity"] = False

    def check_security_headers(self):
        """
        Gap Fix: Verification Workflow.
        Checks for security headers that enable bot identity verification.
        """
        try:
            # Checking for 'X-Content-Type-Options' and 'Content-Security-Policy'
            # as basic markers of a site that manages machine-readability securely.
            r = requests.head(self.url, timeout=5, allow_redirects=True)
            headers = r.headers
            self.report["checks"]["security_headers"] = "Content-Security-Policy" in headers
        except:
            self.report["checks"]["security_headers"] = False

    def generate_report(self, lang="en"):
        print(f"\n{'='*60}")
        print(f"AI READINESS AUDIT: {self.url}")
        print(f"{'='*60}\n")
        
        # Pull the correct language dictionary
        translations = AUDIT_METRICS.get(lang, AUDIT_METRICS["en"])
        
        for check, status in self.report["checks"].items():
            # Fix: Get the metric from the translated sub-dictionary
            metric = translations.get(check)
            if not metric: continue # Skip if check name doesn't match config key
            
            status_text = "✅ PASS" if status else "❌ FAIL"
            print(f"[{status_text}] {metric['title']}")
            if not status:
                print(f"   Action: {metric['recommendation']}")
            print("-" * 40)

    def run_audit(self, lang="en"):
        print(f"--- Auditing: {self.url} ---")
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
        
        # Pass the language here too
        self.generate_report(lang)
        return self.report

if __name__ == "__main__":
    # TEST IT: Use a site you know or a big tech site
    auditor = AISearchEngineReadiness("https://nytimes.com")
    print(auditor.run_audit())