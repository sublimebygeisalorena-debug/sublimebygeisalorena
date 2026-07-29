import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct, formatBRL } from "@/lib/shopify";
import { toast } from "sonner";
import { trackProductClick } from "@/hooks/useAnalytics";
import { Lightbox } from "@/components/Lightbox";

// ─── Constants ───────────────────────────────────────────────────────────────
const CAROUSEL_INTERVAL = 3500; // ms between auto-slides

// ─── Skeleton (shimmer while image loads) ────────────────────────────────────
const ImageSkeleton = () => (
  <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
    <span className="font-display text-5xl text-muted-foreground/20 select-none animate-pulse">
      ·
    </span>
  </div>
);

// ─── Placeholder (image missing or failed) ───────────────────────────────────
const Placeholder = ({ title }: { title: string }) => (
  <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
    <span className="font-display text-5xl text-muted-foreground/25 select-none">
      {title?.charAt(0)?.toUpperCase() ?? "S"}
    </span>
  </div>
);

// ─── SafeImg — lazy loading + skeleton + error fallback ──────────────────────
const SafeImg = ({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  // Reset when src changes
  useEffect(() => { setStatus("loading"); }, [src]);

  if (!src) return <Placeholder title={alt} />;

  return (
    <>
      {/* Skeleton visible while loading */}
      {status === "loading" && <ImageSkeleton />}

      {/* Error fallback */}
      {status === "error" && <Placeholder title={alt} />}

      {/* Actual image — always rendered so it starts loading immediately */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`${className} transition-opacity duration-500 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
};

// ─── ProductCard ─────────────────────────────────────────────────────────────
export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;

  // All images
  const images = product.node.images.edges.map((e) => e.node);
  const hasMultiple = images.length > 1;

  // Carousel state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setCurrentIdx((p) => (p + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIdx((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-rotate
  useEffect(() => {
    if (!hasMultiple || isPaused) return;
    const timer = setInterval(next, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [hasMultiple, isPaused, next]);

  // Keyboard navigation when carousel is focused
  const handleCarouselKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setIsPaused(true); next(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); setIsPaused(true); prev(); }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLightboxOpen(true); }
  };

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

  const lightboxImages = images.map((img) => ({
    url: img.url,
    alt: img.altText || product.node.title,
  }));

  return (
    <>
      <Link
        to={`/product/${product.node.handle}`}
        className="group block"
        onClick={() => trackProductClick(product.node.handle, product.node.title)}
      >
        {/* ── Image / Carousel area ─────────────────────────────── */}
        <div
          ref={carouselRef}
          role="region"
          aria-label={`Galeria de fotos — ${product.node.title}`}
          aria-roledescription="carrossel"
          tabIndex={0}
          className="aspect-[4/5] bg-muted overflow-hidden mb-5 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          onMouseEnter={() => { setIsHovered(true); }}
          onMouseLeave={() => { setIsHovered(false); setIsPaused(false); }}
          onKeyDown={handleCarouselKeyDown}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Cross-fade slides */}
          <div className="absolute inset-0" aria-live="polite" aria-atomic="true">
            {images.length === 0 ? (
              <Placeholder title={product.node.title} />
            ) : (
              images.map((img, i) => (
                <div
                  key={img.url}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Foto ${i + 1} de ${images.length}`}
                  aria-hidden={i !== currentIdx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <SafeImg
                    src={img.url}
                    alt={img.altText || product.node.title}
                    className="w-full h-full object-cover"
                    eager={i === 0}
                  />
                </div>
              ))
            )}
          </div>

          {/* ── Lightbox open button (hover) ─────────────────────── */}
          {images.length > 0 && isHovered && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              aria-label="Abrir galeria em tela cheia"
              className="absolute top-3 left-3 z-30 bg-background/80 border border-border/60 p-2 hover:bg-background transition opacity-0 group-hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Expand className="w-3.5 h-3.5" />
            </button>
          )}

          {/* ── Prev/Next arrows ─────────────────────────────────── */}
          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label={`Foto anterior — foto ${((currentIdx - 1 + images.length) % images.length) + 1} de ${images.length}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPaused(true); prev(); }}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 border border-border/60 p-1.5 hover:bg-background transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label={`Próxima foto — foto ${((currentIdx + 1) % images.length) + 1} de ${images.length}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPaused(true); next(); }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 border border-border/60 p-1.5 hover:bg-background transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* ── Dot indicators ───────────────────────────────────── */}
          {hasMultiple && (
            <div
              role="tablist"
              aria-label="Selecionar foto"
              className="absolute bottom-3 inset-x-0 z-20 flex justify-center gap-1.5"
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  type="button"
                  aria-selected={i === currentIdx}
                  aria-label={`Foto ${i + 1} de ${images.length}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPaused(true); setCurrentIdx(i); }}
                  className={`h-1 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                    i === currentIdx
                      ? "w-5 bg-accent"
                      : "w-1.5 bg-background/60 hover:bg-background/90"
                  }`}
                />
              ))}
            </div>
          )}

          {/* ── Progress bar ─────────────────────────────────────── */}
          {hasMultiple && !isPaused && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-background/20 z-20"
              aria-hidden="true"
            >
              <div
                key={currentIdx}
                className="h-full bg-accent/70 origin-left"
                style={{ animation: `productProgress ${CAROUSEL_INTERVAL}ms linear forwards` }}
              />
            </div>
          )}

          {/* ── Photo count badge ─────────────────────────────────── */}
          {hasMultiple && (
            <div
              aria-hidden="true"
              className="absolute top-3 right-3 z-20 bg-background/80 text-[9px] uppercase tracking-luxe px-1.5 py-0.5 border border-border/60 opacity-0 group-hover:opacity-100 transition"
            >
              {currentIdx + 1}/{images.length}
            </div>
          )}

          {/* ── Keyboard hint (focus only) ───────────────────────── */}
          <div
            className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center pb-10 opacity-0 focus-within:opacity-100 transition"
            aria-hidden="true"
          >
            <span className="bg-foreground/90 text-background text-[9px] uppercase tracking-luxe px-3 py-1.5">
              ← → navegar · Enter abrir galeria
            </span>
          </div>
        </div>

        {/* ── Product info ──────────────────────────────────────── */}
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

      {/* ── Lightbox portal ───────────────────────────────────────── */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          initialIndex={currentIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};
