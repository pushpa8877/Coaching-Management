// app/admin/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import StudentsTab from "@/components/adminDashboard/StudentsTab";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsSnap, teachersSnap] = await Promise.all([
          getDocs(collection(db, "students")),
          getDocs(collection(db, "teachers")),
        ]);

        const studentsData = studentsSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            studentId: data.studentId || "",
            course: data.course || "",
            teacherId: data.teacherId || "",
            fees: data.fees || { paid: 0, total: 75000 },
          };
        });

        const teachersData = teachersSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unknown Teacher",
            teacherId: data.teacherId || "T000",
          };
        });

        setStudents(studentsData);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-bold text-purple-600">Loading Students...</p>
      </div>
    );
  }

  return <StudentsTab initialStudents={students} initialTeachers={teachers} />;
}