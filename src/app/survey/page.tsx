import type { Metadata } from "next";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "KC Games Retailer Survey (Demo)",
  description:
    "Try a demo simulation of the KC Games retailer survey. Answers stay in this browser tab and are never submitted.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SurveyPage() {
  return <SurveyForm />;
}
