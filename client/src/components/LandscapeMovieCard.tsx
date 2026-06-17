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

interface LandscapeMovieCardProps {
  movie: Movie;
  showGenre?: boolean;
}

const TYPE_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  MOVIE:      { label: "Movie",  bg: "rgba(229,9,20,0.75)",   color: "#fff" },
  WEB_SERIES: { label: "Series", bg: "rgba(59,130,246,0.75)", color: "#fff" },
  ANIME:      { label: "Anime",  bg: "rgba(139,92,246,0.75)", color: "#fff" },
};

export default function LandscapeMovieCard({ movie, showGenre = true }: LandscapeMovieCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [inWatchlist, setInWatchlist]       = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [imgError, setImgError]             = useState(false);

  // Landscape ratio (16:9)
  const width = 320;
  const height = 180;
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
      id={`movie-card-land-${movie.id}`}
      style={{
        width: "100%", // flexible width for grid
        maxWidth: 400,
        borderRadius: 12,
        overflow: "hidden",
        background: "#111",
        cursor: "pointer",
        position: "relative",
      }}
      whileHover={{ scale: 1.04, y: -6 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── Banner image ── */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#1a1a1a", overflow: "hidden" }}>
        {!imgError ? (
          <Image
            src={movie.bannerUrl || movie.thumbnailUrl} // fallback to thumbnail if banner missing
            alt={movie.title}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, 33vw"
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

        {/* ── Hover overlay ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Action button */}
          <button
            onClick={() => router.push(`/movies/${movie.id}`)}
            style={{
              width: 50, height: 50, borderRadius: "50%", border: "none", cursor: "pointer",
              background: "rgba(229,9,20,0.9)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(229,9,20,0.5)",
            }}
          >
            <Play size={22} fill="white" style={{ marginLeft: 4 }} />
          </button>
        </motion.div>
      </div>

      {/* ── Card footer ── */}
      <Link
        href={`/movies/${movie.id}`}
        style={{ textDecoration: "none", display: "block", padding: "12px 14px 16px" }}
      >
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            flex: 1, paddingRight: 10
          }}>
            {movie.title}
          </h3>
          <button
            onClick={toggleWatchlist}
            disabled={loadingWatchlist}
            title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            style={{
              width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: inWatchlist ? "rgba(229,9,20,0.2)" : "transparent",
              color: inWatchlist ? "#ff6b6b" : "rgba(255,255,255,0.5)",
              transition: "all 0.15s",
              flexShrink: 0
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = inWatchlist ? "rgba(229,9,20,0.2)" : "transparent"; e.currentTarget.style.color = inWatchlist ? "#ff6b6b" : "rgba(255,255,255,0.5)"; }}
          >
            {inWatchlist ? <Check size={12} /> : <Plus size={12} />}
          </button>
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
              {movie.releaseYear || "TBD"}
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
            marginTop: 10,
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
