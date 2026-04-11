import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, GraduationCap, BookOpen, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import { recentActivities, theses, teachers } from "../../data/mockData";

const submissionTrend = [
  { month: "9-р сар", submitted: 4, approved: 2, rejected: 1 },
  { month: "10-р сар", submitted: 7, approved: 5, rejected: 1 },
  { month: "11-р сар", submitted: 5, approved: 3, rejected: 2 },
  { month: "12-р сар", submitted: 3, approved: 2, rejected: 0 },
  { month: "1-р сар", submitted: 8, approved: 6, rejected: 1 },
  { month: "2-р сар", submitted: 10, approved: 7, rejected: 2 },
  { month: "3-р сар", submitted: 12, approved: 9, rejected: 1 },
];

const deptData = [
  { name: "CS", value: 32 },
  { name: "Data Sci", value: 24 },
  { name: "SW Eng", value: 18 },
  { name: "AI/ML", value: 15 },
  { name: "Cyber", value: 11 },
];

const COLORS = ["#2563eb", "#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b"];

const statCards = [
  {
    label: "Нийт багш нар",
    value: "24",
    change: "+2 энэ улирт",
    positive: true,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    label: "Идэвхтэй оюутнууд",
    value: "186",
    change: "+14 энэ улирт",
    positive: true,
    icon: GraduationCap,
    color: "bg-violet-50 text-violet-600",
    iconBg: "bg-violet-100",
  },
  {
    label: "Нийт дипломын ажил",
    value: "142",
    change: "+8 энэ сард",
    positive: true,
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    label: "Хүлээгдэж буй хяналт",
    value: "18",
    change: "-3 өнгөрсөн долооноос",
    positive: false,
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
    iconBg: "bg-amber-100",
  },
];

const activityIcons: Record<string, { icon: React.ElementType; color: string }> = {
  submit: { icon: FileText, color: "text-blue-600 bg-blue-100" },
  upload: { icon: ArrowUpRight, color: "text-violet-600 bg-violet-100" },
  feedback: { icon: AlertCircle, color: "text-amber-600 bg-amber-100" },
  approve: { icon: CheckCircle, color: "text-emerald-600 bg-emerald-100" },
  register: { icon: Users, color: "text-slate-600 bg-slate-100" },
};

export default function AdminDashboard() {
  const statusCounts = {
    inProgress: theses.filter((t) => t.status === "In Progress").length,
    underReview: theses.filter((t) => t.status === "Under Review").length,
    approved: theses.filter((t) => t.status === "Approved").length,
    planning: theses.filter((t) => t.status === "Planning").length,
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color.split(" ")[1]}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${card.positive ? "text-emerald-600" : "text-slate-500"}`}>
                  {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <p className="text-3xl text-slate-900 mb-1">{card.value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className={`text-xs mt-1 ${card.positive ? "text-emerald-600" : "text-slate-400"}`}>{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-slate-800">Дипломын ажлын илгаалтын чиг</h3>
              <p className="text-xs text-slate-400 mt-0.5">2024–2025 оносны жил</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Илгээсэн
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Зөвшөөрлөгдсөн
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={submissionTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="submitted" stroke="#2563eb" strokeWidth={2} fill="url(#colorSubmitted)" />
              <Area type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} fill="url(#colorApproved)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="mb-5">
            <h3 className="text-slate-800">By Department</h3>
            <p className="text-xs text-slate-400 mt-0.5">Thesis distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={deptData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {deptData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {deptData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-800 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Status Overview */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-slate-800 mb-4">Дипломын ажлын байдлын тойм</h3>
          <div className="space-y-3">
            {[
              { label: "Явцаалалдаа байна", count: statusCounts.inProgress, color: "bg-blue-500", light: "bg-blue-50 text-blue-700" },
              { label: "Хянагдаж буй", count: statusCounts.underReview, color: "bg-amber-500", light: "bg-amber-50 text-amber-700" },
              { label: "Зөвшөөрлөгдсөн", count: statusCounts.approved, color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700" },
              { label: "Төлөвлөгө шатанда", count: statusCounts.planning, color: "bg-violet-500", light: "bg-violet-50 text-violet-700" },
            ].map((item) => {
              const total = theses.length;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.light}`}>{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar Chart */}
          <div className="mt-5">
            <p className="text-xs text-slate-400 mb-3">Сарын дэвшил</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={submissionTrend.slice(-5)} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Bar dataKey="submitted" fill="#dbeafe" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800">Сүүлийн үйл ажиллагаа</h3>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Бүгдийг харах</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const { icon: ActIcon, color } = activityIcons[activity.type] || activityIcons.register;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <ActIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-tight">{activity.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.user} · {activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Teachers */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800">Тэриглэх удирдагч багш нар</h3>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Бүгдийг харах</button>
          </div>
          <div className="space-y-3">
            {teachers.slice(0, 5).map((teacher, idx) => (
              <div key={teacher.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-4 shrink-0">{idx + 1}</span>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {teacher.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 font-medium truncate">{teacher.name}</p>
                  <p className="text-xs text-slate-400">{teacher.thesesCount} дипломын ажил удирдсан</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {teacher.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
