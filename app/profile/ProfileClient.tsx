"use client";

import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";

interface ProfileClientProps {
    profile: any;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [formattedDate, setFormattedDate] = useState<string>("");

    useEffect(() => {
        if (profile?.created_at) {
            setFormattedDate(new Date(profile.created_at).toLocaleDateString());
        } else {
            setFormattedDate("Jan 12, 2024");
        }
    }, [profile?.created_at]);

    const getRoleBadge = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return { label: 'HQ Admin', class: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' };
            case 'field_agent':
                return { label: 'Field Agent', class: 'bg-amber-500/10 text-amber-600 border-amber-200' };
            case 'farmer':
                return { label: 'Verified Farmer', class: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
            default:
                return { label: 'Guest', class: 'bg-slate-500/10 text-slate-600 border-slate-200' };
        }
    };

    const roleInfo = getRoleBadge(profile?.role);

    return (
        <>
            <Topbar
                title="My Profile"
                subtitle="Manage your personal information and activity"
                user={profile}
            />

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-24 lg:pb-8">
                {/* Profile Header Card */}
                <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-primary/80 via-emerald-600 to-teal-700 opacity-90"></div>
                    <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative pt-24 px-6 pb-8 md:px-10 flex flex-col md:flex-row items-end gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white p-2 shadow-2xl border-4 border-white overflow-hidden">
                                <div className="w-full h-full rounded-2xl bg-slate-50 flex items-center justify-center text-primary font-black text-4xl md:text-5xl uppercase border border-slate-100">
                                    {(profile?.first_name?.[0] || 'U')}{(profile?.last_name?.[0] || '')}
                                </div>
                            </div>
                            <button className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-primary text-white shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {profile?.first_name} {profile?.last_name}
                                </h2>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleInfo.class}`}>
                                    {roleInfo.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-slate-500">
                                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide">
                                    <span className="material-symbols-outlined text-lg text-primary/60">mail</span>
                                    {profile?.email}
                                </div>
                                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide">
                                    <span className="material-symbols-outlined text-lg text-primary/60">call</span>
                                    {profile?.phone || 'No phone set'}
                                </div>
                                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide">
                                    <span className="material-symbols-outlined text-lg text-primary/60">location_on</span>
                                    {profile?.district}, {profile?.province}
                                </div>
                            </div>
                        </div>

                        {/* Profile Completion - only for farmers */}
                        {profile?.role === 'farmer' && (
                            <div className="w-full md:w-56 bg-slate-50 rounded-2xl p-4 border border-slate-100 hidden xl:block">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black uppercase text-slate-400">Profile Strength</span>
                                    <span className="text-xs font-black text-primary">85%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="w-[85%] h-full bg-primary rounded-full"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase">Complete FISP verification to reach 100%</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="px-6 md:px-10 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: "overview", label: "Overview", icon: "grid_view" },
                                { id: "activity", label: "Recent Activity", icon: "history" },
                                { id: "settings", label: "Security & Access", icon: "shield_lock" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-5 border-b-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Stats & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Role Specific Card */}
                                <div className="md:col-span-2 bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-primary/30"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                                                <span className="material-symbols-outlined text-3xl text-primary">
                                                    {profile?.role === 'admin' ? 'monitoring' : profile?.role === 'field_agent' ? 'radar' : 'grass'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black tracking-tight leading-none uppercase">
                                                    {profile?.role === 'admin' ? 'Operations Pulse' : profile?.role === 'field_agent' ? 'Field Intelligence' : 'Farm Ecosystem'}
                                                </h3>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-2">Personal performance metrics</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
                                            {profile?.role === 'admin' && (
                                                <>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Users Managed</p>
                                                        <p className="text-3xl font-black tracking-tighter">1,284</p>
                                                        <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase">+12 this week</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">System Uptime</p>
                                                        <p className="text-3xl font-black tracking-tighter">99.9%</p>
                                                        <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase">Stable Performance</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Recent Alerts</p>
                                                        <p className="text-3xl font-black tracking-tighter">24</p>
                                                        <div className="mt-2 text-[10px] text-amber-400 font-bold uppercase">Pending Review</div>
                                                    </div>
                                                </>
                                            )}
                                            {profile?.role === 'field_agent' && (
                                                <>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Surveys Done</p>
                                                        <p className="text-3xl font-black tracking-tighter">48</p>
                                                        <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase">Target: 50</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Farms Verified</p>
                                                        <p className="text-3xl font-black tracking-tighter">124</p>
                                                        <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase">100% Accuracy</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Distance Covered</p>
                                                        <p className="text-3xl font-black tracking-tighter">342<span className="text-lg ml-1 font-bold">km</span></p>
                                                        <div className="mt-2 text-[10px] text-amber-400 font-bold uppercase">This Month</div>
                                                    </div>
                                                </>
                                            )}
                                            {(profile?.role === 'farmer' || !profile?.role) && (
                                                <>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Hectares Under Cultivation</p>
                                                        <p className="text-3xl font-black tracking-tighter">4.2</p>
                                                        <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase">Maize & Soya</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Current Yield Est.</p>
                                                        <p className="text-3xl font-black tracking-tighter">12.5<span className="text-lg ml-1 font-bold">ton</span></p>
                                                        <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase">Optimized</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">FISP Vouchers</p>
                                                        <p className="text-3xl font-black tracking-tighter">2</p>
                                                        <div className="mt-2 text-[10px] text-amber-400 font-bold uppercase">Ready for Pickup</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Details Card */}
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">badge</span>
                                        </div>
                                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">Identification</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">National ID (NRC)</p>
                                            <p className="text-sm font-bold text-slate-700">{profile?.national_id || 'Not provided'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Farmer Card ID</p>
                                            <p className="text-sm font-bold text-slate-700">ZED-2993881</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <span className="text-sm font-bold text-slate-700">Verified & Active</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Registered Date</p>
                                            <p className="text-sm font-bold text-slate-700">{formattedDate || '...'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Geographic Data Card */}
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">distance</span>
                                        </div>
                                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">Primary Location</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Province</p>
                                            <p className="text-sm font-bold text-slate-700">{profile?.province || 'Central'}</p>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">District</p>
                                            <p className="text-sm font-bold text-slate-700">{profile?.district || 'Chisamba'}</p>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Camp</p>
                                            <p className="text-sm font-bold text-slate-700">Manyumbi West</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">history</span>
                                        </div>
                                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">System Logs</h4>
                                    </div>
                                    <button className="text-[10px] font-black uppercase text-primary hover:underline">Download Report</button>
                                </div>

                                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                    {[
                                        { action: "Login Attempt", detail: "Successful login from Chipata branch", time: "2 hours ago", icon: "login", color: "text-emerald-500", bg: "bg-emerald-50" },
                                        { action: "Profile Updated", detail: "Modified contact phone number", time: "1 day ago", icon: "manage_accounts", color: "text-blue-500", bg: "bg-blue-50" },
                                        { action: "Password Changed", detail: "Security credential refresh completed", time: "2 weeks ago", icon: "key", color: "text-amber-500", bg: "bg-amber-50" },
                                        { action: "Application Submitted", detail: "FISP E-voucher renewal request", time: "1 month ago", icon: "description", color: "text-purple-500", bg: "bg-purple-50" },
                                    ].map((item, i) => (
                                        <div key={i} className="relative flex gap-6 pl-10 group">
                                            <div className={`absolute left-0 w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center z-10 border-4 border-white shadow-sm ring-1 ring-slate-100`}>
                                                <span className={`material-symbols-outlined text-sm ${item.color}`}>{item.icon}</span>
                                            </div>
                                            <div className="flex-1 pb-4 border-b border-slate-50 group-last:border-0">
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                                    <p className="text-sm font-black text-slate-900 leading-none">{item.action}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">{item.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-orange-600">security_update_good</span>
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">Security Health</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-primary/20 transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">passkey</span>
                                            </div>
                                            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase">Safe</span>
                                        </div>
                                        <h5 className="font-black text-sm text-slate-900 mb-1">Change Password</h5>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Last changed 4 months ago</p>
                                    </div>

                                    <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-primary/20 transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">nest_multi_room</span>
                                            </div>
                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black uppercase">Not Set</span>
                                        </div>
                                        <h5 className="font-black text-sm text-slate-900 mb-1">Two-Factor Auth</h5>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Add an extra layer of protection</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                    <div className="text-center sm:text-left">
                                        <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">Active Sessions</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Showing 1 active connection</p>
                                    </div>
                                    <button className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-600 transition-colors">
                                        Sign Out All Devices
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Secondary Info */}
                    <div className="space-y-8">
                        {/* Quick Tips or Announcements */}
                        <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h4 className="text-lg font-black tracking-tighter uppercase mb-4">Dashboard Tips</h4>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary-200">lightbulb</span>
                                    <p className="text-xs font-bold leading-relaxed opacity-90">Keep your mobile number updated to receive FISP disbursement alerts instantly via SMS.</p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary-200">security</span>
                                    <p className="text-xs font-bold leading-relaxed opacity-90">Avoid sharing your ZED-ID or password with unauthorized personnel.</p>
                                </div>
                                <button className="w-full mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all">
                                    View Help Center
                                </button>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">Support Hub</h4>
                            <div className="space-y-3">
                                <div className="p-4 rounded-2xl bg-slate-50 flex items-center gap-4 border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-lg">support_agent</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase">Live Chat</p>
                                        <p className="text-[10px] text-slate-500 font-bold">24/7 Available</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 flex items-center gap-4 border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-lg">book</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase">User Guide</p>
                                        <p className="text-[10px] text-slate-500 font-bold">PDF Resources</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 flex items-center gap-4 border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-lg">forum</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase">ZED Community</p>
                                        <p className="text-[10px] text-slate-500 font-bold">Connect with others</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ecosystem Footer */}
                        <div className="text-center p-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Powered by</p>
                            <div className="flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                                <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] text-white font-bold">SM</div>
                                <span className="text-[10px] font-black text-slate-600 tracking-tighter">SMART MONITORING AFRICA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
