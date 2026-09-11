import type { Metadata } from "next";
import { RegisterFlow } from "@/components/register-flow";

export const metadata: Metadata = {
  title: "Register a project",
  description:
    "Register a project and the attribution stays with you through survey, quotation and installation.",
};

export default function RegisterProjectPage() {
  return <RegisterFlow />;
}
