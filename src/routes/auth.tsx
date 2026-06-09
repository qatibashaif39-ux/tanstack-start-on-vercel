import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Code2, Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — كود كرافت" },
      { name: "description", content: "تسجيل دخول لوحة إدارة كود كرافت." },
      { name: "robots", content: "noindex,nofollow" }
    ]
  }),
  component: AuthPage
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Check if cookie already exists
    if (document.cookie.includes("admin_session=authenticated")) {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    
    try {
      if (email === "Belal@admin.com" && password === "Bilal147") {
        toast.success("مرحباً أيها المدير");
        document.cookie = "admin_session=authenticated; path=/; max-age=86400"; // 1 day expiration
        navigate({ to: "/admin" });
      } else {
        toast.error("بيانات الدخول غير صحيحة");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "حدث خطأ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-16">
      <div className="w-full max-w-md glass glow-border rounded-3xl p-8">
        <div className="flex items-center gap-2 font-display font-extrabold text-lg mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[var(--gradient-brand)] grid place-items-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span>كود كرافت</span>
        </div>
        <h1 className="text-2xl font-black text-center mb-2">تسجيل الدخول</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">دخول لوحة الإدارة</p>

        <form onSubmit={handleEmail} className="space-y-3">
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full glass rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة السر"
              className="w-full glass rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--gradient-brand)] text-primary-foreground px-4 py-3 font-semibold hover:shadow-[var(--shadow-glow)] transition disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" /> دخول
          </button>
        </form>
      </div>
    </div>
  );
}
