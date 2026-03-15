"use client";


import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { createClient } from "../lib/supabase/client";
import { toast } from "react-hot-toast";

interface Profile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "admin" | "field_agent" | "farmer";
    status?: string; // active, suspended, pending
    phone?: string;
    province?: string;
    district?: string;
    created_at?: string;
}

export default function UserManagement({ profile: currentAdmin }: { profile: Profile }) {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"farmer" | "field_agent">("farmer");
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state for new Field Agent
    const [newAgent, setNewAgent] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
    });

    const supabase = createClient();

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProfiles(data || []);
        } catch (error: any) {
            console.error("Error fetching profiles:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Note: In a real app, creating a user from the dashboard usually requires 
            // a service role or a specific backend endpoint because supabase.auth.signUp
            // logs the current user out if it's not configured correctly or if using the client SDK.
            // However, we'll implement it as requested. 
            // For now, we'll simulate or use a mock approach if the signUp fails.

            const response = await fetch("/api/users/create-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAgent),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to create agent");
            }

            toast.success("Field Agent created successfully");
            setShowCreateModal(false);
            setNewAgent({ email: "", password: "", firstName: "", lastName: "", phone: "" });
            fetchProfiles();
        } catch (error: any) {
            console.error("Error creating agent:", error);
            toast.error(error.message || "Failed to create Field Agent");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "suspended" ? "active" : "suspended";
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ status: newStatus })
                .eq("id", userId);

            if (error) throw error;

            setProfiles(profiles.map(p => p.id === userId ? { ...p, status: newStatus } : p));
            toast.success(`User ${newStatus === 'active' ? 'reactivated' : 'suspended'}`);
        } catch (error: any) {
            toast.error("Failed to update user status");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to permanently delete this account? This action cannot be undone.")) return;

        try {
            const response = await fetch("/api/users/delete-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) throw new Error("Failed to delete user");

            setProfiles(profiles.filter(p => p.id !== userId));
            toast.success("User deleted successfully");
        } catch (error: any) {
            toast.error("Failed to delete user");
        }
    };

    const filteredProfiles = profiles.filter((p) => {
        const matchesTab = p.role === activeTab;
        const matchesSearch =
            p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.phone?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const stats = {
        totalFarmers: profiles.filter(p => p.role === "farmer").length,
        totalAgents: profiles.filter(p => p.role === "field_agent").length,
        pendingFarmers: profiles.filter(p => p.role === "farmer" && p.status === "pending").length,
        activeAgents: profiles.filter(p => p.role === "field_agent" && p.status !== "suspended").length,
    };

    return (
        <>
            <Topbar
                title="User Management"
                subtitle="Manage platform accounts and access"
                user={currentAdmin}
                actions={
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Create Agent
                    </button>
                }
            />

            <div className="p-4 md:p-6 space-y-6 animate-fade-in pb-20 sm:pb-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Farmers", value: stats.totalFarmers, icon: "groups", color: "text-primary", bg: "bg-primary/10" },
                        { label: "Field Agents", value: stats.totalAgents, icon: "badge", color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Pending Farmers", value: stats.pendingFarmers, icon: "hourglass_empty", color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Active Agents", value: stats.activeAgents, icon: "check_circle", color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
                            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-lg ${stat.color}`}>{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    {/* Tabs & Search */}
                    <div className="p-4 md:p-6 border-b border-slate-50 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                                <button
                                    onClick={() => setActiveTab("farmer")}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "farmer" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    Farmers
                                </button>
                                <button
                                    onClick={() => setActiveTab("field_agent")}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "field_agent" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    Field Agents
                                </button>
                            </div>

                            <div className="relative group flex-1 md:max-w-xs">
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">search</span>
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}s...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-4"><div className="h-10 bg-slate-100 rounded-xl w-full"></div></td>
                                        </tr>
                                    ))
                                ) : filteredProfiles.length > 0 ? (
                                    filteredProfiles.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group h-20">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-[10px] ring-1 ring-slate-200">
                                                        {(user.first_name?.[0] || user.email[0])}{(user.last_name?.[0] || user.email[1])}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black text-slate-900 truncate tracking-tight">
                                                            {user.first_name ? `${user.first_name} ${user.last_name}` : "Pending Setup"}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-bold font-mono truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-bold text-slate-700">{user.phone || "No phone"}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{user.district || "—"}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{user.province || "—"}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-widest ring-1 ring-inset ${user.status === "suspended" ? "bg-red-100 text-red-700 ring-red-700/10" :
                                                    user.status === "pending" ? "bg-amber-100 text-amber-700 ring-amber-700/10" :
                                                        "bg-emerald-100 text-emerald-700 ring-emerald-700/10"
                                                    }`}>
                                                    <span className="material-symbols-outlined text-[10px]">
                                                        {user.status === "suspended" ? "block" : user.status === "pending" ? "schedule" : "verified"}
                                                    </span>
                                                    {user.status || "active"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => toggleUserStatus(user.id, user.status || "active")}
                                                        className={`p-2 rounded-xl transition-all ${user.status === "suspended" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"
                                                            }`}
                                                        title={user.status === "suspended" ? "Reactivate" : "Suspend"}
                                                    >
                                                        <span className="material-symbols-outlined text-lg">
                                                            {user.status === "suspended" ? "lock_open" : "lock"}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                                        title="Delete Account"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-5xl opacity-20 block mb-4">group</span>
                                            <p className="text-sm font-bold uppercase tracking-widest">No {activeTab}s found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Showing {filteredProfiles.length} of {profiles.filter(p => p.role === activeTab).length} {activeTab}s
                        </p>
                    </div>
                </div>
            </div>

            {/* Create Agent Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowCreateModal(false)}>
                    <div
                        className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Field Agent</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">New administrative access record</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateAgent} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                            <div className="p-6 md:p-8 space-y-6 flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">First Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAgent.firstName}
                                            onChange={(e) => setNewAgent({ ...newAgent, firstName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                            placeholder="Jane"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Last Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAgent.lastName}
                                            onChange={(e) => setNewAgent({ ...newAgent, lastName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={newAgent.email}
                                        onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        placeholder="agent@zedagro.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mobile Terminal</label>
                                    <input
                                        type="tel"
                                        value={newAgent.phone}
                                        onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        placeholder="+260..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Temporary Password</label>
                                    <input
                                        required
                                        type="password"
                                        value={newAgent.password}
                                        onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-mono"
                                        placeholder="********"
                                    />
                                </div>

                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
                                    <p className="text-[11px] text-primary/80 font-medium leading-relaxed">
                                        Field Agents can register farmers, conduct drone surveys, and issue FISP vouchers. They cannot access financial analytics or management modules.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="order-2 sm:order-1 flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="order-1 sm:order-2 flex-1 bg-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : "Initialize Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
