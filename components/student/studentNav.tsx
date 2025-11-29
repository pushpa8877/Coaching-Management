// src/components/student/StudentNavbar.tsx ← FINAL 2025 READY VERSION
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState , useEffect } from "react";
import { 
  Home, BookOpen, Calendar, FileText, Users, Settings, 
  ChevronDown, LogOut, Bell, Search, Menu, X, User 
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function StudentNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic student data from Firebase
  const [student, setStudent] = useState<{ name: string; rollNo?: string }>({ name: "Loading..." });

  // Mock notifications
  const notifications = [
    { id: 1, title: "Fee payment due", time: "2 hours ago", unread: true },
    { id: 2, title: "New assignment posted", time: "5 mins ago", unread: true },
    { id: 3, title: "Exam schedule updated", time: "1 day ago", unread: false },
  ];

  const menus = [
    { name: "Dashboard", href: "/student/dashboard", icon: Home },
    { 
      name: "Accounts", 
      icon: BookOpen,
      items: [
        { label: "Fee Status", href: "/dashboard/student/feeStatus" },
        { label: "Payment History", href: "/dashboard/student/payments" },
        { label: "Due Payments", href: "/dashboard/student/due" }
      ]
    },
    { 
      name: "Academics", 
      icon: FileText,
      items: [
        { label: "My Courses", href: "dashboard/student/courses" },
        { label: "Study Material", href: "/dashboard/student/study-material" },
        { label: "Attendance", href: "/dashboard/student/attendance" },
        { label: "Time Table", href: "/dashboard/student/timetable" }
      ]
    },
    { 
      name: "Examinations", 
      icon: Calendar,
      items: [
        { label: "Exam Schedule", href: "/student/exams" },
        { label: "Results", href: "/student/results" },
        { label: "Admit Card", href: "/student/admit-card" }
      ]
    },
    { 
      name: "Services", 
      icon: Users,
      items: [
        { label: "Doubt Support", href: "/student/doubts" },
        { label: "Mentor Connect", href: "/student/mentor" },
        { label: "Library", href: "/student/library" }
      ]
    },
    { 
      name: "Settings", 
      icon: Settings,
      items: [
        { label: "Profile", href: "/student/profile" },
        { label: "Change Password", href: "/student/change-password" },
        { label: "Notifications", href: "/student/notifications" }
      ]
    },
  ];

  // Fetch student data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "students", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setStudent({
              name: data.name || user.displayName || "Student",
              rollNo: data.rollNo || data.studentId
            });
          } else {
            setStudent({ name: user.displayName || "Student" });
          }
        } catch (err) {
          setStudent({ name: user.displayName || "Student" });
        }
      } else {
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      auth.signOut();
      router.push("/auth/login");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">S</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold">Student Dashboard</h1>
                  <p className="text-blue-100 text-sm">Welcome back, {student.name}!</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition">
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-white/10 rounded-lg relative transition"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:block border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-1">
                {menus.map((menu) => {
                  const Icon = menu.icon;
                  const isActive = menu.href && pathname.startsWith(menu.href);
                  const hasDropdown = !!menu.items;

                  return (
                    <div key={menu.name} className="relative">
                      <button
                        onClick={() => hasDropdown && toggleDropdown(menu.name)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          isActive || openDropdown === menu.name
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {menu.name}
                        {hasDropdown && (
                          <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === menu.name ? "rotate-180" : ""}`} />
                        )}
                      </button>

                      {hasDropdown && openDropdown === menu.name && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 z-50">
                          {menu.items!.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    {student.rollNo && <p className="text-sm text-gray-500">ID: {student.rollNo}</p>}
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              {menus.map((menu) => {
                const Icon = menu.icon;
                const hasDropdown = !!menu.items;

                return (
                  <div key={menu.name}>
                    {menu.href ? (
                      <Link
                        href={menu.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                      >
                        <Icon className="w-5 h-5" />
                        {menu.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleDropdown(menu.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition ${
                          openDropdown === menu.name ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{menu.name}</span>
                        </div>
                        {hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === menu.name ? "rotate-180" : ""}`} />}
                      </button>
                    )}

                    {hasDropdown && openDropdown === menu.name && (
                      <div className="ml-9 mt-1 space-y-1">
                        {menu.items!.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="p-6">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, materials, exams..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </form>
            <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-500 text-center">
              Press Enter to search
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {notificationsOpen && (
        <div className="fixed top-16 right-4 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-semibold text-lg">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-start gap-3">
                  {n.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
                  <div>
                    <p className={`font-medium ${n.unread ? "text-gray-900" : "text-gray-600"}`}>{n.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 text-center">
            <Link href="/student/notifications" className="text-blue-600 hover:underline text-sm font-medium">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </>
  );
}