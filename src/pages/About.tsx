import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Leaf } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const About = () => {
  useEffect(() => { document.title = "Sobre — Sublime by Geisa Lorena"; }, []);
  const { data } = useSiteContent("about", {
    eyebrow: "Sobre a marca",
    title: "Cosmética capilar com propósito.",
    intro: "A Sublime by Geisa Lorena é uma marca brasileira dedicada a fórmulas profissionais de alta performance.",
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-12 md:py-20 lg:py-28 max-w-4xl">
        <p className="text-xs tracking-luxe uppercase text-accent mb-3 md:mb-4">{data.eyebrow}</p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 md:mb-10">{data.title}</h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl whitespace-pre-line">{data.intro}</p>
      </section>


      <section className="bg-secondary/40 py-14 md:py-20">
        <div className="container max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl mb-10 md:mb-16 text-center">No que acreditamos</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {[
              { icon: ShieldCheck, t: "Segurança em primeiro", d: "Fórmulas com pH balanceado, livres de formol e ingredientes agressivos." },
              { icon: Sparkles, t: "Resultado profissional", d: "Tecnologia desenvolvida para entregar a qualidade de um salão de alto padrão — em casa." },
              { icon: Leaf, t: "Consciência sempre", d: "Cruelty-free, embalagens recicláveis e fornecedores rigorosamente selecionados." },
            ].map((v, i) => (
              <div key={i} className="bg-card border border-border p-6 md:p-8">
                <v.icon className="w-7 h-7 text-accent mb-4 md:mb-5" strokeWidth={1.2} />
                <h3 className="font-display text-xl md:text-2xl mb-2 md:mb-3">{v.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <p className="text-xs tracking-luxe uppercase text-accent mb-3 md:mb-4">Indicação de uso</p>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 leading-tight">Cuidado completo para cabelos quimicamente tratados.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Linha especialmente desenvolvida para fios que passaram por procedimentos químicos e necessitam de hidratação, reconstrução e proteção contínua. Atende todos os tipos de cabelos quimicamente tratados — lisos, crespos, ondulados e cacheados.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-luxe uppercase text-accent mb-4">Objetivo da linha</p>
            <h2 className="font-display text-3xl md:text-4xl mb-6 leading-tight">Restaurar a saúde dos fios após a química.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Promove hidratação profunda, reposição de massa capilar, fortalecimento da fibra, alinhamento, redução de frizz, proteção térmica e manutenção do efeito da química — deixando os cabelos mais resistentes, macios, brilhantes e saudáveis.
            </p>
            <p className="text-xs uppercase tracking-luxe text-accent mt-6">Indicação: utilize a linha completa para melhores resultados.</p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-14 md:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs tracking-luxe uppercase text-accent mb-3 md:mb-4">Modo de uso</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight">O ritual Sublime, passo a passo.</h2>
          </div>
          <div className="space-y-8 md:space-y-10">
            {[
              {
                n: "01",
                t: "Shampoo Pós-Química pH Balance",
                d: "Aplique sobre os cabelos molhados, massageando suavemente o couro cabeludo e os fios até formar espuma. Enxágue completamente. Se necessário, repita a aplicação.",
              },
              {
                n: "02",
                t: "Máscara Pós-Química pH Balance",
                d: "Após lavar, retire o excesso de água com uma toalha. Aplique mecha a mecha, mantendo aproximadamente 2 cm de distância do couro cabeludo. Distribua uniformemente e deixe agir por 5 a 7 minutos. Enxágue completamente.",
              },
              {
                n: "03",
                t: "Condicionador Pós-Química pH Balance",
                d: "Após retirar a máscara, aplique no comprimento e nas pontas. Deixe agir por 3 minutos e enxágue totalmente.",
              },
              {
                n: "04",
                t: "Leave-in Termoprotetor 10 em 1",
                d: "Com os cabelos úmidos, aplique uma pequena quantidade no comprimento e nas pontas, distribuindo uniformemente. Não enxágue. Oferece proteção térmica antes do uso de secador, chapinha ou modeladores. Na ausência do condicionador, pode ser utilizado para finalizar o tratamento, proporcionando hidratação, proteção térmica e controle do frizz.",
              },
              {
                n: "05",
                t: "Reparador de Pontas — Blend 7 Óleos",
                d: "Aplique algumas gotas nas palmas das mãos e distribua sobre o comprimento e as pontas dos cabelos secos ou úmidos. Para melhores resultados, utilize pelo menos duas vezes ao dia — mantém os fios nutridos, protegidos, com brilho intenso e livres de frizz.",
              },
            ].map((s) => (
              <div key={s.n} className="grid grid-cols-[auto_1fr] gap-5 md:gap-8 border-b border-border pb-8 md:pb-10 last:border-0">
                <p className="font-display text-4xl md:text-5xl text-accent">{s.n}</p>
                <div>
                  <h3 className="font-display text-xl md:text-2xl mb-2 md:mb-3">{s.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="container py-16 md:py-24 max-w-3xl text-center">
        <p className="text-xs tracking-luxe uppercase text-accent mb-3 md:mb-4">Nossa missão</p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 leading-tight">Democratizar o tratamento capilar de alta performance.</h2>
        <p className="text-muted-foreground leading-relaxed">
          Acreditamos que cuidar dos cabelos não é luxo — é cuidado essencial. Nossa missão é tornar fórmulas profissionais acessíveis, sem comprometer a qualidade nem a segurança.
        </p>
        <div className="flex justify-center gap-4 mt-10">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 px-8 text-xs uppercase tracking-luxe">
            <Link to="/loja">Ver produtos</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-none h-12 px-6 text-xs uppercase tracking-luxe hover:text-accent">
            <Link to="/historia">Nossa história</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
