import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string; total: number; currency: string; item_count: number;
  status: string; created_at: string;
  profiles?: { full_name: string | null } | null;
  user_id: string;
}

const AdminOrders = () => {
  const [rows, setRows] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, total, currency, item_count, status, created_at, user_id")
        .order("created_at", { ascending: false });
      setRows((data ?? []) as Order[]);
    })();
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Pedidos</h2>
      <div className="border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-luxe">
            <tr>
              <th className="text-left p-4">Pedido</th>
              <th className="text-left p-4">Data</th>
              <th className="text-left p-4">Itens</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-4">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-4 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="p-4">{o.item_count}</td>
                <td className="p-4">{o.currency} {Number(o.total).toFixed(2)}</td>
                <td className="p-4"><Badge variant="outline" className="rounded-none text-xs">{o.status}</Badge></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum pedido ainda.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
