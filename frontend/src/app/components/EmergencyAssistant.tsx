import React, { useState, useEffect } from "react";
import {
  Heart,
  Droplet,
  AlertTriangle,
  Flame,
  Zap,
  Stethoscope,
  ArrowRight,
  Navigation,
  MapPin,
  Timer,
  ChevronRight,
  LifeBuoy,
  Siren,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router";
import { supabase, backendUrl } from "../supabaseClient";

const EMERGENCY_TYPES = [
  { id: "Chest Pain / Cardiac", label: "Chest Pain / Cardiac", icon: Heart },
  { id: "Breathing Difficulty", label: "Breathing Difficulty", icon: Droplet },
  { id: "Severe Injury / Bleeding", label: "Severe Injury / Bleeding", icon: AlertTriangle },
  { id: "Severe Burns", label: "Severe Burns", icon: Flame },
  { id: "Severe Allergic Reaction", label: "Severe Allergic Reaction", icon: Zap },
  { id: "Other Urgent Issue", label: "Other Urgent Issue", icon: Stethoscope },
];

export function EmergencyAssistant() {
  const location = useLocation();
  const autoData = location.state?.autoData;

  const [step, setStep] = useState(1);
  const [emergencyData, setEmergencyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get user location
  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        reject
      );
    });
  };

  const normalizeEmergencyData = (raw: any) => {
    // If this is a real emergency response from backend
    if (raw?.hospitals && (raw.immediate_steps || raw.steps)) {
      return {
        severity: raw.urgency ?? raw.severity ?? "High",
        steps: raw.immediate_steps ?? raw.steps ?? [],
        hospitals: (raw.hospitals ?? []).map((h: any) => ({
          name: h.name,
          distance:
            typeof h.distance_km === "number"
              ? `${h.distance_km.toFixed(1)} km`
              : h.distance_km ?? "",
          time:
            typeof h.eta_minutes === "number"
              ? `${h.eta_minutes} min`
              : h.eta_minutes ?? "",
          transport: raw.transport,
          mapsUrl: h.maps_url,
          recommended: h.recommended,
        })),
      };
    }

    // Fallback for health autoData (no hospitals yet)
    return {
      severity: raw?.severity ?? "High",
      steps: raw?.steps ?? [],
      hospitals: [],
    };
  };

  const analyzeEmergency = async (message: string) => {
    const loc = await getLocation();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const res = await fetch(`${backendUrl}/analyze-emergency`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        latitude: loc.lat,
        longitude: loc.lng,
      }),
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    return normalizeEmergencyData(data);
  };

  useEffect(() => {
    if (autoData) {
      setEmergencyData(normalizeEmergencyData(autoData));
      setStep(2);
    }
  }, [autoData]);

  const handleSelect = async (label: string) => {
    try {
      setLoading(true);
      const result = await analyzeEmergency(label);
      setEmergencyData(result);
      setStep(2);
    } catch {
      alert("Unable to process emergency.");
    } finally {
      setLoading(false);
    }
  };

  const hospitals = emergencyData?.hospitals || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full font-black text-xs uppercase tracking-widest">
          <Siren size={18} />
          Emergency Protocol
        </div>
        <h2 className="text-4xl font-black">
          {step === 1 ? "What's the situation?" : "Immediate Response"}
        </h2>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {EMERGENCY_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelect(type.label)}
                className="p-8 bg-white border rounded-3xl hover:shadow-xl transition-all"
              >
                <type.icon size={32} />
                <h3 className="mt-4 font-bold">{type.label}</h3>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="action"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Steps */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-red-600 text-white rounded-3xl p-8">
                <h3 className="text-2xl font-black mb-6">
                  Severity: {emergencyData?.severity}
                </h3>

                <div className="space-y-4">
                  {emergencyData?.steps?.map(
                    (stepText: string, index: number) => (
                      <div
                        key={index}
                        className="flex gap-4 bg-white/10 p-4 rounded-2xl"
                      >
                        <div className="w-10 h-10 bg-white text-red-600 rounded-xl flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <p>{stepText}</p>
                      </div>
                    )
                  )}
                </div>
              </section>

              <button
                onClick={() => {
                  setStep(1);
                  setEmergencyData(null);
                }}
                className="text-neutral-500 font-bold flex items-center gap-2"
              >
                <ArrowRight size={18} className="rotate-180" />
                Return
              </button>
            </div>

            {/* Hospitals */}
            <div>
              <section className="bg-white rounded-3xl border shadow-sm">
                <div className="p-6 bg-neutral-900 text-white rounded-t-3xl">
                  <h4 className="font-black text-xl">
                    Optimized Hospitals
                  </h4>
                </div>

                <div className="p-6 space-y-4">
                  {hospitals.map((hospital: any, i: number) => (
                    <div
                      key={i}
                      className="p-5 border rounded-2xl bg-neutral-50"
                    >
                      <h5 className="font-bold">{hospital.name}</h5>

                      <div className="flex items-center gap-4 text-sm text-neutral-600 mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {hospital.distance}
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer size={14} />
                          {hospital.time}
                        </div>
                      </div>

                      <div className="mt-3 text-xs font-bold">
                        Transport: {hospital.transport}
                      </div>

                      {i === 0 && (
                        <button
                          onClick={() =>
                            window.open(
                              hospital.mapsUrl ||
                              "https://www.google.com/maps/search/hospital/",
                              "_blank"
                            )
                          }
                          className="w-full mt-4 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
                        >
                          <Navigation size={16} />
                          Start Navigation
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t">
                  <button className="flex items-center justify-between w-full text-sm font-bold">
                    <span className="flex items-center gap-2">
                      <LifeBuoy size={18} />
                      Track Ambulance
                    </span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="text-center text-red-600 font-bold">
          Analyzing emergency...
        </div>
      )}
    </div>
  );
}