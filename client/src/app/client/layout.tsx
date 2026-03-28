"use client";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import ProtectedRoute from "../components/ProtectedRoute";

// 🔥 Scalable menu (we’ll later make this dynamic from DB)
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
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      
      {/* MAIN CONTAINER */}
      <div className="flex h-screen bg-slate-100 text-slate-800 font-sans">
        
        {/* SIDEBAR */}
        <Sidebar role="client" links={clientLinks} />

        {/* RIGHT SECTION */}
        <div className="flex-1 flex flex-col min-h-screen">
          
          {/* TOP NAVBAR */}
          <TopNavbar />

          {/* CONTENT AREA */}
          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-100">
            {children}
          </main>

        </div>
      </div>

    </ProtectedRoute>
  );
}
