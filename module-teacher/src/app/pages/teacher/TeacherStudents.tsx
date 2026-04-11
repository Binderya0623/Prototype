import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  Users, Search, Filter, Eye, FileText, CheckCircle, 
  XCircle, Clock, Send, ChevronRight, FileDown,
  FileCheck, ShieldAlert, Award
} from "lucide-react";

// Mock Data
const assignedStudents = [
  { id: 1, name: "Alex Johnson", thesis: "Эмнэлгийн зургийн оношлогоонд гүн суралцахуй", stage: "Урьдчилсан хамгаалалт", status: "In Progress", progress: 75, avatar: "AJ" },
  { id: 2, name: "Maria Garcia", thesis: "Нийлүүлэлтийн сүлжээний тогтвортой байдал дахь блокчейн", stage: "Явцын тайлан 1", status: "Review", progress: 30, avatar: "MG" },
  { id: 3, name: "James Smith", thesis: "Квантум шифрлэлтийн протоколууд", stage: "Явцын тайлан 2", status: "Draft", progress: 50, avatar: "JS" },
  { id: 4, name: "Sarah Williams", thesis: "IoT төхөөрөмжид зориулсан захын тооцоолол", stage: "Эцсийн хамгаалалт", status: "Submitted", progress: 95, avatar: "SW" },
];

const submittedReports = [
  { id: 1, studentId: 2, student: "Maria Garcia", type: "Явцын тайлан 1", file: "Progress1_Garcia.pdf", date: "2 цагийн өмнө", status: "Хянах шаардлагатай", urgency: "high" },
  { id: 2, studentId: 4, student: "Sarah Williams", type: "Эцсийн дипломын ноорог", file: "Final_Draft_SW.pdf", date: "1 өдрийн өмнө", status: "Хянах шаардлагатай", urgency: "normal" },
  { id: 3, studentId: 1, student: "Alex Johnson", type: "Урьдчилсан хамгаалалтын слайд", file: "Slides_v2.pptx", date: "3 өдрийн өмнө", status: "Хянасан", urgency: "low" },
];

const rubricCriteria = [
  { id: 1, name: "Уран зохиолын тойм", max: 20 },
  { id: 2, name: "Аргачлалын загвар", max: 30 },
  { id: 3, name: "Урьдчилсан үр дүнгүүд", max: 30 },
  { id: 4, name: "Форматлалт & Тод байдал", max: 20 },
];

