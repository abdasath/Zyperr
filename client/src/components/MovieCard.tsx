"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Plus, Star, Clock, Check, Tv, Film, Swords, Flame } from "lucide-react";
import { watchlistApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

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

interface MovieCardProps {
  movie: Movie;
  size?: "sm" | "md" | "lg";
  showGenre?: boolean;
  hideWatchlistButton?: boolean;
}

const TYPE_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  MOVIE:      { label: "Movie",  bg: "rgba(229,9,20,0.75)",   color: "#fff" },
  WEB_SERIES: { label: "Series", bg: "rgba(59,130,246,0.75)", color: "#fff" },
  ANIME:      { label: "Anime",  bg: "rgba(139,92,246,0.75)", color: "#fff" },
};

/* Poster sizes — portrait ratio (2:3) like Netflix */
const SIZE_MAP = {
  sm: { width: 150, height: 225 },
  md: { width: 185, height: 278 },
  lg: { width: 230, height: 345 },
};

export default function MovieCard({ movie, size = "md", showGenre = true, hideWatchlistButton = false }: MovieCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [inWatchlist, setInWatchlist]       = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [imgError, setImgError]             = useState(false);

  const { width, height }  = SIZE_MAP[size];
  const contentType        = movie.contentType ?? "MOVIE";
  const typeStyle          = TYPE_STYLES[contentType] ?? TYPE_STYLES.MOVIE;
  const isSeries           = contentType === "WEB_SERIES" || contentType === "ANIME";

  const durationLabel = isSeries
    ? movie.totalSeasons
      ? `${movie.totalSeasons} Season${movie.totalSeasons > 1 ? 's' : ''}`
      : movie.totalEpisodes
        ? `${movie.totalEpisodes} eps`
        : `${movie.duration}m / ep`
    : `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`;

  const statusColor =
    movie.status === "Completed" ? "#4ade80" :
    movie.status === "Ongoing"   ? "#facc15" :
    movie.status === "Upcoming"  ? "#38bdf8" :
    "rgba(255,255,255,0.35)";

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { router.push("/login"); return; }
    setLoadingWatchlist(true);
    try {
      if (inWatchlist) {
        await watchlistApi.remove(movie.id);
        setInWatchlist(false);
      } else {
        await watchlistApi.add(movie.id);
        setInWatchlist(true);
      }
    } catch { /* ignore */ }
    finally { setLoadingWatchlist(false); }
  };

  const genres = movie.genre.split(",").map(g => g.trim()).filter(Boolean);

  return (
    <motion.div
      id={`movie-card-${movie.id}`}
      className="movie-card-grid-item"
      onClick={() => router.push(`/movies/${movie.id}`)}
      style={{
        width,
        minWidth: width,
        borderRadius: 12,
        overflow: "hidden",
        background: "#111",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
      }}
      whileHover={{ scale: 1.04, y: -6 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── Poster image ── */}
      <div className="movie-card-poster" style={{ position: "relative", width, height, background: "#1a1a1a", overflow: "hidden" }}>
        {!imgError ? (
          <Image
            src={movie.thumbnailUrl}
            alt={movie.title}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            sizes={`${width}px`}
            unoptimized
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #1c1c1c, #2a2a2a)",
          }}>
            <span style={{ color: "rgba(255,255,255,0.14)", display: "flex" }}>
              {contentType === "ANIME" ? <Swords size={40} /> : contentType === "WEB_SERIES" ? <Tv size={40} /> : <Film size={40} />}
            </span>
          </div>
        )}

        {/* ── Top-left: type badge ── */}
        <div style={{ position: "absolute", top: 9, left: 9 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.07em",
            padding: "3px 7px", borderRadius: 6,
            background: typeStyle.bg, color: typeStyle.color,
            backdropFilter: "blur(6px)",
            display: "inline-flex", alignItems: "center", gap: 3,
          }}>
            {contentType === "WEB_SERIES" ? <><Tv size={8} /> SERIES</> :
             contentType === "ANIME"      ? <><Swords size={8} /> ANIME</> :
             <><Film size={8} /> MOVIE</>}
          </span>
        </div>

        {/* ── Top-right: rating ── */}
        <div style={{
          position: "absolute", top: 9, right: 9,
          display: "flex", alignItems: "center", gap: 3,
          padding: "3px 7px", borderRadius: 6,
          background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <Star size={9} fill="#f5c518" color="#f5c518" />
          <span style={{ color: "#f5c518", fontSize: 11, fontWeight: 700 }}>
            {movie.rating.toFixed(1)}
          </span>
        </div>

        {/* ── HOT badge (trending) ── */}
        {movie.trending && (
          <div style={{
            position: "absolute", bottom: 9, left: 9,
            fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
            background: "rgba(229,9,20,0.85)", color: "#fff",
            backdropFilter: "blur(6px)",
          }}>
            <Flame size={9} /> HOT
          </div>
        )}

        {/* ── Hover overlay ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.15) 100%)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: 12,
          }}
        >
          {/* Overlay title */}
          <p style={{
            fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700,
            color: "#fff", lineHeight: 1.3, marginBottom: 10,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {movie.title}
          </p>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => router.push(`/movies/${movie.id}`)}
              id={`play-${movie.id}`}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #e50914, #c0050f)",
                color: "#fff", fontSize: 12, fontWeight: 700,
                boxShadow: "0 4px 14px rgba(229,9,20,0.5)",
              }}
            >
              <Play size={11} fill="white" /> Play
            </button>
            {!hideWatchlistButton && (
              <button
                onClick={toggleWatchlist}
                disabled={loadingWatchlist}
                id={`watchlist-${movie.id}`}
                title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                style={{
                  width: 34, height: 34, borderRadius: 8, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: inWatchlist ? "rgba(229,9,20,0.35)" : "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(4px)",
                  transition: "background 0.15s",
                }}
              >
                {inWatchlist
                  ? <Check size={13} style={{ color: "#ff6b6b" }} />
                  : <Plus size={13} color="white" />}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Card footer ── */}
      <Link
        href={`/movies/${movie.id}`}
        id={`info-${movie.id}`}
        style={{ textDecoration: "none", display: "block", padding: "10px 12px 12px" }}
      >
        {/* Title */}
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: size === "sm" ? 12 : 13,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          marginBottom: 5,
        }}>
          {movie.title}
        </h3>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
              {movie.releaseYear}
            </span>
            {(movie.status && (movie.contentType !== "MOVIE" || movie.status === "Upcoming")) && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                background: `${statusColor}18`, color: statusColor,
                border: `1px solid ${statusColor}30`,
              }}>
                {movie.status}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Clock size={9} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 500 }}>
              {durationLabel}
            </span>
          </div>
        </div>

        {/* Genre tags */}
        {showGenre && genres.length > 0 && (
          <div style={{
            marginTop: 7,
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            height: 22,
            overflow: "hidden",
          }}>
            {genres.map((g, idx) => (
              <span key={idx} style={{
                fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.38)",
                border: "1px solid rgba(255,255,255,0.08)",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
                display: "inline-block"
              }}>
                {g}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
