import { Link, NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo-header.png";

export const Header = () => {
  const { user } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-accent transition ${isActive ? "text-accent" : ""}`;

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center" aria-label="Sublime by Geisa Lorena">
          <img src={logo} alt="Sublime by Geisa Lorena" className="h-10 sm:h-12 md:h-14 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-luxe">
          <NavLink to="/" end className={linkClass}>Início</NavLink>
          <NavLink to="/loja" className={linkClass}>Loja</NavLink>
          <NavLink to="/sobre" className={linkClass}>Sobre</NavLink>
          <NavLink to="/cuidados" className={linkClass}>Cuidados com Cabelo</NavLink>
          <NavLink to="/historia" className={linkClass}>Nossa História</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to={user ? "/conta" : "/auth"}
            aria-label={user ? "Minha conta" : "Entrar"}
            className="hover:text-accent transition"
          >
            <User className="w-5 h-5" strokeWidth={1.4} />
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
