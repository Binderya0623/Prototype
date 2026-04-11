import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "../../../components/ui/dialog";
import {
  CheckCircle2, Clock, Send, Plus, Edit2, Trash2, Save, CalendarDays, Lock, RefreshCw, ChevronDown, ChevronUp, AlertCircle, MessageSquare
} from "lucide-react";

type TaskStatus = "pending" | "in_progress" | "completed" | "delayed";
type PlanStatus = "draft" | "submitted" | "revision" | "teacher_approved" | "department_approved";

interface WeekTask {
  id: number;
  week: number;
  startDate: string;
  task: string;
  description: string;
  status: TaskStatus;
}

const taskStatusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Хийгдэх", color: "bg-slate-100 text-slate-600 border-slate-200", icon: Clock },
  in_progress: { label: "Хийгдэж байна", color: "bg-blue-50 text-[#1455BD] border-blue-200", icon: RefreshCw },
  completed: { label: "Дуусгасан", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  delayed: { label: "Хоцорсон", color: "bg-rose-50 text-rose-600 border-rose-200", icon: AlertCircle },
};

const planStatusConfig: Record<PlanStatus, { label: string; color: string; alert?: string }> = {
  draft: { label: "Ноорог", color: "bg-slate-100 text-slate-600" },
  submitted: { label: "Илгээсэн", color: "bg-blue-50 text-[#1455BD]" },
  revision: { label: "Засвар шаардлагатай", color: "bg-orange-50 text-orange-700", alert: "Багш засвар шаардсан байна. Доорх долоо хоногуудыг шалгана уу." },
  teacher_approved: { label: "Багш баталсан", color: "bg-emerald-50 text-emerald-700" },
  department_approved: { label: "Тэнхим баталсан (Эцсийн)", color: "bg-emerald-100 text-emerald-800" },
};

const weeks = Array.from({ length: 15 }, (_, i) => i + 1);
const weekStartDates: Record<number, string> = {
  1: "2026-02-16", 2: "2026-02-23", 3: "2026-03-02", 4: "2026-03-09",
  5: "2026-03-16", 6: "2026-03-23", 7: "2026-03-30", 8: "2026-04-06",
  9: "2026-04-13", 10: "2026-04-20", 11: "2026-04-27", 12: "2026-05-04",
  13: "2026-05-11", 14: "2026-05-18", 15: "2026-05-25",
};

const initialTasks: WeekTask[] = [
  { id: 1, week: 1, startDate: weekStartDates[1], task: "Уран зохиолын тойм", description: "Холбогдох номзүй, нийтлэлүүдийг унших, цуглуулах", status: "completed" },
  { id: 2, week: 2, startDate: weekStartDates[2], task: "Судалгааны арга зүй тодорхойлох", description: "Судалгааны арга барилыг боловсруулж, судалгааны загвар гаргах", status: "completed" },
  { id: 3, week: 3, startDate: weekStartDates[3], task: "Өгөгдлийн цуглуулга", description: "Судалгааны өгөгдлийг цуглуулж, цэвэрлэн бэлдэх", status: "in_progress" },
  { id: 4, week: 4, startDate: weekStartDates[4], task: "Загварын суурь бүтэц боловсруулах", description: "ML загварын анхны бүтцийг кодлох", status: "pending" },
];

const mockFeedback = [
  { week: 3, comment: "Өгөгдлийн цуглуулгын аргачлалыг тодорхой болгоно уу. Хэдэн өгөгдлийн цэг цуглуулж байна?", needsRevision: true },
  { week: 4, comment: "Загварын бүтцийг илүү дэлгэрэнгүй тайлбарлана уу.", needsRevision: true },
];

