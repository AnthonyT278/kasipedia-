import React from 'react';
import { Star } from 'lucide-react';
import { FeaturedArticle } from '../types';

interface Props {
    data: FeaturedArticle;
}

export const Featured: React.FC<Props> = ({ data }) => {
    const handleArticleClick = () => {
        alert(`Navigating to article: ${data.title}`);
    };

    return (
        <div className="wiki-card border-t-4 border-t-wiki-blue">
            <h2 className="wiki-header text-xl">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                <span className="text-wiki-blue">From today's featured article</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex-shrink-0">
                    <div className="bg-[#000]/20 border border-slate-700 p-1 rounded-sm inline-block w-full md:w-auto">
                        <img
                            src={`https://picsum.photos/seed/${data.image_seed}/400/300`}
                            alt={data.title}
                            className="w-full h-auto md:max-w-[300px] object-cover hover:opacity-95 transition-opacity cursor-pointer opacity-90"
                            onClick={handleArticleClick}
                        />
                        <div className="text-xs text-slate-400 p-2 italic">
                            Visual representation related to {data.image_seed}.
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <h3 className="font-serif text-3xl font-medium text-slate-100 leading-tight">
                        <span 
                            className="hover:underline cursor-pointer"
                            onClick={handleArticleClick}
                        >
                            {data.title}
                        </span>
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-[15px]">
                        {data.summary}
                    </p>
                    <div className="pt-2">
                        <ul className="flex flex-wrap gap-3 text-sm font-medium">
                            <li className="text-slate-100 font-bold">More:</li>
                             <li 
                                 className="wiki-link"
                                 onClick={handleArticleClick}
                             >
                                 Full article
                             </li>
                             <li className="wiki-link">Archive</li>
                             <li className="wiki-link cursor-pointer" onClick={() => window.location.reload()}>By email</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};