import { Link, NavLink } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Header = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-accent transition ${isActive ? "text-accent" : ""}`;

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl tracking-wide">
          maison<span className="text-accent">.</span>capilar
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-luxe">
          <NavLink to="/" end className={linkClass}>Início</NavLink>
          <NavLink to="/loja" className={linkClass}>Loja</NavLink>
          <NavLink to="/sobre" className={linkClass}>Sobre</NavLink>
          <NavLink to="/cuidados" className={linkClass}>Cuidados com Cabelo</NavLink>
          <NavLink to="/historia" className={linkClass}>Nossa História</NavLink>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
};
