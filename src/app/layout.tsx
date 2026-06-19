import type { Metadata } from "next";
import "./globals.css";
import MagneticCursor from "@/components/MagneticCursor";

export const metadata: Metadata = {
  title: "Auraline | Premium Fashion Collection",
  description: "Immersive 3D fashion experience showcasing premium clothing collections with elegant design and artistry.",
  keywords: ["fashion", "3D", "premium", "clothing", "collection", "elegant"],
  openGraph: {
    title: "Auraline | Premium Fashion Collection",
    description: "Immersive 3D fashion experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <MagneticCursor />
        {children}
      </body>
    </html>
  );
}
