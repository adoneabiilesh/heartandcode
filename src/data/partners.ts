export interface Partner {
    id: number;
    name: string;
    location: string;
    discount: string;
    description: string;
    rating: number;
    image?: string;
    category: "food" | "drink" | "culture";
}

export const partners: Partner[] = [
    {
        id: 1,
        name: "La Carbonara",
        location: "Via Panisperna, 214",
        discount: "15% OFF",
        description: "Authentic Roman recipe in the heart of Monti. Known for the best guanciale in town.",
        rating: 4.8,
        category: "food"
    },
    {
        id: 2,
        name: "Jerry Thomas Speakeasy",
        location: "Vicolo Cellini, 30",
        discount: "Free Welcome Cocktail",
        description: "Rome's most exclusive secret bar. Requires a secret password (available in your vault).",
        rating: 4.9,
        category: "drink"
    },
    {
        id: 3,
        name: "Antico Forno Roscioli",
        location: "Via dei Chiavari, 34",
        discount: "10% OFF",
        description: "The most famous bakery in the city. Try the pizza bianca.",
        rating: 4.7,
        category: "food"
    },
    {
        id: 4,
        name: "Villa Borghese Gallery",
        location: "Piazzale Napoleone",
        discount: "Skip-the-Line Entry",
        description: "A breathtaking collection of Bernini and Caravaggio.",
        rating: 4.9,
        category: "culture"
    }
];
