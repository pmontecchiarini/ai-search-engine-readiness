# AI Search Engine Readiness Auditor

A technical utility designed to evaluate how effectively a web domain communicates with generative AI crawlers and agents. This tool identifies infrastructure gaps based on 2026 standards, focusing on machine-readability and Generative Engine Optimization (GEO).

## Overview
This auditor performs a multi-point inspection of a target URL to assess its readiness for discovery by LLMs (Large Language Models) and AI-native search engines. It categorizes technical markers into four priority levels: Critical, High, Medium, and Low.

## Technical Structure
A single Next.js app, deployable on its own (e.g. Vercel) with no separate backend:
* **App:** Next.js 16 (React 19, TypeScript, Tailwind CSS v4)
* **Audit engine:** a Route Handler (`/api/audit`) using `cheerio` for HTML parsing
* **Rate limiting:** Upstash Redis (per-IP, protects the audit endpoint from abuse)

## Core Audit Features
*   **Discovery Readiness:** Scans for `/llms.txt` implementation and quality.
*   **Structured Authority:** Validates JSON-LD for E-E-A-T entity linking.
*   **AI Governance:** Audits `robots.txt` for AI-specific agent directives, including crawl-rate limits.
*   **Security Policy:** Checks for a Content-Security-Policy header.
*   **Token Efficiency:** Measures the ratio of real content to markup/script clutter.
*   **GEO Triggers:** Identifies expert attribution and citation signals, in English and Spanish.

## Installation

1. `cd frontend`
2. `npm install`
3. Create a `.env` file with `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (free tier at [upstash.com](https://upstash.com)).
4. `npm run dev`

## About

Built by **Patricia Montecchiarini**.

[LinkedIn](https://www.linkedin.com/in/pmontecchiarini)

## License & Copyright
**Copyright (c) 2026 Patricia Montecchiarini.**

**Learning License:** This project is released under a Personal Learning & Educational License. Users are permitted to study, modify, and execute the code for personal development. Commercial redistribution or SaaS deployment without explicit permission is prohibited.