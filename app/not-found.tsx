"use client";

import Link from "next/link";
import ParallaxBackground from "./components/partials/ParallaxBackground";
import VerticalRule from "./components/partials/VerticalRule";
import { motion } from "framer-motion";


export default function NotFound() {

  return (
    <main id="top" className="bg">

      {/* Hero Section */}
      <section className="hero bg-white lg:height-100vh relative mt-20 lg:mt-15 mb-20">
        <div className="p-0 lg:p-30">
          {/* Replace Image with ParallaxBackground */}
          <ParallaxBackground
            src="/image/pal-hero-bg-enhanced.png"
            alt="Hero background"
            speed={-100}
            opacity={0.2}
            objectPosition="50% 30%"
          />

       
          <div className="relative grid grid-cols-12">
            <div className="col-span-12 sm:col-start-2 lg:col-start-4 lg:col-span-6 text-center lg:text-left">
                  <span className="font-bold text-9xl color-foreground mb-5 block">
                 404
                </span>
            </div>
          </div>

          <div className="lg:hidden">
            <VerticalRule
              color="var(--color-orange)"
              thickness="2px"
              height="5vh"
              animated
            />
          </div>

          {/* Hero text */}
          <div className="relative z-10 grid grid-cols-12 mt-5 lg:mt-0 mb-30 lg:mb-0">
            <div className="col-start-0 lg:col-start-5 col-span-12 lg:col-span-6 accent-line px-6 lg:px-0 lg:pr-20 sm:pl-5 lg:pl-20 py-6 lg:mt-20 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              >
                <h1 className="font-bold">
                 Well, this is awkward.
                </h1>
                <p className="lg:text-lg mb-5">
             We couldn’t find the page you were looking for.
Maybe it got lost in the internet somewhere.
                </p>

                <Link href="/" className="btn btn--primary">
                  Return Home
                </Link>

              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-gradient">&nbsp;</div>
      </section>

    </main>
  );
}
