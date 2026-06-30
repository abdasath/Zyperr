"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // If no email in URL, redirect to register
  useEffect(() => {
    if (!email) router.push("/register");
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-advance to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp: code });
      // Store token and user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        id: res.data.id, name: res.data.name, email: res.data.email, role: res.data.role
      }));
      setSuccess("Email verified! Redirecting...");
      setTimeout(() => router.push("/browse"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    try {
      await axios.post(`${API_URL}/auth/resend-otp`, { email });
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setSuccess("A new code has been sent to your email!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#060606",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", fontFamily: "'Inter', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 440,
        background: "#111", borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "48px 40px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#e50914", fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em" }}>ZYPERR+</span>
          </Link>
        </div>

        {/* Email icon */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(229,9,20,0.15), rgba(229,9,20,0.05))",
            border: "1px solid rgba(229,9,20,0.3)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, marginBottom: 16,
          }}>
            📧
          </div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Check your email
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{email}</span>
          </p>
        </div>

        {/* OTP Input Boxes */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              style={{
                width: 52, height: 60,
                textAlign: "center",
                fontSize: 24, fontWeight: 700,
                color: digit ? "#fff" : "rgba(255,255,255,0.3)",
                background: digit ? "rgba(229,9,20,0.1)" : "rgba(255,255,255,0.04)",
                border: `2px solid ${digit ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 12,
                outline: "none",
                transition: "all 0.15s",
                caretColor: "#e50914",
              }}
              onFocus={e => { e.target.style.borderColor = "rgba(229,9,20,0.7)"; e.target.style.background = "rgba(229,9,20,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = digit ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.1)"; }}
            />
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{
            background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20, textAlign: "center",
          }}>
            <p style={{ color: "#ff4444", fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}
        {success && (
          <div style={{
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20, textAlign: "center",
          }}>
            <p style={{ color: "#22c55e", fontSize: 13, margin: 0 }}>{success}</p>
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.join("").length < 6}
          style={{
            width: "100%", height: 52, borderRadius: 12, border: "none", cursor: "pointer",
            background: otp.join("").length === 6 ? "linear-gradient(135deg, #e50914, #c0050f)" : "rgba(255,255,255,0.06)",
            color: otp.join("").length === 6 ? "#fff" : "rgba(255,255,255,0.3)",
            fontSize: 15, fontWeight: 700, letterSpacing: "0.02em",
            transition: "all 0.2s",
            boxShadow: otp.join("").length === 6 ? "0 4px 20px rgba(229,9,20,0.4)" : "none",
            marginBottom: 20,
          }}
        >
          {isLoading ? "Verifying..." : "Verify Email →"}
        </button>

        {/* Resend */}
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
          Didn't receive the code?{" "}
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#e50914", fontWeight: 600, fontSize: 13, padding: 0,
              }}
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Resend in {countdown}s</span>
          )}
        </p>

        {/* Back to register */}
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 24, marginBottom: 0 }}>
          Wrong email?{" "}
          <Link href="/register" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
}
