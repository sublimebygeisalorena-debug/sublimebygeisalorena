import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL } from "@/lib/shopify";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const {
    items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart, cartId,
    discountCode, discountApplicable, discountedTotal, isApplyingDiscount, applyDiscount, removeDiscount,
  } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const { user } = useAuth();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "BRL";
  const finalTotal = discountApplicable && discountedTotal ? parseFloat(discountedTotal) : total;
  const savings = Math.max(0, total - finalTotal);

  const handleApplyCoupon = async (code?: string) => {
    const value = (code ?? coupon).trim();
    const r = await applyDiscount(value);
    if (r.ok) { setCoupon(""); toast.success(r.message, { position: "top-center" }); }
    else toast.error(r.message, { position: "top-center" });
  };

  useEffect(() => { if (open) syncCart(); }, [open, syncCart]);

  const checkout = async () => {
    const url = getCheckoutUrl();
    if (!url) return;
    if (user) {
      try {
        await supabase.from("orders").insert({
          user_id: user.id,
          shopify_cart_id: cartId,
          checkout_url: url,
          total: Number(finalTotal.toFixed(2)),
          currency,
          item_count: totalItems,
          status: "pending",
          items: items.map((i) => ({
            title: i.product.node.title,
            handle: i.product.node.handle,
            variantId: i.variantId,
            variantTitle: i.variantTitle,
            quantity: i.quantity,
            price: i.price,
            image: i.product.node.images?.edges?.[0]?.node?.url ?? null,
          })),
        });
      } catch (e) {
        console.error("Failed to record order", e);
      }
    }
    window.open(url, "_blank");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-secondary">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col bg-background">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Sua sacola</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Sua sacola está vazia" : `${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Adicione produtos para começar</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 p-3 border border-border rounded-sm">
                    <div className="w-20 h-20 bg-muted overflow-hidden flex-shrink-0">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-snug">{item.product.node.title}</h4>
                      <p className="font-display text-lg mt-1">{formatBRL(item.price.amount, item.price.currencyCode)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.variantId)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-border">
                {/* CUPOM DE DESCONTO */}
                <div className="space-y-2">
                  {discountApplicable && discountCode ? (
                    <div className="flex items-center justify-between border border-accent/50 bg-accent/10 px-3 py-2">
                      <span className="text-xs uppercase tracking-luxe flex items-center gap-2">
                        <Tag className="w-3 h-3" /> {discountCode} aplicado
                      </span>
                      <button type="button" onClick={removeDiscount} aria-label="Remover cupom">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          onKeyDown={(e) => { if (e.key === "Enter") handleApplyCoupon(); }}
                          placeholder="Cupom de desconto"
                          className="rounded-none h-10 text-xs uppercase tracking-luxe"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleApplyCoupon()}
                          disabled={isApplyingDiscount || !coupon.trim()}
                          className="rounded-none h-10 text-xs uppercase tracking-luxe"
                        >
                          {isApplyingDiscount ? <Loader2 className="w-3 h-3 animate-spin" /> : "Aplicar"}
                        </Button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon("KITCRONOGRAMA")}
                        className="text-[11px] text-muted-foreground hover:text-accent underline underline-offset-4"
                      >
                        Usar cupom do Kit Cronograma Pós-Química (KITCRONOGRAMA)
                      </button>
                    </>
                  )}
                </div>

                {savings > 0 && (
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-accent">− {formatBRL(savings, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline">
                  <span className="text-sm tracking-luxe uppercase text-muted-foreground">Total</span>
                  <span className="font-display text-2xl">{formatBRL(finalTotal, currency)}</span>
                </div>
                <Button onClick={checkout} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 tracking-luxe uppercase text-xs" disabled={isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />Finalizar compra</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
