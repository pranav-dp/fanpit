import type { Metadata } from "next";
import { Blinker } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const blinker = Blinker({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Fanpit Concierge",
  description: "Conversational Event Concierge",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <body className={`${blinker.className} bg-gradient-to-r from-[#120024] via-[#25004a] to-[#120024] animate-gradient-bg`}>
        <main className="h-full flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
