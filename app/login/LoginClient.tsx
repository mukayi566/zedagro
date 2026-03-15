"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { login } from "@/app/lib/auth/actions";

export default function LoginClient() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await login(formData);
            if (result?.error) setError(result.error);
        });
    }

    return (
        <div className="auth-root">
            <div className="auth-left">
                <div className="auth-overlay" />
                <div className="auth-left-content">
                    <div className="auth-logo-wrap animate-fade-in">
                        <Image src="/zedagro-logo.svg" alt="ZEDAGRO" width={220} height={70} priority className="auth-logo" />
                    </div>
                    <div className="auth-hero animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h1 className="auth-hero-title">Empowering Zambia's<br /><span className="text-highlight">Agricultural Future</span></h1>
                        <p className="auth-hero-sub">The unified digital platform for the Food Reserve Agency, connecting farmers, logistics, and markets across the nation.</p>
                    </div>
                    <div className="auth-stats animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="auth-stat"><span className="auth-stat-value">120K+</span><span className="auth-stat-label">Farmers</span></div>
                        <div className="auth-stat-divider" />
                        <div className="auth-stat"><span className="auth-stat-value">10</span><span className="auth-stat-label">Provinces</span></div>
                        <div className="auth-stat-divider" />
                        <div className="auth-stat"><span className="auth-stat-value">98%</span><span className="auth-stat-label">Verification</span></div>
                    </div>
                </div>
                <div className="orb orb-1" />
                <div className="orb orb-2" />
            </div>
            <div className="auth-right">
                <div className="auth-card glass animate-fade-in">
                    <div className="auth-mobile-logo">
                        <Image src="/zedagro-logo.svg" alt="ZEDAGRO" width={160} height={50} priority />
                    </div>
                    <div className="auth-card-header">
                        <h2 className="auth-card-title">Welcome back</h2>
                        <p className="auth-card-sub">Login to your dashboard to manage operations</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error animate-fade-in" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                {error}
                            </div>
                        )}
                        <div className="form-field">
                            <label className="form-label">Email address</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                <input name="email" type="email" required placeholder="you@zedagro.gov.zm" className="form-input" />
                            </div>
                        </div>
                        <div className="form-field">
                            <div className="form-label-row">
                                <label className="form-label">Password</label>
                                <Link href="#" className="label-link">Forgot?</Link>
                            </div>
                            <div className="input-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                <input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" className="form-input" />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" className="custom-check" />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <button type="submit" disabled={isPending} className="auth-btn-primary">
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" /></svg>
                                    Signing in...
                                </span>
                            ) : "Sign in to Portal"}
                        </button>
                    </form>
                    <div className="auth-footer">
                        <p>Don't have an account? <Link href="/register">Register as Farmer</Link></p>
                    </div>
                </div>
            </div>
            <style>{authStyles}</style>
        </div>
    );
}

