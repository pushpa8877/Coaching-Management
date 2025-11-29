// app/student/attendance/page.tsx → FINAL DYNAMIC MULTI-SUBJECT VERSION
"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { CheckCircle2, XCircle, TrendingUp, Eye } from "lucide-react";

interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  batch: string;
  total: number;
  present: number;
  absent: number;
  percentage: number;
  records: { date: string; status: "present" | "absent" }[];
}

interface StudentData {
  name: string;
  registrationNumber: string;
  program: string;
}

export default function StudentAttendancePage() {
  const [student, setStudent] = useState<StudentData>({ name: "Loading...", registrationNumber: "...", program: "..." });
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectAttendance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      // Fetch student info
      const studentSnap = await getDoc(doc(db, "students", user.uid));
      if (studentSnap.exists()) {
        const data = studentSnap.data();
        setStudent({
          name: data.name || "Student",
          registrationNumber: data.registrationNumber || data.rollNo || "N/A",
          program: data.program || "N/A",
        });
      }

      // Listen to attendance records grouped by subject
      const q = query(collection(db, "attendance"), where("studentId", "==", user.uid));
      const unsub = onSnapshot(q, (snapshot) => {
        const raw: any[] = [];
        snapshot.forEach((doc) => raw.push(doc.data()));

        // Group by subject
        const grouped = raw.reduce((acc: any, record) => {
          const key = `${record.subjectCode}-${record.subjectName}-${record.batch || "A"}`;
          if (!acc[key]) {
            acc[key] = {
              subjectCode: record.subjectCode,
              subjectName: record.subjectName,
              batch: record.batch || "A",
              total: 0,
              present: 0,
              records: []
            };
          }
          acc[key].total += 1;
          if (record.status === "present") acc[key].present += 1;
          acc[key].records.push({ date: record.date, status: record.status });
          return acc;
        }, {});

        const result = Object.values(grouped).map((s: any) => ({
          ...s,
          absent: s.total - s.present,
          percentage: Math.round((s.present / s.total) * 100),
          records: s.records.sort((a: any, b: any) => b.date.localeCompare(a.date))
        })) as SubjectAttendance[];

        setSubjects(result);
        setLoading(false);
      });

      return () => unsub();
    });

    return () => unsubAuth();
  }, []);

  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  // Last 30 days trend (overall)
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
    let presentCount = 0;
    let totalCount = 0;

    subjects.forEach(sub => {
      const rec = sub.records.find(r => r.date === date);
      if (rec) {
        totalCount++;
        if (rec.status === "present") presentCount++;
      }
    });

    return { date, height: totalCount > 0 ? (presentCount / totalCount) * 80 : 8 };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Attendance Summary</h1>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{student.name}</p>
                <p className="text-xs text-gray-500">{student.registrationNumber}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold">
                {student.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Trend Graph */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Overall Attendance Trend (Last 30 Days)</h3>
            <div className="h-32 flex items-end justify-between gap-1">
              {trendData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-sm bg-blue-500 transition-all duration-500"
                    style={{ height: `${day.height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 4 Small Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
              <p className="text-xs text-gray-500">Total Classes</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalClasses}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Present
              </p>
              <p className="text-2xl font-bold text-green-700 mt-1">{totalPresent}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <XCircle className="w-4 h-4 text-red-600" /> Absent
              </p>
              <p className="text-2xl font-bold text-red-700 mt-1">{totalClasses - totalPresent}</p>
            </div>
            <div className={`rounded-xl shadow-sm p-5 text-center border ${overallPercentage >= 75 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
              <p className="text-xs text-gray-500">Overall %</p>
              <p className={`text-3xl font-bold mt-1 ${overallPercentage >= 75 ? "text-green-700" : "text-orange-700"}`}>
                {overallPercentage}%
              </p>
            </div>
          </div>

          {/* Program Name */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5">
            <h2 className="text-lg font-semibold text-gray-800">{student.program}</h2>
          </div>

          {/* Subjects Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Code</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Subject</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Batch</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-gray-600 uppercase">Conducted</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-gray-600 uppercase">Present</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-gray-600 uppercase">Absent</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-gray-600 uppercase">%</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">{sub.subjectCode}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{sub.subjectName}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{sub.batch}</td>
                      <td className="px-5 py-4 text-center">{sub.total}</td>
                      <td className="px-5 py-4 text-center text-green-700">{sub.present}</td>
                      <td className="px-5 py-4 text-center text-red-700">{sub.absent}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${sub.percentage >= 75 ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setSelectedSubject(sub)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-4 h-4" /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Details Modal */}
        {selectedSubject && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSubject(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">{selectedSubject.subjectName}</h3>
                <p className="text-sm text-gray-600">{selectedSubject.subjectCode} • Batch {selectedSubject.batch}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-2xl font-bold">{selectedSubject.total}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-xs text-gray-500">Present</p>
                    <p className="text-2xl font-bold text-green-700">{selectedSubject.present}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <p className="text-xs text-gray-500">Absent</p>
                    <p className="text-2xl font-bold text-red-700">{selectedSubject.absent}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedSubject.records.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{format(new Date(r.date), "dd MMM yyyy")}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-gray-200">
                <button onClick={() => setSelectedSubject(null)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}