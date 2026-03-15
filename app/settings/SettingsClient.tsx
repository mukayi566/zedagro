"use client";

import Topbar from "../components/Topbar";

export default function SettingsClient({ profile }: { profile: any }) {
    return (
        <>
            <Topbar
                title="Settings"
                subtitle="System workspace & configs"
                user={profile}
            />
            <div className="p-4 md:p-6 space-y-6 animate-fade-in pb-20 sm:pb-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-72 shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 lg:p-4 lg:sticky lg:top-24">
                            <p className="hidden lg:block text-[10px] font-black uppercase text-slate-400 tracking-widest px-3 pb-3">System Scope</p>
                            <div className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar gap-1">
                                {[
                                    { icon: "manage_accounts", label: "Users" },
                                    { icon: "security", label: "Security" },
                                    { icon: "notifications", label: "Alerts" },
                                    { icon: "payments", label: "Treasury" },
                                    { icon: "api", label: "Integrations" },
                                ].map((item, i) => (
                                    <button key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all flex-1 lg:flex-none ${i === 0 ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50"}`}>
                                        <span className={`material-symbols-outlined text-lg ${i === 0 ? "text-white" : "text-slate-400"}`}>{item.icon}</span>
                                        <span className="lg:inline">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-5 bg-slate-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">group</span><h3 className="font-black text-sm uppercase tracking-widest text-slate-800">IAM & Personnel</h3></div>
                                <button className="bg-primary text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-md flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">person_add</span>Add User</button>
                            </div>
                            <div className="p-4 space-y-2">
                                {[
                                    { name: "Admin Executive", role: "HQ Ops Admin", email: "admin@zedagro.gov.zm", status: "Active" },
                                    { name: "Samuel Mwewa", role: "Branch Manager", email: "s.mwewa@agrostore.zm", status: "Active" },
                                ].map((user, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-50 rounded-2xl hover:border-primary/20 transition-all group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-white text-slate-500 group-hover:text-primary font-black text-xs flex items-center justify-center shadow-inner">{user.name[0]}</div>
                                            <div className="min-w-0"><p className="text-xs font-black text-slate-800 truncate">{user.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user.role}</p></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden group shadow-xl">
                            <div className="flex items-center gap-4 mb-6 relative z-10"><div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-2xl text-primary">terminal</span></div><div className="min-w-0"><h3 className="text-lg font-black tracking-tight leading-none uppercase">Workspace Core</h3><p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1.5">v4.2.0 stable kernel</p></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
