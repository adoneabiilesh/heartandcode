"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Star, Camera, MessageSquare, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";


interface MemoryPin {
    id: number;
    x: number; // percentage from left
    y: number; // percentage from top
    title: string;
    type: 'photo' | 'note';
    content: string;
}

const mockPins: MemoryPin[] = [
    { id: 1, x: 42, y: 58, title: "Trastevere", type: 'note', content: "The best pasta carbonara we've ever had." },
    { id: 2, x: 55, y: 42, title: "Trevi Fountain", type: 'photo', content: "Tossed a coin! Making a wish." },
    { id: 3, x: 62, y: 48, title: "Colosseum", type: 'photo', content: "Early morning tour. Breathtaking scale." },
];

export default function TreasureMap() {
    const [selectedPin, setSelectedPin] = useState<MemoryPin | null>(null);
    const [pins, setPins] = useState<MemoryPin[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPins();
    }, []);

    const fetchPins = async () => {
        try {
            // In a real app, we'd fetch actual locations. 
            // For now, we fetch real memory titles to populate the map pins.
            const { data, error } = await supabase
                .from('memories')
                .select('*')
                .limit(10);

            if (data) {
                // Map real memories to random positions for visualization if locations are not geotagged
                setPins(data.map((m, i) => ({
                    id: m.id,
                    x: 30 + (Math.random() * 40),
                    y: 30 + (Math.random() * 40),
                    title: m.location,
                    type: m.type as 'photo' | 'note',
                    content: m.content
                })));
            }
        } catch (err) {
            console.error("Pin fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="w-full max-w-5xl px-6 pb-24">
            <div className="flex flex-col space-y-2 border-b border-sepia-200 pb-8 mb-8">
                <h2 className="text-3xl serif-font font-bold text-sepia-900">Treasure Map</h2>
                <p className="text-sepia-500 text-sm italic">Follow your journey through the Eternal City.</p>
            </div>

            <div className="relative aspect-[4/3] w-full bg-pop-green/20 rounded-2xl border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)] overflow-hidden group">
                {/* Illustrated Map Background */}
                <div className="absolute inset-0 opacity-40 pointer-events-none z-0"
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-map.png")' }} />

                {/* Landmark Illustrations (Abstract but Cartoonish - Pop Style) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute top-[45%] left-[60%] w-32 h-32 opacity-80 text-pop-pink"
                    >
                        <svg viewBox="0 0 100 100" fill="currentColor">
                            <path d="M10 80 L50 20 L90 80 Z" />
                        </svg>
                    </motion.div>
                    <div className="absolute top-[20%] left-[30%] text-[80px] text-pop-espresso/10 font-black italic -rotate-12">ROMA</div>
                </div>

                {/* Tiber River Illustrated - Pop Blue */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                        d="M 30,0 Q 35,20 45,40 T 50,70 T 45,100"
                        fill="none"
                        stroke="#A0C4FF"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </svg>



                {/* Memory Pins */}
                {pins.map((pin) => (
                    <motion.button
                        key={pin.id}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        onClick={() => setSelectedPin(pin)}
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -inset-4 bg-pop-pink/10 rounded-full blur-xl"
                            />
                            <div className="relative bg-white text-pop-espresso p-2 md:p-3 rounded-full shadow-lg border-2 border-pop-espresso group-hover:bg-pop-pink group-hover:text-white transition-colors duration-300">
                                {pin.type === 'photo' ? <Camera className="w-4 h-4 md:w-5 md:h-5" /> : <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />}
                            </div>
                        </div>
                    </motion.button>
                ))}


                {/* Decorative Sun */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-8 left-8 text-accent-gold/20"
                >
                    <Sun className="w-16 h-16" />
                </motion.div>

                {/* Legend */}
                <div className="absolute bottom-10 right-10 bg-white border-4 border-pop-espresso p-4 rounded-xl shadow-[4px_4px_0px_0px_var(--color-pop-espresso)] z-30 transform -rotate-1">
                    <h4 className="text-[12px] font-black uppercase tracking-widest text-pop-espresso mb-2">Pop Guide</h4>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-4 h-4 bg-pop-pink rounded-sm border-2 border-pop-espresso" />
                        <span className="text-[10px] font-bold uppercase text-pop-espresso tracking-widest">Memory</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-pop-orange rounded-sm border-2 border-pop-espresso" />
                        <span className="text-[10px] font-bold uppercase text-pop-espresso tracking-widest">You</span>
                    </div>
                </div>

            </div>


            <AnimatePresence>
                {selectedPin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-sepia-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-sm nostalgic-card bg-white rounded-[40px] p-8 relative paper-texture shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedPin(null)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-sepia-50 text-sepia-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-sepia-50 flex items-center justify-center border-2 border-accent-gold">
                                    {selectedPin.type === 'photo' ? <Camera className="w-8 h-8 text-accent-gold" /> : <MessageSquare className="w-8 h-8 text-accent-gold" />}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-sepia-900 serif-font italic">{selectedPin.title}</h3>
                                    <p className="text-sepia-600 serif-font italic leading-relaxed">"{selectedPin.content}"</p>
                                </div>

                                <button
                                    onClick={() => setSelectedPin(null)}
                                    className="w-full py-4 rounded-full bg-sepia-900 text-white font-bold hover:bg-sepia-800 transition-all active:scale-95"
                                >
                                    Close Treasure
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
