"use client";

import { useEffect, useState } from "react";
import { moviesApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import SkeletonLoader from "@/components/SkeletonLoader";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  duration: number;
  thumbnailUrl: string;
  bannerUrl: string;
  videoUrl?: string;
  rating: number;
  franchise?: string;
  contentType: "MOVIE" | "WEB_SERIES" | "ANIME";
  totalSeasons?: number;
}

// MARVEL_FRANCHISES removed - rows are now dynamically generated from tags starting with "Marvel:"

export default function MarvelHubPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarvelContent = async () => {
      try {
        const res = await moviesApi.getAll({ limit: 10000 });
        const allContent: Movie[] = res.data.movies || [];
        
        // Extract only movies where the franchise starts with "Marvel:"
        const marvelContent = allContent.filter(m => {
          return m.franchise && m.franchise.toLowerCase().startsWith("marvel:");
        });
        // Shuffle movies so they appear in random order inside the rows on every reload
        const shuffledContent = [...marvelContent].sort(() => 0.5 - Math.random());
        setMovies(shuffledContent);
      } catch (error) {
        console.error("Error fetching Marvel content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarvelContent();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{ position: "relative", width: "100%", height: "50vh", minHeight: 400, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(135deg, #3a0000, #7a0000)",
        }} />
        
        {/* Giant Watermark Logo */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg"
          alt="Watermark"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "150%", minWidth: 1000, opacity: 0.15, pointerEvents: "none", objectFit: "cover" }}
        />
        
        {/* Glow effects */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", height: "80%", background: "radial-gradient(circle, rgba(229,9,20,0.3) 0%, transparent 70%)" }} />

        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }} />

        <div style={{
          position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "0 48px 60px", maxWidth: 1400, margin: "0 auto"
        }}>
          <Link href="/browse" style={{ 
            position: "fixed", top: 80, left: 48, zIndex: 100,
            display: "inline-flex", alignItems: "center", gap: 6, 
            color: "rgba(255,255,255,0.9)", textDecoration: "none", 
            fontSize: 14, fontWeight: 600,
            background: "rgba(0,0,0,0.4)", padding: "10px 20px",
            borderRadius: "30px", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}>
            <ArrowLeft size={16} /> Back to Browse
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "5vw", fontFamily: "var(--font-display)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
          >
            MARVEL
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, marginTop: 16, maxWidth: 600, fontWeight: 500 }}
          >
            Journey into the Marvel Cinematic Universe and explore the greatest superhero sagas ever told.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, width: "100%", maxWidth: 1400, margin: "0 auto", paddingBottom: "60px", paddingTop: "20px" }}>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div>
            {Array.from(new Set(movies.map(m => m.franchise!)))
              .sort((a, b) => {
                const order = [
                  "Marvel: MCU: Phase One",
                  "Marvel: MCU: Phase Two",
                  "Marvel: MCU: Phase Three",
                  "Marvel: MCU: Phase Four",
                  "Marvel: MCU: Phase Five",
                  "Marvel: MCU: Phase Six",
                  "Marvel: The Defenders Saga",
                  "Marvel: Animated Series",
                  "Marvel: Modern Animation",
                  "Marvel: Marvel Special Presentations",
                  "Marvel: X-Men Main Saga",
                  "Marvel: Wolverine Collection",
                  "Marvel: Deadpool Collection",
                  "Marvel: X-Men Spin-Off Collection",
                  "Marvel: Sam Raimi Trilogy",
                  "Marvel: Amazing Spider-Man",
                  "Marvel: Sony's Spider-Man Universe",
                  "Marvel: Spider-Verse Animation",
                  "Marvel: Fantastic Four Collection",
                  "Marvel: Ghost Rider Collection"
                ];
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);
                
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return a.localeCompare(b);
              })
              .map((franchiseName) => {
              const rowMovies = movies.filter(m => m.franchise === franchiseName);
              if (rowMovies.length === 0) return null;

              // Remove "Marvel: " prefix for the visible row title
              const visibleTitle = franchiseName.replace(/^Marvel:\s*/i, "");

              return (
                <div key={franchiseName}>
                  {franchiseName === "Marvel: MCU: Phase One" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        The Infinity Saga
                      </h2>
                    </div>
                  )}
                  {franchiseName === "Marvel: Animated Series" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Marvel Animation
                      </h2>
                    </div>
                  )}
                  {franchiseName === "Marvel: Marvel Special Presentations" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Marvel Special Presentations
                      </h2>
                    </div>
                  )}
                  {franchiseName === "Marvel: The Defenders Saga" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        The Defenders Saga
                      </h2>
                    </div>
                  )}
                  {franchiseName === "Marvel: Sam Raimi Trilogy" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Spider-Man Collection (Non-MCU)
                      </h2>
                    </div>
                  )}
                  {franchiseName === "Marvel: Fantastic Four Collection" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Fantastic Four Collection
                      </h2>
                    </div>
                  )}
                  {franchiseName === "Marvel: Ghost Rider Collection" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Ghost Rider Collection
                      </h2>
                    </div>
                  )}
                  {franchiseName === "Marvel: X-Men Main Saga" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        X-Men Collection
                      </h2>
                    </div>
                  )}
                  {franchiseName === "Marvel: MCU: Phase Four" && (
                    <div style={{ padding: "40px 48px 10px", marginTop: "40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <h2 style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        The Multiverse Saga
                      </h2>
                    </div>
                  )}
                  <MovieRow
                    title={visibleTitle}
                    movies={rowMovies}
                    accent="red"
                  />
                </div>
              );
            })}

            {movies.length === 0 && (
              <div style={{ textAlign: "center", padding: "100px 0", color: "rgba(255,255,255,0.5)" }}>
                No Marvel content found. Start adding movies and tag them with "Marvel: MCU Phase 1", etc.
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
