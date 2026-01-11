"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, Calendar, MessageSquare, ExternalLink, X, Plus, Sparkles, Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import DailySecret from "./DailySecret";
import TravelDashboard from "./TravelDashboard";
import { supabase } from "@/lib/supabase";





interface Memory {
    id: number;
    location: string;
    date: string;
    content: string;
    type: "note" | "photo";
    images?: string[]; // Support multiple images per card
    color?: string;
}



// Removed mock memories to use Supabase exclusively



interface MemoryVaultProps {
    tagId: string;
}

export default function MemoryVault({ tagId }: MemoryVaultProps) {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [newMemory, setNewMemory] = useState({
        location: "",
        content: "",
        type: "note" as "note" | "photo"
    });
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            // Auto-switch to photo type
            setNewMemory(prev => ({ ...prev, type: 'photo' }));

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImages(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };


    useEffect(() => {
        fetchMemories();
    }, [tagId]);

    const fetchMemories = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('memories')
                .select('*')
                .eq('tag_id', tagId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                setMemories(data.map(m => ({
                    id: m.id,
                    location: m.location,
                    date: new Date(m.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    content: m.content,
                    type: m.type as "note" | "photo",
                    images: m.images_urls || [] // Fetch array of images
                })));

            }
        } catch (err) {
            console.error("Error fetching memories:", err);
            setMemories([]); // Fallback
        } finally {
            setIsLoading(false);
        }
    };




    const handleAddMemory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            let newMemories: Memory[] = [];

            if (newMemory.type === 'photo' && previewImages.length > 0) {
                newMemories = [{
                    id: Date.now(),
                    location: newMemory.location || "Unknown Location",
                    date,
                    content: newMemory.content,
                    type: "photo",
                    images: previewImages // Group all images into one memory
                }];
            } else {
                newMemories = [{
                    id: Date.now(),
                    location: newMemory.location || "Unknown Location",
                    date,
                    content: newMemory.content,
                    type: newMemory.type,
                }];
            }


            // Production Save to Supabase
            const { error } = await supabase.from('memories').insert(newMemories.map(m => ({
                tag_id: tagId,
                location: m.location,
                content: m.content,
                type: m.type,
                images_urls: m.images || [], // Ensure images_urls are saved
                created_at: new Date().toISOString()
            })));

            if (error) {
                console.warn("Supabase Sync Warning:", error.message);
                throw error; // Let Catch handle it
            }



            setMemories([...newMemories, ...memories]);

            setIsAdding(false);
            setNewMemory({ location: "", content: "", type: "note" });
            setPreviewImages([]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <div className="w-full max-w-6xl space-y-12 px-4 md:px-8 pb-32">

            {/* Header Section */}
            <div className="relative border-b-4 border-pop-espresso pb-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2 relative z-10">
                        <div className="inline-block bg-pop-orange border-2 border-pop-espresso px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_var(--color-pop-espresso)] transform -rotate-1">
                            <div className="flex items-center space-x-2 text-pop-espresso text-[10px] font-black uppercase tracking-widest">
                                <Calendar className="w-3 h-3" />
                                <span>Summer 2026 Edition</span>
                            </div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-pop-espresso tracking-tighter leading-none drop-shadow-sm">
                            ROME<br /><span className="text-pop-pink">VAULT</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 relative z-10 w-full md:w-auto">
                        <button className="pop-button flex-1 md:flex-none px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white text-sm">
                            <Share2 className="w-4 h-4" />
                            <span>SHARE</span>
                        </button>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-pop-pink text-pop-espresso font-black flex-1 md:flex-none px-6 py-3 rounded-xl border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-pop-espresso)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5 bg-white rounded-full border-2 border-pop-espresso p-0.5" />
                            <span className="whitespace-nowrap">ADD MEMORY</span>
                        </button>
                    </div>

                </div>

                {/* Decorative Elements */}
                <Sparkles className="absolute top-0 right-1/4 w-12 h-12 text-pop-yellow animate-pulse" />
                <div className="absolute -bottom-6 left-12 w-32 h-4 bg-pop-green border-2 border-pop-espresso transform rotate-2"></div>
            </div>

            <div className="flex flex-col space-y-12 items-center w-full">
                <TravelDashboard />
                <DailySecret />




                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    <AnimatePresence mode="popLayout">
                        {memories.map((memory, index) => {
                            // Cycling Colors for "Rainbow" effect
                            const bgColors = ['bg-pop-pink', 'bg-pop-green', 'bg-pop-yellow', 'bg-pop-blue', 'bg-pop-purple'];
                            const rotateClass = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
                            const bgColor = bgColors[index % bgColors.length];

                            return (
                                <motion.div
                                    key={memory.id}
                                    initial={{ opacity: 0, y: 50, rotate: 5 }}
                                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.1 }}
                                    layout
                                    className="group cursor-pointer relative"
                                >
                                    {/* Tape / Sticker Effect */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-100/80 backdrop-blur-sm border border-white/40 shadow-sm transform -rotate-2 z-20"></div>

                                    <div className={`pop-card p-6 rounded-2xl h-full flex flex-col space-y-4 ${rotateClass} hover:rotate-0 hover:scale-105 transition-transform duration-300 relative overflow-hidden`} >
                                        {/* Color Background Wash */}
                                        <div className={`absolute inset-0 opacity-20 ${bgColor} z-0`}></div>

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="bg-white border-2 border-pop-espresso px-2 py-1 rounded-md shadow-sm transform -rotate-2">
                                                <div className="flex items-center space-x-1 text-pop-espresso">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{memory.location}</span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                {memory.type === 'photo' && <div className="bg-pop-orange text-white p-1 rounded-full border-2 border-pop-espresso"><Camera className="w-3 h-3" /></div>}
                                            </div>
                                        </div>

                                        {memory.type === 'photo' && (
                                            <div className="w-full bg-white p-1 pb-4 border-2 border-pop-espresso shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] transform rotate-1 relative z-10 group-hover:rotate-0 transition-transform">
                                                {memory.images && memory.images.length > 0 ? (
                                                    <div className={cn(
                                                        "grid gap-1",
                                                        memory.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                                                    )}>
                                                        {memory.images.map((img, i) => (
                                                            <div key={i} className={cn(
                                                                "relative aspect-square overflow-hidden bg-gray-100 border border-black/10",
                                                                memory.images?.length === 3 && i === 0 ? "col-span-2 aspect-video" : ""
                                                            )}>
                                                                <img src={img} alt={memory.location} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="aspect-[4/3] flex items-center justify-center text-pop-espresso/30 flex-col space-y-2 bg-gray-100">
                                                        <Camera className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex-grow relative z-10 pt-2">
                                            <p className="font-bold text-pop-espresso leading-relaxed text-lg" style={{ fontFamily: '"Comic Neue", "cursive", sans-serif' }}>
                                                "{memory.content}"
                                            </p>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between border-t-2 border-pop-espresso/10 border-dashed relative z-10">
                                            <span className="text-xs font-black bg-white px-2 py-1 border border-pop-espresso rounded-full text-pop-espresso">{memory.date}</span>
                                            <button className="text-pop-espresso hover:text-pop-pink transition-colors">
                                                <Share2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>


                {/* Add Memory Modal */}
                <AnimatePresence>
                    {isAdding && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-sepia-900/60 backdrop-blur-md">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="w-full max-w-md bg-white rounded-2xl md:rounded-[40px] p-5 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] border-4 border-pop-espresso"

                            >

                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sepia-300 via-accent-gold to-sepia-300" />

                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full hover:bg-sepia-50 text-sepia-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>


                                <form onSubmit={handleAddMemory} className="space-y-6">
                                    <div className="text-center space-y-2 pt-4">
                                        <div className="w-12 h-12 rounded-2xl bg-pop-yellow flex items-center justify-center mx-auto mb-4 border-2 border-pop-espresso shadow-[2px_2px_0px_0px_var(--color-pop-espresso)]">
                                            <Sparkles className="w-6 h-6 text-pop-espresso" />
                                        </div>
                                        <h3 className="text-2xl font-black text-pop-espresso uppercase tracking-tight">Capture a Moment</h3>
                                        <div className="inline-block bg-pop-green px-3 py-1 rounded-full border-2 border-pop-espresso text-[10px] font-black uppercase tracking-widest text-pop-espresso">
                                            Tag #{tagId}
                                        </div>
                                    </div>


                                    <div className="space-y-4">
                                        <div className="flex p-1 bg-sepia-50 rounded-2xl border border-sepia-100">
                                            <button
                                                type="button"
                                                onClick={() => setNewMemory({ ...newMemory, type: 'note' })}
                                                className={cn(
                                                    "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                                    newMemory.type === 'note' ? "bg-white text-sepia-900 shadow-sm" : "text-sepia-300"
                                                )}
                                            >
                                                Quick Note
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewMemory({ ...newMemory, type: 'photo' })}
                                                className={cn(
                                                    "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                                    newMemory.type === 'photo' ? "bg-white text-sepia-900 shadow-sm" : "text-sepia-300"
                                                )}
                                            >
                                                Photo & Text
                                            </button>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {newMemory.type === 'photo' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <label className="w-full aspect-video bg-sepia-50 border-2 border-dashed border-sepia-200 rounded-2xl flex flex-col items-center justify-center space-y-2 group hover:border-accent-gold transition-colors cursor-pointer mb-2 overflow-hidden relative">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            onChange={handleImageChange}
                                                        />
                                                        {previewImages.length > 0 ? (
                                                            <div className="grid grid-cols-2 gap-1 w-full h-full p-2">
                                                                {previewImages.slice(0, 4).map((img, i) => (
                                                                    <div key={i} className="relative aspect-square">
                                                                        <img src={img} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                                                        {i === 3 && previewImages.length > 4 && (
                                                                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white font-bold">
                                                                                +{previewImages.length - 4}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Camera className="w-8 h-8 text-sepia-300 group-hover:text-accent-gold transition-colors" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-sepia-400">Tap to Upload Photo(s)</span>
                                                            </>
                                                        )}
                                                    </label>


                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-sepia-300 ml-1">Where are you?</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sepia-200" />
                                                <input
                                                    required
                                                    value={newMemory.location}
                                                    onChange={(e) => setNewMemory({ ...newMemory, location: e.target.value })}
                                                    placeholder="Piazza Navona..."
                                                    className="w-full bg-sepia-50/30 border border-sepia-100 rounded-2xl py-3 pl-10 pr-4 outline-none focus:border-accent-gold transition-colors text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-sepia-300 ml-1">The Memory</label>
                                            <textarea
                                                required
                                                value={newMemory.content}
                                                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                                                placeholder="Write your feelings here..."
                                                className="w-full bg-sepia-50/30 border border-sepia-100 rounded-2xl py-4 px-4 h-32 outline-none focus:border-accent-gold transition-colors text-sm resize-none serif-font italic text-lg"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full py-4 rounded-xl bg-pop-yellow text-pop-espresso font-black uppercase tracking-widest border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-pop-espresso)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center space-x-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <span>Save to My Vault</span>
                                        )}
                                    </button>


                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="text-center pt-12 pb-20">
                    <p className="text-sepia-300 text-[10px] font-black tracking-[0.4em] uppercase">
                        Souvenir ID: RM-772-BX-2026
                    </p>
                </div>
            </div>
        </div>
    );
}
