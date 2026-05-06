import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatBRL } from "@/lib/shopify";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  title: string;
  handle: string;
  variantTitle: string;
  quantity: number;
  price: { amount: string; currencyCode: string };
  image: string | null;
}

interface Order {
  id: string;
  total: number;
  currency: string;
  item_count: number;
  status: string;
  items: OrderItem[];
  checkout_url: string | null;
  created_at: string;
}

const statusLabel: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const Pedidos = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = "Meus pedidos — maison.capilar"; }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, total, currency, item_count, status, items, checkout_url, created_at")
        .order("created_at", { ascending: false });
      setOrders((data ?? []) as unknown as Order[]);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-20 max-w-4xl">
        <Link to="/conta" className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground hover:text-accent mb-8">
          <ArrowLeft className="w-3 h-3" /> Minha conta
        </Link>
        <p className="text-xs tracking-luxe uppercase text-accent mb-3">Histórico</p>
        <h1 className="font-display text-4xl md:text-5xl mb-12">Meus pedidos</h1>

        {loading ? (
          <p className="text-muted-foreground text-sm">Carregando…</p>
        ) : orders.length === 0 ? (
          <div className="border border-border p-16 text-center">
            <Package className="w-10 h-10 mx-auto text-muted-foreground mb-4" strokeWidth={1.2} />
            <p className="font-display text-2xl mb-2">Nenhum pedido ainda</p>
            <p className="text-muted-foreground text-sm mb-6">Quando você finalizar uma compra, ela aparece aqui.</p>
            <Link to="/loja" className="inline-block text-xs uppercase tracking-luxe text-accent hover:underline">Ir para a loja →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <article key={o.id} className="border border-border p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-luxe text-muted-foreground">Pedido</p>
                    <p className="font-display text-lg">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="rounded-none text-xs uppercase tracking-luxe">
                      {statusLabel[o.status] ?? o.status}
                    </Badge>
                    <p className="font-display text-xl mt-2">{formatBRL(o.total, o.currency)}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-5">
                  {o.items?.map((it, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-14 h-14 bg-muted overflow-hidden flex-shrink-0">
                        {it.image && <img src={it.image} alt={it.title} className="w-full h-full object-cover" loading="lazy" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${it.handle}`} className="text-sm hover:text-accent">{it.title}</Link>
                        <p className="text-xs text-muted-foreground">Qtd. {it.quantity} · {formatBRL(it.price.amount, it.price.currencyCode)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {o.status === "pending" && o.checkout_url && (
                  <a href={o.checkout_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 text-xs uppercase tracking-luxe text-accent hover:underline">
                    Continuar pagamento →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Pedidos;
