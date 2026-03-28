"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.push("/login");
        return;
      }
      
      const user = JSON.parse(userStr);
      if (!user.token || !allowedRoles.includes(user.role)) {
        if (user.role === "super-admin" || user.role === "admin") router.push("/admin");
        else if (user.role === "partner") router.push("/partner");
        else if (user.role === "client") router.push("/client");
        else router.push("/");
        return;
      }

      setAuthorized(true);
    };

    checkAuth();
  }, [pathname, allowedRoles, router]);

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Authenticating...</div>;
  }

  return <>{children}</>;
}
