import { useEffect, useState, useRef, useCallback } from "react";
import { useBannersManager } from "@/hooks/useBannersManager";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImgFallback from "/hero-new.jpg";

const INTERVAL_MS = 8000; // Auto switch every 8 seconds

export const HomeHeroCarousel = () => {
  const { activeBanners, loading } = useBannersManager();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const bannersToRender = activeBanners.length > 0 ? activeBanners : [
    {
      id: "fallback",
      imageUrl: heroImgFallback,
      eyebrow: "Coleção Essencial",
      title: "A ciência do cuidado capilar em suas mãos.",
      subtitle: "Fórmulas profissionais com pH balanceado, óleos nobres e proteção térmica.",
      buttonText: "Ver produtos",
      buttonUrl: "#produtos",
    }
  ];

  const total = bannersToRender.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Setup auto-switch timer (8 seconds)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, nextSlide]);

  if (loading) {
    return (
      <section className="relative bg-muted/20 min-h-[500px] flex items-center justify-center">
        <div className="animate-pulse text-xs tracking-luxe uppercase text-muted-foreground">
          Carregando destaques…
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden group bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center">
        {bannersToRender.map((banner, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="container grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
                {/* TEXT CONTENT */}
                <div className="space-y-6 lg:pr-10 z-20">
                  {banner.eyebrow && (
                    <p className="text-xs tracking-luxe uppercase text-accent font-semibold">
                      {banner.eyebrow}
                    </p>
                  )}
                  {banner.title && (
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
                      {banner.title}
                    </h1>
                  )}
                  {banner.subtitle && (
                    <p className="text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed whitespace-pre-line">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 pt-2">
                    {banner.buttonText && (
                      <Button
                        asChild
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 px-8 text-xs uppercase tracking-luxe"
                      >
                        <a href={banner.buttonUrl || "#produtos"}>{banner.buttonText}</a>
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="ghost"
                      className="rounded-none h-12 px-6 text-xs uppercase tracking-luxe hover:text-accent"
                    >
                      <a href="#historia">Nossa história</a>
                    </Button>
                  </div>
                </div>

                {/* BANNER IMAGE */}
                <div className="relative z-10">
                  <div className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-sm bg-muted/40 shadow-soft">
                    <img
                      src={banner.imageUrl || heroImgFallback}
                      alt={banner.title || "Sublime Banner"}
                      className="w-full h-full object-scale-down sm:object-cover transition-transform duration-1000 ease-out scale-100 hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute -bottom-6 -left-6 bg-background border border-border p-6 max-w-[220px] hidden md:block shadow-soft z-20">
                      <p className="font-display text-3xl">7</p>
                      <p className="text-xs uppercase tracking-luxe text-muted-foreground mt-1">
                        óleos nobres no blend reparador
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NAVIGATION CONTROLS & INDICATORS (If more than 1 banner) */}
      {total > 1 && (
        <>
          {/* PREVIOUS BUTTON */}
          <button
            onClick={prevSlide}
            aria-label="Banner anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-background/80 hover:bg-background border border-border flex items-center justify-center text-foreground transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* NEXT BUTTON */}
          <button
            onClick={nextSlide}
            aria-label="Próximo banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-background/80 hover:bg-background border border-border flex items-center justify-center text-foreground transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* INDICATOR DOTS & AUTOPLAY PROGRESS BAR */}
          <div className="absolute bottom-6 inset-x-0 z-30 flex flex-col items-center gap-2">
            {/* Auto-rotation Progress Indicator */}
            <div className="w-32 h-0.5 bg-border/60 overflow-hidden relative">
              <div
                key={currentIndex}
                className="h-full bg-accent transition-all ease-linear"
                style={{
                  animation: !isPaused ? `bannerProgress ${INTERVAL_MS}ms linear infinite` : "none",
                  width: !isPaused ? "100%" : "0%",
                }}
              />
            </div>

            {/* Dots */}
            <div className="flex items-center gap-3">
              {bannersToRender.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Ir para banner ${idx + 1}`}
                  className={`h-2 transition-all rounded-full ${
                    idx === currentIndex
                      ? "w-8 bg-accent"
                      : "w-2 bg-foreground/30 hover:bg-foreground/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Progress Bar Keyframe Animation */}
      <style>{`
        @keyframes bannerProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};
