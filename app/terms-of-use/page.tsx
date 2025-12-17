import ParallaxBackground from "../components/partials/ParallaxBackground";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use for PALcares website",
  openGraph: {
    title: "Terms of Use",
    description: "Terms of Use for PALcares website",
    url: "https://www.palcares.org/terms",
    images: ["/image/palcares-logo_full.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use",
    description: "Terms of Use for PALcares website",
    images: ["/image/palcares-logo_full.svg"],
  },
};

export default function Terms() {
  return (
    <>
      <section id="terms" className="terms bg-white relative py-20 pb-20 lg:py-30">
        <ParallaxBackground
          src="/image/pal-hero-bg-enhanced.png"
          alt="Terms background"
          speed={-100}
          opacity={0.2}
          objectPosition="10% 80%"
        />
        <div className="container max-w-screen-xl m-auto">
          <div className="relative z-10 grid grid-cols-12 lg:gap-10">
            <div className="col-span-12 max-w-4xl text-left mb-30">
              <h1>Terms of Use</h1>

              <section>
                <p><strong>Effective Date:</strong> November 6, 2025</p>

                <p>Welcome to PALcares (“we,” “our,” or “us”). By accessing or using our website <a className="link" href="https://palcares.org">palcares.org</a> (the “Site”), you agree to comply with and be bound by these Terms of Use.</p>

                <h3>1. Use of the Site</h3>
                <p>You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                <ul>
                  <li>Use the Site in any way that violates any applicable federal, state, or local law or regulation.</li>
                  <li>Engage in any activity that could damage, disable, or impair the Site.</li>
                  <li>Attempt to gain unauthorized access to any portion of the Site or other accounts, computer systems, or networks.</li>
                </ul>

                <h3>2. Intellectual Property</h3>
                <p>All content on the Site, including text, graphics, logos, images, and software, is the property of PALcares or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>

                <h3>3. User Content</h3>
                <p>Any content you submit, post, or display on the Site must comply with applicable laws. By submitting content, you grant PALcares a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content on the Site.</p>

                <h3>4. Third-Party Links</h3>
                <p>The Site may contain links to third-party websites. We do not control or endorse these sites and are not responsible for their content or privacy practices. Your use of third-party sites is at your own risk.</p>

                <h3>5. Disclaimer of Warranties</h3>
                <p>The Site and its content are provided “as is” and “as available” without warranties of any kind, either express or implied. PALcares does not guarantee that the Site will be secure, error-free, or uninterrupted.</p>

                <h3>6. Limitation of Liability</h3>
                <p>To the maximum extent permitted by law, PALcares shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or inability to use the Site.</p>

                <h3>7. Indemnification</h3>
                <p>You agree to indemnify and hold harmless PALcares, its affiliates, officers, and employees from any claims, damages, liabilities, and expenses arising from your use of the Site or violation of these Terms.</p>

                <h3>8. Changes to Terms</h3>
                <p>We may update these Terms of Use from time to time. Changes will be posted on this page with the updated effective date. Your continued use of the Site constitutes acceptance of the revised Terms.</p>

                <h3>9. Governing Law</h3>
                <p>These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>

                <h3>10. Contact Us</h3>
                <p>If you have any questions or concerns regarding these Terms of Use, please contact us at:</p>
                <a className="link" href="mailto:partnerships@palcares.org">partnerships@palcares.org</a>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
