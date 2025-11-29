// src/components/student/accounts/FeeStatus.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FeeData {
  total: number;
  paid: number;
  due: number;
}

export default function FeeStatus() {
  const [feeData, setFeeData] = useState<FeeData>({ total: 0, paid: 0, due: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const studentRef = doc(db, "students", user.uid);

    // Real-time listener — updates instantly when payment made!
    const unsubscribe = onSnapshot(studentRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const total = data.fees?.total || 75000;
        const paid = data.fees?.paid || 0;
        const due = Math.max(0, total - paid); // Never negative

        setFeeData({ total, paid, due });
        setLoading(false);
      }
    }, (error) => {
      toast.error("Failed to load fee status");
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const percentage = feeData.total > 0 ? (feeData.paid / feeData.total) * 100 : 0;
  const isFullyPaid = feeData.paid >= feeData.total;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-2xl font-bold text-indigo-700">Loading Fee Status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-indigo-800">Fee Status</h1>
          <p className="text-xl text-gray-600 mt-3">Track your fee payments instantly</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Paid */}
          <Card className="bg-green-50 border-green-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <IndianRupee className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <p className="text-5xl font-bold text-green-700">
                ₹{feeData.paid.toLocaleString()}
              </p>
              <p className="text-gray-700 mt-2 text-lg">Total Paid</p>
            </CardContent>
          </Card>

          {/* Amount Due */}
          <Card className={`shadow-lg ${feeData.due > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-300"}`}>
            <CardContent className="p-8 text-center">
              <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${feeData.due > 0 ? "text-red-600" : "text-gray-500"}`} />
              <p className={`text-5xl font-bold ${feeData.due > 0 ? "text-red-700" : "text-gray-600"}`}>
                ₹{feeData.due.toLocaleString()}
              </p>
              <p className="text-gray-700 mt-2 text-lg">Amount Due</p>
            </CardContent>
          </Card>

          {/* Status Badge */}
          <Card className={`shadow-lg ${isFullyPaid ? "bg-blue-50 border-blue-300" : "bg-orange-50 border-orange-200"}`}>
            <CardContent className="p-10 text-center flex flex-col items-center justify-center">
              {isFullyPaid ? (
                <CheckCircle className="w-16 h-16 text-blue-600 mb-4" />
              ) : (
                <AlertCircle className="w-16 h-16 text-orange-600 mb-4" />
              )}
              <Badge 
                variant={isFullyPaid ? "default" : "secondary"} 
                className={`text-lg px-8 py-3 ${isFullyPaid ? "bg-blue-600" : "bg-orange-500 text-white"}`}
              >
                {isFullyPaid ? "Fully Paid" : "Partially Paid"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">Payment Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-lg font-medium text-gray-700">
              <span>₹{feeData.paid.toLocaleString()} paid</span>
              <span>₹{feeData.total.toLocaleString()} total</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-10 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-6 text-white font-bold text-xl transition-all duration-700"
                style={{ width: `${percentage}%` }}
              >
                {Math.round(percentage)}%
              </div>
            </div>
            {isFullyPaid && (
              <p className="text-center text-green-600 font-bold text-xl mt-4">
                Congratulations! All fees paid
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}