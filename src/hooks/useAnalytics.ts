import { supabase } from "@/integrations/supabase/client";

// ---------------------------------------------------------------------------
// Session ID — one anonymous ID per browser session (no PII collected)
// ---------------------------------------------------------------------------
function getSessionId(): string {
  const key = "sublime_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Track a page view (fire-and-forget — never throws)
// ---------------------------------------------------------------------------
export async function trackPageView(page: string) {
  try {
    await supabase.from("page_views").insert({
      page,
      session_id: getSessionId(),
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    });
  } catch {
    // Silently ignore — tracking must never break the UX
  }
}

// ---------------------------------------------------------------------------
// Track a product click (fire-and-forget — never throws)
// ---------------------------------------------------------------------------
export async function trackProductClick(
  productHandle: string,
  productTitle?: string
) {
  try {
    await supabase.from("product_clicks").insert({
      product_handle: productHandle,
      product_title: productTitle ?? null,
      session_id: getSessionId(),
    });
  } catch {
    // Silently ignore
  }
}
