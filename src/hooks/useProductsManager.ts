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

      if (!error && row?.data && Array.isArray(row.data.items)) {
        setProducts(row.data.items as LocalProduct[]);
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
