"use client";

import { useEffect, useState } from "react";
import { moviesApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

// DC_FRANCHISES removed - rows are now dynamically generated from tags starting with "DC:"

export default function DCHubPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDCContent = async () => {
      try {
        const res = await moviesApi.getAll({ limit: 10000 });
        const allContent: Movie[] = res.data.movies || [];
        const dcContent = allContent.filter(m => 
          m.franchise && m.franchise.toLowerCase().startsWith("dc:")
        );
        // Shuffle movies so they appear in random order inside the rows on every reload
        const shuffledContent = [...dcContent].sort(() => 0.5 - Math.random());
        setMovies(shuffledContent);
      } catch (error) {
        console.error("Error fetching DC content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDCContent();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{ position: "relative", width: "100%", height: "50vh", minHeight: 400, overflow: "hidden" }}>
        {/* Abstract dark blue background if no banner video */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(135deg, #010f24, #002244)",
        }} />
        
        {/* Glow effects */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", height: "80%", background: "radial-gradient(circle, rgba(0,85,255,0.2) 0%, transparent 70%)" }} />

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
            DC COLLECTION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, marginTop: 16, maxWidth: 600, fontWeight: 500 }}
          >
            Explore the epic universes, legendary heroes, and unforgettable villains from across the DC multiverse.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", paddingBottom: "60px", paddingTop: "20px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "2px solid rgba(0,85,255,0.25)", borderTopColor: "#0055ff",
              animation: "spin 0.8s linear infinite",
            }} />
          </div>
        ) : (
          <div>
            {Array.from(new Set(movies.map(m => m.franchise!)))
              .sort((a, b) => {
                const order = [
                  "DC: DC Extended Universe",
                  "DC: DC Universe (James Gunn)",
                  "DC: The Dark Knight Trilogy",
                  "DC: The Batman Universe",
                  "DC: Joker Collection",
                  "DC: Arrowverse",
                  "DC: DC Universe Streaming",
                  "DC: DC Animation",
                  "DC: Classic Films Era",
                  "DC: DC Standalone Films"
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
              
              // Remove "DC: " prefix for the visible row title
              const visibleTitle = franchiseName.replace(/^DC:\s*/i, "");

              if (franchiseName === "DC: Classic Films Era") {
                const supermanMovies = rowMovies.filter(m => m.title.toLowerCase().includes("superman"));
                const batmanMovies = rowMovies.filter(m => m.title.toLowerCase().includes("batman"));
                
                return (
                  <div key={franchiseName} style={{ marginBottom: 48, marginTop: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 48px', marginBottom: -10 }}>
                      <div style={{ width: 4, height: 26, background: '#60a5fa', borderRadius: 4, boxShadow: '0 0 10px rgba(96,165,250,0.5)' }} />
                      <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-0.025em', fontFamily: 'var(--font-display)' }}>
                        Classic Films
                      </h2>
                    </div>
                    {supermanMovies.length > 0 && (
                      <MovieRow title="Superman Legacy:" movies={supermanMovies} accent="blue" isSubRow={true} />
                    )}
                    {batmanMovies.length > 0 && (
                      <MovieRow title="Tim Burton / Schumacher Batman:" movies={batmanMovies} accent="blue" isSubRow={true} />
                    )}
                  </div>
                );
              }

              return (
                <MovieRow
                  key={franchiseName}
                  title={visibleTitle}
                  movies={rowMovies}
                  accent="blue"
                />
              );
            })}

            {movies.length === 0 && (
              <div style={{ textAlign: "center", padding: "100px 0", color: "rgba(255,255,255,0.5)" }}>
                No DC content found.
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
