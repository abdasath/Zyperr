"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Film, Save, Plus, Tv2, Swords, CheckCircle2,
  Info, Link2, LayoutGrid, Star, TrendingUp, ChevronRight,
  Clapperboard, Globe, Clock, Calendar, Users, User2,
  Building2, Hash, Image as ImageIcon, Video, Ticket,
} from "lucide-react";
import { moviesApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";

interface MovieForm {
  title: string;
  description: string;
  genre: string;
  contentType: "MOVIE" | "WEB_SERIES" | "ANIME";
  releaseYear: string;
  duration: string;
  language: string;
  rating: string;
  thumbnailUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  teaserUrl: string;
  videoUrl: string;
  cast: string;
  director: string;
  studio: string;
  franchise: string;
  totalSeasons: string;
  totalEpisodes: string;
  status: string;
  featured: boolean;
  trending: boolean;
  showOnBanner: boolean;
  bannerOrder: number;
}

const INITIAL: MovieForm = {
  title: "", description: "", genre: "", contentType: "MOVIE", releaseYear: "",
  duration: "", language: "English", rating: "", thumbnailUrl: "",
  bannerUrl: "", trailerUrl: "", teaserUrl: "", videoUrl: "", cast: "", director: "",
  studio: "", franchise: "", totalSeasons: "", totalEpisodes: "", status: "",
  featured: false, trending: false, showOnBanner: false, bannerOrder: 0,
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

const STEPS = [
  { id: "type",    label: "Type",       icon: <Clapperboard size={15} /> },
  { id: "basic",   label: "Details",    icon: <Info size={15} /> },
  { id: "media",   label: "Media",      icon: <Link2 size={15} /> },
  { id: "display", label: "Display",    icon: <LayoutGrid size={15} /> },
];

// ── Shared input styles ──────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
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
  transition: "border-color 0.2s, background 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(255,255,255,0.45)",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 8,
};

const sectionCardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: "28px 28px",
  marginBottom: 20,
};

