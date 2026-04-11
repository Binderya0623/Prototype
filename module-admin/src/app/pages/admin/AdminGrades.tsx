import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  Award, Download, CheckCircle2, Lock, AlertTriangle,
  Search, Filter, BarChart3, Eye, RefreshCw, Clock
} from "lucide-react";

const gradesData = [
  {
    id: 1, student: "Д.Оч", thesis: "IoT захын тооцоолол", supervisor: "Д-р Митчелл", stage: "Эцсийн хамгаалалт",
    scores: { progress1: 85, progress2: 88, preDefense: 87, finalDefense: 92 },
    weightedFinal: 89, letterGrade: "А", status: "Нийтлэгдсэн", publishedBy: "Администратор", publishedOn: "2026/03/10"
  },
  {
    id: 2, student: "Б.Батбаяр", thesis: "BERT ашиглан сентимент шинжилгээ", supervisor: "Проф. Торвальдс", stage: "Урьдчилсан хамгаалалт",
    scores: { progress1: 72, progress2: 75, preDefense: 74, finalDefense: null },
    weightedFinal: 74, letterGrade: "Б+", status: "Ноорог", publishedBy: null, publishedOn: null
  },
  {
    id: 3, student: "С.Мөнхбаяр", thesis: "Эмнэлгийн зургийн оношлогоонд гүн суралцах", supervisor: "Д-р Митчелл", stage: "Урьдчилсан хамгаалалт",
    scores: { progress1: 90, progress2: 88, preDefense: 85, finalDefense: null },
    weightedFinal: 87, letterGrade: "А-", status: "Ноорог", publishedBy: null, publishedOn: null
  },
  {
    id: 4, student: "Т.Түвшинбаяр", thesis: "Роботын замнал төлөвлөлт", supervisor: "Д-р Ловелейс", stage: "Явц 2",
    scores: { progress1: 80, progress2: null, preDefense: null, finalDefense: null },
    weightedFinal: null, letterGrade: "—", status: "Хүлээгдэж буй", publishedBy: null, publishedOn: null
  },
];

const stageWeights = { progress1: 10, progress2: 15, preDefense: 20, finalDefense: 40 };

