// components/AttendanceTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Calendar } from "lucide-react";

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export default function AttendanceTab({ students = [], onRefresh }: { students: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const markAttendance = async (status: "Present" | "Absent") => {
    try {
      await updateDoc(doc(db, "students", selected.id), {
        [`attendance.${today}`]: status
      });
      toast.success(`${selected.name} marked ${status} for ${today}`);
      setOpen(false);
      onRefresh();
    } catch {
      toast.error("Failed to mark attendance");
    }
  };

  const getTodayStatus = (attendance: any) => {
    const status = attendance?.[today];
    if (status === "Present") return <Badge className="bg-green-600"><CheckCircle2 className="w-4 h-4 mr-1" /> Present</Badge>;
    if (status === "Absent") return <Badge variant="destructive"><XCircle className="w-4 h-4 mr-1" /> Absent</Badge>;
    return <Badge variant="secondary">Not Marked</Badge>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-blue-800">Attendance - {today}</h2>
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-semibold">{new Date().toLocaleDateString("en-IN")}</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead>Name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Today's Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(s => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell className="font-mono">{s.studentId}</TableCell>
              <TableCell>{s.course}</TableCell>
              <TableCell>{getTodayStatus(s.attendance)}</TableCell>
              <TableCell className="text-center">
                <Button size="sm" onClick={() => { setSelected(s); setOpen(true); }}>
                  Mark Attendance
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance - {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 justify-center py-8">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => markAttendance("Present")}>
              <CheckCircle2 className="w-6 h-6 mr-2" /> Present
            </Button>
            <Button size="lg" variant="destructive" onClick={() => markAttendance("Absent")}>
              <XCircle className="w-6 h-6 mr-2" /> Absent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}