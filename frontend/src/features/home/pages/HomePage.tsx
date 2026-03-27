import { HeroSection } from "../components/sections/HeroSection";
import { NewArrivalsSection } from "../components/sections/NewArrivalsSection";
import { BestSellerSection } from "../components/sections/BestSellerSection";
import { getToken } from "@/shared/api/client";

export function HomePage() {
  console.log("token", getToken());
  return (
    <>
      <HeroSection />
      <NewArrivalsSection />
      <BestSellerSection />
    </>
  );
}
