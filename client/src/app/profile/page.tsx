"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Shield, LogOut, User, CreditCard } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import SignOutModal from "@/components/SignOutModal";



export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { 
      router.replace("/login"); 
      return; 
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-4xl px-6 w-full profile-page-wrapper" style={{ paddingTop: "140px", paddingBottom: "120px", margin: "0 auto" }}>
        
        {/* --- HEADER SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 glass-card-strong relative overflow-hidden profile-card"
          style={{ padding: "40px" }}
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          {/* Identity */}
          <div className="flex items-center gap-6 relative z-10 profile-identity-row">
            {/* Perfectly round, clean avatar with gradient and glow */}
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0 shadow-[0_0_30px_rgba(229,9,20,0.3)] relative profile-avatar"
              style={{
                background: "linear-gradient(135deg, var(--zyperr-red) 0%, #900 100%)",
                color: "#fff",
                fontFamily: "var(--font-display)",
                border: "2px solid rgba(255,255,255,0.1)"
              }}
            >
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                {user.name}
              </h1>
              <p className="text-gray-400 text-sm font-medium" style={{ marginBottom: "16px" }}>
                {user.email}
              </p>
              
              <div className="flex items-center gap-2">
                <span 
                  className="inline-flex items-center border border-white/10 bg-white/5 font-bold uppercase tracking-wider text-gray-300 backdrop-blur-md"
                  style={{ padding: "4px 12px", borderRadius: "9999px", gap: "6px", fontSize: "11px" }}
                >
                  <User size={12} /> Member
                </span>
                {user.role === "ADMIN" && (
                  <span 
                    className="inline-flex items-center border border-red-500/20 bg-red-500/10 font-bold uppercase tracking-wider text-red-500 backdrop-blur-md"
                    style={{ padding: "4px 12px", borderRadius: "9999px", gap: "6px", fontSize: "11px" }}
                  >
                    <Shield size={12} /> Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:w-auto w-full relative z-10 profile-actions">
            {user.role === "ADMIN" && (
              <button 
                onClick={() => router.push("/admin")}
                className="w-full sm:w-auto font-bold uppercase tracking-wider transition-all flex items-center justify-center border border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(229,9,20,0.2)]"
                style={{ background: "rgba(229,9,20,0.15)", color: "#ff4d4d", padding: "12px 24px", borderRadius: "12px", gap: "8px", fontSize: "14px" }}
              >
                <Shield size={16} /> Admin Panel
              </button>
            )}
            <button 
              onClick={() => setShowSignOutModal(true)}
              className="w-full sm:w-auto font-bold uppercase tracking-wider text-gray-300 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all flex items-center justify-center hover:text-white"
              style={{ padding: "12px 24px", borderRadius: "12px", gap: "8px", fontSize: "14px" }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Clean Divider */}
        <div className="w-full h-px bg-white/10 profile-divider" style={{ marginTop: "56px", marginBottom: "56px" }}></div>

        {/* --- ACCOUNT DETAILS SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)", marginBottom: "32px" }}>
            Account Details
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 profile-details-grid" style={{ gap: "24px" }}>
            
            <div 
              className="glass-card bg-white/5 border border-white/10 hover:border-white/20 transition-all group flex items-start profile-detail-card"
              style={{ padding: "24px", borderRadius: "16px", gap: "16px" }}
            >
              <div 
                className="bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-white transition-colors"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              >
                <User size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Full Name</p>
                <p className="text-lg font-medium text-white">{user.name}</p>
              </div>
            </div>

            <div 
              className="glass-card bg-white/5 border border-white/10 hover:border-white/20 transition-all group flex items-start profile-detail-card"
              style={{ padding: "24px", borderRadius: "16px", gap: "16px" }}
            >
              <div 
                className="bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-white transition-colors"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              >
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email Address</p>
                <p className="text-lg font-medium text-white">{user.email}</p>
              </div>
            </div>

            <div 
              className="glass-card bg-white/5 border border-white/10 hover:border-white/20 transition-all group flex items-start profile-detail-card"
              style={{ padding: "24px", borderRadius: "16px", gap: "16px" }}
            >
              <div 
                className="bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-white transition-colors"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              >
                <Shield size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Account Role</p>
                <p className="text-lg font-medium text-white capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>

            <div 
              className="glass-card bg-white/5 border border-white/10 hover:border-white/20 transition-all group flex items-start profile-detail-card"
              style={{ padding: "24px", borderRadius: "16px", gap: "16px" }}
            >
              <div 
                className="bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-white transition-colors"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              >
                <CreditCard size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Subscription</p>
                <div className="flex items-center gap-2 text-lg font-medium text-white">
                  Premium <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
      
      {/* Hide scrollbar for webkit globally in this component */}
      <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />

      <SignOutModal 
        isOpen={showSignOutModal} 
        onClose={() => setShowSignOutModal(false)} 
        onConfirm={() => {
          setShowSignOutModal(false);
          handleLogout();
        }}
      />
    </div>
  );
}
