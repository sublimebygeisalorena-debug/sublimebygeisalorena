import { useEffect, useState } from "react";
import { Sparkles, Leaf, FlaskConical, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { Button } from "@/components/ui/button";
import { useCartSync } from "@/hooks/useCartSync";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ShopifyProduct, STOREFRONT_QUERY, storefrontApiRequest } from "@/lib/shopify";
import heroImg from "/hero-new.jpg";
import foundersImg from "@/assets/founders.jpg";

const Index = () => {
  useCartSync();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: hero } = useSiteContent("home_hero", {
    eyebrow: "Coleção essencial",
    title: "A ciência do cuidado capilar em suas mãos.",
    subtitle: "Fórmulas profissionais com pH balanceado, óleos nobres e proteção térmica.",
    image_url: "",
  });
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
    (async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 20, query: null });
        setProducts(data?.data?.products?.edges || []);
      } finally { setLoading(false); }
    })();
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative">
        <div className="container grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
          <div className="space-y-8 lg:pr-10">
            <p className="text-xs tracking-luxe uppercase text-accent">{hero.eyebrow}</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              {hero.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed whitespace-pre-line">
              {hero.subtitle}
            </p>
            <div className="flex gap-4 pt-2">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 px-8 text-xs uppercase tracking-luxe">
                <a href="#produtos">Ver produtos</a>
              </Button>
              <Button asChild variant="ghost" className="rounded-none h-12 px-6 text-xs uppercase tracking-luxe hover:text-accent">
                <a href="#historia">Nossa história</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={hero.image_url || heroImg} alt="Cabelo saudável e brilhante" className="w-full h-full px-0 mx-0 object-scale-down" width={1536} height={1024} />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background border border-border p-6 max-w-[220px] hidden md:block shadow-soft">
              <p className="font-display text-3xl">7</p>
              <p className="text-xs uppercase tracking-luxe text-muted-foreground mt-1">óleos nobres no blend reparador</p>
            </div>
          </div>
        </div>
      </section>

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
          <p className="text-muted-foreground">Cinco produtos pensados para um ritual completo de cuidado.</p>
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
            { n: "01", t: "Higienize", d: "Shampoo pH Balance para limpar sem agredir." },
            { n: "02", t: "Trate", d: "Máscara pH Balance para repor massa e nutrientes." },
            { n: "03", t: "Finalize", d: "Leave-in 10 em 1 + Reparador de Pontas para selar o cuidado." },
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
