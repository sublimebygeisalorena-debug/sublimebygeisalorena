import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, ShoppingBag, Newspaper, Store, Settings, Share2 } from "lucide-react";

const cards = [
  { to: "/admin/conteudo", icon: Settings, label: "Conteúdo das páginas", desc: "Edite hero, sobre, história e cuidados" },
  { to: "/admin/redes-sociais", icon: Share2, label: "Redes Sociais", desc: "Gerencie links do Instagram, TikTok, WhatsApp e mais" },
  { to: "/admin/artigos", icon: Newspaper, label: "Artigos", desc: "Crie e edite artigos da seção Cuidados" },
  { to: "/admin/clientes", icon: Users, label: "Clientes", desc: "Veja todos os clientes cadastrados" },
  { to: "/admin/pedidos", icon: FileText, label: "Pedidos", desc: "Acompanhe os pedidos da loja" },
  { to: "/admin/loja", icon: Store, label: "Loja", desc: "Gerencie produtos no Shopify" },
];

const AdminHome = () => {
  const [counts, setCounts] = useState({ articles: 0, customers: 0, orders: 0 });
  useEffect(() => {
    (async () => {
      const [a, c, o] = await Promise.all([
        supabase.from("articles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
      ]);
      setCounts({ articles: a.count ?? 0, customers: c.count ?? 0, orders: o.count ?? 0 });
    })();
  }, []);

  return (
    <div className="space-y-12">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Artigos", value: counts.articles },
          { label: "Clientes", value: counts.customers },
          { label: "Pedidos", value: counts.orders },
        ].map((s) => (
          <div key={s.label} className="border border-border p-6">
            <p className="text-xs uppercase tracking-luxe text-muted-foreground">{s.label}</p>
            <p className="font-display text-4xl mt-2">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="border border-border p-6 hover:border-accent transition group">
            <c.icon className="w-6 h-6 text-accent mb-3" strokeWidth={1.4} />
            <h3 className="font-display text-xl group-hover:text-accent">{c.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
