"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Plus, Check, Star, Clock, Calendar, Globe, Users,
  ArrowLeft, Film, ChevronRight, Tv, Layers, Swords, TrendingUp, Flame, Info, X
} from "lucide-react";
import { moviesApi, watchlistApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  contentType?: "MOVIE" | "WEB_SERIES" | "ANIME";
  releaseYear: number;
  duration: number;
  language: string;
  rating: number;
  thumbnailUrl: string;
  bannerUrl: string;
  trailerUrl?: string;
  videoUrl: string;
  cast: string;
  director: string;
  studio?: string | null;
  totalSeasons?: number | null;
  totalEpisodes?: number | null;
  status?: string | null;
  featured: boolean;
  trending: boolean;
}

// Helper to extract YouTube video ID from various url formats
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [related, setRelated] = useState<Movie[]>([]);
  const [crossTypeRelated, setCrossTypeRelated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }

    const fetchMovie = async () => {
      setLoading(true);
      try {
        const [movieRes, allRes] = await Promise.all([
          moviesApi.getById(id),
          moviesApi.getAll(),
        ]);
        const movieData = movieRes.data;
        setMovie(movieData);

        // Get related content (same type + matching genre)
        const genreList = movieData.genre.split(",").map((g: string) => g.trim());
        const allMovies = allRes.data.movies || [];
        const relatedMovies = allMovies.filter(
          (m: Movie) =>
            m.id !== id &&
            m.contentType === movieData.contentType &&
            genreList.some((g: string) => m.genre.toLowerCase().includes(g.toLowerCase()))
        );
        setRelated(relatedMovies);

        // Cross-type recommendations (different type, same genre)
        const crossType = allMovies.filter(
          (m: Movie) =>
            m.id !== id &&
            m.contentType !== movieData.contentType &&
            genreList.some((g: string) => m.genre.toLowerCase().includes(g.toLowerCase()))
        );
        setCrossTypeRelated(crossType.slice(0, 12));

        // Check watchlist
        try {
          const wlRes = await watchlistApi.check(id);
          setInWatchlist(wlRes.data.inWatchlist);
        } catch {}
      } catch {
        router.push("/browse");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, isAuthenticated, router]);

  useEffect(() => {
    if (!movie || (movie.contentType !== "WEB_SERIES" && movie.contentType !== "ANIME")) return;

    const fetchTVMazeEpisodes = async () => {
      setEpisodesLoading(true);
      try {
        const searchRes = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(movie.title)}`);
        const searchData = await searchRes.json();
        
        if (searchData && searchData.length > 0) {
          const showId = searchData[0].show.id;
          const epRes = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
          const epData = await epRes.json();
          
          const seasonEpisodes = epData.filter((ep: any) => ep.season === selectedSeason);
          
          const formattedEpisodes = seasonEpisodes.map((ep: any) => ({
            id: ep.id,
            episodeNumber: ep.number,
            title: ep.name,
            description: ep.summary ? ep.summary.replace(/<[^>]+>/g, '') : "No description available.",
            duration: ep.runtime || movie.duration || 24,
            airdate: ep.airdate ? new Date(ep.airdate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : movie.releaseYear
          }));
          
          setEpisodes(formattedEpisodes);
        } else {
          setEpisodes([]);
        }
      } catch (err) {
        console.error("Failed to fetch episodes", err);
        setEpisodes([]);
      } finally {
        setEpisodesLoading(false);
      }
    };

    fetchTVMazeEpisodes();
  }, [movie, selectedSeason]);

  const toggleWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await watchlistApi.remove(id);
        setInWatchlist(false);
      } else {
        await watchlistApi.add(id);
        setInWatchlist(true);
      }
    } catch {}
    setWatchlistLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center w-full" style={{ minHeight: "calc(100vh - 100px)" }}>
          <div className="flex items-center justify-center mb-4 rounded-2xl animate-pulse"
            style={{ width: 64, height: 64, background: "rgba(229,9,20,0.12)" }}>
            <Film size={28} style={{ color: "var(--zyperr-red)" }} />
          </div>
          <div className="w-full flex justify-center text-center m-0 p-0">
            <p className="text-sm m-0 p-0" style={{ color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              Loading content...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const isSeries = movie.contentType === "WEB_SERIES" || movie.contentType === "ANIME";
  const isAnime  = movie.contentType === "ANIME";
  const genres = movie.genre.split(",").map((g) => g.trim());
  const castList = movie.cast.split(",").map((c) => c.trim());

  const typeIcon  = isAnime ? <Swords size={12} /> : isSeries ? <Tv size={12} /> : <Film size={12} />;
  const typeLabel = isAnime ? "Anime" : isSeries ? "Web Series" : "Movie";
  const typeBg    = isAnime ? "rgba(139,92,246,0.18)" : isSeries ? "rgba(59,130,246,0.18)" : "rgba(229,9,20,0.18)";
  const typeColor = isAnime ? "#a78bfa" : isSeries ? "#60a5fa" : "#ff6b75";

  const durationLabel = isSeries
    ? `${movie.duration}m / ep`
    : `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`;

  const DotSeparator = () => (
    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
  );



  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <div className="relative flex flex-col justify-end" style={{ minHeight: "max(75vh, 650px)", marginTop: 0 }}>
        
        {/* Back Button (Floating) */}
        <div className="fixed top-24 left-0 z-50 w-full page-container pointer-events-none">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 transition-all pointer-events-auto"
            style={{
              color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              padding: "6px 14px", borderRadius: 20, cursor: "pointer",
              backdropFilter: "blur(8px)", display: "inline-flex"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            id="movie-back-top"
          >
            <ArrowLeft size={14} /> Back to Browse
          </button>
        </div>

        {/* Banner Image */}
        <div className="absolute inset-0">
          {!imgError ? (
            <Image
              src={movie.bannerUrl}
              alt={movie.title}
              fill
              className="object-cover object-top"
              priority
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a0a0a, #0a0a2a)" }} />
          )}
        </div>

        {/* Gradient Overlays */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(6,6,6,0.98) 0%, rgba(6,6,6,0.7) 50%, rgba(6,6,6,0.1) 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 60%)" }}
        />

        {/* Video Player Overlay */}
        <AnimatePresence>
          {playing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black flex items-center justify-center"
            >
              <video
                src={movie.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                id="movie-player"
              />
              <button
                onClick={() => setPlaying(false)}
                className="absolute top-24 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                style={{
                  background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                id="close-player"
              >
                ✕ Close Player
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 w-full page-container pb-16" style={{ paddingTop: "140px" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-3xl"
          >


            {/* Badges Row */}
            <div className="flex flex-wrap gap-2.5 mb-5">
              <span style={{
                fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6,
                letterSpacing: "0.06em", background: typeBg, color: typeColor,
                border: `1px solid ${typeColor}33`, display: "inline-flex", alignItems: "center", gap: 5
              }}>
                {typeIcon} {typeLabel}
              </span>
              {movie.featured && (
                <span className="badge badge-red" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Star size={11} fill="currentColor" /> Featured
                </span>
              )}
              {movie.trending && (
                <span className="badge badge-gold" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <TrendingUp size={11} /> Trending
                </span>
              )}
            </div>

            {/* Title */}
            <div className="flex items-start gap-4 mb-8">
              <div
                style={{
                  width: 5, minHeight: 50, borderRadius: 3, marginTop: 6, flexShrink: 0,
                  background: "linear-gradient(to bottom, var(--zyperr-red), rgba(229,9,20,0.3))",
                  boxShadow: "0 0 14px rgba(229,9,20,0.5)",
                }}
              />
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 5.5vw, 68px)",
                  fontWeight: 900, color: "#fff", lineHeight: 1.05,
                  letterSpacing: "-0.03em", textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                }}
              >
                {movie.title}
              </h1>
            </div>

            {/* Clean Meta Row */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, paddingLeft: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 15 }}>
                <Star size={16} fill="#f5c518" color="#f5c518" />
                <span style={{ fontWeight: 800, color: "#f5c518" }}>{movie.rating.toFixed(1)}</span>
              </div>
              
              <DotSeparator />
              
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                <Calendar size={14} />
                <span style={{ fontWeight: 500 }}>{movie.releaseYear}</span>
              </div>

              <DotSeparator />
              
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                <Clock size={14} />
                <span style={{ fontWeight: 500 }}>{durationLabel}</span>
              </div>

              {isSeries && movie.totalSeasons && (
                <>
                  <DotSeparator />
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                    <Layers size={14} />
                    <span style={{ fontWeight: 500 }}>{movie.totalSeasons}S · {movie.totalEpisodes} eps</span>
                  </div>
                </>
              )}

              <DotSeparator />

              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                <Globe size={14} />
                <span style={{ fontWeight: 500 }}>{movie.language}</span>
              </div>

              {(movie.status && (movie.contentType !== "MOVIE" || movie.status === "Upcoming")) && (
                <>
                  <DotSeparator />
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                    color: movie.status === "Completed" ? "#4ade80" : movie.status === "Ongoing" ? "#facc15" : "rgba(255,255,255,0.6)",
                    background: movie.status === "Completed" ? "rgba(74,222,128,0.15)" : movie.status === "Ongoing" ? "rgba(250,204,21,0.15)" : "rgba(255,255,255,0.1)",
                    border: `1px solid ${movie.status === "Completed" ? "rgba(74,222,128,0.3)" : movie.status === "Ongoing" ? "rgba(250,204,21,0.3)" : "rgba(255,255,255,0.15)"}`,
                  }}>
                    {movie.status}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.6,
                maxWidth: 600, paddingLeft: 20, marginBottom: 36,
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
              }}
            >
              {movie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 movie-action-buttons" style={{ paddingLeft: 20 }}>
              {movie.status === "Upcoming" ? (
                <div
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "14px 32px", borderRadius: 12,
                    background: "rgba(251,191,36,0.1)",
                    border: "1.5px solid rgba(251,191,36,0.3)",
                    color: "#fbbf24", fontSize: 16, fontWeight: 700,
                    letterSpacing: "0.02em", cursor: "default",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Clock size={18} />
                  Coming Soon
                </div>
              ) : (
                <button
                  id="movie-play-btn"
                  onClick={() => { /* dummy for now */ }}
                  className="btn btn-primary"
                  style={{ borderRadius: 12, fontSize: 16, padding: "14px 36px", boxShadow: "0 8px 32px rgba(229,9,20,0.45)" }}
                >
                  <Play size={18} fill="white" /> {isSeries ? "Watch First Episode S1 E1" : "Play Now"}
                </button>
              )}
              
              <button
                id="movie-watchlist-btn"
                onClick={toggleWatchlist}
                disabled={watchlistLoading}
                className="btn btn-secondary"
                style={{ borderRadius: 12, fontSize: 15, padding: "14px 28px" }}
              >
                {inWatchlist ? (
                  <><Check size={18} style={{ color: "var(--zyperr-red-light)" }} /> In Watchlist</>
                ) : (
                  <><Plus size={18} /> Add to List</>
                )}
              </button>

              {movie.trailerUrl && (
                <button
                  onClick={() => document.getElementById('trailer-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="btn btn-ghost"
                  style={{
                    borderRadius: 12, fontSize: 15, padding: "14px 28px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: 8,
                    textDecoration: "none", cursor: "pointer"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  id="movie-trailer-btn"
                >
                  Watch Trailer <ChevronRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── DETAILS SECTION ── */}
      <div className="page-container pt-16" style={{ marginTop: "100px", paddingBottom: "120px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Info Column (Cast, etc.) */}
          <div className="lg:col-span-8">
            {/* Main Content Sections: Trailer -> Storyline -> Top Cast */}
            <div className="flex flex-col gap-12 pt-6">
              
              {/* Trailer Embed */}
              {movie.trailerUrl && getYouTubeId(movie.trailerUrl) && (
                <div id="trailer-section">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 4, height: 20, background: "var(--zyperr-red)", borderRadius: 3, boxShadow: "0 0 10px rgba(229,9,20,0.5)" }} />
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#fff" }}>
                      Trailer
                    </h2>
                  </div>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYouTubeId(movie.trailerUrl)}`}
                      title="Trailer"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Storyline / Quote */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 4, height: 20, background: "var(--zyperr-red)", borderRadius: 3, boxShadow: "0 0 10px rgba(229,9,20,0.5)" }} />
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#fff" }}>
                    Storyline
                  </h2>
                </div>
                <div style={{
                  padding: 32, borderRadius: 16,
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                  position: "relative", overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", top: -10, left: 20, fontSize: 160, color: "rgba(255,255,255,0.03)", fontFamily: "serif", lineHeight: 1 }}>&ldquo;</div>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.8, position: "relative", zIndex: 1 }}>
                    {movie.description}
                  </p>
                </div>
              </div>

              {/* Top Cast */}
              <div className="pb-12 lg:pb-24">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 4, height: 20, background: "var(--zyperr-red)", borderRadius: 3, boxShadow: "0 0 10px rgba(229,9,20,0.5)" }} />
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#fff" }}>
                    Top Cast
                  </h2>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {castList.map((actor, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 16px", borderRadius: 12,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >
                      <Users size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                      <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500 }}>{actor}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar Details Card */}
          <div className="lg:col-span-4">
            <div
              style={{
                position: "sticky",
                top: 120,
                background: "rgba(20,20,20,0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: 32,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}
              id="movie-sidebar"
            >
              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
                color: "#fff", marginBottom: 24, paddingBottom: 16,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Info size={18} style={{ color: "var(--zyperr-red)" }} />
                {isSeries ? "Series Details" : "Movie Details"}
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: isSeries ? "Creator" : "Director",   value: movie.director },
                  isAnime && movie.studio
                    ? { label: "Studio",    value: movie.studio }  : null,
                  { label: "Release Year",  value: movie.releaseYear },
                  isSeries
                    ? { label: "Ep. Duration", value: `${movie.duration}m` }
                    : { label: "Duration",     value: `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` },
                  isSeries && movie.totalSeasons
                    ? { label: "Seasons",      value: movie.totalSeasons }    : null,
                  isSeries && movie.totalEpisodes
                    ? { label: "Episodes",     value: movie.totalEpisodes }   : null,
                  { label: "Language",  value: movie.language },
                  { label: "Genres",    value: genres.join(", ") },
                  { label: "Rating",    value: `${movie.rating.toFixed(1)} / 10` },
                ].filter(Boolean).map(({ label, value }: any) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500 }}>{label}</span>
                    <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600, textAlign: "right" }}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {isSeries && movie.totalSeasons && (
          <div style={{ marginTop: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 4, height: 20, background: "var(--zyperr-red)", borderRadius: 3, boxShadow: "0 0 10px rgba(229,9,20,0.5)" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#fff" }}>
                Episodes
              </h2>
            </div>
            
            {/* Season Selector */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, marginBottom: 16, msOverflowStyle: "none", scrollbarWidth: "none" }}>
              {Array.from({ length: movie.totalSeasons }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setSelectedSeason(i + 1)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 30,
                    fontSize: 15,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: selectedSeason === i + 1 ? "var(--zyperr-red)" : "rgba(255,255,255,0.05)",
                    color: selectedSeason === i + 1 ? "#fff" : "rgba(255,255,255,0.6)",
                    border: "none",
                  }}
                  onMouseEnter={(e) => { if (selectedSeason !== i + 1) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={(e) => { if (selectedSeason !== i + 1) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  Season {i + 1}
                </button>
              ))}
            </div>

            {/* Episode List */}
            <div style={{ display: "flex", flexDirection: "column", minHeight: 200 }}>
              {episodesLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "rgba(255,255,255,0.5)" }}>
                  <Film size={24} className="animate-pulse" style={{ color: "var(--zyperr-red)", marginRight: 12 }} /> Loading episodes...
                </div>
              ) : episodes.length > 0 ? (
                episodes.map((ep, idx) => (
                  <div
                    key={ep.id}
                    style={{
                      padding: "24px 0",
                      borderBottom: idx === episodes.length - 1 ? "none" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                    }}
                    className="group"
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <h4 style={{ 
                        fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.9)",
                        display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s"
                      }} className="group-hover:text-[#60a5fa]">
                        S{selectedSeason < 10 ? `0${selectedSeason}` : selectedSeason} E{ep.episodeNumber < 10 ? `0${ep.episodeNumber}` : ep.episodeNumber}{ep.title.toLowerCase() !== `episode ${ep.episodeNumber}` && ` · ${ep.title}`}
                        <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
                      </h4>
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
                      {ep.airdate}
                    </p>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                      {ep.description}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "rgba(255,255,255,0.5)" }}>
                  No episodes found for this season.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Movies — same type */}
        {related.length > 0 && (
          <div className="movie-detail-section" style={{ marginTop: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 4, height: 20, background: "var(--zyperr-red)", borderRadius: 3, boxShadow: "0 0 10px rgba(229,9,20,0.5)" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#fff" }}>
                More Like This
              </h2>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: typeBg, color: typeColor, border: `1px solid ${typeColor}33`,
                marginLeft: 4,
              }}>
                {typeLabel} only
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 movie-related-grid">
              {related.map((m, idx) => (
                <motion.div
                  key={m.id}
                  className="movie-grid-cell"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <MovieCard movie={m} size="md" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-type recommendations — different type, same genre */}
        {crossTypeRelated.length > 0 && (
          <div className="movie-detail-section" style={{ marginTop: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 4, height: 20, background: "#60a5fa", borderRadius: 3, boxShadow: "0 0 10px rgba(96,165,250,0.5)" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#fff" }}>
                Similar in {genres[0]}
              </h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24, paddingLeft: 16 }}>
              {isSeries ? "Movies and anime" : "Series and anime"} you might also enjoy
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 movie-related-grid">
              {crossTypeRelated.map((m, idx) => (
                <motion.div
                  key={m.id}
                  className="movie-grid-cell"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <MovieCard movie={m} size="md" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── TRAILER MODAL ── */}
      <AnimatePresence>
        {isTrailerOpen && movie?.trailerUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
            style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)" }}
            onClick={() => setIsTrailerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsTrailerOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", transition: "0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(229,9,20,0.8)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
              >
                <X size={20} />
              </button>

              {getYouTubeId(movie.trailerUrl) ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYouTubeId(movie.trailerUrl)}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                  <p>Invalid trailer URL</p>
                  <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mt-2">Open in new tab instead</a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

    </div>
  );
}
