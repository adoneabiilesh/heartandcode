"use client";

import { motion } from "framer-motion";
import { Sparkles, Compass, MapPin, ArrowRight } from "lucide-react";

const secrets = [
    {
        title: "The Keyhole of Aventine",
        tip: "Go to the Piazza dei Cavalieri di Malta. Look through the brass keyhole to see a perfectly framed view of St. Peter's Dome across three countries.",
        spot: "Aventine Hill"
    },
    {
        title: "The Hidden Raphael",
        tip: "Avoid the museum crowds and visit the Church of Santa Maria della Pace to see Raphael's Sibyls frescoes for free.",
        spot: "Near Piazza Navona"
    },
    {
        title: "Passetto di Borgo",
        tip: "This elevated passage connected the Vatican to Castel Sant'Angelo. It's a miracle of medieval engineering and rarely crowded.",
        spot: "Vatican Area"
    }
];

export default function DailySecret() {
    // Select a secret based on the day of the month
    const today = new Date().getDate();
    const secret = secrets[today % secrets.length];

    return (
        <div className="w-full max-w-4xl px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[32px] overflow-hidden relative group border-4 border-pop-espresso shadow-[6px_6px_0px_0px_var(--color-pop-espresso)]"
            >

                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Compass className="w-32 h-32 text-pop-espresso rotate-12" />
                </div>


                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-pop-orange flex items-center justify-center border-4 border-pop-espresso shadow-[4px_4px_0px_0px_var(--color-pop-espresso)]">
                        <Sparkles className="w-10 h-10 text-white animate-pulse" />
                    </div>


                    <div className="flex-grow space-y-3 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-pop-orange">
                            <span className="w-2 h-2 rounded-full bg-pop-orange animate-ping" />
                            <span>Today's Local Secret</span>
                        </div>


                        <h3 className="text-3xl font-black text-pop-espresso uppercase tracking-tight">
                            {secret.title}
                        </h3>


                        <p className="text-pop-espresso font-medium leading-relaxed text-base md:text-lg max-w-xl italic">
                            "{secret.tip}"
                        </p>


                        <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                            <div className="flex items-center space-x-2 text-pop-espresso text-[10px] uppercase font-black tracking-widest bg-pop-green px-3 py-1.5 rounded-full border-2 border-pop-espresso">
                                <MapPin className="w-3 h-3 text-pop-espresso" />
                                <span>Spot: {secret.spot}</span>
                            </div>

                            <button className="flex items-center space-x-2 text-pop-espresso text-[11px] font-black uppercase tracking-widest hover:text-pop-orange transition-colors">
                                <span>View on Map</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
