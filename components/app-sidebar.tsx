// components/app-sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, GraduationCap, UserCheck, Receipt,
  CalendarCheck, Wallet, BookOpen, Trophy, Bell, LogOut
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Students", href: "/admin/students", icon: GraduationCap },
  { title: "Teachers", href: "/admin/teachers", icon: UserCheck },
  { title: "Fees", href: "/admin/fees", icon: Receipt },
  { title: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { title: "Salary", href: "/admin/salary", icon: Wallet },
  { title: "Courses & Batches", href: "/admin/courses", icon: BookOpen },
  { title: "Exams & Results", href: "/admin/exams", icon: Trophy },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold">CH</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Coachhub</h1>
            <p className="text-sm opacity-90">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`
                    ${isActive 
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl" 
                      : "text-gray-700 hover:bg-gray-100"
                    }
                    justify-start text-lg py-7 rounded-3xl font-semibold
                  `}
                >
                  <a href={item.href} className="flex items-center gap-5 px-6">
                    <Icon className="w-7 h-7" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenuButton
          className="w-full justify-start text-red-600 hover:bg-red-50 text-lg py-7 rounded-3xl font-semibold px-6"
          onClick={() => signOut(auth).then(() => window.location.href = "/auth/login")}
        >
          <LogOut className="w-7 h-7" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}