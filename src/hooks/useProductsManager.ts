import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultProducts, LocalProduct } from "@/data/defaultProducts";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

export type { LocalProduct };

export function localToShopifyProduct(p: LocalProduct): ShopifyProduct {
  const images = [p.imageUrl, ...(p.additionalImages || [])].filter(Boolean);
  return {
    node: {
      id: p.id || `local-${p.handle}`,
      title: p.title,
      description: p.description || "",
      handle: p.handle,
      productType: p.productType,
      tags: p.featured ? ["destaque"] : [],
      priceRange: {
        minVariantPrice: {
          amount: String(p.price || "0"),
          currencyCode: "BRL",
        },
      },
      images: {
        edges: images.map((url) => ({
          node: { url, altText: p.title },
        })),
      },
      variants: {
        edges: [
          {
            node: {
              id: `var-${p.id || p.handle}`,
              title: "Default Title",
              price: {
                amount: String(p.price || "0"),
                currencyCode: "BRL",
              },
              availableForSale: p.available !== false,
              selectedOptions: [{ name: "Title", value: "Default Title" }],
            },
          },
        ],
      },
      options: [{ name: "Title", values: ["Default Title"] }],
    },
  };
}

/**
 * Produtos vindos do Shopify muitas vezes não têm imagem cadastrada.
 * Aqui completamos com as imagens locais (por handle, ou por título aproximado).
 */
export function mergeProductImages(
  remote: ShopifyProduct[],
  locals: LocalProduct[] = defaultProducts
): ShopifyProduct[] {
  const norm = (s: string) =>
    (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

  return remote.map((p) => {
    const remoteUrls = (p.node.images?.edges ?? []).map((e) => e.node.url).filter(Boolean);

    const match =
      locals.find((l) => l.handle === p.node.handle) ||
      locals.find((l) => norm(l.handle) === norm(p.node.handle)) ||
      locals.find((l) => norm(l.title).includes(norm(p.node.title).slice(0, 14)));

    const localUrls = match
      ? [match.imageUrl, ...(match.additionalImages || [])].filter(Boolean)
      : [];

    // União: mantém as fotos do Shopify e acrescenta as cadastradas no painel,
    // assim o carrossel automático sempre tem todas as imagens disponíveis.
    const urls = Array.from(new Set([...remoteUrls, ...localUrls]));
    if (urls.length === 0 || urls.length === remoteUrls.length) return p;

    return {
      ...p,
      node: {
        ...p.node,
        images: { edges: urls.map((url) => ({ node: { url, altText: p.node.title } })) },
      },
    };
  });
}

export function useProductsManager() {
  const [products, setProducts] = useState<LocalProduct[]>(defaultProducts);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data: row, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", "store_products")
        .maybeSingle();

      const payload = row?.data as { items?: unknown } | null;
      if (!error && payload && Array.isArray(payload.items)) {
        setProducts(payload.items as LocalProduct[]);
      } else {
        setProducts(defaultProducts);
      }
    } catch {
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const saveProducts = async (updatedProducts: LocalProduct[]) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_content").upsert({
        id: "store_products",
        data: { items: updatedProducts as any },
      });

      if (error) {
        toast.error("Erro ao salvar anúncios no banco de dados");
        return false;
      } else {
        setProducts(updatedProducts);
        toast.success("Anúncios atualizados com sucesso!");
        return true;
      }
    } catch (err: any) {
      toast.error(`Erro ao salvar: ${err?.message || "Ocorreu uma falha."}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const shopifyProducts: ShopifyProduct[] = products.map(localToShopifyProduct);

  return {
    products,
    shopifyProducts,
    loading,
    saving,
    fetchProducts,
    saveProducts,
  };
}
