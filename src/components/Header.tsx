import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo-header.png";

const navLinks = [
  { to: "/", label: "Início", end: true },
  { to: "/loja", label: "Loja" },
  { to: "/sobre", label: "Sobre" },
  { to: "/cuidados", label: "Cuidados com Cabelo" },
  { to: "/historia", label: "Nossa História" },
];

export const Header = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  const handleNavClick = () => setMenuOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-accent transition ${isActive ? "text-accent" : ""}`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Sublime by Geisa Lorena" onClick={handleNavClick}>
            <img src={logo} alt="Sublime by Geisa Lorena" className="h-9 sm:h-11 md:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-luxe">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to={user ? "/conta" : "/auth"}
              aria-label={user ? "Minha conta" : "Entrar"}
              className="hover:text-accent transition p-1"
            >
              <User className="w-5 h-5" strokeWidth={1.4} />
            </Link>
            <CartDrawer />
            {/* Hamburger — mobile only */}
            <button
              id="mobile-menu-toggle"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-9 h-9 hover:text-accent transition"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <nav
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`fixed top-16 inset-x-0 z-30 bg-background border-b border-border md:hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="container py-6 space-y-1">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center w-full py-3 px-2 text-sm uppercase tracking-luxe border-b border-border/40 last:border-0 transition ${
                    isActive ? "text-accent" : "text-foreground hover:text-accent"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="pt-4">
            <Link
              to={user ? "/conta" : "/auth"}
              onClick={handleNavClick}
              className="flex items-center gap-2 py-3 px-2 text-sm uppercase tracking-luxe text-muted-foreground hover:text-accent transition"
            >
              <User className="w-4 h-4" strokeWidth={1.4} />
              {user ? "Minha conta" : "Entrar / Cadastrar"}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
