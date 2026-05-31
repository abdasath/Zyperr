"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { moviesApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import LandscapeMovieCard from "@/components/LandscapeMovieCard";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import { Search, Film, Tv, SlidersHorizontal, X, Swords, TrendingUp, Star, Clapperboard, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ContentType = "ALL" | "MOVIE" | "WEB_SERIES" | "ANIME";

const CONTENT_TABS: { key: ContentType; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "ALL",        label: "All",        icon: <SlidersHorizontal size={14} />, color: "#fff" },
  { key: "MOVIE",      label: "Movies",     icon: <Film size={14} />,              color: "#ff6b75" },
  { key: "WEB_SERIES", label: "Web Series", icon: <Tv size={14} />,                color: "#60a5fa" },
  { key: "ANIME",      label: "Anime",      icon: <Swords size={14} />,                   color: "#a78bfa" },
];

const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialType   = (searchParams.get("type") as ContentType) || "ALL";
  const initialSearch = searchParams.get("search") || "";
  const initialGenre  = searchParams.get("genre") || "";

  const [activeType,   setActiveType]   = useState<ContentType>(initialType);
  const [activeGenre,  setActiveGenre]  = useState(initialGenre);
  const [searchQuery,  setSearchQuery]  = useState(initialSearch);
  const [searchInput,  setSearchInput]  = useState(initialSearch);
  const [activeViewAll, setActiveViewAll] = useState(searchParams.get("viewAll") || "");

  const [allContent, setAllContent] = useState<any[]>([]);
  const [featured,   setFeatured]   = useState<any[]>([]);
  const [bannerMovies, setBannerMovies] = useState<any[]>([]);
  const [trending,   setTrending]   = useState<any[]>([]);
  const [genres,     setGenres]     = useState<string[]>([]);
  const [loading,    setLoading]    = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { limit: 200 };
      if (activeType !== "ALL") params.contentType = activeType;
      if (activeGenre)          params.genre        = activeGenre;
      if (searchQuery)          params.search       = searchQuery;

      const [contentRes, featuredRes, bannerRes, trendingRes, genresRes] = await Promise.all([
        moviesApi.getAll(params),
        moviesApi.getFeatured(),
        moviesApi.getBanner(),
        moviesApi.getTrending(),
        moviesApi.getGenres(),
      ]);

      setAllContent(shuffleArray(contentRes.data.movies ?? []));
      setFeatured(shuffleArray(featuredRes.data ?? []));
      setBannerMovies(shuffleArray(bannerRes.data ?? []));
      setTrending(shuffleArray(trendingRes.data ?? []));
      setGenres(genresRes.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeType, activeGenre, searchQuery]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeType !== "ALL") params.set("type", activeType);
    if (activeGenre)           params.set("genre", activeGenre);
    if (searchQuery)           params.set("search", searchQuery);
    if (activeViewAll)         params.set("viewAll", activeViewAll);
    const query = params.toString();
    router.replace(query ? `/browse?${query}` : "/browse", { scroll: false });
  }, [activeType, activeGenre, searchQuery, activeViewAll, router]);

  // Sync URL → state when navigating via Navbar links
  useEffect(() => {
    const typeFromUrl   = (searchParams.get("type") as ContentType) || "ALL";
    const genreFromUrl  = searchParams.get("genre") || "";
    const searchFromUrl = searchParams.get("search") || "";
    const viewAllFromUrl = searchParams.get("viewAll") || "";
    setActiveType(typeFromUrl);
    setActiveGenre(genreFromUrl);
    setSearchQuery(searchFromUrl);
    setSearchInput(searchFromUrl);
    setActiveViewAll(viewAllFromUrl);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setActiveGenre("");
    setActiveViewAll("");
  };

  const handleGenreClick = (g: string) => {
    setActiveGenre(activeGenre === g ? "" : g);
    setSearchQuery("");
    setSearchInput("");
    setActiveViewAll("");
  };

  const handleTypeChange = (type: ContentType) => {
    setActiveType(type);
    setActiveGenre("");
    setSearchQuery("");
    setSearchInput("");
    setActiveViewAll("");
  };

  const handleViewAll = (section: string) => {
    setActiveViewAll(section);
    // Let URL sync effect handle it
  };

  const clearAll = () => {
    setSearchQuery("");
    setSearchInput("");
    setActiveGenre("");
    setActiveViewAll("");
  };

  const movies            = allContent.filter((c) => c.contentType === "MOVIE" || !c.contentType);
  const series            = allContent.filter((c) => c.contentType === "WEB_SERIES");
  const anime             = allContent.filter((c) => c.contentType === "ANIME");
  const trendingFiltered  = trending.filter((c) =>
    activeType === "ALL" || c.contentType === activeType || (!c.contentType && activeType === "MOVIE")
  );

  const isFiltered = !!activeGenre || !!searchQuery || !!activeViewAll;
  // Hero banner only on ALL (home) page
  const showHero   = !isFiltered && bannerMovies.length > 0 && activeType === "ALL";
  
  // If activeType is set to a specific category, force it into a grid view like a filtered page.
  const isCategoryPage = activeType !== "ALL" && !activeViewAll;

  let gridContent = allContent;
  let gridTitle = `${allContent.length} ${allContent.length === 1 ? "result" : "results"}`;

  if (activeViewAll === "trending") {
    gridContent = trendingFiltered;
    gridTitle = activeType === "ANIME" ? "Trending Anime" : activeType === "WEB_SERIES" ? "Trending Series" : "Trending Now";
  } else if (isCategoryPage && !searchQuery && !activeGenre) {
    gridContent = activeType === "MOVIE" ? movies : activeType === "WEB_SERIES" ? series : anime;
    gridTitle = activeType === "MOVIE" ? "Explore Movies" : activeType === "WEB_SERIES" ? "Explore Series" : "Explore Anime";
  } else if (activeViewAll === "movies") {
    gridContent = movies;
    gridTitle = "All Movies";
  } else if (activeViewAll === "series") {
    gridContent = series;
    gridTitle = "All Web Series";
  } else if (activeViewAll === "anime") {
    gridContent = anime;
    gridTitle = "All Anime";
  } else if (activeViewAll === "featured") {
    gridContent = featured;
    gridTitle = "Featured";
  }

  let accentColor = "#e50914"; // red
  let accentGlow = "rgba(229,9,20,0.5)";

  if (activeViewAll === "series") {
    accentColor = "#60a5fa";
    accentGlow = "rgba(96,165,250,0.5)";
  } else if (activeViewAll === "anime") {
    accentColor = "#a78bfa";
    accentGlow = "rgba(167,139,250,0.5)";
  } else if (activeViewAll === "featured") {
    accentColor = "#f5c518";
    accentGlow = "rgba(245,197,24,0.5)";
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* ── Hero Banner ── */}
      {showHero && <HeroBanner movies={bannerMovies} />}

      {/* ══════════════════════════════════════════════════
          STICKY FILTER BAR  (type tabs + search)
      ══════════════════════════════════════════════════ */}
      {!activeViewAll && (
        <div
        style={{
          position: "sticky",
          top: 70,
          zIndex: 40,
          background: "rgba(6,6,6,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px" }}>
          {/* Row 1: type tabs + search */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            height: 58,
          }}>

            {/* Content-type tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {CONTENT_TABS.map((tab) => {
                const isActive = activeType === tab.key;
                return (
                  <button
                    key={tab.key}
                    id={`tab-${tab.key.toLowerCase()}`}
                    onClick={() => handleTypeChange(tab.key)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "8px 18px", borderRadius: 10, cursor: "pointer",
                      background: isActive ? "rgba(229,9,20,0.12)" : "transparent",
                      border: isActive ? "1px solid rgba(229,9,20,0.3)" : "1px solid transparent",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                      fontSize: 15, fontWeight: isActive ? 700 : 500,
                      transition: "all 0.18s", whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                  >
                    <span style={{ color: isActive ? tab.color : "rgba(255,255,255,0.3)" }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search form */}
            <form
              onSubmit={handleSearch}
              style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
            >
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)", pointerEvents: "none",
                  }}
                />
                <input
                  id="browse-search"
                  type="text"
                  placeholder="Search movies, series, anime…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{
                    width: 260, height: 38,
                    paddingLeft: 34, paddingRight: searchInput ? 34 : 14,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, color: "#fff", fontSize: 13,
                    fontFamily: "var(--font-body)", outline: "none",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(229,9,20,0.45)";
                    e.target.style.background  = "rgba(255,255,255,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.background  = "rgba(255,255,255,0.06)";
                  }}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => { setSearchInput(""); setSearchQuery(""); }}
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", padding: 2,
                      color: "rgba(255,255,255,0.3)", display: "flex",
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #e50914, #c0050f)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(229,9,20,0.35)", flexShrink: 0,
                  transition: "box-shadow 0.18s, transform 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                <Search size={15} />
              </button>
            </form>
          </div>

          {/* Row 2: genre pills */}
          {genres.length > 0 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              paddingBottom: 10,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}>
              {/* "All Genres" reset */}
              <button
                onClick={() => { setActiveGenre(""); setSearchQuery(""); setSearchInput(""); }}
                style={{
                  padding: "4px 13px", borderRadius: 30, fontSize: 12, fontWeight: 600,
                  border: "1px solid", cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
                  background: !activeGenre ? "rgba(229,9,20,0.14)" : "transparent",
                  borderColor: !activeGenre ? "rgba(229,9,20,0.35)" : "rgba(255,255,255,0.09)",
                  color: !activeGenre ? "#ff5561" : "rgba(255,255,255,0.35)",
                }}
              >
                All
              </button>
              <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.09)", flexShrink: 0 }} />
              {genres.slice(0, 12).map((g) => {
                const on = activeGenre === g;
                return (
                  <button
                    key={g}
                    onClick={() => handleGenreClick(g)}
                    style={{
                      padding: "4px 13px", borderRadius: 30, fontSize: 12, fontWeight: 500,
                      border: "1px solid", cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
                      background: on ? "rgba(255,255,255,0.1)" : "transparent",
                      borderColor: on ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)",
                      color: on ? "#fff" : "rgba(255,255,255,0.38)",
                    }}
                    onMouseEnter={(e) => { if (!on) { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)"; } }}
                    onMouseLeave={(e) => { if (!on) { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; } }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      )}

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1400, margin: "0 auto", paddingBottom: "20px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 120 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "2px solid rgba(229,9,20,0.25)", borderTopColor: "#e50914",
              animation: "spin 0.8s linear infinite",
            }} />
          </div>
        ) : isFiltered || isCategoryPage ? (
          /* ── Filtered or Category Grid ── */
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeType}-${activeGenre}-${searchQuery}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {gridContent.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 100 }}>
                  <Film size={48} style={{ color: "rgba(255,255,255,0.07)", margin: "0 auto 16px", display: "block" }} />
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 16 }}>
                    No results found
                    {searchQuery && ` for "${searchQuery}"`}
                    {activeGenre && ` in ${activeGenre}`}
                  </p>
                  <button
                    onClick={clearAll}
                    style={{
                      marginTop: 16, padding: "8px 20px", borderRadius: 10, cursor: "pointer",
                      background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.25)",
                      color: "#ff5561", fontSize: 13, fontWeight: 600,
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div style={{ padding: "0 48px" }}>
                  {/* View All Header */}
                  {activeViewAll && (
                    <div style={{ marginBottom: 40, marginTop: 100 }}>
                      <button
                        onClick={clearAll}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          padding: "8px 18px", borderRadius: 30,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.8)",
                          fontSize: 14, fontWeight: 500,
                          cursor: "pointer", transition: "all 0.2s",
                          marginBottom: 32
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                      >
                        <ChevronLeft size={16} /> Back to Browse
                      </button>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 4, height: 28, borderRadius: 3,
                          background: accentColor,
                          boxShadow: `0 0 12px ${accentGlow}`,
                        }} />
                        <h2 style={{
                          fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800,
                          color: "#fff", letterSpacing: "-0.025em", margin: 0, lineHeight: 1.2
                        }}>
                          {gridTitle}
                        </h2>
                      </div>
                    </div>
                  )}

                  {/* Result header */}
                  {!activeViewAll && (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "24px 0 18px",
                      marginTop: isCategoryPage ? 40 : 0,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <h2 style={{
                          fontFamily: "var(--font-display)", fontSize: isCategoryPage ? 28 : 18, fontWeight: 800,
                          color: "#fff", letterSpacing: "-0.02em",
                        }}>
                          {gridTitle}
                        </h2>
                        {(activeGenre || searchQuery) && (
                          <span style={{
                            fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)",
                            border: "1px solid rgba(255,255,255,0.09)",
                          }}>
                            {activeGenre || `"${searchQuery}"`}
                          </span>
                        )}
                      </div>
                      {(activeGenre || searchQuery) && (
                        <button
                          onClick={clearAll}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "5px 13px", borderRadius: 20, cursor: "pointer",
                            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 500,
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                        >
                          <X size={12} /> Clear
                        </button>
                      )}
                    </div>
                  )}

                  {/* Grid */}
                  {isCategoryPage ? (
                    <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                      {gridContent.map((item) => (
                        <LandscapeMovieCard key={item.id} movie={item} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                      {gridContent.map((item) => (
                        <MovieCard key={item.id} movie={item} size="sm" />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* ── Default Row View ── */
          <div style={{ paddingTop: 8 }}>
            {trendingFiltered.length > 0 && (
              <MovieRow
                title={
                  activeType === "ANIME"      ? "Trending Anime"  :
                  activeType === "WEB_SERIES" ? "Trending Series" :
                  "Trending Now"
                }
                icon={
                  activeType === "ANIME"      ? <Swords size={16} />    :
                  activeType === "WEB_SERIES" ? <Tv size={16} />        :
                  <TrendingUp size={16} />
                }
                movies={trendingFiltered}
                accent="red"
                onSeeAll={() => handleViewAll("trending")}
              />
            )}
            {(activeType === "ALL" || activeType === "MOVIE")      && movies.length > 0 && <MovieRow title="Movies"     icon={<Clapperboard size={16} />} movies={movies} accent="red"    onSeeAll={() => handleViewAll("movies")} />}
            {(activeType === "ALL" || activeType === "WEB_SERIES") && series.length > 0 && <MovieRow title="Web Series" icon={<Tv size={16} />}           movies={series} accent="blue"   onSeeAll={() => handleViewAll("series")} />}
            {(activeType === "ALL" || activeType === "ANIME")      && anime.length  > 0 && <MovieRow title="Anime"       icon={<Swords size={16} />}       movies={anime}  accent="purple" onSeeAll={() => handleViewAll("anime")} />}
            {featured.length > 0 && activeType === "ALL"                                 && <MovieRow title="Featured"   icon={<Star size={16} />}           movies={featured} accent="gold" onSeeAll={() => handleViewAll("featured")} />}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseContent />
    </Suspense>
  );
}