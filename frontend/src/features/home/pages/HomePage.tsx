import { HeroSection } from "../components/sections/HeroSection";
import { NewArrivalsSection } from "../components/sections/NewArrivalsSection";
import { BestSellerSection } from "../components/sections/BestSellerSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      {/* 2. Brand Logos / Trusted By */}
      {/* 3. Categories Showcase */}
      {/* 4. Why Choose Us */}
      <NewArrivalsSection />
      {/* 6. Promo Banner */}
      <BestSellerSection />
      {/* 8. Testimonials */}
      {/* 9. Newsletter CTA */}
    </>
  );
}
