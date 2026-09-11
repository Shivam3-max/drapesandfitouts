/**
 * Where this deployment actually lives.
 *
 * Preview deployments must describe themselves, not the production domain —
 * otherwise a shared prototype link shows an Open Graph image and canonical
 * URLs pointing at a site that isn't live yet.
 */
export const SITE_URL: string = (() => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3720";
})();

export const IS_PRODUCTION_SITE =
  process.env.VERCEL_ENV === "production" || process.env.ALLOW_INDEXING === "true";
