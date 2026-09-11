import type { MetadataRoute } from "next";

/**
 * Preview and prototype deployments must never be indexed — only the real
 * production domain is allowed into search results.
 */
const isProduction =
  process.env.VERCEL_ENV === "production" || process.env.ALLOW_INDEXING === "true";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Assessment results are private to the person who created them.
      disallow: ["/assessment/"],
    },
    sitemap: "https://drapesandfitouts.ae/sitemap.xml",
  };
}
