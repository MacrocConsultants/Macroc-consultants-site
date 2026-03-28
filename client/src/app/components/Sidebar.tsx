"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Users,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

// Icon mapping
const iconMap: any = {
  Dashboard: LayoutDashboard,
  "My Portal": LayoutDashboard,
  "Manage Clients": Users,
  Messages: FileText,
  Partners: Users,
  Users: Users,
  "My Clients": Users,
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
}: {
  role?: string;
  links?: LinkType[];
}) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col shadow-2xl z-20 hidden md:flex">
      
      {/* HEADER */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
          B
        </div>
        <span className="text-lg font-bold text-white capitalize">
          {role} Portal
        </span>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
          Menu
        </p>

        {links.length === 0 && (
          <p className="text-slate-500 text-sm px-3">
            No menu items
          </p>
        )}

        {links.map((l) => {
          const Icon = iconMap[l.name] || iconMap["default"];
          const baseHref = l.href.split("#")[0];
          const isActive =
            pathname === baseHref || pathname.startsWith(baseHref);

          return (
            <Link
              key={l.name}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon
                size={18}
                className={
                  isActive ? "text-white" : "text-slate-400"
                }
              />
              {l.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-5 border-t border-slate-800 text-xs text-slate-500 text-center">
        &copy; {new Date().getFullYear()} BOD System
      </div>
    </div>
  );
}
