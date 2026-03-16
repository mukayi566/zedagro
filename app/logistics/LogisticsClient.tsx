"use client";

import { useState, useEffect, useMemo } from "react";
import Topbar from "../components/Topbar";
import { LogisticsTrip, StorageDepot, inventoryBreakdown } from "../lib/data";
import { zedagroApi } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Map, { Marker, NavigationControl, ViewStateChangeEvent } from "react-map-gl/mapbox";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useLayout } from "../components/LayoutContext";
import "mapbox-gl/dist/mapbox-gl.css";

const statusConfig: Record<string, { label: string; color: string; icon: string; dotColor: string }> = {
    ready: { label: "Ready", color: "bg-slate-100 text-slate-700", icon: "inventory_2", dotColor: "#64748b" },
    assigned: { label: "Assigned", color: "bg-blue-100 text-blue-700", icon: "person_pin", dotColor: "#3b82f6" },
    loading: { label: "Loading", color: "bg-amber-100 text-amber-700", icon: "box", dotColor: "#f59e0b" },
    in_transit: { label: "In Transit", color: "bg-emerald-100 text-emerald-700", icon: "local_shipping", dotColor: "#10b981" },
    arrived: { label: "At Depot", color: "bg-purple-100 text-purple-700", icon: "warehouse", dotColor: "#8b5cf6" },
    delivered: { label: "Delivered", color: "bg-blue-100 text-blue-700", icon: "check_circle", dotColor: "#3b82f6" },
};

