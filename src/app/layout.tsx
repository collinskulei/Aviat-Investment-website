import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteContent } from "@/lib/data/site-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aviat Investment Limited | Aviation Component Maintenance, Wilson Airport",
  description:
    "Specialist restoration, overhaul, and testing services for critical aircraft components. Trusted expertise located at Wilson Airport.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const siteContent = await getSiteContent();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark"]}
          enableSystem={false}
        >
          <Header logoUrl={siteContent.logo_url} />
          <main className="flex-1">{children}</main>
          <Footer siteContent={siteContent} />
        </ThemeProvider>
      </body>
    </html>
  );
}
