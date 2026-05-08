// Shared Telegram helper used by multiple edge functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

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
      // unique violation = already sent
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
