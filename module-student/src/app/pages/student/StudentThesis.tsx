import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import {
  FileText, Upload, Download, Calendar, CheckCircle2,
  AlertCircle, X, FileUp, Trash2, RefreshCw, FileArchive,
  Users, Check, Lock, Unlock, File, MonitorPlay, Key
} from "lucide-react";

// We will import the internal tab components
import StudentTopicTab from "./tabs/StudentTopicTab";
import StudentWeeklyPlanTab from "./tabs/StudentWeeklyPlanTab";

// --- MOCK DATA ---
const thesisInfo = {
  title: "Эмнэлгийн зургийн оношлогоонд гүн суралцахуй",
  description: "Конволюцын нейрон сүлжээ ашиглан эмнэлгийн зургийн оношлогооны нарийвчлалыг дээшлүүлэхэд гүн суралцахуйн арга техникийг хэрэглэх тухай цогц судалгаа.",
  supervisor: "Д.Сувдаа",
  committee: ["Д.Сувдаа", "Б.Батням"],
  department: "Компьютерын ухаан",
  researchArea: "Эрүүл мэндэд хиймэл оюун ухаан",
  submissionDate: "2026-06-30",
  lastUpdated: "2026-03-22",
  status: "Хийгдэж байна",
  progress: 75,
};

const stages = [
  { id: 1, title: "Сэдвийн зөвшөөрөл", status: "completed" },
  { id: 2, title: "Явц 1", status: "completed" },
  { id: 3, title: "Явц 2", status: "completed" },
  { id: 4, title: "Урьдчилсан хамгаалалт", status: "current" },
  { id: 5, title: "Эцсийн хамгаалалт", status: "pending" },
];

const previousVersions = [
  { id: 1, version: "v3", type: "Явц 2", submitted: "2026-03-05 14:30", status: "Зөвшөөрсөн", size: "4.2 MB" },
  { id: 2, version: "v2", type: "Явц 2", submitted: "2026-02-28 09:15", status: "Дахин илгээсэн", size: "4.1 MB" },
];

const initialPresentationMaterials = [
  { id: 1, name: "PreDefense_Slides_v1.pptx", date: "2026-03-20 10:00", size: "12.5 MB", visible: true },
];

