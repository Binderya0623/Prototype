import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Users, Plus, Search, Eye, Settings, X, CheckCircle2,
  Lock, AlertTriangle, Clock, ChevronRight, Calendar
} from "lucide-react";

const committees = [
  {
    id: 1, name: "Урьдчилсан хамгаалалтын комисс А", type: "Урьдчилсан хамгаалалт",
    status: "Идэвхтэй", studentsCount: 5, membersCount: 4, created: "2026/02/10",
    members: [
      { name: "Батбаатар", role: "Дарга", avatar: "ББ" },
      { name: "Ананд", role: "Гишүүн", avatar: "АА" },
      { name: "Баяраа", role: "Гишүүн", avatar: "ББ" },
      { name: "Жаргал", role: "Хянагч", avatar: "ЖБ" },
    ],
    students: [
      { name: "Энхбаяр", thesis: "Эмнэлгийн зургийн оношлогоонд гүн суралцах", progress: 78, evalDone: true },
      { name: "Мөнхбаяр", thesis: "Нийлүүлэлтийн сүлжээн дэх блокчейн", progress: 30, evalDone: false },
      { name: "Наранбаяр", thesis: "CNN ашиглан жолоодох зурвасыг илрүүлэх", progress: 55, evalDone: false },
    ],
    checklist: { evaluationsComplete: false, gradesSubmitted: false },
    avgScore: 82,
  },
  {
    id: 2, name: "Эцсийн хамгаалалтын комисс Б", type: "Эцсийн хамгаалалт",
    status: "Хаагдсан", studentsCount: 3, membersCount: 5, created: "2026/01/05",
    members: [
      { name: "Проф. Деннис Ричи", role: "Дарга", avatar: "ДP" },
      { name: "Д-р Линус Торвальдс", role: "Гишүүн", avatar: "ЛТ" },
    ],
    students: [
      { name: "Sarah Williams", thesis: "IoT ухаалаг төхөөрөмжид зориулсан захын тооцоолол", progress: 100, evalDone: true },
    ],
    checklist: { evaluationsComplete: true, gradesSubmitted: true },
    avgScore: 91,
  },
  {
    id: 3, name: "Явц 2-ын комисс В", type: "Явц 2",
    status: "Идэвхтэй", studentsCount: 4, membersCount: 3, created: "2026/03/01",
    members: [
      { name: "Д-р Ада Ловелейс", role: "Дарга", avatar: "АЛ" },
      { name: "Д-р Клод Шэннон", role: "Гишүүн", avatar: "КШ" },
    ],
    students: [
      { name: "Tom Rivera", thesis: "BERT ашиглан нийгмийн мэдээний шинжилгээ", progress: 45, evalDone: false },
      { name: "Emma Brown", thesis: "Роботын замнал төлөвлөлт", progress: 60, evalDone: false },
    ],
    checklist: { evaluationsComplete: false, gradesSubmitted: false },
    avgScore: null,
  },
];

const teachers = [
  "Д-р Сараа Митчелл", "Проф. Алан Тюринг", "Д-р Грейс Хоппер",
  "Д-р Жон Нэш", "Проф. Деннис Ричи", "Д-р Ада Ловелейс",
];

const defenseTypes = ["Явц 1", "Явц 2", "Урьдчилсан хамгаалалт", "Эцсийн хамгаалалт"];
const roles = ["Дарга", "Гишүүн", "Хянагч", "Эксперт"];

