import { HeroSection } from "../components/sections/HeroSection";
import { NewArrivalsSection } from "../components/sections/NewArrivalsSection";
import { BestSellerSection } from "../components/sections/BestSellerSection";
import BrandLogos from "../components/sections/BrandLogos";
import CategoriesShowcase from "../components/sections/CategoriesShowcase";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import { Testimonials } from "../components/sections/Testimonials";
import { PromoBanner } from "../components/sections/PromoBanner";
import { Newsletter } from "../components/sections/NewsLetter";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandLogos />
      <CategoriesShowcase />
      <WhyChooseUs />
      <NewArrivalsSection />
      <PromoBanner />
      <BestSellerSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}
