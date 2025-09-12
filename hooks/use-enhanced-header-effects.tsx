"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

export function useEnhancedHeaderEffects(targetRef: RefObject<HTMLElement | null> | null, enabled: boolean = true) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Reset hasRunRef on every enabled change to allow re-running
    if (enabled) {
      hasRunRef.current = false;
    }
    
    if (!enabled || hasRunRef.current || !targetRef) return;
    const header = targetRef.current;
    if (!header) return;
    hasRunRef.current = true;

    // Create floating particles effect
    let particleContainerEl: HTMLDivElement | null = null;
    const createParticles = () => {
      if (particleContainerEl) return;
      const particleContainer = document.createElement('div');
      particleContainer.className = 'absolute inset-x-0 top-0 pointer-events-none overflow-hidden';
      particleContainer.style.zIndex = '1';
      header.appendChild(particleContainer);
      particleContainerEl = particleContainer;

      // Create 30 floating particles
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-2 h-2 bg-primary/40 rounded-full';
        // Position near the top area only (0-40px from top)
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.floor(Math.random() * 40) + 'px';
        particleContainer.appendChild(particle);

        // Make particles more visible and animated
        gsap.fromTo(particle, 
          {
            opacity: 0,
            scale: 0,
          },
          {
            opacity: 0.6,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            delay: Math.random() * 1,
          }
        );

        // Animate each particle
        gsap.to(particle, {
          y: -20,
          x: Math.random() * 40 - 20,
          duration: 1.5 + Math.random() * 1,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 1,
        });

        gsap.to(particle, {
          scale: 1.5,
          duration: 1 + Math.random() * 0.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 0.5,
        });
      }
    };

    // Only show particles on screens >= 768px
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

    // Initialize all effects
    const timeoutId = window.setTimeout(() => {
      if (isDesktop()) {
        createParticles();
      }
    }, 1000); // Start after initial animations complete

    // Handle responsive changes
    const onResize = () => {
      if (isDesktop()) {
        if (!particleContainerEl) createParticles();
      } else {
        if (particleContainerEl) {
          particleContainerEl.remove();
          particleContainerEl = null;
        }
      }
    };
    window.addEventListener('resize', onResize);

    // Cleanup function
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', onResize);
      if (particleContainerEl) {
        particleContainerEl.remove();
        particleContainerEl = null;
      }
    };
  }, [enabled, targetRef]);

  return { particlesRef };
}
