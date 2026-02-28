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
  Activity as VitalIcon,
  Sparkles,
  Bot,
  Pill
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../supabaseClient";

export function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest");
  const [lastAssessment, setLastAssessment] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name.split(' ')[0]);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
    });

    try {
      const assessmentRaw = localStorage.getItem("careflow:last_health_assessment");
      if (assessmentRaw) {
        setLastAssessment(JSON.parse(assessmentRaw));
      }

      const rxRaw = localStorage.getItem("careflow_prescriptions");
      if (rxRaw) {
        setPrescriptions(JSON.parse(rxRaw));
      }
    } catch { }
  }, []);

  // Generate dynamic stats based on AI assessment if available
  const healthScore = lastAssessment ?
    (lastAssessment.severity === 'Critical' ? 45 : lastAssessment.severity === 'Serious' ? 65 : lastAssessment.severity === 'Moderate' ? 82 : 95)
    : 100;

  // Dynamic Activities
  const recentActivities = [];
  if (lastAssessment) {
    recentActivities.push({
      title: `AI Assessment: ${lastAssessment.severity} Severity`,
      time: new Date(lastAssessment.at).toLocaleString(),
      status: "Completed",
      type: "ai",
      icon: Bot
    });
  }

  prescriptions.slice(0, 3).forEach(rx => {
    recentActivities.push({
      title: `Prescription: ${rx.med}`,
      time: rx.date,
      status: rx.status,
      type: "rx",
      icon: Pill
    });
  });

  if (recentActivities.length === 0) {
    recentActivities.push({
      title: "Welcome to CareFlow AI!",
      time: "Just now",
      status: "System Active",
      type: "system",
      icon: CheckCircle2
    });
  }

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
              Hello, <span className="text-blue-400">{userName}</span>!
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              {lastAssessment ?
                `Based on your last AI checkup, your health index is ${healthScore}%. ${lastAssessment.summary}` :
                "Your personalized CareFlow AI instance is ready. Start a health assessment to track your well-being."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate("/health-ai")}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95"
              >
                <Zap size={20} className="fill-white" />
                {lastAssessment ? 'New AI Checkup' : 'Start AI Checkup'}
              </button>
              <button
                onClick={() => navigate("/telemedicine")}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 backdrop-blur-md border border-white/10 active:scale-95"
              >
                <Pill size={20} className="text-emerald-400" />
                Pharmacy Records
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
                <span className="text-xl font-black text-white">{healthScore}%</span>
              </div>
              <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className={`h-full ${healthScore > 80 ? 'bg-emerald-500' : healthScore > 50 ? 'bg-amber-500' : 'bg-red-500'} w-[${healthScore}%]`} style={{ width: `${healthScore}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-neutral-50 flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Clock size={24} />
              </div>
              Care Timeline
            </h3>
            <button onClick={() => navigate("/health-ai")} className="text-sm font-bold text-neutral-400 hover:text-blue-600 transition-colors flex items-center gap-1">
              Assist History <ChevronRight size={18} />
            </button>
          </div>
          <div className="p-8 space-y-6 flex-1">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className={
                  "w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white shadow-md ring-1 transition-all group-hover:scale-110 " +
                  (activity.type === "ai" ? "bg-blue-50 ring-blue-100 text-blue-600" :
                    activity.type === "rx" ? "bg-emerald-50 ring-emerald-100 text-emerald-600" : "bg-neutral-50 ring-neutral-100 text-neutral-600")
                }>
                  <activity.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-neutral-900 leading-tight">{activity.title}</h4>
                  <p className="text-sm text-neutral-400 font-medium">{activity.time}</p>
                </div>
                <span className={
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest " +
                  (activity.type === "ai" ? "bg-blue-100 text-blue-700" :
                    activity.type === "rx" ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-700")
                }>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic AI Insights */}
        <section className="bg-blue-600 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group shadow-2xl shadow-blue-100 flex flex-col">
          <div className="relative z-10 space-y-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-lg text-white border border-white/20 mb-6">
                <Dna size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white leading-tight tracking-tight">AI Health Plan</h3>
                {lastAssessment && lastAssessment.steps?.length > 0 ? (
                  <ul className="text-blue-50 text-sm leading-relaxed font-medium opacity-90 space-y-3">
                    {lastAssessment.steps.slice(0, 3).map((step: string, i: number) => (
                      <li key={i} className="flex gap-2"><ArrowRight size={16} className="mt-0.5 shrink-0" /> {step}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-blue-50 text-lg leading-relaxed font-medium opacity-90">
                    "Start an AI diagnosis checkup to generate your personalized tracking and health steps directly from the CareFlow network."
                  </p>
                )}
              </div>
            </div>
            {lastAssessment && (
              <button onClick={() => navigate("/health-ai")} className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:gap-3 w-fit mt-6">
                Continue Care <ArrowRight size={18} />
              </button>
            )}
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-black/5 blur-3xl rounded-full" />
        </section>
      </div>
    </div>
  );
}
