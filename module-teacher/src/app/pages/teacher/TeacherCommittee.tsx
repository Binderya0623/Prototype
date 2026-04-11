import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  CheckCircle, Calendar, Clock, Users, FileText, MessageSquare,
  ChevronRight, X, BarChart3, Star, AlertCircle, Send
} from "lucide-react";

const committeeStudents = [
  {
    id: 1, name: "Д.Оч", avatar: "AJ",
    thesis: "Эмнэлгийн зургийн оношлогоонд гүн суралцах",
    stage: "Урьдчилсан хамгаалалт", scheduledDate: "2026/04/15", daysLeft: 27,
    role: "Комиссийн гишүүн", evalStatus: "Хүлээгдэж буй",
    rubricAccess: true, overallScore: null,
    comments: [
      { author: "Д-р Хоппер", text: "Арга зүйн хэсгийг дэлгэрэнгүй болгох шаардлагатай.", time: "2 өдрийн өмнө" },
    ]
  },
  {
    id: 2, name: "Б.Батбаяр", avatar: "SW",
    thesis: "IoT ухаалаг төхөөрөмжид зориулсан захын тооцоолол",
    stage: "Эцсийн хамгаалалт", scheduledDate: "2026/05/30", daysLeft: 72,
    role: "Дарга", evalStatus: "Дууссан",
    rubricAccess: true, overallScore: 88,
    comments: [
      { author: "Та", text: "Хамгаалалтын танилцуулгад маш сайн гүйцэтгэсэн.", time: "5 өдрийн өмнө" },
    ]
  },
  {
    id: 3, name: "С.Мөнхбаяр", avatar: "LP",
    thesis: "CNN ашиглан жолоодох зурвасыг илрүүлэх",
    stage: "Явц 2", scheduledDate: "2026/04/08", daysLeft: 20,
    role: "Комиссийн гишүүн", evalStatus: "Хүлээгдэж буй",
    rubricAccess: false, overallScore: null,
    comments: []
  },
  {
    id: 4, name: "Т.Түвшинбаяр", avatar: "TR",
    thesis: "BERT ашиглан нийгмийн мэдээний сентимент шинжилгээ",
    stage: "Урьдчилсан хамгаалалт", scheduledDate: "2026/04/20", daysLeft: 32,
    role: "Мэргэжлийн хянагч", evalStatus: "Дууссан",
    rubricAccess: true, overallScore: 74,
    comments: [
      { author: "Та", text: "Дүгнэлтийн бүлгийг чангатгах шаардлагатай.", time: "1 долоо хоногийн өмнө" },
    ]
  },
];

const rubricCriteria = [
  { name: "Эх сурвалжийн шинжилгээний чанар", weight: 20, max: 20 },
  { name: "Судалгааны арга зүй", weight: 25, max: 25 },
  { name: "Үр дүн ба шинжилгээ", weight: 30, max: 30 },
  { name: "Танилцуулга ба тодорхой байдал", weight: 15, max: 15 },
  { name: "Асуулт хариулт", weight: 10, max: 10 },
];

const scheduleItems = [
  { date: "04/08", student: "С.Мөнхбаяр", type: "Явц 2-ын хяналт", time: "9:00", room: "Семинарын өрөө A" },
  { date: "04/15", student: "Д.Оч", type: "Урьдчилсан хамгаалалтын хороо", time: "10:00", room: "Хурлын танхим B" },
  { date: "04/20", student: "Т.Түвшинбаяр", type: "Урьдчилсан хамгаалалтын хороо", time: "14:00", room: "Семинарын өрөө C" },
  { date: "05/30", student: "Б.Батбаяр", type: "Эцсийн хамгаалалт", time: "10:00", room: "Их танхим" },
];

