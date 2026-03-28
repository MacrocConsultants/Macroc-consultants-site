"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, User as UserIcon } from "lucide-react";

export default function TopNavbar() {
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
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-72 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <Search size={18} className="text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-slate-600 transition">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm">
            <UserIcon size={18} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || "Loading..."}</p>
            <p className="text-xs text-slate-500 font-medium capitalize">{user?.role || "User"}</p>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}