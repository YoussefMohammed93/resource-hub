"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useMobileMenuAnimations(isOpen: boolean) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<HTMLDivElement[]>([]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
    }
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const menu = menuRef.current;
    const menuItems = menuItemsRef.current;

    // Only run animations on desktop devices (768px and above)
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    if (!menu || !isDesktop()) {
      // Reset menu items to their natural state on mobile
      if (menuItems.length > 0) {
        gsap.set(menuItems, {
          x: 0,
          opacity: 1,
          scale: 1,
          clearProps: "all"
        });
      }
      return;
    }

    if (isOpen) {
      // Opening animation - only animate menu items since CSS handles the slide
      const tl = gsap.timeline({ delay: 0.1 });

      // Set initial states for menu items
      gsap.set(menuItems, { x: -50, opacity: 0, scale: 0.8 });

      // Animate menu items with stagger
      tl.to(
        menuItems,
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
          stagger: 0.1,
        }
      );
    } else {
      // Closing animation - animate menu items out
      if (menuItems.length > 0) {
        gsap.to(menuItems, {
          x: -30,
          opacity: 0,
          scale: 0.9,
          duration: 0.2,
          ease: "power2.in",
          stagger: 0.05,
        });
      }
    }
  }, [isOpen]);

  return {
    overlayRef,
    menuRef,
    addToRefs,
  };
}
