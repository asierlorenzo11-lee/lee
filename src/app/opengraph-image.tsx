import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "¡LEE! — Antología de literatura en español";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fbfaf4",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "serif",
          borderLeft: "12px solid #7a2331",
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: "flex",
            fontSize: 14,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#7a2331",
            fontFamily: "monospace",
          }}
        >
          antología digital comentada
        </div>

        {/* Main title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 140,
              fontWeight: 900,
              color: "#111111",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
          >
            ¡LEE!
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#6b6b6b",
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            Literatura en español · del siglo XI al XX
          </div>
        </div>

        {/* Bottom meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 18, color: "#6b6b6b" }}>
            Fragmentos anotados · Autoras y autores · Obras
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#7a2331",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            lee-swart-eight.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