export default function TeacherStudents() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("roster");
  
  const [reviewReportId, setReviewReportId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [reviewStatus, setReviewStatus] = useState<"idle" | "success">("idle");

  const [evalStudentId, setEvalStudentId] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [evalStatus, setEvalStatus] = useState<"idle" | "loading" | "success">("idle");

  const totalScore = Object.values(scores).reduce((a, b) => a + (b || 0), 0);

  const handleReviewAction = (action: string) => {
    setReviewStatus("success");
    setTimeout(() => {
      setReviewStatus("idle");
      setReviewReportId(null);
    }, 2000);
  };

  const handleSubmitEvaluation = () => {
    setEvalStatus("loading");
    setTimeout(() => {
      setEvalStatus("success");
      setTimeout(() => {
        setEvalStatus("idle");
        setEvalStudentId(null);
        setScores({});
      }, 2000);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress": return <Badge className="bg-blue-50 text-[#1455BD] border-blue-100">Хийгдэж байна</Badge>;
      case "Review": return <Badge className="bg-orange-50 text-orange-600 border-orange-100">Хянагдаж байна</Badge>;
      case "Draft": return <Badge className="bg-slate-50 text-slate-600 border-slate-200">Ноорог</Badge>;
      case "Submitted": return <Badge className="bg-purple-50 text-purple-600 border-purple-100">Илгээсэн</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Гарчиг */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1455BD]" />
            Хуваарилагдсан оюутнууд
          </h1>
          <p className="text-slate-600 mt-1">Суралцагчдаа удирдах, тайланг хянах, үнэлгээ илгаах.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Оюутан хайх..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1455BD] focus:ring-1 focus:ring-[#1455BD] w-64 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-slate-200 bg-white">
            <Filter className="w-4 h-4 mr-2" />
            Шүүх
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b border-slate-200 rounded-none bg-transparent h-auto p-0 space-x-6">
          <TabsTrigger value="roster" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-3 px-1">
            Оюутны жагсаалт
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-3 px-1">
            <span className="flex items-center gap-2">
              Илгээсэн тайлангууд
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 text-[10px] px-1.5 py-0 h-4">2</Badge>
            </span>
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-3 px-1">
            Үнэлгээний маягт
          </TabsTrigger>
        </TabsList>

        {/* Оюутны жагсаалт таб */}
        <TabsContent value="roster" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {assignedStudents.map(student => (
              <Card key={student.id} className="border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group overflow-hidden">
                <div className="h-1.5 w-full bg-slate-100">
                  <div className="h-full bg-[#1455BD]" style={{ width: `${student.progress}%` }} />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarFallback className="bg-blue-50 text-[#1455BD] font-bold">{student.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 truncate">{student.name}</h3>
                        {getStatusBadge(student.status)}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3 h-10">{student.thesis}</p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span className="font-semibold text-slate-700">Шат: {student.stage}</span>
                        <span>{student.progress}% дууссан</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs border-slate-200 hover:bg-slate-50 hover:text-[#1455BD]">
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> Харах
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs border-slate-200 hover:bg-slate-50 hover:text-[#1455BD]" onClick={() => setActiveTab("reports")}>
                          <FileText className="w-3.5 h-3.5 mr-1.5" /> Хянах
                        </Button>
                        <Button size="sm" className="flex-1 text-xs bg-white text-[#1455BD] border border-blue-200 hover:bg-blue-50 shadow-sm" onClick={() => { setActiveTab("evaluations"); setEvalStudentId(student.id); }}>
                          <Award className="w-3.5 h-3.5 mr-1.5" /> Үнэлэх
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Илгээсэн тайлангууд таб */}
        <TabsContent value="reports" className="mt-6">
          {reviewReportId === null ? (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-slate-800">Тайлан хянах дараалал</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {submittedReports.map(report => (
                    <div key={report.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          report.status === "Хянах шаардлагатай" ? "bg-orange-50 border-orange-100 text-orange-600" : "bg-slate-100 border-slate-200 text-slate-500"
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">{report.student}</span>
                            <Badge variant="outline" className="text-[10px] text-slate-500 bg-white border-slate-200 uppercase tracking-wide px-1.5 py-0">
                              {report.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <FileDown className="w-3.5 h-3.5" /> {report.file}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> Илгээсэн: {report.date}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                        {report.status === "Хянах шаардлагатай" ? (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">
                            Хянах шаардлагатай
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-700 border-0">
                            <CheckCircle className="w-3 h-3 mr-1" /> Хянасан
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white"
                          onClick={() => setReviewReportId(report.id)}
                        >
                          Хянах нээх
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px] bg-slate-50 p-4 rounded-xl border border-slate-200">
              
              {/* PDF харагдах самбар */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden flex flex-col">
                <div className="h-12 border-b border-slate-200 bg-slate-100/50 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FileText className="w-4 h-4 text-[#1455BD]" />
                    Progress1_Garcia.pdf
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500">Томруулах</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500">Татах</Button>
                  </div>
                </div>
                <div className="flex-1 bg-slate-200/50 p-8 flex justify-center overflow-y-auto">
                  <div className="w-full max-w-lg bg-white shadow-md p-10 h-[1000px]">
                    <h1 className="text-2xl font-bold mb-6 text-center">1-р бүлэг: Оршил</h1>
                    <div className="space-y-4 text-slate-300">
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-[90%]"></div>
                      <div className="h-4 bg-slate-200 rounded w-[95%]"></div>
                      <div className="h-4 bg-slate-200 rounded w-[80%]"></div>
                      <br/>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-[85%]"></div>
                      <div className="h-4 bg-slate-200 rounded w-[90%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Хяналтын хажуу самбар */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
                <div className="p-4 border-b border-slate-100">
                  <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-slate-500 hover:text-[#1455BD]" onClick={() => setReviewReportId(null)}>
                    <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Дараалал руу буцах
                  </Button>
                  <h3 className="font-bold text-lg text-slate-900">Maria Garcia</h3>
                  <p className="text-sm text-slate-500 mb-2">Явцын тайлан 1 • v1</p>
                  <Badge className="bg-orange-50 text-orange-600 border-orange-100">Хянах шаардлагатай</Badge>
                </div>

                {/* Тайлбарын хэлхэс */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-sm">
                    <p className="font-semibold text-slate-800 mb-1">Maria Garcia</p>
                    <p className="text-slate-600">Уран зохиолын хяналтын хэсэгт анхаарлаа хандуулсан Явцын тайлан 1-ийг хавсаргав.</p>
                  </div>
                  
                  {reviewStatus === "success" && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center gap-2 text-green-700 text-sm animate-in fade-in duration-300">
                      <CheckCircle className="w-4 h-4" /> Үйлдэл амжилттай бүртгэгдлээ!
                    </div>
                  )}
                </div>

                {/* Оролт & Үйлдлүүд */}
                <div className="p-4 border-t border-slate-100 space-y-4">
                  <textarea 
                    className="w-full text-sm border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1455BD] focus:ring-1 focus:ring-[#1455BD] resize-none h-24"
                    placeholder="Санал хүсэлтээ бичнэ үү..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="border-orange-200 text-orange-700 hover:bg-orange-50 text-xs h-9"
                      onClick={() => handleReviewAction("revision")}
                      disabled={reviewStatus !== "idle"}
                    >
                      <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Засвар хүсэх
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white text-xs h-9"
                      onClick={() => handleReviewAction("approve")}
                      disabled={reviewStatus !== "idle"}
                    >
                      <FileCheck className="w-3.5 h-3.5 mr-1.5" /> Зөвшөөрөх
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </TabsContent>

        {/* Үнэлгээний маягт таб */}
        <TabsContent value="evaluations" className="mt-6">
          {evalStudentId === null ? (
            <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Үнэлэх оюутан сонгоно уу</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Оюутны жагсаалт руу очоод "Үнэлэх" дарна уу.
              </p>
            </div>
          ) : (
            <Card className="border-slate-200 shadow-sm max-w-3xl mx-auto">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <CardTitle className="text-lg text-slate-900">Явцын тайлан 1-ийн үнэлгээний маягт</CardTitle>
                  <Button variant="ghost" size="sm" className="text-slate-500" onClick={() => setEvalStudentId(null)}>Хаах</Button>
                </div>
                <CardDescription>
                  Үнэлж байгаа: <strong>{assignedStudents.find(s => s.id === evalStudentId)?.name}</strong>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {/* Шалгуурын гарчиг */}
                  <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <div className="col-span-6">Үнэлгээний шалгуур</div>
                    <div className="col-span-3 text-center">Оноо</div>
                    <div className="col-span-3 text-center">Дээд</div>
                  </div>

                  {rubricCriteria.map((criterion) => (
                    <div key={criterion.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                      <div className="col-span-6">
                        <p className="font-medium text-slate-800 text-sm">{criterion.name}</p>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <input 
                          type="number" 
                          min={0} max={criterion.max}
                          className="w-16 border border-slate-300 rounded-md py-1 px-2 text-center text-sm focus:outline-none focus:border-[#1455BD]"
                          value={scores[criterion.id] || ''}
                          onChange={(e) => setScores({ ...scores, [criterion.id]: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="col-span-3 text-center text-slate-500 font-medium text-sm">
                        / {criterion.max}
                      </div>
                    </div>
                  ))}

                  {/* Нийт оноо ба илгаах */}
                  <div className="p-6 bg-slate-50 border-t-2 border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-bold text-slate-800">Нийт оноо</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#1455BD]">{totalScore}</span>
                        <span className="text-slate-500 font-medium">/ 100</span>
                      </div>
                    </div>

                    {evalStatus === "success" ? (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center justify-center gap-2 font-medium animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="w-5 h-5" /> Үнэлгээ амжилттай хадгалагдлаа!
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-[#1455BD] hover:bg-[#0d3a8a] text-white shadow-sm"
                        size="lg"
                        onClick={handleSubmitEvaluation}
                        disabled={evalStatus === "loading"}
                      >
                        {evalStatus === "loading" ? "Илгааж байна..." : "Үнэлгээ илгаах"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
