import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    className?: string;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = "", placeholder = "Search Kasipedia" }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            alert(`Searching for: ${query} (Demo only)`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
            <div className="relative w-full">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#000]/30 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-wiki-blue/50 focus:border-wiki-blue shadow-inner text-slate-200 placeholder-slate-500 transition-all"
                    placeholder={placeholder}
                    aria-label="Search Kasipedia"
                />
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-slate-900 bg-wiki-blue rounded-r-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-wiki-blue focus:ring-offset-2 transition-colors hidden sm:block"
                >
                    Search
                </button>
            </div>
        </form>
    );
};