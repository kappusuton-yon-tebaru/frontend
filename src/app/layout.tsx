import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "../components/NavigationBar";
import { TokenProvider } from "@/context/TokenContext";

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
          <NavigationBar />
          {/* <Sidebar /> */}
          <main className="flex-1 mx-36 mt-16 p-8">{children}</main>
        </TokenProvider>
      </body>
    </html>
  );
}
