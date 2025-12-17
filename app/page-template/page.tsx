import ParallaxBackground from "../components/partials/ParallaxBackground";

export const metadata = {
  title: "Template Page",
  description:
    "This is a template page",
  openGraph: {
    title: "Template Page",
    description:
      "This is a template page",
    url: "https://www.palcares.org/page-1",
    images: ["/image/palcares-logo_full.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Template Page",
    description:
      "This is a template page",
    images: ["/image/palcares-logo_full.svg"],
  },
};

export default function PageTemplate ()
{
  return (
    <>

 <section id="contact" className="contact bg-white relative py-10 pb-20 lg:py-20">
        <ParallaxBackground
          src="/image/pal-hero-bg-enhanced.png"
          alt="Contact background"
          speed={-100}
          opacity={0.2}
          objectPosition="10% 80%"
        />
        <div className="container max-w-screen-2xl m-auto">
          <div className="relative z-10 grid grid-cols-12 lg:gap-10">
                <div className="col-span-12 text-center mb-10 h-screen">
                    This is a template page
                </div>
            </div>
        </div>
        </section>
    </>
)
} 
