"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  href: string;
  gradient: string;
  logoUrl?: string; // Optional URL for a logo image
}

const BRANDS: Brand[] = [
  {
    id: "dc",
    name: "DC Collection",
    href: "/browse/dc",
    gradient: "linear-gradient(135deg, #021a3b, #00458a)",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/DC_Comics_logo.svg", // Fallback text used if not rendering
  },
  {
    id: "marvel",
    name: "Marvel Cinematic Universe",
    href: "/browse/marvel",
    gradient: "linear-gradient(135deg, #4a0000, #e50914)",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg",
  }
];

export default function BrandTiles() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px", marginBottom: "40px" }}>
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px"
        }}
      >
        {BRANDS.map((brand, i) => (
          <BrandTile key={brand.id} brand={brand} index={i} />
        ))}
      </div>
    </div>
  );
}

function BrandTile({ brand, index }: { brand: Brand; index: number }) {
  const containerRef = useRef<HTMLAnchorElement>(null);

  return (
    <Link href={brand.href} style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 120,
          borderRadius: 16,
          background: brand.gradient,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "hidden",
          cursor: "pointer",
          textDecoration: "none",
          border: "2px solid rgba(255,255,255,0.05)",
          transition: "border-color 0.3s ease",
        }}
        whileHover={{
          scale: 1.05,
          borderColor: "rgba(255,255,255,0.5)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glow effect */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))",
          pointerEvents: "none",
        }} />
        
        {/* Logo or Text */}
        {brand.logoUrl ? (
          <div style={{ position: "relative", width: "60%", height: "60%", zIndex: 1 }}>
             <Image 
               src={brand.logoUrl} 
               alt={brand.name} 
               fill 
               style={{ objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}
               unoptimized
             />
          </div>
        ) : (
          <h3 style={{
            color: "white",
            fontSize: "20px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1px",
            textAlign: "center",
            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
            zIndex: 1,
            padding: "0 20px"
          }}>
            {brand.name}
          </h3>
        )}
      </motion.div>
    </Link>
  );
}
