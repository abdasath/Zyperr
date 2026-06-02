"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Clapperboard, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Logo from "@/components/Logo";

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
