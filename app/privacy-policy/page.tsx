import ParallaxBackground from "../components/partials/ParallaxBackground";

export const metadata = {
  title: "Privacy Policy",
  description:
    "",
  openGraph: {
    title: "Privacy Policy",
    description:
      "",
    url: "https://www.palcares.org/page-1",
    images: ["/image/palcares-logo_full.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "",
    images: ["/image/palcares-logo_full.svg"],
  },
};

export default function PrivacyPolicy ()
{
  return (
    <>

 <section id="contact" className="contact bg-white relative py-20 pb-20 lg:py-30">
        <ParallaxBackground
          src="/image/pal-hero-bg-enhanced.png"
          alt="Contact background"
          speed={-100}
          opacity={0.2}
          objectPosition="10% 80%"
        />
        <div className="container max-w-screen-xl m-auto">
          <div className="relative z-10 grid grid-cols-12 lg:gap-10">
                <div className="col-span-12 max-w-4xl text-left mb-30">
              <h1>Privacy Policy</h1>
              
              <section>
  <p><strong>Effective Date:</strong> November 6, 2025</p>

  <p>PALcares (“we,” “our,” or “us”) respects your privacy and is committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website <a className="link" href="https://palcares.org">palcares.org</a> (the “Site”).</p>

  <h3>1. Information We Collect</h3>
  <p>We may collect personal information that you voluntarily provide, such as:</p>
  <ul>
    <li>Name, email address, and contact information when you fill out forms.</li>
    <li>Payment information if you make purchases.</li>
    <li>Any other information you choose to provide.</li>
  </ul>
  <p>We may also collect non-personal information automatically, such as:</p>
  <ul>
    <li>IP address, browser type, and operating system.</li>
    <li>Pages visited and time spent on the Site.</li>
  </ul>

  <h3>2. How We Use Your Information</h3>
  <p>We use your information to:</p>
  <ul>
    <li>Provide and improve our services.</li>
    <li>Respond to inquiries or customer service requests.</li>
    <li>Send updates, promotions, or marketing communications (if you opted in).</li>
    <li>Analyze site usage and improve the user experience.</li>
  </ul>

  <h3>3. Sharing Your Information</h3>
  <p>We do not sell your personal information. We may share information with:</p>
  <ul>
    <li>Service providers who help us operate the Site.</li>
    <li>Legal authorities when required by law.</li>
    <li>Business partners with your consent.</li>
  </ul>

  <h3>4. Cookies and Tracking Technologies</h3>
  <p>We may use cookies, web beacons, and other technologies to enhance your experience, analyze trends, and improve our services. You can manage cookie preferences through your browser settings.</p>

  <h3>5. Data Security</h3>
  <p>We implement reasonable measures to protect your information from unauthorized access, disclosure, or alteration. However, no method of transmission over the Internet is 100% secure.</p>

  <h3>6. Your Rights</h3>
  <p>Depending on your location, you may have the right to:</p>
  <ul>
    <li>Access, correct, or delete your personal information.</li>
    <li>Opt-out of marketing communications.</li>
    <li>Restrict processing of your data.</li>
  </ul>

  <h3>7. Third-Party Links</h3>
  <p>Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites.</p>

  <h3>8. Children’s Privacy</h3>
  <p>Our Site is not intended for children under 13 (or the applicable age in your jurisdiction). We do not knowingly collect personal information from children.</p>

  <h3>9. Changes to This Privacy Policy</h3>
  <p>We may update this Privacy Policy from time to time. We will post the updated policy on this page and update the effective date.</p>

  <h3>10. Contact Us</h3>
  <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
  <a className="link" href="mailto:partnerships@palcares.org">partnerships@palcares.org</a>
</section>

                </div>
            </div>
        </div>
        </section>
    </>
)
} 
