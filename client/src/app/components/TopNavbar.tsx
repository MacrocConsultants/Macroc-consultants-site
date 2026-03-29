"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, User as UserIcon, Menu } from "lucide-react";

export default function TopNavbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:h-20 md:px-8">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden w-56 items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 sm:flex md:w-72">
          <Search size={18} className="mr-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative text-slate-400 transition hover:text-slate-600">
          <Bell size={20} />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 md:block" />

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-blue-600 shadow-sm md:h-10 md:w-10">
            <UserIcon size={18} />
          </div>
          <div className="hidden md:block">
            <p className="leading-tight text-sm font-bold text-slate-800">{user?.name || "Loading..."}</p>
            <p className="text-xs font-medium capitalize text-slate-500">{user?.role || "User"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 md:px-3"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
