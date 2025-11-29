// components/ExamsTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Trophy, Plus, Trash2 } from "lucide-react";

export default function ExamsTab({ exams = [], onRefresh }: { exams: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const conductExam = async () => {
    if (!title || !date) return toast.error("Fill all fields");
    await addDoc(collection(db, "exams"), {
      title: title.trim(),
      date,
      conductedAt: new Date()
    });
    toast.success("Exam scheduled!");
    setOpen(false); setTitle(""); setDate("");
    onRefresh();
  };

  const removeExam = async (id: string) => {
    if (!confirm("Delete this exam record?")) return;
    await deleteDoc(doc(db, "exams", id));
    toast.success("Exam removed");
    onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-amber-800">Exams & Results</h2>
        <Button onClick={() => setOpen(true)} className="bg-amber-600">
          <Trophy className="w-5 h-5 mr-2" /> Conduct Exam
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-amber- Trojan50">
            <TableHead>Exam Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map(e => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.title}</TableCell>
              <TableCell>{new Date(e.date).toLocaleDateString("en-IN")}</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => removeExam(e.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Conduct New Exam</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Exam Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Monthly Test - Physics" /></div>
            <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={conductExam} className="bg-amber-600">Schedule Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}