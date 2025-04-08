import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PaymentFlowSection } from "@/components/home/PaymentFlowSection";
import { DeveloperSection } from "@/components/home/DeveloperSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <HowItWorksSection />
      <PaymentFlowSection />
      <DeveloperSection />
      <ProductsSection />
      <BenefitsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
