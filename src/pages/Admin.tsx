import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

const Admin = () => {
  const [rows, setRows] = useState<ProfileRow[]>([]);

  useEffect(() => {
    document.title = "Admin — maison.capilar";
    (async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, phone, city, state, created_at").order("created_at", { ascending: false });
      setRows(data ?? []);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-20">
        <p className="text-xs tracking-luxe uppercase text-accent mb-3">Administração</p>
        <h1 className="font-display text-4xl mb-10">Clientes</h1>
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
      </section>
      <Footer />
    </div>
  );
};

export default Admin;
