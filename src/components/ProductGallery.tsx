import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface GalleryImage {
  url: string;
  altText?: string | null;
}

const INTERVAL = 4000;

export const ProductGallery = ({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const touchStartX = useRef<number | null>(null);

  const hasMultiple = images.length > 1;

  const next = useCallback(
    () => setActive((p) => (p + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setActive((p) => (p - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!hasMultiple || paused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [hasMultiple, paused, next]);

  // Keyboard navigation
  useEffect(() => {
    if (!hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMultiple, next, prev]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted overflow-hidden flex items-center justify-center">
        <span className="font-display text-6xl text-muted-foreground/40">
          {title?.charAt(0)?.toUpperCase() ?? "S"}
        </span>
      </div>
    );
  }

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      setPaused(true);
      if (dx < 0) next(); else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="space-y-3">
      <div
        className="aspect-square bg-muted overflow-hidden relative group cursor-zoom-in"
        onMouseEnter={() => { setPaused(true); setZoom(true); }}
        onMouseLeave={() => { setPaused(false); setZoom(false); }}
        onMouseMove={handleMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, i) => (
          <div
            key={`${img.url}-${i}`}
            className={`absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === active
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-[1.04] z-0"
            }`}
          >
            <img
              src={img.url}
              alt={img.altText || title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{
                transformOrigin: origin,
                transform: i === active && zoom ? "scale(1.18)" : "scale(1)",
                animation:
                  i === active && !zoom
                    ? `galleryKenBurns ${INTERVAL * 2}ms ease-out forwards`
                    : undefined,
              }}
            />
          </div>
        ))}

        {/* Soft vignette */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-background/85 border border-border/60 p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-background transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-background/85 border border-border/60 p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-background transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPaused((p) => !p);
              }}
              aria-label={paused ? "Reproduzir" : "Pausar"}
              className="absolute top-3 right-3 z-20 bg-background/85 border border-border/60 p-1.5 opacity-0 group-hover:opacity-100 transition"
            >
              {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>

            <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-6 bg-accent"
                      : "w-2 bg-background/70 hover:bg-background"
                  }`}
                />
              ))}
            </div>

            {!paused && (
              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-background/25 z-20">
                <div
                  key={active}
                  className="h-full bg-accent origin-left"
                  style={{ animation: `productProgress ${INTERVAL}ms linear forwards` }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-5 gap-1.5 md:gap-2">
          {images.map((img, i) => (
            <button
              key={`thumb-${i}`}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden border transition-all duration-300 ${
                i === active
                  ? "border-foreground opacity-100"
                  : "border-border opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
