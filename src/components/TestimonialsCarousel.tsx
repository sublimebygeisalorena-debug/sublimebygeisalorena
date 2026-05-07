import { useSiteContent } from "@/hooks/useSiteContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

export function TestimonialsCarousel() {
  const { data } = useSiteContent("testimonials", {
    title: "O que dizem sobre nós",
    t1_name: "", t1_role: "", t1_text: "", t1_image: "",
    t2_name: "", t2_role: "", t2_text: "", t2_image: "",
    t3_name: "", t3_role: "", t3_text: "", t3_image: "",
    t4_name: "", t4_role: "", t4_text: "", t4_image: "",
    t5_name: "", t5_role: "", t5_text: "", t5_image: "",
    t6_name: "", t6_role: "", t6_text: "", t6_image: "",
  });

  const testimonials = [1, 2, 3, 4, 5, 6]
    .map((i) => ({
      name: data[`t${i}_name` as keyof typeof data] as string,
      role: data[`t${i}_role` as keyof typeof data] as string,
      text: data[`t${i}_text` as keyof typeof data] as string,
      image: data[`t${i}_image` as keyof typeof data] as string,
    }))
    .filter((t) => t.name && t.text);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-background py-24">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-xs tracking-luxe uppercase text-accent mb-4">Experiências</p>
          <h2 className="font-display text-4xl md:text-5xl">{data.title}</h2>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-12">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={i}>
                  <div className="flex flex-col items-center text-center space-y-8 py-10">
                    <Quote className="w-12 h-12 text-accent/20" strokeWidth={1} />
                    <p className="text-xl md:text-2xl font-display leading-relaxed italic max-w-2xl px-4">
                      "{t.text}"
                    </p>
                    <div className="flex flex-col items-center">
                      {t.image && (
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border border-border">
                          <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h4 className="font-display text-lg tracking-wide">{t.name}</h4>
                      <p className="text-xs uppercase tracking-luxe text-muted-foreground mt-1">{t.role}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
