import React from 'react';
import { Globe, Menu, User } from 'lucide-react';
import { SearchBar } from './SearchBar';

export const Header: React.FC = () => {
    return (
        <header className="bg-[#1a1a1a] border-b border-wiki-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Logo Area */}
                <div className="flex items-center gap-3 min-w-fit">
                     <button className="md:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-full">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="relative">
                            <Globe className="text-slate-400 group-hover:rotate-12 transition-transform duration-500" size={32} />
                            <div className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-slate-800 px-1 rounded-full border border-slate-600 text-slate-400">
                                EN
                            </div>
                        </div>
                        <div className="hidden sm:block leading-tight">
                            <h1 className="font-serif text-xl font-bold text-slate-100 tracking-tight">Kasipedia</h1>
                            <p className="text-xs text-slate-400 font-sans">The AI Free Encyclopedia</p>
                        </div>
                    </div>
                </div>

                {/* Search Area */}
                <div className="flex-1 max-w-2xl">
                    <SearchBar />
                </div>

                {/* User Nav */}
                 <div className="flex items-center gap-4 min-w-fit text-sm font-medium text-wiki-blue">
                    <span className="hidden md:inline cursor-pointer hover:underline">Create account</span>
                    <span className="hidden md:inline cursor-pointer hover:underline">Log in</span>
                    <button className="md:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-full">
                        <User size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};