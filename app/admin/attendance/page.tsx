// app/admin/attendance/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AttendanceTab from "@/components/adminDashboard/AttendanceTab";

export default function AttendancePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const snap = await getDocs(collection(db, "students"));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        studentId: doc.data().studentId,
        course: doc.data().course,
        attendance: doc.data().attendance || {}, // { "2025-04-01": "Present" }
      }));
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <div className="p-8 text-3xl">Loading Attendance...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <AttendanceTab students={students} onRefresh={fetchStudents} />
    </div>
  );
}