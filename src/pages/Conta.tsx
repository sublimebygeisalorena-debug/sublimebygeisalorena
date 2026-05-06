import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Conta = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "", phone: "", address_line: "", city: "", state: "", postal_code: "", country: "Brasil",
  });

  useEffect(() => { document.title = "Minha conta — maison.capilar"; }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) setProfile({
        full_name: data.full_name ?? "", phone: data.phone ?? "",
        address_line: data.address_line ?? "", city: data.city ?? "",
        state: data.state ?? "", postal_code: data.postal_code ?? "",
        country: data.country ?? "Brasil",
      });
    })();
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    setLoading(false);
    if (error) toast.error("Erro ao salvar"); else toast.success("Perfil atualizado");
  };

  const set = (k: keyof typeof profile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-20 max-w-3xl">
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-xs tracking-luxe uppercase text-accent mb-3">Minha conta</p>
            <h1 className="font-display text-4xl md:text-5xl">Olá{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
            <p className="text-muted-foreground text-sm mt-2">{user?.email}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs uppercase tracking-luxe">
              <Link to="/conta/pedidos" className="text-accent hover:underline">Meus pedidos →</Link>
              {isAdmin && <Link to="/admin" className="text-accent hover:underline">Painel admin →</Link>}
            </div>
          </div>
          <Button variant="ghost" onClick={signOut} className="rounded-none text-xs uppercase tracking-luxe">Sair</Button>
        </div>

        <form onSubmit={save} className="space-y-6">
          <h2 className="font-display text-2xl">Dados pessoais</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-luxe">Nome completo</Label>
              <Input value={profile.full_name} onChange={set("full_name")} maxLength={100} className="rounded-none h-12" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-luxe">Telefone</Label>
              <Input value={profile.phone} onChange={set("phone")} maxLength={20} className="rounded-none h-12" />
            </div>
          </div>

          <h2 className="font-display text-2xl pt-6">Endereço de entrega</h2>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-luxe">Endereço</Label>
            <Input value={profile.address_line} onChange={set("address_line")} maxLength={200} className="rounded-none h-12" />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-luxe">Cidade</Label>
              <Input value={profile.city} onChange={set("city")} maxLength={100} className="rounded-none h-12" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-luxe">Estado</Label>
              <Input value={profile.state} onChange={set("state")} maxLength={50} className="rounded-none h-12" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-luxe">CEP</Label>
              <Input value={profile.postal_code} onChange={set("postal_code")} maxLength={20} className="rounded-none h-12" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="rounded-none h-12 px-8 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "Salvando…" : "Salvar alterações"}
          </Button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Conta;
