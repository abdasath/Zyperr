"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Film, Trash2, Play, Tv, Swords, SearchX, Plus } from "lucide-react";
import { watchlistApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";

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
  cast: string;
  director: string;
}

export default function WatchlistPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "MOVIE" | "WEB_SERIES" | "ANIME">("ALL");

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await watchlistApi.get();
        setMovies(res.data || []);
      } catch {}
      setLoading(false);
    };
    fetchWatchlist();
  }, [isAuthenticated, router]);

  const removeMovie = async (movieId: string) => {
    try {
      await watchlistApi.remove(movieId);
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
    } catch {}
  };

  const filteredMovies = movies.filter(m => {
    if (filter === "ALL") return true;
    return m.contentType === filter;
  });

  const heroBanner = movies.length > 0 ? movies[0].bannerUrl : null;

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Navbar />

      {/* Dynamic Background */}
      {heroBanner && (
        <div 
          className="absolute top-0 left-0 w-full h-[50vh] pointer-events-none transition-all duration-1000"
          style={{
            backgroundImage: `url(${heroBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            filter: "blur(20px) saturate(1.5)",
            zIndex: 0
          }}
        />
      )}

      <div className="page-container relative z-10" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 mt-12"
          style={{ marginBottom: "50px" }}
        >
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: "linear-gradient(135deg, rgba(229,9,20,0.2) 0%, rgba(229,9,20,0.05) 100%)",
                  border: "1px solid rgba(229,9,20,0.2)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <Bookmark size={24} style={{ color: "var(--zyperr-red)" }} />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(32px, 5vw, 48px)",
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1
                  }}
                >
                  My Library
                </h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginTop: "4px" }}>
                  {movies.length > 0 ? `You have ${movies.length} title${movies.length !== 1 ? "s" : ""} saved` : "Your personal collection"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : movies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center rounded-3xl"
            style={{
              padding: "100px 20px",
              background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)",
              border: "1px dashed rgba(255,255,255,0.1)"
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl"
              style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <SearchX size={40} style={{ color: "rgba(255,255,255,0.2)" }} />
            </motion.div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "12px",
              }}
            >
              Your library is empty
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", maxWidth: "400px", marginBottom: "40px", lineHeight: 1.6 }}>
              Keep track of movies and shows you want to watch. Click the bookmark icon on any title to add it here.
            </p>
            <button
              onClick={() => router.push("/browse")}
              className="btn btn-primary px-8 py-3.5 text-[15px]"
              style={{ borderRadius: "14px", marginBottom: "20px" }}
              id="watchlist-browse-btn"
            >
              <Play size={18} fill="white" /> Discover Content
            </button>
          </motion.div>
        ) : filteredMovies.length === 0 ? (
          <div className="py-24 text-center">
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>No items found in this category.</p>
          </div>
        ) : (
          <>
            {/* Watchlist Grid */}
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              style={{ marginTop: "100px" }}
            >
              <AnimatePresence mode="popLayout">
                {filteredMovies.map((movie, idx) => (
                  <motion.div
                    layout
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    transition={{ duration: 0.3 }}
                    className="relative group w-fit mx-auto"
                    id={`watchlist-item-${movie.id}`}
                  >
                    <MovieCard movie={movie} size="md" hideWatchlistButton />
                    {/* Remove Button */}
                    <button
                      onClick={() => removeMovie(movie.id)}
                      className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 shadow-[0_4px_12px_rgba(229,9,20,0.5)]"
                      style={{
                        background: "var(--zyperr-red)",
                        border: "2px solid #000"
                      }}
                      id={`remove-watchlist-${movie.id}`}
                    >
                      <Trash2 size={14} color="white" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Quick Actions */}
            <motion.div layout className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
                Hover over a movie to remove it from your library
              </p>
              <button
                onClick={() => router.push("/browse")}
                className="btn btn-ghost text-sm px-6 py-2"
                style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px" }}
                id="watchlist-add-more"
              >
                <Plus size={16} /> Explore More
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
