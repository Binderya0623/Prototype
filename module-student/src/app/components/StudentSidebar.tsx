import { useNavigate, useLocation } from "react-router";
import { Home, BookOpen, MessageSquare, ChevronLeft, ChevronRight, LogOut, CheckCircle, Calendar, Award, Search, FileEdit, LayoutList, FilePen } from "lucide-react";
import { Button } from "./ui/button";

interface StudentSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: "Хянах самбар", path: "/student" },
  { icon: BookOpen, label: "Миний судалгааны ажил", path: "/student/thesis" },
  { icon: MessageSquare, label: "Санал хүсэлт", path: "/student/feedback" },
  { icon: Calendar, label: "Хугацаа болон Хамгаалалт", path: "/student/deadlines" },
  { icon: Award, label: "Эцсийн дүн", path: "/student/grade" },
];
export default function StudentSidebar({ collapsed, onToggle }: StudentSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${collapsed ? "w-20" : "w-64"
        }`}
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
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && <p className="text-xs text-slate-500 px-3 mb-2">ҮНДСЭН ЦЭС</p>}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                ? "bg-blue-50 text-[#1455BD] font-medium"
                : "text-slate-700 hover:bg-slate-100"
                } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-[#1455BD]" : "text-slate-500"}`} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={() => navigate("/")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${collapsed ? "justify-center" : ""
            }`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="text-sm font-medium">Гарах</span>}
        </button>
      </div>
    </div>
  );
}