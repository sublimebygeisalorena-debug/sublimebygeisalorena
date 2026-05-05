export const Footer = () => (
  <footer className="border-t border-border mt-32 bg-secondary/40">
    <div className="container py-16 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <h3 className="font-display text-2xl mb-4">maison<span className="text-accent">.</span>capilar</h3>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Cosmética capilar de alta performance. Fórmulas conscientes para resultados de salão, no conforto de casa.
        </p>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-luxe mb-4">Loja</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#produtos" className="hover:text-foreground">Produtos</a></li>
          <li><a href="#ritual" className="hover:text-foreground">Ritual pós-química</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-luxe mb-4">Marca</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#historia" className="hover:text-foreground">Nossa história</a></li>
          <li><a href="#" className="hover:text-foreground">Contato</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-6 text-center text-xs text-muted-foreground tracking-wide">
      © {new Date().getFullYear()} maison.capilar — Todos os direitos reservados
    </div>
  </footer>
);
