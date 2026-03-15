"use client";

import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { FISPVoucher } from "../lib/data";
import { zedagroApi } from "../lib/api";

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    issued: { label: "Issued / Not Redeemed", color: "bg-amber-100 text-amber-700", icon: "schedule" },
    redeemed: { label: "Redeemed", color: "bg-emerald-100 text-emerald-700", icon: "check_circle" },
    expired: { label: "Expired", color: "bg-slate-100 text-slate-600", icon: "timer_off" },
    revoked: { label: "Revoked", color: "bg-red-100 text-red-700", icon: "block" },
};

export default function FISPClient({ profile }: { profile: any }) {
    const [vouchers, setVouchers] = useState<FISPVoucher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [verifyInput, setVerifyInput] = useState("");
    const [verifiedVoucher, setVerifiedVoucher] = useState<FISPVoucher | null>(null);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [redeemed, setRedeemed] = useState(false);

    useEffect(() => {
        zedagroApi.getVouchers()
            .then(setVouchers)
            .catch((err) => console.error("Failed to load vouchers:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const totalIssued = vouchers.length;
    const totalRedeemed = vouchers.filter((v) => v.status === "redeemed").length;
    const redemptionRate = totalIssued > 0 ? Math.round((totalRedeemed / totalIssued) * 100) : 0;

    const filtered = vouchers.filter((v) => {
        const matchSearch =
            v.farmerName.toLowerCase().includes(search.toLowerCase()) ||
            v.voucherId.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || v.status === statusFilter.toLowerCase().replace(" ", "_");
        return matchSearch && matchStatus;
    });

    const handleVerify = () => {
        setVerifyLoading(true);
        setTimeout(() => {
            const found = vouchers.find((v) => v.voucherId === verifyInput || v.farmerId === verifyInput);
            setVerifiedVoucher(found || null);
            setVerifyLoading(false);
            setRedeemed(false);
        }, 600);
    };

    const stockItems = [
        { name: "Urea Fertilizer", bags: 142, max: 200, color: "bg-primary" },
        { name: "D-Compound", bags: 12, max: 150, color: "bg-red-500" },
        { name: "Hybrid Maize (10kg)", bags: 450, max: 500, color: "bg-primary" },
    ];

    return (
        <>
            <Topbar
                title="FISP E-Voucher System"
                subtitle="Farmer Input Support Programme — Voucher Management"
                user={profile}
                actions={
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Issue Voucher
                    </button>
                }
            />

            <div className="p-4 md:p-6 space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Issued", value: isLoading ? "..." : totalIssued.toLocaleString(), icon: "confirmation_number", color: "text-primary" },
                        { label: "Redeemed", value: isLoading ? "..." : totalRedeemed.toLocaleString(), icon: "check_circle", color: "text-emerald-600" },
                        { label: "Pending", value: isLoading ? "..." : (totalIssued - totalRedeemed).toString(), icon: "schedule", color: "text-amber-600" },
                        { label: "Rate", value: isLoading ? "..." : `${redemptionRate}%`, icon: "bar_chart", color: "text-blue-600" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 card-hover">
                            <div className="flex items-center gap-2 mb-2"><span className={`material-symbols-outlined text-lg ${stat.color}`}>{stat.icon}</span><p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-black">{stat.label}</p></div>
                            <p className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6"><h3 className="text-base font-bold flex items-center gap-2 uppercase tracking-wide text-slate-700 font-black">Voucher Terminal</h3></div>
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            <div className="flex-1 flex items-center border-2 border-dashed border-primary/20 rounded-2xl p-8 justify-center flex-col gap-4 bg-primary/2 hover:bg-primary/5 transition-all group overflow-hidden relative cursor-pointer">
                                <span className="material-symbols-outlined text-3xl text-primary/60 group-hover:text-primary transition-all">photo_camera</span>
                                <p className="text-sm font-black text-slate-700 uppercase">Scan QR Code</p>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Manual Entry</label>
                                <div className="space-y-3">
                                    <input type="text" value={verifyInput} onChange={(e) => setVerifyInput(e.target.value)} placeholder="Voucher ID (e.g., FISP-9921)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium" />
                                    <button onClick={handleVerify} disabled={verifyLoading || !verifyInput} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20">
                                        {verifyLoading ? "Verifying..." : "Verify Voucher"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {verifiedVoucher ? (
                            <div className={`rounded-2xl p-5 border animate-in fade-in slide-in-from-bottom-2 duration-300 ${redeemed ? "bg-emerald-50 border-emerald-200" : "bg-primary/2 border-primary/10"}`}>
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                    <div className="flex gap-4"><div className="w-14 h-14 rounded-xl bg-white border border-primary/10 shadow-sm flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-3xl">account_circle</span></div><div className="min-w-0"><p className="text-[9px] text-primary/70 font-black uppercase tracking-widest leading-none mb-1">Farmer Identity</p><h4 className="text-base font-bold text-slate-900 truncate">{verifiedVoucher.farmerName}</h4><p className="text-sm font-mono text-primary font-bold">#{verifiedVoucher.voucherId}</p></div></div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${statusConfig[verifiedVoucher.status].color}`}>{statusConfig[verifiedVoucher.status].label}</span>
                                </div>
                                {!redeemed && verifiedVoucher.status === "issued" && (
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3"><button onClick={() => setRedeemed(true)} className="flex-1 bg-primary text-white py-3.5 rounded-xl font-black text-xs uppercase shadow-lg shadow-primary/20">Confirm & Redeem</button><button onClick={() => setVerifiedVoucher(null)} className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold">Cancel</button></div>
                                )}
                                {redeemed && (
                                    <div className="mt-6 p-4 bg-emerald-600 rounded-xl flex items-center gap-3 text-white shadow-lg shadow-emerald-200 animate-in zoom-in-95 duration-200"><span className="material-symbols-outlined text-2xl">check_circle</span><div><p className="font-black text-sm uppercase">Redeemed!</p></div></div>
                                )}
                            </div>
                        ) : (<div className="bg-slate-50 rounded-2xl p-10 text-center border border-dashed border-slate-200"><p className="text-sm text-slate-500 font-medium font-black">Waiting for input...</p></div>)}
                    </div>

                    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col">
                        <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-base uppercase tracking-wide text-slate-700 font-black">Depot Stock</h3></div>
                        <div className="space-y-6 flex-1">
                            {stockItems.map((item, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-600 truncate mr-2 font-black uppercase text-[10px]">{item.name}</span><span className={`text-[11px] font-black ${item.bags < 30 ? "text-red-600 bg-red-50 px-2 rounded-full" : "text-primary bg-primary/5 px-2 rounded-full"}`}>{item.bags}</span></div>
                                    <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${item.color}`} style={{ width: `${(item.bags / item.max) * 100}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="font-bold text-base flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">history</span>History</h3>
                        <div className="flex items-center gap-2">
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50" />
                        </div>
                    </div>
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left text-sm min-w-[700px]">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest"><tr><th className="px-6 py-4">Farmer</th><th className="px-6 py-4">Voucher</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((voucher) => (
                                    <tr key={voucher.id} className="hover:bg-slate-50/50 transition-colors group"><td className="px-6 py-4"><div><span className="font-bold text-slate-900">{voucher.farmerName}</span></div></td><td className="px-6 py-4"><div className="font-mono text-xs font-bold text-primary">#{voucher.voucherId}</div></td><td className="px-6 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter ${statusConfig[voucher.status].color}`}>{statusConfig[voucher.status].label.split(" / ")[0]}</span></td><td className="px-6 py-4 text-right"><button className="material-symbols-outlined text-slate-400 hover:text-primary">receipt_long</button></td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
