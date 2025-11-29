// src/components/layout/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo & About */}
          <div>
            <Image src="/logo-white.png" alt="CoachHub" width={180} height={60} className="mb-6" />
            <p className="text-gray-300 leading-relaxed">
              India's most trusted coaching institute for NEET, JEE & Foundation courses. 
              10+ years of excellence, 50,000+ selections.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-orange-600 transition"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-orange-600 transition"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-orange-600 transition"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-orange-600 transition"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-orange-500">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "About Us", "Courses", "Results", "Gallery", "Contact"].map((item) => (
                <li key={item}><Link href="#" className="text-gray-300 hover:text-orange-400 transition">→ {item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-orange-500">Our Courses</h3>
            <ul className="space-y-3 text-gray-300">
              <li>→ NEET Foundation</li>
              <li>→ JEE Advanced</li>
              <li>→ NEET Crash Course</li>
              <li>→ Class 11th & 12th</li>
              <li>→ Online Live Classes</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-orange-500">Get in Touch</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span>info@coachhub.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                <span>123, Coaching Street, Kota, Rajasthan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 CoachHub Education. All rights reserved. | Made with passion in India</p>
        </div>
      </div>
    </footer>
  );
}