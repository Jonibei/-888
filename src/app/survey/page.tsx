import type { Metadata } from "next";
import { SurveyForm } from "@/components/survey-form";

export const metadata: Metadata = { title: "视觉设计师跨部门协作与 AI 使用调查", description: "了解视觉设计师如何与团队协作、使用 AI 与应对项目修改。" };

export default function SurveyPage() {
  return <SurveyForm />;
}
