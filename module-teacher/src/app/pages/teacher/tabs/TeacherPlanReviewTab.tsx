import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "../../../components/ui/dialog";
import {
  FileText, Users, Plus, Edit2, Trash2, Save, Send, Clock, BookOpen, CheckCircle2, AlertCircle, X, Check, XCircle, Search, CalendarDays
} from "lucide-react";

// --- MOCK DATA ---
const myProposedTopics = [
  { id: 1, title: "Гүн суралцахуйн аргаар эмнэлгийн зургийн оношлогоо", description: "Конволюцын нейрон сүлжээг ашиглан...", field: "Хиймэл оюун ухаан", status: "published", capacity: 2, taken: 1 },
  { id: 2, title: "Тэжээвэр амьтдын өвчнийг таних аппликейшн", description: "Computer vision ашиглан...", field: "Хиймэл оюун ухаан", status: "draft", capacity: 1, taken: 0 },
  { id: 3, title: "Рендеринг хурдасгах шинэ алгоритм", description: "WebGL ашиглан...", field: "Компьютер график", status: "dept_review", capacity: 1, taken: 0 },
];

const studentsPlans = [
  {
    id: 1,
    name: "Б.Батбаяр",
    title: "Эмнэлгийн зургийн оношлогоонд гүн суралцахуй",
    status: "revision_submitted", // Student resubmitted after revision
    lastUpdated: "2026-03-22",
    planData: [
      { week: 1, task: "Уран зохиолын тойм", status: "completed", fb: "" },
      { week: 2, task: "Судалгааны арга зүй", status: "completed", fb: "Сайн байна. Үргэлжлүүлээрэй." },
      { week: 3, task: "Өгөгдлийн цуглуулга", status: "in_progress", fb: "", revisionReply: "Өгөгдлийн хэмжээг 50,000 зураг байхаар засав." },
    ]
  },
  {
    id: 2,
    name: "А.Анар",
    title: "Цахим худалдааны зөвлөх систем",
    status: "submitted",
    lastUpdated: "2026-03-20",
    planData: [
      { week: 1, task: "Шаардлага тодорхойлох", status: "completed", fb: "" },
      { week: 2, task: "Архитектур гаргах", status: "pending", fb: "" },
    ]
  }
];

