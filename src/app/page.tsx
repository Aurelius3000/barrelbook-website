import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "BarrelBook — AI-Powered Bourbon Collection App",
  description:
    "Scan, catalog, and track your bourbon and whiskey collection with AI-powered bottle recognition. Download BarrelBook for iOS today.",
};

export default function Page() {
  return <LandingPage />;
}