import { HeroSection } from "../components/sections/HeroSection";
import { NewArrivalsSection } from "../components/sections/NewArrivalsSection";
import { BestSellerSection } from "../components/sections/BestSellerSection";
import BrandLogos from "../components/sections/BrandLogos";
import CategoriesShowcase from "../components/sections/CategoriesShowcase";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandLogos />
      <CategoriesShowcase />
      {/* 4. Why Choose Us */}
      <NewArrivalsSection />
      {/* 6. Promo Banner */}
      <BestSellerSection />
      {/* 8. Testimonials */}
      {/* 9. Newsletter CTA */}
    </>
  );
}
