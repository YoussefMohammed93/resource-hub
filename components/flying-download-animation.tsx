"use client";

import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { useLanguage } from "./i18n-provider";

interface FlyingDownloadAnimationProps {
  isActive: boolean;
  startElement?: HTMLElement | null;
  onComplete?: () => void;
}

export function FlyingDownloadAnimation({
  isActive,
  startElement,
  onComplete,
}: FlyingDownloadAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (isActive) {
      // Find the download indicator in the header
      const downloadIndicator = document.querySelector(
        "[data-download-indicator]"
      ) as HTMLElement;

      if (downloadIndicator) {
        const endRect = downloadIndicator.getBoundingClientRect();

        // Start from bottom center of screen (like coming from below)
        setStartPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight + 50, // Start from below the screen
        });

        setEndPosition({
          x: endRect.left + endRect.width / 2,
          y: endRect.top + endRect.height / 2,
        });

        setIsAnimating(true);
        setAnimationProgress(0);

        // Animate progress smoothly
        const duration = 1800; // Longer duration for better bottom-to-top effect
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Smooth easing function (ease-out-cubic)
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          setAnimationProgress(easedProgress);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setTimeout(() => {
              setIsAnimating(false);
              onComplete?.();
            }, 200);
          }
        };

        requestAnimationFrame(animate);
      }
    }
  }, [isActive, startElement, onComplete]);

  if (!isAnimating) return null;

  // Calculate curved path based on RTL/LTR
  const deltaX = endPosition.x - startPosition.x;
  const deltaY = endPosition.y - startPosition.y;

  // Create a beautiful curved path from bottom to top
  const curveDirection = isRTL ? -1 : 1; // Curve left for RTL, right for LTR
  const curveIntensity = 200; // Fixed curve intensity for bottom-to-top animation

  // Bezier curve calculation for upward motion
  const t = animationProgress;
  const curveX = deltaX * t + curveDirection * curveIntensity * Math.sin(t * Math.PI * 0.8);
  const curveY = deltaY * t - curveIntensity * 0.6 * Math.sin(t * Math.PI * 0.7);

  // Add floating motion
  const floatY = Math.sin(t * Math.PI * 3) * 8; // Gentle up-down floating
  const floatX = Math.cos(t * Math.PI * 2) * 4; // Subtle side-to-side sway

  const finalX = curveX + floatX;
  const finalY = curveY + floatY;

  // Scale and rotation for more dynamic feel
  const scale = 1 + Math.sin(t * Math.PI) * 0.2; // Pulse effect
  const rotation = t * 360 * (isRTL ? -1 : 1); // Spin based on direction

  return (
    <div
      ref={animationRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Flying download icon */}
      <div
        className="absolute transform-gpu will-change-transform"
        style={{
          left: startPosition.x - 12,
          top: startPosition.y - 12,
          transform: `translate(${finalX}px, ${finalY}px) scale(${scale}) rotate(${rotation}deg)`,
          transition: "none", // Use manual animation instead of CSS transitions
        }}
      >
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
            style={{
              transform: `scale(${1.5 + Math.sin(t * Math.PI * 4) * 0.3})`,
            }}
          />

          {/* Glowing background */}
          <div
            className="absolute inset-0 bg-primary/40 rounded-full blur-md"
            style={{
              transform: `scale(${1.2 + Math.sin(t * Math.PI * 6) * 0.2})`,
            }}
          />

          {/* Main icon */}
          <div className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full p-3 shadow-2xl border-2 border-primary/30">
            <Download className="w-6 h-6" />
          </div>

          {/* Inner sparkle */}
          <div
            className="absolute inset-2 bg-white/30 rounded-full"
            style={{
              opacity: Math.sin(t * Math.PI * 8) * 0.5 + 0.5,
              transform: `scale(${0.3 + Math.sin(t * Math.PI * 10) * 0.2})`,
            }}
          />
        </div>
      </div>

      {/* Enhanced particle trail */}
      {[...Array(8)].map((_, i) => {
        const trailProgress = Math.max(0, animationProgress - i * 0.08);
        const trailT = Math.min(trailProgress / 0.8, 1);

        if (trailT <= 0) return null;

        const trailCurveX =
          deltaX * trailT +
          curveDirection * curveIntensity * Math.sin(trailT * Math.PI);
        const trailCurveY =
          deltaY * trailT -
          Math.abs(curveIntensity) * 0.5 * Math.sin(trailT * Math.PI);
        const trailFloatY = Math.sin(trailT * Math.PI * 3) * 8;
        const trailFloatX = Math.cos(trailT * Math.PI * 2) * 4;

        return (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/60 to-primary/20"
            style={{
              left: startPosition.x - 3,
              top: startPosition.y - 3,
              width: `${8 - i}px`,
              height: `${8 - i}px`,
              transform: `translate(${trailCurveX + trailFloatX}px, ${trailCurveY + trailFloatY}px)`,
              opacity: (1 - i * 0.12) * trailT,
              filter: `blur(${i * 0.5}px)`,
            }}
          />
        );
      })}

      {/* Sparkle effects */}
      {[...Array(6)].map((_, i) => {
        const sparkleDelay = i * 0.15;
        const sparkleProgress = Math.max(0, animationProgress - sparkleDelay);

        if (sparkleProgress <= 0) return null;

        const sparkleAngle = i * 60 * (Math.PI / 180);
        const sparkleDistance =
          30 + Math.sin(sparkleProgress * Math.PI * 4) * 10;
        const sparkleX = Math.cos(sparkleAngle) * sparkleDistance;
        const sparkleY = Math.sin(sparkleAngle) * sparkleDistance;

        return (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-primary/80 rounded-full"
            style={{
              left: startPosition.x + finalX + sparkleX,
              top: startPosition.y + finalY + sparkleY,
              opacity: Math.sin(sparkleProgress * Math.PI) * 0.8,
              transform: `scale(${Math.sin(sparkleProgress * Math.PI * 2) + 1})`,
            }}
          />
        );
      })}
    </div>
  );
}
