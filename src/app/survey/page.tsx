import type { Metadata } from "next";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "KC Games Retailer Survey (Demo)",
  description:
    "KC Games retailer survey with tab-session drafts and explicit submission to the livetest API.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SurveyPage() {
  return <SurveyForm />;
}
