"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({
    nullTargetWarn: false,
  });
}

export function useTestimonialsAnimations(enabled: boolean = true) {
  const testimonialsRef = useRef<HTMLElement>(null);
  const testimonialsTitleRef = useRef<HTMLHeadingElement>(null);
  const testimonialsHighlightRef = useRef<HTMLSpanElement>(null);
  const testimonialsDescRef = useRef<HTMLParagraphElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const dotsGridTopRef = useRef<SVGSVGElement>(null);
  const dotsGridBottomRef = useRef<SVGSVGElement>(null);
  const starIconRef = useRef<HTMLDivElement>(null);
  const heartIconRef = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!enabled || hasRunRef.current) return;
    
    const section = testimonialsRef.current;
    if (!section) return;
    
    hasRunRef.current = true;

    const ctx = gsap.context(() => {
      // Get all elements
      const title = testimonialsTitleRef.current;
      const highlight = testimonialsHighlightRef.current;
      const description = testimonialsDescRef.current;
      const carousel = carouselContainerRef.current;
      const dotsTop = dotsGridTopRef.current;
      const dotsBottom = dotsGridBottomRef.current;
      const star = starIconRef.current;
      const heart = heartIconRef.current;

      // Set initial states for performance
      const allElements = [title, highlight, description, carousel, dotsTop, dotsBottom, star, heart].filter(Boolean);
      
      if (allElements.length > 0) {
        gsap.set(allElements, {
          opacity: 0,
          y: 30,
          scale: 0.95,
          force3D: true,
          willChange: "transform, opacity"
        });
      }

      // Create optimized scroll trigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true,
        }
      });

      // Animate elements with reduced durations for speed
      if (title) {
        tl.to(title, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      if (highlight) {
        tl.to(highlight, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        }, "-=0.2");
      }

      if (description) {
        tl.to(description, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        }, "-=0.1");
      }

      if (carousel) {
        tl.to(carousel, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        }, "-=0.1");
      }

      // Animate decorative elements with minimal overhead
      const decorativeElements = [dotsTop, dotsBottom, star, heart].filter(Boolean);
      if (decorativeElements.length > 0) {
        tl.to(decorativeElements, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.05,
        }, "-=0.2");
      }

      // Add subtle floating animations for decorative elements only
      if (star) {
        gsap.to(star, {
          y: "random(-8, 8)",
          x: "random(-4, 4)",
          rotation: "random(-5, 5)",
          duration: "random(3, 5)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 0.5,
        });
      }

      if (heart) {
        gsap.to(heart, {
          y: "random(-6, 6)",
          x: "random(-3, 3)",
          rotation: "random(-3, 3)",
          duration: "random(4, 6)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1,
        });
      }

      // Clean up will-change after animation
      tl.call(() => {
        allElements.forEach(el => {
          if (el) {
            gsap.set(el, { willChange: "auto" });
          }
        });
      });

    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [enabled]);

  return {
    testimonialsRef,
    testimonialsTitleRef,
    testimonialsHighlightRef,
    testimonialsDescRef,
    carouselContainerRef,
    dotsGridTopRef,
    dotsGridBottomRef,
    starIconRef,
    heartIconRef,
  };
}
