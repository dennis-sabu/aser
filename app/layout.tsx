import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "CampusNet — Campus Resource Network",
  description: "Discover and share resources, rides, and skills with verified students on your campus. One platform. Real connections. Zero friction.",
  keywords: ["campus", "student resources", "ride sharing", "skill exchange", "campus network", "college"],
  openGraph: {
    title: "CampusNet — Campus Resource Network",
    description: "Verified student-only platform to share resources, rides, and skills on campus.",
    type: "website",
    url: "https://aser-eosin.vercel.app",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
