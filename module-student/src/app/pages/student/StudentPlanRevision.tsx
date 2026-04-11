import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "../../components/ui/dialog";
import {
  MessageSquare, Send, Clock, CheckCircle2, History,
  AlertCircle, ChevronRight, CalendarDays, RefreshCw
} from "lucide-react";

interface FeedbackItem {
  week: number;
  comment: string;
  needsRevision: boolean;
}

interface Version {
  id: number;
  version: string;
  submittedDate: string;
  status: "pending" | "revision" | "approved";
  feedback?: string;
}

const teacherFeedback: FeedbackItem[] = [
  { week: 3, comment: "Өгөгдлийн цуглуулгын аргачлалыг тодорхой болгоно уу. Хэдэн өгөгдлийн цэг цуглуулж байна?", needsRevision: true },
  { week: 4, comment: "Загварын бүтцийг илүү дэлгэрэнгүй тайлбарлана уу.", needsRevision: true },
  { week: 7, comment: "Хоёрдогч судалгааны зорилтыг нэмэхийг санал болгож байна.", needsRevision: false },
];

const versionHistory: Version[] = [
  { id: 1, version: "v1", submittedDate: "2026-03-10", status: "revision", feedback: "3-р болон 4-р долоо хоногийн тайлбарыг нэмэлтээр тодорхой болгоно уу." },
];

const weekNames: Record<number, string> = {
  3: "3-р долоо хоног — Өгөгдлийн цуглуулга",
  4: "4-р долоо хоног — Загварын бүтэц",
  7: "7-р долоо хоног — Хоёрдогч судалгаа",
};

export default function StudentPlanRevision() {
  const [revisionNote, setRevisionNote] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeWeek, setActiveWeek] = useState<number | null>(3);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const revisionFeedback = teacherFeedback.filter((f) => f.needsRevision);
  const allRevised = revisionFeedback.every((f) => revisionNote[f.week]?.trim());

  const handleSubmitRevision = () => {
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Төлөвлөгөө засварлах</h1>
          <p className="text-slate-500 text-sm mt-1">Багшийн санал хүсэлтийг үндэслэн засварласан хувилбарыг илгэнэ үү</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-slate-300 text-slate-600"
            onClick={() => setShowHistoryModal(true)}
          >
            <History className="w-4 h-4 mr-2" />
            Хувилбарын түүх
          </Button>
          {!submitted && (
            <Button
              className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white"
              disabled={!allRevised}
              onClick={handleSubmitRevision}
            >
              <Send className="w-4 h-4 mr-2" />
              Засварласан хувилбар илгээх
            </Button>
          )}
        </div>
      </div>

      {/* Success State */}
      {submitted && (
        <Card className="border-emerald-200 shadow-sm bg-emerald-50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Засварласан хувилбар амжилттай илгэгдлээ</h3>
              <p className="text-sm text-emerald-700 mt-0.5">Багш таны засварыг хянаж, эргэн мэдэгдэнэ.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall teacher feedback banner */}
      <Card className="border-amber-200 shadow-sm bg-amber-50/60">
        <CardContent className="p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm mb-1">Багшийн ерөнхий санал</p>
            <p className="text-sm text-amber-800">
              Үечилсэн төлөвлөгөөний зарим хэсэг засвар шаардлагатай байна.
              Доорх долоо хоногуудын тайлбарыг нэмэлтээр боловсруулна уу.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feedback items with inline revision */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback list */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">Засварлах хэсгүүд</p>
          {teacherFeedback.map((f) => (
            <button
              key={f.week}
              onClick={() => setActiveWeek(f.week)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activeWeek === f.week
                  ? "border-[#1455BD] bg-blue-50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Badge className={`text-[11px] border ${
                  f.needsRevision
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-amber-50 text-amber-600 border-amber-200"
                }`}>
                  {f.needsRevision ? "Засвар шаардлагатай" : "Санал"}
                </Badge>
                <ChevronRight className={`w-4 h-4 transition-colors ${activeWeek === f.week ? "text-[#1455BD]" : "text-slate-300"}`} />
              </div>
              <p className="text-sm font-medium text-slate-800">{weekNames[f.week]}</p>
              {f.needsRevision && revisionNote[f.week]?.trim() && (
                <div className="mt-1.5 flex items-center gap-1 text-emerald-600 text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Засварласан</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Active feedback detail + revision input */}
        <div className="lg:col-span-2 space-y-4">
          {activeWeek ? (
            <>
              {(() => {
                const fb = teacherFeedback.find((f) => f.week === activeWeek);
                if (!fb) return null;
                return (
                  <>
                    {/* Teacher comment */}
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#1455BD] flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">Багшийн санал</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              2026-03-20
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                          fb.needsRevision
                            ? "bg-rose-50 text-rose-800 border border-rose-100"
                            : "bg-amber-50 text-amber-800 border border-amber-100"
                        }`}>
                          {fb.comment}
                        </div>
                        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {weekNames[activeWeek]}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Revision input */}
                    {fb.needsRevision && (
                      <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-[#1455BD]" />
                            Засварлах хэсэг
                          </CardTitle>
                          <CardDescription>Багшийн саналыг харгалзан засварлана уу</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            placeholder="Засварласан тайлбараа оруулна уу..."
                            rows={5}
                            className="border-slate-300 focus:border-[#1455BD] focus:ring-blue-500/20 resize-none"
                            value={revisionNote[activeWeek] || ""}
                            onChange={(e) => setRevisionNote({ ...revisionNote, [activeWeek]: e.target.value })}
                            disabled={submitted}
                          />
                          {revisionNote[activeWeek]?.trim() && (
                            <div className="mt-2 flex items-center gap-1.5 text-emerald-600 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Засварласан — Бусад долоо хоногуудыг шалгана уу</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </>
                );
              })()}
            </>
          ) : (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm text-slate-400">Долоо хоногийг сонгоно уу</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      {!submitted && (
        <Card className="border-slate-200 shadow-sm bg-slate-50/50">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Засварлалтын явц</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {revisionFeedback.filter((f) => revisionNote[f.week]?.trim()).length} / {revisionFeedback.length} хэсэг засварлагдсан
              </p>
            </div>
            <div className="flex gap-2">
              {revisionFeedback.map((f) => (
                <div
                  key={f.week}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                    revisionNote[f.week]?.trim()
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {f.week}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-[#1455BD]" />
                  Хувилбарын түүх
                </CardTitle>
                <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5">
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {versionHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <History className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">Түүх байхгүй байна</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {versionHistory.map((v) => (
                    <div key={v.id} className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs">{v.version}</Badge>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {v.submittedDate}
                          </span>
                        </div>
                        <Badge className={`text-xs border ${
                          v.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          v.status === "revision" ? "bg-orange-50 text-orange-700 border-orange-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {v.status === "approved" ? "Батлагдсан" : v.status === "revision" ? "Засвар шаардлагатай" : "Хүлээгдэж байна"}
                        </Badge>
                      </div>
                      {v.feedback && (
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{v.feedback}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="p-4 border-t border-slate-100">
                <Button variant="outline" className="w-full border-slate-300" onClick={() => setShowHistoryModal(false)}>
                  Хаах
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
