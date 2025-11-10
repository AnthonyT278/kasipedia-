import React from 'react';
import { Newspaper } from 'lucide-react';
import { NewsItem } from '../types';

interface Props {
    data: NewsItem[];
}

export const News: React.FC<Props> = ({ data }) => {
    return (
        <div className="wiki-card">
             <h2 className="wiki-header text-lg">
                <Newspaper size={18} className="text-slate-400" />
                In the news
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
                <ul className="flex-1 space-y-3 list-disc list-outside ml-5 text-[15px] text-slate-300 leading-snug">
                    {data.map((item, index) => (
                        <li key={index} className="pl-1">
                            <span className="font-medium hover:underline cursor-pointer text-slate-100">
                                {item.headline}
                            </span>
                            <span className="text-slate-400"> – {item.context}</span>
                        </li>
                    ))}
                </ul>
                <div className="md:w-1/3 flex flex-col gap-4">
                    {/* Sidebar for news images if we had them, or just extra links */}
                    <div className="bg-[#1a1a1a] border border-slate-700 p-3 text-sm rounded-sm shadow-sm">
                         <h4 className="font-bold text-slate-200 mb-2 border-b border-slate-700 pb-1">Ongoing</h4>
                         <ul className="space-y-1">
                             <li className="wiki-link">Current events</li>
                             <li className="wiki-link">Recent deaths</li>
                         </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};