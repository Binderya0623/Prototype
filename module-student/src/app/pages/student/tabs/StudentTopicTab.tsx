import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "../../../components/ui/dialog";
import {
  Search, Filter, BookOpen, ChevronRight, X,
  CheckCircle2, Clock, XCircle, Send, Edit2, Trash2, Tag, Plus, FileText, AlertCircle
} from "lucide-react";

// --- MOCK DATA ---
const availableTopics = [
  {
    id: 1,
    title: "Гүн суралцахуйн аргаар эмнэлгийн зургийн оношлогоо",
    description: "Конволюцын нейрон сүлжээг ашиглан эмнэлгийн зургийн оношлогооны нарийвчлалыг дэвшилтэт аргаар сайжруулах судалгаа.",
    teacher: "Д.Сувдаа",
    department: "Компьютерын ухаан",
    field: "Хиймэл оюун ухаан",
    capacity: 2,
    taken: 1,
    keywords: ["CNN", "Deep Learning", "Medical AI"],
  },
  {
    id: 2,
    title: "Блокчэйн технологи дээр суурилсан оюутны бүртгэлийн систем",
    description: "Оюутны академик бүртгэл, итгэмжлэлийг блокчэйн ашиглан аюулгүй, тунгалаг хадгалах систем.",
    teacher: "Б.Батням",
    department: "Мэдээллийн технологи",
    field: "Блокчэйн",
    capacity: 1,
    taken: 0,
    keywords: ["Blockchain", "Smart Contract", "Ethereum"],
  },
];

interface RequestedTopic {
  topicId: number;
  status: "pending" | "dept_review" | "approved" | "rejected";
  submittedDate: string;
}

interface TopicProposal {
  id: number;
  title: string;
  description: string;
  goal: string;
  keywords: string;
  status: "draft" | "pending" | "dept_review" | "approved" | "rejected";
  submittedDate?: string;
}

const initialProposals: TopicProposal[] = [
  {
    id: 1,
    title: "Монгол хэлний дуу таних систем",
    description: "Монгол хэлний ярианы мэдрэх, таних тогтолцоо боловсруулах.",
    goal: "Монгол хэлний ярианы таних нарийвчлалыг дэвшилтэт ML аргаар сайжруулах.",
    keywords: "Speech Recognition, NLP, Mongolian",
    status: "dept_review",
    submittedDate: "2026-03-18",
  },
];

