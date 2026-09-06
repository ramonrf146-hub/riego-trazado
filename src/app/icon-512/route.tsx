import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <svg width="512" height="512" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#bg)" />
        <path
          d="M50 16 C50 16 26 46 26 63 C26 77 37 88 50 88 C63 88 74 77 74 63 C74 46 50 16 50 16 Z"
          fill="#ffffff"
        />
        <path d="M50 16 C46 10 38 8 33 11 C38 14 42 18 44 23 Z" fill="#22c55e" />
        <path d="M50 16 C54 9 63 8 68 12 C62 14 57 19 55 24 Z" fill="#4ade80" />
        <path
          d="M50 50 L40 60 M50 50 L60 60 M40 60 L50 72 M60 60 L50 72"
          stroke="#0891b2"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="2.6" fill="#0891b2" />
        <circle cx="40" cy="60" r="2.6" fill="#0891b2" />
        <circle cx="60" cy="60" r="2.6" fill="#0891b2" />
        <circle cx="50" cy="72" r="2.6" fill="#0891b2" />
      </svg>
    ),
    { width: 512, height: 512 }
  );
}
