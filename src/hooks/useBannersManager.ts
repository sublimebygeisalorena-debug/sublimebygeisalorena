import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultBanners, HomeBanner } from "@/data/defaultBanners";
import { toast } from "sonner";

export type { HomeBanner };

export function useBannersManager() {
  const [banners, setBanners] = useState<HomeBanner[]>(defaultBanners);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const { data: row, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", "home_banners")
        .maybeSingle();

      if (!error && row?.data && Array.isArray(row.data.items)) {
        setBanners(row.data.items as HomeBanner[]);
      } else {
        setBanners(defaultBanners);
      }
    } catch {
      setBanners(defaultBanners);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const saveBanners = async (updatedBanners: HomeBanner[]) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_content").upsert({
        id: "home_banners",
        data: { items: updatedBanners as any },
      });

      if (error) {
        toast.error("Erro ao salvar banners no banco de dados");
        return false;
      } else {
        setBanners(updatedBanners);
        toast.success("Banners atualizados com sucesso!");
        return true;
      }
    } catch (err: any) {
      toast.error(`Erro ao salvar: ${err?.message || "Ocorreu uma falha."}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const activeBanners = banners.filter((b) => b.active !== false);

  return {
    banners,
    activeBanners,
    loading,
    saving,
    fetchBanners,
    saveBanners,
  };
}
