// components/DoubtSession.tsx
"use client";

import { useState } from "react";
import { 
  MessageCircle, 
  Clock, 
  Calendar, 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Bell,
  // Remove if not using
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DoubtSession() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "live" | "ask">("upcoming");
  const [doubtText, setDoubtText] = useState("");
const [imagePreview, setImagePreview] = useState<string | null>(null);

  const upcomingSessions = [
    { id: 1, subject: "Physics", topic: "Rotational Motion Doubts", faculty: "RK Sir", date: "Today", time: "7:00 PM", students: 48 },
    { id: 2, subject: "Chemistry", topic: "Organic Chemistry Marathon", faculty: "NJ Ma'am", date: "Tomorrow", time: "6:30 PM", students: 62 },
    { id: 3, subject: "Maths", topic: "Calculus Doubts & Tricks", faculty: "MS Sir", date: "26 Nov", time: "8:00 PM", students: 35 },
  ];

  const liveNow = [
    { id: 10, subject: "Physics", topic: "Electrostatics Live Doubt Session", faculty: "RK Sir", students: 127, duration: "45 min" }
  ];

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Physics": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Chemistry": return "bg-green-100 text-green-800 border-green-300";
      case "Maths": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Live Doubt Sessions
          </h1>
          <p className="text-xl text-gray-600">Clear your doubts instantly with top faculty</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("live")}
            className={`pb-4 px-6 font-semibold text-lg border-b-4 transition-all ${
              activeTab === "live" 
                ? "border-red-600 text-red-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Live Now ({liveNow.length})
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-4 px-6 font-semibold text-lg border-b-4 transition-all ${
              activeTab === "upcoming" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab("ask")}
            className={`pb-4 px-6 font-semibold text-lg border-b-4 transition-all ${
              activeTab === "ask" 
                ? "border-green-600 text-green-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Ask a Doubt
          </button>
        </div>

        {/* LIVE NOW Section */}
        {activeTab === "live" && (
          <div className="space-y-6">
            {liveNow.map((session) => (
              <Card key={session.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Mic className="w-8 h-8" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          LIVE NOW
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </span>
                        </h3>
                        <p className="text-lg opacity-90">{session.topic}</p>
                      </div>
                    </div>
                    <Badge className="bg-white text-red-600 text-lg px-4 py-2">
                      <Users className="w-5 h-5 mr-2" />
                      {session.students} Online
                    </Badge>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-red-100 text-red-700 font-bold">RK</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg">{session.faculty}</p>
                          <p className="text-sm text-gray-500">Physics Faculty</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        <Clock className="w-4 h-4 mr-2" />
                        {session.duration} ongoing
                      </Badge>
                    </div>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8">
                      <Video className="w-6 h-6 mr-3" />
                      Join Session Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* UPCOMING SESSIONS */}
        {activeTab === "upcoming" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-xl transition-shadow border-0">
                <div className={`p-5 rounded-t-xl ${getSubjectColor(session.subject)}`}>
                  <Badge className="mb-3">{session.subject}</Badge>
                  <h3 className="font-bold text-xl text-gray-800">{session.topic}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{session.date}</span>
                    <Clock className="w-5 h-5 text-green-600 ml-6" />
                    <span className="font-medium">{session.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {session.faculty.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{session.faculty}</p>
                        <p className="text-sm text-gray-500">Faculty</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <Users className="w-4 h-4 mr-1" />
                      {session.students} registered
                    </Badge>
                  </div>
                  <Button className="w-full" size="lg">
                    <Bell className="w-5 h-5 mr-2" />
                    Remind Me
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ASK A DOUBT */}
        {activeTab === "ask" && (
          <div className="max-w-3xl mx-auto">
            <Card className="p-10 text-center">
              <MessageCircle className="w-24 h-24 mx-auto text-blue-600 mb-6" />
              <h2 className="text-bold text-3xl mb-4">Ask Your Doubt Instantly</h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload image or type your doubt — our faculty will answer within 24 hours!
              </p>
              <div className="space-y-6">
                <textarea
                  placeholder="Type your doubt here... (e.g., Why does current lead voltage in capacitor?)"
                  className="w-full h-40 p-6 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
                {/* === Replace ONLY this block === */}
<div className="flex flex-col items-center gap-6">
  {/* Image Upload */}
  <label
    htmlFor="doubt-image"
    className="flex items-center justify-center w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
  >
    {imagePreview ? (
      <div className="flex items-center gap-3 p-4">
        <img src={imagePreview} alt="Uploaded" className="h-20 rounded" />
        <span className="text-sm font-medium text-green-600">Image ready!</span>
      </div>
    ) : (
      <span className="text-gray-500 font-medium">Click to Upload Image</span>
    )}
    <input
      id="doubt-image"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setImagePreview(reader.result as string);
          reader.readAsDataURL(file);
        }
      }}
    />
  </label>

  {/* Submit Button */}
  <Button
    size="lg"
    className="w-full max-w-md h-14 text-lg font-semibold"
    disabled={!doubtText.trim() && !imagePreview}
    onClick={() => {
      alert("Your doubt has been submitted successfully! Faculty will reply within 24 hours.");
      setDoubtText("");
      setImagePreview(null);
    }}
  >
    Submit Doubt
  </Button>
</div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}