export default function TeacherCommittee() {
  const [activeTab, setActiveTab] = useState("students");
  const [selectedStudent, setSelectedStudent] = useState<typeof committeeStudents[0] | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [comment, setComment] = useState("");
  const [evalSubmitted, setEvalSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = rubricCriteria.reduce((a, b) => a + b.max, 0);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setEvalSubmitted(true); }, 1500);
  };

  const pending = committeeStudents.filter(s => s.evalStatus === "Хүлээгдэж буй");
  const completed = committeeStudents.filter(s => s.evalStatus === "Дууссан");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* Гарчиг */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1455BD]" />
            Комисс
          </h1>
          <p className="text-slate-500 mt-1">Комиссийн гишүүнээр хуваарилагдсан оюутнуудын үнэлгээг удирдах.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 border flex items-center gap-1.5 px-3 py-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> {pending.length} хүлээгдэж буй үнэлгээ
          </Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border flex items-center gap-1.5 px-3 py-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> {completed.length} дууссан
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b border-slate-200 rounded-none bg-transparent h-auto p-0 space-x-6">
          {[
            { value: "students", label: "Хуваарилагдсан оюутнууд" },
            { value: "schedule", label: "Хуваарь" },
            { value: "completed", label: "Дууссан үнэлгээнүүд" },
          ].map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-3 px-1 text-slate-600">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Хуваарилагдсан оюутнууд */}
        <TabsContent value="students" className="mt-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Хүлээгдэж буй үнэлгээнүүд</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map(s => (
              <Card key={s.id} className="border-orange-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group overflow-hidden cursor-pointer" onClick={() => setSelectedStudent(s)}>
                <div className="h-1 bg-orange-300" />
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10 border border-slate-200">
                      <AvatarFallback className="bg-orange-50 text-orange-700 font-bold text-sm">{s.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <Badge className="bg-orange-100 text-orange-700 border-0">Хүлээгдэж буй</Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{s.thesis}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    {[
                      { label: "Шат", value: s.stage },
                      { label: "Үүрэг", value: s.role },
                      { label: "Огноо", value: s.scheduledDate },
                      { label: "Үлдсэн хоног", value: `${s.daysLeft} хоног`, warn: s.daysLeft <= 10 },
                    ].map(item => (
                      <div key={item.label} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <span className="text-slate-400 font-semibold uppercase tracking-wide block mb-0.5">{item.label}</span>
                        <span className={`font-medium ${(item as any).warn ? 'text-orange-600' : 'text-slate-800'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-[#1455BD] hover:bg-[#0d3a8a] text-white text-xs">
                      <Star className="w-3.5 h-3.5 mr-1.5" /> Үнэлэх
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 text-xs hover:bg-slate-50">
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Шалгуур
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest pt-4">Дууссан үнэлгээнүүд</h2>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {completed.map(s => (
                  <div key={s.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedStudent(s)}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-200">
                        <AvatarFallback className="bg-blue-50 text-[#1455BD] text-xs font-bold">{s.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{s.thesis}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-blue-50 text-[#1455BD] border-blue-100">{s.stage}</Badge>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-emerald-700">{s.overallScore} / 100</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" /> Дууссан
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1455BD] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Хуваарь */}
        <TabsContent value="schedule" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                <Calendar className="w-5 h-5 text-[#1455BD]" /> Комиссийн хуваарь
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {scheduleItems.map((item, i) => (
                  <div key={i} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 leading-none">{item.date.split('/')[0] + '/'}</span>
                        <span className="text-xl font-extrabold text-[#1455BD] leading-none">{item.date.split('/')[1]}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{item.type}</h3>
                        <p className="text-sm text-slate-600">Оюутан: <span className="font-medium">{item.student}</span></p>
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                          <span>{item.room}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0">Дэлгэрэнгүй харах</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Дууссан үнэлгээ */}
        <TabsContent value="completed" className="mt-6 space-y-4">
          {completed.map(s => (
            <Card key={s.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-200">
                      <AvatarFallback className="bg-blue-50 text-[#1455BD] font-bold">{s.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500 max-w-md">{s.thesis}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[#1455BD]">{s.overallScore}<span className="text-sm text-slate-400 font-medium">/100</span></p>
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 mt-1">Эцсийн оноо</Badge>
                  </div>
                </div>
                <Progress value={s.overallScore ?? 0} className="h-2 mb-4" />
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Тайлбарын түүх</h4>
                  {s.comments.length > 0 ? s.comments.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg border border-slate-100 p-3 text-sm">
                      <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">{c.author}: </span>
                        <span className="text-slate-600">{c.text}</span>
                        <div className="text-xs text-slate-400 mt-1">{c.time}</div>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400 italic">Тайлбар бичигдээгүй байна.</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Дэлгэрэнгүй үнэлгээний дравер */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-end" onClick={() => { setSelectedStudent(null); setEvalSubmitted(false); setScores({}); }}>
          <div className="w-full max-w-lg bg-white h-full shadow-xl overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
            <div className={`p-6 border-b border-slate-100 flex justify-between items-start ${selectedStudent.evalStatus === 'Дууссан' ? 'bg-emerald-50/30' : 'bg-orange-50/20'}`}>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{selectedStudent.role} · {selectedStudent.stage}</p>
                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                <p className="text-sm text-slate-500 mt-1 max-w-xs leading-snug">{selectedStudent.thesis}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={selectedStudent.evalStatus === 'Дууссан' ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-orange-100 text-orange-700 border-0'}>
                    {selectedStudent.evalStatus === 'Дууссан' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {selectedStudent.evalStatus}
                  </Badge>
                  <Badge variant="outline" className="bg-white border-slate-200 text-slate-600">
                    <Calendar className="w-3 h-3 mr-1" /> {selectedStudent.scheduledDate}
                  </Badge>
                </div>
              </div>
              <button onClick={() => { setSelectedStudent(null); setEvalSubmitted(false); setScores({}); }} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            {/* Тайлбар */}
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-widest">Тайлбарын түүх</h3>
              {selectedStudent.comments.length > 0 ? (
                <div className="space-y-2">
                  {selectedStudent.comments.map((c, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm">
                      <p className="font-semibold text-slate-800 mb-1">{c.author} <span className="text-xs text-slate-400 font-normal">· {c.time}</span></p>
                      <p className="text-slate-600">{c.text}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-400 italic">Одоохондоо тайлбар байхгүй.</p>}
              <div className="flex gap-2 mt-4">
                <input className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1455BD]" placeholder="Тайлбар нэмэх..." value={comment} onChange={e => setComment(e.target.value)} />
                <Button size="sm" className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white shrink-0"><Send className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Шалгуурын оноо */}
            <div className="p-6 flex-1">
              <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest">Үнэлгээний шалгуур</h3>
              {evalSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Үнэлгээ хадгалагдлаа!</h3>
                  <p className="text-slate-500 text-sm">Нийт оноо: <strong className="text-[#1455BD]">{totalScore} / {maxScore}</strong></p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {rubricCriteria.map((criterion, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold text-sm text-slate-800">{criterion.name}</p>
                          <span className="text-xs text-slate-400 font-medium">Дээд: {criterion.max} оноо</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="range" min={0} max={criterion.max} value={scores[i] || 0} onChange={e => setScores({ ...scores, [i]: parseInt(e.target.value) })} className="flex-1 accent-[#1455BD]" />
                          <input type="number" min={0} max={criterion.max} value={scores[i] || 0} onChange={e => setScores({ ...scores, [i]: Math.min(criterion.max, parseInt(e.target.value) || 0) })} className="w-14 text-center border border-slate-300 rounded-md py-1 text-sm focus:outline-none focus:border-[#1455BD]" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Нийт оноо</span>
                    <span className="text-2xl font-extrabold text-[#1455BD]">{totalScore} <span className="text-slate-400 text-base font-medium">/ {maxScore}</span></span>
                  </div>
                  <Button className="w-full mt-4 bg-[#1455BD] hover:bg-[#0d3a8a] text-white" size="lg" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Илгааж байна..." : "Үнэлгээ илгаах"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
