import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { posts, blogCategories } from "@/data/posts";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "المدونة التقنية — كود كرافت" },
      { name: "description", content: "مقالات تقنية متخصصة في تطوير الويب، تطبيقات الجوال، تحسين السيو، البنية السحابية، والمتاجر الإلكترونية باللغة العربية." },
      { property: "og:title", content: "المدونة التقنية — كود كرافت" },
      { property: "og:description", content: "مقالات عربية احترافية في عالم البرمجة والتقنية." },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "مدونة كود كرافت",
        description: "مقالات عربية في تطوير الويب والتطبيقات",
      }),
    }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [cat, setCat] = useState("الكل");
  const filtered = cat === "الكل" ? posts : posts.filter((p) => p.category === cat);
  const featured = posts[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="container-x text-center">
          <span className="inline-block text-xs font-bold text-brand tracking-widest uppercase mb-4">المدونة التقنية</span>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            رؤى وأفكار <span className="text-gradient">تقنية</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            مقالات متخصصة عن أحدث تقنيات تطوير الويب، تطبيقات الجوال، السيو، والبنية السحابية — باللغة العربية.
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-x">
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="block group relative overflow-hidden rounded-3xl glass glow-border"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[4/3] md:aspect-auto cover-mesh grid place-items-center p-10">
                <span className="text-6xl font-black text-gradient opacity-50">★</span>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block w-fit text-xs font-bold text-brand tracking-widest uppercase mb-3">مقال مميّز • {featured.category}</span>
                <h2 className="text-3xl md:text-4xl font-black mb-4 group-hover:text-brand transition">{featured.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {featured.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {blogCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  cat === c ? "bg-[var(--gradient-brand)] text-primary-foreground" : "glass hover:text-brand"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group glass rounded-2xl overflow-hidden hover:border-brand/50 hover:translate-y-[-4px] transition-all"
              >
                <div className="aspect-[16/9] cover-mesh grid place-items-center">
                  <span className="text-4xl font-black text-gradient opacity-40">#{p.category[0]}</span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-brand">{p.category}</span>
                  <h3 className="text-lg font-bold mt-2 mb-3 group-hover:text-brand transition line-clamp-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.readTime}</span>
                    <span className="text-brand inline-flex items-center gap-1 font-semibold">قراءة <ArrowLeft className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
