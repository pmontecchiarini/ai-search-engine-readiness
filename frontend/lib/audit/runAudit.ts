import * as cheerio from 'cheerio';

export const CHECK_KEYS = [
  'llms_txt',
  'llms_txt_quality',
  'json_ld',
  'ai_governance',
  'crawl_maturity',
  'security_headers',
] as const;

export type CheckKey = (typeof CHECK_KEYS)[number];
export type AuditResults = Record<CheckKey, boolean>;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// A real AI *search* bot, deliberately chosen over a training bot (GPTBot,
// CCBot): blocking training bots while staying open to search bots is the
// actual recommended policy, so testing with a training bot would penalize
// sites doing exactly that correctly.
const AI_SEARCH_BOT_USER_AGENT =
  'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)';

interface FetchedText {
  status: number;
  text: string;
}

async function safeFetchText(url: string, timeoutMs: number): Promise<FetchedText | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { status: res.status, text: await res.text() };
  } catch {
    return null;
  }
}

async function safeFetchHeaders(url: string, timeoutMs: number): Promise<Headers | null> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
    return res.headers;
  } catch {
    return null;
  }
}

function tryCheck(fn: () => boolean): boolean {
  try {
    return fn();
  } catch {
    return false;
  }
}

function checkJsonLd($: cheerio.CheerioAPI): boolean {
  let found = false;
  $('script').each((_, el) => {
    if (/ld\+json/i.test($(el).attr('type') ?? '')) found = true;
  });
  return found;
}

function checkLlmsTxtQuality(llmsTxt: FetchedText | null): boolean {
  if (!llmsTxt || llmsTxt.status !== 200) return false;
  const sizeOk = Buffer.byteLength(llmsTxt.text, 'utf8') / 1024 < 100;
  const hasHeading = /^#\s.+/m.test(llmsTxt.text);
  return sizeOk && hasHeading;
}

// Live check, not a robots.txt text search: fetches the homepage as a real AI
// search bot would and checks whether the server actually serves it (vs a
// WAF/CDN-level block). This is what matters in practice — robots.txt is a
// convention bots can ignore, and mentioning a bot's name in robots.txt (the
// old approach) doesn't tell you whether it's allowed or blocked there.
async function checkAiGovernance(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': AI_SEARCH_BOT_USER_AGENT },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

// Intentionally simple line-based robots.txt grouping — not a full RFC 9309
// parser. A new User-agent group starts whenever a User-agent line follows a
// non-User-agent line; a group "applies to all" if any of its agents is "*".
function checkCrawlMaturity(robotsTxt: string): boolean {
  const lines = robotsTxt.split(/\r?\n/);
  let groupAppliesToAll = false;
  let justSawUserAgent = false;
  let foundInAllGroup = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const uaMatch = line.match(/^user-agent:\s*(.+)$/i);
    if (uaMatch) {
      if (!justSawUserAgent) groupAppliesToAll = false; // new group starting
      if (uaMatch[1].trim() === '*') groupAppliesToAll = true;
      justSawUserAgent = true;
      continue;
    }

    justSawUserAgent = false;
    if (groupAppliesToAll && /^(crawl-delay|request-rate):/i.test(line)) {
      foundInAllGroup = true;
    }
  }

  return foundInAllGroup;
}

/**
 * Runs all AI-readiness checks against a URL. Mirrors the original Python
 * auditor's behavior: if the homepage fetch doesn't return 200, every check
 * is reported as false rather than attempting the independent sub-checks.
 */
export async function runAudit(url: string): Promise<AuditResults> {
  const homepage = await safeFetchText(url, 15000);

  if (!homepage || homepage.status !== 200) {
    return Object.fromEntries(CHECK_KEYS.map((key) => [key, false])) as AuditResults;
  }

  const $ = cheerio.load(homepage.text);

  const [llmsTxtOutcome, robotsTxtOutcome, headersOutcome, aiGovernanceOutcome] = await Promise.allSettled([
    safeFetchText(`${url}/llms.txt`, 5000),
    safeFetchText(`${url}/robots.txt`, 5000),
    safeFetchHeaders(url, 5000),
    checkAiGovernance(url),
  ]);

  const llmsTxt = llmsTxtOutcome.status === 'fulfilled' ? llmsTxtOutcome.value : null;
  const robotsTxt = robotsTxtOutcome.status === 'fulfilled' ? robotsTxtOutcome.value : null;
  const headers = headersOutcome.status === 'fulfilled' ? headersOutcome.value : null;
  const aiGovernanceOk = aiGovernanceOutcome.status === 'fulfilled' ? aiGovernanceOutcome.value : false;

  return {
    llms_txt: tryCheck(() => !!llmsTxt && llmsTxt.status === 200),
    llms_txt_quality: tryCheck(() => checkLlmsTxtQuality(llmsTxt)),
    json_ld: tryCheck(() => checkJsonLd($)),
    ai_governance: tryCheck(() => aiGovernanceOk),
    crawl_maturity: tryCheck(() => checkCrawlMaturity(robotsTxt?.text ?? '')),
    security_headers: tryCheck(() => !!headers?.has('content-security-policy')),
  };
}
