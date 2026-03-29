"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import ProtectedRoute from "../components/ProtectedRoute";

const partnerLinks = [
  { name: "My Portal", href: "/partner" },
  { name: "My Clients", href: "/partner/clients" },
  { name: "Settings", href: "/partner/settings" },
];

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["partner"]}>
      <div className="dashboard-interactive flex h-screen bg-slate-100 text-slate-800">
        <Sidebar
          role="partner"
          links={partnerLinks}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

