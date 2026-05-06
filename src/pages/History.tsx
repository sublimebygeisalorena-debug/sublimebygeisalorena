import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import foundersImg from "@/assets/founders.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const History = () => {
  useEffect(() => { document.title = "Nossa História — maison.capilar"; }, []);
  const { data } = useSiteContent("historia", {
    eyebrow: "Nossa história",
    title: "De um laboratório à sua bancada.",
    intro: "Conheça a jornada por trás da maison.capilar.",
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-20 lg:py-28 max-w-4xl">
        <p className="text-xs tracking-luxe uppercase text-accent mb-4">{data.eyebrow}</p>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-10">{data.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl whitespace-pre-line">{data.intro}</p>
      </section>


      <section className="container max-w-5xl pb-24">
        <div className="aspect-[16/9] overflow-hidden mb-16">
          <img src={foundersImg} alt="Fundadores em laboratório" className="w-full h-full object-cover" loading="lazy" width={1280} height={1024} />
        </div>

        <div className="space-y-16">
          <div className="grid md:grid-cols-[180px_1fr] gap-8 items-start">
            <p className="font-display text-3xl text-accent">2024</p>
            <div>
              <h2 className="font-display text-3xl mb-4">O início</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tudo começou em uma bancada de laboratório com uma pergunta simples: por que tratar quimicamente os fios precisa significar agredi-los? A resposta veio na forma de uma progressiva de base ácida — uma tecnologia que alinha respeitando o pH natural do cabelo.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-[180px_1fr] gap-8 items-start">
            <p className="font-display text-3xl text-accent">2025</p>
            <div>
              <h2 className="font-display text-3xl mb-4">A coleção essencial</h2>
              <p className="text-muted-foreground leading-relaxed">
                Expandimos para um sistema completo: shampoo e máscara pH Balance para o cuidado pós-química, leave-in termoprotetor 10 em 1 e o reparador de pontas com blend de 7 óleos. Cinco produtos que se conversam, projetados para um ritual completo.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-[180px_1fr] gap-8 items-start">
            <p className="font-display text-3xl text-accent">Hoje</p>
            <div>
              <h2 className="font-display text-3xl mb-4">Os fundadores</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                À frente da maison.capilar, dois fundadores complementares: uma cosmetóloga com mais de uma década de experiência em desenvolvimento de fórmulas profissionais, e um especialista em performance capilar formado em salões de alto padrão.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Juntos, dividem a mesma obsessão: que cada gesto de cuidado seja seguro, eficiente e prazeroso.
              </p>
            </div>
          </div>
        </div>

        <blockquote className="font-display text-3xl md:text-4xl italic leading-snug mt-24 pt-16 border-t border-border max-w-3xl">
          "Cabelo saudável não é resultado de um produto — é resultado de um ritual."
          <footer className="text-sm not-italic uppercase tracking-luxe text-muted-foreground mt-6 font-sans">— Os fundadores</footer>
        </blockquote>
      </section>
      <Footer />
    </div>
  );
};

export default History;
