import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { listPosts } from "@/lib/content.functions";

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
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["posts"], queryFn: () => listPosts() }),
  component: BlogPage,
});

function BlogPage() {
  const fetchPosts = useServerFn(listPosts);
  const { data } = useQuery({ queryKey: ["posts"], queryFn: () => fetchPosts() });
  const posts = data ?? [];

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["الكل", ...Array.from(set)];
  }, [posts]);

  const [tag, setTag] = useState("الكل");
  const filtered = tag === "الكل" ? posts : posts.filter((p) => p.tags.includes(tag));
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

      {featured && (
        <section className="pb-12">
          <div className="container-x">
            <Link to="/blog/$slug" params={{ slug: featured.slug }} className="block group relative overflow-hidden rounded-3xl glass glow-border">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-[4/3] md:aspect-auto cover-mesh grid place-items-center p-10">
                  {featured.cover ? <img src={featured.cover} alt={featured.title} loading="lazy" className="w-full h-full object-cover" /> : <span className="text-6xl font-black text-gradient opacity-50">★</span>}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block w-fit text-xs font-bold text-brand tracking-widest uppercase mb-3">مقال مميّز</span>
                  <h2 className="text-3xl md:text-4xl font-black mb-4 group-hover:text-brand transition">{featured.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {featured.published_at.slice(0, 10)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.read_time}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="pb-24">
        <div className="container-x">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {allTags.map((c) => (
              <button key={c} onClick={() => setTag(c)} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${tag === c ? "bg-[var(--gradient-brand)] text-primary-foreground" : "glass hover:text-brand"}`}>{c}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group glass rounded-2xl overflow-hidden hover:border-brand/50 hover:translate-y-[-4px] transition-all">
                <div className="aspect-[16/9] cover-mesh grid place-items-center">
                  {p.cover ? <img src={p.cover} alt={p.title} loading="lazy" className="w-full h-full object-cover" /> : <span className="text-4xl font-black text-gradient opacity-40">#</span>}
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-brand">{p.tags[0] ?? "مقال"}</span>
                  <h3 className="text-lg font-bold mt-2 mb-3 group-hover:text-brand transition line-clamp-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.read_time}</span>
                    <span className="text-brand inline-flex items-center gap-1 font-semibold">قراءة <ArrowLeft className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {!filtered.length && <p className="text-center text-muted-foreground py-12">لا توجد مقالات.</p>}
        </div>
      </section>

      <Footer />
    </div>
  );
}
