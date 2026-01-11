"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Key, MapPin, Compass, CheckCircle, ArrowRight, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";


interface ActivationFlowProps {
    tagId: string;
    onComplete: () => void;
}

export default function ActivationFlow({ tagId, onComplete }: ActivationFlowProps) {
    const [step, setStep] = useState(1);
    const [passphrase, setPassphrase] = useState("");
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [isActivating, setIsActivating] = useState(false);
    const [isCheckingToken, setIsCheckingToken] = useState(true);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [tokenData, setTokenData] = useState<any>(null);

    useEffect(() => {
        checkToken();
    }, [tagId]);

    const checkToken = async () => {
        if (!tagId) return;
        const { data, error } = await supabase
            .from('activations')
            .select('*')
            .eq('tag_id', tagId)
            .single();

        if (error || !data) {
            setTokenError("Invalid or unregistered token.");
        } else if (data.status === 'active') {
            setTokenError("This token has already been activated.");
        } else {
            setTokenData(data);
        }
        setIsCheckingToken(false);
    };


    const handleActivate = async () => {
        setIsActivating(true);
        try {
            // Update the pre-existing token record
            const { error } = await supabase
                .from('activations')
                .update({
                    passphrase,
                    recovery_email: recoveryEmail,
                    status: 'active'
                })
                .eq('tag_id', tagId);

            if (error) {
                console.error("Activation Error:", error.message);
                throw error;
            }

            // Fetch final data to get role/tier correctly for localStorage
            const { data: userData } = await supabase
                .from('activations')
                .select('*')
                .eq('tag_id', tagId)
                .single();

            if (userData) {
                localStorage.setItem('rome_user', JSON.stringify(userData));
            }

            await new Promise(resolve => setTimeout(resolve, 800));
            setStep(3);
        } catch (error) {
            console.error(error);
        } finally {
            setIsActivating(false);
        }
    };




    if (isCheckingToken) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <div className="w-12 h-12 border-4 border-pop-espresso border-t-pop-pink rounded-full animate-spin" />
                <p className="font-black text-pop-espresso animate-pulse">VALIDATING TOKEN...</p>
            </div>
        );
    }

    if (tokenError) {
        return (
            <div className="nostalgic-card p-10 rounded-[40px] border-4 border-red-500 bg-white text-center space-y-4">
                <X className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-black text-pop-espresso">ACCESS DENIED</h2>
                <p className="text-pop-espresso/60">{tokenError}</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full py-3 bg-pop-espresso text-white font-black rounded-xl"
                >
                    Back to Entry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg">

            <div className="nostalgic-card p-10 rounded-[40px] relative overflow-hidden paper-texture">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col items-center text-center space-y-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-sepia-50 flex items-center justify-center border-2 border-dashed border-sepia-200">
                                <Compass className="w-10 h-10 text-sepia-400 animate-spin-slow" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl serif-font font-bold text-sepia-900 italic">Welcome to Rome</h2>
                                <p className="text-sepia-500 text-sm leading-relaxed px-4">
                                    You've just tapped a unique Roman memory tag. Ready to activate your digital vault?
                                </p>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-4 rounded-full bg-sepia-900 text-white font-bold flex items-center justify-center space-x-2 hover:bg-sepia-800 transition-all active:scale-95"
                            >
                                <span>Start Experience</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col space-y-8"
                        >
                            <div className="space-y-2">
                                <h2 className="text-2xl serif-font font-bold text-sepia-900">Secure Your Vault</h2>
                                <p className="text-sepia-500 text-xs uppercase tracking-widest font-bold">Tag ID: {tagId}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-sepia-300 ml-1">Choose a Passphrase</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sepia-300" />
                                        <input
                                            type="password"
                                            value={passphrase}
                                            onChange={(e) => setPassphrase(e.target.value)}
                                            placeholder="Your secret word"
                                            className="w-full bg-sepia-50/50 border-b-2 border-sepia-200 py-4 pl-12 pr-4 outline-none focus:border-accent-gold transition-colors serif-font italic text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-sepia-300 ml-1">Recovery Email (Optional)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sepia-300" />
                                            <input
                                                type="email"
                                                value={recoveryEmail}
                                                onChange={(e) => setRecoveryEmail(e.target.value)}
                                                placeholder="recovery@email.com"
                                                className="w-full bg-sepia-50/50 border-b-2 border-sepia-200 py-3 pl-12 pr-4 outline-none focus:border-accent-gold transition-colors text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 text-[10px] text-sepia-300 bg-sepia-50/50 p-3 rounded-xl border border-dashed border-sepia-200">
                                        <Key className="w-3 h-3 text-accent-gold" />
                                        <span>This passphrase + email will be your permanent key.</span>
                                    </div>
                                </div>

                            </div>

                            <button
                                disabled={!passphrase || isActivating}
                                onClick={handleActivate}
                                className={cn(
                                    "w-full py-4 rounded-full bg-sepia-900 text-white font-bold transition-all active:scale-95",
                                    (isActivating || !passphrase) && "opacity-50"
                                )}
                            >
                                {isActivating ? "Activating Tag..." : "Activate My Tag"}
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center space-y-6 py-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-200">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl serif-font font-bold text-sepia-900 italic">Success!</h2>
                                <p className="text-sepia-500 text-sm leading-relaxed">
                                    Your Roman journey is now connected. You can now save memories and claim perks across the city.
                                </p>
                            </div>
                            <button
                                onClick={onComplete}
                                className="w-full py-4 rounded-full bg-sepia-900 text-white font-bold hover:bg-sepia-800 transition-all active:scale-95"
                            >
                                Enter My Vault
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4 opacity-30 grayscale pointer-events-none">
                <MapPin className="w-4 h-4" />
                <div className="h-px w-8 bg-sepia-200" />
                <Compass className="w-4 h-4" />
                <div className="h-px w-8 bg-sepia-200" />
                <Sparkles className="w-4 h-4" />
            </div>
        </div>
    );
}
