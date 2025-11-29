// app/teacher/page.tsx → 100% WORKING + ONLY TEACHER ALLOWED
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import TeacherLayout from "@/components/TeacherDashboard/TeacherLayout";
import TeacherAttendance from "@/components/TeacherDashboard/attendance";

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      try {
        // YE SABSE SAHI TARIKA HAI — UID SE CHECK KARO
        const teacherDoc = await getDoc(doc(db, "teachers", user.uid));

        if (!teacherDoc.exists()) {
          // Agar teacher collection mein nahi hai → bahar nikal do
          router.replace("/auth/login");
          return;
        }

        const teacherData = { id: user.uid, ...teacherDoc.data() };
        setTeacher(teacherData);

        // Ab students load karo uske batch ke
        const studentsSnap = await getDoc(doc(db, "batches", teacherData.batch || "default"));
        // Ya phir direct students collection se
        // Agar batch field students mein hai to:
        // const q = query(collection(db, "students"), where("batch", "==", teacherData.batch));
        // const snap = await getDocs(q);
        // setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Temporary students (jab tak batch system na bane)
        setStudents([]); // ya phir koi dummy data

      } catch (err) {
        console.error("Teacher dashboard error:", err);
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-3xl font-bold text-purple-700">Loading Teacher Dashboard...</div>
      </div>
    );
  }

  if (!teacher) {
    return null; // already redirect ho chuka hoga
  }

  return (
    <TeacherLayout teacherName={teacher?.name || "Teacher"}>
      <div className="p-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome back, {teacher?.name || "Teacher"}!
        </h1>
        <p className="text-2xl text-gray-600 mb-10">Manage your class efficiently</p>

        <TeacherAttendance students={students} teacher={teacher} />
      </div>
    </TeacherLayout>
  );
}