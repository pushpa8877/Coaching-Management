// components/NotificationsTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Bell, Send } from "lucide-react";

export default function NotificationsTab({ notifications = [], onRefresh }: { notifications: any[]; onRefresh: () => void }) {
  const [message, setMessage] = useState("");

  const sendNotification = async () => {
    if (!message.trim()) return toast.error("Write a message");
    await addDoc(collection(db, "notifications"), {
      message: message.trim(),
      sentAt: new Date(),
      read: false
    });
    toast.success("Notification sent to all students!");
    setMessage("");
    onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-purple-800 text-center">Send Notification</h2>

      <div className="space-y-6">
        <Textarea
          placeholder="Type your message here... (Visible to all students)"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="min-h-48 text-lg"
        />
        <Button onClick={sendNotification} size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
          <Send className="w-6 h-6 mr-3" /> Send to All Students
        </Button>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4">Recent Notifications</h3>
        {notifications.slice(0, 5).map(n => (
          <div key={n.id} className="bg-purple-50 p-4 rounded-lg mb-3 border-l-4 border-purple-600">
            <p className="text-gray-800">{n.message}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(n.sentAt?.seconds * 1000 || Date.now()).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}