import React from 'react';
import { HelpCircle } from 'lucide-react';
import { FactItem } from '../types';

interface Props {
    data: FactItem[];
}

export const DidYouKnow: React.FC<Props> = ({ data }) => {
    // Use first fact's topic for the image seed
    const imageSeed = data[0]?.topic || 'question';

    return (
        <div className="wiki-card border-t-4 border-t-green-600/70">
             <h2 className="wiki-header text-lg text-green-400">
                <HelpCircle size={18} className="text-green-500" />
                Did you know...
            </h2>
            <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
                 <ul className="flex-1 space-y-3 list-disc list-outside ml-5 text-[15px] text-slate-300 leading-snug">
                    {data.map((item, index) => (
                        <li key={index} className="pl-1">
                            ...that {item.fact.startsWith('that ') ? item.fact.slice(5) : item.fact}
                             <span className="text-xs text-slate-500 ml-1">({item.topic})</span>
                        </li>
                    ))}
                </ul>
                 <div className="md:w-32 flex-shrink-0 self-start mt-2 md:mt-0">
                    <img
                        src={`https://picsum.photos/seed/${imageSeed}/200/200`}
                        alt="Random illustration"
                        className="w-24 h-24 md:w-full md:h-auto object-cover border border-slate-700 p-1 bg-[#000]/20 rotate-2 shadow-sm opacity-90"
                    />
                </div>
            </div>
             <div className="mt-4 pt-3 border-t border-wiki-border text-right text-sm">
                <span className="wiki-link font-medium">Archive</span> • <span className="wiki-link font-medium">Start a new article</span> • <span className="wiki-link font-medium">Nominate an article</span>
            </div>
        </div>
    );
};