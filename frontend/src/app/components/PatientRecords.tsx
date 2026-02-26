import React, { useState, useEffect } from "react";
import { supabase, getServerUrl } from "../supabaseClient";
import { publicAnonKey } from "../../../utils/supabase/info";
import { toast } from "sonner";
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Clock, 
  XIcon,
  Activity, 
  Weight, 
  Thermometer, 
  Droplet,
  Save,
  Loader2,
  Heart,
  Scale,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Record {
  id: string;
  timestamp: string;
  type: string;
  value: string;
  unit: string;
  notes: string;
}

export function PatientRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [type, setType] = useState("Blood Sugar");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("mg/dL");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUserId(session.user.id);
      fetchRecords(session.user.id);
    } else {
      setLoading(false);
    }
  };

  const fetchRecords = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(getServerUrl(`profile`), {
        headers: {
          "Authorization": `Bearer ${session?.access_token || publicAnonKey}`
        }
      });
      const data = await response.json();
      
      if (data.profile?.records) {
        setRecords(data.profile.records);
      } else {
        // Fallback mock data
        setRecords([
          { id: "1", timestamp: new Date(Date.now() - 86400000).toISOString(), type: "Blood Sugar", value: "115", unit: "mg/dL", notes: "Before breakfast" },
          { id: "2", timestamp: new Date(Date.now() - 172800000).toISOString(), type: "Weight", value: "72.5", unit: "kg", notes: "Morning weight" }
        ]);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please sign in to save records permanently.");
      const newRec = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        type,
        value,
        unit,
        notes
      };
      setRecords([newRec, ...records]);
      setShowForm(false);
      return;
    }

    setSaving(true);
    const newRecord: Record = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type,
      value,
      unit,
      notes
    };

    const updatedRecords = [newRecord, ...records];
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(getServerUrl("update-profile"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ records: updatedRecords }),
      });

      if (!response.ok) throw new Error("Failed to save");
      
      setRecords(updatedRecords);
      toast.success("Record saved successfully");
      setShowForm(false);
      setValue("");
      setNotes("");
    } catch (err) {
      toast.error("Error saving to cloud");
      setRecords(updatedRecords);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const updatedRecords = records.filter(r => r.id !== id);
    setRecords(updatedRecords);
    
    if (userId) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch(getServerUrl("update-profile"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ records: updatedRecords }),
        });
      } catch (err) {
        console.error("Delete sync error", err);
      }
    }
    toast.success("Record removed");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
            <ClipboardList size={14} />
            Clinical Records
          </div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 leading-tight">Patient Logs</h1>
          <p className="text-neutral-500 font-medium text-lg">Centralized tracking for your health metrics and vitals.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95",
            showForm 
              ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 shadow-neutral-100" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
          )}
        >
          {showForm ? <XIcon size={20} /> : <Plus size={20} />}
          {showForm ? "Close Form" : "New Log Entry"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSave} className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-2xl shadow-neutral-100 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Metric Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Blood Sugar</option>
                    <option>Blood Pressure</option>
                    <option>Heart Rate</option>
                    <option>Temperature</option>
                    <option>Weight</option>
                    <option>Height</option>
                    <option>Oxygen Saturation</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Current Value</label>
                  <input
                    type="text"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all"
                    placeholder="e.g. 120"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all"
                    placeholder="e.g. mg/dL"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Additional Context</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-800 outline-none transition-all min-h-[120px] resize-none"
                  placeholder="Describe any conditions, symptoms or context..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all shadow-2xl active:scale-[0.98]"
              >
                {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                {saving ? "Synchronizing..." : "Save Log Entry"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Calendar size={20} className="text-neutral-400" />
            </div>
            <h2 className="font-black text-xl text-neutral-900 leading-tight">Timeline History</h2>
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{records.length} Logs Saved</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Health Metric</th>
                <th className="px-8 py-6">Measurement</th>
                <th className="px-8 py-6">Recorded At</th>
                <th className="px-8 py-6">Context</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <Loader2 size={40} className="animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-neutral-500 font-bold uppercase tracking-widest text-xs">Retrieving History...</p>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                        <ClipboardList size={32} />
                      </div>
                      <p className="text-neutral-500 font-medium">Your timeline is currently empty. Start logging your vitals to see them here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          {getIcon(record.type)}
                        </div>
                        <span className="font-black text-neutral-900 tracking-tight">{record.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-neutral-900">{record.value}</span>
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">{record.unit}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-700">{new Date(record.timestamp).toLocaleDateString()}</span>
                        <span className="text-[10px] font-medium text-neutral-400">{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-neutral-500 font-medium max-w-xs truncate italic">
                        {record.notes || "No context provided"}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="p-3 text-neutral-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'blood sugar': return <Droplet size={20} />;
    case 'blood pressure': return <Activity size={20} />;
    case 'heart rate': return <Heart size={20} />;
    case 'temperature': return <Thermometer size={20} />;
    case 'weight': return <Scale size={20} />;
    default: return <ClipboardList size={20} />;
  }
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
