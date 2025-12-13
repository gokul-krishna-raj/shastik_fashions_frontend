'use client';

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-slate-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminNavbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </AdminRouteGuard>
  );
}
