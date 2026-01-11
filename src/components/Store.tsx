"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ShoppingBag, CreditCard, CheckCircle, Sparkles, X, Info, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: "TAG" | "SOUVENIR" | "MAP";
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Classic Roman Tag",
        description: "The original NFC-enabled marble chip for your eternal memories.",
        price: 0,
        image: "https://images.unsplash.com/photo-1516483642773-2f66ba7c1141?auto=format&fit=crop&w=800&q=80",
        category: "TAG"
    },
    {
        id: 2,
        name: "Golden Tiber Medallion",
        description: "Brass-plated NFC souvenir featuring the river god Tiberinus.",
        price: 0,
        image: "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=800&q=80",
        category: "SOUVENIR"
    },
    {
        id: 3,
        name: "Augmented Reality Map",
        description: "A physical hand-drawn map that unlocks 3D Roman landmarks.",
        price: 0,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80",
        category: "MAP"
    },
    {
        id: 4,
        name: "Colosseum Echo Tag",
        description: "Special edition tag with pre-loaded audio guides for the Forum.",
        price: 0,
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
        category: "TAG"
    }
];

export default function Store() {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseComplete, setPurchaseComplete] = useState(false);
    const [userTier, setUserTier] = useState<string>("standard");

    const [tagId, setTagId] = useState<string>("");


    useEffect(() => {
        const user = localStorage.getItem('rome_user');
        if (user) {
            const parsed = JSON.parse(user);
            setUserTier(parsed.tier || "standard");
            setTagId(parsed.tag_id || "");
        }

        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*');
        if (data && data.length > 0) {
            setProducts(data);
        }
    };

    const handlePurchase = async () => {
        if (!selectedProduct || !tagId) return;

        setIsPurchasing(true);

        try {
            // Record the claim in Supabase
            const { error } = await supabase.from('claims').insert({
                tag_id: tagId,
                product_id: selectedProduct.id,
                status: 'pending' // Admin can later mark as 'shipped'
            });

            if (error) throw error;

            setPurchaseComplete(true);
        } catch (error) {
            console.error("Claim Error:", error);
            alert("Failed to claim product. Please try again.");
        } finally {
            setIsPurchasing(false);
        }
    };


    const closeAll = () => {
        setSelectedProduct(null);
        setPurchaseComplete(false);
    };

    return (
        <div className="w-full max-w-6xl space-y-12 px-4 md:px-8 pb-32">
            {/* Header */}
            <div className="relative border-b-4 border-pop-espresso pb-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2 relative z-10">
                        <div className="inline-block bg-pop-yellow border-2 border-pop-espresso px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_var(--color-pop-espresso)] transform -rotate-1">
                            <div className="flex items-center space-x-2 text-pop-espresso text-[10px] font-black uppercase tracking-widest">
                                <ShoppingBag className="w-3 h-3" />
                                <span>Official Merchant</span>
                            </div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-pop-espresso tracking-tighter leading-none drop-shadow-sm">
                            NFC<br /><span className="text-pop-blue">MARKET</span>
                        </h2>
                    </div>
                </div>
                <Sparkles className="absolute top-0 right-1/4 w-12 h-12 text-pop-pink animate-pulse" />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedProduct(product)}
                        className="pop-card group cursor-pointer bg-white p-4 rounded-3xl border-4 border-pop-espresso shadow-[8px_8px_0px_0px_var(--color-pop-espresso)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_var(--color-pop-espresso)] transition-all overflow-hidden"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-pop-espresso mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-pop-green text-pop-espresso border-2 border-pop-espresso px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--color-pop-espresso)]">
                                {product.category}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-pop-espresso leading-tight">{product.name}</h3>
                            <p className="text-pop-espresso/60 text-xs font-medium line-clamp-2">{product.description}</p>
                            <div className="pt-2 flex items-center justify-between">
                                <span className="text-2xl font-black text-pop-blue">
                                    {(userTier === 'premium' || userTier === 'gold') ? "FREE" : `$${product.price || 49}`}
                                </span>
                                <div className="bg-pop-pink p-2 rounded-xl border-2 border-pop-espresso shadow-[2px_2px_0px_0px_var(--color-pop-espresso)] group-hover:bg-pop-yellow transition-colors">
                                    <ShoppingBag className="w-4 h-4 text-pop-espresso" />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>

            {/* Purchase Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-pop-espresso/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-white rounded-3xl border-4 border-pop-espresso p-8 shadow-[12px_12px_0px_0px_var(--color-pop-espresso)] relative overflow-hidden"
                        >
                            {!purchaseComplete ? (
                                <div className="space-y-6">
                                    <button onClick={closeAll} className="absolute top-4 right-4 p-2 hover:bg-pop-cream rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="w-16 h-16 bg-pop-blue border-2 border-pop-espresso rounded-2xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_var(--color-pop-espresso)]">
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-black text-pop-espresso">Claim your {selectedProduct.category}</h3>
                                        <p className="text-sm text-pop-espresso/60 px-4">This NFC-enabled product will be linked to your digital vault for eternity.</p>
                                    </div>
                                    <div className="bg-pop-cream/30 border-2 border-pop-espresso p-4 rounded-2xl border-dashed">
                                        <div className="flex justify-between items-center font-black text-pop-espresso">
                                            <span>Subtotal</span>
                                            <span className={cn((userTier === 'premium' || userTier === 'gold') && "line-through opacity-30")}>
                                                ${selectedProduct.price || 49}.00
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center font-black text-2xl text-pop-green">
                                            <span>Total</span>
                                            <span>
                                                {(userTier === 'premium' || userTier === 'gold') ? "$0.00" : `$${selectedProduct.price || 49}.00`}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePurchase}
                                        disabled={isPurchasing}
                                        className="w-full py-4 rounded-xl bg-pop-green text-pop-espresso font-black border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-pop-espresso)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                                    >
                                        {isPurchasing ? "Processing..." : "Claim For Free"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center space-y-6 py-4">
                                    <div className="w-20 h-20 rounded-full bg-pop-green flex items-center justify-center border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)]">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-pop-espresso italic">EUREKA!</h2>
                                        <p className="text-pop-espresso/60 text-sm leading-relaxed px-4">
                                            Your {selectedProduct.name} is on its way. Use your NFC device to scan it when it arrives!
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeAll}
                                        className="w-full py-4 rounded-xl bg-pop-espresso text-white font-black hover:bg-black transition-all"
                                    >
                                        Back to Store
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
