// app/dashboard/study-material/page.tsx ← FINAL LINK-BASED VERSION (NO STORAGE NEEDED)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import { Search, Download, Upload, Link2, FileText, Atom, Calculator, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Material {
  id: string;
  title: string;
  subject: string;
  type: string;
  link: string;
  uploadedAt: any;
  uploadedBy: string;
}

export default function StudyMaterialPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filtered, setFiltered] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [loading, setLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // Upload Form
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check if teacher
      const userDoc = await import("firebase/firestore").then(firestore =>
        firestore.getDoc(firestore.doc(db, "users", user.uid))
      );
      const role = (await userDoc).data()?.role;
      setIsTeacher(role === "teacher" || role === "admin");

      fetchMaterials();
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchMaterials = async () => {
    const q = query(collection(db, "studyMaterials"), orderBy("uploadedAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
    setMaterials(data);
    setFiltered(data);
  };

  useEffect(() => {
    let result = materials;

    if (searchTerm) {
      result = result.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== "All Subjects") {
      result = result.filter(m => m.subject === selectedSubject);
    }

    setFiltered(result);
  }, [searchTerm, selectedSubject, materials]);

  const handleAddMaterial = async () => {
    if (!title || !subject || !type || !link.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "studyMaterials"), {
        title,
        subject,
        type,
        link: link.trim(),
        uploadedAt: serverTimestamp(),
        uploadedBy: auth.currentUser?.uid,
      });

      alert("Material added successfully!");
      setOpenUpload(false);
      setTitle(""); setSubject(""); setType(""); setLink("");
      fetchMaterials();
    } catch (err) {
      console.error(err);
      alert("Failed to add material");
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "Physics": return <Atom className="w-10 h-10" />;
      case "Chemistry": return <Beaker className="w-10 h-10" />;
      case "Maths": return <Calculator className="w-10 h-10" />;
      default: return <FileText className="w-10 h-10" />;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Physics": return "bg-blue-100 text-blue-700";
      case "Chemistry": return "bg-green-100 text-green-700";
      case "Maths": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recently";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return "Recently";
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white/80 backdrop-blur shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-3">Study Material</h1>
              <p className="text-xl text-gray-600">Latest DPPs, Notes, Modules & Sheets</p>
            </div>

            {isTeacher && (
              <Dialog open={openUpload} onOpenChange={setOpenUpload}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Upload className="w-6 h-6 mr-3" />
                    Upload Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Add Study Material</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 py-6">
                    <div>
                      <Label className="text-lg">Title</Label>
                      <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Electrostatics DPP - Chapter 1" className="mt-2" />
                    </div>
                    <div>
                      <Label className="text-lg">Subject</Label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="mt-2"><SelectValue placeholder="Choose subject" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Maths">Maths</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-lg">Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="mt-2"><SelectValue placeholder="Choose type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DPP">DPP</SelectItem>
                          <SelectItem value="Notes">Notes</SelectItem>
                          <SelectItem value="Module">Module</SelectItem>
                          <SelectItem value="Sheet">Sheet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-lg">Direct Link (Google Drive, ImgBB, etc.)</Label>
                      <Textarea
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        placeholder="https://drive.google.com/file/d/abc123/view..."
                        className="mt-2 h-28 resize-none"
                      />
                    </div>
                    <Button onClick={handleAddMaterial} className="w-full text-lg py-6 bg-gradient-to-r from-indigo-600 to-purple-600" disabled={!title || !subject || !type || !link.trim()}>
                      <Link2 className="w-5 h-5 mr-2" /> Add Material
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              placeholder="Search materials..."
              className="pl-14 h-14 text-lg"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            {["All Subjects", "Physics", "Chemistry", "Maths"].map(s => (
              <Button
                key={s}
                variant={selectedSubject === s ? "default" : "outline"}
                onClick={() => setSelectedSubject(s)}
                size="lg"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-8">Showing {filtered.length} materials</p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((material) => (
            <Card key={material.id} className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all group">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center">
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${getSubjectColor(material.subject)}`}>
                  {getSubjectIcon(material.subject)}
                </div>
                <Badge className="mb-3 text-sm">{material.type}</Badge>
                <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-indigo-700 transition-colors">
                  {material.title}
                </h3>
                <p className="text-sm text-gray-600">{formatDate(material.uploadedAt)}</p>
              </div>

              {/* Preview */}
              <div className="h-64 bg-gray-100 border-t">
                {material.link.includes(".pdf") ? (
                  <iframe src={material.link} className="w-full h-full" title={material.title} />
                ) : (
                  <img src={material.link} alt={material.title} className="w-full h-full object-cover" onError={e => e.currentTarget.src = "/placeholder.png"} />
                )}
              </div>

              <div className="p-4 bg-white">
                <a href={material.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Download className="w-5 h-5 mr-2" /> Open Material
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32">
            <FileText className="w-32 h-32 mx-auto text-gray-300 mb-6" />
            <p className="text-2xl text-gray-500">No materials found</p>
          </div>
        )}
      </div>
    </div>
  );
}