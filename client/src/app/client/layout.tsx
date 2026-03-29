"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import ProtectedRoute from "../components/ProtectedRoute";

const clientLinks = [
  { name: "My Portal", href: "/client" },
  { name: "My Documents", href: "/client#documents" },
  { name: "Settings", href: "/client/settings" },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="dashboard-interactive flex h-screen bg-slate-100 font-sans text-slate-800">
        <Sidebar
          role="client"
          links={clientLinks}
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

