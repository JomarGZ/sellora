import { HeroSection } from "../components/sections/HeroSection";
import { NewArrivalsSection } from "../components/sections/NewArrivalsSection";
import { BestSellerSection } from "../components/sections/BestSellerSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <NewArrivalsSection />
      <BestSellerSection />
    </>
  );
}
