import { Link } from "@tanstack/react-router";
import { Code2, ArrowLeft, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const links = [
    { to: "/", label: "الرئيسية" },
    { to: "/works", label: "أعمالنا" },
    { to: "/blog", label: "المدونة" },
    { to: "/#services", label: "خدماتنا" },
    { to: "/#contact", label: "تواصل" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg">
          <div className="w-9 h-9 rounded-xl bg-[var(--gradient-brand)] grid place-items-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span>كود كرافت</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-muted-foreground hover:text-foreground transition">{l.label}</Link>
          ))}
          {signedIn && <Link to="/admin" className="text-brand font-semibold">الإدارة</Link>}
        </nav>
        <Link to="/" hash="contact" className="hidden md:inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-5 py-2 text-sm font-semibold text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all">
          ابدأ مشروعك
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <button className="md:hidden p-2 rounded-lg glass" onClick={() => setOpen((v) => !v)} aria-label="القائمة">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container-x py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm py-2">{l.label}</Link>
            ))}
            {signedIn && <Link to="/admin" onClick={() => setOpen(false)} className="text-sm py-2 text-brand">الإدارة</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
