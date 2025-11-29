// app/student/courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Clock, Target, IndianRupee, Users } from "lucide-react";
import StudentNavbar from "@/components/student/studentNav";

interface CourseData {
  course?: string;
  batch?: string;
  fees?: { total: number; paid: number };
  subjects?: string[];
  schedule?: { day: string; time: string }[];
}

export default function StudentCourses() {
  const [courseData, setCourseData] = useState<CourseData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const studentDoc = await getDoc(doc(db, "students", user.uid));
        if (studentDoc.exists()) {
          const data = studentDoc.data();
          setCourseData({
            course: data.course || "Not Enrolled",
            batch: data.batch || "N/A",
            fees: data.fees || { total: 75000, paid: 0 },
            subjects: data.subjects || ["Physics", "Chemistry", "Mathematics"],
            schedule: data.schedule || [
              { day: "Mon-Fri", time: "9:00 PM - 11:00 PM" },
              { day: "Saturday", time: "Full Day Doubt Session" },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-2xl font-bold text-indigo-700">Loading Your Course...</p>
      </div>
    );
  }

  const { course, batch, fees, subjects, schedule } = courseData;
  const paidAmount = fees?.paid || 0;
  const totalFees = fees?.total || 75000;
  const progress = (paidAmount / totalFees) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <StudentNavbar />

      <div className="max-w-6xl mx-auto p-8 pt-24">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-indigo-800 mb-3">My Course</h1>
          <p className="text-xl text-gray-600">Everything about your enrolled course</p>
        </div>

        {/* Main Course Card */}
        <Card className="shadow-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-4xl font-bold text-indigo-800">{course}</CardTitle>
                <p className="text-2xl text-indigo-600 mt-2">{batch}</p>
              </div>
              <Badge className="text-lg px-6 py-2 bg-green-600 text-white">
                Active Enrollment
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Subjects */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-blue-600" />
                Subjects Covered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects?.map((sub, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center border">
                    <p className="text-lg font-bold text-gray-800">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <Calendar className="w-7 h-7 text-purple-600" />
                Class Schedule
              </h3>
              <div className="space-y-3">
                {schedule?.map((slot, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg shadow border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Clock className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-bold text-lg">{slot.day}</p>
                        <p className="text-gray-600">{slot.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Live Class</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Progress */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <IndianRupee className="w-7 h-7 text-green-600" />
                Fee Status
              </h3>
              <div className="bg-white p-6 rounded-xl shadow border">
                <div className="flex justify-between mb-4">
                  <span className="text-lg">Paid: ₹{paidAmount.toLocaleString()}</span>
                  <span className="text-lg">Total: ₹{totalFees.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-10">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-10 rounded-full flex items-center justify-end pr-6 text-white font-bold"
                    style={{ width: `${progress}%` }}
                  >
                    {Math.round(progress)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 pt-6">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-10">
                <Target className="mr-2" />
                View Study Material
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10">
                <Users className="mr-2" />
                Join Doubt Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}