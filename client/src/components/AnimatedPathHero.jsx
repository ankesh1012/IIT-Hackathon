import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedPathHero = () => {
  useEffect(() => {
    const path = document.getElementById("scroll-animated-path");
    if (!path) return;
    const pathLength = path.getTotalLength();

    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#scroll-path-svg", // SVG or section id here
        start: "top bottom",
        end: "bottom top",
        scrub: true, // Makes it reversible on scroll!
      }
    });
  }, []);

  return (
    <section className="relative flex justify-center items-center min-h-screen bg-background">
      {/* Your background or hero content if any */}
      <svg
        id="scroll-path-svg"
        width="100%"
        height="300"
        viewBox="0 0 1000 300"
        fill="none"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }}
      >
        <path
          id="scroll-animated-path"
          d="M20 250 Q 320 120 700 200 Q 750 250 950 50"
          stroke="#3366ff"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      {/* Optionally add any overlay hero text/buttons/images here */}
      <div className="relative z-10 text-4xl font-bold text-primary-foreground">
        <span>Scroll to Animate the Path!</span>
      </div>
    </section>
  );
};

export default AnimatedPathHero;
