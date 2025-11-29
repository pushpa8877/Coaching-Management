// src/app/page.tsx
import AboutSection from "@/components/About";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ToppersSection from "@/components/ToppersSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <ToppersSection/>
        <AboutSection/>

        <Footer/>


        {/* <HeroSection /> */}
        {/* Add more sections later */}
        {/* <StatsSection /> */}
        {/* <CoursesPreview /> */}
        {/* <Testimonials /> */}
      </main>

      {/* <Footer /> */}

      {/* Floating WhatsApp Button
      <FloatingWhatsApp phone="919703264444" /> */}
    </div>
  );
}