const reqStatusConfig: Record<string, { label: string, color: string, icon: any }> = {
  pending: { label: "Багш хянаж байна", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  dept_review: { label: "Тэнхим хяналтанд", color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
  approved: { label: "Батлагдсан", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  rejected: { label: "Татгалзсан", color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
};

const proposalStatusConfig: Record<string, { label: string, color: string, icon: any }> = {
  draft: { label: "Ноорог", color: "bg-slate-100 text-slate-600 border-slate-200", icon: FileText },
  pending: { label: "Багш хянаж байна", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  dept_review: { label: "Тэнхим хяналтанд", color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
  approved: { label: "Батлагдсан", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  rejected: { label: "Татгалзсан", color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
};

export default function StudentTopicTab() {
  const [subTab, setSubTab] = useState<"all" | "my" | "propose">("all");

  // All Topics State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("Бүгд");
  const [selectedTopic, setSelectedTopic] = useState<typeof availableTopics[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [requestedTopics, setRequestedTopics] = useState<RequestedTopic[]>([{ topicId: 1, status: "pending", submittedDate: "2026-03-22" }]);

  // Propose Topic State
  const [proposals, setProposals] = useState<TopicProposal[]>(initialProposals);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", goal: "", keywords: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = ["Бүгд", "Хиймэл оюун ухаан", "Блокчэйн", "NLP"];
  const filteredTopics = availableTopics.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField = selectedField === "Бүгд" || t.field === selectedField;
    return matchesSearch && matchesField;
  });

  const handleRequestConfirm = () => {
    if (selectedTopic) {
      setRequestedTopics([...requestedTopics, { topicId: selectedTopic.id, status: "pending", submittedDate: new Date().toISOString().split("T")[0] }]);
      setShowModal(false);
      setSubTab("my");
    }
  };

  // Propose Form Handlers
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Сэдвийн нэр заавал оруулна уу";
    if (!formData.description.trim()) newErrors.description = "Тайлбар заавал оруулна уу";
    if (!formData.goal.trim()) newErrors.goal = "Судалгааны зорилго заавал оруулна уу";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const resetForm = () => { setFormData({ title: "", description: "", goal: "", keywords: "" }); setErrors({}); setShowForm(false); setEditingId(null); };
  const handleSubmitProposal = (mode: "draft" | "submit") => {
    if (mode === "submit" && !validate()) return;
    if (mode === "draft" && !formData.title.trim()) { setErrors({ title: "Ноорог хадгалахын тулд сэдвийн нэр оруулна уу" }); return; }
    
    const newProposal = {
      id: editingId || Date.now(),
      ...formData,
      status: mode === "draft" ? "draft" as const : "pending" as const,
      submittedDate: mode === "submit" ? new Date().toISOString().split("T")[0] : undefined,
    };

    if (editingId) setProposals(proposals.map(p => p.id === editingId ? newProposal : p));
    else setProposals([...proposals, newProposal]);
    resetForm();
    setSubTab("propose");
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
        <button onClick={() => setSubTab("all")} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${subTab === "all" ? "bg-white text-[#1455BD] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
          Бүх сэдвүүд
        </button>
        <button onClick={() => setSubTab("my")} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${subTab === "my" ? "bg-white text-[#1455BD] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
          Миний сэдэв
        </button>
        <button onClick={() => setSubTab("propose")} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${subTab === "propose" ? "bg-white text-[#1455BD] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
          Сэдэв дэвшүүлэх
        </button>
      </div>

      {subTab === "all" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input placeholder="Сэдэв, багшийн нэрээр хайх..." className="pl-10 text-base py-5 border-slate-200 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {fields.map((field) => (
                <Button key={field} variant={selectedField === field ? "default" : "outline"} className={`shrink-0 ${selectedField === field ? "bg-[#1455BD] hover:bg-[#0d3a8a] text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`} onClick={() => setSelectedField(field)}>
                  {field === "Бүгд" && <Filter className="w-4 h-4 mr-2" />}
                  {field}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const hasRequested = requestedTopics.some(r => r.topicId === topic.id);
              const isFull = topic.taken >= topic.capacity;
              return (
                <Card key={topic.id} className="group border-slate-200 shadow-sm hover:shadow-md hover:border-[#1455BD]/30 transition-all flex flex-col h-full bg-white">
                  <CardHeader className="pb-3 border-b border-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-blue-50/50 text-[#1455BD] border-blue-200/50 font-medium">{topic.field}</Badge>
                      <Badge variant="outline" className={isFull ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}>
                        {topic.taken}/{topic.capacity} хүн
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight text-slate-900 group-hover:text-[#1455BD] transition-colors line-clamp-2">{topic.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-2 text-slate-600 font-medium">
                      Удирдагч: {topic.teacher}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">{topic.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {topic.keywords.map(kw => (
                          <span key={kw} className="text-[11px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md font-medium">{kw}</span>
                        ))}
                      </div>
                    </div>
                    <Button
                      className={`w-full font-medium ${hasRequested ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : isFull ? "bg-slate-100 text-slate-400 cursor-not-allowed hidden" : "bg-white text-[#1455BD] border-2 border-[#1455BD] hover:bg-[#1455BD] hover:text-white"}`}
                      variant={hasRequested ? "secondary" : isFull ? "ghost" : "outline"}
                      disabled={hasRequested || isFull}
                      onClick={() => { setSelectedTopic(topic); setShowModal(true); }}
                    >
                      {hasRequested ? "Хүсэлт илгээсэн" : isFull ? "Дүүрсэн" : "Хүсэлт илгээх"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Dialog open={showModal} onClose={() => setShowModal(false)}>
            <DialogHeader title="Сэдэв сонгох хүсэлт илгээх" icon={<BookOpen className="w-5 h-5 text-[#1455BD]" />} onClose={() => setShowModal(false)} />
            <DialogBody>
              <p className="text-slate-600 leading-relaxed">
                Та <strong className="text-slate-900 font-semibold">{selectedTopic?.title}</strong> сэдвийг сонгох хүсэлт илгээхдээ итгэлтэй байна уу?
              </p>
              <div className="bg-amber-50 rounded-lg p-3 mt-4 border border-amber-100">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Анхаарах:</span> Багш хүсэлтийг баталгаажуулсны дараа таны сэдэв албан ёсоор батлагдах болно.
                </p>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)} className="border-slate-300">Цуцлах</Button>
              <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={handleRequestConfirm}>Хүсэлт илгээх</Button>
            </DialogFooter>
          </Dialog>
        </div>
      )}

      {subTab === "my" && (
        <div className="space-y-4 animate-in fade-in">
          {requestedTopics.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Сэдэв сонгоогүй байна</h3>
              <p className="text-slate-500 mt-2">Та "Бүх сэдвүүд" хэсгээс сэдэв сонгох эсвэл шинэ сэдэв дэвшүүлнэ үү.</p>
              <Button className="mt-6 bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => setSubTab("all")}>Сэдэв хайх</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {requestedTopics.map((req, idx) => {
                const topicDetails = availableTopics.find(t => t.id === req.topicId);
                const statusInfo = reqStatusConfig[req.status];
                const Icon = statusInfo.icon;
                return (
                  <Card key={idx} className="border-slate-200 shadow-sm bg-white overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-slate-500 font-medium">Хүсэлт илгээсэн: {req.submittedDate}</span>
                          <Badge variant="outline" className={`px-3 py-1 font-medium flex items-center gap-1.5 ${statusInfo.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{topicDetails?.title}</h3>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed max-w-3xl">{topicDetails?.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Удирдагч</p>
                            <p className="text-sm font-medium text-slate-900">{topicDetails?.teacher}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Чиглэл</p>
                            <p className="text-sm font-medium text-slate-900">{topicDetails?.field}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Түлхүүр үгс</p>
                            <div className="flex gap-2">
                              {topicDetails?.keywords.map(kw => (
                                <span key={kw} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">{kw}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-6 md:w-64 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center items-center text-center">
                        {req.status === "approved" ? (
                          <>
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">Зөвшөөрөгдсөн</h4>
                            <p className="text-xs text-slate-500 mb-4 px-2">Таны сэдэв батлагдсан тул одоо үечилсэн төлөвлөгөө гаргах боломжтой боллоо.</p>
                          </>
                        ) : req.status === "rejected" ? (
                          <>
                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                              <XCircle className="w-6 h-6 text-rose-600" />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">Татгалзсан</h4>
                            <p className="text-xs text-slate-500 px-2">Багш эсвэл тэнхим энэ сэдвийг батлахаас татгалзлаа. Өөр сэдэв сонгоно уу.</p>
                          </>
                        ) : req.status === "dept_review" ? (
                          <>
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                              <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">Тэнхим хянаж байна</h4>
                            <p className="text-xs text-slate-500 px-2">Багш зөвшөөрсөн, одоо тэнхимийн баталгаажуулалт хүлээгдэж байна.</p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                              <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">Багш хянаж байна</h4>
                            <p className="text-xs text-slate-500 px-2">Таны хүсэлтийг зохих багш шалгаж байна. Хариу иртэл хүлээнэ үү.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {subTab === "propose" && (
        <div className="space-y-6 animate-in fade-in">
          {!showForm && (
            <div className="flex justify-end mb-4">
              <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" /> Шинэ сэдэв дэвшүүлэх
              </Button>
            </div>
          )}

          {showForm && (
            <Card className="border-slate-200 shadow-sm ring-1 ring-[#1455BD]/20 mb-6 bg-white">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1455BD]" />
                    {editingId ? "Сэдэв засварлах" : "Шинэ сэдэв дэвшүүлэх"}
                  </CardTitle>
                  <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1.5"><X className="w-4 h-4"/></button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Сэдвийн нэр *</label>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Жишээ: Монгол хэлний дуу таних систем..." className={`border-slate-300 ${errors.title ? 'border-rose-300 ring-rose-100 focus:ring-rose-200' : ''}`} />
                  {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Сэдвийн тайлбар *</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Сэдвийн тухай дэлгэрэнгүй тайлбар..." rows={4} className={`border-slate-300 resize-none ${errors.description ? 'border-rose-300' : ''}`} />
                  {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Судалгааны зорилго *</label>
                  <Input value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})} placeholder="Энэхүү судалгаагаар ямар үр дүнд хүрэх вэ?" className={`border-slate-300 ${errors.goal ? 'border-rose-300' : ''}`} />
                  {errors.goal && <p className="text-xs text-rose-500 mt-1">{errors.goal}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Түлхүүр үгс <span className="text-slate-400 font-normal">(Таслалаар тусгаарлах)</span></label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="NLP, Speech Recognition, AI..." className="pl-9 border-slate-300" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <Button variant="outline" onClick={() => handleSubmitProposal("draft")}>Ноорог хадгалах</Button>
                  <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => handleSubmitProposal("submit")}>
                    <Send className="w-4 h-4 mr-2" /> Илгээх
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {proposals.length === 0 && !showForm ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500">Та одоогоор өөрийн сэдэв дэвшүүлээгүй байна.</p>
              </div>
            ) : (
              proposals.map((p) => {
                const s = proposalStatusConfig[p.status];
                const Icon = s.icon;
                return (
                  <Card key={p.id} className="border-slate-200 shadow-sm bg-white overflow-hidden">
                    <div className="flex flex-col sm:flex-row shadow-sm">
                      <div className="flex-1 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className={`font-medium py-1 px-3 flex items-center gap-1.5 ${s.color}`}>
                            <Icon className="w-3.5 h-3.5" /> {s.label}
                          </Badge>
                          <div className="text-xs text-slate-500 font-medium">{p.submittedDate ? `Илгээсэн: ${p.submittedDate}` : "Ноорог"}</div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-600 mb-4">{p.description}</p>
                        <div className="bg-slate-50 rounded-lg p-3 text-sm border border-slate-100">
                          <span className="font-semibold text-slate-700">Зорилго:</span> {p.goal}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 border-t sm:border-t-0 sm:border-l border-slate-100 flex sm:flex-col items-center justify-center gap-2">
                        {(p.status === "draft" || p.status === "rejected") && (
                          <>
                            <Button variant="outline" size="sm" className="w-full sm:w-28 text-slate-600 hover:text-[#1455BD]" onClick={() => { setFormData({title: p.title, description: p.description, goal: p.goal, keywords: p.keywords}); setEditingId(p.id); setShowForm(true); }}>
                              <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Засах
                            </Button>
                            <Button variant="outline" size="sm" className="w-full sm:w-28 text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => setProposals(proposals.filter(x => x.id !== p.id))}>
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Устгах
                            </Button>
                          </>
                        )}
                        {p.status === "pending" && (
                          <div className="text-center px-4 py-3">
                            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1.5 opacity-50" />
                            <p className="text-xs text-slate-500">Багш хянаж байна</p>
                          </div>
                        )}
                        {p.status === "dept_review" && (
                          <div className="text-center px-4 py-3">
                            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-1.5 opacity-50" />
                            <p className="text-xs text-slate-500">Тэнхим хянаж байна</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
