import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  TrendingUp, Search, Filter, ChevronDown, ChevronUp,
  AlertTriangle, AlertCircle, CheckCircle2, Clock, Calendar,
  ArrowUpDown, X, FileText, Eye
} from "lucide-react";

const allStudents = [
  { id: 1, name: "Д.Оч", avatar: "AJ", thesis: "Эмнэлгийн зургийн оношлогоонд гүн суралцах", stage: "Урьдчилсан хамгаалалт", deadline: "2026-04-15", daysLeft: 27, revisionState: "Байхгүй", submitted: true, progress: 78, status: "on_track" },
  { id: 2, name: "Б.Батбаяр", avatar: "MG", thesis: "Нийлүүлэлтийн сүлжээн дэх блокчейн", stage: "Явц 1", deadline: "2026-03-22", daysLeft: -2, revisionState: "Шаардлагатай", submitted: false, progress: 28, status: "overdue" },
  { id: 3, name: "С.Мөнхбаяр", avatar: "JS", thesis: "Квантум шифрлэлтийн протоколууд", stage: "Явц 2", deadline: "2026-04-05", daysLeft: 17, revisionState: "Засварлаж буй", submitted: true, progress: 51, status: "needs_revision" },
  { id: 4, name: "Т.Түвшинбаяр", avatar: "SW", thesis: "IoT ухаалаг төхөөрөмжид зориулсан захын тооцоолол", stage: "Эцсийн хамгаалалт", deadline: "2026-05-30", daysLeft: 72, revisionState: "Байхгүй", submitted: true, progress: 94, status: "on_track" },
  { id: 5, name: "Э.Энхбаяр", avatar: "DC", thesis: "Эмнэлгийн шийдвэрт NLP ашиглах", stage: "Явц 1", deadline: "2026-03-20", daysLeft: -4, revisionState: "Шаардлагатай", submitted: false, progress: 19, status: "overdue" },
  { id: 6, name: "О.Оюунчимэг", avatar: "EB", thesis: "Роботын замнал төлөвлөлт", stage: "Явц 2", deadline: "2026-04-10", daysLeft: 22, revisionState: "Байхгүй", submitted: true, progress: 60, status: "on_track" },
];

