"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { registerFarmer } from "@/app/lib/auth/actions";

const ZAMBIAN_PROVINCES = [
    "Central", "Copperbelt", "Eastern", "Luapula",
    "Lusaka", "Muchinga", "Northern", "North-Western",
    "Southern", "Western",
];

const DISTRICTS: Record<string, string[]> = {
    Central: ["Chibombo", "Kabwe", "Kapiri Mposhi", "Mkushi", "Mumbwa", "Serenje"],
    Copperbelt: ["Chililabombwe", "Chingola", "Kalulushi", "Kitwe", "Luanshya", "Lufwanyama", "Masaiti", "Mpongwe", "Mufulira", "Ndola"],
    Eastern: ["Chadiza", "Chama", "Chipata", "Katete", "Lundazi", "Mambwe", "Nyimba", "Petauke"],
    Luapula: ["Chiengi", "Kawambwa", "Mansa", "Milenge", "Mwansabombwe", "Mwense", "Nchelenge", "Samfya"],
    Lusaka: ["Chilanga", "Chongwe", "Kafue", "Luangwa", "Lusaka"],
    Muchinga: ["Chinsali", "Isoka", "Kanchibiya", "Mpika", "Mafinga", "Nakonde"],
    Northern: ["Chilubi", "Kasama", "Luwingu", "Mbala", "Mporokoso", "Mpulungu", "Mungwi"],
    "North-Western": ["Chavuma", "Ikelenge", "Kabompo", "Kasempa", "Mufumbwe", "Mwinilunga", "Solwezi", "Zambezi"],
    Southern: ["Choma", "Gwembe", "Itezhi-Tezhi", "Kalomo", "Kazungula", "Livingstone", "Mazabuka", "Monze", "Namwala", "Siavonga", "Sinazongwe"],
    Western: ["Kalabo", "Kaoma", "Limulunga", "Lukulu", "Mongu", "Nalolo", "Senanga", "Sesheke", "Shangombo"],
};

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
  .auth-logo { filter: brightness(0) invert(1); margin-bottom: 60px; }
  .auth-hero-title { font-size: 3.5rem; font-weight: 800; color: white; margin-bottom: 24px; line-height: 1.1; letter-spacing: -0.02em; }
  .auth-hero-sub { font-size: 1.15rem; color: rgba(255,255,255,0.85); line-height: 1.7; }
  
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
    .auth-right { width: 620px; flex: none; background: white; } 
  }
  
  .auth-card { 
    width: 100%; 
    max-width: 500px; 
    padding: 40px;
    border-radius: 24px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
  }
  
  .glass {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(26, 66, 49, 0.1);
  }
  
  .auth-mobile-logo { display: none; margin-bottom: 32px; justify-content: center; }
  @media (max-width: 1023px) { .auth-mobile-logo { display: flex; } }
  
  .auth-card-title { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.01em; }
  .auth-card-sub { font-size: 1rem; color: #64748b; margin-bottom: 32px; }
  
  .step-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .step-dot { width: 10px; height: 10px; border-radius: 50%; background: #e2e8f0; transition: all 0.3s; }
  .step-dot.active { background: #1a4231; transform: scale(1.2); box-shadow: 0 0 0 4px rgba(26, 66, 49, 0.1); }
  .step-line { flex: 1; height: 2px; background: #e2e8f0; max-width: 40px; transition: all 0.3s; }
  .step-line.active { background: #1a4231; }
  
  .auth-form { display: flex; flex-direction: column; gap: 24px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-label { font-size: 0.875rem; font-weight: 600; color: #334155; }
  
  .form-input { 
    width: 100%; 
    padding: 14px; 
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
  
  .form-btn-row { display: flex; gap: 16px; margin-top: 8px; }
  
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
  .auth-btn-back { 
    padding: 16px 24px; 
    border: 1.5px solid #e2e8f0; 
    border-radius: 12px; 
    background: white; 
    color: #64748b; 
    font-weight: 700; 
    cursor: pointer; 
    transition: all 0.2s;
  }
  .auth-btn-back:hover { background: #f8fafc; border-color: #cbd5e1; color: #334155; }
  
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
  
  .success-icon-wrap { 
    margin: 0 auto 24px; 
    width: 100px; 
    height: 100px; 
    background: #e8f0ec; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #1a4231;
  }
  
  .auth-footer { margin-top: 32px; text-align: center; font-size: 0.9375rem; color: #64748b; }
  .auth-footer a { color: #1a4231; text-decoration: none; font-weight: 700; }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .animate-slide-in { animation: slide-in 0.4s ease-out forwards; }
`;

type Step = 1 | 2 | 3;


export default function RegisterClient() {
    const [step, setStep] = useState<Step>(1);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [province, setProvince] = useState("");
    const [formData, setFormData] = useState<Record<string, string>>({});

    function handleNext(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const newData: Record<string, string> = {};
        fd.forEach((v, k) => newData[k] = v as string);

        if (step === 2 && newData.password !== newData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError(null);
        setFormData(prev => ({ ...prev, ...newData }));
        if (step < 3) setStep((step + 1) as Step);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        const lastData: Record<string, string> = {};
        fd.forEach((v, k) => lastData[k] = v as string);

        const allData = { ...formData, ...lastData };
        const finalForm = new FormData();
        Object.entries(allData).forEach(([k, v]) => finalForm.append(k, v));

        startTransition(async () => {
            const result = await registerFarmer(finalForm);
            if (result?.error) setError(result.error); else setSuccess(true);
        });
    }

    if (success) {
        return (
            <div className="auth-root">
                <div className="auth-right" style={{ width: '100vw', flex: 1 }}>
                    <div className="auth-card glass animate-fade-in" style={{ textAlign: "center" }}>
                        <div className="success-icon-wrap">
                            <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <h2 className="auth-card-title">Registration Submitted!</h2>
                        <p className="auth-card-sub">Your application has been received. A Field Agent will contact you shortly to complete the verification process.</p>
                        <Link href="/login" className="auth-btn-primary" style={{ textDecoration: "none" }}>Return to Sign In</Link>
                    </div>
                </div>
                <style>{authStyles}</style>
            </div>
        );
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
                        <h1 className="auth-hero-title">Join the Digital<br /><span className="text-highlight">Farmer Network</span></h1>
                        <p className="auth-hero-sub">Register today to access FISP e-vouchers, secure payments, and national market connections.</p>
                    </div>
                </div>
            </div>
            <div className="auth-right">
                <div className="auth-card animate-fade-in">
                    <div className="auth-mobile-logo">
                        <Image src="/zedagro-logo.svg" alt="ZEDAGRO" width={160} height={50} priority />
                    </div>

                    <div className="auth-card-header">
                        <h2 className="auth-card-title">Farmer Registration</h2>
                        <div className="step-indicator">
                            <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
                            <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
                            <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
                            <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
                            <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
                        </div>
                        <p className="auth-card-sub">Section {step}: {step === 1 ? 'Personal Details' : step === 2 ? 'Account Security' : 'Location Details'}</p>
                    </div>

                    {error && (
                        <div className="auth-error animate-fade-in" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleNext} className="auth-form animate-slide-in">
                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">First Name</label>
                                    <input name="firstName" required placeholder="John" className="form-input" defaultValue={formData.firstName} />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Last Name</label>
                                    <input name="lastName" required placeholder="Mubanga" className="form-input" defaultValue={formData.lastName} />
                                </div>
                            </div>
                            <div className="form-field">
                                <label className="form-label">Phone Number</label>
                                <input name="phone" required placeholder="+260 9xx xxx xxx" className="form-input" defaultValue={formData.phone} />
                            </div>
                            <div className="form-field">
                                <label className="form-label">National ID (NRC)</label>
                                <input name="nationalId" required placeholder="123456/78/9" className="form-input" defaultValue={formData.nationalId} />
                            </div>
                            <button type="submit" className="auth-btn-primary">Continue to Account Details</button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleNext} className="auth-form animate-slide-in">
                            <div className="form-field">
                                <label className="form-label">Email Address</label>
                                <input name="email" type="email" required placeholder="john@example.com" className="form-input" defaultValue={formData.email} />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Set Password</label>
                                <input name="password" type="password" required placeholder="••••••••" className="form-input" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Confirm Password</label>
                                <input name="confirmPassword" type="password" required placeholder="••••••••" className="form-input" />
                            </div>
                            <div className="form-btn-row">
                                <button type="button" onClick={() => setStep(1)} className="auth-btn-back">Go Back</button>
                                <button type="submit" className="auth-btn-primary" style={{ flex: 1 }}>Continue to Location</button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="auth-form animate-slide-in">
                            <div className="form-field">
                                <label className="form-label">Province</label>
                                <select name="province" required className="form-input" value={province} onChange={e => setProvince(e.target.value)}>
                                    <option value="">Select your province</option>
                                    {ZAMBIAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="form-field">
                                <label className="form-label">District</label>
                                <select name="district" required className="form-input" disabled={!province}>
                                    <option value="">Select your district</option>
                                    {(DISTRICTS[province] || []).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-btn-row">
                                <button type="button" onClick={() => setStep(2)} className="auth-btn-back">Go Back</button>
                                <button type="submit" disabled={isPending} className="auth-btn-primary" style={{ flex: 1 }}>
                                    {isPending ? "Submitting Registration..." : "Complete Registration"}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="auth-footer">
                        <p>Already have an account? <Link href="/login">Sign in</Link></p>
                    </div>
                </div>
            </div>
            <style>{authStyles}</style>
        </div>
    );
}
