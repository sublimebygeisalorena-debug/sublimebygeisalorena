import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct, formatBRL } from "@/lib/shopify";
import { toast } from "sonner";
import { trackProductClick } from "@/hooks/useAnalytics";

// ─── Fallback placeholder when image fails or is missing ────────────────────
const Placeholder = ({ title }: { title: string }) => (
  <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
    <span className="font-display text-5xl text-muted-foreground/30 select-none">
      {title?.charAt(0)?.toUpperCase() ?? "M"}
    </span>
  </div>
);

// ─── Image with fallback ─────────────────────────────────────────────────────
const SafeImg = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);

  // Reset error when src changes (different product or slide)
  useEffect(() => setError(false), [src]);

  if (!src || error) return <Placeholder title={alt} />;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

// ─── Product Card with auto-carousel ────────────────────────────────────────
const CAROUSEL_INTERVAL = 3000; // 3 seconds

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;

  // Collect all images
  const images = product.node.images.edges.map((e) => e.node);
  const hasMultiple = images.length > 1;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrentIdx((p) => (p + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIdx((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-rotate when hovered (or always if multiple images)
  useEffect(() => {
    if (!hasMultiple || isPaused) return;
    const timer = setInterval(next, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [hasMultiple, isPaused, next]);

  const currentImage = images[currentIdx];

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
    <Link
      to={`/product/${product.node.handle}`}
      className="group block"
      onClick={() => trackProductClick(product.node.handle, product.node.title)}
    >
      {/* ── Image area ────────────────────────────────────────────── */}
      <div
        className="aspect-[4/5] bg-muted overflow-hidden mb-5 relative"
        onMouseEnter={() => { setIsHovered(true); setIsPaused(false); }}
        onMouseLeave={() => { setIsHovered(false); setIsPaused(false); }}
      >
        {/* Current image with cross-fade */}
        <div className="w-full h-full relative">
          {images.length === 0 ? (
            <Placeholder title={product.node.title} />
          ) : (
            images.map((img, i) => (
              <div
                key={img.url}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  i === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <SafeImg
                  src={img.url}
                  alt={img.altText || product.node.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          )}
        </div>

        {/* Navigation arrows — show on hover if multiple images */}
        {hasMultiple && isHovered && (
          <>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPaused(true); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 border border-border/60 p-1.5 hover:bg-background transition opacity-0 group-hover:opacity-100"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPaused(true); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 border border-border/60 p-1.5 hover:bg-background transition opacity-0 group-hover:opacity-100"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {hasMultiple && (
          <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPaused(true); setCurrentIdx(i); }}
                aria-label={`Foto ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIdx
                    ? "w-5 bg-accent"
                    : "w-1.5 bg-background/60 hover:bg-background/90"
                }`}
              />
            ))}
          </div>
        )}

        {/* Progress bar for auto-rotate */}
        {hasMultiple && !isPaused && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-background/20 z-20">
            <div
              key={currentIdx}
              className="h-full bg-accent/70 origin-left"
              style={{
                animation: `productProgress ${CAROUSEL_INTERVAL}ms linear forwards`,
              }}
            />
          </div>
        )}

        {/* Photo count badge */}
        {hasMultiple && (
          <div className="absolute top-3 right-3 z-20 bg-background/80 text-[9px] uppercase tracking-luxe px-1.5 py-0.5 text-foreground border border-border/60 opacity-0 group-hover:opacity-100 transition">
            {currentIdx + 1}/{images.length}
          </div>
        )}
      </div>

      {/* ── Product info ──────────────────────────────────────────── */}
      <div className="space-y-2">
        {product.node.productType && (
          <p className="text-[10px] tracking-luxe uppercase text-muted-foreground">
            {product.node.productType}
          </p>
        )}
        <h3 className="font-display text-xl leading-tight">{product.node.title}</h3>
        <div className="flex items-center justify-between pt-2">
          <span className="font-medium">
            {formatBRL(
              product.node.priceRange.minVariantPrice.amount,
              product.node.priceRange.minVariantPrice.currencyCode
            )}
          </span>
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
