"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseHeroAnimationsProps {
  enabled: boolean; // Only run animations when loading is complete
}

export const useHeroAnimations = ({ enabled }: UseHeroAnimationsProps) => {
  // Main content refs
  const heroSectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleHighlightRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchTypeRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLDivElement>(null);
  const mobileSearchButtonRef = useRef<HTMLDivElement>(null);
  const desktopSearchBarRef = useRef<HTMLDivElement>(null);
  const errorDisplayRef = useRef<HTMLDivElement>(null);
  const ctaButtonsRef = useRef<HTMLDivElement>(null);

  // Background decorative elements refs
  const backgroundPatternRef = useRef<HTMLDivElement>(null);
  const gridDotsRef = useRef<HTMLDivElement>(null);
  const squareGridRef = useRef<HTMLDivElement>(null);
  const diamondGridRef = useRef<HTMLDivElement>(null);
  const topCenterDotsRef = useRef<HTMLDivElement>(null);
  const topRightIconRef = useRef<HTMLDivElement>(null);
  const topRightSquaresRef = useRef<HTMLDivElement>(null);

  // Floating icons refs
  const floatingIconsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Helper function to add refs to floating icons array
  const addFloatingIconRef = (el: HTMLDivElement | null) => {
    if (el && !floatingIconsRefs.current.includes(el)) {
      floatingIconsRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
      // Set initial states for all elements
      const allElements = [
        titleRef.current,
        titleHighlightRef.current,
        descriptionRef.current,
        searchContainerRef.current,
        mobileSearchTypeRef.current,
        mobileSearchInputRef.current,
        mobileSearchButtonRef.current,
        desktopSearchBarRef.current,
        backgroundPatternRef.current,
        gridDotsRef.current,
        squareGridRef.current,
        diamondGridRef.current,
        topCenterDotsRef.current,
        topRightIconRef.current,
        topRightSquaresRef.current,
        ...floatingIconsRefs.current,
      ].filter(Boolean);

      // Set initial invisible state
      gsap.set(allElements, {
        opacity: 0,
        y: 50,
        scale: 0.8,
        rotation: -5,
      });

      // Set special initial states for floating elements
      gsap.set(floatingIconsRefs.current, {
        opacity: 0,
        scale: 0,
        rotation: 180,
        y: -100,
      });

      gsap.set(
        [gridDotsRef.current, squareGridRef.current, diamondGridRef.current],
        {
          opacity: 0,
          scale: 0.5,
          rotation: 45,
        }
      );

      // Create main timeline with faster animations
      const tl = gsap.timeline({
        delay: 0.1, // Reduced delay
      });

      // 1. Background pattern fade in
      tl.to(backgroundPatternRef.current, {
        opacity: 0.35,
        duration: 0.4,
        ease: "power2.out",
      });

      // 2. Main title animation (no glow effect)
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );

      // 3. Title highlight (no glow effect)
      tl.to(
        titleHighlightRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.4"
      );

      // 4. Description
      tl.to(
        descriptionRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // 5. Search container
      tl.to(
        searchContainerRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );

      // 6. Mobile search elements (staggered)
      if (mobileSearchTypeRef.current) {
        tl.to(
          mobileSearchTypeRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
      }

      if (mobileSearchInputRef.current) {
        tl.to(
          mobileSearchInputRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );
      }

      if (mobileSearchButtonRef.current) {
        tl.to(
          mobileSearchButtonRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
          },
          "-=0.1"
        );
      }

      // 7. Desktop search bar
      if (desktopSearchBarRef.current) {
        tl.to(
          desktopSearchBarRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
      }

      // 8. Decorative grid elements
      tl.to(
        [gridDotsRef.current, squareGridRef.current, diamondGridRef.current],
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.05,
        },
        "-=0.4"
      );

      // 9. Top decorative elements
      tl.to(
        [
          topCenterDotsRef.current,
          topRightIconRef.current,
          topRightSquaresRef.current,
        ],
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
          stagger: 0.05,
        },
        "-=0.3"
      );

      // 10. Floating icons
      tl.to(
        floatingIconsRefs.current,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: {
            amount: 0.6,
            from: "random",
          },
        },
        "-=0.4"
      );

      // 11. CTA Buttons animation
      tl.to(
        ctaButtonsRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.8)",
        },
        "-=0.2"
      );

      // Add continuous floating animations for icons (faster)
      floatingIconsRefs.current.forEach((icon, index) => {
        if (icon) {
          gsap.to(icon, {
            y: "random(-15, 15)",
            x: "random(-8, 8)",
            rotation: "random(-10, 10)",
            duration: "random(2, 4)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.1,
          });
        }
      });

      // Add subtle floating animation to grid patterns (faster)
      [
        gridDotsRef.current,
        squareGridRef.current,
        diamondGridRef.current,
      ].forEach((element, index) => {
        if (element) {
          gsap.to(element, {
            y: "random(-10, 10)",
            x: "random(-8, 8)",
            rotation: "random(-8, 8)",
            duration: "random(3, 5)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.3,
          });
        }
      });

      // Removed scroll-triggered glow and hover effects as requested
    }, heroSectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [enabled]);

  return {
    heroSectionRef,
    titleRef,
    titleHighlightRef,
    descriptionRef,
    searchContainerRef,
    mobileSearchTypeRef,
    mobileSearchInputRef,
    mobileSearchButtonRef,
    desktopSearchBarRef,
    errorDisplayRef,
    backgroundPatternRef,
    gridDotsRef,
    squareGridRef,
    diamondGridRef,
    topCenterDotsRef,
    topRightIconRef,
    topRightSquaresRef,
    addFloatingIconRef,
    ctaButtonsRef,
  };
};
