// src/constants/metrics.ts
import type { MetricContent } from './types';

export const AUDIT_METRICS_DATA: {
        [lang: string]: {
        [key: string]: MetricContent;
    };
    } = {
    "en": {
        "llms_txt": {
            "title": "AI Discovery Readiness (/llms.txt)",
            "friendlyTitle": "A cheap bet: /llms.txt",
            "priority": "MEDIUM",
            "description": "A simple, machine-readable 'cheat sheet' file that summarizes your business for AI bots. It's cheap to add — but it's an emerging convention, not a confirmed standard; no major AI crawler has committed to reading it yet.",
            "impact_if_false": "Nothing breaks without it today. It's a low-cost bet: if this convention catches on, you're already covered; if it doesn't, you've lost very little effort.",
            "recommendation": [
                "Add a simple plain-text file called '/llms.txt' to your website\’s main folder to act as a fast, machine-readable map for AI agents."
            ]
        },
        "json_ld": {
            "title": "Structured Data Authority (JSON-LD)",
            "friendlyTitle": "Help search engines understand who you are",
            "priority": "MEDIUM",
            "description": "Hidden labels that act as a digital ID card for your business, translating your site into a format machines parse easily. It's a well-established SEO practice — though a direct, confirmed effect on AI chat visibility specifically hasn't been proven in testing, so treat it as good hygiene rather than an AI silver bullet.",
            "impact_if_false": "You're missing a long-standing best practice for structured data and rich search results. Its specific effect on AI visibility is unproven, so don't expect this alone to change how often AI cites you.",
            "recommendation": [
                "Connect the dots: Link your organization, authors, and content together in your site's code so search engines see your business as one unified, trusted entity.",
                "Label your FAQs: Prioritize using 'FAQ labels' to format your content into direct question-and-answer pairs."
            ]
        },
        "security_headers": {
            "title": "AI Security Policy (CSP)",
            "friendlyTitle": "Stop fake content from impersonating you",
            "priority": "HIGH",
            "description": "This acts like a digital 'security guard' for your website. It ensures that AI tools only see your real, approved information and prevents bad actors from sneaking fake content or code onto your pages.",
            "impact_if_false": "Without this, your site is vulnerable to 'spoofing,' where hackers pretend to be your business or trick AI tools into showing fake information about your brand.",
            "recommendation": [
                "Set up strict 'house rules': Implement a security policy (CSP) that tells your website to only trust verified sources and block unauthorized data collection."
            ]
        },
        "ai_governance": {
            "title": "AI Crawler Access (live check)",
            "friendlyTitle": "Make sure AI search bots can actually reach you",
            "priority": "HIGH",
            "description": "We send a real request to your homepage using an AI search bot's identity (not a training bot) and check whether your server actually serves it, or blocks it at the firewall/CDN level — something a robots.txt file alone can't tell you.",
            "impact_if_false": "If AI search bots are blocked from reaching your page, you can't be cited in AI search results no matter how good your content is — this is a hard blocker, not a minor gap.",
            "recommendation": [
                "Check your firewall/CDN (e.g. Cloudflare bot rules) and robots.txt for rules blocking AI search bots like OAI-SearchBot or PerplexityBot, and allow them — it's fine to keep blocking pure training bots like GPTBot or CCBot if you prefer."
            ]
        },
        "llms_txt_quality": {
            "title": "AI Cheat Sheet Quality (/llms.txt)",
            "friendlyTitle": "Keep your /llms.txt easy to scan",
            "priority": "LOW",
            "description": "This ensures your AI guide is well-organized and uses clear formatting so machines can scan it quickly.",
            "impact_if_false": "If the file is messy, poorly structured, or way too large, AI models might ignore it entirely or get confused about your business.",
            "recommendation": [
                "Keep your guide simple by using clear Markdown headers and ensuring the file size stays small enough for AI to read in one go."
            ]
        },
        "crawl_maturity": {
            "title": "Crawl Rate Governance",
            "friendlyTitle": "Keep AI bots from overloading your site",
            "priority": "LOW",
            "description": "Checks if you have rules in place to stop AI bots from visiting your site too aggressively.",
            "impact_if_false": "Without speed limits, fast-moving AI bots can put too much strain on your website, causing it to slow down or crash.",
            "recommendation": [
                "Add a 'Crawl-delay' instruction to your site\’s house rules (robots.txt) to tell AI bots to slow down their visit frequency."
            ]
        }
    },
    "es": {
        "llms_txt": {
            "title": "Preparación para Descubrimiento de IA (/llms.txt)",
            "friendlyTitle": "Una apuesta barata: /llms.txt",
            "priority": "MEDIO",
            "description": "Un archivo simple tipo 'chuleta' que resume tu negocio para bots de IA. Es barato de agregar — pero es una convención emergente, no un estándar confirmado; ningún crawler de IA grande se comprometió todavía a leerlo.",
            "impact_if_false": "Nada se rompe si no lo tenés hoy. Es una apuesta de bajo costo: si esta convención se populariza, ya vas a estar cubierto; si no, perdiste muy poco esfuerzo.",
            "recommendation": "Agrega un archivo de texto simple llamado '/llms.txt' en la carpeta principal de tu web para que sirva como un mapa rápido y legible para agentes de IA."
        },
        "json_ld": {
            "title": "Autoridad de Datos Estructurados (JSON-LD)",
            "friendlyTitle": "Ayudá a los buscadores a entender quién sos",
            "priority": "MEDIO",
            "description": "Etiquetas ocultas que actúan como una credencial digital para tu negocio, traduciendo tu web a un formato que las máquinas entienden fácilmente. Es una práctica de SEO bien establecida — aunque un efecto directo y confirmado sobre la visibilidad en chats de IA específicamente no está probado en tests, así que tratalo como buena higiene técnica, no como una bala de plata para IA.",
            "impact_if_false": "Te estás perdiendo una práctica de larga data para datos estructurados y resultados enriquecidos de búsqueda. Su efecto específico en visibilidad de IA no está comprobado, así que no esperes que esto solo cambie cuánto te cita la IA.",
            "recommendation": "Conecta los puntos: vincula tu organización, autores y contenido en el código para que los buscadores vean tu negocio como una entidad unificada y confiable. Prioriza el uso de 'etiquetas FAQ' para formatear tus respuestas."
        },
        "security_headers": {
            "title": "Política de Seguridad de IA (CSP)",
            "friendlyTitle": "Evitá que contenido falso se haga pasar por vos",
            "priority": "ALTO",
            "description": "Actúa como un 'guardia de seguridad' digital para tu sitio. Asegura que las herramientas de IA solo vean tu información real aprobada y evita que actores malintencionados inserten contenido o código falso en tus páginas.",
            "impact_if_false": "Sin esto, tu sitio es vulnerable a ataques donde hackers fingen ser tu negocio o engañan a las herramientas de IA para mostrar información falsa sobre tu marca.",
            "recommendation": "Configura 'reglas de casa' estrictas: implementa una política de seguridad (CSP) que indique a tu sitio confiar solo en fuentes verificadas y bloquear la recolección de datos no autorizada."
        },
        "ai_governance": {
            "title": "Acceso de Crawlers de IA (chequeo en vivo)",
            "friendlyTitle": "Asegurate de que los bots de búsqueda de IA te puedan alcanzar",
            "priority": "ALTO",
            "description": "Enviamos una solicitud real a tu página principal con la identidad de un bot de búsqueda de IA (no de entrenamiento) y verificamos si tu servidor realmente la responde, o la bloquea a nivel de firewall/CDN — algo que un archivo robots.txt por sí solo no te puede decir.",
            "impact_if_false": "Si los bots de búsqueda de IA están bloqueados, no podés aparecer citado en resultados de búsqueda de IA sin importar qué tan bueno sea tu contenido — esto es un bloqueo total, no un detalle menor.",
            "recommendation": "Revisá tu firewall/CDN (por ejemplo, reglas de bots de Cloudflare) y tu robots.txt en busca de reglas que bloqueen bots de búsqueda de IA como OAI-SearchBot o PerplexityBot, y permitilos — está bien seguir bloqueando bots puramente de entrenamiento como GPTBot o CCBot si preferís."
        },
        "llms_txt_quality": {
            "title": "Calidad de la Guía para IA (/llms.txt)",
            "friendlyTitle": "Mantené tu /llms.txt fácil de leer",
            "priority": "BAJO",
            "description": "Asegura que tu guía para IA esté bien organizada y use un formato claro para que las máquinas puedan escanearla rápidamente.",
            "impact_if_false": "Si el archivo está desordenado o es demasiado grande, los modelos de IA podrían ignorarlo por completo o confundirse sobre tu negocio.",
            "recommendation": "Mantén tu guía simple usando encabezados Markdown claros y asegúrate de que el tamaño del archivo sea lo suficientemente pequeño para que la IA lo lea de una vez."
        },
        "crawl_maturity": {
            "title": "Gobernanza de Frecuencia de Rastreo",
            "friendlyTitle": "Evitá que los bots de IA sobrecarguen tu sitio",
            "priority": "BAJO",
            "description": "Verifica si tienes reglas para evitar que los bots de IA visiten tu sitio de manera demasiado agresiva.",
            "impact_if_false": "Sin límites de velocidad, los bots de IA que se mueven rápido pueden sobrecargar tu web, haciendo que se ralentice o se caiga.",
            "recommendation": "Agrega una instrucción 'Crawl-delay' en las reglas de tu sitio (robots.txt) para pedirle a los bots de IA que reduzcan la frecuencia de sus visitas."
        }
    }
}
