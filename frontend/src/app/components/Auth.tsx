import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import {
  Heart,
  Mail,
  Lock,
  User,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      toast.success("Password reset email sent! Check your inbox.");
      setIsForgotPassword(false);
      setIsLogin(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      return handleForgotPassword(e);
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error(
              "Incorrect email or password. Please double-check your credentials.",
            );
          }
          throw error;
        }

        toast.success("Welcome back to CareFlow AI!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });

        if (error) throw error;

        toast.success("Account created successfully! Please check your email to confirm your account.");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
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
              <Heart size={32} fill="white" className="text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight leading-tight">CareFlow AI</h1>
              <div className="flex items-center justify-center gap-1.5 opacity-60">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Health Portal</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
        </div>

        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-neutral-900 leading-tight">
              {isForgotPassword 
                ? "Recover Access" 
                : isLogin 
                  ? "Welcome Back" 
                  : "Join CareFlow AI"}
            </h2>
            <p className="text-neutral-400 text-sm font-medium">
              {isForgotPassword 
                ? "We'll send you a secure link" 
                : isLogin 
                  ? "Enter your credentials to continue" 
                  : "Begin your personalized health journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && !isForgotPassword && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={14} className="text-blue-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all placeholder:text-neutral-300"
                    placeholder="John Doe"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={14} className="text-blue-600" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all placeholder:text-neutral-300"
                placeholder="alex@health.com"
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Lock size={14} className="text-blue-600" /> Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all placeholder:text-neutral-300"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  {isForgotPassword ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
                  <Sparkles size={20} className="fill-blue-500 text-blue-500" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              {isForgotPassword ? (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-blue-600 transition-all"
                >
                  ← Back to login
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-blue-600 transition-all"
                >
                  {isLogin ? "Create New Account" : "Return to Sign In"}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] opacity-50">
        <Sparkles size={12} />
        Powered by CareFlow Neural Engine
      </div>
    </div>
  );
}
