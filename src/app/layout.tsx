import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kirankumbar.dev"),
  title: "Kiran Kumbar — Full-Stack Engineer",
  description:
    "Portfolio of Kiran Kumbar — building production-grade web applications with Next.js, NestJS, and modern frontend animation.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Kiran Kumbar — Full-Stack Engineer",
    description:
      "Building production-grade web applications with Next.js, NestJS, and cinematic frontend animation.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Kiran Kumbar Portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiran Kumbar — Full-Stack Engineer",
    description:
      "Building production-grade web applications with Next.js, NestJS, and cinematic frontend animation.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-(--background) text-foreground min-h-screen">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
