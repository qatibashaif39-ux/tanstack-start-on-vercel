import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Calendar, Users, ExternalLink, Check } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getProject } from "@/lib/content.functions";

export const Route = createFileRoute("/works/$slug")({
  loader: async ({ params }) => {
    const project = await getProject({ data: { slug: params.slug } });
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "مشروع غير موجود" }] };
    return {
      meta: [
        { title: `${p.title} — كود كرافت` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:url", content: `/works/${p.slug}` },
        { property: "og:type", content: "article" },
        ...(p.cover ? [{ property: "og:image", content: p.cover }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/works/${p.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: p.title,
          description: p.excerpt,
          creator: { "@type": "Organization", name: "CodeCraft" },
          datePublished: p.year,
        }),
      }],
    };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-4">المشروع غير موجود</h1>
        <Link to="/works" className="text-brand">العودة للأعمال</Link>
      </div>
    </div>
  ),
});

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="pt-32 pb-24">
        <div className="container-x max-w-5xl">
          <Link to="/works" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand mb-8">
            <ArrowRight className="w-4 h-4" /> كل الأعمال
          </Link>
          <span className="inline-block text-xs font-bold text-brand tracking-widest uppercase mb-4">{p.category}</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">{p.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl">{p.excerpt}</p>

          <div className="aspect-[16/9] rounded-3xl cover-mesh grid place-items-center mb-12 glow-border relative overflow-hidden">
            {p.cover ? (
              <img src={p.cover} alt={p.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            ) : (
              <span className="text-7xl md:text-9xl font-black text-gradient opacity-50">{p.year}</span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {p.client && (
              <div className="glass rounded-2xl p-6">
                <Users className="w-5 h-5 text-brand mb-2" />
                <div className="text-xs text-muted-foreground mb-1">العميل</div>
                <div className="font-bold">{p.client}</div>
              </div>
            )}
            {p.year && (
              <div className="glass rounded-2xl p-6">
                <Calendar className="w-5 h-5 text-brand mb-2" />
                <div className="text-xs text-muted-foreground mb-1">السنة</div>
                <div className="font-bold">{p.year}</div>
              </div>
            )}
            {p.url && (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="glass rounded-2xl p-6 hover:border-brand/50 transition">
                <ExternalLink className="w-5 h-5 text-brand mb-2" />
                <div className="text-xs text-muted-foreground mb-1">رابط المشروع</div>
                <div className="font-bold text-sm truncate">{p.url}</div>
              </a>
            )}
          </div>

          {p.description && (
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4">نظرة عامة</h2>
              <p className="text-lg text-muted-foreground leading-loose whitespace-pre-wrap">{p.description}</p>
            </section>
          )}

          {p.tags.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4">التقنيات المستخدمة</h2>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t: string) => <span key={t} className="px-4 py-2 rounded-full glass text-sm font-semibold">{t}</span>)}
              </div>
            </section>
          )}

          <div className="mt-16 glass glow-border rounded-3xl p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-black mb-4">هل لديك مشروع مشابه؟</h3>
            <p className="text-muted-foreground mb-6">دعنا نحوّل فكرتك إلى منتج رقمي ناجح.</p>
            <Link to="/" hash="contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-7 py-3.5 font-semibold text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all">
              <Check className="w-4 h-4" /> ابدأ مشروعك معنا
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
