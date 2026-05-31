"use client";

import React from "react";

interface LogoProps {
  size?: number; // Base size in pixels (e.g. 36)
  withText?: boolean;
}

export default function Logo({ size = 36, withText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0" style={{ textDecoration: "none" }}>
      
      {/* SLEEK, MODERN "Z" MONOGRAM LOGO */}
      <div 
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="overflow-visible"
        >
          <defs>
            {/* Premium red gradient for the Z */}
            <linearGradient id="z-red" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff2a35" />
              <stop offset="100%" stopColor="var(--zyperr-red)" />
            </linearGradient>
            
            {/* Mask to carve out the play button from the diagonal line */}
            <mask id="play-mask">
              <rect width="32" height="32" fill="white" />
              <path 
                d="M 13 10 L 22 16 L 13 22 Z" 
                fill="black" 
                stroke="black" 
                strokeWidth="4" 
                strokeLinejoin="round" 
              />
            </mask>
          </defs>

          {/* The Z with glowing drop shadow and negative space mask */}
          <g filter="drop-shadow(0px 4px 12px rgba(229, 9, 20, 0.6))">
            <path 
              d="M 5 6 L 27 6 L 5 26 L 27 26" 
              stroke="url(#z-red)" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              mask="url(#play-mask)"
            />
          </g>

          {/* The crisp white Play Button in the negative space */}
          <path 
            d="M 13 10 L 22 16 L 13 22 Z" 
            fill="#ffffff" 
            stroke="#ffffff" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {/* Typography */}
      {withText && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: size * 0.65,
            fontWeight: 900, // Max thickness for bold text
            letterSpacing: "-0.04em",
            color: "#fff",
          }}
        >
          ZYPERR+
        </span>
      )}
    </div>
  );
}
