import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Settings, CheckCircle2, AlertTriangle, ToggleLeft,
  ToggleRight, Calendar, GripVertical
} from "lucide-react";

const stagesDefault = [
  { id: 1, name: "Явц 1", active: true, start: "2026-02-20", end: "2026-02-27", order: 1, color: "bg-blue-500" },
  { id: 2, name: "Явц 2", active: true, start: "2026-03-20", end: "2026-03-27", order: 2, color: "bg-violet-500" },
  { id: 3, name: "Урьдчилсан хамгаалалт", active: true, start: "2026-04-20", end: "2026-04-27", order: 3, color: "bg-orange-500" },
  { id: 4, name: "Эцсийн хамгаалалт", active: false, start: "2026-05-20", end: "2026-05-27", order: 4, color: "bg-emerald-500" },
];

const criteriaDefault = [
  { id: 1, name: "Эх сурвалжийн чанар", weight: 20, scale: 20 },
  { id: 2, name: "Судалгааны арга зүй", weight: 30, scale: 30 },
  { id: 3, name: "Үр дүн ба шинжилгээ", weight: 30, scale: 30 },
  { id: 4, name: "Бичгийн чанар", weight: 10, scale: 10 },
  { id: 5, name: "Асуулт хариулт", weight: 10, scale: 10 },
];

