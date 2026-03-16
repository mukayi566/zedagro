"use client";

import Topbar from "../components/Topbar";
import {
    summaryStats,
    registrationGrowth,
    produceByRegion,
    paymentMethodBreakdown,
    logisticsTrips,
    fraudAlerts,
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

const statCards = [
    {
        label: "Total Registered Farmers",
        value: "1,240,500",
        change: "+12%",
        positive: true,
        icon: "people",
        sub: "ZED-ID verified accounts",
        color: "primary",
    },
    {
        label: "Verified Farm Hectares",
        value: "4.2M ha",
        change: "+5%",
        positive: true,
        icon: "landscape",
        sub: "Satellite confirmed boundaries",
        color: "primary",
    },
    {
        label: "Total Payments (ZMW)",
        value: "K850M",
        change: "+22%",
        positive: true,
        icon: "payments",
        sub: "Zambian Kwacha processed",
        color: "primary",
    },
    {
        label: "FISP Vouchers Issued",
        value: "1.24M",
        change: "+8%",
        positive: true,
        icon: "confirmation_number",
        sub: "843k redeemed (68%)",
        color: "primary",
    },
    {
        label: "Active Trucks",
        value: "42",
        change: "+5%",
        positive: true,
        icon: "local_shipping",
        sub: "18 pending collections",
        color: "primary",
    },
];

const recentActivity = [
    { type: "payment", text: "Payment of K18,750 sent to Mubanga Kalunga (MTN MoMo)", time: "2m ago", icon: "payments", color: "green" },
    { type: "fraud", text: "Fraud alert: Farm size discrepancy for ZED-773122", time: "15m ago", icon: "warning", color: "red" },
    { type: "voucher", text: "FISP Voucher #FISP-9921 redeemed at Lusaka West Agrostore", time: "1h ago", icon: "confirmation_number", color: "blue" },
    { type: "farmer", text: "New farmer registered: Charles Mwape (ZED-991423)", time: "2h ago", icon: "person_add", color: "green" },
    { type: "logistics", text: "Truck TRK-882 departed from Farm (Mansa) with 12MT soya", time: "3h ago", icon: "local_shipping", color: "orange" },
];

export default function DashboardClient({ profile }: { profile: any }) {
    const role = profile?.role || 'farmer';
    const { isSidebarCollapsed } = useLayout();

    return (
        <>
            <Topbar
                title={role === 'admin' ? "Admin Dashboard" : role === 'field_agent' ? "Field Operations Dashboard" : "Farmer Dashboard"}
                subtitle={role === 'admin' ? "GIS Analytics & System Overview — 2026 Season" : role === 'field_agent' ? "Farmer Verification & Drone Survey Ops" : "My Farming Overview & FISP Status"}
                user={profile}
                actions={
                    role === 'admin' && (
                        <div className="flex flex-wrap gap-2">
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-all">
                                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                                PDF
                            </button>
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-primary/90 shadow-sm transition-all whitespace-nowrap">
                                <span className="material-symbols-outlined text-base">download</span>
                                Export
                            </button>
                        </div>
                    )
                }
            />

            <div className="p-4 md:p-6 space-y-6 animate-fade-in">


                {/* Primary Stat Cards */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSidebarCollapsed ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"} gap-4 transition-all duration-300`}>
                    {statCards.map((card, i) => (
                        <div
                            key={i}
                            className={`bg-white rounded-xl p-4 shadow-sm border card-hover border-l-4 border-l-primary border-slate-100`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${card.positive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                                    {card.change}
                                </span>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-xl md:text-2xl font-black text-slate-900">{card.value}</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5 leading-tight">{card.label}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">{card.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Farmer Registration Growth */}
                    <div className="xl:col-span-2 bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
                            Registration Growth
                        </h3>
                        <div className="h-[200px] md:h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={registrationGrowth}>
                                    <defs>
                                        <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1a4231" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#1a4231" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="farmers" stroke="#1a4231" strokeWidth={2.5} fill="url(#grad1)" dot={{ fill: "#1a4231", r: 3 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">pie_chart</span>
                            Payment Methods
                        </h3>
                        <div className="h-[180px] md:h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={paymentMethodBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                        {paymentMethodBreakdown.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Analytics Insights Row */}
                {(role === 'admin' || role === 'field_agent') && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Voucher Redemption Trends */}
                        <div className="xl:col-span-2 bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-100">
                            <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">confirmation_number</span>
                                Voucher Redemption Trends
                            </h3>
                            <div className="h-[200px] md:h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={voucherRedemptionByMonth} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: "12px", border: 'none', fontSize: "12px" }} />
                                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }} />
                                        <Bar dataKey="issued" name="Issued" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="redeemed" name="Redeemed" fill="#1a4231" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Storage Inventory */}
                        <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-100">
                            <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">inventory_2</span>
                                Storage Inventory
                            </h3>
                            <div className="h-[180px] md:h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={inventoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                            {inventoryBreakdown.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Operations Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Produce by Region */}
                    <div className="xl:col-span-2 bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">local_shipping</span>
                            Produce Collection by Region (MT)
                        </h3>
                        <div className="h-[200px] md:h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={produceByRegion} barSize={12} margin={{ left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="region" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="maize" fill="#1a4231" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="soya" fill="#4d8d6b" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="wheat" fill="#FBBF24" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-xs">
                            <span className="material-symbols-outlined text-primary text-lg">history</span>
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {recentActivity.map((item, i) => (
                                <div key={i} className="flex gap-3 group">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 text-slate-600`}>
                                        <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-700 leading-snug font-medium">{item.text}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Regional Performance - From Analytics */}
                {(role === 'admin' || role === 'field_agent') && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">analytics</span>
                                Regional Productivity & Compliance
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2026 Season Analysis</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Province</th>
                                        <th className="px-6 py-4 text-center">Farmers</th>
                                        <th className="px-6 py-4 text-center">Produce (MT)</th>
                                        <th className="px-6 py-4 text-center">Value (ZMW)</th>
                                        <th className="px-6 py-4 text-right">Flags</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {[
                                        { province: "Lusaka", farmers: "284,210", produce: "3,100", payments: "K142M", fraud: 42 },
                                        { province: "Copperbelt", farmers: "198,400", produce: "1,900", payments: "K98M", fraud: 18 },
                                        { province: "Central", farmers: "221,300", produce: "4,000", payments: "K155M", fraud: 31 },
                                        { province: "Southern", farmers: "312,500", produce: "5,200", payments: "K195M", fraud: 25 },
                                        { province: "Eastern", farmers: "145,000", produce: "2,840", payments: "K88M", fraud: 12 }
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900">{row.province}</td>
                                            <td className="px-6 py-4 text-center text-slate-600 font-medium">{row.farmers}</td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-800">{row.produce}</td>
                                            <td className="px-6 py-4 text-center font-black text-primary">{row.payments}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${parseInt(row.fraud.toString()) > 30 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                                                    {row.fraud}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
