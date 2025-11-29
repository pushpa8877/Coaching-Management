// app/admin/fees/page.tsx → FIXED IMPORT!
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// CORRECT PATH — THIS IS WHERE YOUR FILE ACTUALLY IS
import FeesTab from "@/components/adminDashboard/FeesTab";

export default function FeesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "students"));
      const data = snapshot.docs.map(doc => {
        const raw = doc.data();
        const paid = raw.fees?.paid || 0;
        const total = raw.fees?.total || 75000;
        const due = Math.max(0, total - paid);

        return {
          id: doc.id,
          name: raw.name || "Unknown",
          studentId: raw.studentId || "",
          fees: { paid, due, total },
        };
      });
      setStudents(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-3xl font-bold text-green-700">Loading Fees...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <FeesTab students={students} onRefresh={fetchStudents} />
    </div>
  );
}