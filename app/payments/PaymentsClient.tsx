"use client";

import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { Payment } from "../lib/data";
import { zedagroApi } from "../lib/api";
import { useLayout } from "../components/LayoutContext";

const statusConfig: Record<string, { label: string; color: string; icon: string; bg: string }> = {
    pending: { label: "Pending", color: "text-amber-700", icon: "schedule", bg: "bg-amber-100" },
    processing: { label: "Processing", color: "text-blue-700", icon: "sync", bg: "bg-blue-100" },
    completed: { label: "Completed", color: "text-emerald-700", icon: "check_circle", bg: "bg-emerald-100" },
    failed: { label: "Failed", color: "text-red-700", icon: "error", bg: "bg-red-100" },
};

const methodConfig: Record<string, { label: string; color: string; icon: string; bg: string }> = {
    mobile_money: { label: "Mobile Money", color: "text-yellow-700", icon: "phone_android", bg: "bg-yellow-100" },
    bank: { label: "Bank Transfer", color: "text-blue-700", icon: "account_balance", bg: "bg-blue-100" },
    wallet: { label: "Digital Wallet", color: "text-purple-700", icon: "account_balance_wallet", bg: "bg-purple-100" },
};

export default function PaymentsClient({ profile }: { profile: any }) {
    const { isSidebarCollapsed } = useLayout();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        zedagroApi.getPayments()
            .then(setPayments)
            .catch((err) => console.error("Failed to load payments:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = payments.filter((p) => {
        const matchSearch = p.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) || p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === "All" || p.status === filterStatus.toLowerCase();
        return matchSearch && matchStatus;
    });

    const totalCompleted = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
    const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

    return (
        <>
            <Topbar
                title="Payments"
                subtitle="Financial management"
                user={profile}
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-primary text-primary px-3 sm:px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/5 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">payments</span>
                            Bulk
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">add</span>
                            New
                        </button>
                    </div>
                }
            />

            <div className="p-4 md:p-6 space-y-6 animate-fade-in">
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className={`grid grid-cols-2 ${isSidebarCollapsed ? "lg:grid-cols-4" : "xl:grid-cols-4"} gap-4 transition-all duration-300`}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse h-24" />
                        ))}
                    </div>
                )}
                {/* Stats Cards */}
                {!isLoading && <div className={`grid grid-cols-2 ${isSidebarCollapsed ? "lg:grid-cols-4" : "xl:grid-cols-4"} gap-4 transition-all duration-300`}>
                    {[
                        { label: "Completed", value: `K${(totalCompleted / 1000).toFixed(1)}K`, icon: "check_circle", color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Pending", value: `K${(totalPending / 1000).toFixed(1)}K`, icon: "schedule", color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Count", value: payments.length.toString(), icon: "receipt_long", color: "text-primary", bg: "bg-primary/10" },
                        { label: "Average", value: `K${(payments.reduce((s, p) => s + p.amount, 0) / payments.length / 1000).toFixed(1)}K`, icon: "bar_chart", color: "text-blue-600", bg: "bg-blue-50" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 card-hover flex flex-col gap-2">
                            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-lg ${stat.color}`}>{stat.icon}</span>
                            </div>
                            <div>
                                <p className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>}

                {/* Integration Status Providers */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSidebarCollapsed ? "lg:grid-cols-3" : "xl:grid-cols-3"} gap-4 transition-all duration-300`}>
                    {[
                        { name: "MTN MoMo", icon: "phone_android", desc: "Sandbox · LIVE", color: "text-yellow-600", bg: "bg-white border-yellow-100" },
                        { name: "Airtel Money", icon: "phone_iphone", desc: "Sandbox · LIVE", color: "text-red-500", bg: "bg-white border-red-100" },
                        { name: "ZANACO Bank", icon: "account_balance", desc: "API · LIVE", color: "text-blue-600", bg: "bg-white border-blue-100" },
                    ].map((provider, i) => (
                        <div key={i} className={`rounded-2xl p-4 border shadow-sm flex items-center gap-4 transition-all hover:shadow-md cursor-default group ${provider.bg}`}>
                            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <span className={`material-symbols-outlined text-2xl ${provider.color}`}>{provider.icon}</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-sm tracking-tight">{provider.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{provider.desc}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full status-pulse"></div>
                                <span className="text-[8px] font-black text-emerald-500 mt-1">OK</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                            <h3 className="font-bold text-base text-slate-800">History</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative flex-1 sm:flex-none">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search..."
                                    className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-primary/5 w-full sm:w-40"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-600 focus:outline-none"
                            >
                                {["All", "Pending", "Processing", "Completed", "Failed"].map((s) => (<option key={s}>{s}</option>))}
                            </select>
                            <button className="flex items-center gap-1.5 border border-slate-200 p-1.5 rounded-xl hover:bg-slate-50">
                                <span className="material-symbols-outlined text-lg text-slate-500">download</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Farmer</th>
                                    <th className="hidden md:table-cell px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produce</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    <th className="hidden sm:table-cell px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-5 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.length > 0 ? filtered.map((payment) => {
                                    const sc = statusConfig[payment.status];
                                    const mc = methodConfig[payment.method];
                                    return (
                                        <tr
                                            key={payment.id}
                                            onClick={() => setSelectedPayment(payment)}
                                            className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] ring-1 ring-primary/20">
                                                        {payment.farmerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-sm font-bold text-slate-900 block truncate">{payment.farmerName}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono hidden sm:block">#{payment.transactionRef}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-5 py-4 text-xs font-medium text-slate-500">
                                                {payment.produce}
                                                <span className="block text-[10px] text-slate-400">{payment.quantity}kg @ K{payment.unitPrice}</span>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-black text-slate-800 text-right">
                                                K{payment.amount.toLocaleString()}
                                            </td>
                                            <td className="hidden sm:table-cell px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded-full ${mc.color} ${mc.bg} ring-1 ring-inset ring-current/10`}>
                                                    <span className="material-symbols-outlined text-xs">{mc.icon}</span>
                                                    {payment.provider || mc.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded-full ${sc.color} ${sc.bg} ring-1 ring-inset ring-current/10`}>
                                                    <span className="material-symbols-outlined text-[10px] sm:text-xs">{sc.icon}</span>
                                                    <span className="hidden sm:inline">{sc.label}</span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-lg">chevron_right</span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-4xl block mb-2 opacity-20">receipt_long</span>
                                            <p className="text-sm font-medium">No transactions found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bulk Payment Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowBulkModal(false)}>
                    <div
                        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                            <div><h3 className="text-xl font-black text-slate-900">Bulk Disbursements</h3><p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Automated queue processing</p></div>
                            <button onClick={() => setShowBulkModal(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><span className="material-symbols-outlined text-lg">close</span></button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10"><p className="text-3xl font-black text-primary">4</p><p className="text-[10px] font-black text-slate-500 uppercase mt-1">Pending Farmers</p></div>
                                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100"><p className="text-3xl font-black text-emerald-600">K96.4K</p><p className="text-[10px] font-black text-slate-500 uppercase mt-1">Gross Total</p></div>
                            </div>
                            <div className="space-y-4">
                                <div><label className="text-[10px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-sm">event</span>Effective Date</label><input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold bg-slate-50/50" defaultValue={new Date().toISOString().split('T')[0]} /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-sm">tap_and_play</span>Channel</label><select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold bg-slate-50/50"><option>MTN MoMo API</option><option>Airtel Money API</option><option>Commercial Bank</option></select></div>
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl"><div className="flex items-start gap-3"><span className="material-symbols-outlined text-amber-500 mt-0.5">verified_user</span><p className="text-[11px] text-amber-700/80 font-medium">Two-factor authorization required.</p></div></div>
                            </div>
                        </div>
                        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3 mt-auto">
                            <button onClick={() => setShowBulkModal(false)} className="order-2 sm:order-1 flex-1 border border-slate-200 py-3.5 rounded-xl text-xs font-black uppercase">Cancel</button>
                            <button className="order-1 sm:order-2 flex-1 bg-primary text-white py-3.5 rounded-xl text-xs font-black uppercase shadow-lg shadow-primary/20">Execute Queue</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Detail Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedPayment(null)}>
                    <div
                        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div><h3 className="text-xl font-black text-slate-900">Voucher Details</h3><p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{selectedPayment.transactionRef}</p></div>
                            <button onClick={() => setSelectedPayment(null)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><span className="material-symbols-outlined text-lg">close</span></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className={`p-6 rounded-3xl ${statusConfig[selectedPayment.status].bg} border border-white/50 text-center`}>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Disbursement</span>
                                    <p className="text-5xl font-black text-slate-900">K{selectedPayment.amount.toLocaleString()}</p>
                                    <span className={`mt-4 inline-flex items-center gap-1.5 text-[10px] font-black uppercase rounded-full px-3 py-1 ring-2 ring-white/50 ${statusConfig[selectedPayment.status].color} ${statusConfig[selectedPayment.status].bg}`}>
                                        <span className="material-symbols-outlined text-xs">{statusConfig[selectedPayment.status].icon}</span>
                                        {statusConfig[selectedPayment.status].label}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: "Beneficiary", val: selectedPayment.farmerName, icon: "person" },
                                    { label: "Commodity", val: selectedPayment.produce, icon: "inventory_2" },
                                    { label: "Method", val: selectedPayment.provider || selectedPayment.method, icon: "payments" },
                                    { label: "Ref", val: selectedPayment.transactionRef, icon: "tag" },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between items-center py-2 px-1 border-b border-slate-50 last:border-0">
                                        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-300 text-base">{item.icon}</span><span className="text-[11px] text-slate-400 font-bold uppercase">{item.label}</span></div>
                                        <span className="text-xs font-black text-slate-700 ml-4">{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                            <button className="flex-1 bg-white border border-slate-200 py-3.5 rounded-xl text-xs font-black uppercase text-slate-700 flex items-center justify-center gap-2 shadow-sm"><span className="material-symbols-outlined text-lg">print</span>Receipt</button>
                            <button onClick={() => setSelectedPayment(null)} className="flex-1 bg-primary text-white py-3.5 rounded-xl text-xs font-black uppercase shadow-lg shadow-primary/20">Done</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
