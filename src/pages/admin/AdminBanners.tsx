import { useState } from "react";
import { useBannersManager, HomeBanner } from "@/hooks/useBannersManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/ImageUploader";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const AdminBanners = () => {
  const { banners, loading, saving, saveBanners } = useBannersManager();
  const [editingBanner, setEditingBanner] = useState<HomeBanner | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  const [form, setForm] = useState<HomeBanner>({
    id: "",
    imageUrl: "",
    eyebrow: "",
    title: "",
    subtitle: "",
    buttonText: "Ver produtos",
    buttonUrl: "#produtos",
    active: true,
  });

  const handleCreateNew = () => {
    const id = `banner-${Date.now()}`;
    setForm({
      id,
      imageUrl: "/hero-new.jpg",
      eyebrow: "Coleção Essencial",
      title: "",
      subtitle: "",
      buttonText: "Ver produtos",
      buttonUrl: "#produtos",
      active: true,
    });
    setIsNew(true);
    setEditingBanner({} as HomeBanner);
  };

  const handleEdit = (banner: HomeBanner) => {
    setForm({ ...banner });
    setIsNew(false);
    setEditingBanner(banner);
  };

  const handleDelete = async (id: string) => {
    if (banners.length <= 1) {
      toast.error("É necessário ter pelo menos 1 banner cadastrado.");
      return;
    }
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;
    const updated = banners.filter((b) => b.id !== id);
    const success = await saveBanners(updated);
    if (success && editingBanner?.id === id) {
      setEditingBanner(null);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const updated = [...banners];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    await saveBanners(updated);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl.trim()) {
      toast.error("A imagem do banner é obrigatória.");
      return;
    }

    let updatedList: HomeBanner[];
    if (isNew) {
      updatedList = [form, ...banners];
    } else {
      updatedList = banners.map((b) => (b.id === form.id ? form : b));
    }

    const success = await saveBanners(updatedList);
    if (success) {
      setEditingBanner(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent mb-3" />
        <p className="text-sm text-muted-foreground">Carregando banners da página inicial…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl">Gerenciar Banners do Carrossel</h2>
          <p className="text-sm text-muted-foreground">
            Insira, edite, ordene e remova as imagens do banner da página de início (rotação automática de 8s).
          </p>
        </div>
        {!editingBanner && (
          <Button
            onClick={handleCreateNew}
            className="rounded-none h-11 px-6 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" /> Inserir Novo Banner
          </Button>
        )}
      </div>

      {/* FORM OR LIST */}
      {editingBanner ? (
        <div className="bg-card border border-border p-6 md:p-8 max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <button
              onClick={() => setEditingBanner(null)}
              className="inline-flex items-center text-xs uppercase tracking-luxe text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar aos banners
            </button>
            <h3 className="font-display text-xl">
              {isNew ? "Inserir Novo Banner" : "Editando Banner"}
            </h3>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* IMAGE UPLOAD */}
              <div className="space-y-4">
                <Label className="text-xs uppercase tracking-luxe font-medium">Imagem do Banner</Label>
                <ImageUploader
                  value={form.imageUrl}
                  onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                  label="Upload da Imagem do Banner"
                />

                {/* QUICK PRESETS */}
                <div className="pt-2">
                  <p className="text-[11px] uppercase tracking-luxe text-muted-foreground mb-2">
                    Imagens do Projeto:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "Hero Novo", url: "/hero-new.jpg" },
                      { name: "Leave-in", url: "/products/leave-in-termoprotetor.png" },
                      { name: "Shampoo", url: "/products/shampoo-pos-quimica.png" },
                      { name: "Reestruturador", url: "/products/reestruturador-infinit-repair.png" },
                    ].map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, imageUrl: img.url }))}
                        className={`aspect-square border overflow-hidden relative group transition ${
                          form.imageUrl === img.url ? "border-accent ring-2 ring-accent/30" : "border-border opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-background/90 text-[9px] text-center py-0.5 truncate px-1">
                          {img.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-xs uppercase tracking-luxe font-medium">URL Direta da Imagem</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="ex: /hero-new.jpg ou https://..."
                    className="rounded-none text-xs"
                    required
                  />
                </div>
              </div>

              {/* TEXT CONTENT & LINK */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-luxe font-medium">Etiqueta Superior (Eyebrow)</Label>
                  <Input
                    value={form.eyebrow || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, eyebrow: e.target.value }))}
                    placeholder="ex: Coleção Essencial / Linha Infinit Repair"
                    className="rounded-none h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-luxe font-medium">Título do Banner</Label>
                  <Input
                    value={form.title || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="ex: A ciência do cuidado capilar em suas mãos."
                    className="rounded-none h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-luxe font-medium">Subtítulo Explicativo</Label>
                  <Textarea
                    value={form.subtitle || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="ex: Fórmulas profissionais com pH balanceado..."
                    rows={3}
                    className="rounded-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-luxe font-medium">Texto do Botão</Label>
                    <Input
                      value={form.buttonText || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, buttonText: e.target.value }))}
                      placeholder="Ver produtos"
                      className="rounded-none h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-luxe font-medium">Link do Botão (URL)</Label>
                    <Input
                      value={form.buttonUrl || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, buttonUrl: e.target.value }))}
                      placeholder="#produtos ou /loja"
                      className="rounded-none h-11"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <Switch
                    id="active-banner"
                    checked={form.active !== false}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active-banner" className="text-xs uppercase tracking-luxe cursor-pointer">
                    Banner Ativo no Carrossel da Home
                  </Label>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-none h-12 px-8 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando…
                  </>
                ) : (
                  "Salvar Banner"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingBanner(null)}
                className="rounded-none h-12 px-6 text-xs uppercase tracking-luxe hover:bg-secondary"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* BANNERS LISTING */
        <div className="space-y-4">
          {banners.map((b, idx) => (
            <div
              key={b.id}
              className={`bg-card border p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition ${
                b.active !== false ? "border-border" : "border-border/40 bg-secondary/20 opacity-75"
              }`}
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-24 h-24 sm:w-32 sm:h-20 bg-muted overflow-hidden relative flex-shrink-0 border border-border">
                  {b.imageUrl ? (
                    <img src={b.imageUrl} alt={b.title || "Banner"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">#{idx + 1}</span>
                    {b.active !== false ? (
                      <span className="bg-emerald-500/10 text-emerald-600 text-[10px] uppercase tracking-luxe px-2 py-0.5 font-medium flex items-center border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Ativo na Home
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground text-[10px] uppercase tracking-luxe px-2 py-0.5 font-medium">
                        Inativo
                      </span>
                    )}
                    {b.eyebrow && (
                      <span className="text-xs tracking-luxe uppercase text-accent font-medium">
                        {b.eyebrow}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-tight">
                    {b.title || "Banner Sem Título"}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                    {b.subtitle || "Sem descrição"}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Botão: "{b.buttonText || "Ver produtos"}" → {b.buttonUrl || "#produtos"}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border">
                <div className="flex flex-col gap-1 mr-2">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0 || saving}
                    className="p-1 border border-border hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none text-xs"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === banners.length - 1 || saving}
                    className="p-1 border border-border hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none text-xs"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button
                  onClick={() => handleEdit(b)}
                  variant="outline"
                  size="sm"
                  className="rounded-none text-xs uppercase tracking-luxe h-9 px-4"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1.5" /> Editar
                </Button>

                <Button
                  onClick={() => handleDelete(b.id)}
                  variant="ghost"
                  size="sm"
                  className="rounded-none text-xs uppercase tracking-luxe text-muted-foreground hover:text-destructive h-9 px-3"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
