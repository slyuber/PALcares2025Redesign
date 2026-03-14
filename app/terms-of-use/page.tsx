import ParallaxBackground from "../components/partials/ParallaxBackground";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of use for the PALcares website.",
  openGraph: {
    title: "Terms of Use",
    description: "Terms of use for the PALcares website.",
    url: "https://palcares.ca/terms-of-use",
    images: ["/image/palcares-logo_full.svg"],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Terms of Use",
    description: "Terms of use for the PALcares website.",
    images: ["/image/palcares-logo_full.svg"],
  },
};

export default function Terms() {
  return (
    <>
      <section id="terms" aria-label="Terms of Use" className="bg-white relative py-20 pb-20 lg:py-30">
        <ParallaxBackground
          src="/image/pal-hero-bg-enhanced.webp"
          alt="Terms background"
          opacity={0.2}
          objectPosition="10% 80%"
        />
        <div className="container max-w-screen-xl m-auto">
          <div className="relative z-10 grid grid-cols-12 lg:gap-10">
            <div className="col-span-12 max-w-4xl text-left mb-30">
              <h1>Terms of Use</h1>

              <section>
                <p><strong>Effective Date:</strong> November 6, 2025</p>

                <p>This website is operated by Perseverance Analytics Ltd. (doing business as PALcares), a registered Alberta corporation. By using <a className="link" href="https://palcares.ca">palcares.ca</a>, you agree to these terms.</p>

                <h3>1. Use of the Site</h3>
                <p>This is an informational website. You may browse it, use the contact form, and subscribe to our newsletter. Please don&apos;t do anything that would damage or interfere with the site&apos;s operation.</p>

                <h3>2. Intellectual Property</h3>
                <p>Website content, design, and the PALcares name and logo are the property of Perseverance Analytics Ltd. Tools and resources we release under open license are governed by their respective license terms, not these Terms of Use.</p>

                <h3>3. Third-Party Links</h3>
                <p>We may link to external websites. We are not responsible for their content or privacy practices.</p>

                <h3>4. No Warranties</h3>
                <p>The site is provided as-is. We do our best to keep it accurate and available, but we don&apos;t guarantee uninterrupted access or that all information is current.</p>

                <h3>5. Governing Law</h3>
                <p>These terms are governed by the laws of the Province of Alberta, Canada.</p>

                <h3>6. Changes</h3>
                <p>We may update these terms. Changes will be posted here with a new effective date.</p>

                <h3>7. Contact</h3>
                <p>Questions about these terms:</p>
                <a className="link" href="mailto:support@palcares.ca">support@palcares.ca</a>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
