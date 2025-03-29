import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "../components/NavigationBar";
import { TokenProvider } from "@/context/TokenContext";
import { I18nProvider } from "@/components/lib/I18nProvider";
import "@ant-design/v5-patch-for-react-19";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Snapping Service",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" type="image/png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-ci-bg-dark-blue`}
      >
        <TokenProvider>
          <main className="flex-1 mt-16">
            <I18nProvider>{children}</I18nProvider>
          </main>
        </TokenProvider>
      </body>
    </html>
  );
}