const upcomingMilestones = [
  { student: "Д.Оч", milestone: "Урьдчилсан хамгаалалтын хяналт", date: "2026/04/15", daysLeft: 27 },
  { student: "Б.Батбаяр", milestone: "Явц 2-ын тайлангийн эцсийн хугацаа", date: "2026/04/10", daysLeft: 22 },
  { student: "С.Мөнхбаяр", milestone: "Засварын дахин илгаах эцсийн хугацаа", date: "2026/04/05", daysLeft: 17 },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  on_track: { label: "Хэвийн", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  overdue: { label: "Хоцорсон", color: "bg-rose-100 text-rose-700 border-rose-200", icon: AlertCircle },
  needs_revision: { label: "Засвар шаардлагатай", color: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertTriangle },
};

type SortKey = "name" | "stage" | "deadline" | "progress";
type SortDir = "asc" | "desc";

export default function TeacherProgress() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("Бүгд");
  const [statusFilter, setStatusFilter] = useState("Бүгд");
  const [sortKey, setSortKey] = useState<SortKey>("deadline");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedStudent, setSelectedStudent] = useState<typeof allStudents[0] | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const stageFilters = ["Бүгд", "Явц 1", "Явц 2", "Урьдчилсан хамгаалалт", "Эцсийн хамгаалалт"];
  const statusFilters = [
    { key: "Бүгд", label: "Бүгд" },
    { key: "on_track", label: "Хэвийн" },
    { key: "overdue", label: "Хоцорсон" },
    { key: "needs_revision", label: "Засвар шаардлагатай" },
  ];

  const filtered = allStudents
    .filter(s => stageFilter === "Бүгд" || s.stage === stageFilter)
    .filter(s => statusFilter === "Бүгд" || s.status === statusFilter)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.thesis.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA: any = typeof a[sortKey] === "string" ? (a[sortKey] as string).toLowerCase() : a[sortKey];
      const valB: any = typeof b[sortKey] === "string" ? (b[sortKey] as string).toLowerCase() : b[sortKey];
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />;

  const overdue = allStudents.filter(s => s.status === "overdue");
  const needsRevision = allStudents.filter(s => s.status === "needs_revision");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* Гарчиг */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#1455BD]" />
            Явцын хяналт
          </h1>
          <p className="text-slate-500 mt-1">Хянаж буй бүх оюутны шат, эцсийн хугацаа, илгаалтын байдлыг хянах.</p>
        </div>
      </div>

      {/* Анхааруулга хэсгүүд */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-rose-200 bg-rose-50/40 shadow-sm">
          <CardContent className="p-4">
            <h3 className="flex items-center gap-2 font-bold text-rose-700 text-sm mb-3">
              <AlertCircle className="w-4 h-4" /> Хоцорсон оюутнууд ({overdue.length})
            </h3>
            <div className="space-y-2">
              {overdue.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-white border border-rose-100 rounded-lg px-3 py-2">
                  <div>
                    <span className="font-semibold text-sm text-slate-900">{s.name}</span>
                    <span className="text-xs text-rose-600 ml-2 font-medium">{Math.abs(s.daysLeft)} хоног хоцорсон</span>
                  </div>
                  <Badge className="bg-rose-100 text-rose-700 border-rose-200 border text-[10px] px-1.5 py-0 h-4">{s.stage}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/40 shadow-sm">
          <CardContent className="p-4">
            <h3 className="flex items-center gap-2 font-bold text-orange-700 text-sm mb-3">
              <AlertTriangle className="w-4 h-4" /> Засвар шаардлагатай ({needsRevision.length})
            </h3>
            <div className="space-y-2">
              {needsRevision.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-white border border-orange-100 rounded-lg px-3 py-2">
                  <div>
                    <span className="font-semibold text-sm text-slate-900">{s.name}</span>
                    <span className="text-xs text-orange-600 ml-2 font-medium">Засварлаж буй</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 border text-[10px] px-1.5 py-0 h-4">{s.stage}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Хүснэгт */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Оюутан эсвэл дипломын ажлаар хайх..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:border-[#1455BD] bg-white" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#1455BD]" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
                {stageFilters.map(s => <option key={s}>{s}</option>)}
              </select>
              <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#1455BD]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {statusFilters.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  { label: "Оюутан", key: "name" }, { label: "Шат", key: "stage" },
                  { label: "Эцсийн хугацаа", key: "deadline" }, { label: "Засварын байдал", key: null },
                  { label: "Илгаалт", key: null }, { label: "Дэвшил", key: "progress" },
                  { label: "Байдал", key: null }, { label: "", key: null },
                ].map(({ label, key }, i) => (
                  <th key={i} className="text-left px-5 py-3">
                    {key ? (
                      <button onClick={() => handleSort(key as SortKey)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-[#1455BD] transition-colors">
                        {label} <SortIcon col={key as SortKey} />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-slate-400 text-sm">
                  <Filter className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                  Шүүлтэд тохирох оюутан олдсонгүй.
                </td></tr>
              ) : filtered.map(s => {
                const statusCfg = statusConfig[s.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-slate-200">
                          <AvatarFallback className="bg-blue-50 text-[#1455BD] text-xs font-bold">{s.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-[180px]">{s.thesis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="bg-blue-50 text-[#1455BD] border-blue-100 font-medium text-xs">{s.stage}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm text-slate-700">{s.deadline}</span>
                      </div>
                      {s.daysLeft < 0 ? (
                        <span className="text-[11px] font-bold text-rose-600 flex items-center mt-0.5"><AlertCircle className="w-3 h-3 mr-0.5" />{Math.abs(s.daysLeft)} хоног хоцорсон</span>
                      ) : s.daysLeft <= 7 ? (
                        <span className="text-[11px] font-bold text-orange-500 flex items-center mt-0.5"><Clock className="w-3 h-3 mr-0.5" />{s.daysLeft} хоног үлдсэн</span>
                      ) : (
                        <span className="text-[11px] text-slate-400 mt-0.5">{s.daysLeft} хоног үлдсэн</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${s.revisionState === "Байхгүй" ? "bg-slate-50 text-slate-500 border-slate-200" :
                          s.revisionState === "Шаардлагатай" ? "bg-rose-50 text-rose-600 border-rose-200" :
                            "bg-orange-50 text-orange-600 border-orange-200"
                        }`}>{s.revisionState}</span>
                    </td>
                    <td className="px-5 py-4">
                      {s.submitted ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Илгээсэн</span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600 text-xs font-medium"><X className="w-3.5 h-3.5" /> Илгаагаагүй</span>
                      )}
                    </td>
                    <td className="px-5 py-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Progress value={s.progress} className="h-1.5 flex-1" />
                        <span className="text-xs font-bold text-slate-600 w-8 text-right">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge className={`flex items-center gap-1 border ${statusCfg.color} text-xs`}>
                        <StatusIcon className="w-3 h-3" />{statusCfg.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-[#1455BD] opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedStudent(s)}>
                        <Eye className="w-4 h-4 mr-1" /> Дэлгэрэнгүй
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Ойрын чухал цэгүүд */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1455BD]" /> Ойрын чухал цэгүүд
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {upcomingMilestones.map((m, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/10 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{m.daysLeft} хоногийн дотор</span>
                <Badge variant="outline" className="text-[10px] bg-white border-slate-200 text-slate-600">{m.date}</Badge>
              </div>
              <p className="font-semibold text-sm text-slate-900">{m.milestone}</p>
              <p className="text-xs text-slate-500 mt-1">{m.student}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Оюутны дэлгэрэнгүй мэдээлэл */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-end" onClick={() => setSelectedStudent(null)}>
          <div className="w-full max-w-md bg-white h-full shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedStudent.thesis}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Шат", value: selectedStudent.stage },
                  { label: "Эцсийн хугацаа", value: selectedStudent.deadline },
                  { label: "Илгээсэн эсэх", value: selectedStudent.submitted ? "Тийм ✓" : "Үгүй ✗" },
                  { label: "Засвар", value: selectedStudent.revisionState },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Нийт дэвшил</p>
                <div className="flex items-center gap-3">
                  <Progress value={selectedStudent.progress} className="flex-1 h-2" />
                  <span className="text-lg font-extrabold text-[#1455BD]">{selectedStudent.progress}%</span>
                </div>
              </div>
              <Button className="w-full bg-[#1455BD] hover:bg-[#0d3a8a] text-white">
                <FileText className="w-4 h-4 mr-2" /> Тайлангийн түүхийг харах
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
