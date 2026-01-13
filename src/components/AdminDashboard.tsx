"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Plus, Edit, Trash2, Save, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const [tokens, setTokens] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"tokens">("tokens");
    const [isEditing, setIsEditing] = useState<number | string | null>(null);
    const [editData, setEditData] = useState<any>({});
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data } = await supabase.from('activations').select('*');
        setTokens(data || []);
    };

    const handleEdit = (item: any) => {
        setIsEditing(item.tag_id);
        setEditData(item);
    };

    const handleSave = async () => {
        const payload = { ...editData };

        if (isAdding) {
            await supabase.from('activations').insert(payload);
        } else {
            await supabase.from('activations').update(payload).eq('tag_id', isEditing);
        }

        setIsEditing(null);
        setIsAdding(false);
        fetchData();
    };

    const handleDelete = async (id: any) => {
        await supabase.from('activations').delete().eq('tag_id', id);
        fetchData();
    };

    return (
        <div className="w-full max-w-6xl space-y-12 px-4 md:px-8 pb-32">
            {/* Header */}
            <div className="relative border-b-4 border-pop-espresso pb-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2 relative z-10">
                        <div className="inline-block bg-pop-pink border-2 border-pop-espresso px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_var(--color-pop-espresso)] transform -rotate-1">
                            <div className="flex items-center space-x-2 text-pop-espresso text-[10px] font-black uppercase tracking-widest">
                                <Settings className="w-3 h-3" />
                                <span>Control Center</span>
                            </div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-pop-espresso tracking-tighter leading-none drop-shadow-sm">
                            ADMIN<br /><span className="text-pop-purple">PANEL</span>
                        </h2>
                    </div>

                    <div className="flex bg-pop-espresso/10 p-1 rounded-2xl border-2 border-pop-espresso">
                        <button
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-tighter transition-all bg-pop-yellow text-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)]"
                        >
                            <Tag className="w-4 h-4" />
                            <span>Tokens</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* CRUD Section */}
            <div className="bg-white border-4 border-pop-espresso rounded-[40px] shadow-[12px_12px_0px_0px_var(--color-pop-espresso)] overflow-hidden">
                <div className="p-6 border-b-4 border-pop-espresso flex justify-between items-center bg-pop-cream/30">
                    <h3 className="text-2xl font-black text-pop-espresso uppercase tracking-tighter">
                        Manage Tokens
                    </h3>
                    <button
                        onClick={() => { setIsAdding(true); setEditData({}); setIsEditing(0); }}
                        className="bg-pop-green text-pop-espresso p-2 rounded-xl border-2 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-pop-espresso text-white uppercase text-[10px] font-black tracking-widest">
                                <th className="px-6 py-4">Tag ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Metric</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-pop-espresso/10">
                            {tokens.map((item: any) => (
                                <tr key={item.tag_id} className="hover:bg-pop-cream/10 transition-colors">
                                    <td className="px-6 py-6 font-black text-pop-espresso">{item.tag_id}</td>
                                    <td className="px-6 py-6 text-sm text-pop-espresso/60">
                                        {item.status}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="inline-flex items-center gap-1 bg-pop-yellow px-2 py-1 rounded-lg border-2 border-pop-espresso text-[10px] font-black uppercase">
                                            <Tag className="w-3 h-3" />
                                            {item.tier}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right space-x-2">
                                        <button onClick={() => handleEdit(item)} className="p-2 border-2 border-pop-espresso rounded-lg hover:bg-pop-blue hover:text-white transition-all">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.tag_id)} className="p-2 border-2 border-pop-espresso rounded-lg hover:bg-pop-pink hover:text-white transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing !== null && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-pop-espresso/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border-4 border-pop-espresso rounded-[40px] p-8 w-full max-w-lg shadow-[16px_16px_0px_0px_var(--color-pop-espresso)]"
                        >
                            <div className="flex justify-between items-center mb-8 border-b-2 border-pop-espresso pb-4">
                                <h4 className="text-3xl font-black text-pop-espresso uppercase tracking-tighter">
                                    {isAdding ? "Add" : "Edit"} Token
                                </h4>
                                <button onClick={() => setIsEditing(null)}><X className="w-6 h-6" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-pop-espresso opacity-40 ml-1">Tag ID (The Physical Token)</label>
                                    <input
                                        className="w-full bg-pop-cream/20 border-2 border-pop-espresso rounded-xl px-4 py-3 outline-none focus:bg-white"
                                        value={editData.tag_id || ""}
                                        onChange={(e) => setEditData({ ...editData, tag_id: e.target.value })}
                                        placeholder="RM-XXXX-1234"
                                        disabled={!isAdding}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-pop-espresso opacity-40 ml-1">Role</label>
                                        <select
                                            className="w-full bg-pop-cream/20 border-2 border-pop-espresso rounded-xl px-4 py-3 outline-none focus:bg-white appearance-none"
                                            value={editData.role || "user"}
                                            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-pop-espresso opacity-40 ml-1">Tier</label>
                                        <select
                                            className="w-full bg-pop-cream/20 border-2 border-pop-espresso rounded-xl px-4 py-3 outline-none focus:bg-white appearance-none"
                                            value={editData.tier || "standard"}
                                            onChange={(e) => setEditData({ ...editData, tier: e.target.value })}
                                        >
                                            <option value="standard">Standard</option>
                                            <option value="gold">Gold</option>
                                            <option value="premium">Premium</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="w-full py-4 mt-6 bg-pop-green text-pop-espresso font-black border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
