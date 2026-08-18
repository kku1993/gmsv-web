"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

type HeroSectionProps = {
  title?: string | null;
  body?: string | null;
};

const HeroSection: React.FC<HeroSectionProps> = ({ title, body }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="relative flex items-end bg-black h-svh overflow-hidden"
    >
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        loop
        autoPlay
        muted
        playsInline
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay to improve text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 xl:px-16">
        <div className="flex flex-col gap-4 sm:gap-6 py-10 sm:py-16">
          {body ? (
            <p className="text-white sm:text-base text-sm sm:leading-6 leading-5 font-normal sm:max-w-sm">
              {body}
            </p>
          ) : null}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
            className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-10 lg:leading-32 font-bold"
          >
            {title}
          </motion.h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
