// app/admin/teachers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TeachersTab from "@/components/adminDashboard/TeachersTab";


export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teachers from Firestore
  const fetchTeachers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "teachers"));
      const teachersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load teachers on mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-3xl font-bold text-purple-600">
          Loading Teachers...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <TeachersTab teachers={teachers} onRefresh={fetchTeachers} />
    </div>
  );
}