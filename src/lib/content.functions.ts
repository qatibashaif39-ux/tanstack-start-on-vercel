import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  description: string;
  cover: string;
  tags: string[];
  client: string | null;
  year: string | null;
  url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  tags: string[];
  author: string;
  read_time: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

function parseTags(tagsStr: unknown): string[] {
  if (Array.isArray(tagsStr)) return tagsStr;
  if (typeof tagsStr === "string") {
    try { return JSON.parse(tagsStr); } catch { return []; }
  }
  return [];
}

function rowToProject(r: any): ProjectRow {
  return { ...r, published: r.published === 1 || r.published === true, tags: parseTags(r.tags) };
}

function rowToPost(r: any): PostRow {
  return { ...r, published: r.published === 1 || r.published === true, tags: parseTags(r.tags) };
}

// ---------- Public reads ----------

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb } = await import("@/lib/db.server");
  const db = getDb();
  const rows = db.prepare("SELECT * FROM projects WHERE published = 1 ORDER BY sort_order DESC, created_at DESC").all() as any[];
  return rows.map(rowToProject) as ProjectRow[];
});

export const getProject = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    const row = db.prepare("SELECT * FROM projects WHERE slug = ? AND published = 1").get(data.slug) as any;
    if (!row) return null;
    return rowToProject(row) as ProjectRow;
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb } = await import("@/lib/db.server");
  const db = getDb();
  const rows = db.prepare("SELECT * FROM posts WHERE published = 1 ORDER BY published_at DESC").all() as any[];
  return rows.map(rowToPost) as PostRow[];
});

export const getPost = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    const row = db.prepare("SELECT * FROM posts WHERE slug = ? AND published = 1").get(data.slug) as any;
    if (!row) return null;
    return rowToPost(row) as PostRow;
  });

// ---------- Contact form submission (public) ----------

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().default(""),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(10).max(2000),
});

export const submitContact = createServerFn({ method: "POST" })
  .validator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    db.prepare("INSERT INTO contact_messages (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)")
      .run(crypto.randomUUID(), data.name, data.email, data.phone ?? "", data.subject ?? "", data.message);
    return { ok: true };
  });

// ---------- Admin operations ----------

const projectInputSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(40),
  excerpt: z.string().trim().max(500).default(""),
  description: z.string().trim().max(5000).default(""),
  cover: z.string().trim().max(500).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  client: z.string().trim().max(120).default(""),
  year: z.string().trim().max(10).default(""),
  url: z.string().trim().max(500).default(""),
  published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const adminListProjects = createServerFn({ method: "GET" })
  .handler(async () => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    const rows = db.prepare("SELECT * FROM projects ORDER BY sort_order DESC, created_at DESC").all() as any[];
    return rows.map(rowToProject) as ProjectRow[];
  });

export const adminSaveProject = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ id: z.string().optional(), values: projectInputSchema }).parse(d),
  )
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    const v = data.values;
    if (data.id) {
      db.prepare(`UPDATE projects SET slug=?,title=?,category=?,excerpt=?,description=?,cover=?,tags=?,client=?,year=?,url=?,published=?,sort_order=?,updated_at=datetime('now') WHERE id=?`)
        .run(v.slug, v.title, v.category, v.excerpt, v.description, v.cover, JSON.stringify(v.tags), v.client, v.year, v.url, v.published ? 1 : 0, v.sort_order, data.id);
    } else {
      db.prepare(`INSERT INTO projects (id,slug,title,category,excerpt,description,cover,tags,client,year,url,published,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .run(crypto.randomUUID(), v.slug, v.title, v.category, v.excerpt, v.description, v.cover, JSON.stringify(v.tags), v.client, v.year, v.url, v.published ? 1 : 0, v.sort_order);
    }
    return { ok: true };
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    db.prepare("DELETE FROM projects WHERE id = ?").run(data.id);
    return { ok: true };
  });

const postInputSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(500).default(""),
  content: z.string().trim().max(50000).default(""),
  cover: z.string().trim().max(500).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  author: z.string().trim().max(80).default("فريق كود كرافت"),
  read_time: z.string().trim().max(30).default("5 دقائق"),
  published: z.boolean().default(true),
  published_at: z.string().default(() => new Date().toISOString()),
});

export const adminListPosts = createServerFn({ method: "GET" })
  .handler(async () => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    const rows = db.prepare("SELECT * FROM posts ORDER BY published_at DESC").all() as any[];
    return rows.map(rowToPost) as PostRow[];
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ id: z.string().optional(), values: postInputSchema }).parse(d),
  )
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    const v = data.values;
    if (data.id) {
      db.prepare(`UPDATE posts SET slug=?,title=?,excerpt=?,content=?,cover=?,tags=?,author=?,read_time=?,published=?,published_at=?,updated_at=datetime('now') WHERE id=?`)
        .run(v.slug, v.title, v.excerpt, v.content, v.cover, JSON.stringify(v.tags), v.author, v.read_time, v.published ? 1 : 0, v.published_at, data.id);
    } else {
      db.prepare(`INSERT INTO posts (id,slug,title,excerpt,content,cover,tags,author,read_time,published,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
        .run(crypto.randomUUID(), v.slug, v.title, v.excerpt, v.content, v.cover, JSON.stringify(v.tags), v.author, v.read_time, v.published ? 1 : 0, v.published_at);
    }
    return { ok: true };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    db.prepare("DELETE FROM posts WHERE id = ?").run(data.id);
    return { ok: true };
  });

export const adminListMessages = createServerFn({ method: "GET" })
  .handler(async () => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    return db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all();
  });

export const adminUpdateMessageStatus = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ id: z.string(), status: z.enum(["new", "read", "archived"]) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    db.prepare("UPDATE contact_messages SET status = ? WHERE id = ?").run(data.status, data.id);
    return { ok: true };
  });

export const adminDeleteMessage = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { getDb } = await import("@/lib/db.server");
    const db = getDb();
    db.prepare("DELETE FROM contact_messages WHERE id = ?").run(data.id);
    return { ok: true };
  });

// Always returns isAdmin: true on the server (auth guard is client-side cookie)
export const getIsAdmin = createServerFn({ method: "GET" })
  .handler(async () => {
    return { isAdmin: true };
  });
