// app/auth/login/page.tsx → FINAL WORKING VERSION
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2, UserPlus } from "lucide-react";
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

    } catch {
      toast.error("Email ya password galat hai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6 overflow-hidden">
      {/* Subtle Background Circles - Matching Landing Page */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl -z-10" />

      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm text-center border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-600 outline-none text-base transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-600 outline-none text-base transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold text-lg rounded-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Login"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Don&apos;t have an account?</p>
          <Link
            href="/register"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-orange-500 text-orange-600 font-semibold text-base rounded-lg hover:bg-orange-50 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}