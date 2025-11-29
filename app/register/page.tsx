// app/register/page.tsx ← SAME DESIGN + AUTO STUDENT ID (EXC25XXX)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus, IdCard } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("Generating ID...");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    batch: "",
    year: "",
  });

  // Auto Generate Student ID: EXC25 + serial (001, 002, ...)
  useEffect(() => {
    const generateId = async () => {
      try {
        const q = query(
          collection(db, "students"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);

        let nextNum = 1;
        if (!snapshot.empty) {
          const lastStudent = snapshot.docs[0].data();
          const lastId = lastStudent.studentId || "EXC25000";
          const numPart = lastId.replace("EXC25", "");
          nextNum = parseInt(numPart) + 1;
        }

        const newId = `EXC25${String(nextNum).padStart(3, "0")}`;
        setStudentId(newId);
      } catch (err) {
        setStudentId("EXC25001"); // fallback
      }
    };

    generateId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.course || !form.batch || !form.year) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Save student with auto-generated ID
      await setDoc(doc(db, "students", user.uid), {
        name: form.name,
        email: form.email,
        studentId: studentId,           // ← This will show in Admin panel
        course: form.course,
        batch: form.batch,
        year: form.year,
        createdAt: new Date(),
        attendance: { percentage: 0, total: 0, present: 0 },
        fees: { total: 75000, paid: 0, due: 75000 },
      });

      // Save role + studentId in users collection
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        role: "student",
        studentId: studentId,
      });

      alert(`Registration Successful!\nYour Student ID: ${studentId}`);
      router.push("/auth/login");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <UserPlus className="w-12 h-12 text-blue-700" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">Student Registration</CardTitle>
          <p className="text-gray-600 mt-2">Join Excellence Coaching Today!</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* AUTO GENERATED STUDENT ID - DISPLAY ONLY */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4 text-center">
              <Label className="text-sm font-medium text-indigo-700 flex items-center justify-center gap-2">
                <IdCard className="w-5 h-5" />
                Your Unique Student ID
              </Label>
              <div className="text-2xl font-bold text-indigo-800 mt-2 tracking-wider">
                {studentId}
              </div>
              <p className="text-xs text-gray-500 mt-1">Keep this safe • Shown in all records</p>
            </div>

            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                required
              />
            </div>

            <div>
              <Label>Course</Label>
              <Select onValueChange={(v) => setForm({ ...form, course: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JEE 2026">JEE 2026</SelectItem>
                  <SelectItem value="NEET 2026">NEET 2026</SelectItem>
                  <SelectItem value="Foundation">Foundation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Batch</Label>
              <Input
                placeholder="e.g. Morning 7-9 AM"
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Year</Label>
              <Select onValueChange={(v) => setForm({ ...form, year: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register Now"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={() => router.push("/auth/login")} 
              className="text-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Already have an account? Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}