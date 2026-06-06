import { ImageResponse } from "next/og";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/lib/seo/site";

export const alt = "FinPilot — финансовый GPS для самозанятых";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background:
            "linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #09090b 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #34d399)",
            }}
          />
          <span style={{ fontSize: 36, fontWeight: 700 }}>FinPilot</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {SEO_TITLE}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 24,
            lineHeight: 1.4,
            color: "#a1a1aa",
            maxWidth: 880,
          }}
        >
          {SEO_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  );
}
