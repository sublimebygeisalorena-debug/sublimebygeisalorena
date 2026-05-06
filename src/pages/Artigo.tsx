import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  slug: string; title: string; excerpt: string | null;
  category: string | null; reading_time: string | null; cover_url: string | null;
  content: string | null; created_at: string;
}

const Artigo = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
      setArticle(data as Article | null);
      if (data) document.title = `${data.title} — Sublime by Geisa Lorena`;
      const { data: rel } = await supabase.from("articles").select("*").neq("slug", slug).eq("published", true).limit(2);
      setRelated((rel ?? []) as Article[]);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Carregando…</div>;

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

  const paragraphs = (article.content ?? "").split(/\n\n+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="container py-16 max-w-3xl">
        <Link to="/cuidados" className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground hover:text-accent mb-8">
          <ArrowLeft className="w-3 h-3" /> Cuidados com Cabelo
        </Link>
        <div className="flex items-center gap-3 text-xs uppercase tracking-luxe text-muted-foreground mb-4">
          {article.category && <><span className="text-accent">{article.category}</span><span>·</span></>}
          {article.reading_time && <><span>{article.reading_time}</span><span>·</span></>}
          <span>{new Date(article.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-8">{article.title}</h1>
        {article.cover_url && (
          <div className="aspect-[16/9] overflow-hidden mb-12 bg-muted">
            <img src={article.cover_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
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
                    {a.cover_url && <img src={a.cover_url} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
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
