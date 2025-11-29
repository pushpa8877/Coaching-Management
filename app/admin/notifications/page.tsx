// app/admin/notifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NotificationsTab from "@/components/adminDashboard/NotificationsTab";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    const snap = await getDocs(collection(db, "notifications"));
    setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, []);

  if (loading) return <div className="p-8 text-3xl">Loading Notifications...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <NotificationsTab notifications={notifications} onRefresh={fetchNotifs} />
    </div>
  );
}