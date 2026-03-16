"use client";

import { useState, useMemo } from "react";
import Topbar from "../components/Topbar";
import { useLayout } from "../components/LayoutContext";

type SurveyStatus = "pending" | "in_progress" | "completed" | "flagged";

interface Survey {
    id: string;
    farmId: string;
    farmerName: string;
    zedId: string;
    region: string;
    droneModel: string;
    claimedSize: number;
    verifiedSize?: number;
    accuracy?: number;
    status: SurveyStatus;
    date: string;
    agent: string;
    agentId: string;
    images: string[];
}

const mockSurveys: Survey[] = [
    {
        id: "1", farmId: "ZED-882931", farmerName: "Mubanga Kalunga", zedId: "ZED-882931", region: "Lusaka West",
        droneModel: "Aerbes V10 Pro", claimedSize: 5.0, verifiedSize: 4.2, accuracy: 99.2, status: "completed",
        date: "2026-03-01", agent: "Field Agent #A12", agentId: "agent_12", images: ["/drone_farm_aerial_1.png", "/drone_farm_aerial_2.png"]
    },
    {
        id: "2", farmId: "ZED-773122", farmerName: "Grace Mwanza", zedId: "ZED-773122", region: "Kabwe",
        droneModel: "Aerbes V10 Pro", claimedSize: 15.0, verifiedSize: 12.5, accuracy: 98.7, status: "flagged",
        date: "2026-03-05", agent: "Field Agent #A08", agentId: "agent_08", images: ["/drone_farm_aerial_3.png"]
    },
    {
        id: "3", farmId: "ZED-554021", farmerName: "Kelvin Phiri", zedId: "ZED-554021", region: "Ndola",
        droneModel: "DJI Agras T40", claimedSize: 3.5, status: "in_progress",
        date: "2026-03-08", agent: "Field Agent #A21", agentId: "agent_21", images: []
    },
    {
        id: "4", farmId: "ZED-334502", farmerName: "Patrick Banda", zedId: "ZED-334502", region: "Chipata",
        droneModel: "Aerbes V10 Pro", claimedSize: 12.0, verifiedSize: 11.8, accuracy: 99.8, status: "completed",
        date: "2026-02-28", agent: "Field Agent #A15", agentId: "agent_15", images: ["/drone_farm_aerial_2.png"]
    },
    {
        id: "5", farmId: "ZED-119203", farmerName: "Chipo Mumba", zedId: "ZED-119203", region: "Choma",
        droneModel: "DJI Agras T40", claimedSize: 8.0, status: "pending",
        date: "2026-03-10", agent: "Field Agent #A07", agentId: "agent_07", images: []
    },
    {
        id: "6", farmId: "ZED-445091", farmerName: "John Zulu", zedId: "ZED-445091", region: "Mazabuka",
        droneModel: "DJI Agras T40", claimedSize: 20.0, verifiedSize: 14.5, accuracy: 97.5, status: "flagged",
        date: "2026-03-12", agent: "Field Agent #A12", agentId: "agent_12", images: ["/drone_farm_aerial_1.png"]
    },
];

const statusConfig: Record<SurveyStatus, { label: string; color: string; icon: string }> = {
    pending: { label: "Pending", color: "bg-slate-100 text-slate-600", icon: "schedule" },
    in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700", icon: "flight_takeoff" },
    completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700", icon: "check_circle" },
    flagged: { label: "Flagged", color: "bg-red-100 text-red-700", icon: "warning" },
};

