import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Background } from "@/components/Background";
import { Providers } from "@/components/Providers";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { ui } from "@/lib/styles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dominoes",
  description: "An app for playing Dominoes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      // style={{
      //   fontSize: "min(dvh, dvw)",
      // }}
    >
      {/* <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head> */}
      <body>
        <Background />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}