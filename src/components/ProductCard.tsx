import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct, formatBRL } from "@/lib/shopify";
import { toast } from "sonner";

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Adicionado à sacola", { position: "top-center" });
  };

  return (
    <Link to={`/product/${product.node.handle}`} className="group block">
      <div className="aspect-[4/5] bg-muted overflow-hidden mb-5 relative">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.node.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <span className="font-display text-4xl text-muted-foreground/40">M</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {product.node.productType && (
          <p className="text-[10px] tracking-luxe uppercase text-muted-foreground">{product.node.productType}</p>
        )}
        <h3 className="font-display text-xl leading-tight">{product.node.title}</h3>
        <div className="flex items-center justify-between pt-2">
          <span className="font-medium">{formatBRL(product.node.priceRange.minVariantPrice.amount, product.node.priceRange.minVariantPrice.currencyCode)}</span>
          <Button
            onClick={handleAdd}
            disabled={isLoading || !variant}
            variant="ghost"
            className="text-xs uppercase tracking-luxe hover:text-accent"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Adicionar"}
          </Button>
        </div>
      </div>
    </Link>
  );
};
