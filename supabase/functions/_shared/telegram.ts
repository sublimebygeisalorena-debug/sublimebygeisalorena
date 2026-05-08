// Shared Telegram helper used by multiple edge functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

export function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

let cachedSecret: string | null = null;
async function getExpectedSecret(): Promise<string> {
  if (cachedSecret) return cachedSecret;
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data, error } = await supabase.rpc('get_telegram_webhook_secret');
  if (error || !data) throw new Error('webhook secret unavailable');
  cachedSecret = String(data);
  return cachedSecret;
}

export async function verifyWebhookSecret(req: Request): Promise<Response | null> {
  const provided = req.headers.get('x-webhook-secret') ?? '';
  let expected: string;
  try {
    expected = await getExpectedSecret();
  } catch (e) {
    console.error('secret fetch failed', e);
    return new Response(JSON.stringify({ error: 'server misconfigured' }), { status: 500 });
  }
  if (!provided || !timingSafeEqual(provided, expected)) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }
  return null;
}

export async function sendTelegram(text: string, opts?: { dedupeKey?: string }) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');
  if (!TELEGRAM_API_KEY) throw new Error('TELEGRAM_API_KEY not configured');

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  if (opts?.dedupeKey) {
    const { error: insErr } = await supabase
      .from('telegram_alerts_log')
      .insert({ alert_key: opts.dedupeKey });
    if (insErr) {
      if ((insErr as any).code === '23505') return { skipped: true };
      throw insErr;
    }
  }

  const { data: subs, error } = await supabase
    .from('telegram_subscribers')
    .select('chat_id');
  if (error) throw error;

  const results = [];
  for (const s of subs ?? []) {
    const r = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: s.chat_id,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const body = await r.text();
    results.push({ chat_id: s.chat_id, ok: r.ok, status: r.status, body });
    if (!r.ok) console.error('Telegram send failed', s.chat_id, r.status, body);
  }
  return { sent: results.length, results };
}

export function fmtBRL(n: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(n);
  } catch {
    return `${currency} ${n}`;
  }
}
