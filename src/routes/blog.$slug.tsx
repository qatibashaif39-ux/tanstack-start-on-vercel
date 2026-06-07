import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { posts } from "@/data/posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
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
        { property: "article:published_time", content: p.date },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:url", content: `/blog/${p.slug}` },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: p.excerpt },
      ],
      links: [{ rel: "canonical", href: `/blog/${p.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.date,
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

function PostPage() {
  const { post: p } = Route.useLoaderData();
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="pt-32 pb-24">
        <div className="container-x max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand mb-8">
            <ArrowRight className="w-4 h-4" /> كل المقالات
          </Link>

          <span className="inline-block text-xs font-bold text-brand tracking-widest uppercase mb-4">{p.category}</span>
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{p.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">{p.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border mb-8">
            <span className="flex items-center gap-2"><User className="w-4 h-4 text-brand" /> {p.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand" /> {p.date}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand" /> {p.readTime}</span>
          </div>

          <div className="aspect-[16/9] rounded-3xl cover-mesh grid place-items-center mb-12 glow-border">
            <span className="text-7xl font-black text-gradient opacity-50">{p.category[0]}</span>
          </div>

          <div className="space-y-6">
            {p.content.map((block, i) => (
              <div key={i}>
                {block.heading && <h2 className="text-2xl md:text-3xl font-black mt-10 mb-4">{block.heading}</h2>}
                <p className="text-lg text-muted-foreground leading-loose">{block.paragraph}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="px-4 py-1.5 rounded-full glass text-sm">#{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="container-x max-w-5xl mt-20">
          <h3 className="text-2xl md:text-3xl font-black mb-8">مقالات ذات صلة</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="group glass rounded-2xl overflow-hidden hover:border-brand/50 transition">
                <div className="aspect-[16/9] cover-mesh grid place-items-center">
                  <span className="text-3xl font-black text-gradient opacity-40">#{r.category[0]}</span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-brand">{r.category}</span>
                  <h4 className="text-base font-bold mt-2 group-hover:text-brand transition line-clamp-2">{r.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
