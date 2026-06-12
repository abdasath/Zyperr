"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import MovieCard from "./MovieCard";

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  contentType?: "MOVIE" | "WEB_SERIES" | "ANIME";
  releaseYear: number;
  duration: number;
  rating: number;
  thumbnailUrl: string;
  bannerUrl: string;
  featured: boolean;
  trending: boolean;
  totalSeasons?: number | null;
  totalEpisodes?: number | null;
  status?: string | null;
  studio?: string | null;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  cardSize?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  accent?: "red" | "blue" | "purple" | "gold";
  isSubRow?: boolean;
  onSeeAll?: () => void;
}

const ACCENT_MAP = {
  red:    { color: "#e50914", glow: "rgba(229,9,20,0.5)",    bg: "rgba(229,9,20,0.12)"   },
  blue:   { color: "#60a5fa", glow: "rgba(96,165,250,0.5)",  bg: "rgba(96,165,250,0.12)" },
  purple: { color: "#a78bfa", glow: "rgba(167,139,250,0.5)", bg: "rgba(167,139,250,0.12)"},
  gold:   { color: "#f5c518", glow: "rgba(245,197,24,0.5)",  bg: "rgba(245,197,24,0.12)" },
};

export default function MovieRow({ title, movies, cardSize = "md", icon, accent = "red", isSubRow = false, onSeeAll }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { color, glow, bg } = ACCENT_MAP[accent];

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: dir === "right" ? rowRef.current.offsetWidth * 0.8 : -rowRef.current.offsetWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (!movies?.length) return null;

  /* Strip emoji from title to use as a clean ID */
  const safeId = title.replace(/[^\w\s]/gi, "").trim().toLowerCase().replace(/\s+/g, "-");

  return (
    <section
      id={`row-${safeId}`}
      style={{ marginBottom: 48 }}
    >
      {/* ── Section header ── */}
      <div
        className="movie-row-header"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 6, padding: "0 48px", paddingTop: isSubRow ? 16 : 32,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          {/* Accent bar */}
          <div style={{
            width: isSubRow ? 3 : 4, height: isSubRow ? 18 : 22, borderRadius: 3,
            background: color,
            boxShadow: `0 0 10px ${glow}`,
            flexShrink: 0,
          }} />

          {/* Icon */}
          {icon && (
            <span style={{
              color: color,
              display: "flex", alignItems: "center",
              opacity: 0.9,
            }}>
              {icon}
            </span>
          )}

          <h2 className="movie-row-title" style={{
            fontFamily: "var(--font-display)",
            fontSize: isSubRow ? 22 : 30,
            fontWeight: isSubRow ? 700 : 800,
            color: isSubRow ? "rgba(255,255,255,0.9)" : "#fff",
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
          }}>
            {title}
          </h2>
        </motion.div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* See all / Show less */}
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)",
                background: "none", border: "none", cursor: "pointer",
                transition: "color 0.15s", padding: "4px 8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              See all <ArrowRight size={13} />
            </button>
          )}

          {/* Scroll buttons */}
          <div className="movie-row-arrows" style={{ display: "flex", gap: 6 }}>
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                id={`scroll-${dir}-${safeId}`}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)", cursor: "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = bg;
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}50`;
                  (e.currentTarget as HTMLElement).style.color = color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                {dir === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable card row ── */}
      <div style={{ position: "relative" }}>
        <div
          ref={rowRef}
          className="movie-row-scroll"
          style={{
            display: "flex",
            gap: 14,
            overflowX: "auto",
            scrollbarWidth: "none",
            padding: "20px 48px 24px",
          }}
        >
            {movies.map((movie, idx) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.4) }}
                style={{ flexShrink: 0 }}
              >
                <MovieCard movie={movie} size={cardSize} />
              </motion.div>
            ))}
          </div>

          {/* Edge fades */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 48, pointerEvents: "none",
            background: "linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 48, pointerEvents: "none",
            background: "linear-gradient(to left, var(--bg-primary) 0%, transparent 100%)",
          }} />
        </div>
    </section>
  );
}
