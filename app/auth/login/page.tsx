// app/auth/login/page.tsx → FINAL WORKING VERSION
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;

      // Pehle admin check
      const adminDoc = await getDoc(doc(db, "admins", uid));
      if (adminDoc.exists()) {
        toast.success("Welcome Admin!");
        router.replace("/admin");           // DIRECT ADMIN DASHBOARD
        return;
      }

      // Phir teacher check
      const teacherDoc = await getDoc(doc(db, "teachers", uid));
      if (teacherDoc.exists()) {
        toast.success("Welcome Teacher!");
        router.replace("/teacher");
        return;
      }

      // Baaki sab student
      toast.success("Welcome Student!");
      router.replace("/dashboard");

    } catch (err: any) {
      toast.error("Email ya password galat hai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md text-center">
        <h1 className="text-5xl font-bold mb-8 text-gray-800">Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:border-purple-600 outline-none text-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:border-purple-600 outline-none text-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-full hover:shadow-2xl transition flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </button>
        </form>
        

      </div>
    </div>
  );
}