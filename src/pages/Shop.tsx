import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useCartSync } from "@/hooks/useCartSync";
import { ShopifyProduct, STOREFRONT_QUERY, storefrontApiRequest } from "@/lib/shopify";
import { useProductsManager, mergeProductImages } from "@/hooks/useProductsManager";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Shop = () => {
  useCartSync();
  const { shopifyProducts: localShopifyProducts, loading: localLoading } = useProductsManager();
  const [remoteProducts, setRemoteProducts] = useState<ShopifyProduct[]>([]);
  const [fetchingRemote, setFetchingRemote] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Todos");

  useEffect(() => {
    document.title = "Loja — Sublime by Geisa Lorena";
    let active = true;
    (async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 100, query: null });
        if (active && data?.data?.products?.edges?.length > 0) {
          setRemoteProducts(mergeProductImages(data.data.products.edges));
        }
      } catch {
        // Fallback to local managed products
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.node.productType) set.add(p.node.productType); });
    return ["Todos", ...Array.from(set)];
  }, [products]);

  const featured = useMemo(() => {
    return products.filter((p) => (p.node.tags || []).map((t) => t.toLowerCase()).includes("destaque")).slice(0, 4);
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = category === "Todos" || p.node.productType === category;
      const matchTerm = !term || p.node.title.toLowerCase().includes(term) || (p.node.description || "").toLowerCase().includes(term);
      return matchCat && matchTerm;
    });
  }, [products, search, category]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-12 md:py-20">
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="text-xs tracking-luxe uppercase text-accent mb-3 md:mb-4">Coleção completa</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4">Loja</h1>
          <p className="text-sm md:text-base text-muted-foreground">Todos os essenciais para o seu ritual capilar.</p>
        </div>

        {!loading && featured.length > 0 && (
          <div className="mb-16 md:mb-20">
            <div className="flex items-baseline justify-between mb-6 md:mb-8">
              <h2 className="font-display text-2xl md:text-3xl">Em destaque</h2>
              <p className="text-xs tracking-luxe uppercase text-muted-foreground">Seleção da casa</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
              {featured.map((p) => <ProductCard key={p.node.id} product={p} />)}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-8 md:mb-10 border-t border-border pt-8 md:pt-10">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.4} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos…"
              className="pl-9"
            />
          </div>
          {/* Horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 text-xs uppercase tracking-luxe px-4 py-2 border transition ${
                  category === cat
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-accent hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted mb-4" />
                <div className="h-4 bg-muted w-3/4 mb-2" />
                <div className="h-4 bg-muted w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground py-20 text-center">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
            {filtered.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Shop;
