import ParallaxBackground from "../components/partials/ParallaxBackground";

export const metadata = {
  title: "Privacy Policy",
  description: "How PALcares collects and handles your information.",
  openGraph: {
    title: "Privacy Policy",
    description: "How PALcares collects and handles your information.",
    url: "https://palcares.ca/privacy-policy",
    images: ["/image/palcares-logo_full.svg"],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Privacy Policy",
    description: "How PALcares collects and handles your information.",
    images: ["/image/palcares-logo_full.svg"],
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <section className="bg-white relative py-20 pb-20 lg:py-30">
        <ParallaxBackground
          src="/image/pal-hero-bg-enhanced.webp"
          alt="Privacy policy background"
          opacity={0.2}
          objectPosition="10% 80%"
        />
        <div className="container max-w-screen-xl m-auto">
          <div className="relative z-10 grid grid-cols-12 lg:gap-10">
            <div className="col-span-12 max-w-4xl text-left mb-30">
              <h1>Privacy Policy</h1>

              <section>
                <p><strong>Effective Date:</strong> November 6, 2025</p>

                <p>PALcares is operated by Perseverance Analytics Ltd., a registered Alberta corporation. This policy explains what information we collect through <a className="link" href="https://palcares.ca">palcares.ca</a> and how we handle it.</p>

                <h3>1. What We Collect</h3>
                <p>We only collect information you provide directly:</p>
                <ul>
                  <li>Your name, email, organization, and message when you use the contact form.</li>
                  <li>Your email address if you subscribe to our newsletter.</li>
                </ul>
                <p>We do not use cookies, analytics, or tracking technologies on this site.</p>

                <h3>2. How We Use It</h3>
                <p>Contact form submissions are used to respond to your inquiry. Newsletter emails are used to send occasional updates about our work. We will never sell or share your information with third parties for marketing purposes.</p>

                <h3>3. Third-Party Services</h3>
                <p>Form submissions are processed through <a className="link" href="https://web3forms.com" target="_blank" rel="noopener noreferrer">Web3Forms</a>, which delivers them to us via email. We do not store form data beyond what arrives in our inbox. Web3Forms&apos; own privacy policy governs their handling of data in transit.</p>

                <h3>4. Your Rights</h3>
                <p>You can contact us at any time to request access to, correction of, or deletion of any personal information we hold. To unsubscribe from our newsletter, reply to any email or contact us directly.</p>

                <h3>5. Changes</h3>
                <p>If we update this policy, we will post the revised version here with a new effective date.</p>

                <h3>6. Contact</h3>
                <p>Questions about this policy:</p>
                <a className="link" href="mailto:support@palcares.ca">support@palcares.ca</a>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
