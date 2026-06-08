import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { listProjects } from "@/lib/content.functions";

const projectCategories = [
  { id: "all", label: "الكل" },
  { id: "web", label: "ويب" },
  { id: "mobile", label: "جوال" },
  { id: "ecommerce", label: "متاجر" },
  { id: "cloud", label: "سحابة" },
] as const;

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: "أعمالنا — معرض مشاريع كود كرافت" },
      { name: "description", content: "استعرض مشاريع كود كرافت: تطبيقات ويب، تطبيقات جوال، متاجر إلكترونية، وحلول سحابية احترافية." },
      { property: "og:title", content: "أعمالنا — معرض مشاريع كود كرافت" },
      { property: "og:description", content: "نماذج حقيقية من مشاريع برمجية ساعدت عملاءنا على تحقيق نمو ملموس." },
      { property: "og:url", content: "/works" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/works" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["projects"], queryFn: () => listProjects() }),
  component: WorksPage,
});

function WorksPage() {
  const fetchProjects = useServerFn(listProjects);
  const { data } = useQuery({ queryKey: ["projects"], queryFn: () => fetchProjects() });
  const [filter, setFilter] = useState<string>("all");
  const projects = data ?? [];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="container-x text-center">
          <span className="inline-block text-xs font-bold text-brand tracking-widest uppercase mb-4">معرض الأعمال</span>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            مشاريع <span className="text-gradient">نفخر بها</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            مجموعة من المشاريع التي صنعناها مع عملائنا في قطاعات متنوعة. كل مشروع قصة نجاح بأرقام حقيقية.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {projectCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  filter === c.id
                    ? "bg-[var(--gradient-brand)] text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "glass hover:text-brand"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link
                key={p.slug}
                to="/works/$slug"
                params={{ slug: p.slug }}
                className="group relative overflow-hidden rounded-2xl glass hover:border-brand/50 transition-all hover:translate-y-[-4px]"
              >
                <div className="aspect-[4/3] cover-mesh relative overflow-hidden">
                  {p.cover ? (
                    <img src={p.cover} alt={p.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="text-5xl font-black text-gradient opacity-30">{p.year}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="glass px-3 py-1 rounded-full text-xs font-bold">{p.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand transition">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{p.client}</span>
                    <span className="text-brand inline-flex items-center gap-1 font-semibold">
                      التفاصيل <ArrowLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {!filtered.length && <p className="text-center text-muted-foreground py-12">لا توجد مشاريع في هذه الفئة.</p>}
        </div>
      </section>

      <Footer />
    </div>
  );
}
