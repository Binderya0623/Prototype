import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Textarea } from "../../../components/ui/textarea";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "../../../components/ui/dialog";
import { BookOpen, CheckCircle2, XCircle, Calendar, MapPin, Mail, AlertCircle, Bookmark, MessageSquare } from "lucide-react";

// --- MOCK DATA ---
const studentProposals = [
  {
    id: 1,
    student: "Г.Гантулга",
    studentId: "20B1NUM0203",
    email: "gantulga@num.edu.mn",
    department: "Мэдээллийн технологи",
    title: "Монгол хэлний дуу таних систем",
    description: "Монгол хэлний ярианы мэдрэх, таних тогтолцоо боловсруулах.",
    goal: "Монгол хэлний ярианы таних нарийвчлалыг дэвшилтэт ML аргаар сайжруулах.",
    keywords: ["Speech Recognition", "NLP", "Mongolian"],
    status: "pending",
    submittedDate: "2026-03-20 14:15",
  }
];

export default function TeacherStudentProposalsTab() {
  const [proposals, setProposals] = useState(studentProposals);
  const [selectedProp, setSelectedProp] = useState<typeof studentProposals[0] | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<"approve" | "reject" | "feedback" | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const handleAction = () => {
    if (selectedProp && showConfirmModal) {
      if (showConfirmModal === "approve") {
        setProposals(proposals.map(p => p.id === selectedProp.id ? { ...p, status: "dept_review" } : p));
        setSelectedProp(null);
      } else if (showConfirmModal === "reject") {
        setProposals(proposals.map(p => p.id === selectedProp.id ? { ...p, status: "rejected" } : p));
        setSelectedProp(null);
      } else if (showConfirmModal === "feedback") {
        setProposals(proposals.map(p => p.id === selectedProp.id ? { ...p, status: "feedback" } : p));
        setSelectedProp(null);
      }
      setShowConfirmModal(null);
      setFeedbackText("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
        {/* Left Sidebar: Proposals List */}
        <Card className="lg:col-span-1 border-slate-200 shadow-sm h-fit">
          <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#1455BD]" /> Оюутны дэвшүүлсэн сэдэв ({proposals.length})
            </CardTitle>
          </CardHeader>
          <div className="p-2 space-y-1">
            {proposals.length === 0 ? (
              <div className="text-center p-6 text-slate-500 text-sm">Одоогоор хүлээгдэж буй сэдэв алга байна.</div>
            ) : (
              proposals.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProp(p)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${selectedProp?.id === p.id ? "bg-blue-50 border border-blue-200 shadow-sm" : "hover:bg-slate-50 border border-transparent"}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white shadow-sm ring-2 ring-blue-50">
                      <AvatarFallback className="bg-blue-100 text-[#1455BD] font-bold">{p.student[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${selectedProp?.id === p.id ? "text-[#1455BD]" : "text-slate-900"}`}>{p.student}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{p.title}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center bg-white/50 px-2 py-1 rounded-md text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.submittedDate.split(" ")[0]}</span>
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${p.status === 'pending' ? 'bg-blue-50 text-blue-700' : p.status === 'dept_review' ? 'bg-amber-50 text-amber-700 border-amber-200' : p.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                      {p.status === 'pending' ? 'Багш хяналтанд' : p.status === 'dept_review' ? 'Тэнхим хяналтанд' : p.status === 'rejected' ? 'Татгалзсан' : 'Засварт буцсан'}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Right Area: Proposal Details */}
        <div className="lg:col-span-2">
          {!selectedProp ? (
            <Card className="border-slate-200 border-dashed h-96 flex flex-col items-center justify-center bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm">Зүүн талаас оюутны дэвшүүлсэн сэдвийг сонгож дэлгэрэнгүй харна уу.</p>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden animate-in fade-in">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-5">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border border-white shadow-md ring-2 ring-slate-100">
                      <AvatarFallback className="bg-slate-200 text-slate-700 text-xl font-bold">{selectedProp.student[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 mb-1">{selectedProp.student}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedProp.studentId}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedProp.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {selectedProp.status === "pending" && (
                      <>
                        <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800" onClick={() => setShowConfirmModal("reject")}>
                          <XCircle className="w-4 h-4 mr-2" /> Татгалзах
                        </Button>
                        <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800" onClick={() => setShowConfirmModal("feedback")}>
                          <MessageSquare className="w-4 h-4 mr-2" /> Засвар шаардах
                        </Button>
                        <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white" onClick={() => setShowConfirmModal("approve")}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Батлах
                        </Button>
                      </>
                    )}
                    {selectedProp.status === "dept_review" && (
                      <Badge className="bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 px-3 py-1.5 align-middle">
                        <AlertCircle className="w-4 h-4 mr-1.5" /> Тэнхим батлах хүлээгдэж байна
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-6">
                  <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-5">
                    <p className="text-xs font-semibold text-[#1455BD] uppercase tracking-wider mb-2">Оюутны дэвшүүлсэн сэдвийн нэр</p>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{selectedProp.title}</h4>
                    <div className="flex gap-2 flex-wrap mt-3">
                      {selectedProp.keywords.map(kw => (
                        <span key={kw} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium border border-slate-200">{kw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Судалгааны зорилго</h5>
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-amber-900 leading-relaxed text-sm font-medium">
                        {selectedProp.goal}
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Сэдвийн дэлгэрэнгүй тайлбар</h5>
                      <p className="text-sm text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100">
                        {selectedProp.description}
                      </p>
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
          title={
            showConfirmModal === "approve" ? "Сэдвийг батлах" : 
            showConfirmModal === "reject" ? "Сэдвээс татгалзах" : 
            "Засварт буцаах"
          } 
          icon={
            showConfirmModal === "approve" ? <CheckCircle2 className="w-5 h-5 text-[#1455BD]" /> : 
            showConfirmModal === "reject" ? <AlertCircle className="w-5 h-5 text-rose-600" /> :
            <MessageSquare className="w-5 h-5 text-amber-600" />
          } 
          onClose={() => setShowConfirmModal(null)} 
        />
        <DialogBody>
          {showConfirmModal === "approve" ? (
            <p className="text-slate-600">
              Та <strong>{selectedProp?.student}</strong> оюутны дэвшүүлсэн сэдвийг батлахдаа итгэлтэй байна уу? Ингэснээр энэ сэдэв уг оюутны албан ёсны дипломын сэдэв болон батлагдах болно.
            </p>
          ) : showConfirmModal === "reject" ? (
            <p className="text-slate-600">
              Та уг сэдвээс бүр мөсөн татгалзах гэж байна. Сэдэв шаардлага хангаагүй тохиолдолд үүнийг сонгоно уу.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600">
                Та уг сэдэвт засвар шаардаж оюутан руу буцаах гэж байна. Засварын талаарх тайлбараа үлдээнэ үү.
              </p>
              <Textarea 
                placeholder="Санал хүсэлт болон сайжруулах зүйлсийг дэлгэрэнгүй бичнэ үү..." 
                rows={4} 
                className="text-sm"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmModal(null)}>Цуцлах</Button>
          <Button 
            className={
              showConfirmModal === "approve" ? "bg-[#1455BD] hover:bg-[#0d3a8a] text-white" : 
              showConfirmModal === "reject" ? "bg-rose-600 hover:bg-rose-700 text-white" :
              "bg-amber-600 hover:bg-amber-700 text-white"
            } 
            onClick={handleAction}
            disabled={showConfirmModal === "feedback" && feedbackText.trim() === ""}
          >
            {
              showConfirmModal === "approve" ? "Батлах" : 
              showConfirmModal === "reject" ? "Татгалзах" :
              "Илгээх"
            }
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
