export interface FeaturedArticle {
    title: string;
    summary: string;
    image_seed: string;
}

export interface NewsItem {
    headline: string;
    context: string;
}

export interface FactItem {
    fact: string;
    topic: string;
}

export interface HistoryItem {
    year: string;
    event: string;
}

export interface HomepageData {
    featured_article: FeaturedArticle;
    in_the_news: NewsItem[];
    did_you_know: FactItem[];
    on_this_day: HistoryItem[];
}
