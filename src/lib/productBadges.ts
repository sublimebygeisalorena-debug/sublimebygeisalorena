import { ShopifyProduct } from "@/lib/shopify";

export type ProductBadge = {
  label: string;
  className: string;
};

const has = (tags: string[], ...needles: string[]) =>
  tags.some((t) => needles.includes(t));

/**
 * Selos automáticos do produto:
 * - Esgotado: nenhuma variante disponível para venda (estoque)
 * - Lançamento / Mais vendido: pela tag cadastrada no produto
 */
export function getProductBadges(product: ShopifyProduct["node"]): ProductBadge[] {
  const badges: ProductBadge[] = [];
  const tags = (product.tags || []).map((t) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  );

  const variants = product.variants?.edges ?? [];
  const soldOut = variants.length > 0 && variants.every((v) => !v.node.availableForSale);

  if (soldOut) {
    badges.push({
      label: "Esgotado",
      className: "bg-muted text-muted-foreground border border-border",
    });
    return badges;
  }

  if (has(tags, "lancamento", "novo", "new")) {
    badges.push({
      label: "Lançamento",
      className: "bg-accent text-accent-foreground",
    });
  }

  if (has(tags, "bestseller", "mais vendido", "mais-vendido", "best seller")) {
    badges.push({
      label: "Mais vendido",
      className: "bg-foreground text-background",
    });
  }

  const lowStock = variants.length > 0 && variants.filter((v) => v.node.availableForSale).length === 1
    && variants.length > 1;
  if (lowStock) {
    badges.push({
      label: "Últimas unidades",
      className: "bg-destructive text-destructive-foreground",
    });
  }

  return badges;
}
