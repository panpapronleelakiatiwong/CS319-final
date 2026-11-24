import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { useUiStore } from "../stores/uiStore";
import { CloseIcon, LogoMark, MenuIcon } from "./home/icons";

const links = [
  { to: "/", label: "หน้าแรก", end: true },
  { to: "/items", label: "วัสดุเหลือใช้" },
  { to: "/cases", label: "เคสซ่อมบ้าน" },
  { to: "/dashboard", label: "จัดการระบบ" },
];

export default function Layout() {
  const toast = useUiStore((s) => s.toast);
  const clearToast = useUiStore((s) => s.clearToast);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // ปิดเมนูมือถือเมื่อเปลี่ยนหน้า
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3500);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 bg-forest-600 text-stone-100 shadow-[0_2px_12px_-4px_rgba(11,15,9,0.5)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <LogoMark className="h-9 w-9 shrink-0" />
            <span className="truncate text-base font-bold text-stone-50 sm:text-lg">ธนาคารเศษวัสดุก่อสร้าง</span>
          </Link>
          <nav className="hidden gap-1 text-sm md:flex" aria-label="เมนูหลัก">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-1.5 transition ${isActive ? "bg-sand-300 font-semibold text-forest-800" : "text-stone-200 hover:bg-forest-500"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-xl text-stone-100 hover:bg-forest-500 md:hidden"
            aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-forest-500 px-4 pb-4 pt-2 md:hidden" aria-label="เมนูหลัก (มือถือ)">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `mt-1 block rounded-xl px-4 py-2.5 ${isActive ? "bg-sand-300 font-semibold text-forest-800" : "text-stone-200 hover:bg-forest-500"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-stone-950 py-4 text-center text-xs text-sage-300">
        Community Material Upcycling Bank — ส่งต่อเศษวัสดุ ซ่อมบ้านให้คนในชุมชน
      </footer>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 left-1/2 z-20 max-w-[90vw] -translate-x-1/2 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
            toast.type === "success" ? "bg-forest-600" : "bg-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
