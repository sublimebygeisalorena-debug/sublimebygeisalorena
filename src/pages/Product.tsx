import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartSync } from "@/hooks/useCartSync";
import { useCartStore } from "@/stores/cartStore";
import { PRODUCT_BY_HANDLE_QUERY, storefrontApiRequest, formatBRL, ShopifyProduct } from "@/lib/shopify";
import { productContent } from "@/data/productContent";
import { toast } from "sonner";

const ProductPage = () => {
  useCartSync();
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    setLoading(true);
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
          <Link to="/loja" className="underline">Voltar à loja</Link>
        </div>
      </div>
    );
  }

  const variant = product.variants.edges[0]?.node;
  const images = product.images.edges;
  const content = productContent[product.handle];
  const wrappedProduct: ShopifyProduct = { node: product };

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: wrappedProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Adicionado à sacola", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <Link to="/loja" className="inline-flex items-center text-xs uppercase tracking-luxe text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar à loja
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* GALERIA */}
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

          {/* INFO */}
          <div className="space-y-6 lg:pt-8">
            {product.productType && <p className="text-xs tracking-luxe uppercase text-accent">{product.productType}</p>}
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.title}</h1>
            <p className="font-display text-3xl">{formatBRL(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>
            <div className="text-muted-foreground leading-relaxed pt-2" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br />") }} />

            {content?.benefits && (
              <ul className="space-y-2 pt-4">
                {content.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center border border-border h-14">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 h-full hover:bg-secondary">−</button>
                <span className="px-4 w-12 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 h-full hover:bg-secondary">+</button>
              </div>
              <Button onClick={handleAdd} disabled={isLoading || !variant?.availableForSale} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 text-xs uppercase tracking-luxe">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar à sacola"}
              </Button>
            </div>

            <Accordion type="single" collapsible className="pt-6">
              {content?.howToUse && (
                <AccordionItem value="use" className="border-border">
                  <AccordionTrigger className="text-xs uppercase tracking-luxe">Modo de uso</AccordionTrigger>
                  <AccordionContent>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal pl-5">
                      {content.howToUse.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              )}
              {content?.composition && (
                <AccordionItem value="comp" className="border-border">
                  <AccordionTrigger className="text-xs uppercase tracking-luxe">Composição</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{content.composition}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="ship" className="border-border">
                <AccordionTrigger className="text-xs uppercase tracking-luxe">Entrega e devolução</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Frete calculado no checkout com base no seu CEP. Devolução em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
