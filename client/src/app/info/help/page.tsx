"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, CreditCard, MonitorPlay, User, ChevronDown, MessageSquare, CheckCircle, Send } from "lucide-react";

const FAQ_DATA = [
  {
    category: "Billing",
    icon: <CreditCard size={20} />,
    questions: [
      { q: "How do I cancel my subscription?", a: "You can cancel your subscription at any time by going to your Account Settings and clicking on 'Manage Subscription'." },
      { q: "What payment methods are accepted?", a: "We accept all major credit cards, PayPal, and Apple Pay/Google Pay depending on your region." },
      { q: "Can I get a refund?", a: "Refunds are processed on a case-by-case basis. Please contact support within 7 days of your charge." }
    ]
  },
  {
    category: "Technical",
    icon: <MonitorPlay size={20} />,
    questions: [
      { q: "Why is my video buffering?", a: "Buffering is usually caused by a slow internet connection. We recommend a minimum of 5Mbps for HD streaming and 25Mbps for 4K." },
      { q: "Do you support 4K streaming?", a: "Yes! 4K Ultra HD is available on our Premium plan for supported devices." },
      { q: "Can I watch offline?", a: "Offline viewing is currently available on our iOS and Android mobile apps. Just look for the download icon next to an episode or movie." }
    ]
  },
  {
    category: "Account",
    icon: <User size={20} />,
    questions: [
      { q: "How do I change my password?", a: "Go to your Profile settings, click on 'Security', and follow the prompts to update your password." },
      { q: "Can I share my account?", a: "Your account can be shared with members of your immediate household. Simultaneous streaming limits apply based on your plan." },
      { q: "How do I create a kid's profile?", a: "In the profile selection screen, click 'Add Profile' and toggle the 'Kid-friendly' switch to restrict mature content." }
    ]
  }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  
  // Contact form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [contactMsg, setContactMsg] = useState("");

  // Flatten FAQs for searching
  const allFaqs = FAQ_DATA.flatMap(cat => 
    cat.questions.map(q => ({ ...q, category: cat.category, icon: cat.icon }))
  );

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    
    setIsSubmitting(true);
    // Fake network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setContactMsg("");
      
      // Reset success message after 4 seconds
      setTimeout(() => setIsSent(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Background decorations */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 15%, rgba(229,9,20,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="flex-1 page-container pt-32 pb-20 relative z-10 flex flex-col items-center">
        
        {/* Header & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl text-center"
          style={{ marginBottom: "60px", marginTop: "80px" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 56px)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: "16px",
            }}
          >
            How can we help?
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto" style={{ marginTop: "40px" }}>
            <Search size={22} className="absolute top-1/2 -translate-y-1/2 text-gray-400" style={{ left: "24px" }} />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full text-white outline-none transition-all focus:bg-white/10 focus:border-red-500/50"
              style={{ 
                padding: "20px 24px 20px 60px",
                fontSize: "18px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)" 
              }}
            />
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-4xl"
        >
          <div className="glass-card-strong" style={{ padding: "40px" }}>
            
            {/* Category Pills */}
            <div className="flex flex-wrap border-b border-white/10" style={{ gap: "16px", marginBottom: "40px", paddingBottom: "32px", justifyContent: "center" }}>
              <button
                onClick={() => setActiveCategory("All")}
                className={`transition-all font-semibold ${
                  activeCategory === "All" 
                    ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                style={{ padding: "12px 28px", borderRadius: "30px", fontSize: "15px" }}
              >
                All Topics
              </button>
              {FAQ_DATA.map(cat => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`flex items-center transition-all font-semibold ${
                    activeCategory === cat.category 
                      ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                      : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                  style={{ gap: "8px", padding: "12px 28px", borderRadius: "30px", fontSize: "15px" }}
                >
                  {cat.icon}
                  {cat.category}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="flex flex-col" style={{ gap: "20px", minHeight: "300px" }}>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => {
                  const id = `${faq.category}-${idx}`;
                  const isExpanded = expandedIndex === id;
                  return (
                    <div 
                      key={id}
                      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                        isExpanded ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : id)}
                        className="w-full flex items-center justify-between text-left outline-none"
                        style={{ padding: "24px" }}
                      >
                        <span className="font-semibold text-white" style={{ fontSize: "18px" }}>{faq.q}</span>
                        <ChevronDown 
                          size={20} 
                          className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-red-400" : ""}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="text-gray-400 leading-relaxed" style={{ padding: "0 24px 24px 24px", fontSize: "16px" }}>
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <MessageSquare size={40} className="mx-auto mb-4 opacity-20" />
                  <p>No answers found for "{searchQuery}".</p>
                  <p className="text-sm mt-2 opacity-60">Try searching with different keywords or contact support below.</p>
                </div>
              )}
            </div>
            
          </div>
        </motion.div>

        {/* Fake Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-4xl"
          style={{ marginTop: "60px" }}
        >
          <div 
            className="rounded-3xl relative overflow-hidden"
            style={{ 
              background: "linear-gradient(135deg, rgba(229,9,20,0.1) 0%, rgba(0,0,0,0.8) 100%)",
              border: "1px solid rgba(229,9,20,0.2)",
              padding: "40px",
              boxShadow: "0 10px 40px rgba(229,9,20,0.05)"
            }}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center" style={{ gap: "40px" }}>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2 font-display">Still need help?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Can't find the answer you're looking for? Send a message to our support team and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="flex-1 w-full relative">
                <AnimatePresence mode="wait">
                  {isSent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center py-4 text-green-400"
                    >
                      <CheckCircle size={40} className="mb-2 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                      <p className="font-semibold text-lg">Message Sent!</p>
                      <p className="text-xs text-green-400/70">We'll email you shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleContactSubmit}
                      className="relative"
                    >
                      <textarea 
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="Describe your issue..." 
                        className="w-full text-white outline-none resize-none transition-all focus:border-red-500/50"
                        style={{ 
                          height: "140px",
                          background: "rgba(0,0,0,0.4)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "16px",
                          padding: "20px",
                          fontSize: "16px"
                        }}
                        required
                      />
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="absolute bg-red-500 hover:bg-red-600 text-white flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          bottom: "16px",
                          right: "16px",
                          borderRadius: "12px",
                          padding: "10px 20px",
                          fontSize: "15px",
                          fontWeight: 600,
                          gap: "8px"
                        }}
                      >
                        {isSubmitting ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>Send <Send size={14} /></>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
              
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}
