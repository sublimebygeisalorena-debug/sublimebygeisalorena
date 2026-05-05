import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Leaf } from "lucide-react";

const About = () => {
  useEffect(() => { document.title = "Sobre — maison.capilar"; }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-20 lg:py-28 max-w-4xl">
        <p className="text-xs tracking-luxe uppercase text-accent mb-4">Sobre a marca</p>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-10">Cosmética capilar com propósito.</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A maison.capilar é uma marca brasileira dedicada a fórmulas profissionais de alta performance — desenvolvidas com obsessão por resultado, segurança e respeito à fibra capilar.
        </p>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="container max-w-5xl">
          <h2 className="font-display text-4xl mb-16 text-center">No que acreditamos</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: ShieldCheck, t: "Segurança em primeiro", d: "Fórmulas com pH balanceado, livres de formol e ingredientes agressivos." },
              { icon: Sparkles, t: "Resultado profissional", d: "Tecnologia desenvolvida para entregar a qualidade de um salão de alto padrão — em casa." },
              { icon: Leaf, t: "Consciência sempre", d: "Cruelty-free, embalagens recicláveis e fornecedores rigorosamente selecionados." },
            ].map((v, i) => (
              <div key={i} className="bg-card border border-border p-8">
                <v.icon className="w-7 h-7 text-accent mb-5" strokeWidth={1.2} />
                <h3 className="font-display text-2xl mb-3">{v.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-24 max-w-3xl text-center">
        <p className="text-xs tracking-luxe uppercase text-accent mb-4">Nossa missão</p>
        <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">Democratizar o tratamento capilar de alta performance.</h2>
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
