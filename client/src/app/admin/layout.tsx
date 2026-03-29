"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import ProtectedRoute from "../components/ProtectedRoute";

const adminLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Manage Clients", href: "/admin/clients" },
  { name: "Messages", href: "/admin/messages" },
  { name: "Partners", href: "/admin/partners" },
  { name: "CMS Editor", href: "/admin/content" },
  { name: "Service Content", href: "/admin/content#services-content" },
  { name: "Assign Clients", href: "/admin/assign" },
  { name: "Users", href: "/admin/users" },
  { name: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
      <div className="dashboard-interactive flex h-screen bg-slate-100 font-sans text-slate-800">
        <Sidebar
          role="admin"
          links={adminLinks}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

