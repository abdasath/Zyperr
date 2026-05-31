"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Info, Star, Clock, Volume2, VolumeX, Check, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { watchlistApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  duration: number;
  rating: number;
  thumbnailUrl: string;
  bannerUrl: string;
  cast: string;
  director: string;
  featured: boolean;
  trending: boolean;
  contentType: "MOVIE" | "WEB_SERIES" | "ANIME";
}

interface HeroBannerProps {
  movies: Movie[];
}

export default function HeroBanner({ movies }: HeroBannerProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true);
  const [imgError, setImgError] = useState(false);

  const currentMovie = movies[currentIdx];

  const nextMovie = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % movies.length);
    setImgError(false);
  }, [movies.length]);

  const prevMovie = () => {
    setCurrentIdx((prev) => (prev - 1 + movies.length) % movies.length);
    setImgError(false);
  };

  // Auto-rotate every 8s
  useEffect(() => {
    const timer = setInterval(nextMovie, 8000);
    return () => clearInterval(timer);
  }, [nextMovie]);

  // Fetch watchlist once on mount
  useEffect(() => {
    if (isAuthenticated) {
      watchlistApi.get().then((res) => {
        const ids = new Set<string>(res.data.map((m: any) => m.id));
        setWatchlistIds(ids);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const inWatchlist = currentMovie ? watchlistIds.has(currentMovie.id) : false;

  const toggleWatchlist = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    try {
      if (inWatchlist) {
        await watchlistApi.remove(currentMovie.id);
        setWatchlistIds(prev => { const next = new Set(prev); next.delete(currentMovie.id); return next; });
      } else {
        await watchlistApi.add(currentMovie.id);
        setWatchlistIds(prev => { const next = new Set(prev); next.add(currentMovie.id); return next; });
      }
    } catch {
      // ignore
    }
  };

  if (!currentMovie) return null;

  const genres = currentMovie.genre.split(",").map((g) => g.trim());

  return (
    <div className="hero-section" id="hero-banner">
      {/* Background Image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {!imgError ? (
            <Image
              src={currentMovie.bannerUrl}
              alt={currentMovie.title}
              fill
              className="object-cover object-center"
              priority
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 50%, #0a1a0a 100%)`,
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="hero-gradient-overlay" />

      {/* Content */}
      <div className="relative z-10 page-container w-full" style={{ paddingBottom: "80px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-2xl"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {currentMovie.featured && (
                <span className="badge badge-red" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Star size={9} fill="currentColor" /> Featured
                </span>
              )}
              {currentMovie.trending && (
                <span className="badge badge-gold" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <TrendingUp size={9} /> Trending
                </span>
              )}
              {genres.slice(0, 2).map((g) => (
                <span key={g} className="badge" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11 }}>
                  {g}
                </span>
              ))}
            </div>

            {/* Title with left accent */}
            <div className="flex items-start gap-4 mb-8">
              <div
                style={{
                  width: 5,
                  minHeight: 60,
                  borderRadius: 3,
                  background: "linear-gradient(to bottom, var(--zyperr-red), rgba(229,9,20,0.3))",
                  flexShrink: 0,
                  marginTop: 6,
                  boxShadow: "0 0 14px rgba(229,9,20,0.5)",
                }}
              />
              <h1
                className="font-black"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(42px, 6.5vw, 80px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.04em",
                  color: "#fff",
                  textShadow: "0 4px 40px rgba(0,0,0,0.8)",
                }}
              >
                {currentMovie.title}
              </h1>
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14 }}>
                <Star size={15} fill="#f5c518" color="#f5c518" />
                <span style={{ fontWeight: 700, color: "#f5c518" }}>{currentMovie.rating.toFixed(1)}</span>
              </div>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500 }}>
                {currentMovie.releaseYear}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                <Clock size={14} />
                <span style={{ fontWeight: 500 }}>
                  {currentMovie.contentType === "WEB_SERIES" || currentMovie.contentType === "ANIME"
                    ? `${currentMovie.duration}m / ep`
                    : `${Math.floor(currentMovie.duration / 60)}h ${currentMovie.duration % 60}m`}
                </span>
              </div>
            </div>

            {/* Description */}
            <p
              className="leading-relaxed mb-10"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "15px",
                lineHeight: 1.7,
                maxWidth: "480px",
                paddingLeft: 20,
                marginBottom: 36,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {currentMovie.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3" style={{ paddingLeft: 20 }}>
              {currentMovie.status === "Upcoming" ? (
                <div
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 28px", borderRadius: 12,
                    background: "rgba(251,191,36,0.12)",
                    border: "1.5px solid rgba(251,191,36,0.35)",
                    color: "#fbbf24", fontSize: 15, fontWeight: 700,
                    letterSpacing: "0.02em",
                    backdropFilter: "blur(8px)",
                    cursor: "default",
                  }}
                >
                  <Clock size={17} />
                  Coming Soon
                </div>
              ) : (
                <button
                  id={`hero-play-${currentMovie.id}`}
                  onClick={() => router.push(`/movies/${currentMovie.id}`)}
                  className="btn btn-primary"
                  style={{ borderRadius: "12px", fontSize: "15px", padding: "13px 32px", boxShadow: "0 8px 32px rgba(229,9,20,0.45)" }}
                >
                  <Play size={17} fill="white" />
                  Play Now
                </button>
              )}
              <button
                id={`hero-watchlist-${currentMovie.id}`}
                onClick={toggleWatchlist}
                className="btn btn-secondary"
                style={{ borderRadius: "12px", fontSize: "15px", padding: "13px 26px" }}
              >
                {inWatchlist ? <Check size={17} style={{ color: "var(--zyperr-red-light)" }} /> : <Plus size={17} />}
                {inWatchlist ? "In Watchlist" : "Add to List"}
              </button>
              <button
                id={`hero-info-${currentMovie.id}`}
                onClick={() => router.push(`/movies/${currentMovie.id}`)}
                className="btn btn-ghost"
                style={{ borderRadius: "12px", fontSize: "14px", padding: "13px 22px", color: "rgba(255,255,255,0.7)" }}
              >
                <Info size={17} />
                More Info
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevMovie}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all"
        style={{
          background: "rgba(6,6,6,0.6)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        }}
        id="hero-prev"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={nextMovie}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all"
        style={{
          background: "rgba(6,6,6,0.6)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        }}
        id="hero-next"
      >
        <ChevronRight size={22} />
      </button>

      {/* Mute Toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-32 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: "rgba(6,6,6,0.6)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
        }}
        id="hero-mute"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentIdx(idx); setImgError(false); }}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: idx === currentIdx ? "32px" : "8px",
              background: idx === currentIdx ? "var(--zyperr-red)" : "rgba(255,255,255,0.3)",
            }}
            id={`hero-dot-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}
