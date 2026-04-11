import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "../../../components/ui/dialog";
import { BookOpen, CheckCircle2, XCircle, Search, Calendar, MapPin, Mail, AlertCircle, Bookmark } from "lucide-react";

// --- MOCK DATA ---
const requests = [
  {
    id: 1,
    student: "А.Анар",
    studentId: "20B1NUM0001",
    email: "anar@num.edu.mn",
    department: "Мэдээллийн технологи",
    topicTitle: "Тэжээвэр амьтдын өвчнийг таних аппликейшн",
    topicField: "Хиймэл оюун ухаан",
    status: "pending",
    requestedDate: "2026-03-22 10:30",
    motivation: "Би өмнө нь computer vision чиглэлээр бие даалт хийж байсан бөгөөд энэ сэдэв миний сонирхлыг маш их татаж байна.",
    gpa: 3.4,
  },
  {
    id: 2,
    student: "Б.Болор",
    studentId: "21B1NUM0102",
    email: "bolor@num.edu.mn",
    department: "Компьютерын ухаан",
    topicTitle: "Гүн суралцахуйн аргаар эмнэлгийн зургийн оношлогоо",
    topicField: "Хиймэл оюун ухаан",
    status: "pending",
    requestedDate: "2026-03-21 15:45",
    motivation: "Эмнэлгийн өгөгдөл дээр ажиллах хүсэлтэй бөгөөд өмнөх улиралд Deep Learning хичээл дээр энэ чиглэлээр судалгаа хийсэн.",
    gpa: 3.8,
  }
];

export default function TeacherTopicRequestsTab() {
  const [activeRequests, setActiveRequests] = useState(requests);
  const [selectedRequest, setSelectedRequest] = useState<typeof requests[0] | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<"approve" | "reject" | null>(null);

  const handleAction = () => {
    if (selectedRequest && showConfirmModal) {
      setActiveRequests(activeRequests.filter(r => r.id !== selectedRequest.id));
      setShowConfirmModal(null);
      setSelectedRequest(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
        {/* Left Sidebar: Requests List */}
        <Card className="lg:col-span-1 border-slate-200 shadow-sm h-fit">
          <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-600" /> Ирсэн хүсэлтүүд ({activeRequests.length})
            </CardTitle>
          </CardHeader>
          <div className="p-2 space-y-1">
            {activeRequests.length === 0 ? (
              <div className="text-center p-6 text-slate-500 text-sm">Шинэ хүсэлт байхгүй байна.</div>
            ) : (
              activeRequests.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRequest(r)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${selectedRequest?.id === r.id ? "bg-amber-50 border border-amber-200 shadow-sm" : "hover:bg-slate-50 border border-transparent"}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white shadow-sm ring-2 ring-amber-50">
                      <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">{r.student[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${selectedRequest?.id === r.id ? "text-amber-900" : "text-slate-900"}`}>{r.student}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{r.topicTitle}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center bg-white/50 px-2 py-1 rounded-md text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.requestedDate.split(" ")[0]}</span>
                    <span>Үнэлгээ: <strong className="text-amber-600">{r.gpa}</strong></span>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Right Area: Request Details */}
        <div className="lg:col-span-2">
          {!selectedRequest ? (
            <Card className="border-slate-200 border-dashed h-96 flex flex-col items-center justify-center bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm">Зүүн талаас хүсэлт сонгож дэлгэрэнгүй мэдээллийг харна уу.</p>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden animate-in fade-in">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-5">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border border-white shadow-md ring-2 ring-slate-100">
                      <AvatarFallback className="bg-slate-200 text-slate-700 text-xl font-bold">{selectedRequest.student[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 mb-1">{selectedRequest.student}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedRequest.studentId}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedRequest.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800" onClick={() => setShowConfirmModal("reject")}>
                      <XCircle className="w-4 h-4 mr-2" /> Татгалзах
                    </Button>
                    <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => setShowConfirmModal("approve")}>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Батлах
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-6">
                  <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-5">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">Хүсэлт гаргасан сэдэв</p>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{selectedRequest.topicTitle}</h4>
                    <Badge variant="outline" className="bg-white text-amber-700 border-amber-200">{selectedRequest.topicField}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Оюутны голч дүн (GPA)</h5>
                      <span className="text-2xl font-bold text-[#1455BD]">{selectedRequest.gpa}</span>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Суралцаж буй хөтөлбөр</h5>
                      <span className="text-sm font-medium text-slate-800">{selectedRequest.department}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Сэдвийг сонгох шалтгаан (Motivation)</h5>
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-slate-700 leading-relaxed text-sm">
                      "{selectedRequest.motivation}"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={!!showConfirmModal} onClose={() => setShowConfirmModal(null)}>
        <DialogHeader 
          title={showConfirmModal === "approve" ? "Хүсэлтийг батлах" : "Хүсэлтээс татгалзах"} 
          icon={showConfirmModal === "approve" ? <CheckCircle2 className="w-5 h-5 text-[#1455BD]" /> : <AlertCircle className="w-5 h-5 text-rose-600" />} 
          onClose={() => setShowConfirmModal(null)} 
        />
        <DialogBody>
          {showConfirmModal === "approve" ? (
            <p className="text-slate-600">
              Та оюутан <strong>{selectedRequest?.student}</strong>-ийн сонгосон хүсэлтийг батлахдаа итгэлтэй байна уу? Баталсны дараа уг оюутан үечилсэн төлөвлөгөө гаргаж эхлэх бөгөөд таны удирдсан оюутнуудын жагсаалт руу орох болно.
            </p>
          ) : (
            <p className="text-slate-600">
              Та оюутан <strong>{selectedRequest?.student}</strong>-ийн хүсэлтээс татгалзах гэж байна. Оюутанд санал болгох өөр сэдэв сонгох боломж олгогдоно.
            </p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmModal(null)}>Цуцлах</Button>
          <Button 
            className={showConfirmModal === "approve" ? "bg-[#1455BD] hover:bg-[#0d3a8a] text-white" : "bg-rose-600 hover:bg-rose-700 text-white"} 
            onClick={handleAction}
          >
            {showConfirmModal === "approve" ? "Баталгаажуулах" : "Татгалзах"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
