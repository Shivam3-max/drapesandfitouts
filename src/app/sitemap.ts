import type { MetadataRoute } from "next";
import { SOLUTIONS } from "@/lib/catalogue";
import { COMMUNITIES } from "@/data/communities";
import { PROJECTS } from "@/data/projects";

const BASE = "https://drapesandfitouts.ae";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: "/", priority: 1 },
    { url: "/assess", priority: 0.9 },
    { url: "/smart-film", priority: 0.9 },
    { url: "/platform", priority: 0.8 },
    { url: "/visualiser", priority: 0.9 },
    { url: "/smart-film/check", priority: 0.7 },
    { url: "/professionals/register", priority: 0.7 },
    { url: "/solutions", priority: 0.8 },
    { url: "/projects", priority: 0.7 },
    { url: "/spaces", priority: 0.7 },
    { url: "/professionals", priority: 0.7 },
    { url: "/technology", priority: 0.6 },
    { url: "/care", priority: 0.5 },
    { url: "/book", priority: 0.8 },
    { url: "/privacy", priority: 0.3 },
  ];

  const lastModified = new Date();

  return [
    ...staticRoutes.map((r) => ({ url: `${BASE}${r.url}`, lastModified, priority: r.priority })),
    ...SOLUTIONS.map((s) => ({ url: `${BASE}/solutions/${s.slug}`, lastModified, priority: 0.8 })),
    ...COMMUNITIES.map((c) => ({ url: `${BASE}/spaces/${c.slug}`, lastModified, priority: 0.7 })),
    ...PROJECTS.map((p) => ({ url: `${BASE}/projects/${p.slug}`, lastModified, priority: 0.6 })),
  ];
}
