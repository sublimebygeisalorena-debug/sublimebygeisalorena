import { ExternalLink, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const SHOPIFY_ADMIN = "https://admin.shopify.com/store/radiant-strands-studio-2qzze";

const AdminShop = () => (
  <div className="max-w-2xl">
    <h2 className="font-display text-2xl mb-6">Loja</h2>
    <div className="border border-border p-8">
      <Store className="w-8 h-8 text-accent mb-4" strokeWidth={1.4} />
      <h3 className="font-display text-xl mb-2">Gerenciamento de produtos no Shopify</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        Os produtos da sua loja são gerenciados diretamente no painel do Shopify, onde você tem
        controle completo sobre estoque, variações, preços, fotos, frete e formas de pagamento.
        As alterações feitas lá aparecem automaticamente no site.
      </p>
      <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc pl-5">
        <li>Adicionar, editar ou remover produtos</li>
        <li>Subir e organizar fotos</li>
        <li>Configurar preços, descontos e promoções</li>
        <li>Definir regras de frete e pagamentos</li>
        <li>Acompanhar inventário</li>
      </ul>
      <Button asChild className="rounded-none h-11 px-6 text-xs uppercase tracking-luxe bg-primary text-primary-foreground hover:bg-primary/90">
        <a href={SHOPIFY_ADMIN} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-3 h-3 mr-2" /> Abrir Shopify Admin
        </a>
      </Button>
    </div>
  </div>
);

export default AdminShop;
