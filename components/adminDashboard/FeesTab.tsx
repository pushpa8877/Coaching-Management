// components/FeesTab.tsx → 100% PERFECT & FINAL
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { IndianRupee, CheckCircle2 } from "lucide-react";

export default function FeesTab({ students = [], onRefresh }: { students: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [amount, setAmount] = useState("");

  const payFee = async () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      const newPaid = (selected.fees?.paid || 0) + amt;
      const newDue = Math.max(0, 75000 - newPaid);

      await updateDoc(doc(db, "students", selected.id), {
        "fees.paid": newPaid,
        "fees.due": newDue,
        "fees.lastPaidDate": serverTimestamp(),
      });

      toast.success(`₹${amt.toLocaleString()} collected from ${selected.name}`);
      setOpen(false);
      setAmount("");
      onRefresh();
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-4xl font-bold mb-8 text-green-800">Fee Management</h2>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-50">
              <TableHead className="font-bold">Student Name</TableHead>
              <TableHead className="font-bold">Paid</TableHead>
              <TableHead className="font-bold">Due</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-center font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s) => {
              const paid = s.fees?.paid || 0;
              const isFullyPaid = paid >= 75000;

              return (
                <TableRow key={s.id} className={isFullyPaid ? "bg-green-50/40" : ""}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-green-600 font-bold">
                    ₹{paid.toLocaleString()}
                  </TableCell>
                  <TableCell className={isFullyPaid ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {isFullyPaid ? "₹0" : `₹${(s.fees?.due || 75000).toLocaleString()}`}
                  </TableCell>
                  <TableCell>
                    {isFullyPaid ? (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Fully Paid
                      </Badge>
                    ) : paid > 0 ? (
                      <Badge variant="secondary">Partially Paid</Badge>
                    ) : (
                      <Badge variant="destructive">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isFullyPaid ? (
                      <Badge className="bg-green-600 text-white text-sm px-4 py-2">
                        <CheckCircle2 className="w-5 h-5 mr-1" />
                        Payment Complete
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelected(s);
                          setAmount("");
                          setOpen(true);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <IndianRupee className="w-4 h-4 mr-1" />
                        Collect Fee
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Collect Fee Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Collect Fee - {selected?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-lg">
              <p>Already Paid: <strong className="text-green-600">₹{(selected?.fees?.paid || 0).toLocaleString()}</strong></p>
              <p>Remaining Due: <strong className="text-red-600">₹{(selected?.fees?.due || 75000).toLocaleString()}</strong></p>
            </div>
            <div>
              <label className="text-sm font-medium">Amount to Collect</label>
              <Input
                type="number"
                placeholder="5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={payFee} className="bg-green-600 hover:bg-green-700">
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}