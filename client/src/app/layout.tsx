import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZYPERR+ — Stream Without Limits",
  description: "ZYPERR+ is a premium movie streaming platform. Watch the latest movies, top-rated films, and exclusive content. Stream anytime, anywhere.",
  keywords: ["streaming", "movies", "watch online", "ZYPERR+", "films"],
  authors: [{ name: "ZYPERR+" }],
  openGraph: {
    title: "ZYPERR+ — Stream Without Limits",
    description: "Premium movie streaming. Watch anytime, anywhere.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-screen flex flex-col bg-[#060606] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
