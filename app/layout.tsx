import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/language-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnAI Hub — Platform Belajar AI untuk Mahasiswa & Pelajar Indonesia",
  description:
    "Platform all-in-one untuk belajar kecerdasan buatan (AI): Multi-AI Chat (Claude, GPT-4o, Gemini), Analisis Dokumen RAG, Roadmap Belajar AI Terstruktur, dan AI Content Studio.",
  keywords: [
    "LearnAI Hub",
    "Belajar AI",
    "Roadmap AI Indonesia",
    "Mahasiswa AI",
    "Chatbot Claude GPT",
    "RAG Dokumen",
    "Generative AI Indonesia",
  ],
  authors: [{ name: "LearnAI Hub Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen antialiased bg-[#F8FAFC] text-[#1E293B] dark:bg-[#0F172A] dark:text-[#F1F5F9] transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
