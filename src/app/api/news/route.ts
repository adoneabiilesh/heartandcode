import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Using a public news API or simply fetching from a known RSS/News source
        // For demo purposes, we'll use a search query for Rome on a public news API
        // If no API key is provided, we use a reliable news source
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=it&category=technology&apiKey=555776d7507b4614bb53380e28d400df`
        );
        const data = await response.json();

        if (data.status === "ok" && data.articles.length > 0) {
            const mappedNews = data.articles.slice(0, 5).map((article: any, index: number) => ({
                id: index,
                title: article.title.split(' - ')[0],
                category: "NEWS",
                url: article.url
            }));
            return NextResponse.json(mappedNews);
        }

        // Fallback if API fails
        return NextResponse.json([
            { id: 1, title: "Summer Festival at Trastevere tonight!", category: "EVENT" },
            { id: 2, title: "Vatican Museum extended hours this weekend.", category: "NEWS" },
            { id: 3, title: "New artisan market open in Monti.", category: "LOCAL" },
        ]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}
