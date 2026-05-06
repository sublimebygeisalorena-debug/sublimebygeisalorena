import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

const AdminCustomers = () => {
  const [rows, setRows] = useState<ProfileRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, phone, city, state, created_at").order("created_at", { ascending: false });
      setRows(data ?? []);
    })();
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Clientes</h2>
      <div className="border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-luxe">
            <tr>
              <th className="text-left p-4">Nome</th>
              <th className="text-left p-4">Telefone</th>
              <th className="text-left p-4">Cidade</th>
              <th className="text-left p-4">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-4">{r.full_name || "—"}</td>
                <td className="p-4">{r.phone || "—"}</td>
                <td className="p-4">{[r.city, r.state].filter(Boolean).join(" / ") || "—"}</td>
                <td className="p-4 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhum cliente ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
