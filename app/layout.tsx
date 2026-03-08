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

export const metadata = {
  title: "PALcares | Technology That Strengthens Relationships",
  description:
    "PALcares embeds technical teams inside Alberta's social service organizations\u2014building the infrastructure and processes that let technology actually change with the work.",
  metadataBase: new URL("https://www.palcares.org"),
  openGraph: {
    title: "PALcares | Technology That Strengthens Relationships",
    description:
      "Embedded partnerships and open-source tools for Alberta's social sector.",
    url: "https://www.palcares.org",
    siteName: "PALcares",
    images: [
      {
        url: "/image/pal-hero-bg-enhanced.png",
        width: 1200,
        height: 630,
        alt: "PALcares - Sustainable Technology Partnerships",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PALcares | Technology That Strengthens Relationships",
    description:
      "Embedded partnerships and open-source tools for Alberta's social sector.",
    images: ["/image/pal-hero-bg-enhanced.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        <LenisProvider>
          <Loader>
            <Header />
            <div id="main-content" className="main">{children}</div>
            <Footer />
          </Loader>
        </LenisProvider>
      </body>
    </html>
  );
}
