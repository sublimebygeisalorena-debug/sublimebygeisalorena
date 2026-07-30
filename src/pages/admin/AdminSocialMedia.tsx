import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Instagram, Facebook, Youtube } from "lucide-react";

interface SocialField {
  key: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  color: string;
}

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.26 8.26 0 0 0 4.83 1.55V6.79a4.85 4.85 0 0 1-1.06-.1z" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const socialFields: SocialField[] = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/seuusuario",
    icon: <Instagram className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/suapagina",
    icon: <Facebook className="w-5 h-5" />,
    color: "from-blue-600 to-blue-500",
  },
  {
    key: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@seuusuario",
    icon: <TikTokIcon />,
    color: "from-gray-900 to-gray-700",
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@seucanal",
    icon: <Youtube className="w-5 h-5" />,
    color: "from-red-600 to-red-500",
  },
  {
    key: "pinterest",
    label: "Pinterest",
    placeholder: "https://pinterest.com/seuusuario",
    icon: <PinterestIcon />,
    color: "from-red-700 to-red-600",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholder: "https://wa.me/5511999999999",
    icon: <WhatsAppIcon />,
    color: "from-green-600 to-green-500",
  },
];

const BLOCK_ID = "social";

const AdminSocialMedia = () => {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: row } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", BLOCK_ID)
        .maybeSingle();
      setData((row?.data as Record<string, string>) ?? {});
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: BLOCK_ID, data });
    setSaving(false);
    if (error) toast.error("Erro ao salvar");
    else toast.success("Redes sociais atualizadas!");
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="font-display text-2xl mb-1">Redes Sociais</h2>
        <p className="text-sm text-muted-foreground">
          Insira as URLs completas dos seus perfis. Elas serão exibidas no rodapé e em outras áreas do site. Deixe em branco para ocultar.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-muted-foreground py-10">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Carregando…</span>
        </div>
      ) : (
        <div className="space-y-3">
          {socialFields.map((field) => {
            const hasValue = !!data[field.key];
            return (
              <div
                key={field.key}
                className={`border transition-all ${
                  hasValue ? "border-accent/40 bg-accent/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${field.color} text-white flex items-center justify-center`}
                  >
                    {field.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Label className="text-xs uppercase tracking-luxe mb-2 block">
                      {field.label}
                    </Label>
                    <Input
                      id={`social-${field.key}`}
                      type="url"
                      value={data[field.key] ?? ""}
                      onChange={(e) =>
                        setData({ ...data, [field.key]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      className="rounded-none h-10 text-sm"
                    />
                  </div>

                  <div className="flex-shrink-0 w-14 text-right">
                    {hasValue ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 inline-block" />
                        Inativo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex items-center gap-4">
            <Button
              onClick={save}
              disabled={saving}
              className="rounded-none h-11 px-8 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Salvando…
                </span>
              ) : (
                "Salvar redes sociais"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSocialMedia;
