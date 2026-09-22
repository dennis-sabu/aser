import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

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
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
