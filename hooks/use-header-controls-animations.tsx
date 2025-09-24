"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useHeaderControlsAnimations(enabled: boolean = true) {
  const controlsContainerRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLDivElement>(null);
  const downloadIndicatorRef = useRef<HTMLDivElement>(null);
  const mobileControlsRef = useRef<HTMLDivElement>(null);
  const authControlsRef = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Only run animations on desktop devices (768px and above)
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    const container = controlsContainerRef.current;
    const themeButton = themeButtonRef.current;
    const languageButton = languageButtonRef.current;
    const downloadIndicator = downloadIndicatorRef.current;
    const mobileControls = mobileControlsRef.current;
    const authControls = authControlsRef.current;

    // Get all elements that exist
    const elements = [
      themeButton,
      languageButton,
      downloadIndicator,
      mobileControls,
      authControls,
    ].filter(Boolean);

    // If on mobile, immediately reset all elements to their natural state
    if (!isDesktop()) {
      if (elements.length > 0) {
        gsap.set(elements, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          clearProps: "all"
        });
      }
      return;
    }

    if (!enabled || !container) return;

    // Create timeline for header controls with faster start
    const tl = gsap.timeline({ delay: 0.2 });

    // Set initial states for more dramatic animation
    gsap.set(elements, {
      y: -60,
      opacity: 0,
      scale: 0.6,
      rotation: -10,
    });

    // Animate each control individually with enhanced stagger
    elements.forEach((element, index) => {
      if (!element) return;

      tl.to(
        element,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        0.2 + index * 0.1 // Faster start with more noticeable stagger
      );
    });

    // Handle responsive changes
    const onResize = () => {
      if (!isDesktop()) {
        // Reset elements to their natural state on mobile
        if (elements.length > 0) {
          gsap.set(elements, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            clearProps: "all"
          });
        }
      }
    };
    
    window.addEventListener('resize', onResize);

    // Cleanup function
    return () => {
      tl.kill();
      window.removeEventListener('resize', onResize);
    };
  }, [enabled]);

  return {
    controlsContainerRef,
    themeButtonRef,
    languageButtonRef,
    downloadIndicatorRef,
    mobileControlsRef,
    authControlsRef,
  };
}
