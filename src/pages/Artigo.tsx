import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { articles } from "@/data/articles";
import { ArrowLeft } from "lucide-react";

const Artigo = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  const related = articles.filter((a) => a.slug !== slug).slice(0, 2);

  useEffect(() => {
    if (article) document.title = `${article.title} — maison.capilar`;
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 text-center">
          <h1 className="font-display text-3xl mb-4">Artigo não encontrado</h1>
          <Link to="/cuidados" className="text-accent text-xs uppercase tracking-luxe">Voltar para Cuidados com Cabelo</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="container py-16 max-w-3xl">
        <Link to="/cuidados" className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground hover:text-accent mb-8">
          <ArrowLeft className="w-3 h-3" /> Cuidados com Cabelo
        </Link>

        <div className="flex items-center gap-3 text-xs uppercase tracking-luxe text-muted-foreground mb-4">
          <span className="text-accent">{article.category}</span>
          <span>·</span>
          <span>{article.readingTime}</span>
          <span>·</span>
          <span>{article.date}</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-8">{article.title}</h1>

        <div className="aspect-[16/9] overflow-hidden mb-12 bg-muted">
          <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
          {article.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-secondary/40 py-20 mt-20">
          <div className="container max-w-5xl">
            <h2 className="font-display text-3xl mb-10">Continue lendo</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {related.map((a) => (
                <Link key={a.slug} to={`/cuidados/${a.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden mb-4 bg-muted">
                    <img src={a.cover} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <p className="text-xs uppercase tracking-luxe text-accent mb-2">{a.category}</p>
                  <h3 className="font-display text-xl group-hover:text-accent transition-colors">{a.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Artigo;
