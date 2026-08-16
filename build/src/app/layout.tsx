import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "John's OS";
  const description = "An interactive desktop portfolio for projects, experiments, photographs, and creative code.";
  return { title, description, icons: { icon: "/otter.jpg", shortcut: "/otter.jpg" }, openGraph: { title, description, type: "website", url: origin, images: [{ url: `${origin}/og-desktop.png`, width: 1664, height: 936, alt: "John's OS" }] }, twitter: { card: "summary_large_image", title, description, images: [`${origin}/desktop-wallpaper.webp`] } };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