export default function AdminGrades() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Бүгд");
  const [selectedGrade, setSelectedGrade] = useState<typeof gradesData[0] | null>(null);
  const [publishModal, setPublishModal] = useState<typeof gradesData[0] | null>(null);
  const [publishConfirmed, setPublishConfirmed] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const filtered = gradesData
    .filter(g => statusFilter === "Бүгд" || g.status === statusFilter)
    .filter(g => g.student.toLowerCase().includes(search.toLowerCase()));

  const handlePublish = () => {
    setPublishSuccess(false);
    setTimeout(() => {
      setPublishSuccess(true);
      setTimeout(() => { setPublishModal(null); setPublishConfirmed(false); setPublishSuccess(false); }, 1500);
    }, 1000);
  };

  const handleRecalc = () => {
    setRecalculating(true);
    setTimeout(() => setRecalculating(false), 1500);
  };

  const statusBadge = (status: string) => {
    if (status === "Нийтлэгдсэн") return <Badge className="bg-emerald-100 text-emerald-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Нийтлэгдсэн</Badge>;
    if (status === "Ноорог") return <Badge className="bg-orange-100 text-orange-700 border-0">Ноорог</Badge>;
    return <Badge className="bg-slate-100 text-slate-600 border-0"><Clock className="w-3 h-3 mr-1" />Хүлээгдэж буй</Badge>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#1455BD]" />
            Эцсийн дүн
          </h1>
          <p className="text-slate-500 mt-1">Оюутны дүнг хянах, нийтлэх болон аудит хийх.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-200 text-slate-700" onClick={handleRecalc} disabled={recalculating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${recalculating ? 'animate-spin' : ''}`} />
            {recalculating ? "Дахин тооцоолж байна..." : "Дахин тооцоолох"}
          </Button>
          <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white">
            <Download className="w-4 h-4 mr-2" /> Дүн гаргах
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Нийт оюутан", value: gradesData.length, color: "text-[#1455BD]" },
          { label: "Нийтлэгдсэн", value: gradesData.filter(g => g.status === "Нийтлэгдсэн").length, color: "text-emerald-600" },
          { label: "Ноорог", value: gradesData.filter(g => g.status === "Ноорог").length, color: "text-orange-600" },
          { label: "Хүлээгдэж буй", value: gradesData.filter(g => g.status === "Хүлээгдэж буй").length, color: "text-slate-500" },
        ].map(stat => (
          <Card key={stat.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-5 text-center">
              <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {gradesData.filter(g => g.status === "Ноорог").length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            <strong>{gradesData.filter(g => g.status === "Ноорог").length} дүн</strong> ноорог байдалтай бөгөөд оюутанд харагдахгүй байна. Бэлэн болсон үед нийтлэнэ үү.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Оюутнаар хайх..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:border-[#1455BD] bg-white" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["Бүгд", "Нийтлэгдсэн", "Ноорог", "Хүлээгдэж буй"].map(f => (
            <Button key={f} variant={statusFilter === f ? "default" : "outline"} size="sm" className={statusFilter === f ? "bg-[#1455BD] text-white border-0" : "border-slate-200 text-slate-600"} onClick={() => setStatusFilter(f)}>{f}</Button>
          ))}
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Оюутан", "Явц 1", "Явц 2", "Урьдч.", "Эцсийн", "Жигнэсэн", "Дүн", "Байдал", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(g => (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-sm text-slate-900">{g.student}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[140px]">{g.supervisor}</p>
                  </td>
                  {[g.scores.progress1, g.scores.progress2, g.scores.preDefense, g.scores.finalDefense].map((score, i) => (
                    <td key={i} className="px-4 py-4 text-center">
                      {score !== null ? <span className="text-sm font-semibold text-slate-800">{score}</span> : <span className="text-slate-300 text-sm">—</span>}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    {g.weightedFinal !== null ? <span className="text-lg font-extrabold text-[#1455BD]">{g.weightedFinal}</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge variant="outline" className={`font-bold ${g.letterGrade !== '—' ? 'border-blue-200 text-[#1455BD] bg-blue-50' : 'border-slate-200 text-slate-400'}`}>{g.letterGrade}</Badge>
                  </td>
                  <td className="px-4 py-4">{statusBadge(g.status)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-[#1455BD] opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedGrade(g)}>
                        <Eye className="w-4 h-4 mr-1" /> Харах
                      </Button>
                      {g.status !== "Нийтлэгдсэн" && g.weightedFinal !== null && (
                        <Button size="sm" className="text-xs bg-[#1455BD] hover:bg-[#0d3a8a] text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setPublishModal(g); setPublishConfirmed(false); }}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Нийтлэх
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Дэлгэрэнгүй дравер */}
      {selectedGrade && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-end" onClick={() => setSelectedGrade(null)}>
          <div className="w-full max-w-md bg-white h-full shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedGrade.student}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{selectedGrade.thesis}</p>
              </div>
              <button onClick={() => setSelectedGrade(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <Filter className="w-4 h-4 text-slate-400 rotate-90" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="text-center py-5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Жигнэсэн нийт оноо</p>
                <p className="text-5xl font-extrabold text-[#1455BD]">{selectedGrade.weightedFinal ?? "—"}</p>
                <p className="text-lg font-bold text-slate-600 mt-1">/ 100 · Дүн: {selectedGrade.letterGrade}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Шатуудаар авсан оноо</h3>
                <div className="space-y-3">
                  {[
                    { label: "Явц 1", score: selectedGrade.scores.progress1, weight: stageWeights.progress1 },
                    { label: "Явц 2", score: selectedGrade.scores.progress2, weight: stageWeights.progress2 },
                    { label: "Урьдчилсан хамгаалалт", score: selectedGrade.scores.preDefense, weight: stageWeights.preDefense },
                    { label: "Эцсийн хамгаалалт", score: selectedGrade.scores.finalDefense, weight: stageWeights.finalDefense },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-400">Жин: {item.weight}%</p>
                      </div>
                      <span className={`text-lg font-extrabold ${item.score !== null ? 'text-slate-900' : 'text-slate-300'}`}>{item.score ?? "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selectedGrade.publishedBy && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Аудитын мэдээлэл</p>
                  <p className="text-sm text-emerald-800">Нийтлэгч: <strong>{selectedGrade.publishedBy}</strong></p>
                  <p className="text-sm text-emerald-700">{selectedGrade.publishedOn}</p>
                </div>
              )}
              {selectedGrade.status === "Нийтлэгдсэн" && (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 p-3 rounded-lg">
                  <Lock className="w-4 h-4 shrink-0" /> Энэ дүн нийтлэгдсэн тул засварлах боломжгүй.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Нийтлэх модал */}
      {publishModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Эцсийн дүн нийтлэх</h2>
              <p className="text-sm text-slate-500 mt-1">Дүн нийтлэгдсэний дараа оюутанд харагдана.</p>
            </div>
            {publishSuccess ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                <h3 className="text-xl font-bold text-slate-900">Дүн нийтлэгдлээ!</h3>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{publishModal.student}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-[#1455BD]">{publishModal.weightedFinal}</span>
                    <span className="text-slate-400 font-medium">/ 100</span>
                    <Badge className="ml-auto bg-blue-50 text-[#1455BD] border-blue-100 font-bold">{publishModal.letterGrade}</Badge>
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 w-4 h-4 accent-[#1455BD]" checked={publishConfirmed} onChange={e => setPublishConfirmed(e.target.checked)} />
                  <span className="text-sm text-slate-700">Энэ дүн эцсийн хэлбэртэй бөгөөд оюутанд нийтлэхэд бэлэн болсныг баталгаажуулж байна.</span>
                </label>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-slate-200" onClick={() => { setPublishModal(null); setPublishConfirmed(false); }}>Цуцлах</Button>
                  <Button className="flex-1 bg-[#1455BD] hover:bg-[#0d3a8a] text-white" disabled={!publishConfirmed} onClick={handlePublish}>
                    Дүн нийтлэх
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
