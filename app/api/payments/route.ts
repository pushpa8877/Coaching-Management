// app/api/payments/route.ts
import { NextRequest } from "next/server";
import { doc, updateDoc, increment, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { studentId, amount } = await req.json();

    if (!studentId || !amount || amount <= 0) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const studentRef = doc(db, "students", studentId);

    // Update fees
    await updateDoc(studentRef, {
      "fees.paid": increment(amount),
      "fees.due": increment(-amount),
    });

    // Record payment history
    await addDoc(collection(db, "payments"), {
      studentId,
      amount,
      timestamp: serverTimestamp(),
      status: "success",
      method: "online",
    });

    return Response.json({ success: true, message: "Payment recorded" });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}