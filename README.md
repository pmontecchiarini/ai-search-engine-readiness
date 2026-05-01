# AI Search Engine Readiness Auditor

It analyzes websites to determine how effectively they communicate with Generative AI agents (LLMs), SearchGPT, and Perplexity. 

The tool identifies "Technical Gaps" that prevent AI models from accurately indexing services, attributing quotes, and verifying entity trust scores (E-E-A-T).

## Features
* **Bilingual Analysis:** Full support for English and Spanish reporting.
* **Priority-Weighted Auditing:** Categorizes issues by Impact (Critical, High, Medium, Low).
* **Discovery Scanning:** Validates `/llms.txt` presence and formatting.
* **Governance Check:** Analyzes `robots.txt` for specific AI training vs. search bot directives.
* **Efficiency Audit:** Measures HTML signal-to-noise ratio and token budget efficiency.
* **Citation Triggers:** Scans for expert attribution and GEO (Generative Engine Optimization) structures.

## Architecture
The project is built as a monorepo:
* **Frontend:** Next.js 15 (TypeScript, Tailwind CSS)
* **Backend:** FastAPI (Python 3.13)
* **Logic Engine:** BeautifulSoup4, Requests, and Urllib RobotParser

## Getting Started

### Backend Setup
1. Navigate to `/backend`
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate