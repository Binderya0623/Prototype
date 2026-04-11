import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Dialog, DialogHeader, DialogBody, DialogFooter, ConfirmDialog } from "../../components/ui/dialog";
import {
  Plus, Edit2, Trash2, Send, Clock, CheckCircle2, AlertCircle,
  Save, CalendarDays, Lock, RefreshCw, ChevronDown, ChevronUp
} from "lucide-react";

type TaskStatus = "pending" | "in_progress" | "completed" | "delayed";
type PlanStatus = "draft" | "submitted" | "revision" | "approved";

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

const planStatusConfig: Record<PlanStatus, { label: string; color: string }> = {
  draft: { label: "Ноорог", color: "bg-slate-100 text-slate-600" },
  submitted: { label: "Илгээсэн", color: "bg-amber-50 text-amber-700" },
  revision: { label: "Засвар шаардлагатай", color: "bg-orange-50 text-orange-700" },
  approved: { label: "Батлагдсан", color: "bg-emerald-50 text-emerald-700" },
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

export default function StudentWeeklyPlan() {
  const [tasks, setTasks] = useState<WeekTask[]>(initialTasks);
  const [planStatus, setPlanStatus] = useState<PlanStatus>("draft");
  const [editingTask, setEditingTask] = useState<Partial<WeekTask> & { week?: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  const [formData, setFormData] = useState({ task: "", description: "", status: "pending" as TaskStatus });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLocked = planStatus === "approved";

  const toggleWeek = (week: number) => {
    const next = new Set(expandedWeeks);
    next.has(week) ? next.delete(week) : next.add(week);
    setExpandedWeeks(next);
  };

  const getTasksForWeek = (week: number) => tasks.filter((t) => t.week === week);

  const openAddForm = (week: number) => {
    setSelectedWeek(week);
    setEditingTask(null);
    setFormData({ task: "", description: "", status: "pending" });
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (t: WeekTask) => {
    setSelectedWeek(t.week);
    setEditingTask(t);
    setFormData({ task: t.task, description: t.description, status: t.status });
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.task.trim()) e.task = "Хийх ажлыг оруулна уу";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveTask = () => {
    if (!validate()) return;
    if (editingTask && editingTask.id) {
      setTasks(tasks.map((t) => t.id === editingTask.id ? { ...t, ...formData } : t));
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        week: selectedWeek!,
        startDate: weekStartDates[selectedWeek!],
        ...formData,
      }]);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  const handleSubmitPlan = () => {
    setPlanStatus("submitted");
    setShowSubmitModal(false);
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">15 Долоо хоногийн төлөвлөгөө</h1>
          <p className="text-slate-500 text-sm mt-1">Судалгааны ажлын үечилсэн төлөвлөгөө</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-sm px-3 py-1 ${planStatusConfig[planStatus].color}`}>
            {planStatusConfig[planStatus].label}
          </Badge>
          {!isLocked && planStatus === "draft" && (
            <Button
              className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white"
              onClick={() => setShowSubmitModal(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Төлөвлөгөө илгээх
            </Button>
          )}
          {isLocked && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Lock className="w-4 h-4" />
              Батлагдсан — засварлах боломжгүй
            </div>
          )}
        </div>
      </div>

      {/* Summary card */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-blue-50 to-white">
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#1455BD]">15</p>
              <p className="text-xs text-slate-500 mt-1">Нийт долоо хоног</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">{totalCount}</p>
              <p className="text-xs text-slate-500 mt-1">Нийт ажил</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
              <p className="text-xs text-slate-500 mt-1">Дуусгасан</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{tasks.filter(t => t.status === "in_progress").length}</p>
              <p className="text-xs text-slate-500 mt-1">Хийгдэж байна</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose-500">{tasks.filter(t => t.status === "delayed").length}</p>
              <p className="text-xs text-slate-500 mt-1">Хоцорсон</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-3">
        {weeks.map((week) => {
          const weekTasks = getTasksForWeek(week);
          const isExpanded = expandedWeeks.has(week);
          const hasTasks = weekTasks.length > 0;
          const hasCompleted = weekTasks.every((t) => t.status === "completed") && hasTasks;

          return (
            <Card key={week} className={`border-slate-200 shadow-sm transition-all ${hasCompleted ? "border-l-4 border-l-emerald-400" : hasTasks ? "border-l-4 border-l-[#1455BD]" : "border-l-4 border-l-slate-200"}`}>
              <button
                className="w-full text-left"
                onClick={() => toggleWeek(week)}
              >
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                        hasCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        hasTasks ? "bg-blue-50 text-[#1455BD] border-blue-200" :
                        "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        {week}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {week}-р долоо хоног
                          <span className="ml-2 font-normal text-slate-400 text-xs flex items-center gap-1 inline-flex">
                            <CalendarDays className="w-3 h-3" />
                            {weekStartDates[week]}
                          </span>
                        </p>
                        <p className="text-xs text-slate-400">{hasTasks ? `${weekTasks.length} ажил` : "Ажил нэмэгдээгүй"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {weekTasks.map((t) => {
                        const cfg = taskStatusConfig[t.status];
                        return <Badge key={t.id} className={`text-[10px] border ${cfg.color}`}>{cfg.label}</Badge>;
                      })}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                </CardHeader>
              </button>

              {isExpanded && (
                <CardContent className="pt-0 px-5 pb-4">
                  {weekTasks.length === 0 ? (
                    <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <p className="text-sm text-slate-400">Энэ долоо хоногт ажил байхгүй</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-3">
                      {weekTasks.map((t) => {
                        const StatusIcon = taskStatusConfig[t.status].icon;
                        return (
                          <div key={t.id} className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl bg-white hover:border-slate-200 hover:shadow-sm transition-all">
                            <StatusIcon className={`w-4 h-4 mt-0.5 shrink-0 ${
                              t.status === "completed" ? "text-emerald-500" : t.status === "delayed" ? "text-rose-500" : t.status === "in_progress" ? "text-[#1455BD]" : "text-slate-400"
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-slate-900">{t.task}</p>
                              {t.description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.description}</p>}
                            </div>
                            {!isLocked && (
                              <div className="flex items-center gap-1 shrink-0">
                                <select
                                  value={t.status}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setTasks(tasks.map((tk) => tk.id === t.id ? { ...tk, status: e.target.value as TaskStatus } : tk));
                                  }}
                                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:border-[#1455BD]"
                                >
                                  {Object.entries(taskStatusConfig).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                  ))}
                                </select>
                                <Button
                                  variant="ghost" size="sm"
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-[#1455BD]"
                                  onClick={(e) => { e.stopPropagation(); openEditForm(t); }}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost" size="sm"
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-rose-500"
                                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm(t.id); }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!isLocked && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-slate-300 text-slate-500 hover:border-[#1455BD] hover:text-[#1455BD]"
                      onClick={(e) => { e.stopPropagation(); openAddForm(week); }}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Ажил нэмэх
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Task Modal */}
      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogHeader
          title={editingTask ? "Ажил засварлах" : `${selectedWeek}-р долоо хоног — Ажил нэмэх`}
          onClose={() => setShowForm(false)}
        />
        <DialogBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Хийх ажил <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="Ажлын нэрийг оруулна уу"
              className={`border-slate-300 focus:border-[#1455BD] ${errors.task ? "border-rose-400" : ""}`}
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
            />
            {errors.task && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.task}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Тайлбар</label>
            <Textarea
              placeholder="Ажлын дэлгэрэнгүй тайлбар..."
              rows={3}
              className="border-slate-300 focus:border-[#1455BD] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Статус</label>
            <select
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1455BD] bg-white"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
            >
              {Object.entries(taskStatusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" className="flex-1 border-slate-200" onClick={() => setShowForm(false)}>Цуцлах</Button>
          <Button className="flex-1 bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={handleSaveTask}>
            <Save className="w-4 h-4 mr-2" />
            Хадгалах
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
        title="Ажил устгах уу?"
        description="Энэ үйлдлийг буцаах боломжгүй."
        confirmLabel="Устгах"
        variant="danger"
        icon={<Trash2 />}
      />

      {/* Submit Plan Confirm */}
      <ConfirmDialog
        open={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmitPlan}
        title="Төлөвлөгөө илгээх үү?"
        description="Илгээсний дараа багш хянаж, санал хүсэлт өгнө."
        confirmLabel="Илгээх"
        variant="primary"
        icon={<Send />}
      />
    </div>
  );
}
