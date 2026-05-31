import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer 
      style={{ 
        borderTop: "1px solid", 
        borderColor: "rgba(255,255,255,0.06)", 
        background: "linear-gradient(to bottom, rgba(6,6,6,0.3) 0%, rgba(0,0,0,1) 100%)",
        marginTop: "40px",
        paddingTop: "40px",
        paddingBottom: "40px"
      }}
    >
      <div className="page-container flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Logo size={28} />
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>
            © {new Date().getFullYear()} ZYPERR+. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6" style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", fontWeight: 500 }}>
          <Link href="/info/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/info/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/info/help" className="hover:text-white transition-colors">Help</Link>
          <div className="flex items-center gap-2 font-medium" style={{ color: "rgba(255,255,255,0.5)", marginLeft: "10px" }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px rgba(34, 197, 94, 0.6)" }}></span>
            Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
