import type { Metadata } from "next";
import { GlassCheckFlow } from "@/components/glass-check-flow";

export const metadata: Metadata = {
  title: "Is your glass suitable for Smart Film?",
  description: "Five questions and a straight answer — including when film is the wrong product.",
};

export default function GlassCheckPage() {
  return <GlassCheckFlow />;
}
