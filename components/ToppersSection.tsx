// src/components/home/ToppersSection.tsx
import Image from "next/image";
import { Trophy, Star } from "lucide-react";

export default function ToppersSection() {
  const toppers = [
    { name: "Priya Sharma", rank: "AIR 1", exam: "NEET 2024", score: "710/720", image: "/topper1.jpg" },
    { name: "Ruhi Verma", rank: "AIR 7", exam: "JEE Advanced 2024", score: "330/360", image: "/topper2.jpg" },
    { name: "Anjali Gupta", rank: "AIR 12", exam: "NEET 2024", score: "705/720", image: "/topper3.jpg" },
    { name: "Kanika Kumari", rank: "AIR 28", exam: "JEE Mains 2025", score: "99.98 %ile", image: "/topper2.jpg" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-6">
        {/* Clean & Minimal Heading */}
        <div className="text-center mb-14">
          <p className="text-orange-600 font-semibold text-xs tracking-widest uppercase">
            Our Proud Achievers
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            Meet Our <span className="text-orange-600">Top Rankers</span>
          </h2>
        </div>

        {/* Elegant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {toppers.map((topper) => (
            <div
              key={topper.name}
              className="group relative bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              {/* Trophy Badge */}
              <div className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-2.5 rounded-full shadow-md z-10">
                <Trophy className="w-5 h-5" />
              </div>

              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={topper.image}
                  alt={topper.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Rank Badge */}
                <div className="absolute bottom-3 left-3 bg-orange-600 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                  {topper.rank}
                </div>
              </div>

              {/* Clean & Small Text */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-gray-900">{topper.name}</h3>
                <p className="text-sm text-orange-600 font-medium mt-1">{topper.exam}</p>
                <p className="text-xl font-black text-orange-600 mt-3">{topper.score}</p>

                {/* Small Stars */}
                <div className="flex justify-center gap-0.5 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}