import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { articles } from "@/data/articles";
import { ArrowRight } from "lucide-react";

const Cuidados = () => {
  useEffect(() => {
    document.title = "Cuidados com o cabelo — maison.capilar";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container py-20">
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-luxe uppercase text-accent mb-4">Diário capilar</p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
            Cuidados com o cabelo
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Artigos, rituais e ciência por trás dos fios saudáveis. Conhecimento para você cuidar melhor do seu cabelo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
          {articles.map((a) => (
            <Link to={`/cuidados/${a.slug}`} key={a.slug} className="group block">
              <div className="aspect-[4/3] overflow-hidden mb-6 bg-muted">
                <img
                  src={a.cover}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-luxe text-muted-foreground mb-3">
                <span className="text-accent">{a.category}</span>
                <span>·</span>
                <span>{a.readingTime}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl mb-3 group-hover:text-accent transition-colors">
                {a.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{a.excerpt}</p>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe">
                Ler artigo <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cuidados;
