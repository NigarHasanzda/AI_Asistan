"use client";
import React, { useEffect } from 'react';
import { getCompanyDashboard, getMyCompany } from "@/services/CompanyServices";
import FirstSection from "./components/_landing/First";
import InternshipListings from "./components/_landing/InternshipListings";
import SmartMatch from "./components/_landing/SmartMatch";
import StatsCards from "./components/_landing/StatsCard";


export default function Home() {

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token yoxdur");
        return;
      }

      const company = await getMyCompany(token);
      console.log("Company:", company);

      const dashboard = await getCompanyDashboard(token);
      console.log("Dashboard:", dashboard);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  fetchData();
}, []);
  return (
    <>
    <FirstSection/> 
    <StatsCards/> 
    <SmartMatch/>
    <InternshipListings/>
    </>
  );
}
