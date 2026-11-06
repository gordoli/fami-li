import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fami-li.vercel.app";
const socialImage = "/og-fami-li-adventures-v2.png";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Fami-Li Adventures",
  description: "The memories we made along the way. A family travel journal.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Fami-Li Adventures",
    title: "The Fami-Li Adventures",
    description: "The memories we made along the way.",
    images: [
      {
        url: socialImage,
        type: "image/png",
        width: 1600,
        height: 900,
        alt: "Our family standing on Earth above The Fami-Li Adventures on white",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fami-Li Adventures",
    description: "The memories we made along the way.",
    images: [socialImage],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
