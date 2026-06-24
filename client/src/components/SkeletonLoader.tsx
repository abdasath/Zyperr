"use client";

import React from "react";

export default function SkeletonLoader() {
  return (
    <div style={{ width: "100%", padding: "20px 48px", boxSizing: "border-box" }}>
      {[...Array(3)].map((_, rowIndex) => (
        <div key={rowIndex} style={{ marginBottom: 48 }}>
          {/* Row Title Skeleton */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div className="skeleton" style={{ width: 4, height: 26, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: 200, height: 28, borderRadius: 6 }} />
          </div>

          {/* Row Cards Skeleton */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", 
            gap: 20, 
            overflow: "hidden" 
          }}>
            {[...Array(7)].map((_, cardIndex) => (
              <div key={cardIndex} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="skeleton" style={{ width: "100%", aspectRatio: "2/3", borderRadius: 12 }} />
                <div className="skeleton" style={{ width: "80%", height: 16, borderRadius: 4 }} />
                <div className="skeleton" style={{ width: "50%", height: 12, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
