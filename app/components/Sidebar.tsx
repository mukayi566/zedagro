"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/lib/auth/actions";
import { useTransition } from "react";
import { useLayout } from "./LayoutContext";

interface NavItem {
    href: string;
    label: string;
    icon: string;
    badge?: number;
    roles?: string[]; // Optional: restrict to certain roles
}

const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/farmers", label: "Farmers", icon: "person_search", roles: ["admin", "field_agent"] },
    { href: "/drone-surveys", label: "Drone Surveys", icon: "flight_takeoff", roles: ["admin", "field_agent"] },
    { href: "/fisp", label: "FISP Vouchers", icon: "confirmation_number" },
    { href: "/logistics", label: "Logistics", icon: "local_shipping" },
    { href: "/payments", label: "Payments", icon: "payments" },
    { href: "/users", label: "User Management", icon: "group", roles: ["admin"] },
    { href: "/fraud", label: "Fraud Alerts", icon: "report_problem", badge: 142, roles: ["admin"] },
];

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
    user?: {
        first_name?: string;
        last_name?: string;
        role?: string;
    };
}

export default function Sidebar({ isOpen, isCollapsed, onClose, user }: SidebarProps) {
    const pathname = usePathname();
    const { toggleSidebarCollapsed } = useLayout();
    const [isPending, startTransition] = useTransition();

    const filteredNavItems = navItems.filter(item =>
        !item.roles || (user?.role && item.roles.includes(user.role))
    );

    const handleLogout = () => {
        startTransition(async () => {
            await logout();
        });
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 border-r border-slate-200 bg-white flex flex-col shrink-0 h-screen transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-x-visible ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
                } ${isCollapsed ? "lg:w-20" : "lg:w-64 w-64"}`}
        >
            {/* Desktop Toggle Button */}
            <button
                onClick={toggleSidebarCollapsed}
                className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-primary hover:border-primary shadow-sm z-[60] transition-all"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                <span className="material-symbols-outlined text-[18px]">
                    {isCollapsed ? "chevron_right" : "chevron_left"}
                </span>
            </button>
            {/* Logo */}
            <div className={`p-6 flex items-center border-b border-slate-100 shrink-0 ${isCollapsed ? "justify-center px-4" : "justify-between"}`}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-xl">agriculture</span>
                    </div>
                    {!isCollapsed && (
                        <div className="transition-opacity duration-300">
                            <h2 className="text-primary font-bold text-lg leading-tight tracking-tight">
                                ZEDAGRO
                            </h2>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                                Food Reserve Agency
                            </p>
                        </div>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto p-3 space-y-0.5 no-scrollbar ${isCollapsed ? "px-2" : "p-3"}`}>
                {!isCollapsed && (
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 pb-2 pt-2">
                        Main Menu
                    </p>
                )}
                {filteredNavItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onClose()}
                            className={`flex items-center rounded-lg font-medium text-sm transition-all duration-150 group relative ${isActive
                                ? "bg-primary text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                                } ${isCollapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5"}`}
                            title={isCollapsed ? item.label : ""}
                        >
                            <span
                                className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-primary"
                                    }`}
                            >
                                {item.icon}
                            </span>
                            {!isCollapsed && <span className="flex-1 whitespace-nowrap overflow-hidden">{item.label}</span>}
                            {item.badge && !isCollapsed && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    {item.badge}
                                </span>
                            )}
                            {item.badge && isCollapsed && (
                                <span className="absolute top-2.5 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white translate-x-1/2"></span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className={`p-3 border-t border-slate-100 space-y-0.5 ${isCollapsed ? "px-2" : "p-3"}`}>
                {!isCollapsed && (
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 pb-1">
                        System
                    </p>
                )}
                <Link
                    href="/settings"
                    onClick={() => onClose()}
                    className={`flex items-center rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary font-medium text-sm transition-all ${isCollapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5"}`}
                    title={isCollapsed ? "Settings" : ""}
                >
                    <span className="material-symbols-outlined text-[20px] text-slate-500 transition-colors group-hover:text-primary">
                        settings
                    </span>
                    {!isCollapsed && <span>Settings</span>}
                </Link>

                <Link
                    href="/profile"
                    onClick={() => onClose()}
                    className={`flex items-center rounded-lg font-medium text-sm transition-all ${pathname === '/profile' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'} ${isCollapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5"}`}
                    title={isCollapsed ? "My Profile" : ""}
                >
                    <span className={`material-symbols-outlined text-[20px] ${pathname === '/profile' ? 'text-primary' : 'text-slate-500'}`}>
                        account_circle
                    </span>
                    {!isCollapsed && <span>My Profile</span>}
                </Link>

                {/* User Profile */}
                <Link
                    href="/profile"
                    onClick={() => onClose()}
                    className={`mt-3 pt-3 border-t border-slate-100 flex items-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group ${isCollapsed ? "justify-center py-2 px-0 bg-transparent hover:bg-transparent" : "gap-3 px-2 py-2"}`}
                    title={isCollapsed ? (user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Zedagro User') : ""}
                >
                    <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase group-hover:scale-110 transition-transform shrink-0">
                        {(user?.first_name?.[0] || 'U')}{(user?.last_name?.[0] || '')}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Zedagro User'}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide truncate">
                                {user?.role === 'admin' ? 'HQ Admin' : user?.role === 'field_agent' ? 'Field Agent' : user?.role === 'driver' ? 'Logistics Driver' : 'Farmer'}
                            </p>
                        </div>
                    )}
                    {!isCollapsed && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLogout();
                            }}
                            disabled={isPending}
                            className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Logout"
                        >
                            {isPending ? (
                                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                            )}
                        </button>
                    )}
                </Link>
                {isCollapsed && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLogout();
                        }}
                        disabled={isPending}
                        className="w-full flex justify-center py-3 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Logout"
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        )}
                    </button>
                )}
            </div>
        </aside>
    );
}
