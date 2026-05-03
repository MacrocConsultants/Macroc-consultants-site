import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import { getHomepageContent } from "./utils/getHomepageContent";

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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ]
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getHomepageContent();
  const colors = content.colors;

  return (
    <html lang="en" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --theme-bg: ${colors.light.background};
              --theme-fg: ${colors.light.foreground};
              --theme-primary: ${colors.light.primary};
              --theme-card: ${colors.light.cardBg};
              --theme-border: ${colors.light.borderColor};
            }
            .dark {
              --theme-bg: ${colors.dark.background};
              --theme-fg: ${colors.dark.foreground};
              --theme-primary: ${colors.dark.primary};
              --theme-card: ${colors.dark.cardBg};
              --theme-border: ${colors.dark.borderColor};
            }
          `
        }} />
      </head>
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-theme-bg text-theme-fg antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
