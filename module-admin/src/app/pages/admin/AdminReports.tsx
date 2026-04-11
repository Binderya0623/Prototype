import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  FileText, Download, Filter, Search, CheckCircle2,
  Clock, XCircle, BarChart3, Users
} from "lucide-react";

const reportRows = [
  { id: 1, student: "Д.Оч", thesis: "Эмнэлгийн зургийн оношлогоонд гүн суралцах", supervisor: "Д-р Митчелл", stage: "Урьдчилсан хамгаалалт", committee: "Комисс А", reportStatus: "Илгээсэн", evalStatus: "Дууссан", reportDate: "2026/03/15" },
  { id: 2, student: "Б.Батбаяр", thesis: "Нийлүүлэлтийн сүлжээн дэх блокчейн", supervisor: "Д-р Митчелл", stage: "Явц 1", committee: "Комисс В", reportStatus: "Илгаагаагүй", evalStatus: "Хүлээгдэж буй", reportDate: "—" },
  { id: 3, student: "С.Мөнхбаяр", thesis: "Квантум шифрлэлтийн протоколууд", supervisor: "Проф. Торвальдс", stage: "Явц 2", committee: "Комисс В", reportStatus: "Илгээсэн", evalStatus: "Хүлээгдэж буй", reportDate: "2026/03/10" },
  { id: 4, student: "Т.Түвшинбаяр", thesis: "IoT захын тооцоолол", supervisor: "Д-р Митчелл", stage: "Эцсийн хамгаалалт", committee: "Комисс Б", reportStatus: "Илгээсэн", evalStatus: "Дууссан", reportDate: "2026/02/28" },
  { id: 5, student: "Ц.Анар", thesis: "Эмнэлгийн шийдвэрт NLP", supervisor: "Д-р Хоппер", stage: "Явц 1", committee: "Комисс В", reportStatus: "Илгаагаагүй", evalStatus: "Хүлээгдэж буй", reportDate: "—" },
  { id: 6, student: "Э.Энхбаяр", thesis: "Роботын замнал төлөвлөлт", supervisor: "Д-р Ловелейс", stage: "Явц 2", committee: "Комисс В", reportStatus: "Илгээсэн", evalStatus: "Хянагдаж буй", reportDate: "2026/03/18" },
  { id: 7, student: "Б.Билэгт", thesis: "CNN ашиглан жолоодох зурвасыг илрүүлэх", supervisor: "Д-р Нэш", stage: "Явц 2", committee: "Комисс А", reportStatus: "Илгээсэн", evalStatus: "Хүлээгдэж буй", reportDate: "2026/03/12" },
  { id: 8, student: "О.Оюун", thesis: "BERT ашиглан сентимент шинжилгээ", supervisor: "Проф. Торвальдс", stage: "Урьдчилсан хамгаалалт", committee: "Комисс А", reportStatus: "Илгээсэн", evalStatus: "Дууссан", reportDate: "2026/03/05" },
];

const summaryStats = [
  { label: "Нийт тайлан", value: reportRows.length, color: "text-[#1455BD]", bg: "bg-blue-50", icon: FileText },
  { label: "Илгээсэн", value: reportRows.filter(r => r.reportStatus === "Илгээсэн").length, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
  { label: "Илгаагаагүй", value: reportRows.filter(r => r.reportStatus === "Илгаагаагүй").length, color: "text-rose-600", bg: "bg-rose-50", icon: XCircle },
  { label: "Үнэлгээ дуусгасан", value: reportRows.filter(r => r.evalStatus === "Дууссан").length, color: "text-purple-600", bg: "bg-purple-50", icon: BarChart3 },
];

export default function AdminReports() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("Бүгд");
  const [committeeFilter, setCommitteeFilter] = useState("Бүгд");

  const filtered = reportRows
    .filter(r => stageFilter === "Бүгд" || r.stage === stageFilter)
    .filter(r => committeeFilter === "Бүгд" || r.committee === committeeFilter)
    .filter(r => r.student.toLowerCase().includes(search.toLowerCase()) || r.thesis.toLowerCase().includes(search.toLowerCase()));

  const submittedPct = Math.round((reportRows.filter(r => r.reportStatus === "Илгээсэн").length / reportRows.length) * 100);
  const evalPct = Math.round((reportRows.filter(r => r.evalStatus === "Дууссан").length / reportRows.length) * 100);

  const evalBadge = (status: string) => {
    if (status === "Дууссан") return <Badge className="bg-emerald-100 text-emerald-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Дууссан</Badge>;
    if (status === "Хянагдаж буй") return <Badge className="bg-blue-100 text-[#1455BD] border-0"><Clock className="w-3 h-3 mr-1" />Хянагдаж буй</Badge>;
    return <Badge className="bg-slate-100 text-slate-600 border-0">Хүлээгдэж буй</Badge>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#1455BD]" />
            Нэгдсэн тайлан
          </h1>
          <p className="text-slate-500 mt-1">Бүх оюутны тайлан илгаалт болон үнэлгээний байдлыг хянах.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" /> Excel гаргах
          </Button>
          <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white">
            <Download className="w-4 h-4 mr-2" /> PDF гаргах
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-slate-700">Тайлан илгаалтын хувь</span>
              <span className="font-extrabold text-[#1455BD]">{submittedPct}%</span>
            </div>
            <Progress value={submittedPct} className="h-2.5" />
            <p className="text-xs text-slate-400 mt-2">{reportRows.filter(r => r.reportStatus === "Илгээсэн").length} / {reportRows.length} оюутан илгээсэн</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-slate-700">Үнэлгээ дуусгасан хувь</span>
              <span className="font-extrabold text-purple-600">{evalPct}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${evalPct}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{reportRows.filter(r => r.evalStatus === "Дууссан").length} / {reportRows.length} үнэлгээ дуусгасан</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Оюутан эсвэл дипломын ажлаар хайх..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:border-[#1455BD] bg-white" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#1455BD]" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="Бүгд">Бүх шатууд</option>
          {["Явц 1", "Явц 2", "Урьдчилсан хамгаалалт", "Эцсийн хамгаалалт"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#1455BD]" value={committeeFilter} onChange={e => setCommitteeFilter(e.target.value)}>
          <option value="Бүгд">Бүх комиссууд</option>
          {["Комисс А", "Комисс Б", "Комисс В"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                {["Оюутан", "Шат", "Комисс", "Удирдагч багш", "Тайлан", "Үнэлгээ", "Огноо"].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-14 text-slate-400">
                  <Filter className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                  Шүүлтэд тохирох бичлэг олдсонгүй.
                </td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-sm text-slate-900">{r.student}</p>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-[160px]">{r.thesis}</p>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="bg-blue-50 text-[#1455BD] border-blue-100 text-xs">{r.stage}</Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{r.committee}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{r.supervisor}</td>
                  <td className="px-4 py-4">
                    {r.reportStatus === "Илгээсэн"
                      ? <Badge className="bg-emerald-100 text-emerald-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Илгээсэн</Badge>
                      : <Badge className="bg-rose-100 text-rose-700 border-0"><XCircle className="w-3 h-3 mr-1" />Илгаагаагүй</Badge>
                    }
                  </td>
                  <td className="px-4 py-4">{evalBadge(r.evalStatus)}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{r.reportDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
