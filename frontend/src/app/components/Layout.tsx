import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { supabase } from "../supabaseClient";
import {
  LayoutDashboard,
  Stethoscope,
  AlertCircle,
  Pill,
  Bell,
  Settings,
  User,
  Heart,
  XIcon,
  Clock,
  CheckCircle2,
  LogOut
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { NotificationManager } from "./NotificationManager";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MOCK_REMINDERS = [
  { id: 1, title: "Take Metformin", time: "09:00 AM", type: "medication", status: "pending" },
  { id: 2, title: "Check Blood Sugar", time: "10:30 AM", type: "task", status: "pending" },
  { id: 3, title: "Drink Water (500ml)", time: "11:00 AM", type: "wellness", status: "pending" },
];

export function Layout() {
  const location = useLocation();
  const [showReminders, setShowReminders] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Error signing out");
    else toast.success("Logged out successfully");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Stethoscope, label: "Health AI", href: "/health-ai" },
    { icon: Pill, label: "Records", href: "/records" },
    { icon: AlertCircle, label: "Emergency", href: "/emergency" },
    { icon: Pill, label: "Pharmacy", href: "/telemedicine" },
  ];

  const handleReminderAction = (id: number) => {
    toast.success("Task completed!");
  };

  const userName = session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || "User";

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans overflow-hidden">
      <NotificationManager />
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <Heart size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight">CareFlow AI</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const isEmergency = item.label === "Emergency";
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? isEmergency ? "bg-red-50 text-red-600 font-medium" : "bg-blue-50 text-blue-600 font-medium"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "" : isEmergency ? "group-hover:text-red-500" : "group-hover:text-blue-500")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100 mt-auto space-y-2">
          <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-neutral-500 truncate">Pro Member</p>
            </div>
            <Settings size={18} className="text-neutral-400 group-hover:rotate-45 transition-transform" />
          </Link>

          {session ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-red-600 transition-all duration-200 font-medium"
            >
              <LogOut size={20} />
              <span className="text-sm">Sign Out</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
            >
              <User size={20} />
              <span className="text-sm">Sign In / Register</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-3 md:hidden">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Heart size={18} fill="currentColor" />
            </div>
            <h1 className="text-lg font-bold">CareFlow</h1>
          </div>
          <div className="flex-1 md:block hidden" />

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">System Online</span>
            </div>
            <button
              onClick={() => setShowReminders(true)}
              className="relative p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-neutral-200 mx-1" />
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
            >
              <User size={18} className="text-neutral-500" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-[#fcfcfc]">
          <Outlet />
        </div>
      </main>

      {/* Reminders Slide-over */}
      <AnimatePresence>
        {showReminders && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReminders(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Bell size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Daily Reminders</h3>
                </div>
                <button
                  onClick={() => setShowReminders(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
                >
                  <XIcon size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {MOCK_REMINDERS.map((reminder) => (
                  <div key={reminder.id} className="group flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100 hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="p-3 bg-neutral-50 rounded-xl group-hover:bg-blue-50 text-neutral-400 group-hover:text-blue-500 transition-colors">
                      <Clock size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-neutral-900">{reminder.title}</h4>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">{reminder.type}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{reminder.time}</p>
                      <button
                        onClick={() => handleReminderAction(reminder.id)}
                        className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Mark as done <CheckCircle2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-neutral-50 border-t border-neutral-100">
                <button className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-neutral-200">
                  View Full Calendar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 px-6 flex items-center justify-between z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const isEmergency = item.label === "Emergency";
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive
                  ? isEmergency ? "text-red-600" : "text-blue-600"
                  : "text-neutral-400"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