export default function DroneSurveysClient({ profile }: { profile: any }) {
    const { isSidebarCollapsed } = useLayout();
    const isAdmin = profile?.role === "admin";

    const tabs = isAdmin ? [
        { id: "map", label: "National Command Map", icon: "explore" },
        { id: "list", label: "Fleet Activity", icon: "hub" },
        { id: "flagged", label: "Alerts & Anomalies", icon: "report" },
        { id: "conduct", label: "Pilot Interface", icon: "videogame_asset" },
        { id: "gallery", label: "Aerial Intel", icon: "photo_library" },
    ] : [
        { id: "conduct", label: "New Survey", icon: "flight_takeoff" },
        { id: "list", label: "My Missions", icon: "assignment" },
        { id: "gallery", label: "My Captures", icon: "collections" },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [searchTerm, setSearchTerm] = useState("");

    const surveys = useMemo(() => {
        let filtered = mockSurveys;
        if (!isAdmin) {
            filtered = mockSurveys.filter(s => s.agentId === "agent_12");
        }
        if (activeTab === "flagged") {
            filtered = filtered.filter(s => s.status === "flagged");
        }
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.zedId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [isAdmin, activeTab, searchTerm]);

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            <Topbar
                title="Aura Drone System"
                subtitle={isAdmin ? "Strategic National Resource Surveillance" : "Field verification interface"}
                user={profile}
            />

            {/* Premium Sub-nav */}
            <div className="px-8 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 py-5 text-xs font-black transition-all border-b-2 whitespace-nowrap tracking-wider uppercase ${activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${activeTab === tab.id ? "animate-pulse" : ""}`}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100/80 px-4 py-2 rounded-2xl border border-slate-200/60 focus-within:bg-white focus-within:border-primary focus-within:shadow-sm transition-all group">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Search Intel..."
                                className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-700 w-48 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-xl">tune</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 animate-fade-in custom-scrollbar">
                {activeTab === "map" && <MapSection surveys={mockSurveys} isSidebarCollapsed={isSidebarCollapsed} />}
                {activeTab === "list" && <ListSection surveys={surveys} title={isAdmin ? "Full Fleet Activity" : "Mission History"} isAdmin={isAdmin} isSidebarCollapsed={isSidebarCollapsed} />}
                {activeTab === "flagged" && <ListSection surveys={surveys} title="Critical Discrepancies" isAdmin={isAdmin} isSidebarCollapsed={isSidebarCollapsed} />}
                {activeTab === "conduct" && <ConductSection profile={profile} isSidebarCollapsed={isSidebarCollapsed} />}
                {activeTab === "gallery" && <GallerySection surveys={surveys} isSidebarCollapsed={isSidebarCollapsed} />}
            </div>
        </div>
    );
}

function MapSection({ surveys, isSidebarCollapsed }: { surveys: Survey[], isSidebarCollapsed: boolean }) {
    return (
        <div className={`grid grid-cols-1 ${isSidebarCollapsed ? "xl:grid-cols-4" : "2xl:grid-cols-4"} gap-8 transition-all duration-300`}>
            <div className="xl:col-span-3 space-y-6">
                <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-slate-900/40 h-[650px] relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
                        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse"></div>
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Global Telemetry</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { l: "Uplink", v: "Optimum", c: "text-emerald-400" },
                                    { l: "Satellites", v: "8 Active", c: "text-blue-400" },
                                    { l: "Coverage", v: "94.2%", c: "text-white" }
                                ].map(i => (
                                    <div key={i.l} className="flex items-center justify-between gap-8">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{i.l}</span>
                                        <span className={`text-[10px] font-black ${i.c}`}>{i.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
                        {['add', 'remove', 'layers', 'share_location'].map(i => (
                            <button key={i} className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
                                <span className="material-symbols-outlined text-xl">{i}</span>
                            </button>
                        ))}
                    </div>

                    <svg viewBox="0 0 800 600" className="w-full h-full p-20">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <path
                            d="M200,100 L400,50 L600,80 L700,200 L650,400 L500,550 L300,500 L150,450 L100,300 Z"
                            fill="rgba(59, 130, 246, 0.03)"
                            stroke="rgba(59, 130, 246, 0.2)"
                            strokeWidth="1.5"
                            strokeDasharray="8 8"
                        />
                        {surveys.map((s, i) => {
                            const cx = 250 + (i * 90) % 450;
                            const cy = 150 + (i * 70) % 350;
                            return (
                                <g key={s.id} className="cursor-pointer group/pin hover:scale-110 transition-transform">
                                    <circle cx={cx} cy={cy} r="40" fill={s.status === "flagged" ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.05)"} />
                                    <circle cx={cx} cy={cy} r="15" fill={s.status === "flagged" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"} />
                                    <circle cx={cx} cy={cy} r="5" fill={s.status === "flagged" ? "#ef4444" : "#10b981"} filter="url(#glow)" className={s.status === "in_progress" ? "animate-pulse" : ""} />

                                    <foreignObject x={cx + 15} y={cy - 40} width="160" height="80" className="opacity-0 group-hover/pin:opacity-100 transition-opacity">
                                        <div className="bg-slate-900 border border-white/10 p-3 rounded-2xl shadow-2xl">
                                            <p className="text-[10px] font-black text-white truncate">{s.farmerName}</p>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{s.region}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[9px] font-black text-primary">{s.claimedSize} HA</span>
                                                <span className="text-[8px] font-black text-slate-400">#{s.zedId}</span>
                                            </div>
                                        </div>
                                    </foreignObject>
                                </g>
                            )
                        })}
                    </svg>

                    <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                        <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl flex gap-6">
                            {[
                                { l: "Total Ops", v: "142", i: "grid_view" },
                                { l: "In Flight", v: "14", i: "flight" },
                                { l: "Alerts", v: "3", i: "error", c: "text-red-500" }
                            ].map(x => (
                                <div key={x.l} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                        <span className="material-symbols-outlined text-lg">{x.i}</span>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{x.l}</p>
                                        <p className={`text-sm font-black ${x.c || 'text-white'}`}>{x.v}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary relative">
                        <span className="material-symbols-outlined text-4xl">travel_explore</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-slate-900 leading-tight">National Coverage</h4>
                        <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Zambia Fleet Status</p>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500">75% of territory surveyed</p>
                </div>

                <div className="space-y-4">
                    {[
                        { label: "High Risk Anomalies", color: "text-red-600", bg: "bg-red-50", count: 3, icon: "warning" },
                        { label: "Pending Verification", color: "text-amber-600", bg: "bg-amber-50", count: 18, icon: "hourglass_top" },
                        { label: "Elite Performance", color: "text-emerald-600", bg: "bg-emerald-50", count: 124, icon: "verified" }
                    ].map(x => (
                        <div key={x.label} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all cursor-pointer">
                            <div className={`w-12 h-12 rounded-2xl ${x.bg} flex items-center justify-center ${x.color}`}>
                                <span className="material-symbols-outlined text-2xl">{x.icon}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{x.label}</p>
                                <p className={`text-2xl font-black ${x.color}`}>{x.count}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ListSection({ surveys, title, isAdmin, isSidebarCollapsed }: { surveys: Survey[], title: string, isAdmin: boolean, isSidebarCollapsed: boolean }) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden shadow-slate-200/40">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{isAdmin ? 'shield_with_house' : 'assignment'}</span>
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-[0.15em] text-slate-800">{title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{surveys.length} entries found</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filter
                    </button>
                    <button className="w-10 h-10 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-xl">download</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/30">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject/ID</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Check</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Geo Profile</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metric Variance</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {surveys.map(s => {
                            const config = statusConfig[s.status];
                            const variance = s.verifiedSize ? Math.abs(s.claimedSize - s.verifiedSize) : 0;
                            const variancePct = (variance / s.claimedSize) * 100;

                            return (
                                <tr key={s.id} className="hover:bg-primary/[0.02] transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-xl">person</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{s.farmerName}</p>
                                                <p className="text-[10px] font-mono text-slate-400 group-hover:text-slate-500">#{s.zedId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                                            <span className={`w-2 h-2 rounded-full ${config.color.split(' ')[0]}`}></span>
                                            <span className={`text-[10px] font-black uppercase tracking-tighter ${config.color.split(' ')[1]}`}>{config.label}</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1.5 ml-1 uppercase">{s.date}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-700">{s.region}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">{s.droneModel}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between text-[10px] font-bold">
                                                <span className="text-slate-400">Claimed: {s.claimedSize}HA</span>
                                                <span className="text-primary">Verified: {s.verifiedSize || '--'}HA</span>
                                            </div>
                                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                                                <div className="h-full bg-primary" style={{ width: s.verifiedSize ? `${(s.verifiedSize / s.claimedSize) * 100}%` : '0%' }}></div>
                                                {s.verifiedSize && s.verifiedSize < s.claimedSize && (
                                                    <div className="h-full bg-red-400" style={{ width: `${((s.claimedSize - s.verifiedSize) / s.claimedSize) * 100}%` }}></div>
                                                )}
                                            </div>
                                            {variancePct > 5 && (
                                                <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-1">Variance: {variancePct.toFixed(1)}%</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {surveys.length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center bg-slate-50/20">
                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl border border-slate-100 flex items-center justify-center mb-6 text-slate-200 overflow-hidden relative">
                        <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                        <span className="material-symbols-outlined text-5xl relative z-10">inventory_2</span>
                    </div>
                    <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No Strategic Records Found</p>
                </div>
            )}
        </div>
    );
}

function ConductSection({ profile, isSidebarCollapsed }: { profile: any, isSidebarCollapsed: boolean }) {
    const [step, setStep] = useState(1);
    const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
    const [isFlying, setIsFlying] = useState(false);

    const drones = [
        { id: "v10", name: "Aerbes V10 Pro", model: "Agri-Surveillance", img: "/drone_aerbes.png", spec: "Standard Optics · 40min Endurance", battery: "92%", color: "primary" },
        { id: "t40", name: "DJI Agras T40", model: "Heavy Duty Multi-spectral", img: "/drone_dji_t40.png", spec: "Hyperspectral Sensor · IP67 Waterproof", battery: "88%", color: "emerald-500" },
    ];

    const startSurvey = () => {
        setIsFlying(true);
        setTimeout(() => {
            setStep(2);
            setIsFlying(false);
        }, 2200);
    };

    return (
        <div className={`max-w-6xl mx-auto space-y-10 animate-fade-in pb-12 transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Mission Architect</h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">Pilot Control & Tactical Initialization</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full status-pulse"></span>
                        Pilot Authenticated
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex min-h-[700px] shadow-slate-200/50">
                <div className="w-72 bg-[#0d1526] p-10 flex flex-col gap-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
                    <div className="space-y-12 relative z-10">
                        {[
                            { n: "01", t: "Logistics", s: "Target Selection" },
                            { n: "02", t: "Tactical", s: "Fleet Deployment" },
                            { n: "03", t: "Operation", s: "Live Intelligence" },
                            { n: "04", t: "Analysis", s: "Synthesizing Data" }
                        ].map((x, i) => (
                            <div key={x.n} className={`flex gap-6 transition-all duration-500 ${step === i + 1 ? 'translate-x-2' : 'opacity-40 grayscale'}`}>
                                <span className={`text-xl font-black leading-none pt-1 ${step === i + 1 ? 'text-primary' : 'text-slate-600'}`}>{x.n}</span>
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">{x.t}</h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{x.s}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 p-12 md:p-16 relative bg-[#fcfdfe]">
                    {isFlying && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl z-30 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 relative mb-8 scale-150">
                                <div className="absolute inset-0 border-[3px] border-slate-100 rounded-[2rem]"></div>
                                <div className="absolute inset-0 border-[3px] border-primary rounded-[2rem] border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-primary animate-pulse">flight_takeoff</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Engaging Fleet</h3>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Spatial Telemetry...</p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white"><span className="material-symbols-outlined text-lg">person_search</span></div>
                                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Mission Objective</h4>
                                    </div>
                                    <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 hover:border-primary/30 transition-all group relative cursor-pointer overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Select Designated Resident</p>
                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="text-sm font-bold text-slate-900">Search HQ Database...</span>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white"><span className="material-symbols-outlined text-lg">inventory</span></div>
                                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Fleet Asset</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5">
                                        {drones.map(d => (
                                            <div
                                                key={d.id}
                                                onClick={() => setSelectedDrone(d.id)}
                                                className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${selectedDrone === d.id ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-slate-50 bg-white hover:border-slate-200'}`}
                                            >
                                                <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden relative p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                    <img src={d.img} alt={d.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h5 className="text-sm font-black text-slate-900">{d.name}</h5>
                                                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                                            <span className="material-symbols-outlined text-[12px] text-emerald-500 font-black">bolt</span>
                                                            <span className="text-[10px] font-black text-emerald-600">{d.battery}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2">{d.model}</p>
                                                    <p className="text-[10px] font-bold text-slate-600 truncate opacity-60">{d.spec}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    onClick={startSurvey}
                                    disabled={!selectedDrone}
                                    className="w-full bg-[#0d1526] text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-900 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-4 group"
                                >
                                    <span className="material-symbols-outlined group-hover:animate-bounce">rocket_launch</span>
                                    Initiate Command Center
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
                            <div className="bg-[#0b111e] aspect-video rounded-[3rem] shadow-2xl relative overflow-hidden ring-4 ring-slate-100 group">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-60 contrast-125 scale-110 group-hover:scale-100 transition-transform duration-[10s]"></div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-emerald-400 text-[10px] font-mono tracking-widest uppercase">
                                            LIVE TELEMETRY: ACTIVE
                                        </div>
                                        <div className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl animate-pulse">
                                            REC LIVE
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <button onClick={() => setStep(1)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black text-xs uppercase hover:bg-red-50 hover:text-red-500 transition-all">Abort</button>
                                <button onClick={() => setStep(3)} className="flex-1 bg-primary text-white py-5 rounded-3xl font-black text-xs uppercase shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all">Deploy</button>
                            </div>
                        </div>
                    )}

                    {step >= 3 && (
                        <div className="p-20 text-center space-y-8 animate-in zoom-in duration-500">
                            <div className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner relative">
                                <span className="material-symbols-outlined text-6xl">cloud_sync</span>
                                <div className="absolute inset-0 bg-emerald-200/20 animate-ping rounded-[2.5rem]"></div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Mission Live In-Orbit</h3>
                            <button onClick={() => setStep(1)} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Restart Sequence</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function GallerySection({ surveys, isSidebarCollapsed }: { surveys: Survey[], isSidebarCollapsed: boolean }) {
    const allImages = surveys.flatMap(s => s.images.map(img => ({ url: img, farmer: s.farmerName, zedId: s.zedId, date: s.date })));

    return (
        <div className="space-y-10 pb-16">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Spatial Archive</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em] opacity-60">Multi-spectral high-res imagery</p>
                </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSidebarCollapsed ? "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" : "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"} gap-8 transition-all duration-300`}>
                {allImages.length > 0 ? allImages.map((img, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                        <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative">
                            <img
                                src={img.url}
                                alt={`Aerial shot of ${img.farmer}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                <p className="text-xs font-bold text-white leading-relaxed">High-fidelity boundary verification capture.</p>
                            </div>
                        </div>
                        <div className="p-7">
                            <p className="text-sm font-black text-slate-800 truncate group-hover:text-primary transition-colors">{img.farmer}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{img.date}</p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-40 border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-6">photo_library</span>
                        <h4 className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em]">Storage Empty</h4>
                    </div>
                )}
            </div>
        </div>
    );
}
