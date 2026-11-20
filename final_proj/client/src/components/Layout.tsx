import { useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import { useUiStore } from "../stores/uiStore";

const links = [
  { to: "/", label: "หน้าแรก", end: true },
  { to: "/items", label: "วัสดุเหลือใช้" },
  { to: "/cases", label: "เคสซ่อมบ้าน" },
  { to: "/dashboard", label: "จัดการระบบ" },
];

export default function Layout() {
  const toast = useUiStore((s) => s.toast);
  const clearToast = useUiStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3500);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <span className="text-lg font-bold text-emerald-700">🧱 ธนาคารเศษวัสดุก่อสร้าง</span>
          <nav className="flex flex-wrap gap-1 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 ${isActive ? "bg-emerald-600 text-white" : "text-stone-600 hover:bg-stone-100"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 py-4 text-center text-xs text-stone-400">
        Community Material Upcycling Bank — ส่งต่อเศษวัสดุ ซ่อมบ้านให้คนในชุมชน
      </footer>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 left-1/2 z-20 max-w-[90vw] -translate-x-1/2 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
            toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
