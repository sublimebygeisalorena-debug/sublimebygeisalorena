// Generic event notifier (called by DB triggers for reviews/signups)
import { sendTelegram, verifyWebhookSecret, escapeHtml } from '../_shared/telegram.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

function buildMessage(event: string, data: any): string | null {
  if (event === 'new_review') {
    const stars = '⭐'.repeat(Math.max(0, Math.min(5, data?.rating ?? 0)));
    return `📝 <b>Nova avaliação recebida</b>\n` +
      `Produto: <code>${escapeHtml(data?.product_handle ?? '—')}</code>\n` +
      `Cliente: ${escapeHtml(data?.user_name ?? '—')}\n` +
      `Nota: ${stars} (${Number(data?.rating ?? 0)}/5)\n` +
      `${data?.comment ? `\n"${escapeHtml(String(data.comment).slice(0, 300))}"` : ''}\n` +
      `Status: ${data?.is_approved ? '✅ aprovada' : '⏳ pendente de aprovação'}`;
  }
  if (event === 'new_signup') {
    return `👤 <b>Novo cadastro de cliente</b>\n` +
      `Nome: ${escapeHtml(data?.full_name || '(sem nome)')}\n` +
      `Telefone: ${escapeHtml(data?.phone || '—')}\n` +
      `Cidade: ${escapeHtml([data?.city, data?.state].filter(Boolean).join(' / ') || '—')}`;
  }
  if (event === 'site_error') {
    return `🚨 <b>Erro no site</b>\n` +
      `Origem: <code>${escapeHtml(data?.source ?? '—')}</code>\n` +
      `${escapeHtml(String(data?.message ?? '').slice(0, 500))}`;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const unauth = await verifyWebhookSecret(req);
    if (unauth) return new Response(unauth.body, { status: unauth.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const payload = await req.json();
    const text = buildMessage(payload?.event, payload?.data);
    if (!text) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const result = await sendTelegram(text);
    return new Response(JSON.stringify({ ok: true, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('telegram-event error', e);
    return new Response(JSON.stringify({ ok: false, error: 'internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
