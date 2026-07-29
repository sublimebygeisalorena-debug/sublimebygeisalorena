import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface LightboxImage {
  url: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

// ─── Lightbox Component ───────────────────────────────────────────────────────
export const Lightbox = ({ images, initialIndex = 0, onClose }: LightboxProps) => {
  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const total = images.length;
  const current = images[currentIdx];

  const next = useCallback(() => {
    setLoaded(false);
    setZoomed(false);
    setCurrentIdx((p) => (p + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setLoaded(false);
    setZoomed(false);
    setCurrentIdx((p) => (p - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    // Focus close button on open
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [next, prev, onClose]);

  // Reset loaded state when image changes
  useEffect(() => {
    setLoaded(false);
    setZoomed(false);
  }, [currentIdx]);

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria de fotos — ${current?.alt ?? "produto"}`}
      className="fixed inset-0 z-[9999] bg-background/97 backdrop-blur-sm flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 flex-shrink-0">
        <p className="text-xs uppercase tracking-luxe text-muted-foreground">
          {current?.alt ?? "Produto"}
        </p>
        <div className="flex items-center gap-4">
          {total > 1 && (
            <span className="font-mono text-xs text-muted-foreground">
              {currentIdx + 1} / {total}
            </span>
          )}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fechar galeria (Esc)"
            className="p-2 border border-border hover:border-foreground hover:bg-secondary transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main image area ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-6 min-h-0">

        {/* Prev button */}
        {total > 1 && (
          <button
            onClick={prev}
            aria-label="Foto anterior (←)"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center border border-border bg-background/80 hover:bg-background hover:border-foreground transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Image */}
        <div className="relative max-w-3xl w-full h-full flex items-center justify-center">
          {/* Skeleton while loading */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full max-h-[70vh] bg-muted animate-pulse" />
            </div>
          )}

          {current && (
            <img
              key={current.url}
              src={current.url}
              alt={current.alt}
              onLoad={() => setLoaded(true)}
              onClick={() => setZoomed((z) => !z)}
              className={`
                max-h-[70vh] max-w-full object-contain transition-all duration-500 select-none
                ${loaded ? "opacity-100" : "opacity-0"}
                ${zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}
              `}
              draggable={false}
            />
          )}

          {/* Zoom hint */}
          {loaded && !zoomed && (
            <div className="absolute bottom-3 right-3 bg-background/70 border border-border/60 text-[10px] uppercase tracking-luxe px-2 py-1 flex items-center gap-1 text-muted-foreground pointer-events-none">
              <ZoomIn className="w-3 h-3" />
              Ampliar
            </div>
          )}
        </div>

        {/* Next button */}
        {total > 1 && (
          <button
            onClick={next}
            aria-label="Próxima foto (→)"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center border border-border bg-background/80 hover:bg-background hover:border-foreground transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Thumbnail strip ───────────────────────────────────────── */}
      {total > 1 && (
        <div
          className="flex-shrink-0 border-t border-border/50 px-6 py-4"
          role="tablist"
          aria-label="Miniaturas das fotos"
        >
          <div className="flex gap-3 justify-center overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                role="tab"
                aria-selected={i === currentIdx}
                aria-label={`Ver foto ${i + 1}`}
                onClick={() => { setCurrentIdx(i); setLoaded(false); setZoomed(false); }}
                className={`
                  flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  ${i === currentIdx
                    ? "border-accent scale-105"
                    : "border-border opacity-60 hover:opacity-100 hover:border-border"}
                `}
              >
                <img
                  src={img.url}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      <p className="text-center text-[10px] text-muted-foreground pb-3 flex-shrink-0">
        Use ← → para navegar · ESC para fechar · Clique na imagem para ampliar
      </p>
    </div>
  );

  return createPortal(content, document.body);
};
