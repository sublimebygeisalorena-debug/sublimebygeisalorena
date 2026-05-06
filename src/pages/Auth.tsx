import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailSchema = z.string().trim().email("Email inválido").max(255);
const passwordSchema = z.string().min(8, "Mínimo 8 caracteres").max(72);
const nameSchema = z.string().trim().min(2, "Nome muito curto").max(100);

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/conta";

  useEffect(() => {
    document.title = mode === "login" ? "Entrar — Sublime by Geisa Lorena" : "Criar conta — Sublime by Geisa Lorena";
  }, [mode]);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const emailV = emailSchema.parse(email);
      const passV = passwordSchema.parse(password);

      if (mode === "signup") {
        const nameV = nameSchema.parse(fullName);
        const { error } = await supabase.auth.signUp({
          email: emailV,
          password: passV,
          options: {
            emailRedirectTo: `${window.location.origin}/conta`,
            data: { full_name: nameV },
          },
        });
        if (error) throw error;
        toast.success("Conta criada — você já pode entrar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: emailV, password: passV });
        if (error) throw error;
        toast.success("Bem-vinda de volta.");
      }
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.errors[0].message : (err as Error).message;
      toast.error(msg || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/conta` });
    if (result.error) {
      toast.error("Não foi possível entrar com Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-20 flex items-center justify-center">
        <div className="w-full max-w-md">
          <p className="text-xs tracking-luxe uppercase text-accent mb-3 text-center">Área do cliente</p>
          <h1 className="font-display text-4xl text-center mb-10">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h1>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleGoogle}
            className="w-full rounded-none h-12 text-xs uppercase tracking-luxe mb-6"
          >
            Continuar com Google
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-luxe">Nome completo</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} className="rounded-none h-12" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-luxe">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} className="rounded-none h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-luxe">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={72} className="rounded-none h-12" />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-none h-12 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {mode === "login" ? (
              <>Ainda não tem conta?{" "}
                <button onClick={() => setMode("signup")} className="text-accent hover:underline">Cadastre-se</button>
              </>
            ) : (
              <>Já tem conta?{" "}
                <button onClick={() => setMode("login")} className="text-accent hover:underline">Entrar</button>
              </>
            )}
          </p>
          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link to="/" className="hover:text-foreground">← Voltar para a loja</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
