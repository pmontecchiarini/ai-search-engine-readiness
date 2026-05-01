# backend/config.py

AUDIT_METRICS = {
    "en": {
        "llms_txt": {
            "title": "AI Discovery Readiness (/llms.txt)",
            "priority": "CRITICAL",
            "description": "Checks for a machine-readable summary used by LLMs to index core services.",
            "impact_if_false": "HIGH: AI models may ignore or hallucinate your service offerings.",
            "recommendation": "Deploy a Markdown-based /llms.txt file to the root directory."
        },
        "json_ld": {
            "title": "Structured Data Authority (JSON-LD)",
            "priority": "CRITICAL",
            "description": "Validates entity linking for E-E-A-T (Trust) scores.",
            "impact_if_false": "MEDIUM: AI search agents cannot verify your professional credentials.",
            "recommendation": "Implement linked Schema.org entities for Organization and Person."
        },
        "citation_triggers": {
            "title": "GEO Citation Authority",
            "priority": "HIGH",
            "description": "Scans for expert quotes and authoritative attributions.",
            "impact_if_false": "HIGH: Content is less likely to be cited as a primary source by LLMs.",
            "recommendation": "Include quotes from identified experts with clear titles/roles."
        },
        "security_headers": {
            "title": "AI Security Policy (CSP)",
            "priority": "HIGH",
            "description": "Checks for Content-Security-Policy headers protecting content integrity.",
            "impact_if_false": "HIGH: Vulnerable to content injection or unauthorized data scraping proxies.",
            "recommendation": "Implement a strict CSP to ensure AI agents only ingest authorized data."
        },
        "ai_governance": {
            "title": "AI Agent Governance (robots.txt)",
            "priority": "MEDIUM",
            "description": "Scans for specific policies regarding AI training vs. AI search bots.",
            "impact_if_false": "LEGAL/STRATEGIC: Proprietary data may be harvested for free for model training.",
            "recommendation": "Update robots.txt to specifically block CCBot/GPTBot but allow Search agents."
        },
        "bot_verification_ready": {
            "title": "WAF Bot Verification",
            "priority": "MEDIUM",
            "description": "Checks for Edge-level bot management and IP verification.",
            "impact_if_false": "SECURITY: Higher risk of spoofed bots harvesting data.",
            "recommendation": "Configure WAF rules to verify bots via official JSON IP endpoints."
        },
        "llms_txt_quality": {
            "title": "LLM Summary Quality (/llms.txt)",
            "priority": "LOW",
            "description": "Evaluates the formatting and size of the AI summary file.",
            "impact_if_false": "LOW: File is present but may be too large or poorly formatted for AI parsing.",
            "recommendation": "Ensure /llms.txt uses clear Markdown headers (#) and remains under 100KB."
        },
        "token_efficiency": {
            "title": "Token Budget & Structural Efficiency",
            "priority": "LOW",
            "description": "Audits HTML density, numerical precision, and JSON-LD nesting levels.",
            "impact_if_false": "HIGH: Bloated data structures and excessive decimals waste AI context window space.",
            "recommendation": "Flatten JSON-LD, round decimals to 2 places, and use semantic HTML to reduce code noise."
        },
        "geo_optimized": {
            "title": "GEO Answer-First Structure",
            "priority": "LOW",
            "description": "Scans for front-loaded data and citation signals.",
            "impact_if_false": "MEDIUM: AI agents may fail to extract key facts from the first 200 words.",
            "recommendation": "Place core data, statistics, and conclusions at the top of the page."
        },
        "crawl_maturity": {
            "title": "Crawl Rate Governance",
            "priority": "LOW",
            "description": "Scans for Crawl-delay and Request-rate directives in robots.txt.",
            "impact_if_false": "LOW: Site may be vulnerable to server strain from aggressive AI agents.",
            "recommendation": "Add a Crawl-delay directive to robots.txt to manage bot-induced latency."
        }
    },
    "es": {
        "llms_txt": {
            "title": "Descubrimiento de IA (/llms.txt)",
            "priority": "CRITICAL",
            "description": "Busca un resumen legible por máquinas para que los LLMs indexen servicios centrales.",
            "impact_if_false": "ALTO: Los modelos de IA podrían ignorar o alucinar sobre sus servicios.",
            "recommendation": "Despliegue un archivo /llms.txt en Markdown en el directorio raíz."
        },
        "json_ld": {
            "title": "Autoridad de Datos Estructurados (JSON-LD)",
            "priority": "CRITICAL",
            "description": "Valida el enlazado de entidades para puntajes de confianza (E-E-A-T).",
            "impact_if_false": "MEDIO: Los agentes de búsqueda de IA no pueden verificar credenciales profesionales.",
            "recommendation": "Implemente entidades de Schema.org vinculadas para Organización y Persona."
        },
        "citation_triggers": {
            "title": "Autoridad de Citación GEO",
            "priority": "HIGH",
            "description": "Busca citas de expertos y atribuciones de autoridad.",
            "impact_if_false": "ALTO: Es menos probable que el contenido sea citado como fuente primaria.",
            "recommendation": "Incluya citas de expertos identificados con cargos y roles claros."
        },
        "security_headers": {
            "title": "Política de Seguridad de IA (CSP)",
            "priority": "HIGH",
            "description": "Verifica encabezados CSP que protegen la integridad del contenido.",
            "impact_if_false": "ALTO: Vulnerable a inyección de contenido o proxies de extracción no autorizados.",
            "recommendation": "Implemente un CSP estricto para que la IA solo ingiera datos autorizados."
        },
        "ai_governance": {
            "title": "Gobernanza de Agentes de IA (robots.txt)",
            "priority": "MEDIUM",
            "description": "Analiza políticas de entrenamiento de IA vs. bots de búsqueda de IA.",
            "impact_if_false": "LEGAL/ESTRATÉGICO: Sus datos pueden ser recolectados gratis para entrenar modelos.",
            "recommendation": "Actualice robots.txt para bloquear CCBot/GPTBot pero permitir agentes de búsqueda."
        },
        "bot_verification_ready": {
            "title": "Verificación de Bots en WAF",
            "priority": "MEDIUM",
            "description": "Verifica gestión de bots a nivel de Edge y validación de IP.",
            "impact_if_false": "SEGURIDAD: Alto riesgo de bots falsos recolectando sus datos.",
            "recommendation": "Configure reglas WAF para verificar bots mediante endpoints de IP oficiales."
        },
        "llms_txt_quality": {
            "title": "Calidad del Resumen LLM (/llms.txt)",
            "priority": "LOW",
            "description": "Evalúa el formato y tamaño del archivo de resumen para IA.",
            "impact_if_false": "BAJO: El archivo existe pero es muy grande o tiene mal formato para la IA.",
            "recommendation": "Asegure encabezados Markdown (#) claros y un tamaño menor a 100KB."
        },
        "token_efficiency": {
            "title": "Presupuesto de Tokens y Eficiencia",
            "priority": "LOW",
            "description": "Audita densidad HTML, precisión numérica y niveles de anidamiento JSON-LD.",
            "impact_if_false": "ALTO: Estructuras pesadas y decimales excesivos agotan la ventana de contexto de la IA.",
            "recommendation": "Aplane el JSON-LD, redondee a 2 decimales y use HTML semántico."
        },
        "geo_optimized": {
            "title": "Estructura GEO 'Answer-First'",
            "priority": "LOW",
            "description": "Busca datos prioritarios y señales de citación al inicio del contenido.",
            "impact_if_false": "MEDIO: La IA podría no extraer datos clave de las primeras 200 palabras.",
            "recommendation": "Ubique datos clave, estadísticas y conclusiones al principio de la página."
        },
        "crawl_maturity": {
            "title": "Madurez de Rastreo (Crawl Rate)",
            "priority": "LOW",
            "description": "Busca directivas de Crawl-delay y Request-rate en robots.txt.",
            "impact_if_false": "BAJO: El sitio es vulnerable a sobrecarga por agentes de IA agresivos.",
            "recommendation": "Añada la directiva Crawl-delay para gestionar la latencia inducida por bots."
        }
    }
}