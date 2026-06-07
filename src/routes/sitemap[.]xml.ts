import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const staticEntries = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
          { path: "/works", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/blog", changefreq: "daily", priority: "0.9", lastmod: today },
        ];
        const workEntries = projects.map((p) => ({
          path: `/works/${p.slug}`, changefreq: "monthly", priority: "0.7", lastmod: today,
        }));
        const blogEntries = posts.map((p) => ({
          path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.7", lastmod: p.date,
        }));

        const all = [...staticEntries, ...workEntries, ...blogEntries];
        const urls = all.map((e) => `  <url>
    <loc>${BASE_URL}${e.path}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