// ── Field component ──────────────────────────────────────────────────────────
function Field({
  label, icon, required = false, children,
}: {
  label: string; icon?: React.ReactNode; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {icon && <span style={{ color: "rgba(255,255,255,0.3)" }}>{icon}</span>}
          {label}
          {required && <span style={{ color: "#e50914", marginLeft: 2 }}>*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}

export default function AddMoviePage() {
  const router = useRouter();
  const [form, setForm] = useState<MovieForm>(INITIAL);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [existingFranchises, setExistingFranchises] = useState<string[]>([]);

  useEffect(() => {
    moviesApi.getAll({ limit: 10000 }).then(res => {
      const all = res.data.movies || [];
      const uniques = Array.from(new Set(all.map((m: any) => m.franchise).filter(Boolean)));
      setExistingFranchises(uniques as string[]);
    }).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const toggleGenre = (g: string) => {
    setForm((prev) => {
      const genres = prev.genre ? prev.genre.split(",").map((s) => s.trim()) : [];
      const exists = genres.includes(g);
      const updated = exists ? genres.filter((x) => x !== g) : [...genres, g];
      return { ...prev, genre: updated.join(", ") };
    });
  };

  const activeGenres = form.genre ? form.genre.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const payload = { ...form, rating: form.rating === "-" ? 0 : Number(form.rating) };
      await moviesApi.create(payload);
      setSuccess(true);
      setTimeout(() => router.push("/admin"), 1800);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add content. Please check all fields.");
    } finally {
      setIsLoading(false);
    }
  };

  const iStyle = (name: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === name ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.1)",
    background: focusedField === name ? "rgba(229,9,20,0.04)" : "rgba(255,255,255,0.04)",
    boxShadow: focusedField === name ? "0 0 0 3px rgba(229,9,20,0.08)" : "none",
  });

  const taStyle = (name: string): React.CSSProperties => ({
    ...iStyle(name),
    height: "auto",
    minHeight: 120,
    padding: "12px 14px",
    resize: "vertical" as const,
  });

  const contentTypes = [
    { value: "MOVIE",      label: "Movie",      sub: "Feature films & shorts",  icon: <Film size={22} />,        color: "#e50914", glow: "rgba(229,9,20,0.15)" },
    { value: "WEB_SERIES", label: "Web Series", sub: "TV shows & miniseries",   icon: <Tv2 size={22} />,         color: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
    { value: "ANIME",      label: "Anime",      sub: "Japanese animation",       icon: <Swords size={22} />,      color: "#a78bfa", glow: "rgba(167,139,250,0.15)" },
  ];

  return (
    <AdminGuard>
      <div style={{ background: "#080809", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
        <Navbar />

        <div style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

            {/* ── Back link + Title ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
              <Link
                href="/admin"
                id="add-movie-back"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: "rgba(255,255,255,0.35)", fontSize: 13, textDecoration: "none",
                  marginBottom: 24, transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                <ArrowLeft size={14} /> Back to Admin
              </Link>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(229,9,20,0.2), rgba(229,9,20,0.06))",
                  border: "1px solid rgba(229,9,20,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 24px rgba(229,9,20,0.15)",
                }}>
                  <Plus size={20} style={{ color: "#e50914" }} />
                </div>
                <div>
                  <h1 style={{
                    fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900,
                    color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15,
                  }}>
                    Add New Content
                  </h1>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                    Fill in the details to publish to Zyperr
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Step indicator ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              style={{ display: "flex", gap: 8, marginBottom: 32 }}
            >
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <button
                    key={s.id}
                    onClick={() => i <= step && setStep(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "8px 16px", borderRadius: 30, border: "none", cursor: i <= step ? "pointer" : "default",
                      background: active
                        ? "linear-gradient(135deg, rgba(229,9,20,0.2), rgba(229,9,20,0.08))"
                        : done ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)",
                      borderWidth: 1, borderStyle: "solid",
                      borderColor: active ? "rgba(229,9,20,0.4)" : done ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)",
                      color: active ? "#ff5561" : done ? "#4ade80" : "rgba(255,255,255,0.3)",
                      fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                    }}
                  >
                    {done ? <CheckCircle2 size={14} /> : s.icon}
                    {s.label}
                  </button>
                );
              })}
            </motion.div>

            {/* ── Success banner ── */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{
                    marginBottom: 24, padding: "16px 20px", borderRadius: 14,
                    background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: "#4ade80", flexShrink: 0 }} />
                  <span style={{ color: "#4ade80", fontSize: 14, fontWeight: 500 }}>
                    Content added successfully! Redirecting to admin…
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  id="add-movie-error"
                  style={{
                    marginBottom: 24, padding: "14px 20px", borderRadius: 14,
                    background: "rgba(229,9,20,0.07)", border: "1px solid rgba(229,9,20,0.2)",
                    color: "#ff6b6b", fontSize: 14,
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ── */}
            <form id="add-movie-form" onSubmit={handleSubmit}>

              {/* STEP 0 — Content Type */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={sectionCardStyle}>
                    <div style={{ marginBottom: 24 }}>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                        What are you adding?
                      </h2>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                        Select the content type to get started
                      </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                      {contentTypes.map((ct) => {
                        const active = form.contentType === ct.value;
                        return (
                          <button
                            key={ct.value}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, contentType: ct.value as any }))}
                            style={{
                              padding: "24px 20px", borderRadius: 16, border: "none", cursor: "pointer",
                              background: active ? ct.glow : "rgba(255,255,255,0.03)",
                              borderWidth: 1.5, borderStyle: "solid",
                              borderColor: active ? ct.color : "rgba(255,255,255,0.08)",
                              textAlign: "left", transition: "all 0.2s",
                              boxShadow: active ? `0 4px 24px ${ct.glow}` : "none",
                            }}
                          >
                            <div style={{
                              width: 46, height: 46, borderRadius: 12, marginBottom: 14,
                              background: `${ct.color}20`, border: `1px solid ${ct.color}30`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: ct.color,
                            }}>
                              {ct.icon}
                            </div>
                            <p style={{ fontSize: 16, fontWeight: 700, color: active ? "#fff" : "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                              {ct.label}
                            </p>
                            <p style={{ fontSize: 12, color: active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}>
                              {ct.sub}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer",
                        background: "linear-gradient(135deg, #e50914, #c0050f)",
                        color: "#fff", fontSize: 15, fontWeight: 600,
                        boxShadow: "0 6px 20px rgba(229,9,20,0.35)",
                        transition: "box-shadow 0.2s, transform 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(229,9,20,0.45)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(229,9,20,0.35)"; }}
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1 — Basic Details */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

                  {/* Title & Description */}
                  <div style={sectionCardStyle}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 22, letterSpacing: "-0.02em" }}>
                      Basic Information
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      <Field label="Title" icon={<Film size={13} />} required>
                        <input
                          id="title" name="title" type="text"
                          placeholder={form.contentType === "MOVIE" ? "e.g. Inception" : form.contentType === "WEB_SERIES" ? "e.g. Breaking Bad" : "e.g. Demon Slayer"}
                          value={form.title} onChange={handleChange} required
                          style={iStyle("title")}
                          onFocus={() => setFocusedField("title")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                      <Field label="Description" icon={<Info size={13} />} required>
                        <textarea
                          id="description" name="description"
                          placeholder="Write a compelling synopsis…"
                          value={form.description} onChange={handleChange} required
                          style={taStyle("description")}
                          onFocus={() => setFocusedField("description")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* People */}
                  <div style={sectionCardStyle}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 22, letterSpacing: "-0.02em" }}>
                      People
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                      <Field label={form.contentType === "WEB_SERIES" ? "Creator" : "Director"} icon={<User2 size={13} />} required>
                        <input
                          id="director" name="director" type="text"
                          placeholder="e.g. Christopher Nolan"
                          value={form.director} onChange={handleChange} required
                          style={iStyle("director")}
                          onFocus={() => setFocusedField("director")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                      <Field label="Cast" icon={<Users size={13} />} required>
                        <input
                          id="cast" name="cast" type="text"
                          placeholder="Actor 1, Actor 2…"
                          value={form.cast} onChange={handleChange} required
                          style={iStyle("cast")}
                          onFocus={() => setFocusedField("cast")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                        <Field label="Studio" icon={<Building2 size={13} />}>
                          <input
                            id="studio" name="studio" type="text"
                            placeholder="e.g. MAPPA, Warner Bros"
                            value={form.studio} onChange={handleChange}
                            style={iStyle("studio")}
                            onFocus={() => setFocusedField("studio")}
                            onBlur={() => setFocusedField(null)}
                          />
                        </Field>
                      <Field label="Language" icon={<Globe size={13} />} required>
                        <input
                          id="language" name="language" type="text"
                          placeholder="e.g. English"
                          value={form.language} onChange={handleChange} required
                          style={iStyle("language")}
                          onFocus={() => setFocusedField("language")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                      <Field label="Universe/Franchise" icon={<Building2 size={13} />}>
                        <input
                          id="franchise" name="franchise" type="text"
                          list="franchise-list"
                          placeholder="e.g. Marvel: MCU: Phase One"
                          value={form.franchise} onChange={handleChange}
                          style={iStyle("franchise")}
                          onFocus={() => setFocusedField("franchise")}
                          onBlur={() => setFocusedField(null)}
                        />
                        <datalist id="franchise-list">
                          {existingFranchises.map(f => <option key={f} value={f} />)}
                        </datalist>
                      </Field>
                    </div>
                  </div>

                  {/* Genre */}
                  <div style={sectionCardStyle}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 22, letterSpacing: "-0.02em" }}>
                      Genre
                    </h2>
                    <Field label="Genre tags" icon={<Hash size={13} />} required>
                      <input
                        id="genre" name="genre" type="text"
                        placeholder="Select below or type manually"
                        value={form.genre} onChange={handleChange} required
                        style={iStyle("genre")}
                        onFocus={() => setFocusedField("genre")}
                        onBlur={() => setFocusedField(null)}
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
                              border: "1px solid", cursor: "pointer", transition: "all 0.15s",
                              background: on ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.04)",
                              borderColor: on ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.09)",
                              color: on ? "#ff5561" : "rgba(255,255,255,0.4)",
                              transform: on ? "scale(1.03)" : "scale(1)",
                            }}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div style={sectionCardStyle}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 22, letterSpacing: "-0.02em" }}>
                      {form.contentType === "MOVIE" ? "Movie Details" : "Series Details"}
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
                      <Field label="Release Year" icon={<Calendar size={13} />} required>
                        <input
                          id="releaseYear" name="releaseYear" type="number"
                          placeholder="e.g. 2024" min="1900" max="2100"
                          value={form.releaseYear} onChange={handleChange} required
                          style={iStyle("releaseYear")}
                          onFocus={() => setFocusedField("releaseYear")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                      <Field label={form.contentType === "MOVIE" ? "Duration (min)" : "Avg. Ep. Duration (min)"} icon={<Clock size={13} />} required>
                        <input
                          id="duration" name="duration" type="number"
                          placeholder="e.g. 120" min="1"
                          value={form.duration} onChange={handleChange} required
                          style={iStyle("duration")}
                          onFocus={() => setFocusedField("duration")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                      <Field label="Rating (0–10)" icon={<Star size={13} />} required>
                        <input
                          id="rating" name="rating" type="text"
                          placeholder="e.g. 8.5 or -"
                          value={form.rating} onChange={handleChange} required
                          style={iStyle("rating")}
                          onFocus={() => setFocusedField("rating")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                      {(form.contentType === "WEB_SERIES" || form.contentType === "ANIME") && (
                        <>
                          <Field label="Total Seasons" icon={<Hash size={13} />}>
                            <input
                              id="totalSeasons" name="totalSeasons" type="number"
                              placeholder="e.g. 4" min="1"
                              value={form.totalSeasons} onChange={handleChange}
                              style={iStyle("totalSeasons")}
                              onFocus={() => setFocusedField("totalSeasons")}
                              onBlur={() => setFocusedField(null)}
                            />
                          </Field>
                          <Field label="Total Episodes" icon={<Hash size={13} />}>
                            <input
                              id="totalEpisodes" name="totalEpisodes" type="number"
                              placeholder="e.g. 94" min="1"
                              value={form.totalEpisodes} onChange={handleChange}
                              style={iStyle("totalEpisodes")}
                              onFocus={() => setFocusedField("totalEpisodes")}
                              onBlur={() => setFocusedField(null)}
                            />
                          </Field>
                        </>
                      )}
                      <Field label="Status" icon={<Ticket size={13} />}>
                        <select
                          id="status" name="status"
                          value={form.status} onChange={handleChange}
                          style={{ ...iStyle("status"), appearance: "none" as any }}
                          onFocus={() => setFocusedField("status")}
                          onBlur={() => setFocusedField(null)}
                        >
                          <option value="">Select status</option>
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button type="button" onClick={() => setStep(0)} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #e50914, #c0050f)", color: "#fff", fontSize: 15, fontWeight: 600, boxShadow: "0 6px 20px rgba(229,9,20,0.35)" }}
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Media URLs */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={sectionCardStyle}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>
                      Media URLs
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>
                      Paste direct links to your media files
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                      <Field label="Thumbnail URL" icon={<ImageIcon size={13} />} required>
                        <input
                          id="thumbnailUrl" name="thumbnailUrl" type="url"
                          placeholder="https://…/poster.jpg"
                          value={form.thumbnailUrl} onChange={handleChange} required
                          style={iStyle("thumbnailUrl")}
                          onFocus={() => setFocusedField("thumbnailUrl")}
                          onBlur={() => setFocusedField(null)}
                        />
                        {form.thumbnailUrl && (
                          <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", width: 80, height: 110, border: "1px solid rgba(255,255,255,0.1)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={form.thumbnailUrl} alt="thumb preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                        )}
                      </Field>
                      <Field label="Banner URL" icon={<ImageIcon size={13} />} required>
                        <input
                          id="bannerUrl" name="bannerUrl" type="url"
                          placeholder="https://…/banner.jpg"
                          value={form.bannerUrl} onChange={handleChange} required
                          style={iStyle("bannerUrl")}
                          onFocus={() => setFocusedField("bannerUrl")}
                          onBlur={() => setFocusedField(null)}
                        />
                        {form.bannerUrl && (
                          <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", height: 56, border: "1px solid rgba(255,255,255,0.1)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={form.bannerUrl} alt="banner preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                        )}
                      </Field>
                      <Field label="Video URL (optional)" icon={<Video size={13} />}>
                        <input
                          id="videoUrl" name="videoUrl" type="url"
                          placeholder="https://…/video.mp4"
                          value={form.videoUrl} onChange={handleChange}
                          style={iStyle("videoUrl")}
                          onFocus={() => setFocusedField("videoUrl")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                      <Field label="Trailer URL (optional)" icon={<Video size={13} />}>
                        <input
                          id="trailerUrl" name="trailerUrl" type="url"
                          placeholder="https://youtube.com/…"
                          value={form.trailerUrl} onChange={handleChange}
                          style={iStyle("trailerUrl")}
                          onFocus={() => setFocusedField("trailerUrl")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </Field>
                      <Field label="Teaser URL — Banner only (optional)" icon={<Ticket size={13} />}>
                        <input
                          id="teaserUrl" name="teaserUrl" type="url"
                          placeholder="https://youtube.com/… (short teaser for hero banner)"
                          value={form.teaserUrl} onChange={handleChange}
                          style={iStyle("teaserUrl")}
                          onFocus={() => setFocusedField("teaserUrl")}
                          onBlur={() => setFocusedField(null)}
                        />
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
                          If provided, this short teaser plays on the hero banner instead of the full trailer.
                        </p>
                      </Field>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button type="button" onClick={() => setStep(1)} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #e50914, #c0050f)", color: "#fff", fontSize: 15, fontWeight: 600, boxShadow: "0 6px 20px rgba(229,9,20,0.35)" }}
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Display Options + Submit */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={sectionCardStyle}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>
                      Display Options
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>
                      Control where this content appears on Zyperr
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {[
                        { id: "showOnBanner", label: "Show on Banner", desc: "Shown in the top hero carousel", icon: <Film size={20} />,       color: "#f43f5e", glow: "rgba(244,63,94,0.12)" },
                        { id: "featured",     label: "Featured",       desc: "Shown in the Featured row",            icon: <Star size={20} />,       color: "#fbbf24", glow: "rgba(251,191,36,0.12)" },
                        { id: "trending",     label: "Trending Now",   desc: "Shown in the Trending Now row",        icon: <TrendingUp size={20} />, color: "#34d399", glow: "rgba(52,211,153,0.12)" },
                      ].map(({ id, label, desc, icon, color, glow }) => {
                        const on = (form as any)[id];
                        return (
                          <label
                            key={id}
                            id={`label-${id}`}
                            htmlFor={id}
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
                              background: on ? `${color}20` : "rgba(255,255,255,0.05)",
                              border: `1px solid ${on ? color + "30" : "rgba(255,255,255,0.08)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: on ? color : "rgba(255,255,255,0.2)", transition: "all 0.2s",
                            }}>
                              {icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                <p style={{ color: on ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: 700, fontSize: 15 }}>{label}</p>
                                <div style={{
                                  width: 20, height: 20, borderRadius: 6,
                                  background: on ? color : "rgba(255,255,255,0.08)",
                                  border: `1.5px solid ${on ? color : "rgba(255,255,255,0.15)"}`,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  transition: "all 0.2s",
                                }}>
                                  {on && <CheckCircle2 size={12} color="#000" strokeWidth={3} />}
                                </div>
                              </div>
                              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{desc}</p>
                            </div>
                            <input type="checkbox" name={id} id={id} checked={on} onChange={handleChange} style={{ display: "none" }} />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary card */}
                  <div style={{
                    ...sectionCardStyle,
                    background: "rgba(229,9,20,0.04)",
                    border: "1px solid rgba(229,9,20,0.15)",
                  }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>
                      Summary
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      {[
                        { label: "Type",  value: form.contentType === "WEB_SERIES" ? "Web Series" : form.contentType === "ANIME" ? "Anime" : "Movie" },
                        { label: "Title", value: form.title || "—" },
                        { label: "Genre", value: form.genre || "—" },
                        { label: "Year",  value: form.releaseYear || "—" },
                        { label: "Rating",value: form.rating ? `${form.rating}/10` : "—" },
                        { label: "Lang",  value: form.language || "—" },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", minWidth: 0 }}>
                          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</p>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflowWrap: "break-word", wordBreak: "break-word" }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
                    <button type="button" onClick={() => setStep(2)} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                      Back
                    </button>
                    <div style={{ display: "flex", gap: 12 }}>
                      <Link href="/admin" id="add-movie-cancel" style={{ padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center" }}>
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={isLoading || success}
                        id="add-movie-submit"
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 32px", borderRadius: 12, border: "none",
                          cursor: isLoading || success ? "not-allowed" : "pointer",
                          background: isLoading || success ? "rgba(229,9,20,0.5)" : "linear-gradient(135deg, #e50914, #c0050f)",
                          color: "#fff", fontSize: 15, fontWeight: 700,
                          boxShadow: isLoading || success ? "none" : "0 6px 24px rgba(229,9,20,0.4)",
                          transition: "all 0.2s",
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                            Publishing…
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Publish {form.contentType === "WEB_SERIES" ? "Series" : form.contentType === "ANIME" ? "Anime" : "Movie"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
