import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Eye, MousePointerClick, TrendingUp, ShoppingBag, BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ─────────────────────────────────────────────────────────────────

interface DailyVisit {
  date: string;
  count: number;
}

interface TopPage {
  page: string;
  count: number;
}

interface TopProduct {
  product_handle: string;
  product_title: string;
  count: number;
}

interface TopSold {
  title: string;
  handle: string;
  quantity: number;
}

interface MetricsData {
  visitasHoje: number;
  visitas7d: number;
  visitas30d: number;
  sessoes30d: number;
  clientesTotal: number;
  pedidosTotal: number;
  visitasPorDia: DailyVisit[];
  topPages: TopPage[];
  topClicados: TopProduct[];
  topVendidos: TopSold[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function formatPage(page: string) {
  if (page === "/") return "Página inicial (/)";
  return page;
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// ─── Mini Bar Chart ─────────────────────────────────────────────────────────

const MiniBarChart = ({ data }: { data: DailyVisit[] }) => {
  if (!data.length) return <p className="text-xs text-muted-foreground">Sem dados ainda.</p>;
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1.5 h-24 w-full mt-2">
      {data.map((d) => {
        const pct = Math.max((d.count / max) * 100, 4);
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full bg-accent/80 group-hover:bg-accent transition-all duration-300 rounded-t-sm"
              style={{ height: `${pct}%` }}
            />
            <span className="text-[9px] text-muted-foreground rotate-45 origin-left whitespace-nowrap hidden sm:block">
              {formatDate(d.date)}
            </span>
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-0.5 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
              {d.count} {d.count === 1 ? "visita" : "visitas"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Stat Card ──────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  icon: Icon,
  accent = false,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent?: boolean;
  sub?: string;
}) => (
  <div className={`border p-6 flex flex-col gap-3 ${accent ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}>
    <div className="flex items-center justify-between">
      <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">{label}</p>
      <Icon className={`w-4 h-4 ${accent ? "text-accent" : "text-muted-foreground"}`} strokeWidth={1.5} />
    </div>
    <p className={`font-display text-4xl font-semibold ${accent ? "text-accent" : "text-foreground"}`}>{value}</p>
    {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────

const AdminMetrics = () => {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const load = async () => {
    setLoading(true);
    try {
      const today = todayISO();
      const ago7 = daysAgoISO(7);
      const ago30 = daysAgoISO(30);

      // ── Page Views ──────────────────────────────────────────────────────
      const [viewsToday, views7d, views30d, allViews30d, profilesRes, ordersRes, clicksRes] =
        await Promise.all([
          supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", `${today}T00:00:00`),
          supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", ago7),
          supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", ago30),
          supabase.from("page_views").select("page, session_id, created_at").gte("created_at", ago30),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("orders").select("items, total"),
          supabase.from("product_clicks").select("product_handle, product_title").gte("created_at", ago30),
        ]);

      // ── Daily visits (last 14 days) ──────────────────────────────────────
      const rows = allViews30d.data ?? [];
      const dailyMap: Record<string, number> = {};
      const last14 = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return d.toISOString().slice(0, 10);
      });
      last14.forEach((d) => { dailyMap[d] = 0; });
      rows.forEach((r) => {
        const day = (r.created_at as string).slice(0, 10);
        if (dailyMap[day] !== undefined) dailyMap[day]++;
      });
      const visitasPorDia: DailyVisit[] = last14.map((d) => ({ date: d, count: dailyMap[d] }));

      // ── Top pages ────────────────────────────────────────────────────────
      const pageMap: Record<string, number> = {};
      rows.forEach((r) => {
        pageMap[r.page] = (pageMap[r.page] ?? 0) + 1;
      });
      const topPages: TopPage[] = Object.entries(pageMap)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

      // ── Unique sessions ──────────────────────────────────────────────────
      const sessoes30d = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;

      // ── Top clicked products ────────────────────────────────────────────
      const clickMap: Record<string, { title: string; count: number }> = {};
      (clicksRes.data ?? []).forEach((r) => {
        const h = r.product_handle;
        if (!clickMap[h]) clickMap[h] = { title: r.product_title ?? h, count: 0 };
        clickMap[h].count++;
      });
      const topClicados: TopProduct[] = Object.entries(clickMap)
        .map(([product_handle, v]) => ({ product_handle, product_title: v.title, count: v.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

      // ── Top sold products (from orders items JSON) ───────────────────────
      const soldMap: Record<string, { title: string; quantity: number }> = {};
      (ordersRes.data ?? []).forEach((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        items.forEach((item: any) => {
          const handle = item?.handle ?? item?.product?.handle ?? item?.variantId ?? "unknown";
          const title = item?.title ?? item?.product?.title ?? handle;
          if (!soldMap[handle]) soldMap[handle] = { title, quantity: 0 };
          soldMap[handle].quantity += item?.quantity ?? 1;
        });
      });
      const topVendidos: TopSold[] = Object.entries(soldMap)
        .map(([handle, v]) => ({ handle, title: v.title, quantity: v.quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 7);

      setData({
        visitasHoje: viewsToday.count ?? 0,
        visitas7d: views7d.count ?? 0,
        visitas30d: views30d.count ?? 0,
        sessoes30d,
        clientesTotal: profilesRes.count ?? 0,
        pedidosTotal: ordersRes.data?.length ?? 0,
        visitasPorDia,
        topPages,
        topClicados,
        topVendidos,
      });
    } catch (e) {
      console.error("Erro ao carregar métricas", e);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent mb-3" />
        <p className="text-sm text-muted-foreground">Carregando métricas…</p>
      </div>
    );
  }

  const d = data!;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl">Métricas & Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Dados de visitas, engajamento e vendas do site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">
            Atualizado às {lastRefresh.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <Button
            onClick={load}
            variant="outline"
            size="sm"
            className="rounded-none text-xs uppercase tracking-luxe h-9 px-4"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] uppercase tracking-luxe text-muted-foreground mb-4">Visão Geral</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Visitas hoje" value={d.visitasHoje} icon={Eye} accent />
          <StatCard label="Visitas 7 dias" value={d.visitas7d} icon={TrendingUp} />
          <StatCard label="Visitas 30 dias" value={d.visitas30d} icon={BarChart3} />
          <StatCard label="Sessões únicas (30d)" value={d.sessoes30d} icon={Users} />
          <StatCard label="Clientes cadastrados" value={d.clientesTotal} icon={Users} />
          <StatCard label="Pedidos totais" value={d.pedidosTotal} icon={ShoppingBag} />
        </div>
      </div>

      {/* ── Visits chart + Top Pages ────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Bar chart */}
        <div className="border border-border bg-card p-6 space-y-3">
          <p className="text-[11px] uppercase tracking-luxe text-muted-foreground flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Visitas — últimos 14 dias
          </p>
          <MiniBarChart data={d.visitasPorDia} />
          {d.visitasPorDia.every((v) => v.count === 0) && (
            <p className="text-xs text-muted-foreground pt-2">
              Nenhuma visita registrada ainda. O rastreamento começa assim que alguém acessa o site.
            </p>
          )}
        </div>

        {/* Top pages */}
        <div className="border border-border bg-card p-6 space-y-4">
          <p className="text-[11px] uppercase tracking-luxe text-muted-foreground flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            Páginas mais visitadas (30d)
          </p>
          {d.topPages.length === 0 ? (
            <p className="text-xs text-muted-foreground">Sem dados ainda.</p>
          ) : (
            <div className="space-y-2">
              {d.topPages.map((p, i) => {
                const pct = Math.round((p.count / d.visitas30d) * 100) || 0;
                return (
                  <div key={p.page} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground w-4 text-right">{i + 1}</span>
                        <span className="text-foreground truncate max-w-[180px]">{formatPage(p.page)}</span>
                      </span>
                      <span className="text-muted-foreground font-mono">{p.count}</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent/60 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Products ───────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Most clicked */}
        <div className="border border-border bg-card p-6 space-y-4">
          <p className="text-[11px] uppercase tracking-luxe text-muted-foreground flex items-center gap-2">
            <MousePointerClick className="w-3.5 h-3.5" />
            Produtos mais clicados (30d)
          </p>
          {d.topClicados.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Nenhum clique registrado ainda. Quando visitantes clicarem nos produtos, os dados aparecem aqui.
            </p>
          ) : (
            <div className="space-y-2">
              {d.topClicados.map((p, i) => {
                const max = d.topClicados[0].count;
                const pct = Math.round((p.count / max) * 100);
                return (
                  <div key={p.product_handle} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground w-4 text-right">{i + 1}</span>
                        <span className="text-foreground truncate max-w-[200px]">{p.product_title}</span>
                      </span>
                      <span className="text-muted-foreground font-mono">{p.count} cliques</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Most sold */}
        <div className="border border-border bg-card p-6 space-y-4">
          <p className="text-[11px] uppercase tracking-luxe text-muted-foreground flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            Produtos mais vendidos
          </p>
          {d.topVendidos.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Nenhum pedido com itens mapeados ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {d.topVendidos.map((p, i) => {
                const max = d.topVendidos[0].quantity;
                const pct = Math.round((p.quantity / max) * 100);
                return (
                  <div key={p.handle} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground w-4 text-right">{i + 1}</span>
                        <span className="text-foreground truncate max-w-[200px]">{p.title}</span>
                      </span>
                      <span className="text-muted-foreground font-mono">{p.quantity} un.</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500/70 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Info box ───────────────────────────────────────────────────── */}
      <div className="border border-border/50 bg-secondary/20 p-5 space-y-2">
        <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">Como funciona o rastreamento</p>
        <ul className="space-y-1">
          {[
            "Visitas: registradas automaticamente a cada mudança de página — sem cookies.",
            "Sessões únicas: identificadas por um ID anônimo por aba/sessão do navegador.",
            "Cliques em produtos: registrados ao abrir a página de qualquer produto.",
            "Vendas: extraídas dos pedidos registrados no Supabase.",
            "Nenhum dado pessoal é coletado. Apenas página, sessão anônima e produto.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <span className="text-accent mt-px">•</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminMetrics;
