import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getPost } from "@/lib/content.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "مقال غير موجود" }] };
    return {
      meta: [
        { title: `${p.title} — مدونة كود كرافت` },
        { name: "description", content: p.excerpt },
        { name: "keywords", content: p.tags.join(", ") },
        { name: "author", content: p.author },
        { property: "article:published_time", content: p.published_at },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:url", content: `/blog/${p.slug}` },
        { property: "og:type", content: "article" },
        ...(p.cover ? [{ property: "og:image", content: p.cover }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/blog/${p.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.published_at,
          author: { "@type": "Organization", name: p.author },
          publisher: { "@type": "Organization", name: "CodeCraft" },
          inLanguage: "ar",
          keywords: p.tags.join(", "),
        }),
      }],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-4">المقال غير موجود</h1>
        <Link to="/blog" className="text-brand">العودة للمدونة</Link>
      </div>
    </div>
  ),
});

function renderContent(text: string) {
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) return <h2 key={i} className="text-2xl md:text-3xl font-black mt-10 mb-4">{block.slice(3)}</h2>;
    if (block.startsWith("# ")) return <h2 key={i} className="text-2xl md:text-3xl font-black mt-10 mb-4">{block.slice(2)}</h2>;
    return <p key={i} className="text-lg text-muted-foreground leading-loose">{block}</p>;
  });
}

function PostPage() {
  const { post: p } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="pt-32 pb-24">
        <div className="container-x max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand mb-8">
            <ArrowRight className="w-4 h-4" /> كل المقالات
          </Link>

          {p.tags[0] && <span className="inline-block text-xs font-bold text-brand tracking-widest uppercase mb-4">{p.tags[0]}</span>}
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{p.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">{p.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border mb-8">
            <span className="flex items-center gap-2"><User className="w-4 h-4 text-brand" /> {p.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand" /> {p.published_at.slice(0, 10)}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand" /> {p.read_time}</span>
          </div>

          <div className="aspect-[16/9] rounded-3xl cover-mesh grid place-items-center mb-12 glow-border overflow-hidden">
            {p.cover ? <img src={p.cover} alt={p.title} className="w-full h-full object-cover" loading="lazy" /> : <span className="text-7xl font-black text-gradient opacity-50">★</span>}
          </div>

          <div className="space-y-4">{renderContent(p.content)}</div>

          {p.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t: string) => <span key={t} className="px-4 py-1.5 rounded-full glass text-sm">#{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
}
