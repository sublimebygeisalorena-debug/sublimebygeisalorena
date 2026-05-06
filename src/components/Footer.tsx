import { useSiteContent } from "@/hooks/useSiteContent";

export const Footer = () => {
  const { data } = useSiteContent("contato", {
    email: "",
    phone: "",
    phone_display: "",
    address: "",
    hours: "",
  });

  return (
    <footer className="border-t border-border mt-32 bg-secondary/40">
      <div className="container py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl mb-4">Sublime <span className="text-accent">by</span> Geisa Lorena</h3>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
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
              <li><a href={`mailto:${data.email}`} className="hover:text-foreground">{data.email}</a></li>
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
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground tracking-wide">
        © {new Date().getFullYear()} Sublime by Geisa Lorena — Todos os direitos reservados
      </div>
    </footer>
  );
};
