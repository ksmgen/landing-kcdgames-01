import type { Metadata } from "next";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "KC Games Player Survey (Demo)",
  description:
    "Try a demo KC Games player survey. Answers stay in your browser and are not saved or submitted.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SurveyPage() {
  return <SurveyForm />;
}
