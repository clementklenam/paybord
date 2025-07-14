import Navbar from "@/components/home/Navbar";
import {HeroSection} from "@/components/home/HeroSection";
import {FeaturesSection} from "@/components/home/FeaturesSection";
import {UseCasesSection} from "@/components/home/UseCasesSection";
import {TestimonialsSection} from "@/components/home/TestimonialsSection";
import {CTASection} from "@/components/home/CTASection";
import {Footer} from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <UseCasesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
