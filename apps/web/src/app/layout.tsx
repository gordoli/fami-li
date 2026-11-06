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
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://fami-li-adventures.trace-7130.chatgpt.site";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fami-Li Adventures",
  description: "The memories we made along the way. A family travel journal.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Fami-Li Adventures",
    title: "Fami-Li Adventures",
    description: "The memories we made along the way.",
    images: [
      {
        url: "/og-image.png",
        width: 1600,
        height: 900,
        alt: "Fami-Li Adventures — our pixel-chibi family standing on Earth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fami-Li Adventures",
    description: "The memories we made along the way.",
    images: ["/og-image.png"],
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
