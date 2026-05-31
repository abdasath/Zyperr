"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Zap, Shield, Layers, ChevronRight, Star, Film, Tv, Globe, Clapperboard, Flame, Heart, Rocket, Smile, Ghost } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

const FEATURES = [
  {
    icon: <Zap size={24} />,
    title: "Lightning Fast",
    desc: "Stream in 4K with zero buffering. Our CDN ensures the fastest delivery worldwide.",
    color: "#f5c518",
  },
  {
    icon: <Shield size={24} />,
    title: "Premium Content",
    desc: "Exclusive access to blockbusters, indie gems, and award-winning originals.",
    color: "#e50914", /* 👈 Changed from var(--zyperr-red) */
  },
  {
    icon: <Layers size={24} />,
    title: "Any Device",
    desc: "Watch on your phone, tablet, laptop, or smart TV — your choice, your comfort.",
    color: "#00d4ff", /* 👈 Changed from var(--zyperr-cyan) */
  },
  {
    icon: <Globe size={24} />,
    title: "Global Library",
    desc: "Thousands of titles across 20+ languages and every genre imaginable.",
    color: "#a78bfa",
  },
];

const GENRES = [
  { name: "Action", Icon: Flame, color: "#ef4444", count: "1,200+" },
  { name: "Drama", Icon: Clapperboard, color: "#a855f7", count: "850+" },
  { name: "Sci-Fi", Icon: Rocket, color: "#3b82f6", count: "430+" },
  { name: "Comedy", Icon: Smile, color: "#eab308", count: "620+" },
  { name: "Horror", Icon: Ghost, color: "#9ca3af", count: "310+" },
  { name: "Romance", Icon: Heart, color: "#ec4899", count: "290+" },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isAuthenticated) router.replace("/browse");
  }, [isAuthenticated, router]);

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 9, 20, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ opacity: 0.5, zIndex: 0 }}
      />

      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center px-6"
        style={{ zIndex: 1, paddingTop: "70px" }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(229,9,20,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-4xl mx-auto relative">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full text-sm font-medium mb-1"
              style={{
                background: "rgba(229,9,20,0.1)",
                border: "1px solid rgba(229,9,20,0.25)",
                color: "var(--zyperr-red-light)",
                padding: "7px 35px",
              }}
            >
              <Star size={13} fill="currentColor" /> Premium Streaming Experience
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 8vw, 100px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#fff",
              marginBottom: "10px",
              marginTop: "15px",
            }}
          >
            Stream Without{" "}
            <span className="gradient-text-red">Limits.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto 25px",
            }}
          >
            Thousands of movies, exclusive originals, and top-rated films.
            One platform. Unlimited entertainment.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="btn btn-primary text-base px-10 py-4"
              style={{ borderRadius: "14px", fontSize: "17px" }}
              id="hero-cta-register"
            >
              <Play size={20} fill="white" />
              Start Watching Free
            </Link>
            <Link
              href="/login"
              className="btn btn-secondary text-base px-8 py-4"
              style={{ borderRadius: "14px", fontSize: "16px" }}
              id="hero-cta-signin"
            >
              Sign In <ChevronRight size={18} />
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-20 pb-8"
            style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 500 , marginTop: "30px"}}
          >
            <div className="flex items-center gap-2">
              <Film size={16} style={{ color: "var(--zyperr-red)" }} />
              10,000+ Movies
            </div>
            <div className="flex items-center gap-2">
              <Tv size={16} style={{ color: "var(--zyperr-red)" }} />
              HD & 4K Quality
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} style={{ color: "var(--zyperr-red)" }} />
              20+ Languages
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* ── NEON DIVIDER ── */}
      <div className="page-container" style={{ padding: "0 80px" }}>
        <div 
          style={{
            height: "1px",
            width: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(229,9,20,0.4) 50%, transparent 100%)",
            boxShadow: "0 0 15px rgba(229,9,20,0.3)", /* Gives it that subtle red glow */
          }}
        />
      </div>

      {/* ── FEATURES ── */}
      <section 
        className="relative z-10 page-container"
        style={{ paddingTop: "120px", paddingBottom: "40px" }} /* 👈 Lowered paddingBottom */
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "80px" }} /* 👈 Forces space above the cards */
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}
          >
            Why Choose ZYPERR+?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
            Built for people who take their entertainment seriously.
          </p>
        </motion.div>

        {/* Inline Grid to bypass broken Tailwind classes */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "24px" 
          }}
        >
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card"
              id={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ 
                padding: "40px 24px", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", /* 👈 This absolutely forces the logo to the center */
                textAlign: "center",
                cursor: "default"
              }}
            >
              <div
                style={{ 
                  width: "60px", 
                  height: "60px", 
                  borderRadius: "16px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  background: `${feature.color}15`, 
                  color: feature.color,
                  marginBottom: "20px",
                  boxShadow: `0 0 30px ${feature.color}30`
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.7 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GENRE GRID ── */}
      <section 
        className="relative z-10 page-container"
        style={{ paddingTop: "100px", paddingBottom: "60px" }} /* 👈 Forces space above and below the grid */
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "50px" }} /* 👈 Pushes the cards down from the title */
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "10px",
            }}
          >
            Every Genre, All in One Place
          </h2>
        </motion.div>
        
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          style={{ display: "grid", gap: "16px" }} 
        >
          {GENRES.map((genre, idx) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card"
              onClick={() => router.push(`/browse?genre=${genre.name}`)}
              id={`genre-${genre.name.toLowerCase()}`}
              style={{ 
                padding: "24px", 
                textAlign: "center", 
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div 
                style={{ 
                  marginBottom: "16px", 
                  display: "flex", 
                  justifyContent: "center",
                  alignItems: "center",
                  width: "72px",
                  height: "72px",
                  borderRadius: "22px",
                  background: `linear-gradient(135deg, ${genre.color}20 0%, ${genre.color}05 100%)`,
                  border: `1px solid ${genre.color}40`,
                  boxShadow: `0 10px 30px ${genre.color}25`,
                }}
              >
                <genre.Icon size={34} color={genre.color} fill={`${genre.color}35`} />
              </div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", letterSpacing: "0.02em" }}>{genre.name}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginTop: "6px", fontWeight: 500 }}>
                {genre.count} Movies
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section 
        className="relative z-10 page-container"
        style={{ paddingTop: "20px", paddingBottom: "60px" }} /* 👈 Lowered paddingBottom */
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto glass-card-strong"
          style={{
            background: "linear-gradient(135deg, rgba(229,9,20,0.08) 0%, rgba(6,6,6,0.5) 100%)",
            border: "1px solid rgba(229,9,20,0.15)",
            padding: "64px", /* 👈 Replaces the broken p-16 class */
            textAlign: "center",
            margin: "0 auto"
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: "16px",
            }}
          >
            Ready to Start Watching?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", marginBottom: "36px", lineHeight: 1.7 }}>
            Join thousands of viewers already streaming on ZYPERR+. No credit card required to get started.
          </p>
          <Link
            href="/register"
            className="btn btn-primary text-base px-12 py-4"
            style={{ borderRadius: "14px", fontSize: "17px", display: "inline-flex" }}
            id="footer-cta-register"
          >
            <Play size={20} fill="white" />
            Create Free Account
          </Link>
        </motion.div>
      </section>

      
      {/* Footer */}
      <Footer />

    </div>
  );
}