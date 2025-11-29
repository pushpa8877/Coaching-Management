// app/admin/page.tsx → FINAL: ONLY ADMIN ALLOWED + TERA PURA DESIGN SAFE
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, Timestamp, doc, getDoc } from "firebase/firestore";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Users, GraduationCap, IndianRupee, AlertCircle, TrendingUp } from "lucide-react";

interface Student {
  id: string;
  name: string;
  course?: string;
  createdAt?: Timestamp;
  fees?: { total?: number; paid?: number; lastPaidDate?: Timestamp };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    feesCollected: 0,
    totalDue: 0,
    monthlyData: [] as { month: string; amount: number }[],
    courseRevenue: [] as { name: string; value: number }[],
    recentPayments: [] as { name: string; amount: number; date: string }[],
    recentAdmissions: [] as { name: string; course: string; date: string }[],
  });
  const [loading, setLoading] = useState(true);

  // YE GUARD — SIRF ADMIN KO ALLOW KAREGA
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // Check if this user is actually an admin
      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      if (!adminDoc.exists()) {
        // Agar admin nahi hai → login pe bhej do
        router.replace("/auth/login");
        return;
      }

      // Sirf admin hai toh data load karo
      loadAdminData();
    });

    return () => unsubscribe();
  }, [router]);

  // Tera pura original data load function — bilkul untouched
  const loadAdminData = async () => {
    try {
      const [studentsSnap, teachersSnap] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "teachers")),
      ]);

      const students: Student[] = studentsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Student[];

      const teachersCount = teachersSnap.size;
      const totalExpected = students.reduce((s, st) => s + (st.fees?.total || 75000), 0);
      const feesCollected = students.reduce((s, st) => s + (st.fees?.paid || 0), 0);
      const totalDue = totalExpected - feesCollected;

      const monthlyData: any[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const monthName = format(date, "MMM yyyy");

        const amount = students
          .filter(s => {
            const d = s.fees?.lastPaidDate?.toDate();
            return d && isWithinInterval(d, { start, end });
          })
          .reduce((s, st) => s + (st.fees?.paid || 0), 0);

        monthlyData.push({ month: monthName, amount });
      }

      const courseMap: Record<string, number> = {};
      students.forEach(s => {
        const course = s.course || "Uncategorized";
        courseMap[course] = (courseMap[course] || 0) + (s.fees?.paid || 0);
      });
      const courseRevenue = Object.entries(courseMap).map(([name, value]) => ({ name, value }));

      const recentPayments = students
        .filter(s => s.fees?.lastPaidDate)
        .sort((a, b) => (b.fees?.lastPaidDate?.toDate()?.getTime() || 0) - (a.fees?.lastPaidDate?.toDate()?.getTime() || 0))
        .slice(0, 5)
        .map(s => ({
          name: s.name,
          amount: s.fees?.paid || 0,
          date: s.fees?.lastPaidDate ? format(s.fees.lastPaidDate.toDate(), "dd MMM yyyy") : "—",
        }));

      const recentAdmissions = students
        .sort((a, b) => (b.createdAt?.toDate()?.getTime() || 0) - (a.createdAt?.toDate()?.getTime() || 0))
        .slice(0, 5)
        .map(s => ({
          name: s.name,
          course: s.course || "—",
          date: s.createdAt ? format(s.createdAt.toDate(), "dd MMM yyyy") : "—",
        }));

      setStats({
        totalStudents: students.length,
        totalTeachers: teachersCount,
        feesCollected,
        totalDue,
        monthlyData,
        courseRevenue,
        recentPayments,
        recentAdmissions,
      });
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <p className="text-2xl font-light text-orange-600">Loading Admin Dashboard...</p>
      </div>
    );
  }

  const SOFT_COLORS = ["#FFD8B8", "#FFE5B4", "#D4F4DD", "#C8E6FF", "#E8D7FF", "#FFD1DC"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Tera pura beautiful design — bilkul same rahega */}
      <div className="px-4 pt-6 pb-4 md:px-8 md:pt-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              <span className="text-pink-500"></span> Admin
            </h1>
            <p className="text-base md:text-lg text-gray-600 mt-1">Welcome back, nice to see you again!</p>
          </div>
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-300 to-amber-400 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-2xl md:text-3xl font-bold text-white">A</span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-10 space-y-8">
        {/* Baki sab tera original code — 100% same */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-orange-200 to-orange-300 text-white rounded-3xl shadow-lg border-0">
            <CardContent className="p-5 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-xs md:text-sm font-medium">Total Students</p>
                  <p className="text-3xl md:text-5xl font-bold mt-2">{stats.totalStudents}</p>
                </div>
                <Users className="w-10 h-10 md:w-14 md:h-14 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-200 to-amber-300 text-white rounded-3xl shadow-lg border-0">
            <CardContent className="p-5 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-xs md:text-sm font-medium">Total Teachers</p>
                  <p className="text-3xl md:text-5xl font-bold mt-2">{stats.totalTeachers}</p>
                </div>
                <GraduationCap className="w-10 h-10 md:w-14 md:h-14 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-200 to-emerald-300 text-white rounded-3xl shadow-lg border-0">
            <CardContent className="p-5 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-xs md:text-sm font-medium">Fees Collected</p>
                  <p className="text-2xl md:text-4xl font-bold mt-2">₹{stats.feesCollected.toLocaleString()}</p>
                </div>
                <IndianRupee className="w-10 h-10 md:w-14 md:h-14 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-200 to-rose-300 text-white rounded-3xl shadow-lg border-0">
            <CardContent className="p-5 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-xs md:text-sm font-medium">Total Due</p>
                  <p className="text-2xl md:text-4xl font-bold mt-2">₹{stats.totalDue.toLocaleString()}</p>
                </div>
                <AlertCircle className="w-10 h-10 md:w-14 md:h-14 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts + Recent Activity — sab same rahega */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Card className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
                Monthly Collection
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: "#888" }} />
                  <YAxis tick={{ fill: "#888" }} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#fb923c" radius={[20, 20, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Course-wise Revenue</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.courseRevenue}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.courseRevenue.map((_, i) => (
                      <Cell key={i} fill={SOFT_COLORS[i % SOFT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Card className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Latest Payments</h2>
              {stats.recentPayments.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-4 md:py-5 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm md:text-base">{p.name}</p>
                    <p className="text-xs md:text-sm text-gray-500">{p.date}</p>
                  </div>
                  <p className="font-bold text-emerald-600 text-base md:text-xl">₹{p.amount.toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Recent Admissions</h2>
              {stats.recentAdmissions.map((a, i) => (
                <div key={i} className="py-4 md:py-5 border-b border-gray-100 last:border-0">
                  <p className="font-medium text-gray-800 text-sm md:text-base">{a.name}</p>
                  <p className="text-xs md:text-sm text-gray-600">{a.course} • {a.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}