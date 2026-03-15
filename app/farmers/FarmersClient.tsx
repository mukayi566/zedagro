"use client";

import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { Farmer } from "../lib/data";
import { zedagroApi } from "../lib/api";

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    drone_verified: { label: "Drone Verified", color: "bg-emerald-100 text-emerald-700", icon: "check_circle" },
    pending_survey: { label: "Pending Survey", color: "bg-amber-100 text-amber-700", icon: "schedule" },
    flagged: { label: "Flagged", color: "bg-red-100 text-red-700", icon: "warning" },
    active: { label: "Active", color: "bg-blue-100 text-blue-700", icon: "check" },
};

export default function FarmersClient({ profile }: { profile: any }) {
    const [farmersList, setFarmersList] = useState<Farmer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
    const [selectedStatus, setSelectedStatus] = useState("All Statuses");
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
    const [showRegModal, setShowRegModal] = useState(false);

    useEffect(() => {
        const loadFarmers = async () => {
            try {
                const data = await zedagroApi.getFarmers();
                setFarmersList(data);
                if (data.length > 0) {
                    setSelectedFarmer(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch farmers:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadFarmers();
    }, []);

    const districts = ["All Districts", ...Array.from(new Set(farmersList.map((f) => f.district)))];
    const statuses = ["All Statuses", "Drone Verified", "Pending Survey", "Flagged"];

    const filtered = farmersList.filter((f) => {
        const matchSearch =
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.zedId.toLowerCase().includes(search.toLowerCase()) ||
            f.nrc.includes(search);
        const matchDistrict = selectedDistrict === "All Districts" || f.district === selectedDistrict;
        const matchStatus =
            selectedStatus === "All Statuses" ||
            (selectedStatus === "Drone Verified" && f.status === "drone_verified") ||
            (selectedStatus === "Pending Survey" && f.status === "pending_survey") ||
            (selectedStatus === "Flagged" && f.status === "flagged");
        return matchSearch && matchDistrict && matchStatus;
    });

    return (
        <>
            <Topbar
                title="Farmers"
                subtitle="Smallholder registry & verification"
                user={profile}
                actions={
                    <button
                        onClick={() => setShowRegModal(true)}
                        className="flex items-center justify-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        <span className="hidden sm:inline">Register</span>
                        <span className="sm:hidden text-[10px] uppercase">New</span>
                    </button>
                }
            />

            <div className="p-4 md:p-6 space-y-5 animate-fade-in pb-20 sm:pb-6">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative group">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">search</span>
                        <input
                            type="text"
                            placeholder="ZED-ID, NRC, or Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="flex-1 sm:w-40 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm appearance-none"
                        >
                            {districts.map((d) => (<option key={d}>{d}</option>))}
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="flex-1 sm:w-40 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm appearance-none"
                        >
                            {statuses.map((s) => (<option key={s}>{s}</option>))}
                        </select>
                    </div>
                </div>

                {/* Main Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Farmer List */}
                    <div className={`${selectedFarmer ? "hidden lg:block lg:col-span-2" : "col-span-1 lg:col-span-3"} bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden`}>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Farmer Profile</th>
                                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:table-cell">Identity</th>
                                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:table-cell">Region</th>
                                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Verification</th>
                                        <th className="px-4 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filtered.map((farmer) => {
                                        const sc = statusConfig[farmer.status] || statusConfig.active;
                                        const isSelected = selectedFarmer?.id === farmer.id;
                                        return (
                                            <tr
                                                key={farmer.id}
                                                onClick={() => setSelectedFarmer(farmer)}
                                                className={`cursor-pointer transition-all h-20 ${isSelected ? "bg-primary/[0.03]" : "hover:bg-slate-50/50"}`}
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-[10px] ring-1 ring-slate-200 shadow-inner group-hover:scale-110 transition-transform">
                                                            {farmer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-slate-900 truncate tracking-tight">{farmer.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{farmer.phone}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden sm:table-cell">
                                                    <p className="font-black text-[10px] text-primary tracking-widest leading-none mb-1">{farmer.zedId}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{farmer.nrc}</p>
                                                </td>
                                                <td className="px-5 py-4 hidden md:table-cell">
                                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{farmer.district}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{farmer.province}</p>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-widest ${sc.color} ring-1 ring-inset ring-current/10`}>
                                                            <span className="material-symbols-outlined text-xs">{sc.icon}</span>
                                                            <span className="hidden sm:inline">{sc.label}</span>
                                                        </span>
                                                        <p className="text-[11px] font-black text-slate-800">{farmer.verifiedSize} <span className="text-[9px] text-slate-400">HA</span></p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-xl">chevron_right</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/30">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Listing {filtered.length} entries</p>
                            <div className="flex gap-2">
                                <button className="p-1.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-30" disabled>
                                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                                </button>
                                <button className="p-1.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 shadow-sm">
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Farmer Detail Panel */}
                    {selectedFarmer && (
                        <div className="lg:col-span-1 space-y-4">
                            {/* Mobile Back Button */}
                            <button
                                onClick={() => setSelectedFarmer(null)}
                                className="lg:hidden flex items-center justify-center w-full gap-2 bg-slate-100 text-slate-600 py-4 rounded-3xl font-black text-xs uppercase tracking-widest mb-4 border border-slate-200"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Return to Registry
                            </button>

                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden sticky top-24">
                                {/* Header */}
                                <div className="bg-slate-900 p-6 md:p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -mr-16 -mt-16 pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white flex items-center justify-center font-black text-2xl text-slate-900 shadow-2xl ring-4 ring-white/10">
                                                {selectedFarmer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <button className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white tracking-tight">{selectedFarmer.name}</h3>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">{selectedFarmer.zedId}</p>
                                        </div>
                                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/20 rounded-full">
                                            <span className="material-symbols-outlined text-xs text-emerald-400">fingerprint</span>
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{selectedFarmer.biometricVerified ? "Biometric Secure" : "Pending Hardware Sync"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 space-y-8">
                                    {/* Farm Metrics */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-inner">
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2">Claimed Area</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{selectedFarmer.farmSize} <span className="text-sm">HA</span></p>
                                        </div>
                                        <div className="bg-primary/[0.03] rounded-3xl p-5 border border-primary/10 shadow-inner">
                                            <p className="text-[9px] font-black uppercase text-primary/60 tracking-widest mb-2">Verified GIS</p>
                                            <p className="text-2xl font-black text-primary tracking-tighter">{selectedFarmer.verifiedSize} <span className="text-sm">HA</span></p>
                                        </div>
                                    </div>

                                    {/* Intel & Location */}
                                    <div className="space-y-4">
                                        {[
                                            { label: "Phone Terminal", val: selectedFarmer.phone, icon: "phone" },
                                            { label: "Admin Sector", val: `${selectedFarmer.district}, ${selectedFarmer.province}`, icon: "location_on" },
                                            { label: "Coordinates", val: `${selectedFarmer.lat}, ${selectedFarmer.lng}`, icon: "map" },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center gap-4 group">
                                                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                                                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                                                    <p className="text-xs font-black text-slate-700 truncate">{item.val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Crop Diversification */}
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Commodity Focus</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedFarmer.crops.map((crop) => (
                                                <span key={crop} className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg shadow-slate-900/10">
                                                    {crop}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Deck */}
                                    <div className="pt-4 flex flex-col gap-3">
                                        <button className="flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                                            <span className="material-symbols-outlined text-lg">confirmation_number</span>
                                            Issue FISP Voucher
                                        </button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 text-slate-600 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                                <span className="material-symbols-outlined text-lg">flight_takeoff</span>
                                                Survey
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 text-slate-600 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                                <span className="material-symbols-outlined text-lg">history</span>
                                                Yields
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Registration Modal */}
            {showRegModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowRegModal(false)}>
                    <div
                        className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Onboard Farmer</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">New verified security record</p>
                            </div>
                            <button onClick={() => setShowRegModal(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:rotate-90 transition-all shadow-sm">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Legal Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" placeholder="Given name" />
                                </div>
                                <div className="space-y-2 mt-auto">
                                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" placeholder="Surname" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">National ID (NRC)</label>
                                <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-mono" placeholder="443212/11/1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mobile Terminal</label>
                                    <input type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" placeholder="+260..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Admin Province</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer">
                                        <option>Lusaka Central</option>
                                        <option>Copperbelt S.</option>
                                        <option>Eastern Region</option>
                                        <option>Southern Prov.</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Area Claimed (HA)</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" placeholder="0.0" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Legacy Crop</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer">
                                        <option>Maize (White)</option>
                                        <option>Soya Beans</option>
                                        <option>Wheat (Winter)</option>
                                        <option>Cotton</option>
                                    </select>
                                </div>
                            </div>

                            {/* Biometric Protocol */}
                            <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-8 text-center bg-slate-50 relative group transition-all hover:bg-white hover:border-primary/20">
                                <div className="flex flex-col items-center relative z-10">
                                    <div className="w-20 h-20 rounded-[2rem] bg-white mx-auto flex items-center justify-center mb-4 shadow-xl ring-1 ring-slate-100 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                                        <span className="material-symbols-outlined text-4xl text-primary/60 group-hover:text-primary transition-colors">fingerprint</span>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 tracking-tight">Establish Biometric Identity</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 mb-6">ISO/IEC 19794 Standards Registry</p>
                                    <button className="text-[11px] font-black text-primary border-2 border-primary/20 px-8 py-3 rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                        INITIATE SENSOR
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                            <button onClick={() => setShowRegModal(false)} className="order-2 sm:order-1 flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm">
                                Abort
                            </button>
                            <button className="order-1 sm:order-2 flex-1 bg-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                                Create Identity
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
