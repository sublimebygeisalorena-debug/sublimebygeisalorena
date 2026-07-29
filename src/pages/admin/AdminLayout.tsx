import { NavLink, Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const tabs = [
  { to: "/admin", label: "Visão geral", end: true },
  { to: "/admin/metricas", label: "Métricas" },
  { to: "/admin/banners", label: "Banners (Carrossel)" },
  { to: "/admin/produtos", label: "Anúncios / Produtos" },
  { to: "/admin/conteudo", label: "Conteúdo" },
  { to: "/admin/artigos", label: "Artigos" },
  { to: "/admin/clientes", label: "Clientes" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/loja", label: "Shopify" },
];

const AdminLayout = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <section className="container py-12">
      <p className="text-xs tracking-luxe uppercase text-accent mb-3">Painel admin</p>
      <h1 className="font-display text-3xl md:text-4xl mb-8">Sublime by Geisa Lorena</h1>
      <nav className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border mb-10">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `text-xs uppercase tracking-luxe pb-3 -mb-px border-b-2 ${
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </section>
    <Footer />
  </div>
);

export default AdminLayout;
