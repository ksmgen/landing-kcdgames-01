import type { Metadata } from "next";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "KC Games Retailer Survey",
  description:
    "KC Games retailer survey with tab-session drafts and secure submission to Betobee.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SurveyPage() {
  return <SurveyForm />;
}
