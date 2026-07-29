CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  session_id text,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can log page views" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins can read page views" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.product_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_handle text NOT NULL,
  product_title text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.product_clicks TO anon, authenticated;
GRANT SELECT ON public.product_clicks TO authenticated;
GRANT ALL ON public.product_clicks TO service_role;
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can log product clicks" ON public.product_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins can read product clicks" ON public.product_clicks FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));