import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Featured } from './components/Featured';
import { News } from './components/News';
import { DidYouKnow } from './components/DidYouKnow';
import { OnThisDay } from './components/OnThisDay';
import { LiveAssistant } from './components/LiveAssistant';
import { fetchHomepageData } from './services/geminiService';
import { HomepageData } from './types';

const WelcomeBanner = () => (
    <div className="wiki-card text-center mb-6 bg-[#1a1a1a]">
        <h1 className="font-serif text-3xl md:text-4xl text-slate-100 mb-2">
            Welcome to <span className="text-wiki-blue">Kasipedia</span>,
        </h1>
        <p className="text-lg text-slate-300 font-serif">
            the AI-generated free encyclopedia that anyone can edit.
        </p>
        <p className="text-sm text-slate-400 mt-3 font-sans">
            {Math.floor(Math.random() * 10000000).toLocaleString()} articles in English
        </p>
    </div>
);

// --- Specific Skeletons ---

const FeaturedSkeleton = () => (
    <div className="wiki-card border-t-4 border-t-wiki-blue animate-pulse">
        <div className="h-7 bg-slate-800 w-1/2 mb-4 rounded-sm"></div>
        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
                <div className="bg-slate-800 h-48 w-full md:w-[300px] rounded-sm"></div>
            </div>
            <div className="flex-1 space-y-4 py-2">
                <div className="h-8 bg-slate-700 w-3/4 rounded-sm"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-800 w-full rounded-sm"></div>
                    <div className="h-4 bg-slate-800 w-full rounded-sm"></div>
                    <div className="h-4 bg-slate-800 w-5/6 rounded-sm"></div>
                    <div className="h-4 bg-slate-800 w-full rounded-sm"></div>
                </div>
                <div className="flex gap-3 pt-2">
                    <div className="h-4 bg-slate-800 w-16 rounded-sm"></div>
                    <div className="h-4 bg-slate-800 w-20 rounded-sm"></div>
                    <div className="h-4 bg-slate-800 w-20 rounded-sm"></div>
                </div>
            </div>
        </div>
    </div>
);

const NewsSkeleton = () => (
    <div className="wiki-card animate-pulse">
        <div className="h-6 bg-slate-800 w-1/3 mb-4 rounded-sm"></div>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-3 ml-5">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-slate-800 w-full rounded-sm"></div>
                ))}
            </div>
            <div className="md:w-1/3 flex flex-col gap-2">
                <div className="h-24 bg-slate-800 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const DidYouKnowSkeleton = () => (
    <div className="wiki-card border-t-4 border-t-green-600/70 animate-pulse">
        <div className="h-6 bg-slate-800 w-2/5 mb-4 rounded-sm"></div>
        <div className="flex flex-col-reverse md:flex-row gap-4">
             <div className="flex-1 space-y-3 ml-5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-4 bg-slate-800 w-[95%] rounded-sm"></div>
                ))}
            </div>
             <div className="md:w-32 flex-shrink-0">
                <div className="w-24 h-24 md:w-full md:h-32 bg-slate-800 rotate-2 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const OnThisDaySkeleton = () => (
    <div className="wiki-card border-t-4 border-t-wiki-blue/70 animate-pulse">
        <div className="h-6 bg-slate-800 w-2/5 mb-4 rounded-sm"></div>
        <div className="h-5 bg-slate-700 w-1/4 mb-4 rounded-sm"></div>
        <div className="space-y-3 ml-5">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-slate-800 w-full rounded-sm"></div>
            ))}
        </div>
    </div>
);

const App: React.FC = () => {
    const [data, setData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const result = await fetchHomepageData();
            if (result) {
                setData(result);
            } else {
                setError(true);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="min-h-screen font-sans bg-[#121212]">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <WelcomeBanner />

                {error && (
                    <div className="p-4 bg-red-900/30 border-l-4 border-red-500 text-red-200 mb-6">
                        <p className="font-bold">Error loading content.</p>
                        <p>The AI scribes are taking a break. Please reload to try again.</p>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Main Column Skeletons */}
                         <div className="lg:col-span-7 space-y-6">
                            <FeaturedSkeleton />
                            <NewsSkeleton />
                        </div>
                        {/* Right Sidebar Column Skeletons */}
                        <div className="lg:col-span-5 space-y-6">
                            <DidYouKnowSkeleton />
                            <OnThisDaySkeleton />
                        </div>
                    </div>
                ) : data ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Main Column */}
                        <div className="lg:col-span-7 space-y-6">
                            <Featured data={data.featured_article} />
                            <News data={data.in_the_news} />
                        </div>

                        {/* Right Sidebar Column */}
                        <div className="lg:col-span-5 space-y-6">
                            <DidYouKnow data={data.did_you_know} />
                            <OnThisDay data={data.on_this_day} />

                            {/* Extra "Portals" or generic wiki filler */}
                            <div className="wiki-card text-center py-8 bg-[#1a1a1a]">
                                <h3 className="font-serif font-bold text-lg mb-4 text-slate-200">Other areas of Kasipedia</h3>
                                <div className="flex flex-wrap justify-center gap-3 text-sm font-medium text-wiki-blue">
                                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full cursor-pointer hover:bg-slate-700 transition-colors">Community portal</span>
                                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full cursor-pointer hover:bg-slate-700 transition-colors">Village pump</span>
                                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full cursor-pointer hover:bg-slate-700 transition-colors">Help desk</span>
                                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full cursor-pointer hover:bg-slate-700 transition-colors">Reference desk</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>

            <footer className="bg-[#1a1a1a] border-t border-slate-800 mt-12 py-8 text-sm text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                     <p>
                        Text is available under the <span className="wiki-link">Creative Commons Attribution-ShareAlike License</span>; additional terms may apply.
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <span className="wiki-link">Privacy policy</span>
                        <span className="wiki-link">About Kasipedia</span>
                        <span className="wiki-link">Disclaimers</span>
                        <span className="wiki-link">Contact us</span>
                        <span className="wiki-link">Developers</span>
                        <span className="wiki-link">Cookie statement</span>
                        <span className="wiki-link">Mobile view</span>
                    </div>
                     <div className="pt-4 flex items-center justify-center gap-4 opacity-50">
                         <img src="https://www.mediawiki.org/static/images/poweredby_mediawiki_88x31.png" alt="Powered by MediaWiki" className="h-8 grayscale invert" />
                         <div className="h-8 px-2 border border-slate-600 flex items-center font-serif italic font-bold text-slate-400">Powered by Gemini</div>
                     </div>
                </div>
            </footer>

            <LiveAssistant />
        </div>
    );
};

export default App;