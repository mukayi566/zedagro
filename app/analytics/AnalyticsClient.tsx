"use client";

import Topbar from "../components/Topbar";
import {
    registrationGrowth,
    produceByRegion,
    paymentMethodBreakdown,
    voucherRedemptionByMonth,
    inventoryBreakdown,
} from "../lib/data";
import { useLayout } from "../components/LayoutContext";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function AnalyticsClient({ profile }: { profile: any }) {
    const { isSidebarCollapsed } = useLayout();
    return (
        <>
            <Topbar
                title="Analytics & Reports"
                subtitle="Data insights — 2026 Season"
                user={profile}
                actions={
                    <div className="flex flex-wrap gap-2">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                            PDF
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 shadow-sm transition-all whitespace-nowrap">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export CSV
                        </button>
                    </div>
                }
            />

            <div className="p-4 md:p-6 space-y-6 animate-fade-in">
                {/* KPI Banner Row */}
                <div className={`grid grid-cols-2 md:grid-cols-4 ${isSidebarCollapsed ? "xl:grid-cols-8" : "xl:grid-cols-6 2xl:grid-cols-8"} gap-3 transition-all duration-300`}>
                    {[
                        { label: "Registered", value: "1.24M", unit: "Farmers", color: "text-primary" },
                        { label: "Verified", value: "4.2M", unit: "Hectares", color: "text-emerald-600" },
                        { label: "Payments", value: "K850M", unit: "ZMW Total", color: "text-blue-600" },
                        { label: "Vouchers", value: "68%", unit: "Redeemed", color: "text-amber-600" },
                        { label: "Trips", value: "1,240", unit: "Completed", color: "text-slate-700" },
                        { label: "Storage", value: "31.7K", unit: "MT Stored", color: "text-indigo-600" },
                        { label: "Fraud", value: "142", unit: "Flagged", color: "text-red-600" },
                        { label: "Agents", value: "1,842", unit: "Field Agents", color: "text-slate-600" },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center card-hover">
                            <p className={`text-lg md:text-xl font-black ${kpi.color}`}>{kpi.value}</p>
                            <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">{kpi.unit}</p>
                            <p className="text-[9px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter">{kpi.label}</p>
                        </div>
                    ))}
                </div>

                {/* Growth + Redemption Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
                        <div className="mb-6">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl">trending_up</span>Registration Growth</h3>
                        </div>
                        <div className="h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={registrationGrowth}>
                                    <defs><linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a4231" stopOpacity={0.15} /><stop offset="95%" stopColor="#1a4231" stopOpacity={0} /></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                                    <Tooltip contentStyle={{ borderRadius: "12px", border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: "12px" }} />
                                    <Area type="monotone" dataKey="farmers" stroke="#1a4231" strokeWidth={3} fill="url(#colorFarmers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
                        <div className="mb-6"><h3 className="font-bold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl">confirmation_number</span>Voucher Redemption</h3></div>
                        <div className="h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={voucherRedemptionByMonth} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: "12px", border: 'none', fontSize: "12px" }} /><Legend wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }} /><Bar dataKey="issued" name="Issued" fill="#e2e8f0" radius={[4, 4, 0, 0]} /><Bar dataKey="redeemed" name="Redeemed" fill="#1a4231" radius={[4, 4, 0, 0]} /></BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Regional Produce Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 md:p-6 border-b border-slate-100"><h3 className="font-bold text-base">Regional Performance</h3></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest"><tr><th className="px-6 py-4">Province</th><th className="px-6 py-4">Farmers</th><th className="px-6 py-4">Produce (MT)</th><th className="px-6 py-4">Value (ZMW)</th><th className="px-6 py-4">Flags</th></tr></thead>
                            <tbody className="divide-y divide-slate-50">{[
                                { province: "Lusaka", farmers: "284,210", produce: "3,100", payments: "K142M", fraud: 42 }, { province: "Copperbelt", farmers: "198,400", produce: "1,900", payments: "K98M", fraud: 18 }, { province: "Central", farmers: "221,300", produce: "4,000", payments: "K155M", fraud: 31 }
                            ].map((row, i) => (<tr key={i} className="hover:bg-slate-50/50 transition-colors"><td className="px-6 py-4 font-bold text-slate-900">{row.province}</td><td className="px-6 py-4 text-slate-600">{row.farmers}</td><td className="px-6 py-4 font-bold text-slate-800">{row.produce}</td><td className="px-6 py-4 font-black text-primary">{row.payments}</td><td className="px-6 py-4"><span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${row.fraud > 30 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>{row.fraud}</span></td></tr>))}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
