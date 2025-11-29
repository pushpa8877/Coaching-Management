// components/SalaryTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { IndianRupee, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SalaryTab({ teachers = [], onRefresh }: { teachers: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const paySalary = async () => {
    try {
      await updateDoc(doc(db, "teachers", selected.id), {
        "salary.paidThisMonth": true,
        "salary.lastPaidDate": serverTimestamp()
      });
      toast.success(`₹${selected.salary.monthly.toLocaleString()} paid to ${selected.name}`);
      setOpen(false);
      onRefresh();
    } catch {
      toast.error("Payment failed");
    }
  };

  const currentMonth = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-4xl font-bold mb-8 text-orange-800">Teacher Salary - {currentMonth}</h2>

      <Table>
        <TableHeader>
          <TableRow className="bg-orange-50">
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Monthly Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map(t => {
            const isPaid = t.salary.paidThisMonth;
            return (
              <TableRow key={t.id} className={isPaid ? "bg-green-50" : ""}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="font-mono">{t.teacherId}</TableCell>
                <TableCell className="text-orange-600 font-bold">
                  ₹{t.salary.monthly.toLocaleString()}
                </TableCell>
                <TableCell>
                  {isPaid ? (
                    <Badge className="bg-green-600"><CheckCircle2 className="w-4 h-4 mr-1" /> Paid</Badge>
                  ) : (
                    <Badge variant="destructive">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {isPaid ? (
                    <Badge className="bg-green-600">Paid This Month</Badge>
                  ) : (
                    <Button size="sm" onClick={() => { setSelected(t); setOpen(true); }}>
                      <IndianRupee className="w-4 h-4 mr-1" /> Pay Salary
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Salary - {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <p className="text-3xl font-bold text-orange-600 mb-6">
              ₹{selected?.salary.monthly.toLocaleString()}
            </p>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700" onClick={paySalary}>
              Confirm Payment for {currentMonth}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}