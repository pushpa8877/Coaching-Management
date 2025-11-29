// app/admin/exams/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ExamsTab from "@/components/adminDashboard/ExamsTab";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    const snap = await getDocs(collection(db, "exams"));
    setExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchExams(); }, []);

  if (loading) return <div className="p-8 text-3xl">Loading Exams...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ExamsTab exams={exams} onRefresh={fetchExams} />
    </div>
  );
}