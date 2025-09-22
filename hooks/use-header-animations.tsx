"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useHeaderAnimations(enabled: boolean = true) {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Reset hasRunRef on every enabled change to allow re-running
    if (enabled) {
      hasRunRef.current = false;
    }

    if (!enabled || hasRunRef.current) return;
    const header = headerRef.current;
    const logo = logoRef.current;
    const nav = navRef.current;
    const controls = controlsRef.current;
    const mobileButton = mobileButtonRef.current;

    if (!header) return;
    // ensure subsequent renders do not re-run this intro
    hasRunRef.current = true;

    // Create main timeline
    const tl = gsap.timeline({ delay: 0.1 });

    // Set initial states - elements start from above and invisible
    const headerElements = [logo, nav, controls, mobileButton].filter(Boolean);
    if (headerElements.length > 0) {
      gsap.set(headerElements, {
        y: -60,
        opacity: 0,
        scale: 0.8,
      });
    }

    // Animate header background first
    tl.fromTo(
      header,
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      }
    );

    // Animate logo with bounce effect
    if (logo) {
      tl.to(
        logo,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );
    }

    // Animate mobile button (if exists)
    if (mobileButton) {
      tl.to(
        mobileButton,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.25"
      );
    }

    // Animate navigation buttons individually
    if (nav) {
      const navButtons = nav.querySelectorAll("button");

      // Performance & depth hints
      gsap.set(nav, { transformPerspective: 600, transformOrigin: "50% 0%" });
      if (navButtons.length > 0) {
        gsap.set(navButtons, {
          willChange: "transform, opacity",
          y: -48,
          opacity: 0,
          skewY: 4,
          force3D: true,
        });
      }

      // Animate nav container first
      tl.to(
        nav,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power3.out",
        },
        "-=0.15"
      )
        // Label for precise absolute stagger start
        .add("navButtons");

      // Then animate each button individually with smooth easing and light de-skew
      navButtons.forEach((button, index) => {
        if (button) {
          tl.fromTo(
            button,
            0.35, // duration required by Timeline.fromTo signature
            {
              y: -48,
              opacity: 0,
              skewY: 4,
              force3D: true,
            },
            {
              y: 0,
              opacity: 1,
              skewY: 0,
              ease: "expo.out",
              onComplete: () => {
                gsap.set(button, { willChange: "auto" });
              },
            },
            `navButtons+=${index * 0.05}`
          );
        }
      });
    }

    // Animate controls last
    if (controls) {
      tl.to(
        controls,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.1"
      );
    }

    // Animation complete - no hover effects needed

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [enabled]);

  return {
    headerRef,
    logoRef,
    navRef,
    controlsRef,
    mobileButtonRef,
  };
}