export default function TeacherPlanReviewTab() {
  const [subTab, setSubTab] = useState<"topics" | "plans">("topics");

  // Topics State
  const [topics, setTopics] = useState(myProposedTopics);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", field: "", capacity: 1 });

  // Plans State
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsPlans[0] | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState<"approve" | "reject" | null>(null);

  const handleSaveTopic = (status: "draft" | "dept_review") => {
    if (editingId) {
      setTopics(topics.map(t => t.id === editingId ? { ...t, ...formData, status } : t));
    } else {
      setTopics([...topics, { id: Date.now(), ...formData, status, taken: 0 }]);
    }
    setShowForm(false); setEditingId(null); setFormData({ title: "", description: "", field: "", capacity: 1 });
  };

  const handleEditTopic = (t: any) => {
    setFormData({ title: t.title, description: t.description, field: t.field, capacity: t.capacity });
    setEditingId(t.id);
    setShowForm(true);
  };

  // --- Render Functions ---
  return (
    <div className="space-y-6">
      <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
        <button onClick={() => setSubTab("topics")} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${subTab === "topics" ? "bg-white text-[#1455BD] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
          Миний дэвшүүлсэн сэдвүүд
        </button>
        <button onClick={() => setSubTab("plans")} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${subTab === "plans" ? "bg-white text-[#1455BD] shadow-sm flex items-center gap-2" : "text-slate-600 hover:text-slate-900 flex items-center gap-2"}`}>
          Оюутны төлөвлөгөө хянах
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-1.5 py-0">2</Badge>
        </button>
      </div>

      {subTab === "topics" && (
        <div className="space-y-6 animate-in fade-in">
          {!showForm ? (
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="font-semibold text-slate-800">Сэдвийн сан удирдлага</h3>
                <p className="text-sm text-slate-500">Оюутнуудад санал болгох сэдвүүдээ энд оруулна уу.</p>
              </div>
              <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" /> Шинэ сэдэв нэмэх
              </Button>
            </div>
          ) : (
            <Card className="border-slate-200 shadow-sm ring-1 ring-[#1455BD]/20 mb-6 bg-white">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1455BD]" />
                    {editingId ? "Сэдэв засварлах" : "Шинэ сэдэв дэвшүүлэх"}
                  </CardTitle>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600 p-1.5"><X className="w-4 h-4"/></button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Сэдвийн нэр</label>
                    <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Сэдвийн нэр..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Чиглэл</label>
                    <Input value={formData.field} onChange={e => setFormData({...formData, field: e.target.value})} placeholder="AI, Blockchain, Web..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Оюутны тоо (Багтаамж)</label>
                    <Input type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Тайлбар</label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Сэдвийн тухай дэлгэрэнгүй..." rows={3} />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <Button variant="outline" onClick={() => handleSaveTopic("draft")}>Ноорог хадгалах</Button>
                  <Button className="bg-[#1455BD] text-white" onClick={() => handleSaveTopic("dept_review")}>Тэнхим рүү илгээх</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map(t => (
              <Card key={t.id} className="border-slate-200 shadow-sm bg-white flex flex-col hover:border-blue-200 transition-colors">
                <CardHeader className="pb-3 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={
                      t.status === "published" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                      t.status === "dept_review" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                      "bg-slate-100 text-slate-600"
                    }>
                      {t.status === "published" ? "Батлагдсан" : t.status === "dept_review" ? "Тэнхим батлах хүлээгдэж байна" : "Ноорог"}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50/50 text-[#1455BD] border-blue-100">{t.taken}/{t.capacity} хүн</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight mb-2">{t.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{t.description}</CardDescription>
                </CardHeader>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 text-sm mt-auto">
                  <Button variant="ghost" size="sm" className="h-8 text-slate-600 hover:text-[#1455BD]" onClick={() => handleEditTopic(t)}>
                    <Edit2 className="w-4 h-4 mr-1.5" /> Засах
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-rose-600 hover:bg-rose-50" onClick={() => setTopics(topics.filter(x => x.id !== t.id))}>
                    <Trash2 className="w-4 h-4 mr-1.5" /> Устгах
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {subTab === "plans" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Left Sidebar: Students List */}
          <Card className="lg:col-span-1 border-slate-200 shadow-sm h-fit">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1455BD]" /> Төлөвлөгөө илгээсэн оюутнууд
              </CardTitle>
            </CardHeader>
            <div className="p-2 space-y-1">
              {studentsPlans.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${selectedStudent?.id === s.id ? "bg-blue-50 border border-blue-200 shadow-sm" : "hover:bg-slate-50 border border-transparent"}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-white shadow-sm">
                      <AvatarFallback className="bg-[#1455BD] text-white text-xs">{s.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${selectedStudent?.id === s.id ? "text-[#1455BD]" : "text-slate-900"}`}>{s.name}</p>
                      <p className="text-xs text-slate-500 truncate">{s.title}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 flex items-center gap-1 ${s.status === "revision_submitted" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                      {s.status === "revision_submitted" ? "Засвар ирсэн" : "Шинэ төлөвлөгөө"}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{s.lastUpdated}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Right Area: Plan Details */}
          <div className="lg:col-span-2">
            {!selectedStudent ? (
              <Card className="border-slate-200 border-dashed h-96 flex flex-col items-center justify-center bg-white">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500">Зүүн талаас оюутан сонгож төлөвлөгөөг хянах боломжтой</p>
              </Card>
            ) : (
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden animate-in fade-in">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1 uppercase tracking-tight">{selectedStudent.name}</h3>
                      <p className="text-slate-600 text-sm">{selectedStudent.title}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => setShowFeedbackModal("reject")}>
                        <XCircle className="w-4 h-4 mr-2" /> Засварт буцаах
                      </Button>
                      <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => setShowFeedbackModal("approve")}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Батлах
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                      Төлөвлөгөөг хэсэгчлэн биш, бүтнээр нь батлах эсвэл няцаах горимтой.
                    </div>
                    
                    <div className="space-y-3">
                      {selectedStudent.planData.map((task) => (
                        <div key={task.week} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden group">
                          <div className="p-4 flex gap-4">
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                              <span className="text-[10px] font-semibold text-slate-500 uppercase">Долоо</span>
                              <span className="text-lg font-bold text-slate-800 leading-none">{task.week}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800 mb-1">{task.task}</h4>
                              <p className="text-sm text-slate-600 line-clamp-2">Энэ долоо хоногт хийгдэх ажлын дэлгэрэнгүй тайлбар энд харагдана...</p>
                              
                              {task.revisionReply && (
                                <div className="mt-3 bg-amber-50/50 border border-amber-100 p-3 rounded-lg text-sm text-amber-900">
                                  <strong className="font-semibold flex items-center gap-1.5 mb-1"><AlertCircle className="w-3.5 h-3.5"/> Оюутны засварын тайлбар:</strong>
                                  {task.revisionReply}
                                </div>
                              )}
                              
                              {/* Inline Feedback Input for Teacher */}
                              <div className="mt-4 pt-3 border-t border-slate-100">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Энэ долоо хоногт өгөх санал хүсэлт</label>
                                <Textarea 
                                  placeholder="Жишээ: Арга зүйг илүү тодорхой болгоно уу..." 
                                  className="text-sm min-h-[60px] resize-none border-slate-200 focus:border-[#1455BD]"
                                  value={feedbacks[task.week] || ""}
                                  onChange={(e) => setFeedbacks({...feedbacks, [task.week]: e.target.value})}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <Dialog open={!!showFeedbackModal} onClose={() => setShowFeedbackModal(null)}>
        <DialogHeader 
          title={showFeedbackModal === "approve" ? "Төлөвлөгөө батлах" : "Засварт буцаах"} 
          icon={showFeedbackModal === "approve" ? <CheckCircle2 className="w-5 h-5 text-[#1455BD]" /> : <AlertCircle className="w-5 h-5 text-rose-600" />} 
          onClose={() => setShowFeedbackModal(null)} 
        />
        <DialogBody>
          {showFeedbackModal === "approve" ? (
            <p className="text-slate-600">
              Та <strong>{selectedStudent?.name}</strong> оюутны 15 долоо хоногийн төлөвлөгөөг батлах гэж байна. Баталсны дараа тэнхимийн эрхлэгч рүү баталгаажуулалтад шилжих болно.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600">
                Та <strong>{selectedStudent?.name}</strong> оюутны төлөвлөгөөг буцаах гэж байна. Оюутанд очих ерөнхий санал хүсэлтээ доор бичнэ үү. (Мөн долоо хоног тус бүр дээр бичсэн тайлбарууд хавсрагдана).
              </p>
              <Textarea placeholder="Ерөнхий санал хүсэлт..." rows={3} className="text-sm" />
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowFeedbackModal(null)}>Цуцлах</Button>
          <Button 
            className={showFeedbackModal === "approve" ? "bg-[#1455BD] hover:bg-[#0d3a8a] text-white" : "bg-rose-600 hover:bg-rose-700 text-white"} 
            onClick={() => { setSelectedStudent(null); setShowFeedbackModal(null); }}
          >
            {showFeedbackModal === "approve" ? "Батлах" : "Буцаах"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
