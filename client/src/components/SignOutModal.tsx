import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutModal({ isOpen, onClose, onConfirm }: SignOutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm mx-4 overflow-hidden glass-card-strong border border-white/10"
              style={{
                background: "rgba(15, 15, 15, 0.95)",
                padding: "32px",
                borderRadius: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(229,9,20,0.15)",
              }}
            >
              {/* Subtle red glow in the background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />



              <div className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div 
                  className="rounded-full flex items-center justify-center shadow-xl"
                  style={{
                    width: "64px",
                    height: "64px",
                    marginBottom: "16px",
                    background: "rgba(229,9,20,0.1)",
                    border: "1px solid rgba(229,9,20,0.3)",
                    color: "var(--zyperr-red)"
                  }}
                >
                  <LogOut size={28} />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>
                  Sign Out
                </h3>
                <p className="text-gray-400 text-sm" style={{ marginBottom: "24px" }}>
                  Are you sure you want to end your session?
                </p>

                <div className="flex flex-row gap-3 w-full">
                  <button
                    onClick={onClose}
                    className="flex-1 font-bold uppercase tracking-wider text-gray-300 transition-all hover:text-white"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      fontSize: "13px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 font-bold uppercase tracking-wider text-white transition-all shadow-[0_4px_14px_rgba(229,9,20,0.4)] hover:shadow-[0_6px_20px_rgba(229,9,20,0.6)] hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, var(--zyperr-red) 0%, #900 100%)",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      fontSize: "13px",
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
