# AI Search Engine Readiness Auditor

A technical utility designed to evaluate how effectively a web domain communicates with generative AI crawlers and agents. This tool identifies infrastructure gaps based on 2026 standards, focusing on machine-readability and Generative Engine Optimization (GEO).

## Overview
This auditor performs a multi-point inspection of a target URL to assess its readiness for discovery by LLMs (Large Language Models) and AI-native search engines. It categorizes technical markers into four priority levels: Critical, High, Medium, and Low.

## Technical Structure
The project is built as a monorepo:
* **Frontend:** Next.js 15 (TypeScript, Tailwind CSS)
* **Backend:** FastAPI (Python 3.13)
* **Logic Engine:** BeautifulSoup4, Requests, and Urllib RobotParser

## Core Audit Features
*   **Discovery Readiness:** Scans for `/llms.txt` implementation.
*   **Structured Authority:** Validates JSON-LD for E-E-A-T entity linking.
*   **AI Governance:** Audits `robots.txt` for AI-specific agent directives.
*   **Token Efficiency:** Measures signal-to-noise ratio and structural density.
*   **GEO Triggers:** Identifies expert attribution and citation signals.

## Installation

### Backend
1. `cd backend`
2. `python -m venv venv && source venv/bin/activate`
3. `pip install fastapi uvicorn requests beautifulsoup4`
4. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## License & Copyright
**Copyright (c) 2026 Patricia Montecchiarini.**

**Learning License:** This project is released under a Personal Learning & Educational License. Users are permitted to study, modify, and execute the code for personal development. Commercial redistribution or SaaS deployment without explicit permission is prohibited.