import { Link } from "@tanstack/react-router";
import { Code2, ArrowLeft, Home, Briefcase, FileText, Layers, Phone, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        setSignedIn(document.cookie.includes("admin_session=authenticated"));
    }, []);

    const links = [
        { to: "/", label: "الرئيسية", icon: Home },
        { to: "/works", label: "أعمالنا", icon: Briefcase },
        { to: "/blog", label: "المدونة", icon: FileText },
        { to: "/", hash: "services", label: "خدماتنا", icon: Layers },
        { to: "/", hash: "contact", label: "تواصل", icon: Phone }
    ];

    return (
        <>
            {/* Desktop & Mobile Top Header */}
            <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border">
                <div className="container-x flex items-center justify-between h-16">
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-display font-extrabold text-lg"
                    >
                        <div className="w-9 h-9 rounded-xl bg-[var(--gradient-brand)] grid place-items-center shadow-sm">
                            <Code2 className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span>كود كرافت</span>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
                        {links.map(l => (
                            <Link
                                key={l.label}
                                to={l.to}
                                hash={l.hash}
                                className="text-muted-foreground hover:text-foreground transition"
                                activeProps={!l.hash ? { className: "text-brand font-bold" } : {}}
                            >
                                {l.label}
                            </Link>
                        ))}
                        {signedIn && (
                            <Link to="/admin" className="text-brand font-bold flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4" /> الإدارة
                            </Link>
                        )}
                    </nav>

                    <Link
                        to="/"
                        hash="contact"
                        className="hidden md:inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-5 py-2 text-sm font-bold text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all"
                    >
                        ابدأ مشروعك
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur border-t border-border pb-safe">
                <div className="flex items-center justify-around h-16 px-2">
                    {links.map(l => {
                        const Icon = l.icon;
                        return (
                            <Link
                                key={l.label}
                                to={l.to}
                                hash={l.hash}
                                className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                activeProps={!l.hash ? { className: "text-brand font-semibold" } : {}}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{l.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
