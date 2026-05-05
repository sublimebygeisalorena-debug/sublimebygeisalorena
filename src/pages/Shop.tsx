import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useCartSync } from "@/hooks/useCartSync";
import { ShopifyProduct, STOREFRONT_QUERY, storefrontApiRequest } from "@/lib/shopify";

const Shop = () => {
  useCartSync();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Loja — maison.capilar";
    (async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 50, query: null });
        setProducts(data?.data?.products?.edges || []);
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-20">
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-luxe uppercase text-accent mb-4">Coleção completa</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Loja</h1>
          <p className="text-muted-foreground">Todos os essenciais para o seu ritual capilar.</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted mb-5" />
                <div className="h-4 bg-muted w-3/4 mb-2" />
                <div className="h-4 bg-muted w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Shop;
