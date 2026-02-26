import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplet,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
  ShieldAlert,
  Dna,
  User,
  Activity as VitalIcon
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../supabaseClient";

export function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Alex");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name.split(' ')[0]);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
    });
  }, []);

  const stats = [
    { label: "Heart Rate", value: "72 bpm", color: "text-blue-600", bg: "bg-blue-50", icon: Heart, trend: "+2%" },
    { label: "Blood Pressure", value: "120/80", color: "text-emerald-600", bg: "bg-emerald-50", icon: Activity, trend: "Stable" },
    { label: "Blood Glucose", value: "98 mg/dL", color: "text-amber-600", bg: "bg-amber-50", icon: Droplet, trend: "-5%" },
    { label: "Temperature", value: "36.6°C", color: "text-blue-500", bg: "bg-blue-50", icon: Thermometer, trend: "Normal" },
  ];

  const recentActivities = [
    { title: "Medication: Vitamin D", time: "08:30 AM", status: "Taken", type: "success" },
    { title: "Medication: Metformin", time: "09:00 AM", status: "Taken", type: "success" },
    { title: "Doctor Appointment", time: "02:00 PM", status: "Upcoming", type: "pending" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-black text-white p-8 md:p-14 shadow-2xl shadow-neutral-200">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles size={14} className="text-blue-400 fill-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">AI-Powered Health Assistant</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Good morning, <span className="text-blue-400">{userName}</span>!
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Your vitals are stable and your medication compliance is at 98%. Let's keep up the momentum today.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate("/health-ai")}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95"
              >
                <Zap size={20} className="fill-white" />
                Start AI Checkup
              </button>
              <button 
                onClick={() => navigate("/emergency")}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 backdrop-blur-md border border-white/10 active:scale-95"
              >
                <ShieldAlert size={20} className="text-red-500" />
                Emergency AI
              </button>
            </div>
          </div>
          <div className="relative w-full max-w-[320px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-white/5 group">
          <ImageWithFallback 
                        src="https://images.unsplash.com/photo-1576091160550-2173dad99901?w=600&h=600&fit=crop" 
                        alt="Health tracker" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Health Index</span>
                <span className="text-xl font-black text-white">94%</span>
              </div>
              <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[94%]" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full" />
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-default group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tight">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black mt-1 text-neutral-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-neutral-50 flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Clock size={24} />
              </div>
              Care Timeline
            </h3>
            <button className="text-sm font-bold text-neutral-400 hover:text-blue-600 transition-colors flex items-center gap-1">
              View Analytics <ChevronRight size={18} />
            </button>
          </div>
          <div className="p-8 space-y-6">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white shadow-md ring-1 transition-all group-hover:scale-110",
                  activity.type === "success" ? "bg-emerald-50 ring-emerald-100 text-emerald-600" : "bg-blue-50 ring-blue-100 text-blue-600"
                )}>
                  {activity.type === "success" ? <CheckCircle2 size={24} /> : <Calendar size={24} />}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-neutral-900 leading-tight">{activity.title}</h4>
                  <p className="text-sm text-neutral-400 font-medium">{activity.time}</p>
                </div>
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                  activity.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                )}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="bg-blue-600 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group shadow-2xl shadow-blue-100">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-lg text-white border border-white/20">
              <Dna size={32} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">Health Wisdom</h3>
              <p className="text-blue-50 text-lg leading-relaxed font-medium opacity-90">
                "Stay hydrated! Drinking at least 8 glasses of water today can boost your energy levels and help maintain your metabolic health."
              </p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm hover:shadow-xl transition-all flex items-center gap-2 group-hover:gap-3">
              Explore Guide <ArrowRight size={18} />
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-black/5 blur-3xl rounded-full" />
        </section>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

function Sparkles({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
