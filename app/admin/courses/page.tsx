// app/admin/courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CoursesTab from "@/components/adminDashboard/CoursesTab";


export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    const snap = await getDocs(collection(db, "courses"));
    setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  if (loading) return <div className="p-8 text-3xl">Loading Courses...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CoursesTab courses={courses} onRefresh={fetchCourses} />
    </div>
  );
}