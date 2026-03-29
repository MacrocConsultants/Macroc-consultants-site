import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Merriweather, Source_Sans_3 } from "next/font/google";

const headingFont = Merriweather({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700", "900"],
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BOD System",
  description: "Business Operating Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-slate-50 text-slate-900 antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
