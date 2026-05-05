import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl tracking-wide">
          maison<span className="text-accent">.</span>capilar
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-luxe">
          <a href="#produtos" className="hover:text-accent transition">Produtos</a>
          <a href="#historia" className="hover:text-accent transition">Nossa História</a>
          <a href="#ritual" className="hover:text-accent transition">Ritual</a>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
};
