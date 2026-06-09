import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Check for the admin session cookie (set on login)
    const isAuthenticated = document.cookie.includes("admin_session=authenticated");
    if (!isAuthenticated) throw redirect({ to: "/auth" });
    return { user: { id: "admin", email: "Belal@admin.com" } };
  },
  component: () => <Outlet />,
});
