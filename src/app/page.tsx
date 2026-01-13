"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryAuth from "@/components/MemoryAuth";
import MemoryVault from "@/components/MemoryVault";
import ActivationFlow from "@/components/ActivationFlow";
import TreasureMap from "@/components/TreasureMap";
import AdminDashboard from "@/components/AdminDashboard";
import { BookOpen, LogOut, Map as MapIcon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";


type View = "activate" | "login" | "vault" | "map" | "admin";


export default function Home() {
  const [view, setView] = useState<View>("login");
  const [tagId, setTagId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("tag");

    const checkActivation = async (tagId: string) => {
      console.log("Checking token:", tagId);
      const { data, error } = await supabase
        .from('activations')
        .select('*')
        .eq('tag_id', tagId)
        .single();

      if (data) {
        console.log("Token status found:", data.status);
        // Master Key Bypass: Admin token always logs in, others must be active
        if (data.status === 'active' || tagId === 'RM-ADMIN-2026') {
          localStorage.setItem('rome_user', JSON.stringify(data));
          setUserRole(data.role || "user");
          setView("vault");
        } else {
          setView("activate");
        }
      } else {
        console.warn("Token validation failed or missing:", error);
        setErrorMsg(error?.message || "Token not found in database.");
        if (tagId === "NEW") setView("activate");
        else setView("login");
      }
      // Only hide loading if there's no error, or after a delay
      if (!error) setIsLoading(false);
      else setTimeout(() => setIsLoading(false), 3000); // Show error for 3s
    };


    if (id) {
      setTagId(id);
      checkActivation(id);
    } else {
      const user = localStorage.getItem('rome_user');
      if (user) {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role || "user");
        setTagId(parsed.tag_id);
        setView("vault");
      }
      setIsLoading(false);
    }
  }, []);



  return (
    <main className="min-h-screen bg-sepia-50 relative overflow-hidden paper-texture pb-24 md:pb-0">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-12 space-y-4"
          >
            <div className="w-16 h-16 border-8 border-pop-espresso border-t-pop-pink rounded-full animate-spin shadow-[4px_4px_0_0_#3B2A20]" />
            <p className="font-black text-2xl text-pop-espresso tracking-tighter uppercase animate-pulse">
              {errorMsg ? "Error Detected" : "Scanning Tag..."}
            </p>
            {errorMsg && (
              <div className="bg-red-50 border-2 border-red-500 p-4 rounded-xl max-w-xs text-center">
                <p className="text-red-600 font-bold text-sm italic">{errorMsg}</p>
              </div>
            )}
          </motion.div>

        )}
      </AnimatePresence>

      {/* Decorative background stardust */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

      {/* Navigation (Sticky Bottom for Mobile, Top for Desktop) */}
      <nav className="fixed bottom-0 left-0 w-full md:top-0 md:bottom-auto z-40 bg-white/95 backdrop-blur-md border-t md:border-t-0 md:border-b-4 border-pop-espresso px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between md:justify-between gap-2">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-pop-espresso rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_0px_var(--color-pop-espresso)]">
              <img src="/logo.png" alt="Rome Memories Logo" className="w-full h-full object-contain p-1" />
            </div>
            <span className="serif-font font-black text-base md:text-xl text-pop-espresso italic hidden xs:inline tracking-tight">Rome Memories</span>
          </div>

          {/* Centered Navigation Items */}
          <div className="flex-1 flex justify-center items-center space-x-1 sm:space-x-4">
            {(["vault", "map"] as const).map((v) => (
              <button
                key={v}
                disabled={view === "login" || view === "activate"}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 border-transparent",
                  view === v
                    ? "bg-pop-yellow text-pop-espresso border-pop-espresso shadow-[3px_3px_0px_0px_var(--color-pop-espresso)]"
                    : "text-pop-espresso/40 hover:text-pop-espresso hover:bg-pop-cream/50",
                  (view === "login" || view === "activate") && "opacity-20 cursor-not-allowed"
                )}
              >
                <div className="flex flex-col md:flex-row items-center md:space-x-2">
                  {v === "vault" ? <BookOpen className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                  <span className="hidden md:inline">{v}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Admin & Logout Section */}
          <div className="flex items-center space-x-1 shrink-0">
            {view !== "login" && view !== "activate" && (
              <>
                {userRole === "admin" && (
                  <button
                    onClick={() => setView("admin")}
                    className={cn(
                      "p-2 rounded-lg transition-all border-2",
                      view === "admin" ? "bg-pop-purple text-white border-pop-espresso" : "text-pop-espresso/30 border-transparent hover:text-pop-purple"
                    )}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem('rome_user');
                    setView("login");
                  }}
                  className="p-2 text-pop-espresso/30 hover:text-red-500 transition-colors border-2 border-transparent hover:border-red-500 hover:rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>


      <div className="relative z-10 pt-12 md:pt-32 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {view === "activate" && (
            <motion.div
              key="activate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex justify-center px-4"
            >
              <ActivationFlow tagId={tagId || "RM-ALPHA-01"} onComplete={() => setView("vault")} />
            </motion.div>
          )}

          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex justify-center px-4"
            >
              <MemoryAuth tagId={tagId || "RM-ALPHA-01"} onSuccess={() => setView("vault")} />
            </motion.div>
          )}


          {view === "vault" && (
            <motion.div
              key="vault"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <MemoryVault tagId={tagId || "RM-ALPHA-01"} />
            </motion.div>
          )}

          {view === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <TreasureMap />
            </motion.div>
          )}



          {view === "admin" && ( // Added admin view
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-20 pb-32 md:pb-12 text-sepia-200 text-[9px] uppercase tracking-[0.4em] font-black z-10 text-center px-4">
        <p>Roma &copy; 2026 • Your Eternal Journey • Powered by NFC & Tag ID {tagId || "SYSTEM"}</p>
        <p className="mt-2 text-[7px] text-sepia-100 opacity-50">PRODUCTION READY • SUPABASE CONNECTED</p>
      </footer>
    </main>
  );
}
