"use client"
import ContactPage from "@/components/_home/Contact";
import CoreFeature from "@/components/_home/CoreFeature/CoreFeature";
import CTASection from "@/components/_home/CTASection/CTASection";
import FeaturesSection from "@/components/_home/Features/Features";
import FirstSection from "@/components/_home/FirstSection/FirstSection";
import LeaderboardSection from "@/components/_home/LeaderBoard";
import PricingSection from "@/components/_home/Pricing";
import WhyChooseUs from "@/components/_home/WhyChooseUS/WhyChooseUs";
import { isTokenExpired } from "@/services/Auth";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {


  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // istəsən login səhifəsinə yönləndir
    window.location.href = "/login";
  }
}, []);
  return (
    <>
    <FirstSection/>
    <FeaturesSection/>
    <LeaderboardSection/>
    <PricingSection/>
    <CoreFeature/>

    <WhyChooseUs/>
    <ContactPage/>
    <CTASection/>
    </>
  );
}
