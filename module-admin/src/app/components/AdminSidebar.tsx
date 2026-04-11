import { NavLink, useNavigate } from "react-router";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  LogOut,
  ChevronLeft,
  Bell,
  UserCheck,
  Settings,
  ClipboardCheck,
  Award,
  Calendar,
  XCircle,
  FileSearch,
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: "/admin", label: "Хянах самбар", icon: LayoutDashboard, end: true },
  { path: "/admin/teachers", label: "Багш нар", icon: GraduationCap, end: false },
  { path: "/admin/students", label: "Оюутнууд", icon: Users, end: false },
  { path: "/admin/thesis", label: "Дипломын ажил", icon: BookOpen, end: false },
  { path: "/admin/topics", label: "Сэдвийн удирдлага", icon: FileSearch, end: false },
  { path: "/admin/committees", label: "Комиссууд", icon: UserCheck, end: false },
  { path: "/admin/evaluation-process", label: "Үнэлгээний тохиргоо", icon: Settings, end: false },
  { path: "/admin/reports", label: "Нэгдсэн тайлан", icon: ClipboardCheck, end: false },
  { path: "/admin/grades", label: "Эцсийн дүн", icon: Award, end: false },
  { path: "/admin/statistics", label: "Статистик", icon: BarChart3, end: false },
];


export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      className={`relative flex flex-col bg-[#0f1e3c] border-r border-white/5 transition-all duration-300 ${collapsed ? "w-20" : "w-60"
        } shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-200">
        <img
          src="../../assets/image/num_logo.png"
          alt="logo"
          width={32}
          height={32}
        />
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg text-[#1455BD]">МУИС</h1>
            <p className="text-[10px] text-slate-600">Дипломын ажил удирдах систем</p>
          </div>
        )}


      </div>


      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="text-xs text-blue-400/60 uppercase tracking-widest px-3 mb-3 font-medium">Үндсэн цэс</p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${collapsed ? "justify-center" : ""
                } ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-blue-200/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-blue-300/70 group-hover:text-white"}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {!collapsed && isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-200" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={`p-3 border-t border-white/10 space-y-1`}>
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200/70 hover:bg-white/10 hover:text-white transition-all ${collapsed ? "justify-center" : ""}`}>
          <Bell className="w-5 h-5 shrink-0 text-blue-300/70" />
          {!collapsed && <span className="text-sm font-medium">Мэдэгдэл</span>}
        </button>
        <button
          onClick={() => navigate("/")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200/70 hover:bg-red-500/20 hover:text-red-300 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Гарах</span>}
        </button>
      </div>

      {/* User profile */}
      {
        !collapsed && (
          <div className="px-3 pb-4">
            <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl border border-white/10">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                DA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">Тэнхимийн админ</p>
                <p className="text-blue-300/60 text-xs truncate">admin@num.edu.mn</p>
              </div>
            </div>
          </div>
        )
      }
    </aside >
  );
}