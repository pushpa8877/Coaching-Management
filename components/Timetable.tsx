// components/Timetable.tsx
"use client";

import { useState } from "react";
import { Calendar, Clock, BookOpen, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Timetable() {
  const [selectedBatch, setSelectedBatch] = useState("JEE 2026");
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date("2025-11-17")); // Monday

  const batches = ["JEE 2026", "JEE 2025", "NEET 2026", "NEET 2025", "Foundation 10th"];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getWeekDates = () => {
    return weekDays.map((_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  // Sample timetable data per batch
  const timetableData: Record<string, any[]> = {
    "JEE 2026": [
      { day: 0, time: "06:00 AM", subject: "Physics", topic: "Electrostatics", faculty: "RK Sir" },
      { day: 0, time: "08:00 AM", subject: "Maths", topic: "Limits & Continuity", faculty: "MS Sir" },
      { day: 0, time: "04:00 PM", subject: "Chemistry", topic: "Chemical Bonding", faculty: "NJ Ma'am" },
      { day: 1, time: "06:00 AM", subject: "Chemistry", topic: "Mole Concept", faculty: "NJ Ma'am" },
      { day: 1, time: "08:00 AM", subject: "Physics", topic: "Gravitation", faculty: "RK Sir" },
      { day: 1, time: "04:00 PM", subject: "Maths", topic: "Differentiation", faculty: "MS Sir" },
      { day: 2, time: "06:00 AM", subject: "Maths", topic: "Functions", faculty: "MS Sir" },
      { day: 2, time: "08:00 AM", subject: "Chemistry", topic: "Atomic Structure", faculty: "NJ Ma'am" },
      { day: 3, time: "06:00 AM", subject: "Physics", topic: "Kinematics", faculty: "RK Sir" },
      { day: 4, time: "04:00 PM", subject: "Maths", topic: "Integration", faculty: "MS Sir" },
      { day: 5, time: "06:00 AM", subject: "Chemistry", topic: "Organic Nomenclature", faculty: "NJ Ma'am" },
      { day: 6, time: "Rest Day", subject: "Holiday", topic: "No Class", faculty: "" },
    ],
    "NEET 2026": [
      { day: 0, time: "07:00 AM", subject: "Biology", topic: "Cell Structure", faculty: "Dr. SK" },
      { day: 0, time: "09:00 AM", subject: "Physics", topic: "Units & Dimensions", faculty: "RK Sir" },
      { day: 0, time: "05:00 PM", subject: "Chemistry", topic: "Periodic Table", faculty: "NJ Ma'am" },
      // ... more
    ],
    // Add more batches if needed
  };

  const currentTimetable = timetableData[selectedBatch] || timetableData["JEE 2026"];

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Physics": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Chemistry": return "bg-green-100 text-green-800 border-green-300";
      case "Maths": return "bg-purple-100 text-purple-800 border-purple-300";
      case "Biology": return "bg-pink-100 text-pink-800 border-pink-300";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Class Timetable</h1>
          <p className="text-lg text-gray-600">Your daily schedule • Never miss a class</p>
        </div>

        {/* Batch Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {batches.map((batch) => (
            <Button
              key={batch}
              variant={selectedBatch === batch ? "default" : "outline"}
              onClick={() => setSelectedBatch(batch)}
              className="font-medium"
            >
              <Users className="w-4 h-4 mr-2" />
              {batch}
            </Button>
          ))}
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm p-4">
          <Button variant="ghost" size="sm" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold">Week of {currentWeekStart.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</h2>
            <p className="text-sm text-gray-500">Batch: {selectedBatch}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigateWeek("next")}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Timetable Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day, dayIndex) => {
            const dayClasses = currentTimetable.filter(c => c.day === dayIndex);
            const dates = getWeekDates();

            return (
              <Card key={day} className="overflow-hidden border-0 shadow-lg">
                <div className="bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-4 text-center">
                  <h3 className="font-bold text-lg">{day}</h3>
                  <p className="text-sm opacity-90">{dates[dayIndex]}</p>
                </div>
                <div className="p-4 space-y-3 min-h-96 bg-gray-50">
                  {dayClasses.length > 0 ? (
                    dayClasses.map((cls, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border-2 ${getSubjectColor(cls.subject)} backdrop-blur-sm bg-white/80`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-bold text-lg">{cls.time}</span>
                        </div>
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {cls.subject}
                        </h4>
                        <p className="text-sm text-gray-700 mt-1">{cls.topic}</p>
                        <p className="text-xs text-gray-500 mt-2">by {cls.faculty}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No Class</p>
                      <p className="text-sm">Enjoy your day!</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Badge className="bg-blue-100 text-blue-800">Physics</Badge>
          <Badge className="bg-green-100 text-green-800">Chemistry</Badge>
          <Badge className="bg-purple-100 text-purple-800">Maths</Badge>
          <Badge className="bg-pink-100 text-pink-800">Biology</Badge>
        </div>
      </div>
    </div>
  );
}