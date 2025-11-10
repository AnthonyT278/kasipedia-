import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HomepageData } from "../types";

// Define the response schema for structured JSON output
const homepageSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        featured_article: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Title of a fascinating, obscure, or highly important encyclopedia article." },
                summary: { type: Type.STRING, description: "A 2-3 sentence engaging summary of the article." },
                image_seed: { type: Type.STRING, description: "A single keyword related to the article to use as an image seed (e.g., 'castle', 'microscope', 'jazz')." }
            },
            required: ["title", "summary", "image_seed"]
        },
        in_the_news: {
            type: Type.ARRAY,
            description: "4 current or recent major news headlines.",
            items: {
                type: Type.OBJECT,
                properties: {
                    headline: { type: Type.STRING },
                    context: { type: Type.STRING, description: "One sentence of context for the headline." }
                },
                required: ["headline", "context"]
            }
        },
        did_you_know: {
            type: Type.ARRAY,
            description: "5 interesting, lesser-known facts.",
            items: {
                type: Type.OBJECT,
                properties: {
                    fact: { type: Type.STRING, description: "The fact itself, phrased as a continuation of 'Did you know...'." },
                    topic: { type: Type.STRING, description: "The main subject of the fact." }
                },
                required: ["fact", "topic"]
            }
        },
        on_this_day: {
            type: Type.ARRAY,
            description: "5 historical events that happened on roughly this date in history.",
            items: {
                type: Type.OBJECT,
                properties: {
                    year: { type: Type.STRING, description: "The year of the event." },
                    event: { type: Type.STRING, description: "A concise description of the event." }
                },
                required: ["year", "event"]
            }
        }
    },
    required: ["featured_article", "in_the_news", "did_you_know", "on_this_day"]
};

export const fetchHomepageData = async (): Promise<HomepageData | null> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key not found");

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate content for a Wikipedia-style homepage. It should be diverse, educational, and engaging, just like a real encyclopedia front page.",
            config: {
                responseMimeType: "application/json",
                responseSchema: homepageSchema,
                temperature: 0.6, // Slightly creative but grounded
            }
        });

        const text = response.text();
        if (!text) return null;

        return JSON.parse(text) as HomepageData;
    } catch (error) {
        console.error("Failed to fetch homepage data:", error);
        return null;
    }
};
