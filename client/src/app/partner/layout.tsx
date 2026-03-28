"use client";

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
  return (
    <ProtectedRoute allowedRoles={["partner"]}>
      <div className="flex h-screen bg-slate-100 text-slate-800">
        
        <Sidebar role="partner" links={partnerLinks} />

        <div className="flex-1 flex flex-col">
          <TopNavbar />

          <main className="flex-1 overflow-y-auto p-6 md:p-10">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}