import type { Metadata } from "next";
import { Instrument_Sans, Sora, Fira_Code } from "next/font/google";
import "./globals.css";
import "../../public/fa/css/all.min.css";
import { AuthProvider } from "@/contexts/AuthContext";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nether Host",
  description: "Nether Host",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${sora.variable} ${firaCode.variable} antialiased min-h-screen bg-neutral-950`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
