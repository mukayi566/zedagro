"use client";

import { useLayout } from "./LayoutContext";
import Link from "next/link";

interface TopbarProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    user?: {
        first_name?: string;
        last_name?: string;
        role?: string;
    };
}

export default function Topbar({ title, subtitle, actions, user }: TopbarProps) {
    const { toggleSidebar } = useLayout();

    return (
        <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 md:px-8 flex items-center justify-between z-20 sticky top-0">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">menu</span>
                </button>

                <div className="min-w-0">
                    <h1 className="text-md md:text-lg font-bold text-slate-900 leading-tight truncate">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="hidden sm:block text-[10px] md:text-xs text-slate-500 mt-0.5 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Search - Visible only on LG and up */}
                <div className="relative hidden xl:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-48 bg-slate-100 border-none rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                </div>

                {/* Custom Actions - Hide some text on small screens */}
                <div className="flex items-center">
                    {actions}
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Avatar */}
                <Link href="/profile" className="flex items-center gap-2.5 cursor-pointer group hover:opacity-80 transition-all">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-primary transition-colors">
                            {user?.first_name || 'User'}
                        </p>
                    </div>
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs md:text-sm shadow-sm border-2 border-primary/20 group-hover:scale-105 transition-transform">
                        {(user?.first_name?.[0] || 'U')}{(user?.last_name?.[0] || '')}
                    </div>
                </Link>
            </div>
        </header>
    );
}
