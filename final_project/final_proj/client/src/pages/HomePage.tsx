import CtaSection from "../components/home/CtaSection";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import ImpactSection from "../components/home/ImpactSection";
import MaterialsSection from "../components/home/MaterialsSection";
import RepairCaseSection from "../components/home/RepairCaseSection";
import StatsSection from "../components/home/StatsSection";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-4 sm:space-y-16">
      <HeroSection />
      <HowItWorks />
      <StatsSection />
      <MaterialsSection />
      <RepairCaseSection />
      <ImpactSection />
      <CtaSection />
    </div>
  );
}
