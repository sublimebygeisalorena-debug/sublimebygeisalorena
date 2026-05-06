import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ImageUploader";
import { Loader2 } from "lucide-react";

interface Block {
  id: string;
  label: string;
  fields: { key: string; label: string; type: "text" | "textarea" | "image" }[];
}

const blocks: Block[] = [
  {
    id: "home_hero",
    label: "Início — Hero",
    fields: [
      { key: "eyebrow", label: "Etiqueta superior", type: "text" },
      { key: "title", label: "Título principal", type: "textarea" },
      { key: "subtitle", label: "Subtítulo", type: "textarea" },
      { key: "image_url", label: "Imagem do hero", type: "image" },
    ],
  },
  {
    id: "home_history",
    label: "Início — Bloco história",
    fields: [
      { key: "eyebrow", label: "Etiqueta", type: "text" },
      { key: "title", label: "Título", type: "textarea" },
      { key: "p1", label: "Parágrafo 1", type: "textarea" },
      { key: "p2", label: "Parágrafo 2", type: "textarea" },
      { key: "quote", label: "Frase em destaque", type: "text" },
      { key: "image_url", label: "Imagem", type: "image" },
    ],
  },
  {
    id: "about",
    label: "Página Sobre",
    fields: [
      { key: "eyebrow", label: "Etiqueta", type: "text" },
      { key: "title", label: "Título", type: "textarea" },
      { key: "intro", label: "Introdução", type: "textarea" },
    ],
  },
  {
    id: "historia",
    label: "Página Nossa História",
    fields: [
      { key: "eyebrow", label: "Etiqueta", type: "text" },
      { key: "title", label: "Título", type: "textarea" },
      { key: "intro", label: "Introdução", type: "textarea" },
    ],
  },
  {
    id: "cuidados",
    label: "Página Cuidados com Cabelo",
    fields: [
      { key: "eyebrow", label: "Etiqueta", type: "text" },
      { key: "title", label: "Título", type: "textarea" },
      { key: "intro", label: "Introdução", type: "textarea" },
    ],
  },
  {
    id: "contato",
    label: "Contato e Suporte",
    fields: [
      { key: "email", label: "E-mail de suporte", type: "text" },
      { key: "phone", label: "Telefone / WhatsApp", type: "text" },
      { key: "phone_display", label: "Telefone (formato exibido)", type: "text" },
      { key: "address", label: "Endereço", type: "textarea" },
      { key: "hours", label: "Horário de atendimento", type: "text" },
    ],
  },
];

const AdminContent = () => {
  const [active, setActive] = useState(blocks[0].id);
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const block = blocks.find((b) => b.id === active)!;

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data: row } = await supabase.from("site_content").select("data").eq("id", active).maybeSingle();
      setData((row?.data as Record<string, string>) ?? {});
      setLoading(false);
    })();
  }, [active]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ id: active, data });
    setSaving(false);
    if (error) toast.error("Erro ao salvar"); else toast.success("Conteúdo atualizado");
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-1">
        {blocks.map((b) => (
          <button key={b.id} onClick={() => setActive(b.id)}
            className={`block w-full text-left text-sm px-3 py-2 border-l-2 ${active === b.id ? "border-accent text-accent bg-secondary/40" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {b.label}
          </button>
        ))}
      </aside>
      <div>
        <h2 className="font-display text-2xl mb-6">{block.label}</h2>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <div className="space-y-6 max-w-2xl">
            {block.fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label className="text-xs uppercase tracking-luxe">{f.label}</Label>
                {f.type === "text" && <Input value={data[f.key] ?? ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} className="rounded-none h-11" />}
                {f.type === "textarea" && <Textarea value={data[f.key] ?? ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} rows={4} className="rounded-none" />}
                {f.type === "image" && <ImageUploader value={data[f.key] ?? ""} onChange={(url) => setData({ ...data, [f.key]: url })} label="" />}
              </div>
            ))}
            <Button onClick={save} disabled={saving} className="rounded-none h-11 px-8 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContent;
