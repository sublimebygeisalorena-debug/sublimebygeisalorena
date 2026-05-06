import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent<T extends Record<string, unknown>>(id: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: row } = await supabase.from("site_content").select("data").eq("id", id).maybeSingle();
      if (active) {
        if (row?.data) setData({ ...fallback, ...(row.data as T) });
        setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { data, loading };
}
