import { useState } from "react";
import { Search, Plus, MoreHorizontal, Mail, Phone, Star, Users, BookOpen, Filter, ChevronDown } from "lucide-react";
import { teachers } from "../../data/mockData";

const departments = ["Бүх тэнхим", "Компьютерын ухаан", "Огтоогны шинжлэл", "Програмхааглын инженерчлэл", "КХО/Робот", "Кибер аюулга хамгаалал"];

export default function Teachers() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("Бүх тэнхим");
  const [view, setView] = useState<"grid" | "table">("table");

  const filtered = teachers.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === "Бүх тэнхим" || t.department === selectedDept;
    return matchSearch && matchDept;
  });

  const avatarColors = [
    "from-blue-500 to-blue-700",
    "from-violet-500 to-violet-700",
    "from-emerald-500 to-emerald-700",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-700",
  ];

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-all w-64">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Багш хайх..."
              className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
            />
          </div>

          {/* Department filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-600 outline-none focus:border-blue-400 cursor-pointer"
            >
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            {(["table", "grid"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs rounded-lg capitalize font-medium transition-all ${
                  view === v ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            Багш нэмэх
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Нийт багш нар", value: teachers.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Идэвхтэй", value: teachers.filter((t) => t.status === "Active").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Чөлөө авсан", value: teachers.filter((t) => t.status === "On Leave").length, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl px-5 py-4 border border-white`}>
            <p className={`text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {view === "table" ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Багш</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Тэнхим</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Чиглэрэл</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Оюутнууд</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Дипломууд</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Байдал</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Үнэлгээ</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((teacher, idx) => (
                <tr key={teacher.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {teacher.avatar}
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 font-medium">{teacher.name}</p>
                        <p className="text-xs text-slate-400">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-slate-600">{teacher.department}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-sm text-slate-500">{teacher.specialization}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {teacher.studentsCount}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1 text-sm text-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {teacher.thesesCount}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      teacher.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-amber-500 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {teacher.rating}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">{filtered.length} / {teachers.length} багш харагдаж байна</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button key={p} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === 1 ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((teacher, idx) => (
            <div key={teacher.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-2xl flex items-center justify-center text-white font-bold`}>
                    {teacher.avatar}
                  </div>
                  <div>
                    <p className="text-sm text-slate-800 font-medium">{teacher.name}</p>
                    <p className="text-xs text-slate-400">{teacher.department}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${teacher.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {teacher.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">{teacher.specialization}</p>
              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                <div className="text-center">
                  <p className="text-lg text-slate-800">{teacher.studentsCount}</p>
                  <p className="text-xs text-slate-400">Оюутнууд</p>
                </div>
                <div className="text-center">
                  <p className="text-lg text-slate-800">{teacher.thesesCount}</p>
                  <p className="text-xs text-slate-400">Дипломууд</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <p className="text-lg text-slate-800">{teacher.rating}</p>
                  </div>
                  <p className="text-xs text-slate-400">Үнэлгээ</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> И-мэйл
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-600 hover:bg-blue-100 transition-colors">
                  Профайл харах
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