export default function AdminEvaluationProcess() {
  const [stages, setStages] = useState(stagesDefault);
  const [criteria, setCriteria] = useState(criteriaDefault);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [publishStatus, setPublishStatus] = useState<"draft" | "published">("draft");
  const [activeTab, setActiveTab] = useState<"stages" | "methods">("stages");

  const totalWeight = criteria.reduce((a, b) => a + b.weight, 0);
  const weightValid = totalWeight === 100;

  const toggleStage = (id: number) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const updateDate = (id: number, field: "start" | "end", value: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateWeight = (id: number, value: number) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, weight: Math.max(0, Math.min(100, value)) } : c));
  };

  const handleSave = (action: "draft" | "publish") => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      if (action === "publish") setPublishStatus("published");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#1455BD]" />
            Үнэлгээний үйл явцын тохиргоо
          </h1>
          <p className="text-slate-500 mt-1">Үнэлгээний шатууд, ажлын урсгал болон оноог тохируулах.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={publishStatus === "published" ? "bg-emerald-100 text-emerald-700 border-0 px-3 py-1.5" : "bg-slate-100 text-slate-600 border-0 px-3 py-1.5"}>
            {publishStatus === "published" ? <><CheckCircle2 className="w-3 h-3 mr-1 inline" />Нийтлэгдсэн</> : "Ноорог"}
          </Badge>
          <Button variant="outline" className="border-slate-200" onClick={() => handleSave("draft")} disabled={saveStatus === "saving"}>
            {saveStatus === "saving" ? "Хадгалж байна..." : saveStatus === "saved" ? "✓ Хадгалагдлаа" : "Ноорог хадгалах"}
          </Button>
          <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => handleSave("publish")} disabled={!weightValid}>
            Нийтлэх
          </Button>
        </div>
      </div>

      <div className="flex bg-slate-100 rounded-xl p-1 w-fit">
        {(["stages", "methods"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === "stages" ? "Үнэлгээний шатууд" : "Оноолох арга"}
          </button>
        ))}
      </div>

      {/* Шатуудын тохиргоо */}
      {activeTab === "stages" && (
        <div className="space-y-5">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1455BD]" /> Үнэлгээний цаг хугацааны диаграм
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-0 right-0 top-5 h-0.5 bg-slate-100"></div>
                <div className="flex justify-between relative z-10">
                  {stages.map((stage, idx) => (
                    <div key={stage.id} className="flex flex-col items-center gap-2 w-[22%]">
                      <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center text-sm font-extrabold shadow-sm ${stage.active ? `${stage.color} border-white text-white` : 'bg-slate-200 border-white text-slate-500'}`}>
                        {idx + 1}
                      </div>
                      <p className="text-xs font-semibold text-center text-slate-800 leading-tight">{stage.name}</p>
                      <Badge className={`text-[9px] ${stage.active ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-slate-100 text-slate-500 border-0'}`}>
                        {stage.active ? "Идэвхтэй" : "Идэвхгүй"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {stages.map(stage => (
            <Card key={stage.id} className={`border-slate-200 shadow-sm transition-all ${!stage.active ? 'opacity-60' : ''}`}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-300 cursor-grab"><GripVertical className="w-4 h-4" /></div>
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <div>
                      <h3 className="font-bold text-slate-900">{stage.name}</h3>
                      <p className="text-xs text-slate-400">{stage.order}-р үнэлгээний шат</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Эхлэх</label>
                        <input type="date" className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#1455BD] bg-white" value={stage.start} onChange={e => updateDate(stage.id, "start", e.target.value)} />
                      </div>
                      <span className="text-slate-300 mt-3">→</span>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Дуусах</label>
                        <input type="date" className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#1455BD] bg-white" value={stage.end} onChange={e => updateDate(stage.id, "end", e.target.value)} />
                      </div>
                    </div>
                    <button onClick={() => toggleStage(stage.id)} className="flex items-center gap-2 transition-colors shrink-0">
                      {stage.active
                        ? <><ToggleRight className="w-7 h-7 text-[#1455BD]" /><span className="text-sm font-semibold text-emerald-600">Идэвхтэй</span></>
                        : <><ToggleLeft className="w-7 h-7 text-slate-400" /><span className="text-sm font-semibold text-slate-400">Идэвхгүй</span></>
                      }
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Оноолох аргын тохиргоо */}
      {activeTab === "methods" && (
        <div className="space-y-5">
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${weightValid ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            {weightValid
              ? <><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /><p className="text-sm text-emerald-700 font-medium">Нийт жин яг 100% байна. Тохиргоо зөв байна.</p></>
              : <><AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" /><p className="text-sm text-amber-700 font-medium">Нийт жин <strong>{totalWeight}%</strong> байна. Нийтлэхийн тулд 100% байх ёстой.</p></>
            }
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="col-span-5">Шалгуур</div>
                <div className="col-span-3 text-center">Жин (%)</div>
                <div className="col-span-2 text-center">Дээд оноо</div>
                <div className="col-span-2 text-center">Харагдац</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {criteria.map(c => (
                  <div key={c.id} className="grid grid-cols-12 items-center p-4 hover:bg-slate-50 transition-colors gap-3">
                    <div className="col-span-5">
                      <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#1455BD] bg-white font-medium text-slate-800" value={c.name} onChange={e => setCriteria(prev => prev.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))} />
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-1 justify-center">
                        <input type="number" min={0} max={100} className="w-16 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-[#1455BD]" value={c.weight} onChange={e => updateWeight(c.id, parseInt(e.target.value) || 0)} />
                        <span className="text-slate-400 text-sm">%</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-semibold text-slate-700">{c.scale} оноо</span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1455BD]" style={{ width: `${c.weight}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 w-6 text-right">{c.weight}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className={`grid grid-cols-12 items-center p-4 ${weightValid ? 'bg-emerald-50/50' : 'bg-amber-50/50'}`}>
                  <div className="col-span-5 text-sm font-bold text-slate-700 pl-1">НИЙТ</div>
                  <div className="col-span-3 text-center">
                    <span className={`font-extrabold text-lg ${weightValid ? 'text-emerald-600' : 'text-amber-600'}`}>{totalWeight}%</span>
                  </div>
                  <div className="col-span-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1455BD]/20 bg-blue-50/30 shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-[#1455BD] mb-3 uppercase tracking-widest">Академик удирдамж</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Бүх оноо 0–100 дотор байх ёстой.</p>
                <p>• Нийтлэхийн өмнө нийт жин яг 100% байх ёстой.</p>
                <p>• Нийтлэгдсэн тохиргоо одоогийн улирлын бүх комисст хамаарна.</p>
                <p>• Нийтлэгдсэн тохиргоог өөрчлөхөд администраторын зөвшөөрөл шаардлагатай.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {saveStatus === "saved" && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-40">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Тохиргоо амжилттай хадгалагдлаа!</span>
        </div>
      )}
    </div>
  );
}
