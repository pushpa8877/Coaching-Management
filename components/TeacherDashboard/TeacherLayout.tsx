// components/teacher/TeacherLayout.tsx
"use client";

import { useRouter } from "next/navigation";
import { LogOut, BookOpen, Users, FileText } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function TeacherLayout({ children, teacherName }: { children: React.ReactNode; teacherName?: string }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-indigo-700 to-purple-800 text-white shadow-2xl">
        <div className="p-8">
          <h1 className="text-3xl font-bold">Teacher Portal</h1>
          <p className="mt-4 text-indigo-100">Welcome,</p>
          <p className="text-2xl font-semibold">{teacherName || "Teacher"}</p>
        </div>

        <nav className="mt-10 px-6 space-y-3">
          <button
            onClick={() => router.push("/teacher")}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Users className="w-6 h-6" />
            <span className="text-lg">Attendance</span>
          </button>
          <button
            onClick={() => router.push("/teacher/materials")}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-lg">Study Materials</span>
          </button>
        </nav>

        <button
          onClick={() => auth.signOut().then(() => router.push("/auth/teacher-login"))}
          className="absolute bottom-8 left-8 flex items-center gap-3 text-red-300 hover:text-red-100"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}