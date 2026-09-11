/**
 * Structured data. Kept in one file so the claims we publish about the business
 * stay consistent across pages.
 */

const BASE = "https://drapesandfitouts.ae";

export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "Drapes & Fitouts",
    description:
      "Curtains, blinds, Smart Film, carpets, wallpaper and motorised shading for homes and businesses across the UAE.",
    url: BASE,
    email: "info@drapesandfitouts.ae",
    telephone: "+971559787259",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office B40-003, Block B, SRTIP",
      addressLocality: "Sharjah",
      addressCountry: "AE",
    },
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "City", name: "Sharjah" },
      { "@type": "City", name: "Abu Dhabi" },
    ],
    knowsAbout: [
      "Solar control blinds",
      "Blackout systems",
      "Motorised curtains",
      "Switchable smart film",
      "Carpets and wallpaper",
    ],
  };
  return <Script data={data} />;
}

export function FaqSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <Script data={data} />;
}

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
