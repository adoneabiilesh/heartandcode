"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Star, MapPin, X, QrCode, Timer, ShieldCheck, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { partners, Partner } from "@/data/partners";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function PerksSection() {
    const [partnersList, setPartnersList] = useState<Partner[]>(partners);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [securitySalt, setSecuritySalt] = useState(Math.random().toString(36).substring(7));
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const fetchPartners = async () => {
            const { data } = await supabase.from('partners').select('*');
            if (data && data.length > 0) {
                setPartnersList(data);
            }
        };
        fetchPartners();
    }, []);

    // Timer logic for the active perk
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (selectedPartner && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setSelectedPartner(null); // Close if expired
        }
        return () => clearInterval(interval);
    }, [selectedPartner, timeLeft]);

    // Security Salt rotation logic
    useEffect(() => {
        const saltInterval = setInterval(() => {
            setIsRefreshing(true);
            setSecuritySalt(Math.random().toString(36).substring(7));
            setTimeout(() => setIsRefreshing(false), 500);
        }, 30000); // Rotate every 30 seconds
        return () => clearInterval(saltInterval);
    }, []);

    const handleOpenPerk = (partner: Partner) => {
        setSelectedPartner(partner);
        setTimeLeft(300); // Reset timer on open
    };


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-5xl space-y-12 px-6">
            <div className="flex flex-col space-y-2 border-b-4 border-pop-espresso pb-8">
                <h2 className="text-4xl md:text-5xl font-black text-pop-espresso uppercase tracking-tighter">Roman Perks</h2>
                <p className="text-pop-espresso font-bold text-sm italic mr-auto opacity-60">Show your digital pass at these partner locations for exclusive benefits.</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partnersList.map((partner) => (
                    <motion.div
                        key={partner.id}
                        whileHover={{ y: -5, rotate: 1 }}
                        className="bg-white p-6 rounded-2xl flex flex-col space-y-4 cursor-pointer group border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)] hover:shadow-[8px_8px_0px_0px_var(--color-pop-espresso)] transition-all"
                        onClick={() => handleOpenPerk(partner)}
                    >

                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-xl bg-pop-cream border-2 border-pop-espresso text-pop-espresso shadow-[2px_2px_0px_0px_var(--color-pop-espresso)]">
                                <Utensils className="w-6 h-6" />
                            </div>

                            <div className="flex items-center space-x-1 text-pop-orange">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-black">{partner.rating}</span>
                            </div>

                        </div>

                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-pop-espresso uppercase tracking-tight leading-none">{partner.name}</h3>
                            <div className="flex items-center space-x-1 text-pop-espresso opacity-40 text-[10px] font-black uppercase tracking-widest">
                                <MapPin className="w-3 h-3" />
                                <span>{partner.location}</span>
                            </div>
                        </div>


                        <p className="text-pop-espresso text-sm font-medium leading-relaxed line-clamp-2 italic">
                            {partner.description}
                        </p>


                        <div className="pt-4 flex items-center justify-between border-t-2 border-pop-espresso/10 border-dashed">
                            <span className="text-pop-pink font-black uppercase tracking-tight text-lg">{partner.discount}</span>
                            <span className="bg-pop-yellow px-3 py-1 rounded-lg border-2 border-pop-espresso text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--color-pop-espresso)] group-hover:translate-y-[-2px] transition-transform">
                                Claim Perk
                            </span>
                        </div>

                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedPartner && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-sepia-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm bg-white rounded-[32px] md:rounded-[40px] p-8 relative shadow-2xl border-4 border-pop-espresso"
                        >

                            <button
                                onClick={() => setSelectedPartner(null)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-sepia-50 text-sepia-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-6 pt-4">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-2 bg-pop-green px-3 py-1 rounded-full border-2 border-pop-espresso mb-2">
                                        <Timer className={cn("w-3 h-3 text-pop-espresso", timeLeft < 60 && "text-red-500 animate-pulse")} />
                                        <span className={cn("text-[10px] font-black tracking-widest text-pop-espresso uppercase", timeLeft < 60 && "text-red-500")}>
                                            Expires in {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-pop-espresso uppercase tracking-tight">{selectedPartner.name}</h3>
                                </div>


                                <div className="relative">
                                    <div className="bg-white p-6 rounded-3xl border-4 border-dashed border-pop-espresso shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                        <QRCodeSVG
                                            // The URL includes a dynamic salt to prevent unauthorized reuse
                                            value={`https://romememories.com/verify/${selectedPartner.id}?salt=${securitySalt}`}
                                            size={200}
                                            fgColor="#4E3625"
                                            includeMargin={true}
                                        />
                                    </div>

                                    <motion.div
                                        animate={{ opacity: isRefreshing ? 1 : 0 }}
                                        className="absolute inset-0 bg-white/50 backdrop-blur-[2px] rounded-3xl flex items-center justify-center pointer-events-none"
                                    >
                                        <RefreshCw className="w-8 h-8 text-sepia-400 animate-spin" />
                                    </motion.div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col items-center space-y-1">
                                        <div className="flex items-center space-x-2 text-[8px] font-black tracking-widest text-pop-espresso opacity-40 uppercase">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span>Security Key: {securitySalt.toUpperCase()}</span>
                                        </div>
                                        <p className="text-pop-espresso text-[10px] uppercase font-black tracking-widest">Show to Waiter</p>
                                    </div>

                                    <div className="flex items-center space-x-2 bg-pop-pink px-4 py-3 rounded-xl border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)]">
                                        <QrCode className="w-5 h-5 text-pop-espresso" />
                                        <span className="text-pop-espresso font-black uppercase tracking-tight text-lg">{selectedPartner.discount} Applied</span>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
