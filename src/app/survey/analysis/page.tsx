import type { Metadata } from "next";
import { SurveyAnalysis } from "@/components/survey-analysis";
export const metadata: Metadata = { title: "问卷数据分析" };
export default function SurveyAnalysisPage() { return <SurveyAnalysis />; }
