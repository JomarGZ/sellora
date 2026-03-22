import { HeroSection } from "../sections/HeroSection";
import { NewArrivalsSection } from "../sections/NewArrivalsSection";
import { BestSellerSection } from "../sections/BestSellerSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <NewArrivalsSection />
      <BestSellerSection />
    </>
  );
}
