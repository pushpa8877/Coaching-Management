// components/StudentsTab.tsx → FULLY FIXED!
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Search, Download } from "lucide-react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function StudentsTab({
  initialStudents = [],
  initialTeachers = [],
}: {
  initialStudents?: any[];
  initialTeachers?: any[];
}) {
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    course: "",
    teacherId: "",
  });

  const students = initialStudents;
  const teachers = initialTeachers;

  const filteredStudents = students.filter((s: any) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.course?.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (student: any) => {
    setEditingStudent(student);
    setForm({
      name: student.name || "",
      studentId: student.studentId || "",
      course: student.course || "",
      teacherId: student.teacherId || "", // This was missing!
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!form.name || !form.studentId || !form.course) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await updateDoc(doc(db, "students", editingStudent.id), {
        name: form.name.trim(),
        studentId: form.studentId.trim(),
        course: form.course.trim(),
        teacherId: form.teacherId || null,
      });
      toast.success("Student updated!");
      setEditOpen(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Deleted!");
    } catch {
      toast.error("Delete failed");
    }
  };

  const exportToExcel = () => {
    const data = filteredStudents.map((s: any) => ({
      "Student Name": s.name,
      "Student ID": s.studentId,
      "Course": s.course,
      "Teacher": teachers.find((t) => t.id === s.teacherId)?.name || "Not Assigned",
      "Fees Paid": s.fees?.paid || 0,
      "Due": Math.max(0, 75000 - (s.fees?.paid || 0)),
    }));

    const csv = "\uFEFF" + Object.keys(data[0]).join(",") + "\r\n" +
      data.map(row => Object.values(row).map(v => `"${v}"`).join(",")).join("\r\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Students.csv";
    a.click();
    toast.success("Exported!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-indigo-800">Students</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button onClick={exportToExcel} className="bg-green-600">
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Fees</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.studentId}</TableCell>
              <TableCell>{s.course}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {teachers.find((t) => t.id === s.teacherId)?.name || "Not Assigned"}
                </Badge>
              </TableCell>
              <TableCell>
                ₹{s.fees?.paid || 0} / 75,000
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id, s.name)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Student ID</Label>
              <Input value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
            </div>
            <div>
              <Label>Course</Label>
              <Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
            </div>
            <div>
              {/* FIXED SELECT — NO MORE ERROR! */}
              <div>
                <Label>Assign Teacher</Label>
                <Select
                  value={form.teacherId || ""}
                  onValueChange={(value) => setForm({ ...form, teacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* THIS IS THE CORRECT WAY — value="" with text! */}
                    <SelectItem value="none">Not Assigned</SelectItem>

                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.teacherId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}