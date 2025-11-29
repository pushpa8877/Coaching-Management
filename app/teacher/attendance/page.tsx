// app/teacher/attendance/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import TeacherLayout from "@/components/TeacherDashboard/TeacherLayout";
import TeacherAttendance from "@/components/TeacherDashboard/attendance";

export default function AttendancePage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/auth/teacher-login");
        return;
      }

      try {
        // 1. Get teacher
        const teacherQuery = query(
          collection(db, "teachers"),
          where("email", "==", user.email)
        );
        const teacherSnap = await getDocs(teacherQuery);

        if (teacherSnap.empty) {
          toast.error("Teacher not found");
          router.push("/auth/teacher-login");
          return;
        }

        const teacherDoc = teacherSnap.docs[0];
        const teacherData = {
          id: teacherDoc.id,
          ...teacherDoc.data(),
        };

        setTeacher(teacherData);

        // 2. STOP EVERYTHING IF NO BATCH
        const batch = teacherData.batch;

        if (!batch || typeof batch !== "string" || batch.trim() === "") {
          setError("No batch assigned. Contact admin.");
          setStudents([]);
          setLoading(false);
          return;
        }

        const batchName = batch.trim();

        // 3. ONLY NOW RUN THE QUERY – 100% SAFE
        const studentsQuery = query(
          collection(db, "students"),
          where("batch", "==", batchName)
        );

        const studentsSnap = await getDocs(studentsQuery);
        const studentList = studentsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentList);
        setError(null);

      } catch (err: any) {
        console.error("Firebase Error:", err);
        setError("Failed to load data");
        toast.error("Error loading attendance");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-4xl font-bold text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <TeacherLayout teacherName={teacher?.name || "Teacher"}>
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-10 text-center">
          <p className="text-2xl font-bold text-red-700">{error}</p>
          <p className="text-gray-600 mt-4">
            Current batch: <strong>{teacher?.batch || "Not set"}</strong>
          </p>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout teacherName={teacher?.name || "Teacher"}>
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">Attendance</h1>
        <p className="text-2xl text-gray-600">
          Batch: <span className="font-bold text-indigo-600">{teacher?.batch}</span>
        </p>
      </div>

      {students.length === 0 ? (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-10 text-center">
          <p className="text-2xl font-bold text-yellow-800">No students in this batch</p>
        </div>
      ) : (
        <TeacherAttendance students={students} teacher={teacher} />
      )}
    </TeacherLayout>
  );
}