"use client";

import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { LogisticsTrip, StorageDepot, inventoryBreakdown } from "../lib/data";
import { zedagroApi } from "../lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700", icon: "calendar_today" },
    in_transit: { label: "In Transit", color: "bg-emerald-100 text-emerald-700", icon: "local_shipping" },
    delivered: { label: "Delivered", color: "bg-slate-100 text-slate-700", icon: "check_circle" },
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: "schedule" },
};

export default function LogisticsClient({ profile }: { profile: any }) {
    const [logisticsTrips, setLogisticsTrips] = useState<LogisticsTrip[]>([]);
    const [storageDepots, setStorageDepots] = useState<StorageDepot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"tracking" | "schedule" | "storage" | "inventory">("tracking");
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    useEffect(() => {
        Promise.all([
            zedagroApi.getLogistics(),
            zedagroApi.getStorage(),
        ])
            .then(([trips, depots]) => {
                setLogisticsTrips(trips);
                setStorageDepots(depots);
            })
            .catch((err) => console.error("Failed to load logistics:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const inTransit = logisticsTrips.filter((t) => t.status === "in_transit");
    const pending = logisticsTrips.filter((t) => t.status === "pending");

    return (
        <>
            <Topbar
                title="Logistics"
                subtitle="Produce tracking & warehouse core"
                user={profile}
                actions={
                    <div className="flex gap-2">
                        <button className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-lg">receipt_long</span>
                            <span className="hidden sm:inline">Manifest</span>
                        </button>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="flex items-center justify-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            <span className="hidden sm:inline">Schedule</span>
                            <span className="sm:hidden text-[10px] uppercase">New</span>
                        </button>
                    </div>
                }
            />

            <div className="p-4 md:p-6 space-y-5 animate-fade-in pb-20 sm:pb-6">
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse h-24" />
                        ))}
                    </div>
                )}
                {/* Stats Row */}
                {!isLoading && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Produce (MT)", value: "1.24k", icon: "scale", color: "text-primary", bg: "bg-primary/5" },
                        { label: "Active Fleet", value: "42", icon: "local_shipping", color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "In Transit", value: inTransit.length.toString(), icon: "route", color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Pending", value: pending.length.toString(), icon: "schedule", color: "text-amber-600", bg: "bg-amber-50" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} rounded-bl-[2.5rem] transition-all group-hover:w-20 group-hover:h-20 -mr-4 -mt-4 opacity-50`}></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined text-sm ${stat.color}`}>{stat.icon}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                                </div>
                                <p className={`text-2xl font-black text-slate-900 tracking-tighter`}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>}

                {/* Logistics Tabs */}
                <div className="flex overflow-x-auto pb-2 -mb-2 no-scrollbar">
                    <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-full sm:w-fit whitespace-nowrap border border-slate-200/50">
                        {(["tracking", "schedule", "storage", "inventory"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-primary shadow-md shadow-black/5 ring-1 ring-slate-100" : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {tab === "tracking" ? "Live Tracking" : tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RENDER ACTIVE TAB */}
                {activeTab === "tracking" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div><h3 className="font-black text-xl text-slate-900">Active Transits</h3><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Live logistics layer</p></div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full status-pulse"></div><span className="text-[9px] font-black text-emerald-600 uppercase">Real-time</span></div>
                            </div>
                            <div className="space-y-6">
                                {logisticsTrips.map((trip) => (
                                    <div key={trip.id}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4 min-w-0"><div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">{trip.status === "in_transit" ? "🚛" : "🏭"}</div><div className="min-w-0"><p className="text-sm font-black text-slate-900 truncate uppercase">{trip.truckId}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{trip.driver} • {trip.produce}</p></div></div>
                                            <div className="flex flex-col items-end gap-1.5"><span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ring-1 ring-inset ring-current/10 ${statusConfig[trip.status].color}`}>{statusConfig[trip.status].label}</span>{trip.eta && <span className="text-[9px] font-black text-emerald-600 uppercase">ETA {trip.eta}</span>}</div>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full relative overflow-hidden"><div className={`absolute h-full rounded-full transition-all duration-1000 ${trip.status === "in_transit" ? "bg-primary" : "bg-slate-300"}`} style={{ width: `${trip.progress}%` }} /></div>
                                        <div className="flex justify-between mt-3"><p className="text-[10px] text-slate-400 font-bold uppercase">Point: <span className="text-slate-900 font-black">{trip.farmerName}</span></p><span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/5">{trip.progress}% COMPLETION</span></div>
                                        <div className="mt-8 border-b border-slate-50"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 md:p-8">
                                <h4 className="font-black text-xs mb-6 uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">qr_code_scanner</span>Identity Verification</h4>
                                <div className="border-4 border-dashed border-slate-50 rounded-3xl p-8 text-center bg-slate-50/50 cursor-pointer overflow-hidden relative"><div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-xl mb-4"><span className="material-symbols-outlined text-3xl text-primary/60">qr_code_2</span></div><p className="text-xs text-slate-900 font-black uppercase">Scan Produce Tag</p></div>
                                <div className="mt-6 relative"><input type="text" placeholder="TRACKING_ID..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:outline-none" /></div>
                            </div>
                            <div className="bg-slate-900 rounded-[2rem] shadow-2xl p-6 md:p-8 relative overflow-hidden"><h4 className="font-black text-xs mb-6 uppercase tracking-[0.2em] text-white/30">Analytics Hub</h4><div className="grid grid-cols-1 gap-6">{[{ label: "Daily Dispatch", value: "8", color: "text-primary", icon: "upload" }, { label: "Warehouse Entry", value: "5", color: "text-emerald-500", icon: "download" }].map((item, i) => (<div key={i} className="flex justify-between items-center group"><div className="flex items-center gap-3"><span className="text-[10px] text-white/50 font-black uppercase">{item.label}</span></div><span className={`text-sm font-black ${item.color}`}>{item.value}</span></div>))}</div></div>
                        </div>
                    </div>
                )}

                {activeTab === "schedule" && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30"><div><h3 className="font-black text-xl text-slate-900">Collection Queue</h3></div></div>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50"><tr><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Transport Hub</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Beneficiary</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Commodity</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Protocol</th></tr></thead>
                                <tbody className="divide-y divide-slate-50">{logisticsTrips.map((trip) => (<tr key={trip.id} className="hover:bg-slate-50/50 h-20 group"><td className="px-6 py-4"><div><span className="text-sm font-black text-slate-900 uppercase">{trip.truckId}</span></div></td><td className="px-6 py-4"><div><span className="text-sm font-black text-slate-700">{trip.farmerName}</span></div></td><td className="px-6 py-4"><div><span className="text-xs font-black text-slate-900">{trip.produce}</span></div></td><td className="px-6 py-4"><span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ring-1 ring-inset ring-current/10 ${statusConfig[trip.status].color}`}>{statusConfig[trip.status].label}</span></td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "storage" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {storageDepots.map((depot) => {
                            const pct = Math.round((depot.used / depot.capacity) * 100);
                            const color = pct >= 80 ? "text-red-500" : pct >= 55 ? "text-amber-500" : "text-emerald-500";
                            const barColor = pct >= 80 ? "bg-red-500" : pct >= 55 ? "bg-amber-500" : "bg-emerald-500";
                            return (
                                <div key={depot.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 md:p-8 card-hover overflow-hidden relative group">
                                    <div className="flex items-start justify-between mb-8"><div className="min-w-0"><h4 className="text-lg font-black text-slate-900 truncate uppercase tracking-tight">{depot.name}</h4><p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest">{depot.location}</p></div><div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${pct >= 80 ? "bg-red-50" : "bg-emerald-50"}`}><span className="material-symbols-outlined text-2xl" style={{ color: pct >= 80 ? "#ef4444" : "#10b981" }}>warehouse</span></div></div>
                                    <div className="space-y-4"><div className="flex justify-between items-end"><div className="flex flex-col"><span className={`text-4xl font-black tracking-tighter ${color}`}>{pct}%</span></div><div className="text-right"><span className="text-lg font-black text-slate-900 tracking-tighter">{(depot.used / 1000).toFixed(1)}K <span className="text-[10px]">MT</span></span></div></div><div className="h-2 bg-slate-100 rounded-full"><div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} /></div></div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === "inventory" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
                            <div className="mb-10"><h3 className="font-black text-xl text-slate-900">Stock Composition</h3></div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={inventoryBreakdown} layout="vertical" barSize={20}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 900 }} axisLine={false} tickLine={false} width={100} />
                                        <Tooltip cursor={{ fill: 'rgba(51, 65, 85, 0.03)' }} />
                                        <Bar dataKey="value" radius={[0, 10, 10, 0]}>{inventoryBreakdown.map((entry, index) => (<Cell key={index} fill={entry.color} />))}</Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Schedule Collection Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowScheduleModal(false)}>
                    <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100"><h3 className="text-2xl font-black text-slate-900 tracking-tight">Schedule Dispatch</h3><button onClick={() => setShowScheduleModal(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200"><span className="material-symbols-outlined">close</span></button></div>
                        <div className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Origin Point</label><input type="text" placeholder="ZED-882931" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest" /></div>
                            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Fleet Asset</label><select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black"><option>TRK-902 (FRA)</option></select></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Commodity</label><select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black"><option>Maize</option></select></div></div>
                        </div>
                        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4"><button onClick={() => setShowScheduleModal(false)} className="flex-1 bg-white border border-slate-200 py-4 rounded-xl text-[10px] font-black uppercase">Abort</button><button className="flex-1 bg-primary text-white py-4 rounded-xl text-[10px] font-black uppercase shadow-lg">Verify & Book</button></div>
                    </div>
                </div>
            )}
        </>
    );
}
