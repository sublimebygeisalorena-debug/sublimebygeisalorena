import { useSiteContent } from "@/hooks/useSiteContent";
import logo from "@/assets/logo-footer.png";
import { Instagram, Facebook, Youtube } from "lucide-react";

export const Footer = () => {
  const { data } = useSiteContent("contato", {
    email: "",
    phone: "",
    phone_display: "",
    address: "",
    hours: "",
  });

  const { data: social } = useSiteContent("social", {
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    pinterest: "",
  });

  return (
    <footer className="border-t border-border mt-20 md:mt-32 bg-secondary/40">
      <div className="container py-12 md:py-16">
        {/* Brand block — full width on mobile */}
        <div className="flex flex-col items-start gap-4 mb-10 md:hidden">
          <img src={logo} alt="Sublime by Geisa Lorena" className="h-16 w-auto object-contain" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cosmética capilar de alta performance. Fórmulas conscientes para resultados de salão, no conforto de casa.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand — desktop only */}
          <div className="hidden md:flex md:col-span-1 flex-col items-start gap-6">
            <img src={logo} alt="Sublime by Geisa Lorena" className="h-24 md:h-32 lg:h-40 w-auto flex-shrink-0 object-contain" />
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed pt-2">
              Cosmética capilar de alta performance. Fórmulas conscientes para resultados de salão, no conforto de casa.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxe mb-4">Loja</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/loja" className="hover:text-foreground">Produtos</a></li>
              <li><a href="/cuidados" className="hover:text-foreground">Cuidados com Cabelo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxe mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {data.email && (
                <li><a href={`mailto:${data.email}`} className="hover:text-foreground break-all">{data.email}</a></li>
              )}
              {data.phone && (
                <li>
                  <a href={`https://wa.me/${data.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                    {data.phone_display || data.phone}
                  </a>
                </li>
              )}
              {data.hours && <li>{data.hours}</li>}
              {data.address && <li className="whitespace-pre-line">{data.address}</li>}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxe mb-4">Redes Sociais</h4>
            <div className="flex flex-wrap gap-3">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" strokeWidth={1.5} />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5" strokeWidth={1.5} />
                </a>
              )}
              {social.tiktok && (
                <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium pt-0.5" aria-label="TikTok">
                  TIKTOK
                </a>
              )}
              {social.pinterest && (
                <a href={social.pinterest} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium pt-0.5" aria-label="Pinterest">
                  PINTEREST
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground tracking-wide px-4">
        © {new Date().getFullYear()} Sublime by Geisa Lorena — Todos os direitos reservados
      </div>
    </footer>
  );
};
