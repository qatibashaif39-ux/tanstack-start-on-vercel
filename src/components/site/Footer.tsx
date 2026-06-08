import { Link } from "@tanstack/react-router";
import {
    Code2,
    Github,
    Twitter,
    Linkedin,
    Mail,
    Phone,
    MapPin
} from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border py-16 mt-12">
            <div className="container-x">
                <div className="grid md:grid-cols-4 gap-10 mb-12">
                    <div className="md:col-span-2">
                        <Link
                            to="/"
                            className="flex items-center gap-2 font-display font-extrabold text-lg mb-4"
                        >
                            <div className="w-9 h-9 rounded-xl bg-[var(--gradient-brand)] grid place-items-center">
                                <Code2 className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span>كود كرافت</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                            شركة تطوير برمجيات متخصصة في بناء مواقع وتطبيقات
                            ومتاجر إلكترونية احترافية بأعلى معايير الجودة
                            والسرعة.
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label="رابط اجتماعي"
                                    className="w-9 h-9 rounded-full glass grid place-items-center hover:text-brand transition"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">روابط سريعة</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/" className="hover:text-foreground">
                                    الرئيسية
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/works"
                                    className="hover:text-foreground"
                                >
                                    أعمالنا
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="hover:text-foreground"
                                >
                                    المدونة
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/#services"
                                    className="hover:text-foreground"
                                >
                                    خدماتنا
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/#contact"
                                    className="hover:text-foreground"
                                >
                                    تواصل
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">تواصل</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-brand" />{" "}
                                bilalshaif@gmail.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone
                                    className="w-4 h-4
              text-brand"
                                />{" "}
                                +967 736 915 890
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-brand" /> اليمن
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} كود كرافت. جميع الحقوق
                        محفوظة.
                    </p>
                    <p>
                        جميع الحقوق محفوظة©2026{" "}
                        <span className="text-brand">♥</span> م.بلال شائف
                    </p>
                </div>
            </div>
        </footer>
    );
}
