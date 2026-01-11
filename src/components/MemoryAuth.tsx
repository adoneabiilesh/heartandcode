"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Heart, Camera, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";


interface MemoryAuthProps {
    onSuccess: () => void;
    tagId: string;
}

export default function MemoryAuth({ onSuccess, tagId }: MemoryAuthProps) {
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Check credentials against Supabase 'activations' table
            const { data, error: dbError } = await supabase
                .from('activations')
                .select('*')
                .eq('tag_id', tagId)
                .eq('passphrase', passkey)
                .single();

            if (dbError || !data) {
                // Fallback for developers/demo - use ID for role
                if (passkey === "ROME2026") {
                    const demoUser = { tag_id: tagId, role: tagId.includes('ADMIN') ? 'admin' : 'user', tier: 'premium' };
                    localStorage.setItem('rome_user', JSON.stringify(demoUser));
                    onSuccess();
                } else {
                    setError(true);
                    setTimeout(() => setError(false), 2000);
                }
            } else {
                localStorage.setItem('rome_user', JSON.stringify(data));
                onSuccess();
            }

        } catch (err) {
            console.error("Auth Error:", err);
            // Emergency fallback for demo
            if (passkey === "ROME2026") onSuccess();
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
        >
            <div className="nostalgic-card p-12 rounded-[40px] relative overflow-hidden paper-texture">
                <div className="absolute top-0 left-0 w-full h-1 bg-sepia-300" />

                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-20 h-20 rounded-full bg-sepia-100 flex items-center justify-center border-2 border-dashed border-sepia-300">
                        <Heart className="w-10 h-10 text-sepia-600" />
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl serif-font font-bold text-sepia-900 italic">
                            Rome <span className="text-sepia-500">Memories</span>
                        </h1>
                        <p className="text-sepia-600/80 text-sm leading-relaxed max-w-sm mx-auto">
                            Scan your physical souvenir to open your digital memory box from the Eternal City.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-sepia-400 block ml-1">
                                Security Passphrase
                            </label>
                            <input
                                type="password"
                                value={passkey}
                                onChange={(e) => setPasskey(e.target.value)}
                                placeholder="Ex: ROME2026"
                                className={cn(
                                    "w-full bg-sepia-50/50 border-b-2 border-sepia-200 py-4 px-2 outline-none transition-all duration-500 serif-font italic text-xl",
                                    "focus:border-sepia-500 placeholder:text-sepia-200",
                                    error && "border-red-400"
                                )}
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            className={cn(
                                "w-full py-5 rounded-full bg-sepia-900 text-white font-bold flex items-center justify-center space-x-3 transition-all duration-300 hover:bg-sepia-800 active:scale-95",
                                isLoading && "opacity-50"
                            )}
                        >
                            <span>{isLoading ? "Opening..." : "Open My Vault"}</span>
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="pt-4 flex items-center justify-center space-x-6">
                        <div className="flex flex-col items-center space-y-1">
                            <Camera className="w-4 h-4 text-sepia-300" />
                            <span className="text-[8px] text-sepia-300 uppercase font-black tracking-widest">Photos</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                            <MapPin className="w-4 h-4 text-sepia-300" />
                            <span className="text-[8px] text-sepia-300 uppercase font-black tracking-widest">Places</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-red-600 text-[10px] mt-6 text-center font-bold uppercase tracking-widest"
                    >
                        Access Denied. Check your tag or souvenir.
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
