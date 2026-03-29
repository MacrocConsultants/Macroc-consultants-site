"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Users,
  FileText,
  LayoutDashboard,
  Settings,
  X,
} from "lucide-react";

const iconMap: any = {
  Dashboard: LayoutDashboard,
  "My Portal": LayoutDashboard,
  "Manage Clients": Users,
  Messages: FileText,
  Partners: Users,
  Users: Users,
  "My Clients": Users,
  "My Documents": FileText,
  "CMS Editor": FileText,
  Settings: Settings,
  default: Building2,
};

type LinkType = {
  name: string;
  href: string;
};

export default function Sidebar({
  role = "admin",
  links = [],
  isOpen = false,
  onClose,
}: {
  role?: string;
  links?: LinkType[];
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-900 text-slate-300 shadow-2xl transition-transform duration-300 md:static md:z-20 md:w-64 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30">
              B
            </div>
            <span className="text-base font-bold capitalize text-white md:text-lg">
              {role} Portal
            </span>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5 md:py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>

          {links.length === 0 && <p className="px-3 text-sm text-slate-500">No menu items</p>}

          {links.map((l) => {
            const Icon = iconMap[l.name] || iconMap.default;
            const baseHref = l.href.split("#")[0];
            const isActive = pathname === baseHref || pathname.startsWith(baseHref);

            return (
              <Link
                key={l.name}
                href={l.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                {l.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4 text-center text-xs text-slate-500 md:p-5">
          &copy; {new Date().getFullYear()} BOD System
        </div>
      </aside>
    </>
  );
}
