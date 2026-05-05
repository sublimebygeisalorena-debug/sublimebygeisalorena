import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartSync } from "@/hooks/useCartSync";
import { useCartStore } from "@/stores/cartStore";
import { PRODUCT_BY_HANDLE_QUERY, storefrontApiRequest, formatBRL, ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

const ProductPage = () => {
  useCartSync();
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        setProduct(data?.data?.productByHandle || null);
      } finally { setLoading(false); }
    })();
  }, [handle]);

  useEffect(() => {
    if (product) document.title = `${product.title} — maison.capilar`;
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 text-center">
          <p className="text-muted-foreground mb-4">Produto não encontrado.</p>
          <Link to="/" className="underline">Voltar à loja</Link>
        </div>
      </div>
    );
  }

  const variant = product.variants.edges[0]?.node;
  const images = product.images.edges;

  const wrappedProduct: ShopifyProduct = { node: product };

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: wrappedProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Adicionado à sacola", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <Link to="/" className="inline-flex items-center text-xs uppercase tracking-luxe text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-4">
            <div className="aspect-square bg-muted overflow-hidden">
              {images[activeImg] ? (
                <img src={images[activeImg].node.url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                  <span className="font-display text-6xl text-muted-foreground/40">M</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`aspect-square overflow-hidden border ${i === activeImg ? "border-foreground" : "border-border"}`}>
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 lg:pt-8">
            {product.productType && <p className="text-xs tracking-luxe uppercase text-accent">{product.productType}</p>}
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.title}</h1>
            <p className="font-display text-3xl">{formatBRL(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>

            <div className="prose prose-sm text-muted-foreground leading-relaxed pt-2" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br />") }} />

            <Button onClick={handleAdd} disabled={isLoading || !variant?.availableForSale} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 text-xs uppercase tracking-luxe mt-6">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar à sacola"}
            </Button>

            <div className="border-t border-border pt-6 mt-8 space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Categoria</span><span>{product.productType || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Disponibilidade</span><span>{variant?.availableForSale ? "Em estoque" : "Esgotado"}</span></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
