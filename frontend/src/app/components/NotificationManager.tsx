import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Calendar, Pill, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Medication Reminder",
    message: "Time to take your Vitamin D and Magnesium supplements.",
    type: "medication",
    icon: Pill,
    color: "bg-blue-500",
    delay: 5000,
  },
  {
    id: 2,
    title: "Appointment Update",
    message: "Dr. Sarah Chen confirmed your consultation for tomorrow at 10:00 AM.",
    type: "appointment",
    icon: Calendar,
    color: "bg-emerald-500",
    delay: 15000,
  },
  {
    id: 3,
    title: "Vitals Alert",
    message: "Your heart rate was slightly elevated after your morning walk. Remember to stay hydrated.",
    type: "health",
    icon: AlertTriangle,
    color: "bg-amber-500",
    delay: 30000,
  }
];

export function NotificationManager() {
  const [activeNotification, setActiveNotification] = useState<typeof NOTIFICATIONS[0] | null>(null);

  useEffect(() => {
    const timers = NOTIFICATIONS.map(notif => {
      return setTimeout(() => {
        toast.custom((t) => (
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xl flex gap-4 w-[350px] animate-in slide-in-from-right-10">
            <div className={`w-12 h-12 rounded-xl ${notif.color} flex items-center justify-center text-white shrink-0`}>
              <notif.icon size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-neutral-900 text-sm">{notif.title}</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{notif.message}</p>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => toast.dismiss(t)}
                  className="px-3 py-1.5 bg-neutral-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-colors"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => toast.dismiss(t)}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ), { duration: 6000 });
      }, notif.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return null;
}
