import { useEffect, useState, useRef, useCallback } from "react";
import { useBannersManager } from "@/hooks/useBannersManager";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const INTERVAL_MS = 8000; // Auto switch every 8 seconds

export const HomeHeroCarousel = () => {
  const { activeBanners, loading } = useBannersManager();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const bannersToRender =
    activeBanners.length > 0
      ? activeBanners
      : [
          {
            id: "fallback",
            imageUrl: "/banner-hero-1.jpg",
            eyebrow: "Coleção Essencial",
            title: "A ciência do cuidado capilar em suas mãos.",
            subtitle: "Fórmulas profissionais com pH balanceado, óleos nobres e proteção térmica.",
            buttonText: "Ver produtos",
            buttonUrl: "#produtos",
          },
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

  // Auto-switch timer (8 seconds)
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
      <section className="container py-4 sm:py-6 lg:py-8">
        <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7] bg-muted/30 animate-pulse flex items-center justify-center border border-border">
          <span className="text-xs tracking-luxe uppercase text-muted-foreground">
            Carregando banners da loja…
          </span>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full py-2 sm:py-4 lg:py-8 bg-background group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container px-3 sm:px-6 lg:px-8">
        {/* BANNER CONTAINER */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7.5] lg:aspect-[16/6.8] min-h-[260px] sm:min-h-[380px] md:min-h-[480px] lg:min-h-[560px] border border-border bg-card overflow-hidden shadow-soft">
          {bannersToRender.map((banner, index) => {
            const isActive = index === currentIndex;

            return (
              <div
                key={banner.id || index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* BACKGROUND IMAGE - HIGH DEFINITION FIT */}
                <div className="absolute inset-0 w-full h-full bg-muted/40">
                  <img
                    src={banner.imageUrl || "/banner-hero-1.jpg"}
                    alt={banner.title || "Banner Sublime"}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out scale-100 hover:scale-102"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  
                  {/* Gradient Overlay: vertical on mobile, horizontal on md+ */}
                  {(banner.title || banner.eyebrow) && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent md:hidden pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent hidden md:block md:w-3/4 lg:w-3/5 pointer-events-none" />
                    </>
                  )}
                </div>

                {/* OVERLAY TEXT CONTENT */}
                {(banner.title || banner.eyebrow || banner.subtitle || banner.buttonText) && (
                  <div className="relative z-20 p-4 sm:p-8 md:p-14 lg:p-20 max-w-xs sm:max-w-xl lg:max-w-2xl space-y-3 sm:space-y-6 mt-auto md:mt-0">
                    {banner.eyebrow && (
                      <p className="text-[10px] sm:text-xs tracking-luxe uppercase text-accent font-semibold drop-shadow-sm">
                        {banner.eyebrow}
                      </p>
                    )}

                    {banner.title && (
                      <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground tracking-tight drop-shadow-sm">
                        {banner.title}
                      </h1>
                    )}

                    {banner.subtitle && (
                      <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 md:line-clamp-none max-w-lg">
                        {banner.subtitle}
                      </p>
                    )}

                    {banner.buttonText && (
                      <div className="pt-1 sm:pt-4">
                        <Button
                          asChild
                          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-10 sm:h-11 px-5 sm:px-8 text-[10px] sm:text-xs uppercase tracking-luxe shadow-soft"
                        >
                          <a href={banner.buttonUrl || "#produtos"}>{banner.buttonText}</a>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* CONTROLS (IF > 1 BANNER) */}
          {total > 1 && (
            <>
              {/* PREVIOUS BUTTON — always visible on mobile */}
              <button
                onClick={prevSlide}
                aria-label="Banner anterior"
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 bg-background/80 hover:bg-background border border-border flex items-center justify-center text-foreground transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 shadow-soft"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* NEXT BUTTON — always visible on mobile */}
              <button
                onClick={nextSlide}
                aria-label="Próximo banner"
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 bg-background/80 hover:bg-background border border-border flex items-center justify-center text-foreground transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 shadow-soft"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* AUTOPLAY PROGRESS & DOTS */}
              <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-30 flex flex-col items-center gap-2">
                {/* 8-Second Rotation Progress Line */}
                <div className="w-28 sm:w-36 h-0.5 bg-background/40 overflow-hidden relative backdrop-blur">
                  <div
                    key={currentIndex}
                    className="h-full bg-accent transition-all ease-linear"
                    style={{
                      animation: !isPaused ? `bannerProgress ${INTERVAL_MS}ms linear infinite` : "none",
                      width: !isPaused ? "100%" : "0%",
                    }}
                  />
                </div>

                {/* Dot Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {bannersToRender.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Ir para banner ${idx + 1}`}
                      className={`h-1.5 sm:h-2 transition-all rounded-full ${
                        idx === currentIndex
                          ? "w-6 sm:w-8 bg-accent"
                          : "w-1.5 sm:w-2 bg-foreground/30 hover:bg-foreground/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
