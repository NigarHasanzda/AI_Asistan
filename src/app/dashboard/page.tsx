import FirstSection from "./components/_landing/First";
import InternshipListings from "./components/_landing/InternshipListings";
import SmartMatch from "./components/_landing/SmartMatch";
import StatsCards from "./components/_landing/StatsCard";


export default function Home() {
  return (
    <>
    <FirstSection/> 
    <StatsCards/> 
    <SmartMatch/>
    <InternshipListings/>
    </>
  );
}
