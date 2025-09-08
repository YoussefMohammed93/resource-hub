"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface FloatingDotsAnimationProps {
  className?: string;
  dotCount?: number;
  dotSize?: number;
  animationDuration?: number;
}

export function FloatingDotsAnimation({
  className = "",
  dotCount = 350,
  dotSize = 3,
  animationDuration = 20,
}: FloatingDotsAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const dots: HTMLDivElement[] = [];

    // Clear existing dots
    container.innerHTML = "";
    dotsRef.current = [];

    // Choose a visible color for dots based on theme (dark/light)
    const isDark = document.documentElement.classList.contains("dark");
    const resolvedPrimary = isDark ? "rgba(255,255,255,0.5)" : "var(--primary)";

    // Create floating dots
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("div");
      // Inline styles to avoid Tailwind purge issues on dynamic nodes
      dot.style.position = "absolute";
      dot.style.width = `${dotSize}px`;
      dot.style.height = `${dotSize}px`;
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = resolvedPrimary;
      dot.style.opacity = `${0.35 + Math.random() * 0.35}`; // 0.35 to 0.70

      // Random initial position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      dot.style.left = `${x}%`;
      dot.style.top = `${y}%`;

      container.appendChild(dot);
      dots.push(dot);
      dotsRef.current.push(dot);
    }

    // Animate dots with GSAP
    dots.forEach((dot) => {
      // Random delay for staggered animation
      const delay = Math.random() * animationDuration;

      // Random movement path
      const xMovement = (Math.random() - 0.5) * 200; // -100 to 100
      const yMovement = (Math.random() - 0.5) * 200; // -100 to 100

      // Random scale animation
      const scaleVariation = 0.5 + Math.random() * 1.5; // 0.5 to 2

      // Create timeline for each dot
      const tl = gsap.timeline({ repeat: -1, delay });

      tl.to(dot, {
        x: xMovement,
        y: yMovement,
        scale: scaleVariation,
        opacity: 0.4 + Math.random() * 0.4, // 0.4 to 0.8
        duration: animationDuration / 2,
        ease: "sine.inOut",
      }).to(dot, {
        x: -xMovement,
        y: -yMovement,
        scale: 1,
        opacity: 0.2 + Math.random() * 0.3, // 0.2 to 0.5
        duration: animationDuration / 2,
        ease: "sine.inOut",
      });

      // Add subtle rotation
      gsap.to(dot, {
        rotation: 360,
        duration: animationDuration * (0.8 + Math.random() * 0.4), // Vary rotation speed
        repeat: -1,
        ease: "none",
      });
    });

    // Cleanup function
    return () => {
      dotsRef.current.forEach((d) => gsap.killTweensOf(d));
      container.innerHTML = "";
    };
  }, [dotCount, dotSize, animationDuration]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}
