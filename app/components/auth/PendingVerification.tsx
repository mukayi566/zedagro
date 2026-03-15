"use client";

import Image from "next/image";
import { logout } from "@/app/lib/auth/actions";

export default function PendingVerification({ name }: { name: string }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-fade-in">
                <div className="mb-6 flex justify-center">
                    <Image src="/zedagro-logo.svg" alt="ZEDAGRO" width={180} height={60} />
                </div>

                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-4xl animate-pulse">hourglass_empty</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">Hello, {name}!</h1>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Account Verification Pending</h2>

                <p className="text-slate-600 mb-8 leading-relaxed text-sm">
                    Welcome to ZEDAGRO. Your registration has been received, but your account is currently <strong>PENDING</strong>.
                    A Field Agent will visit your farm soon to:
                </p>

                <div className="space-y-3 mb-8 text-left">
                    {[
                        "Verify your physical documents (NRC/National ID)",
                        "Conduct a drone survey of your farm boundaries",
                        "Confirm your crop types and expected yields"
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                            <span className="text-xs text-slate-700 font-medium">{step}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600">info</span>
                    <p className="text-[11px] text-amber-800 text-left leading-snug">
                        <strong>FISP & Payments:</strong> These features will be unlocked immediately after your account status changes to <strong>ACTIVE</strong>.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        disabled
                        className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed text-sm"
                    >
                        Access Dashboard (Locked)
                    </button>

                    <button
                        onClick={() => logout()}
                        className="w-full py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <p className="mt-8 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                Zambia Digital Food Reserve Agency · Security System
            </p>
        </div>
    );
}
