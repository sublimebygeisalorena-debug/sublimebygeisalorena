// Periodic checks: abandoned checkouts, low stock, daily summary
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendTelegram, fmtBRL } from '../_shared/telegram.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_DOMAIN = 'radiant-strands-studio-2qzze.myshopify.com'; // permanent domain
const SHOPIFY_API_VERSION = '2025-07';
const LOW_STOCK_THRESHOLD = 5;

async function shopifyAdmin(path: string): Promise<any> {
  // Find any Shopify access token in env (online token has user-scoped name with colons)
  let token: string | undefined;
  for (const [k, v] of Object.entries(Deno.env.toObject())) {
    if (k.startsWith('SHOPIFY_ONLINE_ACCESS_TOKEN') && v) { token = v; break; }
  }
  if (!token) token = Deno.env.get('SHOPIFY_ACCESS_TOKEN') ?? undefined;
  if (!token) throw new Error('No Shopify token configured');
  const url = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/${path}`;
  const r = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`Shopify ${path} [${r.status}]: ${body.slice(0, 300)}`);
  }
  return r.json();
}

async function checkAbandonedCheckouts() {
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const max = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  let data: any;
  try {
    data = await shopifyAdmin(
      `checkouts.json?created_at_min=${encodeURIComponent(max)}&created_at_max=${encodeURIComponent(cutoff)}&limit=50`
    );
  } catch (e) {
    console.error('abandoned checkouts fetch failed', e);
    return { abandoned: 0, error: String(e) };
  }
  const checkouts = data?.checkouts ?? [];
  let sent = 0;
  for (const c of checkouts) {
    if (c.completed_at) continue;
    const items = (c.line_items ?? []).slice(0, 8)
      .map((li: any) => `• ${li.quantity}x ${li.title}`).join('\n') || '—';
    const total = Number(c.total_price ?? 0);
    const customer = c.email || c.customer?.email || '—';
    const text = `🛍️ <b>Carrinho abandonado</b>\n` +
      `Cliente: ${customer}\n` +
      `Criado: ${new Date(c.created_at).toLocaleString('pt-BR')}\n` +
      `Itens:\n${items}\n` +
      `Total: <b>${fmtBRL(total, c.presentment_currency ?? c.currency)}</b>` +
      (c.abandoned_checkout_url ? `\n<a href="${c.abandoned_checkout_url}">Recuperar checkout</a>` : '');
    const res = await sendTelegram(text, { dedupeKey: `abandoned:${c.id}` });
    if (!(res as any).skipped) sent++;
  }
  return { abandoned: sent, scanned: checkouts.length };
}

async function checkLowStock() {
  let data: any;
  try {
    data = await shopifyAdmin(`products.json?limit=250&fields=id,title,variants`);
  } catch (e) {
    console.error('low stock fetch failed', e);
    return { low_stock: 0, error: String(e) };
  }
  const products = data?.products ?? [];
  let sent = 0;
  const today = new Date().toISOString().slice(0, 10);
  for (const p of products) {
    for (const v of p.variants ?? []) {
      if (v.inventory_management !== 'shopify') continue;
      const qty = Number(v.inventory_quantity ?? 0);
      if (qty <= LOW_STOCK_THRESHOLD && qty >= 0) {
        const text = `📉 <b>Estoque baixo</b>\n` +
          `${p.title}${v.title && v.title !== 'Default Title' ? ` — ${v.title}` : ''}\n` +
          `Restam: <b>${qty}</b> unidade(s)`;
        const res = await sendTelegram(text, { dedupeKey: `lowstock:${v.id}:${today}` });
        if (!(res as any).skipped) sent++;
      }
    }
  }
  return { low_stock: sent };
}

async function dailySummary(supabase: any) {
  const now = new Date();
  // Run only between 20:00 and 20:59 local-ish (function uses UTC; 23:00 UTC ≈ 20:00 BRT)
  if (now.getUTCHours() !== 23) return { summary: 'skipped (not 20h BRT)' };
  const today = now.toISOString().slice(0, 10);
  const dayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { data: orders } = await supabase
    .from('orders')
    .select('total, item_count, status, items')
    .gte('created_at', dayStart);

  const list = orders ?? [];
  const count = list.length;
  const revenue = list.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0);
  const items = list.reduce((s: number, o: any) => s + Number(o.item_count ?? 0), 0);
  const avg = count ? revenue / count : 0;

  const productCount: Record<string, number> = {};
  for (const o of list) {
    for (const it of (o.items ?? [])) {
      const name = it.title ?? it.name ?? it.handle ?? 'item';
      productCount[name] = (productCount[name] || 0) + Number(it.quantity ?? it.qty ?? 1);
    }
  }
  const top = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([n, q]) => `• ${q}x ${n}`).join('\n') || '—';

  const text = `📊 <b>Resumo diário</b> (${new Date().toLocaleDateString('pt-BR')})\n` +
    `Pedidos: <b>${count}</b>\n` +
    `Itens vendidos: <b>${items}</b>\n` +
    `Faturamento: <b>${fmtBRL(revenue)}</b>\n` +
    `Ticket médio: <b>${fmtBRL(avg)}</b>\n\n` +
    `<b>Top produtos:</b>\n${top}`;

  const res = await sendTelegram(text, { dedupeKey: `daily:${today}` });
  return { summary: 'sent', skipped: (res as any).skipped ?? false };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const url = new URL(req.url);
    const only = url.searchParams.get('task');

    const result: any = {};
    if (!only || only === 'abandoned') result.abandoned = await checkAbandonedCheckouts();
    if (!only || only === 'lowstock') result.lowStock = await checkLowStock();
    if (!only || only === 'daily') result.daily = await dailySummary(supabase);

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('telegram-cron error', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
