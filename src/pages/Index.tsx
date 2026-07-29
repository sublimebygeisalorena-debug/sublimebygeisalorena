import { useEffect, useState, useMemo } from "react";
import { Sparkles, Leaf, FlaskConical, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { HomeHeroCarousel } from "@/components/HomeHeroCarousel";
import { useCartSync } from "@/hooks/useCartSync";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ShopifyProduct, STOREFRONT_QUERY, storefrontApiRequest } from "@/lib/shopify";
import { useProductsManager, mergeProductImages } from "@/hooks/useProductsManager";
import foundersImg from "@/assets/founders.jpg";

const Index = () => {
  useCartSync();
  const { shopifyProducts: localShopifyProducts, loading: localLoading } = useProductsManager();
  const [remoteProducts, setRemoteProducts] = useState<ShopifyProduct[]>([]);
  const [fetchingRemote, setFetchingRemote] = useState(true);

  const { data: history } = useSiteContent("home_history", {
    eyebrow: "Nossa história",
    title: "Onde a ciência encontra o cuidado.",
    p1: "",
    p2: "",
    quote: "",
    image_url: "",
  });

  useEffect(() => {
    document.title = "Sublime by Geisa Lorena — Cosmética capilar de alta performance";
    let active = true;
    (async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 20, query: null });
        if (active && data?.data?.products?.edges?.length > 0) {
          setRemoteProducts(mergeProductImages(data.data.products.edges));
        }
      } catch {
        // Fallback to local products
      } finally {
        if (active) setFetchingRemote(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const products = useMemo(() => {
    if (remoteProducts.length > 0) return remoteProducts;
    return localShopifyProducts;
  }, [remoteProducts, localShopifyProducts]);

  const loading = localLoading && fetchingRemote;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO CAROUSEL (Renders auto-rotating banners every 8s + admin managed) */}
      <HomeHeroCarousel />

      {/* DIFERENCIAIS */}
      <section className="bg-secondary/50 py-20">
        <div className="container grid md:grid-cols-4 gap-10">
          {[
            { icon: FlaskConical, title: "pH Balanceado", desc: "Fórmulas equilibradas que respeitam a fibra capilar." },
            { icon: Leaf, title: "Cruelty-free", desc: "Não testamos em animais — nunca." },
            { icon: Sparkles, title: "Qualidade de salão", desc: "Tecnologia profissional para uso doméstico." },
            { icon: Heart, title: "Pós-química", desc: "Especialistas em cabelos quimicamente tratados." },
          ].map((d, i) => (
            <div key={i} className="text-center">
              <d.icon className="w-7 h-7 mx-auto text-accent mb-4" strokeWidth={1.2} />
              <h3 className="font-display text-xl mb-2">{d.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUTOS */}
      <section id="produtos" className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs tracking-luxe uppercase text-accent mb-4">Nossa coleção</p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">Os essenciais da Sublime</h2>
          <p className="text-muted-foreground">Produtos pensados para um ritual completo de cuidado capilar.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted mb-5" />
                <div className="h-4 bg-muted w-3/4 mb-2" />
                <div className="h-4 bg-muted w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>

      {/* HISTÓRIA */}
      <section id="historia" className="bg-secondary/40 py-24">
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[5/4] overflow-hidden">
            <img src={history.image_url || foundersImg} alt="Fundadores em laboratório" className="w-full h-full object-cover" loading="lazy" width={1280} height={1024} />
          </div>
          <div className="space-y-6">
            <p className="text-xs tracking-luxe uppercase text-accent">{history.eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">{history.title}</h2>
            {history.p1 && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{history.p1}</p>}
            {history.p2 && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{history.p2}</p>}
            {history.quote && <p className="font-display text-xl pt-2 italic">"{history.quote}"</p>}
          </div>
        </div>
      </section>

      {/* RITUAL */}
      <section id="ritual" className="container py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs tracking-luxe uppercase text-accent mb-4">O ritual</p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">Um cronograma simples, resultados que duram.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { n: "01", t: "Higienize", d: "Shampoo Pós-Química para limpar sem agredir a fibra." },
            { n: "02", t: "Trate", d: "Máscara Pós-Química para repor massa e nutrientes profundos." },
            { n: "03", t: "Finalize", d: "Leave-In Termoprotetor 10x1 + Reparador de Pontas para selar." },
          ].map((s) => (
            <div key={s.n} className="border border-border p-8 bg-card">
              <p className="font-display text-5xl text-accent mb-4">{s.n}</p>
              <h3 className="font-display text-2xl mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <TestimonialsCarousel />
      <Footer />
    </div>
  );
};

export default Index;
