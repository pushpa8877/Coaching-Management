// components/adminDashboard/TeachersTab.tsx → FULLY WORKING + BEAUTIFUL
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserPlus, Trash2, Edit2, Search, Download, Users } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface Teacher {
  id: string;
  name: string;
  email: string;
  teacherId: string;
  course: string;
  subject: string;
  salary: number;
  createdAt: any;
}

export default function TeachersTab({ teachers }: { teachers: Teacher[] }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    subject: "",
    salary: 50000
  });

  const generateTeacherId = async () => {
    const q = query(collection(db, "teachers"), orderBy("teacherId", "desc"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return "TCH1";
    const last = snap.docs[0].data().teacherId;
    const num = parseInt(last.replace("TCH", "")) || 0;
    return `TCH${num + 1}`;
  };

  const addTeacher = async () => {
    if (!form.name || !form.email || !form.password || !form.course || !form.subject) {
      toast.error("All fields required");
      return;
    }

    try {
      const teacherId = await generateTeacherId();

      let uid: string;
      try {
        const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
        uid = cred.user.uid;
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          toast.error("Email already exists!");
          return;
        }
        throw err;
      }

      await addDoc(collection(db, "teachers"), {
        uid,
        teacherId,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        course: form.course.trim(),
        subject: form.subject.trim(),
        salary: Number(form.salary),
        role: "teacher",
        createdAt: serverTimestamp(),
      });

      toast.success(`Teacher ${form.name} added as ${teacherId}`);
      setOpen(false);
      setForm({ name: "", email: "", password: "", course: "", subject: "", salary: 50000 });
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };

  const openEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setForm({
      name: t.name,
      email: t.email,
      password: "",
      course: t.course,
      subject: t.subject,
      salary: t.salary
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editingTeacher) return;
    try {
      await updateDoc(doc(db, "teachers", editingTeacher.id), {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        course: form.course.trim(),
        subject: form.subject.trim(),
        salary: Number(form.salary),
      });
      toast.success("Updated!");
      setEditOpen(false);
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteTeacher = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await deleteDoc(doc(db, "teachers", id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = teachers.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.teacherId?.includes(search) ||
    t.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const csv = "ID,Name,Email,Course,Subject,Salary\n" +
      filtered.map(t => `${t.teacherId},"${t.name}",${t.email},${t.course},${t.subject},${t.salary}`).join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teachers.csv";
    a.click();
    toast.success("Exported!");
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-9 h-9" /> Teachers ({teachers.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
              <Input
                placeholder="Search teachers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 w-64"
              />
            </div>
            <Button onClick={exportCSV} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button onClick={() => setOpen(true)} size="sm">
              <UserPlus className="w-4 h-4 mr-2" /> Add Teacher
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50">
              <TableHead className="font-bold text-purple-800">ID</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden lg:table-cell">Course</TableHead>
              <TableHead className="hidden md:table-cell text-right">Salary</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-gray-500 text-lg">
                  {search ? "No teachers found" : "No teachers added yet"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id} className="hover:bg-purple-50/30 transition">
                  <TableCell className="font-bold text-purple-700">{t.teacherId}</TableCell>
                  <TableCell className="font-semibold">{t.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{t.email}</TableCell>
                  <TableCell>
                    <Badge>{t.subject}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{t.course}</TableCell>
                  <TableCell className="hidden md:table-cell text-right text-green-600 font-medium">
                    ₹{t.salary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(t)}>
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteTeacher(t.id, t.name)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Rahul Kumar" /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="rahul@school.com" /></div>
            <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" /></div>
            <div><Label>Course</Label><Input value={form.course} onChange={e => setForm({...form, course: e.target.value})} placeholder="BCA 2025" /></div>
            <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Mathematics" /></div>
            <div><Label>Salary (₹)</Label><Input type="number" value={form.salary} onChange={e => setForm({...form, salary: parseInt(e.target.value) || 0})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addTeacher} className="bg-purple-600 hover:bg-purple-700">Add Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Teacher</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><Label>Course</Label><Input value={form.course} onChange={e => setForm({...form, course: e.target.value})} /></div>
            <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
            <div><Label>Salary (₹)</Label><Input type="number" value={form.salary} onChange={e => setForm({...form, salary: parseInt(e.target.value) || 0})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} className="bg-blue-600">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}