const authStyles = `
  .auth-root { min-height: 100vh; display: flex; font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden; }
  
  .auth-left { 
    display: none; 
    flex: 1; 
    background: url('/auth-bg.png') center/cover no-repeat;
    position: relative; 
    overflow: hidden; 
  }
  
  @media (min-width: 1024px) { .auth-left { display: flex; align-items: center; justify-content: center; } }
  
  .auth-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(14, 36, 25, 0.95) 0%, rgba(26, 66, 49, 0.8) 100%);
    z-index: 1;
  }
  
  .auth-left-content { position: relative; z-index: 2; padding: 0 80px; max-width: 680px; }
  
  .text-highlight { color: #2ECC71; }
  
  .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.15; pointer-events: none; z-index: 1; }
  .orb-1 { width: 500px; height: 500px; background: #2ECC71; top: -150px; left: -100px; }
  .orb-2 { width: 400px; height: 400px; background: #D4A017; bottom: -100px; right: -50px; }
  
  .auth-logo { filter: brightness(0) invert(1); margin-bottom: 60px; }
  
  .auth-hero-title { font-size: 3.5rem; font-weight: 800; color: white; margin-bottom: 24px; line-height: 1.1; letter-spacing: -0.02em; }
  .auth-hero-sub { font-size: 1.15rem; color: rgba(255,255,255,0.85); line-height: 1.7; margin-bottom: 48px; max-width: 500px; }
  
  .auth-stats { 
    display: flex; 
    gap: 32px; 
    padding: 32px; 
    background: rgba(255,255,255,0.08); 
    backdrop-filter: blur(8px);
    border-radius: 24px; 
    border: 1px solid rgba(255,255,255,0.15); 
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  }
  
  .auth-stat-value { display: block; font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 4px; }
  .auth-stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.6); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
  .auth-stat-divider { width: 1px; background: rgba(255,255,255,0.2); }
  
  .auth-right { 
    flex: 1; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 40px; 
    position: relative;
    background: radial-gradient(circle at top right, rgba(26, 66, 49, 0.05), transparent 400px);
  }
  
  @media (min-width: 1024px) { 
    .auth-right { width: 580px; flex: none; background: white; } 
  }
  
  .auth-card { 
    width: 100%; 
    max-width: 440px; 
    padding: 40px;
    border-radius: 24px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
  }
  
  @media (max-width: 1023px) {
    .auth-card { background: white; border: 1px solid #e2e8f0; }
  }
  
  .auth-mobile-logo { display: none; margin-bottom: 32px; justify-content: center; }
  @media (max-width: 1023px) { .auth-mobile-logo { display: flex; } }
  
  .auth-card-title { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.01em; }
  .auth-card-sub { font-size: 1rem; color: #64748b; margin-bottom: 32px; }
  
  .auth-role-badges { display: flex; gap: 12px; margin-bottom: 32px; }
  .role-badge { 
    padding: 6px 16px; 
    border-radius: 100px; 
    font-size: 0.8rem; 
    font-weight: 600; 
    background: #e8f0ec;
    color: #1a4231;
    border: 1px solid rgba(26,66,49,0.1);
  }
  .role-badge.text-muted { background: #f1f5f9; color: #94a3b8; }
  
  .auth-form { display: flex; flex-direction: column; gap: 24px; }
  
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-label-row { display: flex; justify-content: space-between; align-items: center; }
  .form-label { font-size: 0.875rem; font-weight: 600; color: #334155; }
  .label-link { font-size: 0.8125rem; color: #1a4231; text-decoration: none; font-weight: 600; }
  .label-link:hover { text-decoration: underline; }
  
  .input-wrapper { position: relative; }
  .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; transition: color 0.2s; }
  
  .form-input { 
    width: 100%; 
    padding: 14px 14px 14px 44px; 
    border: 1.5px solid #e2e8f0; 
    border-radius: 12px; 
    font-size: 0.95rem; 
    transition: all 0.2s;
    background: #f8fafc;
  }
  .form-input:focus { 
    background: white;
    border-color: #1a4231; 
    box-shadow: 0 0 0 4px rgba(26, 66, 49, 0.1); 
    outline: none;
  }
  .form-input:focus + .input-icon { color: #1a4231; }
  
  .form-options { display: flex; align-items: center; justify-content: space-between; }
  .checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: #64748b; cursor: pointer; }
  .custom-check { width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid #cbd5e1; cursor: pointer; accent-color: #1a4231; }
  
  .auth-btn-primary { 
    width: 100%; 
    padding: 16px; 
    background: #1a4231; 
    color: white; 
    border: none; 
    border-radius: 12px; 
    font-size: 1rem;
    font-weight: 700; 
    cursor: pointer; 
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(26, 66, 49, 0.2);
  }
  .auth-btn-primary:hover { background: #2a6449; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26, 66, 49, 0.25); }
  .auth-btn-primary:active { transform: translateY(0); }
  .auth-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
  
  .auth-error { 
    padding: 14px; 
    background: #fef2f2; 
    border: 1px solid #fee2e2; 
    border-radius: 12px; 
    color: #dc2626; 
    font-size: 0.875rem; 
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
  }
  
  .auth-footer { margin-top: 32px; text-align: center; font-size: 0.9375rem; color: #64748b; }
  .auth-footer a { color: #1a4231; text-decoration: none; font-weight: 700; }
  .auth-footer a:hover { text-decoration: underline; }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
