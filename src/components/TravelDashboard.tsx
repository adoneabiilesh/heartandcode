"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Clock, Newspaper, MapPin, Wind } from "lucide-react";

export default function TravelDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState({
        temp: 24,
        condition: "Sunny",
        icon: <Sun className="w-8 h-8 text-orange-400" />
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const romeTime = currentTime.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Rome',
        hour: '2-digit',
        minute: '2-digit'
    });

    const [news, setNews] = useState<{ id: number, title: string, category: string }[]>([]);
    const [isLoadingNews, setIsLoadingNews] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                const data = await res.json();
                setNews(data);
            } catch (err) {
                console.error("News fetch error:", err);
            } finally {
                setIsLoadingNews(false);
            }
        };
        fetchNews();
    }, []);


    return (
        <div className="w-full glass-effect rounded-[40px] p-8 border border-white/20 shadow-xl mb-12 paper-texture overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cloud className="w-24 h-24 text-sepia-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Time Section */}
                <div className="flex flex-col space-y-2 border-r border-sepia-100 pr-4">
                    <div className="flex items-center space-x-2 text-sepia-400 text-[10px] font-black tracking-widest uppercase">
                        <Clock className="w-3 h-3" />
                        <span>Rome Local Time</span>
                    </div>
                    <h2 className="text-4xl font-bold text-sepia-900 serif-font italic">{romeTime}</h2>
                    <p className="text-sepia-400 text-xs">Buon Giorno, Traveler</p>
                </div>

                {/* Weather Section */}
                <div className="flex flex-col space-y-2 border-r border-sepia-100 pr-4">
                    <div className="flex items-center space-x-2 text-sepia-400 text-[10px] font-black tracking-widest uppercase">
                        <CloudRain className="w-3 h-3" />
                        <span>Current Weather</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {weather.icon}
                        <div>
                            <h2 className="text-4xl font-bold text-sepia-900">{weather.temp}°C</h2>
                            <p className="text-sepia-400 text-xs underline decoration-accent-gold decoration-2 underline-offset-4">{weather.condition}</p>
                        </div>
                    </div>
                </div>

                {/* News Ticker */}
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 text-sepia-400 text-[10px] font-black tracking-widest uppercase">
                        <Newspaper className="w-3 h-3" />
                        <span>Rome Travel News</span>
                    </div>
                    <div className="space-y-2">
                        {news.map(item => (
                            <div key={item.id} className="flex items-center space-x-2 group cursor-pointer">
                                <span className="px-2 py-0.5 rounded bg-sepia-900 text-[8px] text-white font-bold">{item.category}</span>
                                <p className="text-[11px] text-sepia-700 font-medium group-hover:text-accent-gold transition-colors truncate">
                                    {item.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
