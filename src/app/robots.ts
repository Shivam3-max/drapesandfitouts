import type { MetadataRoute } from "next";

import { IS_PRODUCTION_SITE, SITE_URL } from "@/lib/site-url";

/**
 * Preview and prototype deployments must never be indexed — only the real
 * production domain is allowed into search results.
 */

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_SITE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Assessment results are private to the person who created them.
      disallow: ["/assessment/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
