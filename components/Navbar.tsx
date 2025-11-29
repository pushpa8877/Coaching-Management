// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Coaching", href: "/coaching", hasDropdown: true },
    { name: "About Me", href: "/about" },
    { name: "Contacts", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Left Side - Logo and Nav Links */}
          <h2 className="text-gray-700 font-medium hover:text-orange-600 transition flex items-center gap-1">Coachhub</h2>

          {/* Logo - Handwritten Style */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
             
              {/* Optional glow effect */}
              <div className="absolute -inset-2 bg-orange-300/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className="text-gray-700 font-medium hover:text-orange-600 transition flex items-center gap-1"
                >
                  {link.name}
                  {link.hasDropdown && <span className="text-xs">▼</span>}
                </Link>

                {/* Dropdown (for Coaching & Pages) */}
                {link.hasDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-4 px-6 space-y-3">
                      {link.name === "Coaching" ? (
                        <>
                          <Link href="/coaching/personal" className="block text-gray-700 hover:text-orange-600 transition">Personal Coaching</Link>
                          <Link href="/coaching/group" className="block text-gray-700 hover:text-orange-600 transition">Group Sessions</Link>
                          <Link href="/coaching/online" className="block text-gray-700 hover:text-orange-600 transition">Online Programs</Link>
                        </>
                      ) : (
                        <>
                          <Link href="/testimonials" className="block text-gray-700 hover:text-orange-600 transition">Testimonials</Link>
                          <Link href="/faq" className="block text-gray-700 hover:text-orange-600 transition">FAQ</Link>
                          <Link href="/pricing" className="block text-gray-700 hover:text-orange-600 transition">Pricing</Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side - Social + Mobile Menu */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6">
            <Link href="auth/login">Login!</Link>
            </div>

            {/* Social Icons - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-orange-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-600 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-gray-700 hover:bg-orange-50">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-xl">
                <div className="flex flex-col gap-8 mt-10">
                  {/* Logo in Mobile */}
                  <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                    <Image src="/logo-signature.png" alt="Liza Johnson" width={130} height={55} />
                  </Link>

                  <nav className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-lg font-medium text-gray-800 hover:text-orange-600 transition"
                      >
                        {link.name} {link.hasDropdown && "▼"}
                      </Link>
                    ))}
                  </nav>

                  {/* Call to Action */}
                  <div className="border-t pt-6">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-full shadow-lg">
                      <Phone className="mr-2 w-5 h-5" />
                      Book Free Consultation
                    </Button>
                  </div>

                  {/* Social in Mobile */}
                  <div className="flex justify-center gap-6 pt-6 border-t">
                    <Facebook className="w-6 h-6 text-gray-600 hover:text-orange-600 cursor-pointer transition" />
                    <Instagram className="w-6 h-6 text-gray-600 hover:text-orange-600 cursor-pointer transition" />
                    <Twitter className="w-6 h-6 text-gray-600 hover:text-orange-600 cursor-pointer transition" />
                    <Youtube className="w-6 h-6 text-gray-600 hover:text-orange-600 cursor-pointer transition" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}