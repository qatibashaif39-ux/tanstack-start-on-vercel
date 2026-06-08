import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

// ---------- Public reads (use admin client to bypass RLS for SSR/anon) ----------

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ProjectRow[];
});

export const getProject = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row as ProjectRow | null;
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PostRow[];
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row as PostRow | null;
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
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });
    if (error) throw new Error(error.message);

    // Send notification email via Lovable AI Gateway -> Resend connector if configured.
    // Fail silently (do not block submission) if email is not configured.
    const lovableKey = process.env.LOVABLE_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (lovableKey && resendKey) {
      try {
        await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": resendKey,
          },
          body: JSON.stringify({
            from: "CodeCraft <onboarding@resend.dev>",
            to: ["bilalshaif@gmail.com"],
            subject: `طلب جديد من ${data.name}${data.subject ? ` — ${data.subject}` : ""}`,
            html: `
              <div style="font-family:Tajawal,Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
                <h2 style="color:#0F4C75">رسالة جديدة من موقع كود كرافت</h2>
                <p><b>الاسم:</b> ${escapeHtml(data.name)}</p>
                <p><b>البريد:</b> ${escapeHtml(data.email)}</p>
                ${data.phone ? `<p><b>الهاتف:</b> ${escapeHtml(data.phone)}</p>` : ""}
                ${data.subject ? `<p><b>الموضوع:</b> ${escapeHtml(data.subject)}</p>` : ""}
                <hr/>
                <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
              </div>`,
          }),
        });
      } catch (e) {
        console.error("[contact] email notify failed", e);
      }
    }

    return { ok: true };
  });

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

// ---------- Admin operations (require admin role) ----------

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

const projectInputSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, "slug must be lowercase a-z 0-9 -"),
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
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ProjectRow[];
  });

export const adminSaveProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid().optional(), values: projectInputSchema }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin.from("projects").update(data.values).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("projects").insert(data.values);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const postInputSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, "slug must be lowercase a-z 0-9 -"),
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
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as PostRow[];
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid().optional(), values: postInputSchema }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin.from("posts").update(data.values).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("posts").insert(data.values);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateMessageStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "read", "archived"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Check current user's admin status (for UI gate)
export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId: context.userId };
  });
