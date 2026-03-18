import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap", // "swap" shows fallback font immediately, then swaps when Raleway loads
});

import "./globals.scss";
import Loader from "./components/partials/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LenisProvider from "./components/providers/LenisProvider";
import { meta } from "content-collections";

export const metadata = {
  title: meta.title,
  description: meta.description,
  metadataBase: new URL(meta.metadataBase),
  openGraph: meta.openGraph,
  twitter: meta.twitter,
  robots: meta.robots,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#5C306C] focus:text-white focus:rounded-md focus:text-sm focus:font-medium">Skip to content</a>
        <LenisProvider>
          <Loader>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </Loader>
        </LenisProvider>
      </body>
    </html>
  );
}
