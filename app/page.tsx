import FeatureList from "@/components/Feature";
import HeroSection from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <HeroSection/>
      <FeatureList/>
    </main>
  );
}
