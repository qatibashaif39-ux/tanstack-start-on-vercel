import { createFileRoute } from "@tanstack/react-router";
import heroBg from "@/assets/hero-bg.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import {
  Code2, Smartphone, ShoppingCart, Cloud, Palette, Search,
  Rocket, Shield, Zap, Users, Award, ArrowLeft, Check,
  Github, Twitter, Linkedin, Mail, Phone, MapPin, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "كود كرافت — شركة تطوير برمجيات ومواقع وتطبيقات احترافية" },
      { name: "description", content: "نحوّل أفكارك إلى منتجات رقمية متقنة. تصميم مواقع، تطبيقات جوال، متاجر إلكترونية، وحلول برمجية مخصصة بأعلى معايير الجودة." },
      { property: "og:title", content: "كود كرافت — شركة تطوير برمجيات احترافية" },
      { property: "og:description", content: "فريق متخصص في بناء منتجات رقمية تتفوق على المنافسين." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CodeCraft",
        description: "شركة تطوير برمجيات متخصصة في المواقع والتطبيقات والمتاجر الإلكترونية",
        url: "/",
      }),
    }],
  }),
  component: HomePage,
});

const services = [
  { icon: Code2, title: "تطوير المواقع", desc: "مواقع سريعة وآمنة مبنية بأحدث تقنيات الويب مع تجربة مستخدم استثنائية." },
  { icon: Smartphone, title: "تطبيقات الجوال", desc: "تطبيقات iOS و Android أصلية وهجينة بأداء سلس وتصميم عصري." },
  { icon: ShoppingCart, title: "المتاجر الإلكترونية", desc: "متاجر متكاملة بأنظمة دفع وشحن وإدارة مخزون متطورة." },
  { icon: Cloud, title: "الحلول السحابية", desc: "بنية تحتية قابلة للتوسع على AWS و Azure و Google Cloud." },
  { icon: Palette, title: "تصميم UI/UX", desc: "تصاميم أنيقة مدروسة تعتمد على أبحاث المستخدمين وأفضل الممارسات." },
  { icon: Search, title: "تحسين محركات البحث", desc: "نضمن ظهور موقعك في أولى نتائج البحث عبر تقنيات SEO متقدمة." },
];

const stats = [
  { value: "250+", label: "مشروع ناجح" },
  { value: "120+", label: "عميل سعيد" },
  { value: "15+", label: "دولة حول العالم" },
  { value: "99%", label: "معدل الرضا" },
];

const techs = ["React", "Next.js", "TypeScript", "Node.js", "Python", "Flutter", "Swift", "Kotlin", "AWS", "Docker", "PostgreSQL", "GraphQL", "TailwindCSS", "Figma"];

const process = [
  { num: "01", title: "الاستكشاف والتخطيط", desc: "نفهم أهدافك بعمق ونرسم خارطة طريق واضحة للمشروع." },
  { num: "02", title: "التصميم والنماذج", desc: "نصمم تجربة بصرية متقنة تعكس هوية علامتك التجارية." },
  { num: "03", title: "التطوير والبرمجة", desc: "نبني المنتج بكود نظيف وقابل للتوسع باستخدام أفضل التقنيات." },
  { num: "04", title: "الإطلاق والدعم", desc: "نطلق منتجك ونرافقك بالتحديثات والدعم الفني المستمر." },
];

const works = [
  { img: work1, title: "منصة تحليلات بيانات", tag: "تطبيق ويب" },
  { img: work2, title: "تطبيق توصيل ذكي", tag: "تطبيق جوال" },
  { img: work3, title: "متجر إلكتروني فاخر", tag: "متجر إلكتروني" },
];

const testimonials = [
  { name: "أحمد المنصور", role: "الرئيس التنفيذي، تك فيجن", text: "فريق محترف بكل ما تحمله الكلمة من معنى. سلّموا المشروع في الموعد المحدد بجودة فاقت توقعاتنا." },
  { name: "سارة الحربي", role: "مؤسسة، نمو ستارت", text: "تجربة استثنائية. تصميم أنيق، أداء سريع جداً، وفريق متفهم لكل التفاصيل." },
  { name: "خالد العتيبي", role: "مدير المنتج، سوق رابح", text: "زادت مبيعاتنا 3 أضعاف بعد إطلاق المتجر الجديد. يستحقون كل ثناء." },
];

const features = [
  "كود نظيف وقابل للصيانة",
  "أداء وسرعة فائقة",
  "تصاميم متجاوبة بالكامل",
  "أمان من الدرجة الأولى",
  "دعم فني على مدار الساعة",
  "تحديثات وصيانة دورية",
];

