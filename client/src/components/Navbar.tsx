"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Search, Bell, ChevronDown, LogOut, User,
  Settings, Shield, Bookmark, Menu, X, Film,
  Tv2, Clapperboard, Swords, LayoutGrid
} from "lucide-react";
import Logo from "@/components/Logo";
import SignOutModal from "@/components/SignOutModal";

function NavbarInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.setProperty("overflow", "hidden", "important");
      document.documentElement.style.setProperty("overflow", "hidden", "important");
    } else {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    }
    return () => {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/browse",             label: "Browse",    icon: <LayoutGrid size={13} /> },
    { href: "/browse?type=MOVIE",  label: "Movies",    icon: <Clapperboard size={13} /> },
    { href: "/browse?type=WEB_SERIES", label: "Series", icon: <Tv2 size={13} /> },
    { href: "/browse?type=ANIME", label: "Anime",      icon: <Swords size={13} /> },
    { href: "/watchlist",          label: "Watchlist", icon: <Bookmark size={13} /> },
  ];

  return (
    <>
      <nav
        className={`navbar ${scrolled ? "navbar-scrolled" : "navbar-transparent"}`}
        id="main-navbar"
      >
        {/* Logo */}
        <Link
          href={isAuthenticated ? "/browse" : "/"}
          className="flex items-center gap-2 flex-shrink-0"
          id="nav-logo"
        >
          <Logo size={32} />
        </Link>

        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <div
            className="hidden md:flex items-center ml-8"
            style={{
              gap: 2,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding: "5px 6px",
              backdropFilter: "blur(12px)",
            }}
          >
            {navLinks.map((link) => {
              // Active: exact pathname match, or for browse sub-pages match type param
              const linkUrl = new URL(link.href, "http://x");
              const linkType = linkUrl.searchParams.get("type");
              const currentType = searchParams.get("type");
              const isActive =
                pathname === linkUrl.pathname &&
                (linkType ? currentType === linkType : !currentType);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-${link.label.toLowerCase()}`}
                  className="relative flex items-center gap-1.5 text-sm font-medium transition-all"
                  onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 10,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.52)",
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.52)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {/* Icon */}
                  <span style={{ opacity: isActive ? 1 : 0.7 }}>{link.icon}</span>
                  {link.label}
                  {/* Active dot */}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 3,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--zyperr-red)",
                        boxShadow: "0 0 6px rgba(229,9,20,0.8)",
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Separator */}
            {user?.role === "ADMIN" && (
              <span
                style={{
                  width: 1,
                  height: 18,
                  background: "rgba(255,255,255,0.1)",
                  margin: "0 4px",
                  flexShrink: 0,
                }}
              />
            )}

            {/* Admin link */}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                id="nav-admin"
                className="flex items-center gap-1.5 text-sm font-semibold transition-all"
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  color: pathname.startsWith("/admin") ? "#ff5561" : "rgba(229,9,20,0.75)",
                  background: pathname.startsWith("/admin")
                    ? "rgba(229,9,20,0.18)"
                    : "rgba(229,9,20,0.08)",
                  border: "1px solid",
                  borderColor: pathname.startsWith("/admin")
                    ? "rgba(229,9,20,0.4)"
                    : "rgba(229,9,20,0.15)",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(229,9,20,0.2)";
                  (e.currentTarget as HTMLElement).style.color = "#ff5561";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(229,9,20,0.45)";
                }}
                onMouseLeave={(e) => {
                  if (!pathname.startsWith("/admin")) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(229,9,20,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(229,9,20,0.75)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(229,9,20,0.15)";
                  }
                }}
              >
                <Shield size={13} />
                Admin
              </Link>
            )}
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Search */}
          {isAuthenticated && (
            <button
              id="nav-search-btn"
              onClick={() => setShowSearch(!showSearch)}
              className="hidden md:flex items-center justify-center transition-all"
              style={{
                width: 38, height: 38,
                borderRadius: 10,
                color: "rgba(255,255,255,0.65)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <Search size={17} />
            </button>
          )}

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <button
                id="nav-bell"
                className="hidden md:flex items-center justify-center transition-all relative"
                style={{
                  width: 38, height: 38,
                  borderRadius: 10,
                  color: "rgba(255,255,255,0.65)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <Bell size={17} />
                {/* notification dot */}
                <span
                  className="absolute"
                  style={{
                    top: 7, right: 7,
                    width: 7, height: 7,
                    borderRadius: "50%",
                    background: "var(--zyperr-red)",
                    border: "1.5px solid rgba(13,13,16,0.9)",
                    boxShadow: "0 0 6px rgba(229,9,20,0.9)",
                  }}
                />
              </button>

              {/* User Dropdown Trigger — Minimal Circle + Name */}
              <div className="relative" id="nav-user-menu">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center transition-all"
                style={{
                  gap: 10,
                  padding: "5px 14px 5px 5px",
                  borderRadius: 100,
                  background: showDropdown
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.04)",
                  border: showDropdown
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                {/* Circle avatar with spinning conic gradient ring */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {/* Spinning gradient ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -2,
                      borderRadius: "50%",
                      background: "conic-gradient(from 0deg, #e50914, #ff6b35, #fbbf24, #e50914)",
                      animation: showDropdown ? "spin 2s linear infinite" : "spin 4s linear infinite",
                      opacity: showDropdown ? 1 : 0.7,
                    }}
                  />
                  {/* Dark mask ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 1,
                      borderRadius: "50%",
                      background: "#0d0d10",
                      zIndex: 1,
                    }}
                  />
                  {/* Initials */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: 32, height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      background: "linear-gradient(135deg, #1a0a0a, #2d1010)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>

                  {/* Admin shield pip */}
                  {user?.role === "ADMIN" && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: -1, right: -1,
                        width: 13, height: 13,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #e50914, #ff6b35)",
                        border: "2px solid #0d0d10",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3,
                      }}
                    >
                      <Shield size={7} color="#fff" strokeWidth={3} />
                    </span>
                  )}
                </div>

                {/* Name + role */}
                <div className="hidden md:flex flex-col" style={{ gap: 1, lineHeight: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
                    {user?.name?.split(" ")[0]}
                  </span>
                  {user?.role === "ADMIN" && (
                    <span style={{ fontSize: 10, color: "rgba(229,9,20,0.9)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Admin
                    </span>
                  )}
                </div>

                {/* Chevron */}
                <ChevronDown
                  size={14}
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s cubic-bezier(0.23,1,0.32,1)",
                    flexShrink: 0,
                  }}
                />
              </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.94 }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 mt-3 w-80 rounded-2xl z-50"
                      style={{
                        background: "rgba(13,13,16,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 40px 100px rgba(0,0,0,0.95), 0 0 0 0.5px rgba(255,255,255,0.05) inset",
                        backdropFilter: "blur(48px) saturate(200%)",
                      }}
                      id="nav-dropdown"
                    >
                      {/* ── Avatar Header ── */}
                      <div
                        className="relative"
                        style={{
                          padding: "24px 24px 20px",
                          background: "linear-gradient(160deg, rgba(229,9,20,0.14) 0%, transparent 65%)",
                          borderBottom: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "16px 16px 0 0",
                        }}
                      >
                        {/* glow blob */}
                        <div
                          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                          style={{
                            background: "radial-gradient(circle, rgba(229,9,20,0.2) 0%, transparent 70%)",
                            filter: "blur(24px)",
                            transform: "translate(30%, -30%)",
                          }}
                        />

                        <div className="flex items-center gap-4">
                          {/* Premium Netflix-style Rounded Square Avatar */}
                          <div
                            className="relative flex-shrink-0"
                            style={{
                              width: 60, height: 60,
                              borderRadius: 18,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 26,
                              fontWeight: 800,
                              background: "linear-gradient(135deg, #e50914, #ff6b35)",
                              color: "#fff",
                              boxShadow: "0 8px 24px rgba(229,9,20,0.5), inset 0 2px 2px rgba(255,255,255,0.25)",
                              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                              border: "1.5px solid rgba(255,255,255,0.15)",
                            }}
                          >
                            {user?.name?.[0]?.toUpperCase() || "U"}
                          </div>

                          {/* Name / Email */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-bold truncate"
                              style={{ color: "#fff", fontSize: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}
                            >
                              {user?.name}
                            </p>
                            <p
                              className="truncate"
                              style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: 4 }}
                            >
                              {user?.email}
                            </p>

                            {/* Admin badge */}
                            {user?.role === "ADMIN" && (
                              <span
                                className="inline-flex items-center gap-1"
                                style={{
                                  marginTop: 8,
                                  padding: "3px 10px",
                                  borderRadius: 999,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                  background: "linear-gradient(90deg, rgba(229,9,20,0.28), rgba(229,9,20,0.14))",
                                  color: "#ff5561",
                                  border: "1px solid rgba(229,9,20,0.35)",
                                  boxShadow: "0 0 10px rgba(229,9,20,0.25)",
                                }}
                              >
                                <Shield size={9} />
                                Administrator
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ── Menu Items ── */}
                      <div style={{ padding: "10px 12px 8px" }}>
                        {[
                          { href: "/profile",   id: "dropdown-profile",   icon: <User size={16} />,     label: "Profile",      desc: "View your account" },
                          { href: "/watchlist", id: "dropdown-watchlist", icon: <Bookmark size={16} />, label: "My Watchlist", desc: "Saved content" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            id={item.id}
                            onClick={() => setShowDropdown(false)}
                            className="group flex items-center transition-all"
                            style={{
                              gap: 14,
                              padding: "11px 14px",
                              borderRadius: 14,
                              color: "rgba(255,255,255,0.75)",
                              marginBottom: 2,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                              (e.currentTarget as HTMLElement).style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                            }}
                          >
                            <span
                              className="flex-shrink-0 flex items-center justify-center"
                              style={{
                                width: 36, height: 36,
                                borderRadius: 10,
                                background: "rgba(255,255,255,0.07)",
                                color: "rgba(255,255,255,0.6)",
                              }}
                            >
                              {item.icon}
                            </span>
                            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>{item.label}</span>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", lineHeight: 1.2 }}>{item.desc}</span>
                            </span>
                          </Link>
                        ))}

                        {/* Admin Panel item */}
                        {user?.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            id="dropdown-admin"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center transition-all"
                            style={{
                              gap: 14,
                              padding: "11px 14px",
                              borderRadius: 14,
                              color: "rgba(229,9,20,0.85)",
                              marginBottom: 2,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "rgba(229,9,20,0.1)";
                              (e.currentTarget as HTMLElement).style.color = "#ff5561";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                              (e.currentTarget as HTMLElement).style.color = "rgba(229,9,20,0.85)";
                            }}
                          >
                            <span
                              className="flex-shrink-0 flex items-center justify-center"
                              style={{
                                width: 36, height: 36,
                                borderRadius: 10,
                                background: "rgba(229,9,20,0.13)",
                                color: "#e50914",
                              }}
                            >
                              <Shield size={16} />
                            </span>
                            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>Admin Panel</span>
                              <span style={{ fontSize: 11, color: "rgba(229,9,20,0.42)", lineHeight: 1.2 }}>Manage content & users</span>
                            </span>
                          </Link>
                        )}
                      </div>

                      {/* ── Sign Out ── */}
                      <div
                        style={{ padding: "8px 12px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <button
                          id="dropdown-logout"
                          onClick={() => { setShowSignOutModal(true); setShowDropdown(false); }}
                          className="w-full flex items-center transition-all"
                          style={{
                            gap: 14,
                            padding: "11px 14px",
                            marginTop: 4,
                            borderRadius: 14,
                            color: "rgba(255,255,255,0.42)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(229,9,20,0.09)";
                            (e.currentTarget as HTMLElement).style.color = "#ff5561";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.42)";
                          }}
                        >
                          <span
                            className="flex-shrink-0 flex items-center justify-center"
                            style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", color: "currentColor" }}
                          >
                            <LogOut size={16} />
                          </span>
                          <span className="flex flex-col text-left">
                            <span className="font-medium leading-tight">Sign Out</span>
                            <span className="text-[11px] leading-tight" style={{ color: "rgba(255,255,255,0.2)" }}>End your session</span>
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <SignOutModal 
                  isOpen={showSignOutModal} 
                  onClose={() => setShowSignOutModal(false)} 
                  onConfirm={() => {
                    setShowSignOutModal(false);
                    handleLogout();
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                id="nav-login"
                className="btn btn-ghost text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                id="nav-register"
                className="btn btn-primary text-sm py-2 px-5"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              id="nav-mobile-menu"
              className="md:hidden p-2 rounded-lg"
              style={{ color: "#fff", background: "rgba(255,255,255,0.06)" }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)" }}
              onClick={() => setShowSearch(false)}
            />

            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="fixed left-1/2 z-[61]"
              style={{ top: "90px", transform: "translateX(-50%)", width: "100%", maxWidth: "720px", padding: "0 20px" }}
              id="search-overlay"
            >
              <div
                style={{
                  background: "rgba(13,13,16,0.96)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
                  backdropFilter: "blur(48px)",
                  overflow: "hidden",
                }}
              >
                <form onSubmit={handleSearch}>
                  {/* Input row */}
                  <div className="flex items-center" style={{ padding: "6px 6px 6px 20px", gap: 8 }}>
                    {/* Search icon */}
                    <Search size={20} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />

                    <input
                      id="search-input"
                      autoFocus
                      type="text"
                      placeholder="What do you want to watch?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setShowSearch(false)}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#fff",
                        fontSize: "17px",
                        fontFamily: "var(--font-body)",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        padding: "14px 0",
                      }}
                    />

                    {/* ESC hint */}
                    {searchQuery.length === 0 && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.2)",
                          fontWeight: 500,
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.04)",
                          flexShrink: 0,
                          marginRight: 4,
                        }}
                      >
                        ESC
                      </span>
                    )}

                    {/* Clear button — shown when typing */}
                    {searchQuery.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        style={{
                          width: 28, height: 28,
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.08)",
                          border: "none",
                          color: "rgba(255,255,255,0.5)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                          fontSize: 16,
                        }}
                      >
                        ✕
                      </button>
                    )}

                    {/* Search button */}
                    <button
                      type="submit"
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "10px 20px",
                        borderRadius: 14,
                        background: "var(--zyperr-red)",
                        border: "none",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        flexShrink: 0,
                        boxShadow: "0 4px 16px rgba(229,9,20,0.4)",
                      }}
                    >
                      <Search size={15} />
                      Search
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu — Right-side Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed top-[60px] right-0 bottom-0 z-[999] md:hidden"
            style={{
              width: 280,
              background: "rgba(13,13,16,0.95)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(48px) saturate(200%)",
              WebkitBackdropFilter: "blur(48px) saturate(200%)",
              boxShadow: "-12px 0 40px rgba(0,0,0,0.6)",
              overflowY: "auto",
            }}
            id="mobile-menu"
          >
            <div style={{ padding: "20px 16px 30px" }}>

              {/* User chip */}
              {user && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    marginBottom: 12,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--zyperr-red)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, lineHeight: "1.2", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.name}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {navLinks.map((link) => {
                  const linkUrl = new URL(link.href, "http://x");
                  const linkType = linkUrl.searchParams.get("type");
                  const currentType = searchParams.get("type");
                  const isActive =
                    pathname === linkUrl.pathname &&
                    (linkType ? currentType === linkType : !currentType);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setShowMobileMenu(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                        background: isActive ? "rgba(229,9,20,0.14)" : "transparent",
                        textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <span style={{ color: isActive ? "var(--zyperr-red)" : "rgba(255,255,255,0.3)", display: "flex" }}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "10px 0" }} />

              {/* Admin */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--zyperr-red-light)",
                    background: "rgba(229,9,20,0.08)",
                    textDecoration: "none",
                    marginBottom: 2,
                  }}
                >
                  <Shield size={14} style={{ flexShrink: 0 }} /> Admin Panel
                </Link>
              )}

              {/* Sign Out */}
              <button
                onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.38)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <LogOut size={14} style={{ flexShrink: 0 }} /> Sign Out
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for dropdowns */}
      <AnimatePresence>
        {(showDropdown || showMobileMenu) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[990]"
            style={{
              background: showMobileMenu ? "rgba(0,0,0,0.6)" : "transparent",
              backdropFilter: showMobileMenu ? "blur(4px)" : "none",
              WebkitBackdropFilter: showMobileMenu ? "blur(4px)" : "none",
            }}
            onClick={() => {
              setShowDropdown(false);
              setShowMobileMenu(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarInner />
    </Suspense>
  );
}