export default function AdminCommittees() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Бүгд");
  const [selectedCommittee, setSelectedCommittee] = useState<typeof committees[0] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showClosure, setShowClosure] = useState<typeof committees[0] | null>(null);
  const [form, setForm] = useState({ name: "", type: "", selectedTeachers: [] as { name: string, role: string }[] });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [createSuccess, setCreateSuccess] = useState(false);
  const [closureConfirmed, setClosureConfirmed] = useState(false);

  const filtered = committees
    .filter(c => filter === "Бүгд" || c.status === filter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Комиссийн нэрийг оруулна уу.";
    if (!form.type) errors.type = "Хамгаалалтын төрлийг сонгоно уу.";
    if (form.selectedTeachers.length < 2) errors.teachers = "Дор хаяж 2 багш сонгоно уу.";
    if (!form.selectedTeachers.some(t => t.role === "Дарга")) errors.role = "Дор хаяж нэг гишүүнийг Дарга болгон тогтооно уу.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    setCreateSuccess(true);
    setTimeout(() => { setCreateSuccess(false); setShowCreate(false); setForm({ name: "", type: "", selectedTeachers: [] }); }, 1800);
  };

  const addTeacher = (name: string) => {
    if (form.selectedTeachers.find(t => t.name === name)) return;
    setForm(prev => ({ ...prev, selectedTeachers: [...prev.selectedTeachers, { name, role: "Гишүүн" }] }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1455BD]" /> Комиссууд
          </h1>
          <p className="text-slate-500 mt-1">Үнэлгээний комисс, гишүүд болон хаах үйл явцыг удирдах.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Комисс үүсгэх
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Нийт комиссууд", value: committees.length, color: "text-[#1455BD]", bg: "bg-blue-50" },
          { label: "Идэвхтэй", value: committees.filter(c => c.status === "Идэвхтэй").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Хаагдсан", value: committees.filter(c => c.status === "Хаагдсан").length, color: "text-slate-600", bg: "bg-slate-100" },
        ].map(stat => (
          <Card key={stat.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Users className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Комисс хайх..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:border-[#1455BD] bg-white" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["Бүгд", "Идэвхтэй", "Хаагдсан"].map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm"
              className={filter === f ? "bg-[#1455BD] text-white border-0" : "border-slate-200 text-slate-600"}
              onClick={() => setFilter(f)}>{f}</Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-14 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">Комисс олдсонгүй</h3>
          <p className="text-sm text-slate-400 mt-1">Шүүлт өөрчлөх эсвэл шинэ комисс үүсгэнэ үү.</p>
          <Button onClick={() => setShowCreate(true)} className="mt-4 bg-[#1455BD] text-white">Комисс үүсгэх</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(c => (
            <Card key={c.id} className={`border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden ${c.status === 'Хаагдсан' ? 'opacity-75' : ''}`}>
              <div className={`h-1 ${c.status === 'Хаагдсан' ? 'bg-slate-300' : 'bg-[#1455BD]'}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{c.name}</h3>
                      {c.status === 'Хаагдсан' && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-[#1455BD] border-blue-100 text-[10px]">{c.type}</Badge>
                      <Badge className={c.status === 'Идэвхтэй' ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-slate-100 text-slate-600 border-0'}>{c.status}</Badge>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {c.members.slice(0, 3).map(m => (
                      <Avatar key={m.name} className="h-7 w-7 border-2 border-white">
                        <AvatarFallback className="bg-blue-100 text-[#1455BD] text-[10px] font-bold">{m.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                    {c.members.length > 3 && <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+{c.members.length - 3}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  {[
                    { label: "Оюутан", value: c.studentsCount },
                    { label: "Гишүүн", value: c.membersCount },
                    { label: "Дундаж", value: c.avgScore ? `${c.avgScore}` : "—" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <p className="text-base font-bold text-slate-900">{stat.value}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs" onClick={() => setSelectedCommittee(c)}>
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> Дэлгэрэнгүй
                  </Button>
                  {c.status === 'Идэвхтэй' && (
                    <Button size="sm" className="flex-1 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs border border-rose-200 shadow-none" onClick={() => setShowClosure(c)}>
                      <Lock className="w-3.5 h-3.5 mr-1.5" /> Хаах
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Комисс үүсгэх модал */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Шинэ комисс үүсгэх</h2>
              <button onClick={() => { setShowCreate(false); setFormErrors({}); }} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            {createSuccess ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                <h3 className="text-xl font-bold text-slate-900">Комисс үүслээ!</h3>
                <p className="text-slate-500 text-sm mt-1">Шинэ комисс амжилттай үүслээ.</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Комиссийн нэр *</label>
                  <input type="text" placeholder="Жишээ: Урьдчилсан хамгаалалтын комисс 2026-А" className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1455BD] ${formErrors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  {formErrors.name && <p className="text-rose-600 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Хамгаалалтын төрөл *</label>
                  <select className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1455BD] bg-white ${formErrors.type ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="">Төрөл сонгох...</option>
                    {defenseTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {formErrors.type && <p className="text-rose-600 text-xs mt-1">{formErrors.type}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Багш нар сонгох *</label>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {teachers.map(t => {
                      const selected = form.selectedTeachers.find(s => s.name === t);
                      return (
                        <div key={t} className={`flex items-center justify-between px-3 py-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors ${selected ? 'bg-blue-50/50' : ''}`} onClick={() => selected ? setForm(p => ({ ...p, selectedTeachers: p.selectedTeachers.filter(s => s.name !== t) })) : addTeacher(t)}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected ? 'bg-[#1455BD] border-[#1455BD]' : 'border-slate-300'}`}>
                              {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-slate-800">{t}</span>
                          </div>
                          {selected && (
                            <select className="border border-slate-200 rounded-md text-xs px-2 py-1 focus:outline-none" onClick={e => e.stopPropagation()} value={selected.role} onChange={e => setForm(p => ({ ...p, selectedTeachers: p.selectedTeachers.map(s => s.name === t ? { ...s, role: e.target.value } : s) }))}>
                              {roles.map(r => <option key={r}>{r}</option>)}
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {formErrors.teachers && <p className="text-rose-600 text-xs mt-1">{formErrors.teachers}</p>}
                  {formErrors.role && <p className="text-rose-600 text-xs mt-1">{formErrors.role}</p>}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 border-slate-200" onClick={() => { setShowCreate(false); setFormErrors({}); }}>Цуцлах</Button>
                  <Button className="flex-1 bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={handleCreate}>Комисс үүсгэх</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Дэлгэрэнгүй дравер */}
      {selectedCommittee && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-end" onClick={() => setSelectedCommittee(null)}>
          <div className="w-full max-w-lg bg-white h-full shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-900">{selectedCommittee.name}</h2>
                  {selectedCommittee.status === 'Хаагдсан' && <Lock className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-[#1455BD] border-blue-100">{selectedCommittee.type}</Badge>
                  <Badge className={selectedCommittee.status === 'Идэвхтэй' ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-slate-100 text-slate-600 border-0'}>{selectedCommittee.status}</Badge>
                </div>
              </div>
              <button onClick={() => setSelectedCommittee(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="w-full justify-start border-b border-slate-200 rounded-none bg-transparent h-auto p-0 px-6 space-x-4">
                {[
                  { value: "members", label: "Гишүүд" },
                  { value: "students", label: "Оюутнууд" },
                  { value: "performance", label: "Гүйцэтгэл" },
                ].map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-3 px-1 bg-transparent shadow-none text-slate-500 text-sm">{tab.label}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="members" className="p-6 space-y-3">
                {selectedCommittee.members.map(m => (
                  <div key={m.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Avatar className="h-9 w-9 border border-slate-200"><AvatarFallback className="bg-blue-50 text-[#1455BD] font-bold text-xs">{m.avatar}</AvatarFallback></Avatar>
                    <div className="flex-1"><p className="font-semibold text-sm text-slate-900">{m.name}</p></div>
                    <Badge variant="outline" className={`text-[10px] border ${m.role === 'Дарга' ? 'bg-blue-50 text-[#1455BD] border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{m.role}</Badge>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="students" className="p-6 space-y-3">
                {selectedCommittee.students.map(s => (
                  <div key={s.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-sm text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 max-w-xs">{s.thesis}</p>
                      </div>
                      {s.evalDone
                        ? <Badge className="bg-emerald-100 text-emerald-700 border-0 shrink-0"><CheckCircle2 className="w-3 h-3 mr-1" />Үнэлсэн</Badge>
                        : <Badge className="bg-orange-100 text-orange-700 border-0 shrink-0"><Clock className="w-3 h-3 mr-1" />Хүлээгдэж буй</Badge>
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#1455BD]" style={{ width: `${s.progress}%` }} /></div>
                      <span className="text-xs font-bold text-slate-600">{s.progress}%</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="performance" className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                      <p className="text-3xl font-extrabold text-[#1455BD]">{selectedCommittee.avgScore ?? "—"}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">Дундаж оноо</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                      <p className="text-3xl font-extrabold text-emerald-600">{selectedCommittee.students.filter(s => s.evalDone).length}/{selectedCommittee.students.length}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">Үнэлгээ дуусгасан</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Хаалтын шалгалт</h4>
                    {[
                      { label: "Бүх үнэлгээ дуусгасан", done: selectedCommittee.checklist.evaluationsComplete },
                      { label: "Эцсийн дүн илгээсэн", done: selectedCommittee.checklist.gradesSubmitted },
                    ].map(item => (
                      <div key={item.label} className={`flex items-center gap-3 p-3 rounded-lg ${item.done ? 'bg-emerald-50 border border-emerald-100' : 'bg-white border border-slate-200'}`}>
                        <CheckCircle2 className={`w-4 h-4 ${item.done ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <span className={`text-sm ${item.done ? 'text-emerald-800 font-medium' : 'text-slate-500'}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Хаалтын баталгаажуулалт */}
      {showClosure && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Комисс хаах</h2>
              <button onClick={() => { setShowClosure(null); setClosureConfirmed(false); }} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">Хаасны дараа <strong>{showClosure.name}</strong>-г засварлах боломжгүй болно. Бүх мэдээлэл түгжигдэнэ.</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Бүх үнэлгээ дуусгасан", done: showClosure.checklist.evaluationsComplete },
                  { label: "Эцсийн дүн илгээсэн", done: showClosure.checklist.gradesSubmitted },
                ].map(item => (
                  <div key={item.label} className={`flex items-center gap-3 p-3 rounded-lg border ${item.done ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                    {item.done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                    <span className={`text-sm font-medium ${item.done ? 'text-emerald-800' : 'text-rose-700'}`}>{item.label}</span>
                    {!item.done && <span className="ml-auto text-xs text-rose-500 font-semibold">Дутуу</span>}
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <input type="checkbox" className="w-4 h-4 accent-[#1455BD]" checked={closureConfirmed} onChange={e => setClosureConfirmed(e.target.checked)} />
                <span className="text-sm text-slate-700">Энэ комиссыг хаахад бэлэн болсныг баталгаажуулж байна.</span>
              </label>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 border-slate-200" onClick={() => { setShowClosure(null); setClosureConfirmed(false); }}>Цуцлах</Button>
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white" disabled={!closureConfirmed || !showClosure.checklist.evaluationsComplete || !showClosure.checklist.gradesSubmitted} onClick={() => { setShowClosure(null); setClosureConfirmed(false); }}>
                  <Lock className="w-4 h-4 mr-2" /> Комисс хаах
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