function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Services />
      <Works />
      <Process />
      <WhyUs />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <div className="container-x flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 font-display font-extrabold text-lg">
          <div className="w-9 h-9 rounded-xl bg-[var(--gradient-brand)] grid place-items-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span>كود كرافت</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#services" className="text-muted-foreground hover:text-foreground transition">خدماتنا</a>
          <a href="#works" className="text-muted-foreground hover:text-foreground transition">أعمالنا</a>
          <a href="#process" className="text-muted-foreground hover:text-foreground transition">منهجيتنا</a>
          <a href="#why" className="text-muted-foreground hover:text-foreground transition">لماذا نحن</a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition">تواصل</a>
        </nav>
        <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-5 py-2 text-sm font-semibold text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all">
          ابدأ مشروعك
          <ArrowLeft className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>
      <div className="container-x text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs mb-8 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span className="text-muted-foreground">نبني منتجات رقمية تترك أثراً</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] animate-fade-up" style={{ animationDelay: "0.1s" }}>
          نحوّل أفكارك إلى
          <br />
          <span className="text-gradient">منتجات استثنائية</span>
        </h1>
        <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
          كود كرافت — شركة تطوير برمجيات تجمع بين الإبداع والتقنية لبناء مواقع، تطبيقات، ومتاجر إلكترونية تتفوق على المنافسين.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-7 py-3.5 font-semibold text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all hover:scale-105">
            احصل على عرض سعر
            <ArrowLeft className="w-4 h-4" />
          </a>
          <a href="#works" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-semibold hover:bg-surface-elevated transition">
            استعرض أعمالنا
          </a>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...techs, ...techs];
  return (
    <section className="py-10 border-y border-border bg-surface/30 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap gap-12">
        {items.map((t, i) => (
          <span key={i} className="text-xl md:text-2xl font-bold text-muted-foreground/60 hover:text-brand transition">
            {t} ✦
          </span>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-20">
      <div className="container-x">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 md:p-8 text-center hover:border-brand/50 transition">
              <div className="text-4xl md:text-5xl font-black text-gradient">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ tag, title, desc }: { tag: string; title: string; desc?: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-16">
      <span className="inline-block text-xs font-bold text-brand tracking-widest uppercase mb-4">{tag}</span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black">{title}</h2>
      {desc && <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="container-x">
        <SectionHeader
          tag="خدماتنا"
          title="حلول رقمية متكاملة"
          desc="نقدم باقة شاملة من خدمات البرمجة والتصميم لمساعدتك على تحقيق رؤيتك الرقمية."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="group relative glass glow-border rounded-2xl p-8 hover:translate-y-[-4px] transition-all duration-500">
              <div className="w-14 h-14 rounded-xl bg-[var(--gradient-brand)] grid place-items-center mb-6 group-hover:scale-110 transition">
                <s.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Works() {
  return (
    <section id="works" className="py-24">
      <div className="container-x">
        <SectionHeader tag="معرض الأعمال" title="مشاريع نفخر بها" desc="نماذج من مشاريعنا التي ساعدت عملاءنا على تحقيق نمو حقيقي." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((w) => (
            <div key={w.title} className="group relative overflow-hidden rounded-2xl glass">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={w.img} alt={w.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <span className="text-xs text-brand font-bold tracking-widest uppercase">{w.tag}</span>
                <h3 className="mt-2 text-xl font-bold">{w.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="py-24">
      <div className="container-x">
        <SectionHeader tag="منهجيتنا" title="كيف نعمل" desc="عملية مدروسة تضمن تسليم منتج عالي الجودة في الوقت المحدد." />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((p) => (
            <div key={p.num} className="relative">
              <div className="text-7xl font-black text-gradient opacity-60 mb-4">{p.num}</div>
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="why" className="py-24">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold text-brand tracking-widest uppercase mb-4">لماذا نحن</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">شريك تقني تثق به</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              نحن لسنا مجرد مطورين، نحن شركاء نجاحك. نلتزم بأعلى معايير الجودة ونرافقك في كل خطوة من رحلتك الرقمية.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--gradient-brand)] grid place-items-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                  </div>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Rocket, label: "إطلاق سريع" },
              { icon: Shield, label: "أمان عالي" },
              { icon: Zap, label: "أداء فائق" },
              { icon: Award, label: "جودة موثقة" },
              { icon: Users, label: "فريق خبير" },
              { icon: Sparkles, label: "تصميم متميز" },
            ].map((item, i) => (
              <div key={item.label} className={`glass rounded-2xl p-6 ${i % 3 === 1 ? "translate-y-6" : ""}`}>
                <item.icon className="w-8 h-8 text-brand mb-3" />
                <div className="font-bold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHeader tag="آراء العملاء" title="يحبون ما نصنع" />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-8 hover:border-brand/50 transition">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-brand">★</span>
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-11 h-11 rounded-full bg-[var(--gradient-brand)] grid place-items-center font-bold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="py-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl glass glow-border p-10 md:p-16 text-center">
          <div className="absolute inset-0 -z-10 opacity-50" style={{ background: "var(--gradient-mesh)" }} />
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            جاهز لبدء <span className="text-gradient">مشروعك القادم؟</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
            تواصل معنا اليوم واحصل على استشارة مجانية وعرض سعر مفصّل خلال 24 ساعة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a href="mailto:hello@codecraft.dev" className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-7 py-3.5 font-semibold text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all hover:scale-105">
              <Mail className="w-4 h-4" />
              راسلنا الآن
            </a>
            <a href="tel:+966500000000" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-semibold hover:bg-surface-elevated transition">
              <Phone className="w-4 h-4" />
              اتصل بنا
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand" /> hello@codecraft.dev</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand" /> +966 50 000 0000</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand" /> الرياض، المملكة العربية السعودية</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-12">
      <div className="container-x">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display font-extrabold">
            <div className="w-8 h-8 rounded-lg bg-[var(--gradient-brand)] grid place-items-center">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span>كود كرافت</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} كود كرافت. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full glass grid place-items-center hover:text-brand transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
