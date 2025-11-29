"use client";

import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard, GraduationCap, UserCheck, Receipt,
  CalendarCheck, Wallet, BookOpen, Trophy, Bell, LogOut, Menu
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Students", href: "/admin/students", icon: GraduationCap },
  { title: "Teachers", href: "/admin/teachers", icon: UserCheck },
  { title: "Fees", href: "/admin/fees", icon: Receipt },
  { title: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { title: "Salary", href: "/admin/salary", icon: Wallet },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Exams", href: "/admin/exams", icon: Trophy },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBg = "bg-gradient-to-r from-pink-300 to-orange-300 text-white shadow-lg";
  const inactiveBg = "text-gray-600 hover:bg-orange-50 hover:text-orange-600";

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-50 border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-orange-300 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">CH</span>
            </div>
            <span className="font-bold text-xl text-gray-800">Coachhub</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="flex h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-72 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl m-6 flex-col border border-white/50 overflow-hidden">
          {/* Logo */}
          <div className="p-8 bg-gradient-to-br from-pink-300 to-orange-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/40 backdrop-blur rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">CH</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Coachhub</h1>
                <p className="text-sm text-white/90">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-medium transition-all duration-200 ${
                    isActive ? activeBg : inactiveBg
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </a>
              );
            })}
          </nav>

          {/* Logout - Now INSIDE sidebar */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => signOut(auth).then(() => window.location.href = "/auth/login")}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-medium text-rose-600 hover:bg-rose-50 w-full transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <aside className="relative w-80 max-w-full bg-white shadow-2xl flex flex-col">
              <div className="p-8 bg-gradient-to-br from-pink-300 to-orange-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/40 backdrop-blur rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">CH</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Coachhub</h1>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                    <Menu className="w-7 h-7 rotate-90" />
                  </button>
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-medium transition-all ${
                        isActive ? activeBg : inactiveBg
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    signOut(auth);
                    setMobileMenuOpen(false);
                    window.location.href = "/auth/login";
                  }}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-600 hover:bg-rose-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
          <div className="p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}