// Share card: the name and the role on the paper, inside the same 1px hairline frame the site carries.
// Values mirror the riso tokens (--paper #F2F3F5, --ink-black #313131); next/og can't read CSS vars.
import { ImageResponse } from "next/og";

export const alt = "Minh Quân | Motion Design & Creative Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F2F3F5";
const INK = "#313131";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, padding: 48 }}>
        <div
          style={{
            flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end",
            border: `1px solid ${INK}`, padding: 56, color: INK,
          }}
        >
          <div style={{ fontSize: 112, lineHeight: 1, letterSpacing: -3 }}>Minh Quân</div>
          <div style={{ fontSize: 34, marginTop: 24 }}>Motion Design &amp; Creative Engineering</div>
        </div>
      </div>
    ),
    size,
  );
}
