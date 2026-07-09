"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Clapperboard, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Logo from "@/components/Logo";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // ── Frontend email validation ────────────────────────────────
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address ");
      return;
    }
    const emailDomain = email.split("@")[1]?.toLowerCase();
    const domainParts = emailDomain?.split(".");
    if (!domainParts || domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      setError("Please use a real email domain (e.g. gmail.com, yahoo.com)");
      return;
    }

    // ── Gmail only ───────────────────────────────────────────────
    if (emailDomain !== "gmail.com") {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.register(name, email, password);
      login(response.data);
      router.push("/browse");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLoginAction = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const res = await authApi.googleLogin(tokenResponse.credential || tokenResponse.access_token, "register");
        login(res.data);
        if (res.data.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/browse");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Google signup failed.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google Signup Failed");
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
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 80% 20%, rgba(0,100,255,0.06) 0%, transparent 60%)",
        }}
      />
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
          style={{ padding: "40px 48px 36px", marginBottom: "60px" }}
          id="register-card"
        >
          <div style={{ marginBottom: "28px" }}>
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
              Create Your Account
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: 1.6 }}>
              Join ZYPERR+ and start streaming today
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
                  id="register-error"
                >
                  <AlertCircle size={18} style={{ color: "#ff6b6b", flexShrink: 0, marginTop: "2px" }} />
                  <div>{error}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  id="register-name"
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: "44px" }}
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  id="register-email"
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
              <label className="form-label" htmlFor="register-password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  style={{ paddingLeft: "44px", paddingRight: "44px" }}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
                  id="toggle-password-register"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: strength >= level ? strengthColors[strength] : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: "11px", color: strengthColors[strength] }}>
                    {strengthLabels[strength]} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  id="register-confirm"
                  type={showConfirm ? "text" : "password"}
                  className="input-field"
                  style={{ paddingLeft: "44px", paddingRight: "44px" }}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
                  id="toggle-confirm-password"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <Check
                    size={16}
                    className="absolute right-10 top-1/2 -translate-y-1/2"
                    style={{ color: "#22c55e" }}
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
              style={{ borderRadius: "12px", fontSize: "16px", padding: "15px 24px", marginTop: "4px" }}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
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
              marginTop: "24px",
              paddingTop: "20px",
              textAlign: "center",
              fontSize: "14px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold transition-colors"
              style={{ color: "#fff" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--zyperr-red-light)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#fff")}
              id="register-login-link"
            >
              Sign in instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
