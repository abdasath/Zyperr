"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Save, Edit2, CheckCircle2, Info, Link2,
  LayoutGrid, Star, TrendingUp, Film, User2, Users,
  Globe, Clock, Calendar, Hash, ImageIcon, Video, Ticket,
} from "lucide-react";
import { moviesApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";

const INITIAL = {
  title: "", description: "", genre: "", releaseYear: "",
  duration: "", language: "English", rating: "", thumbnailUrl: "",
  bannerUrl: "", trailerUrl: "", videoUrl: "", cast: "", director: "",
  featured: false, trending: false, showOnBanner: false, bannerOrder: 0,
  contentType: "MOVIE", totalSeasons: "", totalEpisodes: "", status: "",
};

const GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
  "Cyberpunk", "Dark Comedy", "Disaster", "Documentary", "Drama", "Epic",
  "Family", "Fantasy", "Heist", "History", "Horror", "Isekai", "Magic",
  "Martial Arts", "Mecha", "Mockumentary", "Music", "Musical", "Mystery",
  "Neo-Noir", "Noir", "Political", "Post-Apocalyptic", "Psychological",
  "Romance", "Sci-Fi", "Shonen", "Slasher", "Sports", "Spy", "Stand-up",
  "Superhero", "Supernatural", "Survival", "Suspense", "Teen", "Thriller",
  "War", "Western", "Zombie"
];

const STATUSES = ["Ongoing", "Completed", "Upcoming"];

