"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Performance settings for smooth animations
gsap.config({
  force3D: true,
  nullTargetWarn: false,
});

interface UsePricingAnimationsOptions {
  isLoading?: boolean;
  hasError?: boolean;
  cardsCount?: number;
}

export const usePricingAnimations = ({
  isLoading = false,
  hasError = false,
  cardsCount = 0,
}: UsePricingAnimationsOptions = {}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const additionalInfoRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Performance optimized card refs setter
  const setCardRef = useCallback((el: HTMLDivElement | null, index: number) => {
    cardRefs.current[index] = el;
  }, []);

  // Initialize entrance animations with optimized performance
  const initEntranceAnimations = useCallback(() => {
    if (!sectionRef.current || isLoading || hasError) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create main timeline with performance optimizations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true, // Play only once for better performance
      },
    });

    // Animate title
    if (titleRef.current) {
      gsap.set(titleRef.current, { 
        opacity: 0, 
        y: 30,
        force3D: true 
      });
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        force3D: true,
      });
    }

    // Animate description
    if (descriptionRef.current) {
      gsap.set(descriptionRef.current, { 
        opacity: 0, 
        y: 20,
        force3D: true 
      });
      tl.to(
        descriptionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.3"
      );
    }

    // Animate cards with optimized stagger
    const validCards = cardRefs.current.filter(Boolean);
    if (validCards.length > 0) {
      gsap.set(validCards, {
        opacity: 0,
        y: 40,
        force3D: true,
      });

      tl.to(
        validCards,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          force3D: true,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        },
        "-=0.2"
      );
    }

    // Animate additional info
    if (additionalInfoRef.current) {
      gsap.set(additionalInfoRef.current, { 
        opacity: 0, 
        y: 15,
        force3D: true 
      });
      tl.to(
        additionalInfoRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.2"
      );
    }

    timelineRef.current = tl;
  }, [isLoading, hasError]);


  // Animate loading state with optimized performance
  const animateLoadingState = useCallback(() => {
    if (!cardsContainerRef.current) return;

    const skeletons = cardsContainerRef.current.querySelectorAll(
      "[data-skeleton]"
    );

    if (skeletons.length > 0) {
      gsap.fromTo(
        skeletons,
        {
          opacity: 0,
          y: 20,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          force3D: true,
          stagger: 0.05,
        }
      );
    }
  }, []);

  // Animate error state with optimized performance
  const animateErrorState = useCallback(() => {
    if (!cardsContainerRef.current) return;

    const errorContainer = cardsContainerRef.current.querySelector(
      "[data-error]"
    );

    if (errorContainer) {
      gsap.fromTo(
        errorContainer,
        {
          opacity: 0,
          y: 15,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          force3D: true,
        }
      );
    }
  }, []);

  // Main effect to initialize animations
  useEffect(() => {
    if (isLoading) {
      animateLoadingState();
    } else if (hasError) {
      animateErrorState();
    } else if (cardsCount > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initEntranceAnimations();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [
    isLoading,
    hasError,
    cardsCount,
    initEntranceAnimations,
    animateLoadingState,
    animateErrorState,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Refresh animations when content changes
  const refreshAnimations = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (!isLoading && !hasError && cardsCount > 0) {
      setTimeout(() => {
        initEntranceAnimations();
      }, 50);
    }
  }, [isLoading, hasError, cardsCount, initEntranceAnimations]);

  return {
    sectionRef,
    titleRef,
    descriptionRef,
    cardsContainerRef,
    additionalInfoRef,
    setCardRef,
    refreshAnimations,
  };
};
