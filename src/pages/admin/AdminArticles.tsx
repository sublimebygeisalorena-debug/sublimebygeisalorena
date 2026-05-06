import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ImageUploader";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

interface Article {
  id: string; slug: string; title: string; excerpt: string | null;
  category: string | null; reading_time: string | null; cover_url: string | null;
  content: string | null; published: boolean;
}

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const AdminArticles = () => {
  const [list, setList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    setList((data ?? []) as Article[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Excluir este artigo?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir"); else { toast.success("Artigo excluído"); load(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl">Artigos</h2>
        <Button asChild className="rounded-none h-10 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/admin/artigos/novo"><Plus className="w-3 h-3 mr-2" />Novo artigo</Link>
        </Button>
      </div>
      {loading ? <p className="text-muted-foreground text-sm">Carregando…</p> : list.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum artigo ainda.</p>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a.id} className="border border-border p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-muted overflow-hidden flex-shrink-0">
                {a.cover_url && <img src={a.cover_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg truncate">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.category} · /{a.slug} {!a.published && "· (rascunho)"}</p>
              </div>
              <Button asChild variant="ghost" size="icon"><Link to={`/admin/artigos/${a.id}`}><Pencil className="w-4 h-4" /></Link></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(a.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminArticleEditor = () => {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const [a, setA] = useState<Partial<Article>>({ title: "", slug: "", excerpt: "", category: "", reading_time: "", cover_url: "", content: "", published: true });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
      if (data) setA(data as Article);
      setLoading(false);
    })();
  }, [id, isNew]);

  const set = <K extends keyof Article>(k: K, v: Article[K]) => setA((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    if (!a.title || !a.slug) { toast.error("Título e slug são obrigatórios"); return; }
    setSaving(true);
    const payload = {
      slug: a.slug!, title: a.title!, excerpt: a.excerpt ?? null,
      category: a.category ?? null, reading_time: a.reading_time ?? null,
      cover_url: a.cover_url ?? null, content: a.content ?? null,
      published: a.published ?? true,
    };
    const { error } = isNew
      ? await supabase.from("articles").insert(payload)
      : await supabase.from("articles").update(payload).eq("id", id!);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Artigo salvo");
    navigate("/admin/artigos");
  };

  if (loading) return <p className="text-muted-foreground text-sm">Carregando…</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/admin/artigos" className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground hover:text-accent">
        <ArrowLeft className="w-3 h-3" /> Artigos
      </Link>
      <h2 className="font-display text-2xl">{isNew ? "Novo artigo" : "Editar artigo"}</h2>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-luxe">Título</Label>
        <Input value={a.title ?? ""} onChange={(e) => { set("title", e.target.value); if (isNew && !a.slug) set("slug", slugify(e.target.value)); }} className="rounded-none h-11" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-luxe">Slug (URL)</Label>
          <Input value={a.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} className="rounded-none h-11" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-luxe">Categoria</Label>
          <Input value={a.category ?? ""} onChange={(e) => set("category", e.target.value)} className="rounded-none h-11" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-luxe">Tempo de leitura</Label>
          <Input value={a.reading_time ?? ""} onChange={(e) => set("reading_time", e.target.value)} placeholder="5 min" className="rounded-none h-11" />
        </div>
        <div className="space-y-2 flex items-end">
          <label className="flex items-center gap-2 text-sm pb-2">
            <input type="checkbox" checked={a.published ?? true} onChange={(e) => set("published", e.target.checked)} />
            Publicado
          </label>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-luxe">Resumo</Label>
        <Textarea value={a.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} rows={2} className="rounded-none" />
      </div>
      <ImageUploader value={a.cover_url ?? ""} onChange={(url) => set("cover_url", url)} label="Imagem de capa" />
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-luxe">Conteúdo (separe parágrafos com linha em branco)</Label>
        <Textarea value={a.content ?? ""} onChange={(e) => set("content", e.target.value)} rows={14} className="rounded-none font-sans" />
      </div>
      <Button onClick={save} disabled={saving} className="rounded-none h-11 px-8 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90">
        {saving ? "Salvando…" : "Salvar artigo"}
      </Button>
    </div>
  );
};
