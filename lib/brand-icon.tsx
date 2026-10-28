import { ImageResponse } from "next/og";
import { bricolageGrotesque800 } from "@/lib/bricolage-grotesque-800";

function fontData() {
  const binary = atob(bricolageGrotesque800);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function brandIcon(size: number) {
  const scale = size / 48;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E0552D",
          borderRadius: 10 * scale,
          color: "#ffffff",
          fontSize: 22 * scale,
          fontWeight: 800,
          fontFamily: "Bricolage Grotesque",
          lineHeight: 1,
        }}
      >
        HW
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: fontData(),
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}
