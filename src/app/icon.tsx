import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12.5" stroke="#22d3ee" strokeWidth="1.5" />
          <path
            d="M14 4 L14 12 M14 16 L14 24 M4 14 L12 14 M16 14 L24 14"
            stroke="#22d3ee"
            strokeWidth="1.5"
          />
          <path d="M14 9 C11 12, 11 16, 14 19 C17 16, 17 12, 14 9 Z" fill="#f59e0b" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
