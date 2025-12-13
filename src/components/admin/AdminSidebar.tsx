"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, Package, PlusCircle, ShoppingBag } from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/products/new", label: "Create Product", icon: PlusCircle },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Mobile Sidebar */}
      {isMounted && (
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 bg-white shadow-md">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white">
            <nav className="flex flex-col gap-1 p-4 pt-12">
              <div className="mb-6 px-3">
                <h2 className="text-2xl font-bold text-slate-900">Shastik</h2>
                <p className="text-xs text-slate-500 font-medium">Admin Panel</p>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-11 px-3 rounded-xl transition-all",
                        isActive
                          ? "bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 border-r bg-white shadow-sm sticky top-0 overflow-y-auto shrink-0 z-30">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Shastik</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11 px-3 rounded-xl transition-all",
                    isActive
                      ? "bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
