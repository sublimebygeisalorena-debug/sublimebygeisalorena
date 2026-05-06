import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUploader = ({ value, onChange, label = "Imagem" }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx 10MB)");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
    if (error) {
      toast.error("Falha no upload");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Imagem enviada");
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-luxe">{label}</p>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="" className="w-40 h-40 object-cover border border-border" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 bg-background border border-border p-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="w-40 h-40 border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
          Sem imagem
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()} className="rounded-none text-xs uppercase tracking-luxe">
        {uploading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Upload className="w-3 h-3 mr-2" />}
        {value ? "Trocar" : "Enviar imagem"}
      </Button>
    </div>
  );
};
