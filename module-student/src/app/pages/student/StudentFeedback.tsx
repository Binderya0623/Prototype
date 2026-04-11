import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  MessageSquare, Clock, FileText, ChevronDown, ChevronUp,
  CheckCircle2, Bell, Paperclip, Reply, AlignLeft
} from "lucide-react";

// Mock data
const feedbackData = [
  {
    id: 1,
    teacher: "Б.Батням",
    role: "Үндсэн удирдагч",
    date: "2026-03-18 14:30",
    stage: "Урьдчилсан хамгаалалт",
    stageColor: "bg-blue-100 text-[#1455BD]",
    comment: "Таны аргачлалын хэсэг мэдэгдэхүйц сайжирсан. Гэхдээ өвчтөний мэдээллийн нууцлалтай холбоотой ёс зүйн асуудлыг хөндөх шаардлагатай хэвээр байна. Мэдээллийн нэрийгүй болгох талаарх тусдаа дэд хэсэг нэмнэ үү.",
    hasAttachment: true,
    attachmentName: "Аргачлалын_хяналтын_тэмдэглэл.pdf",
    revisionNotes: "Мэдээллийн нууцлал ба ёс зүйн 3.4 хэсгийг нэмлээ. HIPAA-ийн бүх журам дурдагдсан байгааг баталгаажуулсан.",
    revisionStatus: "addressed",
    isExpanded: true,
  },
  {
    id: 2,
    teacher: "Д.Түвшинжаргал",
    role: "Комиссын гишүүн",
    date: "2026-03-10 09:15",
    stage: "Явцын тайлан 2",
    stageColor: "bg-purple-100 text-purple-700",
    comment: "4-р бүлгийн сургалтын гүйцэтгэлийн графикууд арай уншиход бэрх байна. Алдагдлын муруй дээр логарифм масштаб ашиглахыг санал болгож байна, тэнхлэгүүдийг нэгжтэй тодорхой тэмдэглэнэ үү.",
    hasAttachment: false,
    revisionNotes: "Matplotlib скриптийг log масштаб ашиглахаар шинэчиллээ. 4-р бүлгийн графикуудыг дахин байгуулсан.",
    revisionStatus: "addressed",
    isExpanded: false,
  },
  {
    id: 3,
    teacher: "Б.Батням",
    role: "Үндсэн удирдагч",
    date: "2026-02-15 16:45",
    stage: "Явцын тайлан 1",
    stageColor: "bg-emerald-100 text-emerald-700",
    comment: "Уран зохиолын тойм сайн эхэлсэн. Үндсэн CNN архитектуруудыг (ResNet, VGG гэх мэт) бүрхсэн боловч эмнэлгийн зургийн Vision Transformer-тай холбоотой 2024-2025 оны сүүлийн нийтлэлүүдийг орхигдуулсан байна.",
    hasAttachment: true,
    attachmentName: "Санал_болгосон_нийтлэлийн_жагсаалт.docx",
    revisionNotes: "2.3 хэсэгт ViT-тай холбоотой 6 шинэ нийтлэл оруулсан. Классик CNN-тэй харьцуулсан.",
    revisionStatus: "addressed",
    isExpanded: false,
  },
];

export default function StudentFeedback() {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });

  const toggleExpand = (id: number) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">

      {/* Хуудасны гарчиг */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#1455BD]" />
            Удирдагчийн санал хүсэлт
          </h1>
          <p className="text-slate-600 mt-1">Тайлбар, зөвлөмжийг харж, засваруудынхаа дэвшлийг хянах.</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-blue-50 text-[#1455BD] border-blue-100 hover:bg-blue-100 flex items-center gap-1.5 px-3 py-1.5">
            <Bell className="w-3.5 h-3.5" />
            1 хүлээгдэж буй засвар
          </Badge>
          <Button variant="outline" className="border-slate-200 text-slate-700">
            <AlignLeft className="w-4 h-4 mr-2" />
            Шатаар шүүх
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">

        {/* Цаг хугацааны шугам */}
        <div className="relative border-l-2 border-slate-100 space-y-8 pb-4 ml-4 sm:ml-6">

          {feedbackData.map((feedback, index) => {
            const isExpanded = expandedCards[feedback.id];

            return (
              <div key={feedback.id} className="relative pl-6 sm:pl-8 group">

                {/* Цэг */}
                <div className="absolute -left-[11px] top-6 w-5 h-5 rounded-full bg-white border-4 border-slate-100 group-hover:border-[#1455BD] transition-colors z-10" />

                <Card className={`border transition-all duration-200 shadow-sm ${feedback.revisionStatus === 'pending'
                    ? 'border-orange-200 bg-orange-50/10'
                    : 'border-slate-200 hover:border-blue-200'
                  }`}>
                  <CardContent className="p-0">

                    {/* Карт гарчиг */}
                    <div
                      className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer"
                      onClick={() => toggleExpand(feedback.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200 mt-1">
                          <AvatarFallback className="bg-blue-50 text-[#1455BD] font-semibold">
                            {feedback.teacher.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{feedback.teacher}</h3>
                            <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 uppercase tracking-wider font-semibold px-1.5 py-0">
                              {feedback.role}
                            </Badge>
                            <span className="text-xs text-slate-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {feedback.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`border-0 ${feedback.stageColor}`}>
                              {feedback.stage}
                            </Badge>
                            {feedback.hasAttachment && (
                              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                                <Paperclip className="w-3 h-3 mr-1" /> Хавсралт
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" className="shrink-0 text-slate-400 self-end sm:self-start">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </Button>
                    </div>

                    {/* Дэлгэрэнгүй агуулга */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">

                        {/* Тайлбар */}
                        <div className="bg-slate-50/80 rounded-lg p-4 mb-4 text-sm text-slate-700 leading-relaxed border border-slate-100">
                          {feedback.comment}
                        </div>

                        {/* Хавсралтууд */}
                        {feedback.hasAttachment && (
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md py-1.5 px-3 hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
                              <FileText className="w-4 h-4 text-[#1455BD]" />
                              <span className="text-sm font-medium text-slate-700">{feedback.attachmentName}</span>
                            </div>
                          </div>
                        )}

                        {/* Засварын тэмдэглэл */}
                        <div className="mt-6">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                            <Reply className="w-4 h-4 text-[#1455BD]" />
                            Таны засварын тэмдэглэл
                          </h4>

                          {feedback.revisionNotes ? (
                            <div className={`p-4 rounded-lg border text-sm ${feedback.revisionStatus === 'addressed'
                                ? 'bg-green-50/50 border-green-100'
                                : 'bg-white border-slate-200'
                              }`}>
                              <p className="text-slate-700 mb-3">{feedback.revisionNotes}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className={`text-xs font-semibold uppercase tracking-wider flex items-center ${feedback.revisionStatus === 'addressed' ? 'text-green-700' : 'text-slate-500'
                                  }`}>
                                  {feedback.revisionStatus === 'addressed' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                                  {feedback.revisionStatus === 'addressed' ? 'Хаасан' : 'Хянагдaj байна'}
                                </span>
                                <Button variant="link" size="sm" className="text-[#1455BD] h-auto p-0">Тэмдэглэл засварлах</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Энэ санал хүсэлтийг хэрхэн шийдсэн тухай тэмдэглэл нэмэх..."
                                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1455BD]"
                              />
                              <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white shrink-0">
                                Хадгалах
                              </Button>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* Цаг хугацааны эхлэл */}
          <div className="relative pl-8 pt-4">
            <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-slate-200 z-10" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-2">Диплом эхэлсэн</p>
          </div>

        </div>
      </div>
    </div>
  );
}
