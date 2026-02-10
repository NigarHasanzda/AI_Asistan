import CoreFeature from "@/components/_home/CoreFeature/CoreFeature";
import CTASection from "@/components/_home/CTASection/CTASection";
import FeaturesSection from "@/components/_home/Features/Features";
import FirstSection from "@/components/_home/FirstSection/FirstSection";
import WhyChooseUs from "@/components/_home/WhyChooseUS/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <FirstSection/>
    <FeaturesSection/>
    <CoreFeature/>
    <WhyChooseUs/>
    <CTASection/>
    </>
  );
}
