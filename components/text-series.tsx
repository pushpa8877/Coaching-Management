// components/TestSeries.tsx ← REUSABLE COMPONENT (Teacher + Student)
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, ExternalLink, Clock } from "lucide-react";

interface Test {
  id: string;
  name: string;
  link: string;
  createdAt: any;
}

export default function TestSeries({ showAddButton = true }: { showAddButton?: boolean }) {
  const [tests, setTests] = useState<Test[]>([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
    fetchTests();
  }, []);

  const checkUserRole = () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await import("firebase/firestore").then(f =>
          f.getDoc(f.doc(db, "users", user.uid))
        );
        const role = (await userDoc).data()?.role;
        setIsTeacher(role === "teacher" || role === "admin");
      }
    });
    return unsubscribe;
  };

  const fetchTests = async () => {
    try {
      const q = query(collection(db, "testSeries"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
      setTests(data);
    } catch (err) {
      console.error("Error fetching tests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async () => {
    if (!name.trim() || !link.trim()) {
      alert("Please fill both name and link");
      return;
    }

    try {
      await addDoc(collection(db, "testSeries"), {
        name: name.trim(),
        link: link.trim(),
        createdAt: serverTimestamp(),
      });
      setName("");
      setLink("");
      setOpen(false);
      fetchTests();
      alert("Test added successfully!");
    } catch (err) {
      alert("Failed to add test");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    try {
      return timestamp.toDate().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "Recently";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Add Button (only for teachers or when showAddButton=true) */}
      {(isTeacher || showAddButton) && (
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Test Series</h2>
          {isTeacher && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Test
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Create New Test</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Test Name (e.g. Physics Weekly Test #5)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Paste Google Form, Quizizz, or any test link..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleAddTest} className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Test
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      {/* Tests Grid */}
      {tests.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Target className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">No tests available yet</p>
          <p className="text-gray-400 mt-2">Your teacher will add tests soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tests.map((test) => (
            <Card
              key={test.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center">
                <Target className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h3 className="font-bold text-lg line-clamp-2 mb-3">{test.name}</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(test.createdAt)}</span>
                </div>
                <Badge className="mb-4 bg-green-600 text-white">Live</Badge>
                <a href={test.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Start Test
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}