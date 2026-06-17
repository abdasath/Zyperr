"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Film, Search, Shield, TrendingUp, Star, Eye,
  BarChart3, Clapperboard, Tv2, Swords, Grid3x3, X,
} from "lucide-react";
import { moviesApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";

interface Movie {
  id: string;
  title: string;
  genre: string;
  contentType?: "MOVIE" | "WEB_SERIES" | "ANIME";
  releaseYear: number;
  rating: number;
  duration: number;
  thumbnailUrl: string;
  featured: boolean;
  trending: boolean;
  createdAt?: string;
}

const TYPE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  MOVIE:      { label: "Movie",  color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  WEB_SERIES: { label: "Series", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  ANIME:      { label: "Anime",  color: "#c084fc", bg: "rgba(192,132,252,0.1)" },
};

export default function AdminPage() {
  const { user } = useAuthStore();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await moviesApi.getAll({ limit: 10000 });
      setMovies(res.data.movies || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }
    setDeleting(id);
    try {
      await moviesApi.delete(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      setDeleteConfirm(null);
    } catch {}
    setDeleting(null);
  };

  const filtered = movies.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "ALL" || (m.contentType ?? "MOVIE") === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total:    movies.length,
    movies:   movies.filter((m) => !m.contentType || m.contentType === "MOVIE").length,
    series:   movies.filter((m) => m.contentType === "WEB_SERIES").length,
    anime:    movies.filter((m) => m.contentType === "ANIME").length,
    featured: movies.filter((m) => m.featured).length,
    trending: movies.filter((m) => m.trending).length,
    avgRating: movies.length > 0
      ? (movies.reduce((s, m) => s + m.rating, 0) / movies.length).toFixed(1)
      : "—",
  };

  const statCards = [
    { label: "Total Content", value: stats.total,     icon: <Grid3x3 size={17} />,      color: "#e50914", glow: "rgba(229,9,20,0.22)" },
    { label: "Movies",        value: stats.movies,    icon: <Clapperboard size={17} />,  color: "#f87171", glow: "rgba(248,113,113,0.18)" },
    { label: "Web Series",    value: stats.series,    icon: <Tv2 size={17} />,            color: "#60a5fa", glow: "rgba(96,165,250,0.18)" },
    { label: "Anime",         value: stats.anime,     icon: <Swords size={17} />,         color: "#c084fc", glow: "rgba(192,132,252,0.18)" },
    { label: "Featured",      value: stats.featured,  icon: <Star size={17} />,           color: "#fbbf24", glow: "rgba(251,191,36,0.18)" },
    { label: "Trending",      value: stats.trending,  icon: <TrendingUp size={17} />,     color: "#34d399", glow: "rgba(52,211,153,0.18)" },
    { label: "Avg Rating",    value: stats.avgRating, icon: <BarChart3 size={17} />,      color: "#a78bfa", glow: "rgba(167,139,250,0.18)" },
  ];

  return (
    <AdminGuard>
      <div style={{ background: "#080809", minHeight: "100vh" }}>
        <Navbar />

        <div style={{ paddingTop: "70px", minHeight: "100vh" }}>
          <main style={{ padding: "40px 48px 60px", maxWidth: 1400, margin: "0 auto" }}>

            {/* ── Page Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 40,
              }}
            >
              <div>
                {/* Badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 30, marginBottom: 10,
                  background: "linear-gradient(135deg, rgba(229,9,20,0.15), rgba(229,9,20,0.06))",
                  border: "1px solid rgba(229,9,20,0.25)",
                }}>
                  <Shield size={12} style={{ color: "#ff5561" }} />
                  <span style={{ fontSize: 11, color: "#ff5561", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em" }}>
                    Admin Panel
                  </span>
                </div>
                <h1 style={{
                  fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900,
                  color: "#fff", letterSpacing: "-0.035em", lineHeight: 1.1,
                }}>
                  Content Management
                </h1>
                <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 13, marginTop: 5 }}>
                  {movies.length} titles · {user?.email}
                </p>
              </div>

              <Link
                href="/admin/movies/add"
                id="admin-add-movie"
                style={{
                  position: "fixed",
                  bottom: 40,
                  right: 48,
                  zIndex: 50,
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "16px 30px", borderRadius: 100,
                  background: "linear-gradient(135deg, #e50914, #c0050f)",
                  color: "#fff", fontSize: 15, fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 12px 36px rgba(229,9,20,0.45)",
                  letterSpacing: "0.01em",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.02)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 42px rgba(229,9,20,0.55)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(229,9,20,0.45)"; }}
              >
                <Plus size={16} />
                Add Content
              </Link>
            </motion.div>

            {/* ── Stat Cards ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                justifyContent: "center",
                paddingBottom: 40,
              }}
            >
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.09 + i * 0.05 }}
                  id={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    padding: "22px 20px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                    width: 152,
                    flexShrink: 0,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  whileHover={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: `${s.color}30`,
                    y: -2,
                  }}
                >
                  {/* glow blob */}
                  <div style={{
                    position: "absolute", top: -14, right: -14,
                    width: 70, height: 70, borderRadius: "50%",
                    background: s.glow, filter: "blur(22px)", pointerEvents: "none",
                  }} />
                  {/* icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 11, marginBottom: 16,
                    background: `${s.color}16`,
                    border: `1px solid ${s.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.color,
                  }}>
                    {s.icon}
                  </div>
                  <p style={{
                    fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900,
                    color: "#fff", lineHeight: 1, letterSpacing: "-0.03em",
                  }}>
                    {s.value}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 12, marginTop: 5, fontWeight: 500 }}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Divider ── */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
              marginBottom: 32,
            }} />

            {/* ── Content Table ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              style={{
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
                overflow: "hidden",
              }}
            >
              {/* Toolbar */}
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: 12,
                  padding: "18px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                    All Content
                  </h2>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: "rgba(229,9,20,0.14)", color: "#ff5561",
                    border: "1px solid rgba(229,9,20,0.25)",
                  }}>
                    {filtered.length}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Type pills */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {[
                      { key: "ALL",        label: "All" },
                      { key: "MOVIE",      label: "Movies" },
                      { key: "WEB_SERIES", label: "Series" },
                      { key: "ANIME",      label: "Anime" },
                    ].map(({ key, label }) => {
                      const active = typeFilter === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setTypeFilter(key)}
                          style={{
                            fontSize: 12, fontWeight: 600, padding: "5px 14px",
                            borderRadius: 20, cursor: "pointer",
                            background: active ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.04)",
                            color: active ? "#ff5561" : "rgba(255,255,255,0.4)",
                            border: active ? "1px solid rgba(229,9,20,0.3)" : "1px solid rgba(255,255,255,0.08)",
                            transition: "all 0.15s",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search */}
                  <div style={{ position: "relative", marginLeft: 4 }}>
                    <Search size={13} style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      color: "rgba(255,255,255,0.22)", pointerEvents: "none",
                    }} />
                    <input
                      id="admin-search"
                      type="text"
                      placeholder="Search…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: 210, height: 37,
                        paddingLeft: 34, paddingRight: searchQuery ? 32 : 14,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 11, color: "#fff", fontSize: 13,
                        fontFamily: "var(--font-body)", outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(229,9,20,0.4)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        style={{
                          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                          background: "none", border: "none",
                          color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 2,
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Table body */}
              {loading ? (
                <div style={{ padding: "70px 0", textAlign: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "2px solid rgba(229,9,20,0.3)",
                    borderTopColor: "#e50914",
                    margin: "0 auto",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 13, marginTop: 14 }}>
                    Loading content…
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: "70px 0", textAlign: "center" }}>
                  <Film size={40} style={{ color: "rgba(255,255,255,0.07)", margin: "0 auto 14px", display: "block" }} />
                  <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 14 }}>
                    {searchQuery ? `No results for "${searchQuery}"` : "No content yet — add your first title!"}
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {["Title", "Type", "Genre", "Year", "Rating", "Status", "Actions"].map((h) => (
                          <th
                            key={h}
                            className={
                              h === "Genre" || h === "Year" ? "hidden md:table-cell" :
                              h === "Rating" || h === "Status" ? "hidden lg:table-cell" :
                              ""
                            }
                            style={{
                              padding: "13px 20px", textAlign: "left",
                              fontSize: 10, fontWeight: 700, letterSpacing: "0.09em",
                              textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
                              background: "rgba(255,255,255,0.015)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((movie, idx) => {
                        const type = movie.contentType ?? "MOVIE";
                        const typeInfo = TYPE_MAP[type] ?? TYPE_MAP.MOVIE;
                        const isDeleting = deleting === movie.id;
                        const isConfirm = deleteConfirm === movie.id;

                        return (
                          <motion.tr
                            key={movie.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            id={`admin-row-${movie.id}`}
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {/* Title */}
                            <td style={{ padding: "14px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                  width: 44, height: 60, borderRadius: 9, overflow: "hidden",
                                  background: "#111", flexShrink: 0,
                                  border: "1px solid rgba(255,255,255,0.07)",
                                }}>
                                  <Image
                                    src={movie.thumbnailUrl}
                                    alt={movie.title}
                                    width={44} height={60}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    unoptimized
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                  />
                                </div>
                                <div>
                                  <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                                    {movie.title}
                                  </p>
                                  <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 12, marginTop: 3 }}>
                                    {movie.duration}m
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Type */}
                            <td style={{ padding: "14px 20px" }}>
                              <span style={{
                                fontSize: 11, fontWeight: 700, padding: "4px 11px", borderRadius: 20,
                                background: typeInfo.bg, color: typeInfo.color,
                                border: `1px solid ${typeInfo.color}30`,
                                letterSpacing: "0.02em", whiteSpace: "nowrap",
                              }}>
                                {typeInfo.label}
                              </span>
                            </td>

                            {/* Genre */}
                            <td className="hidden md:table-cell" style={{ padding: "14px 20px" }}>
                              <span style={{
                                fontSize: 11, fontWeight: 500, padding: "4px 11px", borderRadius: 20,
                                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)",
                                border: "1px solid rgba(255,255,255,0.08)",
                              }}>
                                {movie.genre.split(",")[0].trim()}
                              </span>
                            </td>

                            {/* Year */}
                            <td className="hidden md:table-cell" style={{ padding: "14px 20px", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500 }}>
                              {movie.releaseYear}
                            </td>

                            {/* Rating */}
                            <td className="hidden lg:table-cell" style={{ padding: "14px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>
                                  {movie.rating.toFixed(1)}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="hidden lg:table-cell" style={{ padding: "14px 20px" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{
                                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                                    background: movie.featured ? "#22c55e" : "rgba(255,255,255,0.12)",
                                    boxShadow: movie.featured ? "0 0 6px rgba(34,197,94,0.6)" : "none",
                                  }} />
                                  <span style={{ fontSize: 12, fontWeight: 500, color: movie.featured ? "#4ade80" : "rgba(255,255,255,0.2)" }}>
                                    Featured
                                  </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{
                                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                                    background: movie.trending ? "#fbbf24" : "rgba(255,255,255,0.12)",
                                    boxShadow: movie.trending ? "0 0 6px rgba(251,191,36,0.6)" : "none",
                                  }} />
                                  <span style={{ fontSize: 12, fontWeight: 500, color: movie.trending ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>
                                    Trending
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: "14px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {/* View */}
                                <Link
                                  href={`/movies/${movie.id}`}
                                  id={`view-${movie.id}`}
                                  title="View"
                                  style={{
                                    width: 32, height: 32, borderRadius: 9,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                                    color: "rgba(255,255,255,0.45)", textDecoration: "none",
                                    transition: "all 0.15s",
                                  }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                                >
                                  <Eye size={13} />
                                </Link>
                                {/* Edit */}
                                <Link
                                  href={`/admin/movies/edit/${movie.id}`}
                                  id={`edit-${movie.id}`}
                                  title="Edit"
                                  style={{
                                    width: 32, height: 32, borderRadius: 9,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)",
                                    color: "#60a5fa", textDecoration: "none",
                                    transition: "all 0.15s",
                                  }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.2)"; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.08)"; }}
                                >
                                  <Edit size={13} />
                                </Link>
                                {/* Delete */}
                                <button
                                  onClick={() => handleDelete(movie.id)}
                                  disabled={isDeleting}
                                  id={`delete-${movie.id}`}
                                  title={isConfirm ? "Click again to confirm" : "Delete"}
                                  style={{
                                    minWidth: 32, height: 32,
                                    padding: isConfirm ? "0 12px" : "0",
                                    borderRadius: 9, display: "flex",
                                    alignItems: "center", justifyContent: "center", gap: 5,
                                    background: isConfirm ? "rgba(229,9,20,0.22)" : "rgba(229,9,20,0.08)",
                                    border: `1px solid ${isConfirm ? "rgba(229,9,20,0.45)" : "rgba(229,9,20,0.2)"}`,
                                    color: "#ff5561", cursor: isDeleting ? "not-allowed" : "pointer",
                                    fontSize: 11, fontWeight: 700,
                                    transition: "all 0.15s", whiteSpace: "nowrap",
                                  }}
                                  onMouseEnter={(e) => { if (!isDeleting) (e.currentTarget as HTMLElement).style.background = "rgba(229,9,20,0.2)"; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isConfirm ? "rgba(229,9,20,0.22)" : "rgba(229,9,20,0.08)"; }}
                                >
                                  {isDeleting ? (
                                    <span style={{
                                      width: 12, height: 12, borderRadius: "50%",
                                      border: "1.5px solid #ff5561", borderTopColor: "transparent",
                                      animation: "spin 0.7s linear infinite", display: "inline-block",
                                    }} />
                                  ) : isConfirm ? (
                                    <><Trash2 size={12} /> Confirm</>
                                  ) : (
                                    <Trash2 size={13} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
