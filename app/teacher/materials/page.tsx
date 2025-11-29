// app/teacher/materials/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import TeacherLayout from "@/components/TeacherDashboard/TeacherLayout";

export default function TeacherMaterialsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) router.push("/auth/teacher-login");
      const snap = await getDocs(query(collection(db, "teachers"), where("email", "==", user?.email)));
      if (!snap.empty) {
        const data = { id: snap.docs[0].id, ...snap.docs[0].data() };
        setTeacher(data);
        const mats = await getDocs(query(collection(db, "materials"), where("teacherId", "==", data.id)));
        setMaterials(mats.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });
    return () => unsub();
  }, [router]);

  const upload = async () => {
    if (!file || !title) return toast.error("Required");
    setUploading(true);
    try {
      const fileRef = ref(storage, `materials/${teacher.id}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "materials"), {
        title, url, fileName: file.name,
        teacherId: teacher.id, teacherName: teacher.name, batch: teacher.batch,
        uploadedAt: serverTimestamp()
      });

      toast.success("Uploaded!");
      setTitle(""); setFile(null);
      const mats = await getDocs(query(collection(db, "materials"), where("teacherId", "==", teacher.id)));
      setMaterials(mats.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { toast.error("Failed"); }
    setUploading(false);
  };

  return (
    <TeacherLayout teacherName={teacher?.name}>
      <h1 className="text-5xl font-bold mb-10">Study Materials</h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 border rounded-xl mb-4 text-lg" />
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full p-4 border rounded-xl mb-6" />
        <button onClick={upload} disabled={uploading} className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
          {uploading ? "Uploading..." : "Upload Material"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(m => (
          <div key={m.id} className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-xl font-bold mb-2">{m.title}</h3>
            <p className="text-gray-600 mb-4">{m.fileName}</p>
            <a href={m.url} target="_blank" className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-green-700">
              Download
            </a>
          </div>
        ))}
      </div>
    </TeacherLayout>
  );
}