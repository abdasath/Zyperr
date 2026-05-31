// src/app/info/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// All content in one object
const contentMap: Record<string, { title: string; body: React.ReactNode }> = {
  "terms-of-service": { 
    title: "Terms of Service", 
    body: (
      <div className="flex flex-col gap-6">
        <p>Welcome to ZYPERR+. By using our service, you agree to these terms. Please read them carefully.</p>
        <h3 className="text-xl font-bold text-white mt-4">1. Acceptance of Terms</h3>
        <p>By accessing or using the ZYPERR+ platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
        <h3 className="text-xl font-bold text-white mt-4">2. User Accounts</h3>
        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. ZYPERR+ cannot and will not be liable for any loss or damage arising from your failure to comply with the above.</p>
        <h3 className="text-xl font-bold text-white mt-4">3. Content and Usage</h3>
        <p>All content provided on ZYPERR+ is for your personal and non-commercial use only. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.</p>
        <h3 className="text-xl font-bold text-white mt-4">4. Modifications</h3>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
        <p className="mt-8 text-sm opacity-50">Last updated: May 25, 2026</p>
      </div>
    ) 
  },
  "privacy-policy": { 
    title: "Privacy Policy", 
    body: (
      <div className="flex flex-col gap-6">
        <p>We take your privacy seriously. Here is how we collect, use, and protect your data.</p>
        <h3 className="text-xl font-bold text-white mt-4">1. Data Collection</h3>
        <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
        <h3 className="text-xl font-bold text-white mt-4">2. Usage of Data</h3>
        <p>We use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support, and send product updates and administrative messages.</p>
        <p className="mt-8 text-sm opacity-50">Last updated: May 25, 2026</p>
      </div>
    ) 
  },
  "cookie-policy": { title: "Cookie Policy", body: <p>Cookies are used to improve your experience...</p> },
  "corporate-info": { title: "Corporate Info", body: <p>Zyperr Streaming Inc. Registered in...</p> },
  "help-center": { title: "Help Center", body: <p>Need assistance? Search our articles below...</p> },
  "contact-us": { title: "Contact Us", body: <p>Email us at support@zyperr.com...</p> },
  "faq": { title: "Frequently Asked Questions", body: <p>1. How do I cancel? 2. Is 4K included?...</p> },
  "supported-devices": { title: "Supported Devices", body: <p>We support iOS, Android, Smart TVs, and Web.</p> },
};

export default function InfoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const content = contentMap[slug] || { title: "Page Not Found", body: <p>The page you are looking for does not exist.</p> };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Background decorations */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 10%, rgba(229,9,20,0.06) 0%, transparent 60%)",
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

      <div className="flex-1 page-container pt-32 pb-20 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
          style={{ marginTop: "80px" }}
        >
          <div className="glass-card-strong" style={{ padding: "50px 60px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.03em",
                marginBottom: "32px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "24px"
              }}
            >
              {content.title}
            </h1>
            <div 
              style={{ 
                color: "rgba(255,255,255,0.6)", 
                fontSize: "16px", 
                lineHeight: 1.8 
              }}
            >
              {content.body}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}