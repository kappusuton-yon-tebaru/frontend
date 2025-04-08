import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/lib/I18nProvider";
import "@ant-design/v5-patch-for-react-19";
import { Toaster } from "react-hot-toast";

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
                <main className="flex-1 mt-16">
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            success: {
                                style: {
                                    background: "#4CAF50",
                                    color: "white",
                                },
                            },
                            error: {
                                style: {
                                    background: "#F44336",
                                    color: "white",
                                },
                            },
                        }}
                    />
                    <I18nProvider>{children}</I18nProvider>
                </main>
            </body>
        </html>
    );
}
