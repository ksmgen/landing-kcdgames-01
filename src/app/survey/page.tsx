import type { Metadata } from "next";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "KC Games Player Survey (Demo)",
  description:
    "Try a demo KC Games player survey. Answers stay in this browser tab and are never submitted.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SurveyPage() {
  return <SurveyForm />;
}
