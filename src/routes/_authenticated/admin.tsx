import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Code2, LogOut, FileText, FolderKanban, MessageSquare,
  Plus, Trash2, Edit3, Save, X, Eye, EyeOff, Shield,
} from "lucide-react";
import {
  getIsAdmin,
  adminListProjects, adminSaveProject, adminDeleteProject,
  adminListPosts, adminSavePost, adminDeletePost,
  adminListMessages, adminUpdateMessageStatus, adminDeleteMessage,
  type ProjectRow, type PostRow,
} from "@/lib/content.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — كود كرافت" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "projects" | "posts" | "messages";

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("projects");
  const checkAdmin = useServerFn(getIsAdmin);
  const adminQ = useQuery({ queryKey: ["is-admin"], queryFn: () => checkAdmin() });

  const signOut = async () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    navigate({ to: "/auth" });
  };

  if (adminQ.isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">جارٍ التحقق…</div>;
  }
  if (!adminQ.data?.isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md glass rounded-2xl p-8 text-center">
          <Shield className="w-12 h-12 mx-auto text-brand mb-4" />
          <h1 className="text-2xl font-black mb-2">لا تملك صلاحية المدير</h1>
          <p className="text-sm text-muted-foreground mb-2">
            حسابك مسجّل لكن دون صلاحية إدارة. لِترقية حسابك إلى مدير، أدخل المعرّف التالي في قاعدة البيانات (جدول <code>user_roles</code> مع <code>role = 'admin'</code>):
          </p>
          <div className="my-4 p-3 rounded-lg bg-surface text-xs font-mono break-all">{adminQ.data?.userId}</div>
          <button onClick={signOut} className="rounded-full glass px-5 py-2 text-sm">خروج</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container-x flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-display font-extrabold">
            <div className="w-9 h-9 rounded-xl bg-[var(--gradient-brand)] grid place-items-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>لوحة الإدارة</span>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm glass rounded-full px-4 py-2 hover:text-brand transition">
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </header>

      <div className="container-x py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <TabBtn active={tab === "projects"} onClick={() => setTab("projects")} icon={FolderKanban} label="المشاريع" />
          <TabBtn active={tab === "posts"} onClick={() => setTab("posts")} icon={FileText} label="المقالات" />
          <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} icon={MessageSquare} label="الرسائل" />
        </div>

        {tab === "projects" && <ProjectsTab />}
        {tab === "posts" && <PostsTab />}
        {tab === "messages" && <MessagesTab />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${active ? "bg-[var(--gradient-brand)] text-primary-foreground shadow-[var(--shadow-glow)]" : "glass hover:text-brand"}`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

// ============= Projects =============

function ProjectsTab() {
  const qc = useQueryClient();
  const list = useServerFn(adminListProjects);
  const save = useServerFn(adminSaveProject);
  const del = useServerFn(adminDeleteProject);

  const q = useQuery({ queryKey: ["admin-projects"], queryFn: () => list() });
  const [editing, setEditing] = useState<ProjectRow | "new" | null>(null);

  const saveMut = useMutation({
    mutationFn: (vars: { id?: string; values: any }) => save({ data: vars }),
    onSuccess: () => { toast.success("تم الحفظ"); qc.invalidateQueries({ queryKey: ["admin-projects"] }); setEditing(null); },
    onError: (e: any) => toast.error(e?.message ?? "فشل الحفظ"),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { toast.success("تم الحذف"); qc.invalidateQueries({ queryKey: ["admin-projects"] }); },
    onError: (e: any) => toast.error(e?.message ?? "فشل الحذف"),
  });

  if (editing) {
    return <ProjectForm initial={editing === "new" ? null : editing} onCancel={() => setEditing(null)} onSave={(values, id) => saveMut.mutate({ id, values })} saving={saveMut.isPending} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">المشاريع ({q.data?.length ?? 0})</h2>
        <button onClick={() => setEditing("new")} className="flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:shadow-[var(--shadow-glow)] transition">
          <Plus className="w-4 h-4" /> مشروع جديد
        </button>
      </div>
      <div className="space-y-3">
        {q.data?.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {p.published ? <Eye className="w-3.5 h-3.5 text-brand" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className="text-xs text-brand font-bold">{p.category}</span>
                <span className="text-xs text-muted-foreground">/{p.slug}</span>
              </div>
              <div className="font-bold">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1 truncate">{p.excerpt}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p)} className="glass rounded-lg p-2 hover:text-brand transition"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm("حذف هذا المشروع؟")) delMut.mutate(p.id); }} className="glass rounded-lg p-2 hover:text-destructive transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!q.data?.length && <p className="text-center text-muted-foreground py-12">لا توجد مشاريع.</p>}
      </div>
    </div>
  );
}

function ProjectForm({ initial, onCancel, onSave, saving }: { initial: ProjectRow | null; onCancel: () => void; onSave: (v: any, id?: string) => void; saving: boolean }) {
  const [f, setF] = useState({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    category: initial?.category ?? "web",
    excerpt: initial?.excerpt ?? "",
    description: initial?.description ?? "",
    cover: initial?.cover ?? "",
    tags: (initial?.tags ?? []).join(", "),
    client: initial?.client ?? "",
    year: initial?.year ?? new Date().getFullYear().toString(),
    url: initial?.url ?? "",
    published: initial?.published ?? true,
    sort_order: initial?.sort_order ?? 0,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...f, tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean) }, initial?.id); }}
      className="glass rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-black">{initial ? "تعديل مشروع" : "مشروع جديد"}</h2>
      <Grid2>
        <Field label="العنوان"><input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={inputCls} /></Field>
        <Field label="المعرّف (slug)"><input required value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} pattern="[a-z0-9-]+" className={inputCls} /></Field>
        <Field label="الفئة">
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={inputCls}>
            <option value="web">ويب</option><option value="mobile">جوال</option><option value="ecommerce">متاجر</option><option value="cloud">سحابة</option><option value="ui">تصميم</option>
          </select>
        </Field>
        <Field label="العميل"><input value={f.client} onChange={(e) => setF({ ...f, client: e.target.value })} className={inputCls} /></Field>
        <Field label="السنة"><input value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })} className={inputCls} /></Field>
        <Field label="رابط المشروع"><input value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} className={inputCls} /></Field>
      </Grid2>
      <Field label="رابط صورة الغلاف (URL)"><input value={f.cover} onChange={(e) => setF({ ...f, cover: e.target.value })} className={inputCls} placeholder="https://…" /></Field>
      <Field label="وصف مختصر"><textarea rows={2} value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} className={inputCls} /></Field>
      <Field label="الوصف الكامل"><textarea rows={5} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={inputCls} /></Field>
      <Field label="الوسوم (مفصولة بفاصلة)"><input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} className={inputCls} placeholder="React, TypeScript" /></Field>
      <Grid2>
        <Field label="الترتيب"><input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: parseInt(e.target.value || "0") })} className={inputCls} /></Field>
        <label className="flex items-center gap-2 mt-7">
          <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> منشور
        </label>
      </Grid2>
      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  );
}

// ============= Posts =============

function PostsTab() {
  const qc = useQueryClient();
  const list = useServerFn(adminListPosts);
  const save = useServerFn(adminSavePost);
  const del = useServerFn(adminDeletePost);

  const q = useQuery({ queryKey: ["admin-posts"], queryFn: () => list() });
  const [editing, setEditing] = useState<PostRow | "new" | null>(null);

  const saveMut = useMutation({
    mutationFn: (vars: { id?: string; values: any }) => save({ data: vars }),
    onSuccess: () => { toast.success("تم الحفظ"); qc.invalidateQueries({ queryKey: ["admin-posts"] }); setEditing(null); },
    onError: (e: any) => toast.error(e?.message ?? "فشل الحفظ"),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { toast.success("تم الحذف"); qc.invalidateQueries({ queryKey: ["admin-posts"] }); },
    onError: (e: any) => toast.error(e?.message ?? "فشل الحذف"),
  });

  if (editing) {
    return <PostForm initial={editing === "new" ? null : editing} onCancel={() => setEditing(null)} onSave={(values, id) => saveMut.mutate({ id, values })} saving={saveMut.isPending} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">المقالات ({q.data?.length ?? 0})</h2>
        <button onClick={() => setEditing("new")} className="flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:shadow-[var(--shadow-glow)] transition">
          <Plus className="w-4 h-4" /> مقال جديد
        </button>
      </div>
      <div className="space-y-3">
        {q.data?.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {p.published ? <Eye className="w-3.5 h-3.5 text-brand" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className="text-xs text-muted-foreground">/{p.slug}</span>
                <span className="text-xs text-muted-foreground">• {p.read_time}</span>
              </div>
              <div className="font-bold">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1 truncate">{p.excerpt}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p)} className="glass rounded-lg p-2 hover:text-brand transition"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm("حذف هذا المقال؟")) delMut.mutate(p.id); }} className="glass rounded-lg p-2 hover:text-destructive transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!q.data?.length && <p className="text-center text-muted-foreground py-12">لا توجد مقالات.</p>}
      </div>
    </div>
  );
}

function PostForm({ initial, onCancel, onSave, saving }: { initial: PostRow | null; onCancel: () => void; onSave: (v: any, id?: string) => void; saving: boolean }) {
  const [f, setF] = useState({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    cover: initial?.cover ?? "",
    tags: (initial?.tags ?? []).join(", "),
    author: initial?.author ?? "فريق كود كرافت",
    read_time: initial?.read_time ?? "5 دقائق",
    published: initial?.published ?? true,
    published_at: (initial?.published_at ?? new Date().toISOString()).slice(0, 10),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...f, tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean), published_at: new Date(f.published_at).toISOString() }, initial?.id); }}
      className="glass rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-black">{initial ? "تعديل مقال" : "مقال جديد"}</h2>
      <Grid2>
        <Field label="العنوان"><input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={inputCls} /></Field>
        <Field label="المعرّف (slug)"><input required value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} pattern="[a-z0-9-]+" className={inputCls} /></Field>
        <Field label="المؤلف"><input value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} className={inputCls} /></Field>
        <Field label="مدة القراءة"><input value={f.read_time} onChange={(e) => setF({ ...f, read_time: e.target.value })} className={inputCls} /></Field>
        <Field label="تاريخ النشر"><input type="date" value={f.published_at} onChange={(e) => setF({ ...f, published_at: e.target.value })} className={inputCls} /></Field>
        <Field label="رابط صورة الغلاف"><input value={f.cover} onChange={(e) => setF({ ...f, cover: e.target.value })} className={inputCls} /></Field>
      </Grid2>
      <Field label="مقتطف"><textarea rows={2} value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} className={inputCls} /></Field>
      <Field label="المحتوى (Markdown مبسّط — استخدم ## للعناوين الفرعية)">
        <textarea rows={12} value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} className={inputCls} />
      </Field>
      <Field label="الوسوم (مفصولة بفاصلة)"><input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} className={inputCls} /></Field>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> منشور
      </label>
      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  );
}

// ============= Messages =============

function MessagesTab() {
  const qc = useQueryClient();
  const list = useServerFn(adminListMessages);
  const upd = useServerFn(adminUpdateMessageStatus);
  const del = useServerFn(adminDeleteMessage);

  const q = useQuery({ queryKey: ["admin-msgs"], queryFn: () => list() });
  const updMut = useMutation({
    mutationFn: (v: { id: string; status: "new" | "read" | "archived" }) => upd({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-msgs"] }),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { toast.success("تم الحذف"); qc.invalidateQueries({ queryKey: ["admin-msgs"] }); },
  });

  return (
    <div>
      <h2 className="text-2xl font-black mb-6">رسائل التواصل ({q.data?.length ?? 0})</h2>
      <div className="space-y-3">
        {q.data?.map((m: any) => (
          <div key={m.id} className={`glass rounded-xl p-5 ${m.status === "new" ? "border-brand/50" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-xs text-brand hover:underline">{m.email}</a>
                  {m.status === "new" && <span className="text-xs bg-brand/20 text-brand px-2 py-0.5 rounded-full">جديد</span>}
                </div>
                {m.phone && <div className="text-xs text-muted-foreground mt-1">{m.phone}</div>}
                {m.subject && <div className="text-sm font-semibold mt-2">{m.subject}</div>}
              </div>
              <div className="flex gap-2 text-xs">
                {m.status !== "read" && <button onClick={() => updMut.mutate({ id: m.id, status: "read" })} className="glass rounded-lg px-3 py-1">قراءة</button>}
                {m.status !== "archived" && <button onClick={() => updMut.mutate({ id: m.id, status: "archived" })} className="glass rounded-lg px-3 py-1">أرشفة</button>}
                <button onClick={() => { if (confirm("حذف؟")) delMut.mutate(m.id); }} className="glass rounded-lg px-3 py-1 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{m.message}</p>
            <div className="text-xs text-muted-foreground mt-3">{new Date(m.created_at).toLocaleString("ar")}</div>
          </div>
        ))}
        {!q.data?.length && <p className="text-center text-muted-foreground py-12">لا توجد رسائل.</p>}
      </div>
    </div>
  );
}

// ============= Shared form bits =============

const inputCls = "w-full glass rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-muted-foreground block mb-1.5">{label}</span>{children}</label>;
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}
function FormActions({ onCancel, saving }: { onCancel: () => void; saving: boolean }) {
  return (
    <div className="flex gap-2 pt-2">
      <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] text-primary-foreground px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
        <Save className="w-4 h-4" /> حفظ
      </button>
      <button type="button" onClick={onCancel} className="flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm">
        <X className="w-4 h-4" /> إلغاء
      </button>
    </div>
  );
}