// Mock coordinates for active fleet
const fleetMarkers = [
    { id: 1, lat: -15.4167, lng: 28.2833, label: "TRK-882", status: "in_transit" },
    { id: 2, lat: -12.9667, lng: 28.6333, label: "TRK-410", status: "in_transit" },
    { id: 3, lat: -11.2, lng: 28.8833, label: "TRK-115", status: "loading" },
    { id: 4, lat: -13.6333, lng: 32.65, label: "TRK-221", status: "arrived" },
    { id: 5, lat: -14.4167, lng: 28.4833, label: "TRK-902", status: "in_transit" },
    { id: 6, lat: -15.1167, lng: 29.2833, label: "TRK-551", status: "loading" },
];

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function LogisticsClient({ profile }: { profile: any }) {
    const { isSidebarCollapsed } = useLayout();
    const [logisticsTrips, setLogisticsTrips] = useState<LogisticsTrip[]>([]);
    const [storageDepots, setStorageDepots] = useState<StorageDepot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedTrip, setSelectedTrip] = useState<LogisticsTrip | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'analytics' | 'map'>('analytics');

    const [viewState, setViewState] = useState({
        latitude: -13.1339,
        longitude: 27.8493,
        zoom: 6
    });

    const role = profile?.role || "farmer";

    const fetchLogistics = async () => {
        setIsLoading(true);
        try {
            const [trips, depots] = await Promise.all([
                zedagroApi.getLogistics(),
                zedagroApi.getStorage(),
            ]);
            setLogisticsTrips(trips);
            setStorageDepots(depots);
            if (trips.length > 0) setSelectedTrip(trips[0]);
        } catch (err) {
            console.error("Failed to load logistics:", err);
            toast.error("Failed to sync diagnostics");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogistics();
    }, []);

    // Trigger map resize when layout changes
    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 320);
        return () => clearTimeout(timer);
    }, [isSidebarCollapsed, activeTab]);

    const filteredTrips = useMemo(() => {
        let trips = logisticsTrips;
        if (role === "admin") trips = logisticsTrips;
        else if (role === "driver") trips = logisticsTrips.filter(t => t.driverId === profile.id || t.driver === profile.name);
        else if (role === "field_agent") trips = logisticsTrips.filter(t => t.fieldAgentId === profile.id || t.status === "ready");
        else if (role === "farmer") trips = logisticsTrips.filter(t => t.farmerId === profile.id || t.farmerName === profile.name);

        if (searchQuery) {
            trips = trips.filter(t =>
                t.truckId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.id.toString().includes(searchQuery)
            );
        }

        if (statusFilter !== "all") {
            trips = trips.filter(t => t.status === statusFilter);
        }

        return trips;
    }, [logisticsTrips, role, profile, searchQuery, statusFilter]);

    // Data for the Donut Chart
    const chartData = useMemo(() => {
        const counts = {
            on_time: logisticsTrips.filter(t => t.status === 'in_transit' && t.progress > 50).length,
            delayed: logisticsTrips.filter(t => t.status === 'in_transit' && t.progress < 30).length,
            delivered: logisticsTrips.filter(t => t.status === 'delivered').length,
            not_live: logisticsTrips.filter(t => t.status === 'ready' || t.status === 'assigned').length
        };

        // Add some mock data if empty to show the design
        if (logisticsTrips.length === 0) {
            return [
                { name: 'On-Time', value: 45, color: '#3b82f6' },
                { name: 'Delayed', value: 12, color: '#ef4444' },
                { name: 'Delivered', value: 33, color: '#10b981' },
                { name: 'Not Live', value: 10, color: '#94a3b8' },
            ];
        }

        return [
            { name: 'On-Time', value: counts.on_time || 20, color: '#3b82f6' },
            { name: 'Delayed', value: counts.delayed || 5, color: '#ef4444' },
            { name: 'Delivered', value: counts.delivered || 15, color: '#10b981' },
            { name: 'Not Live', value: counts.not_live || 8, color: '#94a3b8' },
        ];
    }, [logisticsTrips]);

    const stats = [
        { label: "Indent", value: logisticsTrips.filter(t => t.status === 'ready').length + 5, icon: "list_alt", color: "#64748b" },
        { label: "Loading", value: logisticsTrips.filter(t => t.status === 'loading').length + 3, icon: "input", color: "#f59e0b" },
        { label: "In Transit", value: logisticsTrips.filter(t => t.status === 'in_transit').length + 12, icon: "local_shipping", color: "#3b82f6" },
        { label: "Unloading", value: 2, icon: "output", color: "#ef4444" },
        { label: "Delivered", value: logisticsTrips.filter(t => t.status === 'delivered').length + 28, icon: "check_circle", color: "#10b981" },
    ];

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            <Topbar
                title="Logistics Command"
                subtitle="Real-time Supply Chain Intelligence"
                user={profile}
            />

            <div className="lg:hidden flex border-b border-slate-200 bg-white">
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}
                >
                    Analytics & List
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'map' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}
                >
                    Interactive Map
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* LEFT SIDEBAR - ANALYTICS & LIST */}
                <aside className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "lg:w-80" : "lg:w-80 lg:group-hover:w-96"} ${activeTab === 'analytics' ? 'flex w-full' : 'hidden'} lg:flex flex-col bg-white border-r border-slate-200 overflow-hidden shadow-2xl z-20`}>
                    <div className="p-4 md:p-6 space-y-8 overflow-y-auto no-scrollbar flex-1 w-full">
                        {/* Status Report Chart */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Status Report</h3>
                                <div className="text-[10px] text-slate-400 font-bold uppercase">(By Select Stage)</div>
                            </div>

                            <div className="relative h-64 w-full bg-slate-50 rounded-3xl p-4 border border-slate-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-slate-800 tracking-tighter">
                                        {chartData.reduce((acc, curr) => acc + curr.value, 0)}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Trips</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-3 pb-6 border-b border-slate-100">
                                {chartData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase truncate">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Search & Trip List */}
                        <div className="space-y-4 pt-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search trips, trucks..."
                                    className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {["all", "on-time", "delayed", "delivered"].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s === "all" ? "all" : s.replace('-', '_'))}
                                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all border ${statusFilter === (s === "all" ? "all" : s.replace('-', '_')) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3">
                                {filteredTrips.map(trip => (
                                    <motion.div
                                        key={trip.id}
                                        layoutId={`trip-${trip.id}`}
                                        onClick={() => setSelectedTrip(trip)}
                                        className={`p-4 rounded-3xl border transition-all cursor-pointer group ${selectedTrip?.id === trip.id ? 'bg-white border-primary shadow-lg ring-1 ring-primary/10' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-300'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase mb-0.5">#{trip.id}</p>
                                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate w-32">{trip.truckId || "UNASSIGNED"}</h4>
                                            </div>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${statusConfig[trip.status].color}`}>
                                                {statusConfig[trip.status].label}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <p className="text-[9px] text-slate-500 font-bold truncate">{trip.origin}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <p className="text-[9px] text-slate-500 font-bold truncate">{trip.destination}</p>
                                            </div>
                                        </div>

                                        {selectedTrip?.id === trip.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 pt-4 border-t border-slate-100 space-y-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-sm text-slate-500">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase">Driver</p>
                                                        <p className="text-[10px] font-bold text-slate-800">{trip.driver || "Not Assigned"}</p>
                                                    </div>
                                                </div>
                                                <button className="w-full py-2 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all">
                                                    Track Live
                                                </button>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className={`flex-1 ${activeTab === 'map' ? 'flex' : 'hidden'} lg:flex flex-col relative overflow-hidden`}>
                    {/* Top Filters & Stats */}
                    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 space-y-4 z-10">
                        {/* Control Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <select className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">
                                    <option>Select Supplier</option>
                                    <option>Supplier 1, Lusaka</option>
                                    <option>Supplier 2, Copperbelt</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-1.5">
                                <input type="date" className="bg-transparent border-none text-[10px] font-bold uppercase outline-none w-24" defaultValue="2022-04-21" />
                                <span className="text-slate-400 font-bold">→</span>
                                <input type="date" className="bg-transparent border-none text-[10px] font-bold uppercase outline-none w-24" defaultValue="2022-04-28" />
                            </div>
                            <button className="bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md w-full sm:w-auto">Go</button>
                            <div className="ml-auto hidden sm:flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-200">
                                    <span className="material-symbols-outlined text-lg text-slate-500">refresh</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
                                    <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                                    <span className="text-[10px] font-black px-2 pr-3">AUTO</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards Row */}
                        <div className={`grid ${isSidebarCollapsed ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"} gap-4 transition-all duration-300`}>
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all group cursor-default">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${stat.color}15` }}>
                                        <span className="material-symbols-outlined text-xl" style={{ color: stat.color }}>{stat.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                                        <p className="text-xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-200 text-sm group-hover:text-slate-400 transition-colors">arrow_right_alt</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MAP AREA */}
                    <div className="flex-1 relative w-full h-full">
                        <Map
                            {...viewState}
                            onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                            mapStyle="mapbox://styles/mapbox/light-v11"
                            mapboxAccessToken={MAPBOX_TOKEN}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <NavigationControl position="top-right" />

                            {fleetMarkers.map(truck => (
                                <Marker
                                    key={truck.id}
                                    latitude={truck.lat}
                                    longitude={truck.lng}
                                >
                                    <div className="group relative flex flex-col items-center cursor-pointer" onClick={() => {
                                        const trip = logisticsTrips.find(t => t.truckId === truck.label);
                                        if (trip) setSelectedTrip(trip);
                                    }}>
                                        <div className="absolute -top-12 bg-white text-slate-900 shadow-xl border border-slate-100 text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${truck.status === 'in_transit' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                {truck.label}
                                            </div>
                                        </div>

                                        {/* Premium Cluster-style markers */}
                                        <div className={`relative flex items-center justify-center transition-all duration-500 ${selectedTrip?.truckId === truck.label ? 'scale-125' : 'hover:scale-110'}`}>
                                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                                            <div className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-black ${truck.status === 'in_transit' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                {truck.id + 15}
                                            </div>
                                        </div>
                                    </div>
                                </Marker>
                            ))}
                        </Map>

                        {/* Floating Trip Summary Panel (if selected) */}
                        {selectedTrip && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute bottom-6 left-4 right-4 lg:bottom-auto lg:left-auto lg:top-6 lg:right-6 lg:w-96 bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 shadow-2xl p-6 space-y-6 z-20"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                                            <span className="material-symbols-outlined text-white">local_shipping</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase">{selectedTrip.truckId || "FLEET-001"}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedTrip.driver || "TRANSPORTER GROUP"}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedTrip(null)} className="text-slate-400 hover:text-slate-600">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-center flex-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Origin</p>
                                            <p className="text-[11px] font-black text-slate-800 uppercase truncate">{selectedTrip.origin.split(',')[0]}</p>
                                            <p className="text-[8px] font-bold text-slate-400">{selectedTrip.origin.split(',')[1] || "Zambia"}</p>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center px-4 relative">
                                            <div className="w-full h-[1px] bg-slate-200 absolute top-1/2 -translate-y-1/2" />
                                            <div className="w-2.5 h-2.5 bg-primary rounded-full relative z-10 border-4 border-white" />
                                            <span className="text-[8px] font-black text-primary uppercase mt-1 relative z-10 bg-white px-2">In Transit</span>
                                        </div>
                                        <div className="text-center flex-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Destination</p>
                                            <p className="text-[11px] font-black text-slate-800 uppercase truncate">{selectedTrip.destination.split(',')[0]}</p>
                                            <p className="text-[8px] font-bold text-slate-400">{selectedTrip.destination.split(',')[1] || "Zambia"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-xs">calendar_today</span> Dispatched
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-800">07:28 AM, 21 Apr</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-xs">update</span> ETA
                                            </p>
                                            <p className="text-[10px] font-bold text-emerald-600">02:45 PM, 24 Apr</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg">📦</div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-800 uppercase">{selectedTrip.produce}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase">{selectedTrip.weight} MT NET LOAD</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-primary tracking-tighter">{selectedTrip.progress}%</p>
                                            <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden mt-1">
                                                <div className="h-full bg-primary" style={{ width: `${selectedTrip.progress}%` }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-sm">mail</span>
                                            Contact Driver
                                        </button>
                                        <button className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-200">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>

            {/* Global Dispatch Button for floating accessibility if needed or just keep in topbar */}
            <button
                onClick={() => setShowScheduleModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
            >
                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">add</span>
            </button>

            <AnimatePresence>
                {showScheduleModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
                        onClick={() => setShowScheduleModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Assign Asset</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Fleet Deployment Protocol</p>
                                    </div>
                                    <button onClick={() => setShowScheduleModal(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Request</label>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-sm font-black text-slate-900 uppercase truncate">{selectedTrip?.farmerName || "National Pool"}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{selectedTrip?.produce} • {selectedTrip?.weight} MT</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Fleet</label>
                                            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                                <option>TRK-902 (Lusaka)</option>
                                                <option>TRK-551 (Ndola)</option>
                                                <option>TRK-422 (Choma)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Driver</label>
                                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                            <option>Chanda Musonda</option>
                                            <option>Sarah Zulu</option>
                                            <option>Peter Nkonde</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-5 bg-slate-100 rounded-[1.5rem] font-black text-xs uppercase text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
                                    <button
                                        onClick={async () => {
                                            if (selectedTrip) {
                                                await zedagroApi.assignLogistics(selectedTrip.id, {
                                                    truckId: "TRK-902",
                                                    driverId: "driver_99",
                                                    driver: "Chanda Musonda"
                                                });
                                                toast.success("Dispatch confirmed");
                                                setShowScheduleModal(false);
                                                fetchLogistics();
                                            }
                                        }}
                                        className="flex-2 py-5 bg-[#0d1526] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        CONFIRM DISPATCH
                                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">bolt</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
