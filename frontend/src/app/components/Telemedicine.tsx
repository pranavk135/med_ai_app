import React, { useState } from "react";
import { 
  Pill, 
  MapPin, 
  Search, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ClipboardCheck, 
  User, 
  Phone, 
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Droplet,
  Sparkles,
  ShieldCheck,
  Package,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const PHARMACIES = [
  { name: 'Health Plus Pharmacy', distance: '0.8 km', address: '123 Medical Way', status: 'Open now', rating: 4.9, openUntil: '10:00 PM', image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=400&h=400&fit=crop' },
  { name: 'City Drug Store', distance: '1.5 km', address: '456 Parkway St', status: 'Open now', rating: 4.7, openUntil: '08:00 PM', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=400&h=400&fit=crop' },
  { name: 'CureWell Pharmacy', distance: '2.1 km', address: '789 Central Ave', status: 'Closed', rating: 4.6, openUntil: '06:00 PM', image: 'https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?w=400&h=400&fit=crop' },
];

const PRESCRIPTIONS = [
  { id: 'rx-1', med: 'Metformin 500mg', dosage: '1 tablet twice daily', doctor: 'Dr. Sarah Chen', date: 'Feb 15, 2026', refills: 2, status: 'Active' },
  { id: 'rx-2', med: 'Vitamin D3 2000IU', dosage: '1 softgel daily', doctor: 'Dr. John Doe', date: 'Jan 10, 2026', refills: 0, status: 'Completed' },
];

export function Telemedicine() {
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'pharmacies'>('prescriptions');
  const [selectedRx, setSelectedRx] = useState<string | null>('rx-1');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Tabs */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
            <Pill size={14} />
            Pharmaceutical Services
          </div>
          <h2 className="text-4xl font-black text-neutral-900 tracking-tight leading-tight">Telemedicine & Pharmacy</h2>
          <p className="text-neutral-500 font-medium text-lg max-w-lg">Manage your prescriptions and find authorized pharmacies nearby.</p>
        </div>
        
        <div className="bg-neutral-100 p-1.5 rounded-2xl flex items-center shadow-inner self-start md:self-auto">
          <button 
            onClick={() => setActiveTab('prescriptions')}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all active:scale-95",
              activeTab === 'prescriptions' ? "bg-white text-blue-600 shadow-xl" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            My Prescriptions
          </button>
          <button 
            onClick={() => setActiveTab('pharmacies')}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all active:scale-95",
              activeTab === 'pharmacies' ? "bg-white text-blue-600 shadow-xl" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            Near Pharmacies
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'prescriptions' ? (
          <motion.div 
            key="prescriptions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Prescriptions List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-xl text-neutral-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <ClipboardCheck size={20} />
                  </div>
                  Medication Records
                </h3>
                <button className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all group">
                  New Order <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                {PRESCRIPTIONS.map((rx) => (
                  <div 
                    key={rx.id}
                    onClick={() => setSelectedRx(rx.id)}
                    className={cn(
                      "group p-8 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between relative overflow-hidden",
                      selectedRx === rx.id ? "bg-white border-blue-600 shadow-2xl shadow-blue-100" : "bg-white border-transparent hover:border-blue-100 shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-6 relative z-10">
                      <div className={cn(
                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110",
                        rx.status === 'Active' ? "bg-blue-600 shadow-blue-200" : "bg-neutral-300 shadow-neutral-100"
                      )}>
                        <Pill size={32} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-neutral-900 group-hover:text-blue-600 transition-colors leading-tight">{rx.med}</h4>
                        <div className="flex items-center gap-3 text-neutral-400 font-bold text-xs uppercase tracking-tight">
                          <span className="flex items-center gap-1"><User size={12} /> {rx.doctor}</span>
                          <span className="w-1 h-1 bg-neutral-200 rounded-full" />
                          <span className="flex items-center gap-1"><Calendar size={12} /> {rx.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2 relative z-10">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border-2",
                        rx.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-neutral-50 text-neutral-500 border-neutral-100"
                      )}>
                        {rx.status}
                      </span>
                      <p className="text-xs font-black text-neutral-300 uppercase tracking-tighter">{rx.refills} refills remaining</p>
                    </div>
                    {selectedRx === rx.id && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                    )}
                  </div>
                ))}
              </div>

              {/* Mock Prescription Details */}
              {selectedRx && (
                <motion.section 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black text-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/10 overflow-hidden relative border border-white/5"
                >
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                      <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-6 border border-blue-500/30 backdrop-blur-md">
                          <ShieldCheck size={14} />
                          Authentic Digital Script
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                          {PRESCRIPTIONS.find(r => r.id === selectedRx)?.med}
                        </h3>
                        <p className="text-neutral-500 text-sm font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                          Record ID: <span className="text-white">{selectedRx}</span>
                        </p>
                      </div>
                      <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
                        <Activity size={40} className="text-blue-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 border-y border-white/10 py-10">
                      <div className="space-y-2">
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">Clinical Dosage</p>
                        <p className="text-2xl font-black text-white">{PRESCRIPTIONS.find(r => r.id === selectedRx)?.dosage}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">Logistics Schedule</p>
                        <p className="text-2xl font-black text-white">30 Days Supply Cycle</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">Pharmacist Note</p>
                        <p className="text-xl font-black text-blue-300 italic opacity-90">"Always administer post-meal with water."</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-[0.2em]">Blockchain Verification</p>
                        <p className="text-2xl font-black text-emerald-400 flex items-center gap-3">
                          Verified Integrity <Sparkles size={24} className="fill-emerald-400 text-emerald-400" />
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 active:scale-95">
                        <Package size={22} />
                        Dispatch to Pharmacy
                      </button>
                      <button className="p-5 bg-white/10 border border-white/10 rounded-2xl text-white hover:bg-white/20 transition-all active:scale-95 backdrop-blur-md">
                        <ExternalLink size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
                </motion.section>
              )}
            </div>

            {/* Sidebars */}
            <div className="space-y-8">
              <section className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8 shadow-sm group relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="p-4 bg-white rounded-2xl w-fit shadow-xl text-blue-600 group-hover:rotate-12 transition-transform duration-500">
                    <Calendar size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-blue-900 text-2xl leading-tight">Next Session</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-lg font-bold text-blue-800">
                        <Clock size={20} />
                        Feb 22, 14:00
                      </div>
                      <p className="text-sm text-blue-700/70 leading-relaxed font-medium italic border-l-4 border-blue-200 pl-4">
                        Follow-up with Dr. Chen regarding Glucose optimization.
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                    Reschedule Now
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
              </section>

              <section className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                <h3 className="font-black text-neutral-900 text-xl flex items-center gap-3">
                  <TrendingUp size={24} className="text-emerald-500" />
                  Health Dynamics
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Glucose Efficiency</span>
                      <span className="text-xs font-black text-emerald-600">+14%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[82%]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Hydration Balance</span>
                      <span className="text-xs font-black text-blue-600">Optimal</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[94%]" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="pharmacies"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Pharmacy Map / Search Area */}
            <div className="lg:col-span-2 space-y-8">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-600 transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Enter city, pharmacy name or zip code..." 
                  className="w-full bg-white border-2 border-neutral-100 rounded-[2rem] pl-16 pr-8 py-6 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-xl shadow-neutral-100/50"
                />
              </div>

              <div className="space-y-6">
                {PHARMACIES.map((p, i) => (
                  <div key={i} className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all group flex flex-col md:flex-row items-center justify-between cursor-pointer gap-6">
                    <div className="flex items-center gap-8 w-full">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl flex-shrink-0 border-4 border-white ring-1 ring-neutral-100">
                      <ImageWithFallback 
                        src={p.image} 
                        alt={p.name} 
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center flex-wrap gap-3">
                          <h4 className="text-2xl font-black text-neutral-900 group-hover:text-blue-600 transition-colors leading-tight">{p.name}</h4>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border-2",
                            p.status === 'Open now' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-neutral-50 text-neutral-500 border-neutral-100"
                          )}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-neutral-500 font-bold text-sm flex items-center gap-2">
                          <MapPin size={16} className="text-blue-500" />
                          {p.distance} • {p.address}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-500 uppercase tracking-widest pt-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={14} fill={s <= Math.floor(p.rating) ? "currentColor" : "none"} className={s <= Math.floor(p.rating) ? "" : "text-neutral-200"} />
                          ))}
                          <span className="ml-2 text-neutral-400">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-col items-center md:items-end gap-4 w-full md:w-auto">
                      <p className="hidden md:block text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1">Schedule: {p.openUntil}</p>
                      <button className="flex-1 md:flex-none bg-black text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 shadow-lg">
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Pharmacy Sidebar / Stats */}
            <div className="space-y-8">
              <section className="bg-neutral-900 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-2xl tracking-tight leading-tight">Priority Pickup</h3>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                      <Package size={20} className="text-blue-400" />
                    </div>
                  </div>
                  <p className="text-neutral-400 text-lg font-medium leading-relaxed">
                    Automated coordination complete with <span className="text-white">Health Plus</span>. Verified biometric ID required.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Order Token #RX-772</span>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <p className="text-xl font-black text-white">Metformin 500mg</p>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-[0.2em]">
                      <ShieldCheck size={16} />
                      Ready for Collection
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 active:scale-95">
                    <Navigation size={22} fill="currentColor" />
                    Navigate Now
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full -mr-24 -mt-24" />
              </section>
              
              <div className="p-8 bg-white border border-neutral-100 rounded-[2.5rem] space-y-6">
                <h4 className="font-black text-neutral-900 text-lg uppercase tracking-widest">Pharmacy Connect</h4>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-blue-600 transition-all p-5 bg-neutral-50 rounded-2xl border border-transparent hover:border-blue-100">
                    <span className="flex items-center gap-3">
                      <Phone size={18} />
                      Speak with Staff
                    </span>
                    <ChevronRight size={18} />
                  </button>
                  <button className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-blue-600 transition-all p-5 bg-neutral-50 rounded-2xl border border-transparent hover:border-blue-100">
                    <span className="flex items-center gap-3">
                      <Droplet size={18} />
                      Inventory Pulse
                    </span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

function Navigation({ size, fill, className }: { size: number, fill?: string, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill || "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  );
}
