"use client";

import React, { useState } from "react";
import { buyPremium } from "@/services/Payment";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ShieldCheck, Lock, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [form, setForm] = useState({
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvc: "",
        cardHolderName: "",
    });

    const formatCardNumber = (value: string) => {
        return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    const handlePay = async () => {
        try {
            setLoading(true);
            // Backend 4 rəqəmli il tələb edir (məs: 26 -> 2026)
            const fixedYear = form.expYear.length === 2 ? `20${form.expYear}` : form.expYear;
            
            const payload = {
                ...form,
                cardNumber: form.cardNumber.replace(/\s/g, ""),
                expYear: fixedYear,
            };

            await buyPremium(payload);
            alert("Success! Premium activated 🎉");
            router.push("/dashboard");
        } catch (err: any) {
            alert(err.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[500px] bg-indigo-100/50 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* LEFT SIDE: Visual Card & Info */}
                <div className="space-y-8">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4"
                        >
                            <Sparkles size={14} /> Upgrade to Pro
                        </motion.div>
                        <h1 className="text-5xl font-black text-slate-900 leading-tight">
                            Secure <br />
                            <span className="text-indigo-600">Checkout</span>
                        </h1>
                        <p className="text-slate-500 mt-4 font-medium max-w-sm">
                            Unlock all premium interview features and stand out from the competition.
                        </p>
                    </div>

                    {/* VIRTUAL CARD */}
                    <motion.div 
                        initial={{ rotateY: -20, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        className="relative w-full max-w-[400px] h-[240px] perspective-1000"
                    >
                        <div className={`relative w-full h-full transition-all duration-700 preserve-3d shadow-2xl rounded-[24px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 text-white overflow-hidden ${focusedField === 'cvc' ? '[transform:rotateY(180deg)]' : ''}`}>
                            
                            {/* Front Side */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between backface-hidden">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center border border-amber-400/30">
                                        <div className="w-8 h-6 bg-amber-400/60 rounded-sm" />
                                    </div>
                                    <CreditCard size={32} className="text-slate-400" />
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Card Number</p>
                                    <p className="text-2xl font-mono tracking-widest">
                                        {form.cardNumber || "•••• •••• •••• ••••"}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Card Holder</p>
                                        <p className="font-bold tracking-wide uppercase truncate max-w-[200px]">
                                            {form.cardHolderName || "Your Name"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Expiry</p>
                                        <p className="font-bold">{form.expMonth || "MM"}/{form.expYear || "YY"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Back Side (CVC) */}
                            <div className="absolute inset-0 bg-slate-800 flex flex-col py-8 [transform:rotateY(180deg)] backface-hidden">
                                <div className="w-full h-12 bg-slate-900 mt-4" />
                                <div className="px-8 mt-6">
                                    <div className="bg-slate-700 h-10 w-full rounded flex items-center justify-end px-4">
                                        <span className="text-black font-mono font-bold italic bg-white px-2 rounded tracking-widest">
                                            {form.cvc || "•••"}
                                        </span>
                                    </div>
                                    <p className="text-[10px] mt-4 text-slate-400">Authorized Signature. Not valid unless signed.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT SIDE: Payment Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100"
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Cardholder Name</label>
                            <input 
                                placeholder="Full Name on Card"
                                onFocus={() => setFocusedField('name')}
                                onChange={(e) => setForm({ ...form, cardHolderName: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder:font-medium placeholder:text-slate-300" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Card Number</label>
                            <div className="relative">
                                <input 
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={19}
                                    value={form.cardNumber}
                                    onFocus={() => setFocusedField('number')}
                                    onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-bold text-lg" 
                                />
                                <Lock size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Month</label>
                                <input 
                                    placeholder="MM"
                                    maxLength={2}
                                    onFocus={() => setFocusedField('exp')}
                                    onChange={(e) => setForm({ ...form, expMonth: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 text-center focus:ring-2 focus:ring-indigo-500 transition-all font-bold" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Year</label>
                                <input 
                                    placeholder="YY"
                                    maxLength={2}
                                    onFocus={() => setFocusedField('exp')}
                                    onChange={(e) => setForm({ ...form, expYear: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 text-center focus:ring-2 focus:ring-indigo-500 transition-all font-bold" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">CVC</label>
                                <input 
                                    placeholder="•••"
                                    maxLength={3}
                                    onFocus={() => setFocusedField('cvc')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={(e) => setForm({ ...form, cvc: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 text-center focus:ring-2 focus:ring-indigo-500 transition-all font-bold" 
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handlePay}
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[24px] font-black text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>Complete Payment <FiArrowRight /></>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2 mt-6 text-slate-400">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">AES-256 Encrypted Secure Transaction</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* CSS Helper for 3D Flip */}
            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </div>
    );
};

// Simple Arrow Component since it wasn't imported
const FiArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
);

export default page;