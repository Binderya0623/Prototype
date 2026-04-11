import { useState } from "react";
import { Bell, Mail, Search, ChevronDown, X } from "lucide-react";
import { notifications } from "../data/mockData";

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  userName: string;
  userRole: string;
  userInitials: string;
  avatarColor?: string;
  onLogout?: () => void;
}

export default function TopHeader({
  title,
  subtitle,
  userName,
  userRole,
  userInitials,
  avatarColor = "from-blue-500 to-blue-700",
  onLogout,
}: TopHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-0 flex items-center justify-between h-16 shrink-0 relative z-20">
      {/* Left: Title */}
      <div>
        <h1 className="text-slate-800">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-2xl items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-[#1455BD] focus-within:bg-white transition-all">        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Судалгааны ажил, оюутан, багш хайх..."
          className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm text-slate-800">Мэдэгдэл</h3>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${!notif.read ? "bg-blue-50/50" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${!notif.read ? "bg-[#1455BD] text-white" : "bg-slate-200 text-slate-600"}`}>
                      {notif.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-tight">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{notif.time}</p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 bg-[#1455BD] rounded-full shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100">
                <button className="text-xs text-[#1455BD] hover:text-[#0d3a8a] font-medium">Бүх мэдэгдлийг харах</button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className={`w-8 h-8 bg-gradient-to-br ${avatarColor} rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {userInitials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm text-slate-800 font-medium leading-tight">{userName}</p>
              <p className="text-xs text-slate-400">{userRole}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm text-slate-800 font-medium">{userName}</p>
                <p className="text-xs text-slate-400">{userRole}</p>
              </div>
              {["Тохиргоо", "Сонголтууд", "Тусламж & Дэмжлэг"].map((item) => (
                <button key={item} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  {item}
                </button>
              ))}
              <div className="border-t border-slate-100">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Гарах
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}