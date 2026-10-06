import { ImageResponse } from "next/og";

export const alt =
  "Fermor — smart financial decisions for India. One honest picture of your money.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f6f2",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 44 }}>
            <div style={{ width: 12, height: 18, background: "#9dd8c2", borderRadius: 5 }} />
            <div style={{ width: 12, height: 30, background: "#2fa47f", borderRadius: 5 }} />
            <div style={{ width: 12, height: 44, background: "#0d6e54", borderRadius: 5 }} />
          </div>
          <div style={{ fontSize: 40, letterSpacing: -1, color: "#0b1424" }}>Fermor</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, color: "#080f1c", maxWidth: 900 }}>
            One honest picture of your money.
          </div>
          <div style={{ fontSize: 30, color: "#5b574a" }}>
            Accounts, investments and spending in one view. Built for India.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#5b574a",
            borderTop: "1px solid #d2cfc3",
            paddingTop: 26,
          }}
        >
          <span>Smart financial decisions for India</span>
          <span>fermor.in</span>
        </div>
      </div>
    ),
    size,
  );
}
