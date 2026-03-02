import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { User, Mail, LogOut, CheckCircle, Shield, CreditCard } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { motion } from "motion/react";

export function Profile() {
    const navigate = useNavigate();
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Error signing out.");
        } else {
            toast.success("Signed out successfully.");
            navigate("/auth");
        }
    };

    if (!session) {
        return (
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-12 text-center h-[50vh] animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <User size={40} />
                </div>
                <h2 className="text-3xl font-black mb-4">Please Sign In</h2>
                <p className="text-neutral-500 mb-8 max-w-sm">Access your personalized health dashboard, medical records, and AI consultations securely.</p>
                <button
                    onClick={() => navigate("/auth")}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                >
                    Sign In or Register
                </button>
            </div>
        );
    }

    const userName = session.user.user_metadata?.name || session.user.email.split('@')[0];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>

                <div className="w-32 h-32 rounded-3xl bg-neutral-100 p-2 shadow-inner flex-shrink-0 relative z-10">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                        alt="User"
                        className="w-full h-full object-cover rounded-2xl bg-white"
                    />
                </div>

                <div className="text-center md:text-left flex-1 relative z-10">
                    <h1 className="text-4xl font-black tracking-tight text-neutral-900 mb-2">{userName}</h1>
                    <p className="text-neutral-500 font-medium flex items-center justify-center md:justify-start gap-2 mb-6">
                        <Mail size={16} />
                        {session.user.email}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                            <CheckCircle size={16} /> Verified Patient
                        </span>
                        <span className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                            <Shield size={16} /> Pro Account
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-neutral-100 group-hover:text-blue-50 transition-colors">
                        <Shield size={120} className="-rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <h2 className="text-2xl font-black mb-6 relative z-10">Account Security</h2>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl">
                            <span className="font-bold text-neutral-600">Password</span>
                            <button className="text-blue-600 font-bold text-sm hover:underline">Change</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl">
                            <span className="font-bold text-neutral-600">Two-Factor Auth</span>
                            <span className="text-neutral-400 font-bold text-sm">Disabled</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl">
                            <span className="font-bold text-neutral-600">Linked Devices</span>
                            <span className="text-neutral-900 font-black">2 Active</span>
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-neutral-100 group-hover:text-purple-50 transition-colors">
                        <CreditCard size={120} className="rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <h2 className="text-2xl font-black mb-6 relative z-10">Subscription</h2>
                    <div className="space-y-4 relative z-10">
                        <div className="p-6 bg-gradient-to-br from-neutral-900 to-black text-white rounded-2xl shadow-xl">
                            <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs mb-1">Current Plan</p>
                            <h3 className="text-2xl font-black mb-4">CareFlow Pro</h3>
                            <div className="flex justify-between items-end border-t border-neutral-700 pt-4">
                                <span className="text-neutral-300 font-medium">Billed Annually</span>
                                <span className="text-xl font-bold">$120<span className="text-sm text-neutral-400 font-normal">/yr</span></span>
                            </div>
                        </div>
                        <button className="w-full py-4 font-bold text-neutral-600 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition">
                            Manage Billing
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/50 border border-red-100 p-8 rounded-[2.5rem] mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-black text-red-900 mb-2">Sign Out</h3>
                    <p className="text-red-700/70 font-medium">End your current session across this device securely.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full md:w-auto px-8 py-4 bg-white border border-red-200 text-red-600 font-black rounded-2xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    <LogOut size={20} />
                    Sign Out Now
                </button>
            </div>

        </div>
    );
}
