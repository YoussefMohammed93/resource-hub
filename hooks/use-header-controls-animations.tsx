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
    if (!enabled) return;
    
    const container = controlsContainerRef.current;
    const themeButton = themeButtonRef.current;
    const languageButton = languageButtonRef.current;
    const downloadIndicator = downloadIndicatorRef.current;
    const mobileControls = mobileControlsRef.current;
    const authControls = authControlsRef.current;

    if (!container) return;

    // Create timeline for header controls
    const tl = gsap.timeline({ delay: 1.2 });

    // Get all elements that exist
    const elements = [themeButton, languageButton, downloadIndicator, mobileControls, authControls].filter(Boolean);
    
    // Set initial states for animation
    gsap.set(elements, {
      y: -40,
      opacity: 0,
      scale: 0.8,
    });

    // Animate each control individually with stagger
    elements.forEach((element, index) => {
      if (!element) return;

      tl.to(
        element,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        1.2 + (index * 0.1) // Absolute timing with stagger
      );
    });

    // Cleanup function
    return () => {
      tl.kill();
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