export default function StudentThesis() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Report Upload States
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const [reportType, setReportType] = useState("Урьдчилсан хамгаалалт");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Presentation States
  const [materials, setMaterials] = useState(initialPresentationMaterials);
  const [presentationDrag, setPresentationDrag] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  // Handlers for File Uploads...
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Файлын формат буруу байна. PDF эсвэл DOCX файл оруулна уу.");
      setUploadStatus('error');
      return false;
    }
    setErrorMsg(""); setUploadStatus('idle'); return true;
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) setSelectedFile(file);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) setSelectedFile(file);
    }
  };
  const handleSubmitReport = () => {
    if (!selectedFile || !description) return;
    setUploadStatus('uploading'); setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setUploadStatus('success'); return 100; }
        return prev + 10;
      });
    }, 200);
  };
  const handleDeleteMaterial = (id: number) => {
    setMaterials(materials.filter(m => m.id !== id));
    setShowDeleteModal(null);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Top Graphic Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="h-2 w-full bg-[#1455BD]"></div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-blue-50 text-[#1455BD] border border-blue-100 font-medium px-2 py-0.5">
                    {thesisInfo.status}
                  </Badge>
                  <span className="text-sm font-medium text-slate-500">
                    Шинэчлэгдсэн: {thesisInfo.lastUpdated}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{thesisInfo.title}</h1>
                <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
                  {thesisInfo.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Удирдагч</p>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2 border border-slate-200">
                      <AvatarFallback className="bg-blue-50 text-[#1455BD] text-[10px]">Д.С</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{thesisInfo.supervisor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Тэнхим</p>
                  <span className="text-sm font-medium">{thesisInfo.department}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Чиглэл</p>
                  <span className="text-sm font-medium">{thesisInfo.researchArea}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Хугацаа</p>
                  <span className="text-sm font-medium">{thesisInfo.submissionDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABS NAVIGATION */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="bg-white px-2 rounded-t-xl border-b border-slate-200 overflow-x-auto custom-scrollbar">
          <TabsList className="w-auto flex justify-start bg-transparent h-auto p-0 gap-6 min-w-max">
            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-4 px-2 text-sm font-medium transition-all text-slate-500 hover:text-slate-700">
              Тойм
            </TabsTrigger>
            <TabsTrigger value="topic" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-4 px-2 text-sm font-medium transition-all text-slate-500 hover:text-slate-700">
              Сэдэв
            </TabsTrigger>
            <TabsTrigger value="weekly-plan" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-4 px-2 text-sm font-medium transition-all text-slate-500 hover:text-slate-700">
              Үечилсэн төлөвлөгөө
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-4 px-2 text-sm font-medium transition-all text-slate-500 hover:text-slate-700">
              Тайлан илгээх
            </TabsTrigger>
            <TabsTrigger value="presentation" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-4 px-2 text-sm font-medium transition-all text-slate-500 hover:text-slate-700">
              Танилцуулгын материалууд
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Нийт дэвшил</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Дуусалтын байдал</span>
                    <span className="text-sm font-bold text-[#1455BD]">{thesisInfo.progress}%</span>
                  </div>
                  <Progress value={thesisInfo.progress} className="h-2.5 mb-8" />
                  <div className="relative">
                    <div className="absolute top-[14px] left-[10%] w-[80%] h-[2px] bg-slate-100 -z-10"></div>
                    <div className="absolute top-[14px] left-[10%] h-[2px] bg-[#1455BD] transition-all -z-10" style={{ width: '60%' }}></div>
                    <div className="flex justify-between">
                      {stages.map((stage) => (
                        <div key={stage.id} className="flex flex-col items-center w-1/5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white ${stage.status === 'completed' ? 'border-[#1455BD] text-[#1455BD]' : stage.status === 'current' ? 'border-[#1455BD] ring-4 ring-blue-50 text-[#1455BD]' : 'border-slate-200 text-slate-300'}`}>
                            {stage.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : stage.status === 'current' ? <div className="w-2 h-2 bg-[#1455BD] rounded-full" /> : <span className="text-xs">{stage.id}</span>}
                          </div>
                          <span className={`text-[11px] mt-2 font-medium text-center px-1 ${stage.status === 'current' ? 'text-[#1455BD]' : 'text-slate-600'}`}>{stage.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#1455BD]" />
                    Комиссын гишүүд
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {thesisInfo.committee.map((member, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarFallback className="bg-white text-slate-700 font-semibold">{member.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{member}</p>
                          <p className="text-xs text-slate-500">Хянагч</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm bg-slate-50/30">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <FileArchive className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Баримтын формат</p>
                      <p className="text-sm text-slate-700">IEEE стандартыг дагана уу. Урьдчилсан хамгаалалтын ноорогт дээд тал нь 50 хуудас.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Дараагийн хамгаалалт</p>
                      <p className="text-sm text-slate-700">Товлоогүй байна. Эхлээд урьдчилсан хамгаалалтыг дуусгана уу.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 2. TOPIC TAB (UNIFIED) */}
        <TabsContent value="topic" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <StudentTopicTab />
        </TabsContent>

        {/* 3. WEEKLY PLAN TAB (UNIFIED) */}
        <TabsContent value="weekly-plan" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <StudentWeeklyPlanTab />
        </TabsContent>

        {/* 4. REPORTS TAB */}
        <TabsContent value="reports" className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <FileUp className="w-5 h-5 text-[#1455BD]" />
                Шинэ тайлан илгээх
              </CardTitle>
              <CardDescription>Хянуулах баримт бичгээ оруулна уу. Зөвхөн PDF эсвэл DOCX, дээд тал нь 25MB.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Тайлангийн төрөл</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1455BD]"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>Явц 1</option>
                    <option>Явц 2</option>
                    <option>Урьдчилсан хамгаалалт</option>
                    <option>Эцсийн хамгаалалт</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Тайлбар / Тэмдэглэл</label>
                  <input
                    type="text"
                    placeholder="Товч тайлбар"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1455BD]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {uploadStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-green-200 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-1">Амжилттай оруулагдлаа</h3>
                  <Button variant="outline" className="mt-4 border-green-300 text-green-800" onClick={() => { setUploadStatus('idle'); setSelectedFile(null); setDescription(""); }}>Өөр файл илгээх</Button>
                </div>
              ) : (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-[#1455BD] bg-blue-50' : uploadStatus === 'error' ? 'border-rose-300 bg-rose-50' : 'border-slate-300 hover:bg-slate-50'}`}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                >
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleChange} ref={fileInputRef} accept=".pdf,.docx" />
                  {!selectedFile ? (
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-[#1455BD]" />
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Файлаа энд чирж тавих буюу товших</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      <File className="w-10 h-10 text-[#1455BD] mb-3" />
                      <p className="text-sm font-medium text-slate-900 truncate max-w-xs">{selectedFile.name}</p>
                    </div>
                  )}
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="mt-3 flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {uploadStatus !== 'success' && (
                <div className="mt-6 flex justify-end">
                  <Button className="bg-[#1455BD] text-white" disabled={!selectedFile || !description || uploadStatus === 'uploading'} onClick={handleSubmitReport}>
                    {uploadStatus === 'uploading' ? 'Оруулж байна...' : 'Тайлан илгээх'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. PRESENTATIONS TAB */}
        <TabsContent value="presentation" className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <MonitorPlay className="w-5 h-5 text-[#1455BD]" />
                Танилцуулгын материалууд
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileArchive className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-slate-700 font-medium">Материал оруулаагүй байна</h4>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
