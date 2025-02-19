import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "../components/NavigationBar";
import Sidebar from "../components/Sidebar";

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
        <NavigationBar />
        <Sidebar />
        <main className="flex-1 ml-[16.67%] mt-16 p-8">{children}</main>
      </body>
    </html>
  );
}
