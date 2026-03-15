"use client";

import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { FraudAlert } from "../lib/data";
import { zedagroApi } from "../lib/api";

const severityConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    critical: { label: "Critical", color: "text-red-700", bg: "bg-red-100", icon: "report" },
    high: { label: "High", color: "text-orange-700", bg: "bg-orange-100", icon: "warning" },
    medium: { label: "Medium", color: "text-yellow-700", bg: "bg-yellow-100", icon: "info" },
    low: { label: "Low", color: "text-blue-700", bg: "bg-blue-100", icon: "help" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "bg-slate-100 text-slate-700" },
    investigating: { label: "Investigating", color: "bg-blue-100 text-blue-700" },
    resolved: { label: "Resolved", color: "bg-emerald-100 text-emerald-700" },
};

export default function FraudClient({ profile }: { profile: any }) {
    const [allAlerts, setAllAlerts] = useState<FraudAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterSeverity, setFilterSeverity] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);

    useEffect(() => {
        zedagroApi.getFraudAlerts()
            .then(setAllAlerts)
            .catch((err) => console.error("Failed to load fraud alerts:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = allAlerts.filter((a) => {
        const matchSev = filterSeverity === "All" || a.severity === filterSeverity.toLowerCase();
        const matchStat = filterStatus === "All" || a.status === filterStatus.toLowerCase().replace(" ", "_");
        return matchSev && matchStat;
    });

    const criticalCount = allAlerts.filter((a) => a.severity === "critical").length;
    const highCount = allAlerts.filter((a) => a.severity === "high").length;
    const openCount = allAlerts.filter((a) => a.status === "open").length;
    const investigatingCount = allAlerts.filter((a) => a.status === "investigating").length;

    return (
        <>
            <Topbar
                title="Fraud & Security"
                subtitle="AI Anomaly Detection"
                user={profile}
                actions={
                    <button className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export
                    </button>
                }
            />

            <div className="p-4 md:p-6 space-y-5 animate-fade-in">
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse h-24" />
                        ))}
                    </div>
                )}
                {/* AI Detection Banner */}
                <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-primary/10 overflow-hidden relative group">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                        <span className="material-symbols-outlined text-3xl">smart_toy</span>
                    </div>
                    <div className="flex-1 text-center md:text-left z-10">
                        <h3 className="font-black text-lg md:text-xl tracking-tight">AI Fraud Detection Engine</h3>
                        <p className="text-xs md:text-sm text-white/80 mt-1 max-w-xl">Analyzing biometric, GPS, and payment patterns in real-time to protect against agricultural subsidy fraud.</p>
                    </div>
                    <div className="flex gap-4 md:gap-8 w-full md:w-auto justify-center md:justify-end border-t border-white/10 md:border-none pt-4 md:pt-0">
                        <div className="text-center">
                            <p className="text-xl md:text-2xl font-black">99.2%</p>
                            <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Accuracy</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl md:text-2xl font-black">{allAlerts.length}</p>
                            <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Total Alerts</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Critical", value: criticalCount, color: "text-red-600", bg: "bg-red-50", icon: "report" },
                        { label: "High Priority", value: highCount, color: "text-orange-600", bg: "bg-orange-50", icon: "warning" },
                        { label: "Investigating", value: investigatingCount, color: "text-blue-600", bg: "bg-blue-50", icon: "search" },
                        { label: "Open Cases", value: openCount, color: "text-amber-600", bg: "bg-amber-50", icon: "pending" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 card-hover flex flex-col gap-2">
                            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}><span className={`material-symbols-outlined text-lg ${stat.color}`}>{stat.icon}</span></div>
                            <div><p className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</p><p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mt-1">{stat.label}</p></div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-red-500">report_problem</span><h3 className="font-bold text-base text-slate-800">Anomaly Feed</h3></div>
                        <div className="flex items-center gap-2">
                            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none bg-slate-50 font-bold text-slate-600">
                                {["All Severities", "Critical", "High", "Medium", "Low"].map((s) => (<option key={s} value={s === "All Severities" ? "All" : s}>{s}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {filtered.length > 0 ? filtered.map((alert) => {
                            const sc = severityConfig[alert.severity];
                            const stc = statusConfig[alert.status];
                            return (
                                <div key={alert.id} onClick={() => setSelectedAlert(alert)} className="p-4 md:p-5 flex items-start gap-4 hover:bg-slate-50/80 cursor-pointer transition-all active:bg-slate-100 group">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sc.bg} transition-transform group-hover:scale-110 shadow-sm border border-white/20`}><span className={`material-symbols-outlined text-lg ${sc.color}`}>{sc.icon}</span></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 mb-1"><span className="text-sm font-bold text-slate-900 truncate">{alert.type}</span><span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${sc.bg} ${sc.color} ring-1 ring-inset ring-current/10`}>{sc.label}</span></div>
                                        <p className="text-xs text-slate-500 line-clamp-2 md:line-clamp-1 mb-1.5 leading-relaxed">{alert.description}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter"><span className="text-slate-700">{alert.farmerName}</span><span className="text-slate-300">·</span><span className="font-mono">{alert.zedId}</span></div>
                                    </div>
                                    <div className="hidden sm:flex gap-2 shrink-0 self-center"><span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span></div>
                                </div>
                            )
                        }) : (<div className="p-12 text-center text-slate-400"><p className="text-sm font-medium">No alerts found</p></div>)}
                    </div>
                </div>
            </div>

            {selectedAlert && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedAlert(null)}>
                    <div className="bg-white rounded-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                            <div><div className="flex items-center gap-2 mb-2"><span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${severityConfig[selectedAlert.severity].bg} ${severityConfig[selectedAlert.severity].color} ring-1 ring-inset ring-current/10`}>{selectedAlert.severity}</span></div><h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedAlert.type}</h3></div>
                            <button onClick={() => setSelectedAlert(null)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm transition-all hover:rotate-90"><span className="material-symbols-outlined text-lg font-bold">close</span></button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto">
                            <div className={`p-4 rounded-2xl ${severityConfig[selectedAlert.severity].bg} border border-white/50 shadow-inner`}><p className={`text-sm font-bold ${severityConfig[selectedAlert.severity].color} leading-relaxed`}>{selectedAlert.description}</p></div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3"><button className="flex-1 bg-white border border-slate-200 py-3.5 rounded-xl font-bold text-xs uppercase shadow-sm">Skip</button><button className="flex-1 bg-primary text-white py-3.5 rounded-xl font-black text-xs uppercase shadow-lg shadow-primary/20">Investigate</button></div>
                    </div>
                </div>
            )}
        </>
    );
}
