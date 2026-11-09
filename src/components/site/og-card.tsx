/**
 * Open Graph image layout (1200×630) for next/og. Plain inline styles: ImageResponse
 * supports a subset of CSS and no Tailwind. No external fonts or images, so it builds offline.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export function OgCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F3F0E8",
        color: "#17171C",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="72" height="72" viewBox="0 0 34 34" fill="none">
          <circle cx="17" cy="17" r="15" stroke="#17171C" strokeWidth="2.5" />
          <path d="M2 17h30" stroke="#17171C" strokeWidth="2.5" />
          <circle cx="17" cy="17" r="5" fill="#F3F0E8" stroke="#17171C" strokeWidth="2.5" />
          <path d="M4.5 12a13 13 0 0 1 25 0" stroke="#C42F17" strokeWidth="2.5" />
        </svg>
        <span style={{ fontSize: 44, fontWeight: 800 }}>OddTeam</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: "#C42F17" }}>{eyebrow}</span>
        <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</span>
        <span style={{ fontSize: 32, color: "#5E5B55" }}>{subtitle}</span>
      </div>
    </div>
  );
}
