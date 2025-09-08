"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseSupportedPlatformsAnimationsProps {
  enabled?: boolean;
}

export function useSupportedPlatformsAnimations({
  enabled = true,
}: UseSupportedPlatformsAnimationsProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const section = sectionRef.current;
    const header = headerRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const gridContainer = gridContainerRef.current;
    const grid = gridRef.current;

    if (!section || !header || !title || !description || !gridContainer || !grid) return;

    // Set initial states
    gsap.set([title, description, gridContainer], {
      opacity: 0,
      y: 30,
    });

    // Create main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate header elements
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    })
    .to(description, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.4")
    .to(gridContainer, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.3");

    // Animate grid cards with stagger
    const cards = grid.querySelectorAll(".group");
    if (cards.length > 0) {
      gsap.set(cards, {
        opacity: 0,
        y: 20,
        scale: 0.95,
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: {
          amount: 1.2,
          from: "start",
        },
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === section || trigger.trigger === grid) {
          trigger.kill();
        }
      });
    };
  }, [enabled]);

  return {
    sectionRef,
    headerRef,
    titleRef,
    descriptionRef,
    gridContainerRef,
    gridRef,
  };
}
