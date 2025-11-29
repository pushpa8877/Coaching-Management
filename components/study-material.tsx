// app/dashboard/study-material/page.tsx ← FINAL 100% WORKING
"use client";

import { useState, useEffect } from "react";
import { Search, Download, Filter, FileText, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Material {
  id: string;
  title: string;
  type: "DPP" | "Notes" | "Module" | "Sheet" | "Theory";
  subject: string;
  link: string;
  uploadedAt?: any;
}

export default function StudyMaterialPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filtered, setFiltered] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const snapshot = await getDocs(collection(db, "studyMaterials"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Material[];

        // Sort by newest first
        data.sort((a, b) => {
          const dateA = a.uploadedAt?.toDate?.() || new Date(0);
          const dateB = b.uploadedAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setMaterials(data);
        setFiltered(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading materials:", error);
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    let result = materials;

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== "all") {
      result = result.filter((item) => item.subject === selectedSubject);
    }

    setFiltered(result);
  }, [searchTerm, selectedSubject, materials]);

  const subjects = ["all", "Physics", "Chemistry", "Maths", "Biology"];

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Physics": return "bg-blue-100 text-blue-700";
      case "Chemistry": return "bg-green-100 text-green-700";
      case "Maths": return "bg-purple-100 text-purple-700";
      case "Biology": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "DPP":
      case "Module":
        return <FolderOpen className="w-16 h-16 text-blue-600" />;
      case "Notes":
      case "Theory":
      case "Sheet":
      default:
        return <FileText className="w-16 h-16 text-green-600" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">Study Material</h1>
          <p className="text-xl text-gray-600">Latest DPPs, Notes, Modules & Sheets from your teachers</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by title, chapter, subject..."
              className="pl-12 h-14 rounded-xl text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {subjects.map((sub) => (
              <Button
                key={sub}
                variant={selectedSubject === sub ? "default" : "outline"}
                onClick={() => setSelectedSubject(sub)}
                className="capitalize"
              >
                <Filter className="w-4 h-4 mr-2" />
                {sub === "all" ? "All Subjects" : sub}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-gray-600">
          Showing <strong>{filtered.length}</strong> material{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((material) => (
            <Card
              key={material.id}
              className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0"
            >
              {/* Top Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 text-center">
                <div className="bg-white rounded-2xl shadow-inner p-6 mb-4 inline-block">
                  {getIcon(material.type)}
                </div>

                <Badge className={`mb-3 ${getSubjectColor(material.subject)}`}>
                  {material.subject}
                </Badge>

                <h3 className="font-bold text-lg line-clamp-2 mb-2">
                  {material.title}
                </h3>

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">{material.type}</span>
                  <span>{formatDate(material.uploadedAt)}</span>
                </div>
              </div>

              {/* Preview */}
              <div className="h-56 bg-gray-100 border-t">
                {material.link.includes(".pdf") ? (
                  <iframe
                    src={material.link}
                    className="w-full h-full"
                    title={material.title}
                  />
                ) : (
                  <img
                    src={material.link}
                    alt={material.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                )}
              </div>

              {/* Bottom Action */}
              <div className="bg-white p-4 border-t">
                <a href={material.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Open Material
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">No materials found</div>
            <p className="text-xl text-gray-500">Try changing your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}