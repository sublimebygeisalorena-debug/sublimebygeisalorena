import { useState } from "react";
import { useProductsManager, LocalProduct } from "@/hooks/useProductsManager";
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
  Sparkles,
  ArrowLeft,
  Check,
  PlusCircle,
  X,
  Package,
} from "lucide-react";
import { formatBRL } from "@/lib/shopify";
import { toast } from "sonner";

export const AdminProducts = () => {
  const { products, loading, saving, saveProducts } = useProductsManager();
  const [editingProduct, setEditingProduct] = useState<LocalProduct | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  // Form states
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
      imageUrl: "/products/leave-in-termoprotetor.png",
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
    if (success && editingProduct?.id === id) {
      setEditingProduct(null);
    }
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
    if (!form.title.trim()) {
      toast.error("O título do produto é obrigatório");
      return;
    }
    if (!form.handle.trim()) {
      toast.error("O identificador (handle) é obrigatório");
      return;
    }

    let updatedList: LocalProduct[];
    if (isNew) {
      updatedList = [form, ...products];
    } else {
      updatedList = products.map((p) => (p.id === form.id ? form : p));
    }

    const success = await saveProducts(updatedList);
    if (success) {
      setEditingProduct(null);
    }
  };

  const addBenefitItem = () => {
    if (!newBenefit.trim()) return;
    setForm((prev) => ({ ...prev, benefits: [...prev.benefits, newBenefit.trim()] }));
    setNewBenefit("");
  };

  const removeBenefitItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addStepItem = () => {
    if (!newStep.trim()) return;
    setForm((prev) => ({ ...prev, howToUse: [...prev.howToUse, newStep.trim()] }));
    setNewStep("");
  };

  const removeStepItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      howToUse: prev.howToUse.filter((_, i) => i !== index),
    }));
  };

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
      {/* HEADER SECTION */}
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

      {/* EDITING FORM OR PRODUCT LIST */}
      {editingProduct ? (
        <div className="bg-card border border-border p-6 md:p-8 max-w-4xl space-y-8 animate-in fade-in duration-300">
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

          <form onSubmit={handleSaveForm} className="space-y-8">
            {/* IMAGES & GENERAL INFORMATION */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* IMAGE UPLOAD & PREVIEW */}
              <div className="space-y-4">
                <Label className="text-xs uppercase tracking-luxe font-medium">Foto Principal do Anúncio</Label>
                <ImageUploader
                  value={form.imageUrl}
                  onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                  label="Upload da Foto Principal"
                />
                
                {/* QUICK SELECT PRESETS FOR ATTACHED IMAGES */}
                <div className="pt-2">
                  <p className="text-[11px] uppercase tracking-luxe text-muted-foreground mb-2">
                    Fotos Recém-Enviadas:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "Leave-in", url: "/products/leave-in-termoprotetor.png" },
                      { name: "Shampoo", url: "/products/shampoo-pos-quimica.png" },
                      { name: "Reestruturador", url: "/products/reestruturador-infinit-repair.png" },
                      { name: "Máscara", url: "/products/mascara-pos-quimica.png" },
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
                  <Label className="text-xs uppercase tracking-luxe font-medium">URL Direta da Foto</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="ex: /products/shampoo.png ou https://..."
                    className="rounded-none text-xs"
                  />
                </div>
              </div>

              {/* BASIC DETAILS */}
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
                    URL no site: <span className="font-mono">/product/{form.handle || "..."}</span>
                  </p>
                </div>

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

            {/* DESCRIPTION & COMPOSITION */}
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

              {/* BENEFITS LIST */}
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-luxe font-medium">Benefícios / Diferenciais</Label>
                <div className="space-y-2">
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 bg-secondary/30 p-2.5 border border-border text-xs">
                      <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span className="flex-1">{b}</span>
                      <button
                        type="button"
                        onClick={() => removeBenefitItem(i)}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addBenefitItem();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addBenefitItem}
                      variant="outline"
                      className="rounded-none h-10 px-4 text-xs uppercase tracking-luxe"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" /> Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              {/* MODO DE USO */}
              <div className="space-y-3 pt-2">
                <Label className="text-xs uppercase tracking-luxe font-medium">Modo de Uso (Passo a Passo)</Label>
                <div className="space-y-2">
                  {form.howToUse.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 bg-secondary/30 p-2.5 border border-border text-xs">
                      <span className="font-display text-accent font-bold">{i + 1}.</span>
                      <span className="flex-1">{step}</span>
                      <button
                        type="button"
                        onClick={() => removeStepItem(i)}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      placeholder="Adicionar passo do modo de uso (ex: Aplique nos fios úmidos...)"
                      className="rounded-none h-10 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addStepItem();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addStepItem}
                      variant="outline"
                      className="rounded-none h-10 px-4 text-xs uppercase tracking-luxe"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" /> Passo
                    </Button>
                  </div>
                </div>
              </div>

              {/* COMPOSIÇÃO */}
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
                  "Salvar Anúncio"
                )}
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
        /* PRODUCT CATALOG LISTING */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border overflow-hidden flex flex-col justify-between group hover:border-accent/40 transition-colors"
            >
              <div>
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
          ))}

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
