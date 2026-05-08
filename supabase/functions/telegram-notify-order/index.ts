import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyWebhookSecret, escapeHtml, fmtBRL } from '../_shared/telegram.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

function buildMessage(payload: any): string {
  const o = payload.order ?? {};
  const items = Array.isArray(o.items) ? o.items : [];
  const itemsTxt = items.slice(0, 10).map((it: any) =>
    `• ${Number(it.quantity ?? it.qty ?? 1)}x ${escapeHtml(it.title ?? it.name ?? it.handle ?? 'item')}`
  ).join('\n') || '—';

  if (payload.event === 'created') {
    return `🛒 <b>Novo pedido</b>\n` +
      `ID: <code>${escapeHtml(o.id)}</code>\n` +
      `Status: <b>${escapeHtml(o.status)}</b>\n` +
      `Itens (${Number(o.item_count ?? 0)}):\n${itemsTxt}\n` +
      `Total: <b>${fmtBRL(Number(o.total ?? 0), o.currency)}</b>` +
      (o.checkout_url ? `\n<a href="${escapeHtml(o.checkout_url)}">Checkout</a>` : '');
  }
  if (payload.event === 'status_changed') {
    return `🔄 <b>Status do pedido alterado</b>\n` +
      `ID: <code>${escapeHtml(o.id)}</code>\n` +
      `<b>${escapeHtml(payload.old_status)}</b> → <b>${escapeHtml(payload.new_status)}</b>\n` +
      `Total: ${fmtBRL(Number(o.total ?? 0), o.currency)}`;
  }
  return `Pedido ${escapeHtml(o.id)}: evento ${escapeHtml(payload.event)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const unauth = await verifyWebhookSecret(req);
    if (unauth) return new Response(unauth.body, { status: unauth.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');
    if (!TELEGRAM_API_KEY) throw new Error('TELEGRAM_API_KEY is not configured');

    const payload = await req.json();
    const text = buildMessage(payload);

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
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

    return new Response(JSON.stringify({ ok: true, sent: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('telegram-notify-order error', e);
    return new Response(JSON.stringify({ ok: false, error: 'internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
