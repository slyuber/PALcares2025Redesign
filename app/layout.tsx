import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
  display: "block", // "block" prevents FOUT during loader animation
});

import "./globals.scss";
import Loader from "./components/partials/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "PALcares | Technology Partnerships for Alberta's Social Services",
  description:
    "PALcares builds sustainable technology partnerships with Alberta's social service organizations. Embedded teams, open-source tools, and community-owned solutions on Treaty 6 & 7 territories.",
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
    <html lang="en" className="scroll-smooth">
      <body className={`${raleway.variable} antialiased`}>
        <Loader>
          <Header />
          <section className="main">{children}</section>
          <Footer />
        </Loader>
      </body>
    </html>
  );
}
