// app/admin/salary/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SalaryTab from "@/components/adminDashboard/SalaryTab";

export default function SalaryPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    const snap = await getDocs(collection(db, "teachers"));
    const data = snap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      teacherId: doc.data().teacherId,
      salary: doc.data().salary || { monthly: 50000, paidThisMonth: false }
    }));
    setTeachers(data);
    setLoading(false);
  };

  useEffect(() => { fetchTeachers(); }, []);

  if (loading) return <div className="p-8 text-3xl">Loading Salary...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <SalaryTab teachers={teachers} onRefresh={fetchTeachers} />
    </div>
  );
}