"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Info, Star, Clock, Volume2, VolumeX, Check, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { watchlistApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// Extend window to include YT API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

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
  trailerUrl?: string;
  teaserUrl?: string;
  cast: string;
  director: string;
  featured: boolean;
  trending: boolean;
  contentType: "MOVIE" | "WEB_SERIES" | "ANIME";
}

interface HeroBannerProps {
  movies: Movie[];
}

const SECONDS_BEFORE_END = 20; // switch banner this many seconds before trailer ends (avoids end cards)
const FALLBACK_DURATION = 40000; // fallback timer (ms) when no trailer

export default function HeroBanner({ movies }: HeroBannerProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Refs — never cause re-renders
  const playerRef = useRef<any>(null);        // YT.Player instance
  const mutedRef = useRef(true);              // always in sync with muted state
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imagePhasRef = useRef<ReturnType<typeof setTimeout> | null>(null); // image-hold timer
  const didTriggerNext = useRef(false);       // prevent double-firing
  const currentIdxRef = useRef(0);            // mirror of currentIdx for closures
  const inImagePhase = useRef(true);          // true = still showing image, keep player muted
  const [inViewport, setInViewport] = useState(true); // triggers re-render for background timer
  const inViewportRef = useRef(true);         // tracks if banner is visible on screen for closures
  const shouldPlayWhenVisible = useRef(false);// if true, play video when scrolled back into view
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ── Detect Mobile View ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile(); // initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentMovie = movies[currentIdx];

  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  // Prefer teaserUrl (short, perfect for banner) → fall back to trailerUrl
  const getBannerVideoId = (movie: Movie) =>
    getYoutubeId(movie.teaserUrl) || getYoutubeId(movie.trailerUrl);

  // ── Advance to next banner ──────────────────────────────────
  const goNext = useCallback(() => {
    setCurrentIdx((prev) => {
      const next = (prev + 1) % movies.length;
      currentIdxRef.current = next;
      return next;
    });
    setImgError(false);
    setVideoReady(false);
    didTriggerNext.current = false;
  }, [movies.length]);

  const prevMovie = () => {
    setCurrentIdx((prev) => {
      const next = (prev - 1 + movies.length) % movies.length;
      currentIdxRef.current = next;
      return next;
    });
    setImgError(false);
    setVideoReady(false);
    didTriggerNext.current = false;
  };

  // ── Clear all running timers ────────────────────────────────
  const clearTimers = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    if (fallbackRef.current) { clearTimeout(fallbackRef.current); fallbackRef.current = null; }
    if (imagePhasRef.current) { clearTimeout(imagePhasRef.current); imagePhasRef.current = null; }
  };

  // ── Start the polling loop once video is playing ────────────
  const startPolling = useCallback(() => {
    clearTimers();
    didTriggerNext.current = false;
    pollRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== "function") return;
      try {
        const current = player.getCurrentTime();
        const duration = player.getDuration();
        // Cut 20s before end, but never cut more than 40% of short videos
        const cutoffTime = duration - Math.min(SECONDS_BEFORE_END, duration * 0.4);
        if (duration > 0 && current >= cutoffTime) {
          if (!didTriggerNext.current) {
            didTriggerNext.current = true;
            goNext();
          }
        }
      } catch {
        // player might be in a bad state, ignore
      }
    }, 1000);
  }, [goNext]);

  // ── Start fallback timer (no trailer case) ──────────────────
  const startFallback = useCallback(() => {
    clearTimers();
    fallbackRef.current = setTimeout(goNext, FALLBACK_DURATION);
  }, [goNext]);

  // ── Load YouTube IFrame API once ────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;

    const initPlayer = () => {
      // Destroy old player cleanly if it exists
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch { /* ignore */ }
        playerRef.current = null;
      }

      const videoId = getBannerVideoId(movies[currentIdxRef.current]);
      if (!videoId) {
        startFallback();
        return;
      }

      playerRef.current = new window.YT.Player("yt-player-div", {
        videoId,
        playerVars: {
          autoplay: 1, // Let it start so it buffers, we will pause it immediately on PLAYING
          controls: 0,
          mute: 1, // keep muted initially, handle on play
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
          fs: 0,
          showinfo: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(100);
            e.target.mute(); // always start muted to avoid blips
            
            // If the banner slide changed while the player was initializing, correct it now.
            const correctVideoId = getBannerVideoId(movies[currentIdxRef.current]);
            let actualVideoId = null;
            try { actualVideoId = e.target.getVideoData().video_id; } catch { /* ignore */ }
            
            if (correctVideoId && actualVideoId && actualVideoId !== correctVideoId) {
              e.target.loadVideoById({ videoId: correctVideoId });
            }
          },
          onStateChange: (e: any) => {
            // VERIFY SYNC: Prevent race conditions where old buffering videos fire PLAYING events
            const correctVideoId = getBannerVideoId(movies[currentIdxRef.current]);
            let actualVideoId = null;
            try { actualVideoId = e.target.getVideoData().video_id; } catch { /* ignore */ }
            
            if (correctVideoId && actualVideoId && actualVideoId !== correctVideoId) {
               return; // Ignore events from old videos that are still flushing out
            }

            if (e.data === window.YT.PlayerState.PLAYING) {
              if (inImagePhase.current) {
                // Video just started buffering/playing. Pause immediately.
                e.target.pauseVideo();
                e.target.seekTo(0);
                // Start 4s hold before fading it in
                imagePhasRef.current = setTimeout(() => {
                  inImagePhase.current = false;
                  if (!mutedRef.current) e.target.unMute();
                  
                  if (inViewportRef.current) {
                    e.target.playVideo();
                  } else {
                    shouldPlayWhenVisible.current = true;
                  }
                }, 4000);
              } else {
                // Force high quality
                try { e.target.setPlaybackQuality('hd1080'); } catch { /* ignore */ }
                
                // Wait 400ms for the YouTube pause icon animation to fade out internally 
                // BEFORE we fade in the iframe.
                setTimeout(() => {
                  setVideoReady(true);
                }, 400);
                
                startPolling();
              }
            } else if (
              e.data === window.YT.PlayerState.PAUSED ||
              e.data === window.YT.PlayerState.BUFFERING
            ) {
              if (!inImagePhase.current) {
                clearTimers();
              }
            } else if (e.data === window.YT.PlayerState.ENDED) {
              if (!didTriggerNext.current) {
                didTriggerNext.current = true;
                goNext();
              }
            }
          },
          onError: () => {
            // Video failed (restricted, unavailable) — fall back to timer
            startFallback();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      // API already loaded
      initPlayer();
    } else {
      // Inject the script tag once
      if (!document.getElementById("yt-api-script")) {
        const tag = document.createElement("script");
        tag.id = "yt-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const handleVisibilityChange = () => {
      const player = playerRef.current;
      if (!player) return;
      if (document.hidden) {
        // Tab hidden: pause the video and remember we should resume later
        clearTimers();
        try {
          if (typeof player.getPlayerState === "function" && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
            player.pauseVideo();
          }
        } catch { /* ignore */ }
        shouldPlayWhenVisible.current = true;
      } else {
        // Tab visible again: ALWAYS re-sync the player to the correct current slide.
        // This prevents stale videos from playing over a new banner if the slide
        // auto-advanced while the tab was in the background.
        if (!inViewportRef.current) return;
        shouldPlayWhenVisible.current = false;

        const correctVideoId = getBannerVideoId(movies[currentIdxRef.current]);
        if (!correctVideoId) return;

        let actualVideoId: string | null = null;
        try { actualVideoId = player.getVideoData()?.video_id || null; } catch { /* ignore */ }

        if (actualVideoId !== correctVideoId) {
          // Wrong video is loaded — reset state and load the correct one
          clearTimers();
          setVideoReady(false);
          inImagePhase.current = true;
          try { player.mute(); player.loadVideoById({ videoId: correctVideoId }); } catch { /* ignore */ }
        } else {
          // Correct video is loaded, just resume it
          try { if (typeof player.playVideo === "function") player.playVideo(); } catch { /* ignore */ }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch { /* ignore */ }
        playerRef.current = null;
      }
    };
  }, [isMobile]);

  // ── When movie changes, cue new video into the existing player ──
  useEffect(() => {
    clearTimers();
    setVideoReady(false);
    didTriggerNext.current = false;
    inImagePhase.current = true;
    shouldPlayWhenVisible.current = false; // cancel any pending "play when visible" for old slide

    if (isMobile) {
      // On mobile, just set an 8-second timer to cycle the static banner image
      fallbackRef.current = setTimeout(goNext, 8000);
      return;
    }

    const player = playerRef.current;
    const videoId = getBannerVideoId(currentMovie);

    if (!player || typeof player.loadVideoById !== "function") {
      // Player not ready yet — handled by onReady above
      if (!videoId) {
        startFallback();
      } else if (!player && window.YT && window.YT.Player) {
        // Recover if player was somehow skipped
        playerRef.current = new window.YT.Player("yt-player-div", {
          videoId,
          playerVars: {
            autoplay: 1, controls: 0, mute: 1, rel: 0, modestbranding: 1,
            iv_load_policy: 3, disablekb: 1, playsinline: 1, fs: 0, showinfo: 0,
          },
          events: {
            onReady: (e: any) => { e.target.setVolume(100); e.target.mute(); },
            onStateChange: (e: any) => {
              if (e.data === window.YT.PlayerState.PLAYING) {
                try { e.target.setPlaybackQuality('hd1080'); } catch {}
                setTimeout(() => setVideoReady(true), 400);
                startPolling();
              } else if (e.data === window.YT.PlayerState.ENDED) {
                if (!didTriggerNext.current) { didTriggerNext.current = true; goNext(); }
              }
            },
            onError: () => startFallback(),
          }
        });
      }
      return;
    }

    if (videoId) {
      try {
        player.mute(); // force mute during new load
        player.loadVideoById({ videoId });
      } catch { /* ignore */ }
    } else {
      // No trailer — hide video and use fallback timer
      try { player.stopVideo(); } catch { /* ignore */ }
      startFallback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, movies, goNext, startFallback, isMobile]);

  // ── Sync muted state to player ──────────────────────────────
  useEffect(() => {
    mutedRef.current = muted;
    // Don't touch player audio during image phase — it must stay muted until video is visible
    if (inImagePhase.current) return;
    const player = playerRef.current;
    if (!player || typeof player.mute !== "function") return;
    try {
      if (muted) player.mute(); else player.unMute();
    } catch { /* ignore */ }
  }, [muted]);

  // ── Intersection Observer (Pause when scrolled away) ────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewportRef.current = entry.isIntersecting;
        setInViewport(entry.isIntersecting);
        if (!entry.isIntersecting) {
          // Scrolled away: Pause the video if it's currently playing
          const player = playerRef.current;
          if (player && typeof player.getPlayerState === "function") {
            try {
              const state = player.getPlayerState();
              if (state === window.YT.PlayerState.PLAYING) {
                player.pauseVideo();
                shouldPlayWhenVisible.current = true;
              }
            } catch { /* ignore */ }
          }
        } else {
          // Scrolled back into view: Resume the video if it was paused by scrolling
          if (shouldPlayWhenVisible.current) {
            const player = playerRef.current;
            if (player && typeof player.playVideo === "function") {
              try {
                player.playVideo();
                shouldPlayWhenVisible.current = false;
              } catch { /* ignore */ }
            }
          }
        }
      },
      { threshold: 0.5 } // trigger when 50% visible
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ── Background Auto-Advance Timer (When scrolled away) ────────
  useEffect(() => {
    let backgroundTimer: ReturnType<typeof setTimeout> | null = null;
    if (!inViewport) {
      // If we are scrolled away, start a 15s timer to auto-advance the banner
      backgroundTimer = setTimeout(() => {
        if (!didTriggerNext.current) {
          didTriggerNext.current = true;
          goNext();
        }
      }, 15000);
    }
    return () => {
      if (backgroundTimer) clearTimeout(backgroundTimer);
    };
  }, [inViewport, currentIdx, goNext]);

  // ── Watchlist ───────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      watchlistApi.get().then((res) => {
        setWatchlistIds(new Set<string>(res.data.map((m: any) => m.id)));
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const inWatchlist = currentMovie ? watchlistIds.has(currentMovie.id) : false;

  const toggleWatchlist = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    try {
      if (inWatchlist) {
        await watchlistApi.remove(currentMovie.id);
        setWatchlistIds(prev => { const n = new Set(prev); n.delete(currentMovie.id); return n; });
      } else {
        await watchlistApi.add(currentMovie.id);
        setWatchlistIds(prev => { const n = new Set(prev); n.add(currentMovie.id); return n; });
      }
    } catch { /* ignore */ }
  };

  if (!currentMovie) return null;
  const genres = currentMovie.genre.split(",").map((g) => g.trim());

  return (
    <div className="hero-section" id="hero-banner" ref={bannerRef}>

      {/* ── Persistent YouTube Player ── */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden bg-[#060606]">
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: 1, pointerEvents: "none" }}
          >
            {/* The wrapper scales the iframe up to hide YT black bars/edges */}
            <div className="absolute top-1/2 left-1/2 w-[150vw] h-[150vw] sm:w-[130vw] sm:h-[130vw] md:w-[110vw] md:h-[110vw] lg:w-[100vw] lg:h-[56.25vw] -translate-x-1/2 -translate-y-1/2 opacity-80">
              {/* This div is the stable anchor — YT.Player attaches here and is never unmounted unless we are on mobile */}
              <div id="yt-player-div" style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Static Poster (fades out when video is playing) ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          {!imgError ? (
            <>
              <Image
                src={currentMovie.bannerUrl}
                alt={currentMovie.title}
                fill
                className="object-cover object-center hidden md:block"
                priority
                onError={() => setImgError(true)}
                unoptimized
              />
              <Image
                src={currentMovie.thumbnailUrl}
                alt={currentMovie.title}
                fill
                className="object-cover object-top block md:hidden"
                priority
                onError={() => setImgError(true)}
                unoptimized
              />
            </>
          ) : (
            <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 50%, #0a1a0a 100%)" }} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient Overlays ── */}
      <div className="hero-gradient-overlay" />

      {/* ── Content ── */}
      <div className="relative z-10 page-container w-full hero-content-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="hero-inner max-w-2xl"
          >
            {/* Badges */}
            <div className="hero-badges-row flex flex-wrap gap-2 mb-5">
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

            {/* Title */}
            <div className="hero-title-row flex items-start gap-4 mb-8">
              <div className="hero-title-accent" style={{ width: 5, minHeight: 60, borderRadius: 3, background: "linear-gradient(to bottom, var(--zyperr-red), rgba(229,9,20,0.3))", flexShrink: 0, marginTop: 6, boxShadow: "0 0 14px rgba(229,9,20,0.5)" }} />
              <h1 className="font-black hero-title" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 6.5vw, 80px)", lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", textShadow: "0 4px 40px rgba(0,0,0,0.8)" }}>
                {currentMovie.title}
              </h1>
            </div>

            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14 }}>
                <Star size={15} fill="#f5c518" color="#f5c518" />
                <span style={{ fontWeight: 700, color: "#f5c518" }}>{currentMovie.rating.toFixed(1)}</span>
              </div>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500 }}>{currentMovie.releaseYear}</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                <Clock size={14} />
                <span style={{ fontWeight: 500 }}>
                  {currentMovie.contentType === "WEB_SERIES" || currentMovie.contentType === "ANIME"
                    ? (currentMovie.totalSeasons 
                        ? `${currentMovie.totalSeasons} Season${currentMovie.totalSeasons > 1 ? 's' : ''}` 
                        : `${currentMovie.duration}m / ep`)
                    : `${Math.floor(currentMovie.duration / 60)}h ${currentMovie.duration % 60}m`}
                </span>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", maxWidth: "480px", paddingLeft: 20, marginBottom: 36, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentMovie.description}
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-row flex flex-wrap items-center gap-3" style={{ paddingLeft: 20 }}>
              {currentMovie.status === "Upcoming" ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, background: "rgba(251,191,36,0.12)", border: "1.5px solid rgba(251,191,36,0.35)", color: "#fbbf24", fontSize: 15, fontWeight: 700, letterSpacing: "0.02em", backdropFilter: "blur(8px)", cursor: "default" }}>
                  <Clock size={17} /> Coming Soon
                </div>
              ) : (
                <button id={`hero-play-${currentMovie.id}`} onClick={() => router.push(`/movies/${currentMovie.id}`)} className="btn btn-primary" style={{ borderRadius: "12px", fontSize: "15px", padding: "13px 32px", boxShadow: "0 8px 32px rgba(229,9,20,0.45)" }}>
                  <Play size={17} fill="white" /> Play Now
                </button>
              )}
              <button id={`hero-watchlist-${currentMovie.id}`} onClick={toggleWatchlist} className="btn btn-secondary" style={{ borderRadius: "12px", fontSize: "15px", padding: "13px 26px" }}>
                {inWatchlist ? <Check size={17} style={{ color: "var(--zyperr-red-light)" }} /> : <Plus size={17} />}
                {inWatchlist ? "In Watchlist" : "Add to List"}
              </button>
              <button id={`hero-info-${currentMovie.id}`} onClick={() => router.push(`/movies/${currentMovie.id}`)} className="btn btn-ghost" style={{ borderRadius: "12px", fontSize: "14px", padding: "13px 22px", color: "rgba(255,255,255,0.7)" }}>
                <Info size={17} /> More Info
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Nav Arrows ── */}
      <button onClick={prevMovie} className="hero-arrow absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(6,6,6,0.6)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(10px)", width: 44, height: 44 }} id="hero-prev">
        <ChevronLeft size={20} />
      </button>
      <button onClick={goNext} className="hero-arrow absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(6,6,6,0.6)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(10px)", width: 44, height: 44 }} id="hero-next">
        <ChevronRight size={20} />
      </button>

      {/* ── Volume Button ── */}
      <div className="hidden md:flex absolute bottom-32 right-6 z-10">
        <motion.button
          layout
          onClick={() => { setMuted(!muted); setHasInteracted(true); }}
          className="hero-mute flex items-center overflow-hidden cursor-pointer hover:bg-[rgba(20,20,20,0.7)] transition-colors"
          style={{ 
            background: "rgba(6,6,6,0.6)", 
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)", 
            color: "#fff",
            height: 40,
            borderRadius: 20,
          }}
          initial={false}
          animate={{ paddingRight: muted && !hasInteracted ? "16px" : "0px" }}
          transition={{ layout: { type: "spring", stiffness: 400, damping: 30 } }}
          id="hero-mute"
        >
          <motion.div layout className="flex items-center justify-center w-10 h-10 shrink-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={muted ? "muted" : "unmuted"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          <motion.div
            initial={false}
            animate={{ 
              width: muted && !hasInteracted ? "auto" : 0,
              opacity: muted && !hasInteracted ? 1 : 0
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <span 
              className="whitespace-nowrap text-[13px] font-semibold tracking-wide pl-1 flex items-center h-10"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Tap to unmute
            </span>
          </motion.div>
        </motion.button>
      </div>

      {/* ── Slide Indicators ── */}
      <div className="hero-dots absolute bottom-6 md:bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { currentIdxRef.current = idx; setCurrentIdx(idx); setImgError(false); setVideoReady(false); didTriggerNext.current = false; }}
            className="h-1 rounded-full transition-all duration-300"
            style={{ width: idx === currentIdx ? "32px" : "8px", background: idx === currentIdx ? "var(--zyperr-red)" : "rgba(255,255,255,0.3)" }}
            id={`hero-dot-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}
