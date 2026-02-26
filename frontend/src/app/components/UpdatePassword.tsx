import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { Lock, ArrowRight, Loader2, KeyRound, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function UpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      if (error) throw error;
      toast.success("Password updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-neutral-100 overflow-hidden relative z-10"
      >
        <div className="p-10 text-center bg-black text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-[2rem] shadow-2xl shadow-blue-600/20">
              <KeyRound size={32} fill="white" className="text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight leading-tight">Secure Update</h1>
              <div className="flex items-center justify-center gap-1.5 opacity-60">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Password Recovery</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
        </div>

        <form onSubmit={handleUpdatePassword} className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-neutral-900 leading-tight">New Credentials</h2>
            <p className="text-neutral-400 text-sm font-medium">Create a robust password to re-secure your CareFlow account</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={14} className="text-blue-600" /> New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all placeholder:text-neutral-300"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={14} className="text-blue-600" /> Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all placeholder:text-neutral-300"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg shadow-2xl active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Update Password
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
