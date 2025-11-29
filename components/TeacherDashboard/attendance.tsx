// components/teacher/TeacherAttendance.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

interface Student {
  id: string;
  name: string;
  studentId: string;
  attendance?: Record<string, string>;
}

interface Teacher {
  name?: string;
  batch?: string;
}

export default function TeacherAttendance({
  students = [],
  teacher,
}: {
  students: Student[];
  teacher: Teacher | null;
}) {
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  // Initialize attendance from Firebase data
  useEffect(() => {
    const initial: Record<string, string> = {};
    students.forEach((student) => {
      initial[student.id] = student.attendance?.[today] || "";
    });
    setAttendance(initial);
  }, [students]);

  const markAttendance = async (studentId: string, status: "Present" | "Absent") => {
    try {
      await updateDoc(doc(db, "students", studentId), {
        [`attendance.${today}`]: status,
      });

      setAttendance((prev) => ({
        ...prev,
        [studentId]: status,
      }));

      toast.success(`${status}!`);
    } catch (error) {
      console.error("Attendance error:", error);
      toast.error("Failed to mark attendance");
    }
  };

  // Safety: If no batch assigned
  if (!teacher?.batch) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-12 text-center">
        <p className="text-2xl font-bold text-red-600">No Batch Assigned</p>
        <p className="text-gray-600 mt-2">Contact admin to assign you a batch.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
        <h2 className="text-3xl font-bold">Today's Attendance</h2>
        <p className="text-xl mt-2 opacity-90">
          Batch: <span className="font-bold">{teacher.batch}</span> •{" "}
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Body */}
      <div className="p-8">
        {students.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No students found in your batch</p>
          </div>
        ) : (
          <div className="space-y-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="mb-4 sm:mb-0">
                  <p className="text-2xl font-bold text-gray-800">{student.name}</p>
                  <p className="text-lg text-gray-600 font-mono">{student.studentId}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => markAttendance(student.id, "Present")}
                    className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                      attendance[student.id] === "Present"
                        ? "bg-green-600 text-white shadow-xl ring-4 ring-green-300"
                        : "bg-gray-200 hover:bg-green-100 text-gray-700"
                    }`}
                  >
                    Present
                  </button>

                  <button
                    onClick={() => markAttendance(student.id, "Absent")}
                    className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                      attendance[student.id] === "Absent"
                        ? "bg-red-600 text-white shadow-xl ring-4 ring-red-300"
                        : "bg-gray-200 hover:bg-red-100 text-gray-700"
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}