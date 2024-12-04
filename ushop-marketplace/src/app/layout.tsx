import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = localFont({
  src: "./fonts/Manrope.ttf",
  variable: "--font-manrope",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NTU U-Shop",
  description: "Chic university students wear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased`}
      >
        <div className="justify-center z-10">
          {/* screen size */}
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