export default function StudentWeeklyPlanTab() {
  const [tasks, setTasks] = useState<WeekTask[]>(initialTasks);
  const [planStatus, setPlanStatus] = useState<PlanStatus>("draft");
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  
  const [editingTask, setEditingTask] = useState<Partial<WeekTask> & { week?: number } | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const [formData, setFormData] = useState({ task: "", description: "", status: "pending" as TaskStatus });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Revision
  const [revisionNotes, setRevisionNotes] = useState<Record<number, string>>({});
  const [activeFeedbackWeek, setActiveFeedbackWeek] = useState<number | null>(null);
  const [showRevisionSubmitModal, setShowRevisionSubmitModal] = useState(false);

  const toggleWeek = (week: number) => {
    const next = new Set(expandedWeeks);
    if (next.has(week)) next.delete(week);
    else next.add(week);
    setExpandedWeeks(next);
  };

  const validateTask = () => {
    const e: Record<string, string> = {};
    if (!formData.task.trim()) e.task = "Ажлын нэр оруулна уу";
    if (!formData.description.trim()) e.description = "Ажлын тайлбар оруулна уу";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveTask = () => {
    if (!selectedWeek || !validateTask()) return;
    if (editingTask?.id) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...formData } : t)));
    } else {
      setTasks([...tasks, { id: Date.now(), week: selectedWeek, startDate: weekStartDates[selectedWeek], ...formData }]);
    }
    setFormData({ task: "", description: "", status: "pending" });
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  const isLocked = planStatus === "submitted" || planStatus === "teacher_approved" || planStatus === "department_approved";

  // Check if topic is approved (mock logic: true for demonstration)
  const isTopicApproved = true;

  if (!isTopicApproved) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <Lock className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-800">Үечилсэн төлөвлөгөө түгжигдсэн байна</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-2">Таны сэдэв хараахан батлагдаагүй байна. Дараагийн шатанд үргэлжлүүлэхийн тулд сэдвээ батлуулна уу.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm bg-slate-50 relative overflow-hidden">
      <CardHeader className="bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between pb-4 gap-4 sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <CardTitle className="text-xl">15 долоо хоногийн төлөвлөгөө</CardTitle>
            <Badge variant="outline" className={`px-2.5 py-0.5 border ${planStatusConfig[planStatus].color} font-medium`}>
              {planStatusConfig[planStatus].label}
            </Badge>
          </div>
          <CardDescription>Дипломын ажлын хүрээнд 15 долоо хоногийн турш хийгдэх ажлын төлөвлөгөө</CardDescription>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-white font-medium" onClick={() => setPlanStatus(prev => prev === "draft" ? "revision" : "draft")}>
            <RefreshCw className="w-4 h-4 mr-2" /> (Стэтус солих)
          </Button>
          {!isLocked && planStatus !== "revision" && (
            <Button
              className="flex-1 md:flex-none bg-[#1455BD] hover:bg-[#0d3a8a] text-white shadow-sm"
              onClick={() => setShowSubmitModal(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Багш руу илгээх
            </Button>
          )}
          {!isLocked && planStatus === "revision" && (
            <Button
              className="flex-1 md:flex-none bg-[#1455BD] hover:bg-[#0d3a8a] text-white shadow-sm"
              onClick={() => setShowRevisionSubmitModal(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Засварыг дахин илгээх
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-4 md:p-6 bg-slate-50 min-h-[500px]">
          {planStatus === "revision" && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 leading-none mb-1">Засвар шаардлагатай</h4>
                <p className="text-sm text-orange-800">{planStatusConfig.revision.alert}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {weeks.map((week) => {
              const weekTasks = tasks.filter((t) => t.week === week);
              const isExpanded = expandedWeeks.has(week);
              const fb = mockFeedback.find((f) => f.week === week);
              const hasFeedback = planStatus === "revision" && fb;

              return (
                <div key={week} className={`border rounded-xl transition-all shadow-sm ${hasFeedback ? "border-orange-300 ring-2 ring-orange-100" : isExpanded ? "border-slate-300 bg-white" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                  {/* Header Row */}
                  <div
                    className="flex flex-wrap items-center justify-between p-3 sm:p-4 cursor-pointer gap-2"
                    onClick={() => toggleWeek(week)}
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold shrink-0">
                        {week}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-800 truncate">Долоо хоног {week}</h4>
                          {hasFeedback && (
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 px-1.5 py-0 text-[10px] hidden sm:inline-flex">
                              Засвар шаардлагатай
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                          <CalendarDays className="inline w-3 h-3 mr-1" />
                          Эхлэх {weekStartDates[week]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t border-slate-100 pt-2 sm:pt-0 sm:border-t-0">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 text-xs hidden sm:inline-flex">
                          {weekTasks.length} ажил
                        </Badge>
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-slate-400 mx-1" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[#1455BD] bg-blue-50/50 hover:bg-blue-100 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWeek(week);
                              setFormData({ task: "", description: "", status: "pending" });
                              setEditingTask(null);
                              setShowTaskForm(true);
                              setExpandedWeeks(new Set([...expandedWeeks, week]));
                            }}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Ажил нэмэх
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Body Component for Tasks and Form */}
                  {isExpanded && (
                    <div className="p-3 sm:p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-xl space-y-4">
                      {hasFeedback && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-orange-100/50 px-3 py-2 border-b border-orange-200 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-semibold text-orange-800">Багшийн санал хүсэлт</span>
                          </div>
                          <div className="p-3">
                            <p className="text-sm text-orange-900 leading-relaxed">{fb.comment}</p>
                            
                            <div className="mt-3 relative">
                              <Textarea
                                placeholder="Засварын тайлбар бичих эсвэл хариу барих..."
                                className="text-sm border-orange-200 bg-white placeholder:text-orange-300 focus:ring-orange-200"
                                value={revisionNotes[week] || ""}
                                onChange={(e) => setRevisionNotes({...revisionNotes, [week]: e.target.value})}
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {showTaskForm && selectedWeek === week && !isLocked && (
                        <Card className="border-slate-300 shadow-md ring-1 ring-[#1455BD]/20 translate-y-[-2px] transition-transform">
                          <CardHeader className="py-3 px-4 bg-slate-50/80 border-b border-slate-100 rounded-t-lg">
                            <CardTitle className="text-sm flex items-center gap-2 text-[#1455BD]">
                              <Edit2 className="w-4 h-4" />
                              {editingTask ? "Ажил засах" : "Шинэ ажил нэмэх"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-4">
                            <div>
                              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Ажлын нэр</label>
                              <Input
                                value={formData.task}
                                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                                placeholder="Жишээ: Өгөгдөл цуглуулах..."
                                className={errors.task ? "border-rose-300 focus:ring-rose-200" : ""}
                              />
                              {errors.task && <p className="text-xs text-rose-500 mt-1">{errors.task}</p>}
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Тайлбар ба үр дүн</label>
                              <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Тухайн ажилд хийгдэх алхмууд болон хүлээгдэж буй үр дүн..."
                                rows={3}
                                className={`resize-none ${errors.description ? "border-rose-300 focus:ring-rose-200" : ""}`}
                              />
                              {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                            </div>
                            {editingTask && (
                              <div>
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Төлөв (Тайлагнах зорилгоор)</label>
                                <select
                                  className="w-full h-10 px-3 py-2 text-sm bg-white border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-[#1455BD]/20 focus:border-[#1455BD]"
                                  value={formData.status}
                                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                                >
                                  <option value="pending">Хийгдэх</option>
                                  <option value="in_progress">Хийгдэж байна</option>
                                  <option value="completed">Дуусгасан</option>
                                  <option value="delayed">Хоцорсон</option>
                                </select>
                              </div>
                            )}
                            <div className="flex gap-2 justify-end pt-2">
                              <Button variant="outline" size="sm" onClick={() => { setShowTaskForm(false); setEditingTask(null); }}>Цуцлах</Button>
                              <Button size="sm" className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={handleSaveTask}>
                                <Save className="w-4 h-4 mr-2" /> Хадгалах
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {weekTasks.length === 0 ? (
                        !showTaskForm && (
                          <div className="text-center py-6 bg-white rounded-lg border border-slate-200 border-dashed">
                            <p className="text-slate-500 text-sm">Энэ долоо хоногт ажил төлөвлөөгүй байна.</p>
                          </div>
                        )
                      ) : (
                        <div className="space-y-3">
                          {weekTasks.map((t) => {
                            const TIcon = taskStatusConfig[t.status].icon;
                            return (
                              <div key={t.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h5 className="font-bold text-slate-800 leading-tight">{t.task}</h5>
                                      <Badge variant="outline" className={`py-0.5 px-2 font-medium flex-nowrap shrink-0 ml-auto sm:ml-0 ${taskStatusConfig[t.status].color}`}>
                                        <TIcon className="w-3 h-3 mr-1" />
                                        {taskStatusConfig[t.status].label}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-2 rounded-md border border-slate-100">{t.description}</p>
                                  </div>
                                  {!isLocked && (
                                    <div className="flex items-start gap-1 justify-end shrink-0 sm:border-l sm:border-slate-100 pl-3">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-slate-500 hover:text-[#1455BD] hover:bg-blue-50"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedWeek(week);
                                          setFormData({ task: t.task, description: t.description, status: t.status });
                                          setEditingTask(t);
                                          setShowTaskForm(true);
                                        }}
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                        onClick={() => setDeleteConfirm(t.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>

      {/* Confirmation Modals */}
      <Dialog open={showSubmitModal} onClose={() => setShowSubmitModal(false)}>
        <DialogHeader title="Төлөвлөгөө илгээх" icon={<Send className="w-5 h-5 text-[#1455BD]" />} onClose={() => setShowSubmitModal(false)} />
        <DialogBody>
          <p className="text-slate-600">Та 15 долоо хоногийн төлөвлөгөөгөө багш руу илгээхдээ итгэлтэй байна уу?</p>
          <div className="bg-blue-50 text-slate-700 text-sm p-3 rounded-lg mt-4 border border-blue-100 font-medium">
            Илгээсний дараа багш хариу өгөх хүртэл та төлөвлөгөөнд өөрчлөлт оруулах боломжгүй болно.
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSubmitModal(false)}>Цуцлах</Button>
          <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => { setPlanStatus("submitted"); setShowSubmitModal(false); }}>Илгээх</Button>
        </DialogFooter>
      </Dialog>
      
      <Dialog open={showRevisionSubmitModal} onClose={() => setShowRevisionSubmitModal(false)}>
        <DialogHeader title="Засварыг дахин илгээх" icon={<Send className="w-5 h-5 text-orange-600" />} onClose={() => setShowRevisionSubmitModal(false)} />
        <DialogBody>
          <p className="text-slate-600">Та засварласан төлөвлөгөө болон засварын хариугаа батлуулахаар илгээх гэж байна.</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowRevisionSubmitModal(false)}>Цуцлах</Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => { setPlanStatus("submitted"); setShowRevisionSubmitModal(false); }}>Засварыг илгээх</Button>
        </DialogFooter>
      </Dialog>
      
      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <DialogHeader title="Ажил устгах" icon={<AlertCircle className="w-6 h-6 text-rose-600" />} onClose={() => setDeleteConfirm(null)} />
        <DialogBody>
          <p className="text-slate-600">Энэ үйлдлийг буцаах боломжгүй. Ажлыг устгахдаа итгэлтэй байна уу?</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Цуцлах</Button>
          <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={() => { if (deleteConfirm) handleDeleteTask(deleteConfirm); }}>Устгах</Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}