/* ── Shared styles ─────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  width: "100%",
  height: 46,
  padding: "0 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(255,255,255,0.38)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: "28px",
  marginBottom: 18,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 16,
  fontWeight: 800,
  color: "#fff",
  letterSpacing: "-0.02em",
  marginBottom: 6,
};

const sectionSub: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.28)",
  marginBottom: 22,
};

/* ── Field wrapper ─────────────────────────────────────── */
function Field({
  label, icon, required, children,
}: {
  label: string; icon?: React.ReactNode; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          {icon && <span style={{ color: "rgba(255,255,255,0.25)" }}>{icon}</span>}
          {label}
          {required && <span style={{ color: "#e50914" }}>*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}

export default function EditMoviePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await moviesApi.getById(id);
        const m = res.data;
        setForm({
          title: m.title,
          description: m.description,
          genre: m.genre,
          releaseYear: String(m.releaseYear),
          duration: String(m.duration),
          language: m.language,
          rating: String(m.rating),
          thumbnailUrl: m.thumbnailUrl,
          bannerUrl: m.bannerUrl,
          trailerUrl: m.trailerUrl || "",
          videoUrl: m.videoUrl,
          cast: m.cast,
          director: m.director,
          featured: m.featured || false,
          trending: m.trending || false,
          showOnBanner: m.showOnBanner || false,
          bannerOrder: m.bannerOrder ?? 0,
          contentType: m.contentType || "MOVIE",
          totalSeasons: m.totalSeasons ? String(m.totalSeasons) : "",
          totalEpisodes: m.totalEpisodes ? String(m.totalEpisodes) : "",
          status: m.status || "",
        });
      } catch {
        router.push("/admin");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const toggleGenre = (g: string) => {
    setForm((prev) => {
      const list = prev.genre ? prev.genre.split(",").map((s) => s.trim()) : [];
      const exists = list.includes(g);
      return {
        ...prev,
        genre: exists ? list.filter((x) => x !== g).join(", ") : [...list, g].join(", "),
      };
    });
  };

  const activeGenres = form.genre
    ? form.genre.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await moviesApi.update(id, form);
      setSuccess(true);
      setTimeout(() => router.push("/admin"), 1600);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update. Please check all fields.");
    } finally {
      setIsLoading(false);
    }
  };

  /* focused field styles */
  const iStyle = (name: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: focused === name ? "rgba(96,165,250,0.55)" : "rgba(255,255,255,0.09)",
    background:  focused === name ? "rgba(96,165,250,0.04)" : "rgba(255,255,255,0.04)",
    boxShadow:   focused === name ? "0 0 0 3px rgba(96,165,250,0.09)" : "none",
  });

  const taStyle = (name: string): React.CSSProperties => ({
    ...iStyle(name),
    height: "auto",
    minHeight: 130,
    padding: "12px 14px",
    resize: "vertical" as const,
  });

  return (
    <AdminGuard>
      <div style={{ background: "#080809", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
        <Navbar />

        <div style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

            {/* ── Back + Title ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
              <Link
                href="/admin"
                id="edit-back"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: "rgba(255,255,255,0.3)", fontSize: 13, textDecoration: "none",
                  marginBottom: 24, transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >
                <ArrowLeft size={14} /> Back to Admin
              </Link>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.06))",
                  border: "1px solid rgba(96,165,250,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 24px rgba(96,165,250,0.14)",
                }}>
                  <Edit2 size={20} style={{ color: "#60a5fa" }} />
                </div>
                <div>
                  <h1 style={{
                    fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900,
                    color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15,
                  }}>
                    Edit Content
                  </h1>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>
                    Update the details below and save
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Alerts ── */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    marginBottom: 20, padding: "15px 20px", borderRadius: 14,
                    background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <CheckCircle2 size={17} style={{ color: "#4ade80", flexShrink: 0 }} />
                  <span style={{ color: "#4ade80", fontSize: 14, fontWeight: 500 }}>
                    Updated successfully! Redirecting to admin…
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  id="edit-error"
                  style={{
                    marginBottom: 20, padding: "14px 20px", borderRadius: 14,
                    background: "rgba(229,9,20,0.07)", border: "1px solid rgba(229,9,20,0.2)",
                    color: "#ff6b6b", fontSize: 14,
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Loading ── */}
            {fetching ? (
              <div style={{ padding: "80px 0", textAlign: "center" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  border: "2px solid rgba(96,165,250,0.3)", borderTopColor: "#60a5fa",
                  margin: "0 auto", animation: "spin 0.8s linear infinite",
                }} />
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, marginTop: 14 }}>
                  Loading content…
                </p>
              </div>
            ) : (
              <form id="edit-movie-form" onSubmit={handleSubmit}>

                {/* ── Basic Info ── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <div style={cardStyle}>
                    <p style={sectionTitle}>Basic Information</p>
                    <p style={sectionSub}>Title, description and overview</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      <Field label="Title" icon={<Film size={12} />} required>
                        <input
                          id="edit-title" name="title" type="text"
                          placeholder="e.g. Inception"
                          value={form.title} onChange={handleChange} required
                          style={iStyle("title")}
                          onFocus={() => setFocused("title")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                      <Field label="Description" icon={<Info size={12} />} required>
                        <textarea
                          id="edit-description" name="description"
                          placeholder="Write a compelling synopsis…"
                          value={form.description} onChange={handleChange} required
                          style={taStyle("description")}
                          onFocus={() => setFocused("description")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                    </div>
                  </div>
                </motion.div>

                {/* ── People ── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                  <div style={cardStyle}>
                    <p style={sectionTitle}>People</p>
                    <p style={sectionSub}>Director, cast and language</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                      <Field label="Director" icon={<User2 size={12} />} required>
                        <input
                          id="edit-director" name="director" type="text"
                          placeholder="e.g. Christopher Nolan"
                          value={form.director} onChange={handleChange} required
                          style={iStyle("director")}
                          onFocus={() => setFocused("director")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                      <Field label="Cast" icon={<Users size={12} />} required>
                        <input
                          id="edit-cast" name="cast" type="text"
                          placeholder="Actor 1, Actor 2…"
                          value={form.cast} onChange={handleChange} required
                          style={iStyle("cast")}
                          onFocus={() => setFocused("cast")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                      <Field label="Language" icon={<Globe size={12} />} required>
                        <input
                          id="edit-language" name="language" type="text"
                          placeholder="e.g. English"
                          value={form.language} onChange={handleChange} required
                          style={{ ...iStyle("language"), gridColumn: "1 / -1" }}
                          onFocus={() => setFocused("language")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                    </div>
                  </div>
                </motion.div>

                {/* ── Genre ── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
                  <div style={cardStyle}>
                    <p style={sectionTitle}>Genre</p>
                    <p style={sectionSub}>Select or type genres — multiple allowed</p>
                    <Field label="Genre tags" icon={<Hash size={12} />} required>
                      <input
                        id="edit-genre" name="genre" type="text"
                        placeholder="Select below or type manually"
                        value={form.genre} onChange={handleChange} required
                        style={iStyle("genre")}
                        onFocus={() => setFocused("genre")}
                        onBlur={() => setFocused(null)}
                      />
                    </Field>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                      {GENRES.map((g) => {
                        const on = activeGenres.includes(g);
                        return (
                          <button
                            key={g} type="button" onClick={() => toggleGenre(g)}
                            style={{
                              padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600,
                              cursor: "pointer", transition: "all 0.15s",
                              background: on ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.04)",
                              border: `1px solid ${on ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.09)"}`,
                              color: on ? "#60a5fa" : "rgba(255,255,255,0.38)",
                              transform: on ? "scale(1.03)" : "scale(1)",
                            }}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* ── Technical Details ── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
                  <div style={cardStyle}>
                    <p style={sectionTitle}>Technical Details</p>
                    <p style={sectionSub}>Year, duration and rating</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
                      <Field label="Release Year" icon={<Calendar size={12} />} required>
                        <input
                          id="edit-year" name="releaseYear" type="number"
                          placeholder="e.g. 2024" min="1900" max="2100"
                          value={form.releaseYear} onChange={handleChange} required
                          style={iStyle("releaseYear")}
                          onFocus={() => setFocused("releaseYear")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                      <Field label="Duration (min)" icon={<Clock size={12} />} required>
                        <input
                          id="edit-duration" name="duration" type="number"
                          placeholder="e.g. 120" min="1"
                          value={form.duration} onChange={handleChange} required
                          style={iStyle("duration")}
                          onFocus={() => setFocused("duration")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                      <Field label="Rating (0–10)" icon={<Star size={12} />} required>
                        <input
                          id="edit-rating" name="rating" type="number"
                          placeholder="e.g. 8.5" min="0" max="10" step="0.1"
                          value={form.rating} onChange={handleChange} required
                          style={iStyle("rating")}
                          onFocus={() => setFocused("rating")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                      {(form.contentType === "WEB_SERIES" || form.contentType === "ANIME") && (
                        <>
                          <Field label="Total Seasons" icon={<Hash size={12} />}>
                            <input
                              id="edit-totalSeasons" name="totalSeasons" type="number"
                              placeholder="e.g. 4" min="1"
                              value={form.totalSeasons} onChange={handleChange}
                              style={iStyle("totalSeasons")}
                              onFocus={() => setFocused("totalSeasons")}
                              onBlur={() => setFocused(null)}
                            />
                          </Field>
                          <Field label="Total Episodes" icon={<Hash size={12} />}>
                            <input
                              id="edit-totalEpisodes" name="totalEpisodes" type="number"
                              placeholder="e.g. 94" min="1"
                              value={form.totalEpisodes} onChange={handleChange}
                              style={iStyle("totalEpisodes")}
                              onFocus={() => setFocused("totalEpisodes")}
                              onBlur={() => setFocused(null)}
                            />
                          </Field>
                          <Field label="Status" icon={<Ticket size={12} />}>
                            <select
                              id="edit-status" name="status"
                              value={form.status} onChange={handleChange}
                              style={{ ...iStyle("status"), appearance: "none" as any }}
                              onFocus={() => setFocused("status")}
                              onBlur={() => setFocused(null)}
                            >
                              <option value="">Select status</option>
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </Field>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* ── Media URLs ── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
                  <div style={cardStyle}>
                    <p style={sectionTitle}>Media URLs</p>
                    <p style={sectionSub}>Paste direct links to images and video files</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                      <Field label="Thumbnail URL" icon={<ImageIcon size={12} />} required>
                        <input
                          id="edit-thumbnail" name="thumbnailUrl" type="url"
                          placeholder="https://…/poster.jpg"
                          value={form.thumbnailUrl} onChange={handleChange} required
                          style={iStyle("thumbnailUrl")}
                          onFocus={() => setFocused("thumbnailUrl")}
                          onBlur={() => setFocused(null)}
                        />
                        {form.thumbnailUrl && (
                          <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", width: 72, height: 100, border: "1px solid rgba(255,255,255,0.09)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={form.thumbnailUrl} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                        )}
                      </Field>
                      <Field label="Banner URL" icon={<ImageIcon size={12} />} required>
                        <input
                          id="edit-banner" name="bannerUrl" type="url"
                          placeholder="https://…/banner.jpg"
                          value={form.bannerUrl} onChange={handleChange} required
                          style={iStyle("bannerUrl")}
                          onFocus={() => setFocused("bannerUrl")}
                          onBlur={() => setFocused(null)}
                        />
                        {form.bannerUrl && (
                          <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", height: 52, border: "1px solid rgba(255,255,255,0.09)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={form.bannerUrl} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                        )}
                      </Field>
                      <Field label="Video URL" icon={<Video size={12} />} required>
                        <input
                          id="edit-video" name="videoUrl" type="url"
                          placeholder="https://…/video.mp4"
                          value={form.videoUrl} onChange={handleChange} required
                          style={iStyle("videoUrl")}
                          onFocus={() => setFocused("videoUrl")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                      <Field label="Trailer URL (optional)" icon={<Video size={12} />}>
                        <input
                          id="edit-trailer" name="trailerUrl" type="url"
                          placeholder="https://youtube.com/…"
                          value={form.trailerUrl} onChange={handleChange}
                          style={iStyle("trailerUrl")}
                          onFocus={() => setFocused("trailerUrl")}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>
                    </div>
                  </div>
                </motion.div>

                {/* ── Display Options ── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div style={cardStyle}>
                    <p style={sectionTitle}>Display Options</p>
                    <p style={sectionSub}>Control where this content appears on Zyperr</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {[
                        { id: "showOnBanner", label: "Show on Banner", desc: "Shown in the top hero carousel", icon: <Film size={20} />,       color: "#f43f5e", glow: "rgba(244,63,94,0.1)" },
                        { id: "featured",     label: "Featured",       desc: "Shown in the Featured row",            icon: <Star size={20} />,       color: "#fbbf24", glow: "rgba(251,191,36,0.1)" },
                        { id: "trending",     label: "Trending Now",   desc: "Shown in the Trending Now row",        icon: <TrendingUp size={20} />, color: "#34d399", glow: "rgba(52,211,153,0.1)" },
                      ].map(({ id: fId, label, desc, icon, color, glow }) => {
                        const on = (form as any)[fId];
                        return (
                          <label
                            key={fId}
                            htmlFor={`edit-${fId}`}
                            style={{
                              display: "flex", alignItems: "flex-start", gap: 16,
                              padding: "20px", borderRadius: 16, cursor: "pointer",
                              background: on ? glow : "rgba(255,255,255,0.03)",
                              border: `1.5px solid ${on ? color + "40" : "rgba(255,255,255,0.08)"}`,
                              transition: "all 0.2s",
                            }}
                          >
                            <div style={{
                              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                              background: on ? `${color}1a` : "rgba(255,255,255,0.05)",
                              border: `1px solid ${on ? color + "30" : "rgba(255,255,255,0.08)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: on ? color : "rgba(255,255,255,0.2)", transition: "all 0.2s",
                            }}>
                              {icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                <p style={{ color: on ? "#fff" : "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 15 }}>{label}</p>
                                {/* custom toggle */}
                                <div style={{
                                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                  background: on ? color : "rgba(255,255,255,0.08)",
                                  border: `1.5px solid ${on ? color : "rgba(255,255,255,0.14)"}`,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  transition: "all 0.2s",
                                }}>
                                  {on && <CheckCircle2 size={12} color="#000" strokeWidth={3} />}
                                </div>
                              </div>
                              <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>{desc}</p>
                            </div>
                            <input
                              type="checkbox" name={fId} id={`edit-${fId}`}
                              checked={on} onChange={handleChange}
                              style={{ display: "none" }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* ── Submit bar ── */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12,
                    padding: "20px 24px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 18,
                  }}
                >
                  <Link
                    href="/admin"
                    id="edit-cancel"
                    style={{
                      padding: "11px 24px", borderRadius: 12, textDecoration: "none",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: 500,
                    }}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading || success}
                    id="edit-movie-submit"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 9,
                      padding: "12px 30px", borderRadius: 12, border: "none",
                      cursor: isLoading || success ? "not-allowed" : "pointer",
                      background: isLoading || success
                        ? "rgba(96,165,250,0.4)"
                        : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      color: "#fff", fontSize: 15, fontWeight: 700,
                      boxShadow: isLoading || success ? "none" : "0 6px 22px rgba(59,130,246,0.38)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { if (!isLoading && !success) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(59,130,246,0.5)"; } }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = isLoading || success ? "none" : "0 6px 22px rgba(59,130,246,0.38)"; }}
                  >
                    {isLoading ? (
                      <>
                        <span style={{
                          width: 16, height: 16, borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
                          animation: "spin 0.7s linear infinite", display: "inline-block",
                        }} />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </motion.div>

              </form>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
