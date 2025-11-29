// app/dashboard/page.tsx – AB 100% SAFE & PERFECT (tera design bilkul same rahega)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, User, BookOpen, Calendar } from "lucide-react";
import { PaymentModal } from "@/components/student/paymentmodel";
import { toast } from "sonner";
import StudentNavbar from "@/components/student/studentNav";

interface StudentData {
  id?: string;
  name?: string;
  email?: string;
  studentId?: string;
  course?: string;
  batch?: string;
  attendance?: { percentage: number };
  fees?: { total: number; paid: number; due: number };
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<StudentData>({});
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const router = useRouter();

  // YE NAYA GUARD — SIRF STUDENT KO ALLOW KAREGA
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // Agar teacher ya admin hai → turant redirect
      const teacherDoc = await getDoc(doc(db, "teachers", user.uid));
      const adminDoc = await getDoc(doc(db, "admins", user.uid));

      if (teacherDoc.exists()) {
        router.replace("/teacher");
        return;
      }
      if (adminDoc.exists()) {
        router.replace("/admin");
        return;
      }

      // Sirf student hi yahan aayega
      // Ab data load karo
      fetchStudentData(user.uid);
    });

    return () => unsubscribe();
  }, [router]);

  // TERA PURA ORIGINAL FUNCTION — KUCH BHI CHANGE NAHI KIYA
  const fetchStudentData = async (uid: string) => {
    try {
      const studentDoc = await getDoc(doc(db, "students", uid));

      if (!studentDoc.exists()) {
        router.replace("/auth/login");
        return;
      }

      const data = studentDoc.data();
      const total = data.fees?.total || 75000;
      const paid = data.fees?.paid || 0;
      const due = Math.max(0, total - paid);

      setStudent({
        id: uid,
        name: data.name || "Student",
        email: data.email || "",
        studentId: data.studentId || "Not Assigned",
        course: data.course || "Not Assigned",
        batch: data.batch || "2025",
        attendance: { percentage: data.attendance?.percentage || 0 },
        fees: { total, paid, due },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Data load nahi hua");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (auth.currentUser) {
      fetchStudentData(auth.currentUser.uid);
      toast.success("Payment Recorded!", {
        description: "Your fee status is now updated.",
      });
      setIsPaymentModalOpen(false);
    }
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const attendancePercentage = student.attendance?.percentage || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  // TERA PURA BEAUTIFUL UI — BILKUL WAISA HI RAHEGA
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <StudentNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Profile Card */}
          <Card className="shadow-2xl bg-white/95">
            <CardHeader>
              <div className="flex items-center gap-5">
                <Avatar className="w-24 h-24 border-4 border-blue-600">
                  <AvatarFallback className="text-3xl font-bold bg-blue-600 text-white">
                    {getInitials(student.name || "S")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold">{student.name}</CardTitle>
                  <p className="text-gray-600">{student.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div className="flex items-center gap-3"><User className="w-5 h-5 text-blue-600" /> Enrollment: <strong>{student.studentId}</strong></div>
              <div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-green-600" /> Course: <strong>{student.course}</strong></div>
              <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-purple-600" /> Batch: <strong>{student.batch}</strong></div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-2xl">
                Attendance
                <Badge variant="secondary" className={`text-lg px-4 py-2 ${attendancePercentage >= 75 ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}>
                  {attendancePercentage >= 75 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-green-600">{attendancePercentage}%</div>
              <p className="text-green-700 text-lg mt-2">{attendancePercentage >= 75 ? "Keep it up!" : "Let's improve attendance!"}</p>
            </CardContent>
          </Card>

          {/* Fee Status Card */}
          <Card className="shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <IndianRupee className="w-8 h-8" /> Fee Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Total Fee</span>
                <strong className="text-2xl">₹{student.fees?.total.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid</span>
                <strong className="text-2xl">₹{student.fees?.paid.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-red-600 font-bold">
                <span>Due</span>
                <strong className="text-3xl">₹{student.fees?.due.toLocaleString()}</strong>
              </div>

              {student.fees?.due > 0 ? (
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700" size="lg" onClick={() => setIsPaymentModalOpen(true)}>
                  Pay Now
                </Button>
              ) : (
                <div className="text-center mt-6 p-6 bg-green-50 rounded-lg border-2 border-green-400">
                  <p className="text-2xl font-bold text-green-700">All Fees Paid!</p>
                  <p className="text-green-600 mt-2">Thank you!</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        totalDue={student.fees?.due || 0}
        studentId={student.id || ""}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}