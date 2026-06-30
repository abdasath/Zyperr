"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, EyeOff, Mail, Lock, ArrowRight, Clapperboard, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Logo from "@/components/Logo";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);
      login(response.data);
      if (response.data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/browse");
      }
    } catch (err: any) {
      const data = err.response?.data;
      // Redirect unverified users to OTP page instead of showing error
      if (data?.requiresVerification) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email || email)}`);
        return;
      }
      setError(data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLoginAction = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const res = await authApi.googleLogin(tokenResponse.credential || tokenResponse.access_token);
        login(res.data);
        if (res.data.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/browse");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Google login failed.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google Login Failed");
    }
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 pt-32 pb-24 relative overflow-x-hidden overflow-y-auto"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background decorations */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 20% 30%, rgba(229,9,20,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 80%, rgba(0,100,255,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="auth-page-wrapper relative z-10 w-full my-auto" style={{ maxWidth: "460px" }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
          style={{ marginBottom: "28px", marginTop: "60px" }}
        >
          <Link href="/" className="inline-flex justify-center">
            <Logo size={42} />
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card-strong auth-card"
          style={{ padding: "44px 48px 40px", marginBottom: "60px" }}
          id="login-card"
        >
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              Welcome Back
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: 1.6 }}>
              Sign in to continue your streaming experience
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    background: "rgba(229,9,20,0.1)",
                    border: "1px solid rgba(229,9,20,0.3)",
                    color: "#ff6b6b",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    fontSize: "14px",
                    fontWeight: 500
                  }}
                  id="login-error"
                >
                  <AlertCircle size={18} style={{ color: "#ff6b6b", flexShrink: 0, marginTop: "2px" }} />
                  <div>{error}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                />
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: "44px" }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  style={{ paddingLeft: "44px", paddingRight: "44px" }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
                  id="toggle-password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
              style={{ borderRadius: "12px", fontSize: "16px", padding: "15px 24px", marginTop: "4px" }}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>Or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          <button
            type="button"
            onClick={() => googleLoginAction()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3"
            style={{ 
              background: "rgba(255,255,255,0.04)", 
              border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: "12px", 
              fontSize: "15px", 
              fontWeight: 600,
              padding: "14px 24px",
              color: "#fff",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div
            style={{
              marginTop: "28px",
              paddingTop: "24px",
              textAlign: "center",
              fontSize: "14px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            New to ZYPERR+?{" "}
            <Link
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: "#fff" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--zyperr-red-light)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#fff")}
              id="login-register-link"
            >
              Create an account
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
