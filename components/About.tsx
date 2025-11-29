// src/components/home/AboutSection.tsx
import Image from "next/image";
import { CheckCircle, Users, Award, HeartHandshake } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">

        {/* Main Heading */}
        <div className="text-center mb-16">
          <p className="text-orange-600 font-bold text-sm tracking-widest uppercase">
            About CoachHub
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
            10+ Years of Creating <span className="text-orange-600">Top Rankers</span>
          </h2>
          <p className="text-gray-600 mt-6 max-w-3xl mx-auto text-lg">
            We don't just teach — we mentor, guide, and walk with every student until they achieve their dream rank in NEET, JEE & more.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Image + Stats */}
          <div className="relative">
            <Image
              src="/classroom.jpg"
              alt="Our coaching classroom"
              width={700}
              height={600}
              className="rounded-3xl shadow-2xl"
              priority
            />

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-8 -left-8 bg-orange-600 text-white p-6 rounded-3xl shadow-xl">
              <h3 className="text-4xl font-black">50K+</h3>
              <p className="text-orange-100">Students Trained</p>
            </div>

            <div className="absolute -top-8 -right-8 bg-white border-4 border-orange-500 p-6 rounded-3xl shadow-2xl">
              <h3 className="text-4xl font-black text-orange-600">15+</h3>
              <p className="text-gray-700 font-semibold">Years of Excellence</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-900">
              Why Thousands of Students Trust Us Every Year
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Founded in 2010, CoachHub has become one of India's most loved coaching institutes with a proven track record of producing All India Toppers year after year.
            </p>

            <div className="space-y-6">
              {[
                { icon: Users, title: "Expert Faculty", desc: "IITians & Doctors with 10+ years of teaching experience" },
                { icon: Award, title: "Proven Results", desc: "500+ selections in Top 100 every year" },
                { icon: HeartHandshake, title: "Personal Mentorship", desc: "One mentor for every 15 students" },
                { icon: CheckCircle, title: "100% Doubt Clearance", desc: "24×7 doubt solving via app & WhatsApp" },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <item.icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                    <p className="text-gray-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-6 mt-10">
              <div className="text-center">
                <h3 className="text-5xl font-black text-orange-600">1,284</h3>
                <p className="text-gray-600 font-semibold">NEET Selections 2024</p>
              </div>
              <div className="text-center">
                <h3 className="text-5xl font-black text-orange-600">892</h3>
                <p className="text-gray-600 font-semibold">JEE Advanced 2024</p>
              </div>
              <div className="text-center">
                <h3 className="text-5xl font-black text-orange-600">97.8%</h3>
                <p className="text-gray-600 font-semibold">Success Rate</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}