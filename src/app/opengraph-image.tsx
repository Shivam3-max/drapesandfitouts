import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Drapes & Fitouts — control light, privacy and comfort";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card people see when the link is shared — usually on WhatsApp, here. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(150deg,#ffffff 0%,#f6f2e9 46%,#ece3d2 100%)",
          padding: "68px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ width: 6, height: 44, background: "#9a7526", borderRadius: 3 }} />
            ))}
          </div>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#101214",
              fontWeight: 700,
            }}
          >
            Drapes &amp; Fitouts
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, lineHeight: 1.04, color: "#101214", letterSpacing: -2 }}>
            Your space.
          </div>
          <div style={{ fontSize: 92, lineHeight: 1.04, color: "#9a7526", letterSpacing: -2 }}>
            Your light. Your privacy.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #ddd7cb",
            paddingTop: 26,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#565c63",
          }}
        >
          <div style={{ display: "flex" }}>Curtains · Blinds · Smart Film · Carpets · Automation</div>
          <div style={{ display: "flex" }}>UAE</div>
        </div>
      </div>
    ),
    size,
  );
}
