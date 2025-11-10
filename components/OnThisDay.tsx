import React from 'react';
import { CalendarDays } from 'lucide-react';
import { HistoryItem } from '../types';

interface Props {
    data: HistoryItem[];
}

export const OnThisDay: React.FC<Props> = ({ data }) => {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return (
        <div className="wiki-card border-t-4 border-t-wiki-blue/70">
             <h2 className="wiki-header text-lg text-wiki-blue">
                <CalendarDays size={18} className="text-wiki-blue" />
                On this day
            </h2>
            <p className="font-bold mb-3 text-slate-200">{today}</p>
            <ul className="space-y-3 list-disc list-outside ml-5 text-[15px] text-slate-300 leading-snug">
                {data.map((item, index) => (
                    <li key={index} className="pl-1">
                        <strong className="font-medium text-slate-100">{item.year}</strong> – {item.event}
                    </li>
                ))}
            </ul>
             <div className="mt-4 pt-3 border-t border-wiki-border flex flex-wrap gap-2 text-sm">
                <span className="wiki-link font-medium">More anniversaries:</span>
                <span className="wiki-link">Yesterday</span> •
                <span className="font-bold text-slate-300">{today}</span> •
                <span className="wiki-link">Tomorrow</span>
            </div>
        </div>
    );
};