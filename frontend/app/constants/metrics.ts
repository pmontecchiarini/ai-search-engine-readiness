// src/constants/metrics.ts
export const AUDIT_METRICS_DATA = {
    "en": {
        "llms_txt": {
            "title": "AI Discovery Readiness (/llms.txt)",
            "priority": "MEDIUM",
            "description": "Simple 'cheat sheet' for AI bots that summarizes your business. It acts as a lightweight guide so bots can find your important information quickly without getting lost in messy website code.",
            "impact_if_false": "Without this guide, AI tools might get confused or even make things up (hallucinate) about your services because they can't easily find the facts.",
            "recommendation": [
                "Add a simple plain-text file called '/llms.txt' to your website\’s main folder to act as a fast, machine-readable map for AI agents."
            ]
        },
        "json_ld": {
            "title": "Structured Data Authority (JSON-LD)",
            "priority": "CRITICAL",
            "description": "Hidden labels that act as a digital ID card for your business. They translate your website's human language into a structured format that machines understand perfectly, clearly showing the relationships between your brand, your experts, and your content.",
            "impact_if_false": "If these labels are missing or broken, AI engines cannot easily verify that your business is a credible authority, leading to a significant loss of visibility in AI search results.",
            "recommendation": [
                "Connect the dots: Link your organization, authors, and content together in your site's code so AI sees your business as one unified, trusted entity.",
                "Label your FAQs: Prioritize using 'FAQ labels' to format your content into the direct question-and-answer pairs that AI systems love to use for their answers."
            ]
        },
        "citation_triggers": {
            "title": "AI Trust and Expert Citations",
            "priority": "CRITICAL",
            "description": "This focuses on making your information so clear and reliable that AI tools (like ChatGPT or Perplexity) use your specific facts and experts to build their answers rather than just mentioning your name.",
            "impact_if_false": "Since this is the most effective way to be seen, a lack of it means AI will likely ignore your business entirely or hide your brand in a small footnote users will miss.",
            "recommendation": [
                "Put the answer first: Start every section with a short, direct answer (about 50 words) so the AI can find and use your point instantly.",
                "Use real expert quotes: Include quotes from real people with their full names and job titles, as this is the #1 way to prove to an AI that your info is credible.",
                "Use specific numbers: Replace vague claims with real statistics and percentages, and link to trusted official reports to prove your facts are true.",
                "Make headings sound like questions: Write your sub-headings to match the actual questions people ask AI, like 'How much does it cost?' instead of just 'Pricing'."
            ]
        },
        "security_headers": {
            "title": "AI Security Policy (CSP)",
            "priority": "HIGH",
            "description": "This acts like a digital 'security guard' for your website. It ensures that AI tools only see your real, approved information and prevents bad actors from sneaking fake content or code onto your pages.",
            "impact_if_false": "Without this, your site is vulnerable to 'spoofing,' where hackers pretend to be your business or trick AI tools into showing fake information about your brand.",
            "recommendation": [
                "Set up strict 'house rules': Implement a security policy (CSP) that tells your website to only trust verified sources and block unauthorized data collection."
            ]
        },
        "ai_governance": {
            "title": "AI Agent Governance (robots.txt)",
            "priority": "MEDIUM",
            "description": "List of 'house rules' for AI visitors. It allows you to decide which bots can use your content to help people find you in search results and which ones should be blocked from 'harvesting' your data to train their future models.",
            "impact_if_false": "Your private or proprietary business data may be taken for free to build future AI products without giving you any traffic or credit in return.",
            "recommendation": [
                "Use a 'hybrid' policy: Update your site's instructions to block 'training bots' (like GPTBot) that just take data, but stay open to 'search bots' (like OAI-SearchBot) that actually send customers to your site."
            ]
        },
        "bot_verification_ready": {
            "title": "AI Identity Check (WAF)",
            "priority": "MEDIUM",
            "description": "This confirms if AI visitors are actually who they claim to be by checking their official digital **ID lists**.",
            "impact_if_false": "Without verification, fake bots may try to sneak in and steal your data by pretending to be trusted AI models.",
            "recommendation": [
                "Set up your website\’s security firewall to automatically verify AI bots using their official, published IP address lists."
            ]
        },
        "llms_txt_quality": {
            "title": "AI Cheat Sheet Quality (/llms.txt)",
            "priority": "LOW",
            "description": "This ensures your AI guide is well-organized and uses clear formatting so machines can scan it quickly.",
            "impact_if_false": "If the file is messy, poorly structured, or way too large, AI models might ignore it entirely or get confused about your business.",
            "recommendation": [
                "Keep your guide simple by using clear Markdown headers and ensuring the file size stays small enough for AI to read in one go."
            ]
        },
        "token_efficiency": {
            "title": "Token Budget & Structural Efficiency",
            "priority": "LOW",
            "description": "This scans for messy code or unnecessary junk that wastes the AI\’s limited **'brain space'** when it reads your page.",
            "impact_if_false": "Cluttered code forces AI to waste its 'thinking budget' on noise, making it less likely to find or cite your actual information.",
            "recommendation": [
                "Clean up your website code by using simpler text formats (like Markdown) and removing extra script noise to maximize the model's focus."
            ]
        },
        "geo_optimized": {
            "title": "GEO Answer-First Structure",
            "priority": "LOW",
            "description": "This ensures you put your direct answers and main facts right at the **very top** of each page where AI looks first.",
            "impact_if_false": "AI tools evaluate relevance based on the opening content, so they may miss your main points if they are buried at the bottom.",
            "recommendation": [
                "Follow the '40-60 word rule' by placing a direct, citable answer in the first few sentences of every section."
            ]
        },
        "crawl_maturity": {
            "title": "Crawl Rate Governance",
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
            "priority": "MEDIO",
            "description": "Una 'guía rápida' simple para bots de IA que resume tu negocio. Actúa como un mapa ligero para que los bots encuentren tu información importante rápido sin perderse en el código desordenado de la web.",
            "impact_if_false": "Sin esta guía, las herramientas de IA podrían confundirse o incluso inventar datos (alucinar) sobre tus servicios al no encontrar los hechos fácilmente.",
            "recommendation": "Agrega un archivo de texto simple llamado '/llms.txt' en la carpeta principal de tu web para que sirva como un mapa rápido y legible para agentes de IA."
        },
        "json_ld": {
            "title": "Autoridad de Datos Estructurados (JSON-LD)",
            "priority": "CRITICO",
            "description": "Etiquetas ocultas que actúan como una credencial digital para tu negocio. Traducen el lenguaje humano de tu web a un formato estructurado que las máquinas entienden perfectamente, mostrando la relación entre tu marca, expertos y contenido.",
            "impact_if_false": "Si faltan estas etiquetas, los motores de IA no pueden verificar fácilmente que tu negocio es una autoridad creíble, lo que genera una pérdida significativa de visibilidad en los resultados de IA.",
            "recommendation": "Conecta los puntos: vincula tu organización, autores y contenido en el código para que la IA vea tu negocio como una entidad unificada y confiable. Prioriza el uso de 'etiquetas FAQ' para formatear tus respuestas."
        },
        "citation_triggers": {
            "title": "Confianza y Citas de Expertos en IA",
            "priority": "CRITICO",
            "description": "Se enfoca en hacer que tu información sea tan clara y confiable que las herramientas de IA (como ChatGPT o Perplexity) usen tus datos y expertos específicos para construir sus respuestas en lugar de solo mencionar tu nombre.",
            "impact_if_false": "Al ser la forma más efectiva de ser visto, la falta de esto significa que la IA probablemente ignorará tu negocio por completo o lo ocultará en una nota al pie que nadie leerá.",
            "recommendation": "Pon la respuesta primero: inicia cada sección con una respuesta directa (unas 50 palabras). Usa citas de expertos reales con nombres y cargos. Usa estadísticas reales y redacta tus encabezados como las preguntas que la gente le hace a la IA."
        },
        "security_headers": {
            "title": "Política de Seguridad de IA (CSP)",
            "priority": "ALTO",
            "description": "Actúa como un 'guardia de seguridad' digital para tu sitio. Asegura que las herramientas de IA solo vean tu información real aprobada y evita que actores malintencionados inserten contenido o código falso en tus páginas.",
            "impact_if_false": "Sin esto, tu sitio es vulnerable a ataques donde hackers fingen ser tu negocio o engañan a las herramientas de IA para mostrar información falsa sobre tu marca.",
            "recommendation": "Configura 'reglas de casa' estrictas: implementa una política de seguridad (CSP) que indique a tu sitio confiar solo en fuentes verificadas y bloquear la recolección de datos no autorizada."
        },
        "ai_governance": {
            "title": "Gobernanza de Agentes de IA (robots.txt)",
            "priority": "MEDIO",
            "description": "Lista de 'reglas de la casa' para visitantes de IA. Te permite decidir qué bots pueden usar tu contenido para ayudarte a aparecer en búsquedas y cuáles deben ser bloqueados para evitar que 'cosechen' tus datos para entrenar sus futuros modelos.",
            "impact_if_false": "Tus datos comerciales privados podrían ser tomados gratis para construir productos de IA sin darte tráfico ni crédito a cambio.",
            "recommendation": "Usa una política 'híbrida': actualiza las instrucciones de tu sitio para bloquear bots de entrenamiento (como GPTBot) que solo toman datos, pero mantente abierto a bots de búsqueda (como OAI-SearchBot) que envían clientes a tu web."
        },
        "bot_verification_ready": {
            "title": "Verificación de Identidad de IA (WAF)",
            "priority": "MEDIO",
            "description": "Confirma si los visitantes de IA son realmente quienes dicen ser mediante la verificación de sus listas oficiales de identificación digital.",
            "impact_if_false": "Sin verificación, bots falsos podrían intentar entrar y robar tus datos fingiendo ser modelos de IA confiables.",
            "recommendation": "Configura el firewall de seguridad de tu web para verificar automáticamente a los bots de IA usando sus listas oficiales de direcciones IP publicadas."
        },
        "llms_txt_quality": {
            "title": "Calidad de la Guía para IA (/llms.txt)",
            "priority": "BAJO",
            "description": "Asegura que tu guía para IA esté bien organizada y use un formato claro para que las máquinas puedan escanearla rápidamente.",
            "impact_if_false": "Si el archivo está desordenado o es demasiado grande, los modelos de IA podrían ignorarlo por completo o confundirse sobre tu negocio.",
            "recommendation": "Mantén tu guía simple usando encabezados Markdown claros y asegúrate de que el tamaño del archivo sea lo suficientemente pequeño para que la IA lo lea de una vez."
        },
        "token_efficiency": {
            "title": "Presupuesto de Tokens y Eficiencia Estructural",
            "priority": "BAJO",
            "description": "Escanea código desordenado o basura innecesaria que desperdicia el limitado 'espacio cerebral' de la IA cuando lee tu página.",
            "impact_if_false": "El código saturado obliga a la IA a gastar su 'presupuesto de pensamiento' en ruido visual, reduciendo las chances de que encuentre o cite tu información real.",
            "recommendation": "Limpia el código de tu web usando formatos de texto más simples (como Markdown) y elimina ruidos de scripts adicionales para maximizar el enfoque del modelo."
        },
        "geo_optimized": {
            "title": "Estructura GEO: Respuesta Primero",
            "priority": "BAJO",
            "description": "Asegura que coloques tus respuestas directas y hechos principales justo al inicio de cada página, que es donde la IA busca primero.",
            "impact_if_false": "Las herramientas de IA evalúan la relevancia basándose en el contenido inicial, por lo que podrían perderse tus puntos principales si están al final.",
            "recommendation": "Sigue la 'regla de las 40-60 palabras' colocando una respuesta directa y citable en las primeras frases de cada sección."
        },
        "crawl_maturity": {
            "title": "Gobernanza de Frecuencia de Rastreo",
            "priority": "BAJO",
            "description": "Verifica si tienes reglas para evitar que los bots de IA visiten tu sitio de manera demasiado agresiva.",
            "impact_if_false": "Sin límites de velocidad, los bots de IA que se mueven rápido pueden sobrecargar tu web, haciendo que se ralentice o se caiga.",
            "recommendation": "Agrega una instrucción 'Crawl-delay' en las reglas de tu sitio (robots.txt) para pedirle a los bots de IA que reduzcan la frecuencia de sus visitas."
        }
    }
}