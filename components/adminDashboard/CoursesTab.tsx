// components/CoursesTab.tsx
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
import { BookOpen, Plus, Trash2 } from "lucide-react";

export default function CoursesTab({ courses = [], onRefresh }: { courses: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [fee, setFee] = useState("");

  const addCourse = async () => {
    if (!name || !duration || !fee) return toast.error("All fields required");
    await addDoc(collection(db, "courses"), {
      name: name.trim(),
      duration: duration.trim(),
      fee: Number(fee),
      createdAt: new Date()
    });
    toast.success("Course added!");
    setOpen(false); setName(""); setDuration(""); setFee("");
    onRefresh();
  };

  const removeCourse = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" course?`)) return;
    await deleteDoc(doc(db, "courses", id));
    toast.success("Course deleted");
    onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-indigo-800">Courses & Batches</h2>
        <Button onClick={() => setOpen(true)} className="bg-indigo-600">
          <Plus className="w-5 h-5 mr-2" /> Add Course
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-indigo-50">
            <TableHead>Course Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium"><BookOpen className="inline w-5 h-5 mr-2 text-indigo-600" />{c.name}</TableCell>
              <TableCell>{c.duration}</TableCell>
              <TableCell className="font-bold text-indigo-600">₹{c.fee.toLocaleString()}</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => removeCourse(c.id, c.name)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Course</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Course Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="JEE 2026 Foundation" /></div>
            <div><Label>Duration</Label><Input value={duration} onChange={e => setDuration(e.target.value)} placeholder="2 Years" /></div>
            <div><Label>Course Fee</Label><Input type="number" value={fee} onChange={e => setFee(e.target.value)} placeholder="75000" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addCourse} className="bg-indigo-600">Add Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}