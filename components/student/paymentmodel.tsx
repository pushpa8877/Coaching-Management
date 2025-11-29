// components/student/PaymentModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalDue: number;
  studentId: string;
  onPaymentSuccess: (amount: number) => void;
}

export function PaymentModal({
  open,
  onOpenChange,
  totalDue,
  studentId,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const payAmount = parseFloat(amount);

    if (isNaN(payAmount) || payAmount <= 0 || payAmount > totalDue) {
      toast.error("Invalid Amount", {
        description: `Enter between ₹1 and ₹${totalDue.toLocaleString()}`,
      });
      return;
    }

    setLoading(true);
    try {
      const studentRef = doc(db, "students", studentId);

      // Update Firebase directly
      await updateDoc(studentRef, {
        "fees.paid": increment(payAmount),
        "fees.due": increment(-payAmount),
      });

      // Save payment history
      await addDoc(collection(db, "payments"), {
        studentId,
        amount: payAmount,
        timestamp: serverTimestamp(),
        status: "success",
        method: "manual",
      });

      toast.success("Payment Successful!", {
        description: `₹${payAmount.toLocaleString()} paid successfully.`,
      });

      onPaymentSuccess(payAmount);
      onOpenChange(false);
      setAmount("");
    } catch (error: any) {
      console.error("Payment failed:", error);
      toast.error("Payment Failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <IndianRupee className="w-6 h-6" />
            Pay Fees
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div>
            <Label>Total Due Amount</Label>
            <p className="text-2xl font-bold text-red-600">
              ₹{totalDue.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Pay</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Max ₹${totalDue.toLocaleString()}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={totalDue}
            />
            <p className="text-sm text-gray-500">
              You can pay full or partial amount
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setAmount(totalDue.toString())}>
              Pay Full
            </Button>
            <Button variant="secondary" onClick={() => setAmount(Math.floor(totalDue / 2).toString())}>
              Pay Half
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}