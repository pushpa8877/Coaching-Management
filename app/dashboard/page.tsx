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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-base font-semibold text-gray-700">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
      {/* Subtle Background Circles - Matching Landing Page */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl -z-10" />

      <StudentNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

          {/* Profile Card */}
          <Card className="shadow-lg bg-white/95 border border-gray-100">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-16 h-16 border-2 border-orange-500">
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 text-white">
                    {getInitials(student.name || "S")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">{student.name}</CardTitle>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-orange-600" /> <span>Enrollment:</span> <strong>{student.studentId}</strong></div>
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-orange-600" /> <span>Course:</span> <strong>{student.course}</strong></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-600" /> <span>Batch:</span> <strong>{student.batch}</strong></div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base font-bold">
                Attendance
                <Badge variant="secondary" className={`text-xs px-2 py-1 ${attendancePercentage >= 75 ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}>
                  {attendancePercentage >= 75 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600">{attendancePercentage}%</div>
              <p className="text-orange-700 text-sm mt-1">{attendancePercentage >= 75 ? "Keep it up!" : "Let's improve attendance!"}</p>
            </CardContent>
          </Card>

          {/* Fee Status Card */}
          <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <IndianRupee className="w-5 h-5 text-orange-600" /> Fee Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Fee</span>
                <strong className="text-lg">₹{student.fees?.total.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-green-600 text-sm">
                <span>Paid</span>
                <strong className="text-lg">₹{student.fees?.paid.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-red-600 font-bold text-sm">
                <span>Due</span>
                <strong className="text-xl">₹{student.fees?.due.toLocaleString()}</strong>
              </div>

              {student.fees?.due > 0 ? (
                <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white" size="default" onClick={() => setIsPaymentModalOpen(true)}>
                  Pay Now
                </Button>
              ) : (
                <div className="text-center mt-4 p-4 bg-green-50 rounded-lg border border-green-300">
                  <p className="text-base font-bold text-green-700">All Fees Paid!</p>
                  <p className="text-green-600 text-sm mt-1">Thank you!</p>
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