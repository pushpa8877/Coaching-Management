// src/components/home/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen flex items-center overflow-hidden">
            {/* Subtle Background Circles */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start min-h-screen">

                    {/* LEFT COLUMN – Perfectly packed */}
                    <div className="space-y-10 pt-10 lg:pt-20">

                        <p className="text-xs font-semibold text-orange-700 tracking-widest uppercase">
                            Self-Improvement & Wellness
                        </p>

                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Make A Positive<br />
                            <span className="text-orange-600">Change In Your</span><br />
                            Life Today
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                            We are a team of experienced life coaches who specialize in helping individuals achieve their goals and overcome challenges. Our approach is personalized and tailored to each individual's unique needs and circumstances.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link href="/coaching">
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-6 rounded-full shadow-lg">
                                    Coaching
                                </Button>
                            </Link>
                            <Link href="/consultation">
                                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold px-10 py-6 rounded-full">
                                    Free Consultation
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-bold px-12 py-6 rounded-full shadow-xl">
                                    Register Now
                                </Button>
                            </Link>
                        </div>

                        {/* Stats + Group Image */}
                        <div className="relative mt-8">
                            <Image
                                src="/second.jpg"
                                alt="Group coaching session"
                                width={700}
                                height={450}
                                className="rounded-3xl shadow-2xl w-full"
                                priority
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm rounded-b-3xl p-8">
                                <div className="grid grid-cols-3 gap-6 text-center">
                                    <div>
                                        <h3 className="text-4xl font-black text-orange-600">98%</h3>
                                        <p className="text-sm text-gray-600">Time to time schedule</p>
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-orange-600">750</h3>
                                        <p className="text-sm text-gray-600">24/7 Online Support</p>
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-orange-600">20+</h3>
                                        <p className="text-sm text-gray-600">Man to Optimize</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transform Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex-row">
                            <h3 className="text-xl font-bold text-gray-900">Personal Sessions</h3>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                                Transform Your Life & Live Your Dream
                            </h2>
                            <p className="text-gray-600 mb-6">
                                With our expert guidance, you can transform your life and live your dream.<br /><br />
                                Join us today and start living your best life!
                            </p>
                            <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 font-bold rounded-full px-8 py-4">
                                Read More <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
    

                    {/* ==================== RIGHT COLUMN – CARD IN GAP (NO OVERLAP) ==================== */}
                    <div className="relative h-screen flex flex-col items-center justify-center lg:justify-end">
                        {/* Full Background Image */}
                        <Image
                            src="/first.jpg"
                            alt="Life Coach"
                            fill
                            className="object-cover object-top rounded-3xl shadow-2xl"
                            priority
                        />

                        {/* Light Overlay for Better Contrast */}
                        <div className="bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl pb-16 py-30" />

                        {/* Floating Card – Perfectly placed in the natural gap (below face, right side) */}
                        <div className="relative z-10">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-orange-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">How Can I Help You?</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    We offer personalized coaching services that help individuals achieve their goals 
                                    
                                </p>
                                <Link href="tel:+1234567890">
                                    <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-6 rounded-full flex items-center justify-center gap-3 shadow-lg">
                                        <Phone className="w-5 h-5" />
                                        Dial Now 123-456-7890
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}