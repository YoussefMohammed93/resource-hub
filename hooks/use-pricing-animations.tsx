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
    // Only run animations on desktop devices (768px and above)
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    // If on mobile, immediately reset all elements to their natural state
    if (!isDesktop()) {
      const allElements = [
        titleRef.current,
        descriptionRef.current,
        additionalInfoRef.current,
        ...cardRefs.current.filter(Boolean)
      ].filter(Boolean);

      if (allElements.length > 0) {
        gsap.set(allElements, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }
      return;
    }

    if (!sectionRef.current || isLoading || hasError) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create main timeline with performance optimizations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 95%", // Start earlier for faster activation
        toggleActions: "play none none none",
        once: true, // Play only once for better performance
      },
    });

    // Animate title
    if (titleRef.current) {
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 20,
        force3D: true,
      });
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        force3D: true,
      });
    }

    // Animate description
    if (descriptionRef.current) {
      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 15,
        force3D: true,
      });
      tl.to(
        descriptionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.2"
      );
    }

    // Animate cards with optimized stagger
    const validCards = cardRefs.current.filter(Boolean);
    if (validCards.length > 0) {
      gsap.set(validCards, {
        opacity: 0,
        y: 25,
        force3D: true,
      });

      tl.to(
        validCards,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          force3D: true,
          stagger: {
            amount: 0.15,
            from: "start",
          },
        },
        "-=0.15"
      );
    }

    // Animate additional info
    if (additionalInfoRef.current) {
      gsap.set(additionalInfoRef.current, {
        opacity: 0,
        y: 10,
        force3D: true,
      });
      tl.to(
        additionalInfoRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.1"
      );
    }

    timelineRef.current = tl;
  }, [isLoading, hasError]);

  // Animate loading state with optimized performance
  const animateLoadingState = useCallback(() => {
    // Only run animations on desktop devices (768px and above)
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    if (!cardsContainerRef.current) return;

    const skeletons = cardsContainerRef.current.querySelectorAll("[data-skeleton]");

    // If on mobile, immediately reset skeletons to their natural state
    if (!isDesktop()) {
      if (skeletons.length > 0) {
        gsap.set(skeletons, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }
      return;
    }

    if (skeletons.length > 0) {
      gsap.fromTo(
        skeletons,
        {
          opacity: 0,
          y: 15,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
          force3D: true,
          stagger: 0.03,
        }
      );
    }
  }, []);

  // Animate error state with optimized performance
  const animateErrorState = useCallback(() => {
    // Only run animations on desktop devices (768px and above)
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    if (!cardsContainerRef.current) return;

    const errorContainer = cardsContainerRef.current.querySelector("[data-error]");

    // If on mobile, immediately reset error container to its natural state
    if (!isDesktop()) {
      if (errorContainer) {
        gsap.set(errorContainer, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }
      return;
    }

    if (errorContainer) {
      gsap.fromTo(
        errorContainer,
        {
          opacity: 0,
          y: 10,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
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
      }, 20);

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

  // Handle responsive changes
  useEffect(() => {
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    const onResize = () => {
      if (!isDesktop()) {
        // Reset elements to their natural state on mobile
        const allElements = [
          titleRef.current,
          descriptionRef.current,
          additionalInfoRef.current,
          ...cardRefs.current.filter(Boolean)
        ].filter(Boolean);

        if (allElements.length > 0) {
          gsap.set(allElements, {
            opacity: 1,
            y: 0,
            clearProps: "all"
          });
        }

        // Also reset any skeleton or error elements
        if (cardsContainerRef.current) {
          const skeletons = cardsContainerRef.current.querySelectorAll("[data-skeleton]");
          const errorContainer = cardsContainerRef.current.querySelector("[data-error]");
          
          if (skeletons.length > 0) {
            gsap.set(skeletons, {
              opacity: 1,
              y: 0,
              clearProps: "all"
            });
          }
          
          if (errorContainer) {
            gsap.set(errorContainer, {
              opacity: 1,
              y: 0,
              clearProps: "all"
            });
          }
        }
      }
    };
    
    window.addEventListener('resize', onResize);
    
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

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
      }, 20);
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
