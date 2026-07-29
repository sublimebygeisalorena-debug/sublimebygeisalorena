import { useState, useRef } from "react";
import { useProductsManager, LocalProduct } from "@/hooks/useProductsManager";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Sparkles,
  ArrowLeft,
  Check,
  PlusCircle,
  X,
  Package,
  Upload,
  ImagePlus,
  Star,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import { formatBRL } from "@/lib/shopify";
import { toast } from "sonner";

// ─── Multi-Image Uploader ────────────────────────────────────────────────────

interface MultiImageUploaderProps {
  mainImage: string;
  additionalImages: string[];
  onChangeMain: (url: string) => void;
  onChangeAdditional: (urls: string[]) => void;
}

const MultiImageUploader = ({
  mainImage,
  additionalImages,
  onChangeMain,
  onChangeAdditional,
}: MultiImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // All images combined for the gallery view — main first
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  const previewSrc = allImages[previewIndex] || "";

  const uploadFile = async (file: File): Promise<string | null> => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx 10 MB)");
      return null;
    }
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: false });
    if (error) {
      toast.error("Falha no upload");
      return null;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    if (urls.length === 0) { setUploading(false); return; }

    if (!mainImage) {
      // First image becomes main, rest go additional
      onChangeMain(urls[0]);
      if (urls.length > 1) onChangeAdditional([...additionalImages, ...urls.slice(1)]);
    } else {
      onChangeAdditional([...additionalImages, ...urls]);
    }
    toast.success(`${urls.length} foto(s) adicionada(s)`);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const setAsMain = (url: string) => {
    if (url === mainImage) return;
    // Swap: remove from additional, put old main into additional
    const newAdditional = additionalImages.filter((u) => u !== url);
    if (mainImage) newAdditional.unshift(mainImage);
    onChangeMain(url);
    onChangeAdditional(newAdditional);
    setPreviewIndex(0);
    toast.success("Foto definida como principal");
  };

  const removeImage = (url: string) => {
    if (url === mainImage) {
      const next = additionalImages[0] || "";
      onChangeMain(next);
      onChangeAdditional(additionalImages.slice(1));
    } else {
      onChangeAdditional(additionalImages.filter((u) => u !== url));
    }
    setPreviewIndex(0);
  };

  const moveImage = (url: string, direction: "left" | "right") => {
    const all = [...additionalImages];
    const idx = all.indexOf(url);
    if (idx === -1) return;
    const target = direction === "left" ? idx - 1 : idx + 1;
    if (target < 0 || target >= all.length) return;
    [all[idx], all[target]] = [all[target], all[idx]];
    onChangeAdditional(all);
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs uppercase tracking-luxe font-medium flex items-center gap-2">
        <Images className="w-3.5 h-3.5" />
        Fotos do Produto
        <span className="text-muted-foreground font-normal normal-case tracking-normal">
          ({allImages.length} foto{allImages.length !== 1 ? "s" : ""})
        </span>
      </Label>

      {/* ── Large preview ─────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] bg-muted border border-border overflow-hidden group">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Package className="w-10 h-10 opacity-30" />
            <p className="text-xs">Nenhuma foto ainda</p>
          </div>
        )}

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setPreviewIndex((p) => (p - 1 + allImages.length) % allImages.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 border border-border p-1.5 opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewIndex((p) => (p + 1) % allImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 border border-border p-1.5 opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === previewIndex ? "w-5 bg-accent" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Main badge */}
        {previewSrc && previewIndex === 0 && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[9px] uppercase tracking-luxe px-2 py-0.5 flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" /> Principal
          </span>
        )}
      </div>

      {/* ── Thumbnail strip ────────────────────────────────────────── */}
      {allImages.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {allImages.map((url, i) => {
            const isMain = i === 0;
            const isAdditional = !isMain;
            const additionalIdx = i - 1;
            return (
              <div
                key={url + i}
                className={`relative group/thumb w-16 h-16 border flex-shrink-0 overflow-hidden cursor-pointer transition-all ${
                  i === previewIndex
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-border opacity-75 hover:opacity-100"
                }`}
                onClick={() => setPreviewIndex(i)}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover/thumb:opacity-100 transition flex items-center justify-center gap-0.5">
                  {!isMain && (
                    <button
                      type="button"
                      title="Definir como principal"
                      onClick={(e) => { e.stopPropagation(); setAsMain(url); }}
                      className="p-1 hover:text-accent"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                  )}
                  {isAdditional && additionalIdx > 0 && (
                    <button
                      type="button"
                      title="Mover para esquerda"
                      onClick={(e) => { e.stopPropagation(); moveImage(url, "left"); }}
                      className="p-1 hover:text-foreground"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  )}
                  {isAdditional && additionalIdx < additionalImages.length - 1 && (
                    <button
                      type="button"
                      title="Mover para direita"
                      onClick={(e) => { e.stopPropagation(); moveImage(url, "right"); }}
                      className="p-1 hover:text-foreground"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Remover foto"
                    onClick={(e) => { e.stopPropagation(); removeImage(url); }}
                    className="p-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {isMain && (
                  <span className="absolute bottom-0 inset-x-0 bg-accent/90 text-[8px] text-accent-foreground text-center py-0.5 uppercase tracking-luxe">
                    Principal
                  </span>
                )}
              </div>
            );
          })}

          {/* Add more button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-16 h-16 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition gap-1"
            title="Adicionar mais fotos"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-4 h-4" />
                <span className="text-[8px] uppercase tracking-luxe">Mais</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Drop zone / upload button ──────────────────────────────── */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border border-dashed border-border p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent transition cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
            <p className="text-xs">Enviando fotos…</p>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <p className="text-xs text-center">
              <span className="font-medium text-foreground">Clique ou arraste</span> para adicionar fotos
            </p>
            <p className="text-[10px]">PNG, JPG, WebP — máx 10 MB cada</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* ── URL manual ────────────────────────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-luxe font-medium text-muted-foreground">
          Ou cole a URL da foto principal:
        </Label>
        <Input
          value={mainImage}
          onChange={(e) => onChangeMain(e.target.value)}
          placeholder="/products/shampoo.png ou https://..."
          className="rounded-none text-xs h-9 font-mono"
        />
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const AdminProducts = () => {
  const { products, loading, saving, saveProducts } = useProductsManager();
  const [editingProduct, setEditingProduct] = useState<LocalProduct | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  const [form, setForm] = useState<LocalProduct>({
    id: "",
    handle: "",
    title: "",
    description: "",
    price: "0.00",
    productType: "Home Care",
    imageUrl: "",
    additionalImages: [],
    benefits: [],
    howToUse: [],
    composition: "",
    featured: false,
    available: true,
  });

  const [newBenefit, setNewBenefit] = useState("");
  const [newStep, setNewStep] = useState("");

  const handleCreateNew = () => {
    const id = `prod-${Date.now()}`;
    setForm({
      id,
      handle: "",
      title: "",
      description: "",
      price: "119.90",
      productType: "Home Care",
      imageUrl: "",
      additionalImages: [],
      benefits: [],
      howToUse: [],
      composition: "",
      featured: false,
      available: true,
    });
    setIsNew(true);
    setEditingProduct({} as LocalProduct);
  };

  const handleEdit = (prod: LocalProduct) => {
    setForm({
      ...prod,
      additionalImages: prod.additionalImages || [],
      benefits: prod.benefits || [],
      howToUse: prod.howToUse || [],
    });
    setIsNew(false);
    setEditingProduct(prod);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este anúncio de produto?")) return;
    const updated = products.filter((p) => p.id !== id);
    const success = await saveProducts(updated);
    if (success && editingProduct?.id === id) setEditingProduct(null);
  };

  const handleTitleChange = (val: string) => {
    setForm((prev) => {
      const handle = isNew
        ? val
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : prev.handle;
      return { ...prev, title: val, handle };
    });
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("O título do produto é obrigatório"); return; }
    if (!form.handle.trim()) { toast.error("O identificador (handle) é obrigatório"); return; }

    const updatedList: LocalProduct[] = isNew
      ? [form, ...products]
      : products.map((p) => (p.id === form.id ? form : p));

    const success = await saveProducts(updatedList);
    if (success) setEditingProduct(null);
  };

  const addBenefitItem = () => {
    if (!newBenefit.trim()) return;
    setForm((prev) => ({ ...prev, benefits: [...prev.benefits, newBenefit.trim()] }));
    setNewBenefit("");
  };

  const removeBenefitItem = (index: number) =>
    setForm((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));

  const addStepItem = () => {
    if (!newStep.trim()) return;
    setForm((prev) => ({ ...prev, howToUse: [...prev.howToUse, newStep.trim()] }));
    setNewStep("");
  };

  const removeStepItem = (index: number) =>
    setForm((prev) => ({ ...prev, howToUse: prev.howToUse.filter((_, i) => i !== index) }));

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent mb-3" />
        <p className="text-sm text-muted-foreground">Carregando anúncios da loja…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl">Gerenciar Anúncios & Produtos</h2>
          <p className="text-sm text-muted-foreground">
            Altere fotos, títulos, preços, descrições, modo de uso e composições exibidos no site.
          </p>
        </div>
        {!editingProduct && (
          <Button
            onClick={handleCreateNew}
            className="rounded-none h-11 px-6 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Anúncio
          </Button>
        )}
      </div>

      {/* ── Form or List ────────────────────────────────────────────── */}
      {editingProduct ? (
        <div className="bg-card border border-border p-6 md:p-8 max-w-5xl space-y-8 animate-in fade-in duration-300">
          {/* Form header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <button
              onClick={() => setEditingProduct(null)}
              className="inline-flex items-center text-xs uppercase tracking-luxe text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar à lista de anúncios
            </button>
            <h3 className="font-display text-xl">
              {isNew ? "Criar Novo Anúncio" : `Editando: ${form.title}`}
            </h3>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-10">

            {/* ── Section 1: Photos + Basic Info ──────────────────── */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Multi-image uploader */}
              <MultiImageUploader
                mainImage={form.imageUrl}
                additionalImages={form.additionalImages || []}
                onChangeMain={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                onChangeAdditional={(urls) =>
                  setForm((prev) => ({ ...prev, additionalImages: urls }))
                }
              />

              {/* Basic details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-luxe font-medium">Título do Anúncio</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="ex: Leave-In Termoprotetor 10x1 Infinit Repair"
                    className="rounded-none h-11"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-luxe font-medium">Preço (R$)</Label>
                    <Input
                      value={form.price}
                      onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="129.90"
                      className="rounded-none h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-luxe font-medium">Categoria / Linha</Label>
                    <Input
                      value={form.productType}
                      onChange={(e) => setForm((prev) => ({ ...prev, productType: e.target.value }))}
                      placeholder="Home Care / Uso Profissional"
                      className="rounded-none h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-luxe font-medium">Identificador (Handle / URL)</Label>
                  <Input
                    value={form.handle}
                    onChange={(e) => setForm((prev) => ({ ...prev, handle: e.target.value }))}
                    placeholder="leave-in-termoprotetor-10-em-1"
                    className="rounded-none h-10 font-mono text-xs bg-muted/40"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    URL no site: <span className="font-mono">/product/{form.handle || "…"}</span>
                  </p>
                </div>

                {/* Fotos adicionais — total count badge */}
                {(form.additionalImages?.length ?? 0) > 0 && (
                  <div className="bg-accent/5 border border-accent/20 p-3 flex items-center gap-2">
                    <Images className="w-4 h-4 text-accent" />
                    <p className="text-xs text-accent">
                      <span className="font-semibold">{(form.additionalImages?.length ?? 0) + 1}</span> fotos no total —
                      1 principal + {form.additionalImages?.length} adicional(is)
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="featured"
                      checked={form.featured || false}
                      onCheckedChange={(checked) => setForm((prev) => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="featured" className="text-xs uppercase tracking-luxe cursor-pointer">
                      Em Destaque (Home Page)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="available"
                      checked={form.available !== false}
                      onCheckedChange={(checked) => setForm((prev) => ({ ...prev, available: checked }))}
                    />
                    <Label htmlFor="available" className="text-xs uppercase tracking-luxe cursor-pointer">
                      Disponível para Venda
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: Description & Content ────────────────── */}
            <div className="space-y-6 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-luxe font-medium">Descrição do Anúncio</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o produto, benefícios principais e ativos..."
                  rows={4}
                  className="rounded-none"
                />
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-luxe font-medium">Benefícios / Diferenciais</Label>
                <div className="space-y-2">
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 bg-secondary/30 p-2.5 border border-border text-xs">
                      <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span className="flex-1">{b}</span>
                      <button type="button" onClick={() => removeBenefitItem(i)} className="text-muted-foreground hover:text-destructive p-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Adicionar novo benefício (ex: Proteção térmica até 230°C)"
                      className="rounded-none h-10 text-xs"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBenefitItem(); } }}
                    />
                    <Button type="button" onClick={addBenefitItem} variant="outline" className="rounded-none h-10 px-4 text-xs uppercase tracking-luxe">
                      <PlusCircle className="w-3.5 h-3.5 mr-1" /> Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              {/* How to use */}
              <div className="space-y-3 pt-2">
                <Label className="text-xs uppercase tracking-luxe font-medium">Modo de Uso (Passo a Passo)</Label>
                <div className="space-y-2">
                  {form.howToUse.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 bg-secondary/30 p-2.5 border border-border text-xs">
                      <span className="font-display text-accent font-bold">{i + 1}.</span>
                      <span className="flex-1">{step}</span>
                      <button type="button" onClick={() => removeStepItem(i)} className="text-muted-foreground hover:text-destructive p-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      placeholder="Adicionar passo (ex: Aplique nos fios úmidos...)"
                      className="rounded-none h-10 text-xs"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStepItem(); } }}
                    />
                    <Button type="button" onClick={addStepItem} variant="outline" className="rounded-none h-10 px-4 text-xs uppercase tracking-luxe">
                      <PlusCircle className="w-3.5 h-3.5 mr-1" /> Passo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Composition */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs uppercase tracking-luxe font-medium">Composição Químico-Cosmética</Label>
                <Textarea
                  value={form.composition}
                  onChange={(e) => setForm((prev) => ({ ...prev, composition: e.target.value }))}
                  placeholder="ex: Ácido Hialurônico, Elastina, Silsoft AX, Ceramidas, etc."
                  rows={3}
                  className="rounded-none"
                />
              </div>
            </div>

            {/* ── Action Buttons ───────────────────────────────────── */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-none h-12 px-8 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando…</> : "Salvar Anúncio"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingProduct(null)}
                className="rounded-none h-12 px-6 text-xs uppercase tracking-luxe hover:bg-secondary"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>

      ) : (
        /* ── Product Catalog Listing ──────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const totalPhotos = 1 + (p.additionalImages?.length ?? 0);
            return (
              <div
                key={p.id}
                className="bg-card border border-border overflow-hidden flex flex-col justify-between group hover:border-accent/40 transition-colors"
              >
                <div>
                  {/* Image with multi-photo indicator */}
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                        <Package className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    )}

                    {/* Badges top-left */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      {p.featured && (
                        <span className="bg-accent text-accent-foreground text-[10px] uppercase tracking-luxe px-2 py-0.5 font-medium flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" /> Destaque
                        </span>
                      )}
                      {p.productType && (
                        <span className="bg-background/90 text-foreground border border-border text-[10px] uppercase tracking-luxe px-2 py-0.5 font-medium">
                          {p.productType}
                        </span>
                      )}
                    </div>

                    {/* Photo count badge top-right */}
                    {totalPhotos > 1 && (
                      <div className="absolute top-3 right-3 bg-background/90 border border-border text-[10px] uppercase tracking-luxe px-2 py-0.5 flex items-center gap-1">
                        <Images className="w-3 h-3" />
                        {totalPhotos} fotos
                      </div>
                    )}

                    {/* Unavailable overlay */}
                    {p.available === false && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-luxe text-muted-foreground border border-border bg-background px-3 py-1">
                          Indisponível
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-display text-lg leading-tight line-clamp-2">{p.title}</h3>
                    <p className="text-sm font-semibold text-foreground">{formatBRL(p.price)}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-4 gap-2">
                  <Button
                    onClick={() => handleEdit(p)}
                    variant="outline"
                    size="sm"
                    className="rounded-none text-xs uppercase tracking-luxe flex-1 h-9"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(p.id)}
                    variant="ghost"
                    size="sm"
                    className="rounded-none text-xs uppercase tracking-luxe text-muted-foreground hover:text-destructive h-9"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-border p-8">
              <Package className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground text-sm mb-4">Nenhum anúncio de produto cadastrado.</p>
              <Button onClick={handleCreateNew} className="rounded-none text-xs uppercase tracking-luxe">
                Cadastrar Primeiro Produto
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
