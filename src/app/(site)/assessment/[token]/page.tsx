import type { Metadata } from "next";
import { AssessmentResult } from "@/components/assessment-result";

export const metadata: Metadata = {
  title: "Your Space DNA",
  description: "Your scored space profile and three specified options.",
  robots: { index: false, follow: false },
};

export default async function AssessmentResultPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <AssessmentResult token={token} />;
}
