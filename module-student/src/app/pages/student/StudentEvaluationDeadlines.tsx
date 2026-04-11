import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import {
  Calendar, Clock, CheckCircle2, ChevronDown, ChevronUp,
  MapPin, Users, AlertCircle, CalendarDays, List, AlertTriangle
} from "lucide-react";

// Mock Data
const evaluations = [
  {
    id: 1,
    stage: "Явцын тайлан 1",
    status: "completed",
    score: "15/15",
    reviewersCompleted: 1,
    totalReviewers: 1,
    deadline: "2025-12-15",
    comments: [
      { reviewer: "Б.Батням", score: "15/15", comment: "Сайн байна" },

    ],
    isExpanded: false
  },
  {
    id: 2,
    stage: "Явцын тайлан 2",
    status: "completed",
    score: "20/20",
    reviewersCompleted: 4,
    totalReviewers: 4,
    deadline: "2026-03-23",
    comments: [
      { reviewer: "Б.Батням", score: "19/20", comment: "Аргачлалд гайхалтай дэвшил." },
      { reviewer: "Ж.Үйтүмэн", score: "20/20", comment: "Графикыг илүү тод болгох шаардлагатай." },
      { reviewer: "Ж.Золжаргал", score: "20/20", comment: "Хүчтэй урьдчилсан үр дүнгүүд." },
      { reviewer: "Н.Даваасүрэн", score: "20/20", comment: "Хүчтэй урьдчилсан үр дүнгүүд." }
    ],
    isExpanded: false
  },
  {
    id: 3,
    stage: "Урьдчилсан хамгаалалт",
    status: "active",
    score: "Хүлээгдэж байна",
    reviewersCompleted: 4,
    totalReviewers: 4,
    deadline: "2026-04-24",
    comments: [
      { reviewer: "Д.Сувдаа", score: "Хүлээгдэж байна", comment: "Эцсийн ноорогийг хүлээж байна." },
      { reviewer: "Б.Батням", score: "Хүлээгдэж байна", comment: "Ноорог хүлээн авсан, хянаж байна." }
    ],
    isExpanded: true
  },
  {
    id: 4,
    stage: "Эцсийн хамгаалалт",
    status: "pending",
    score: "--/100",
    reviewersCompleted: 0,
    totalReviewers: 5,
    deadline: "2026-06-01",
    comments: [],
    isExpanded: false
  }
];

const deadlines = [
  {
    id: 1,
    title: "Урьдчилсан хамгаалалтын тайлан илгаах",
    date: "2026-03-22T23:59:00",
    daysLeft: -2,
    status: "overdue"
  },
  {
    id: 2,
    title: "Урьдчилсан хамгаалалтын танилцуулгын слайд",
    date: "2026-04-13T23:59:00",
    daysLeft: 3,
    status: "urgent"
  },
  {
    id: 3,
    title: "Эцсийн хамгаалалтын ноорог",
    date: "2026-05-15T23:59:00",
    daysLeft: 35,
    status: "upcoming"
  }
];

const defenseEvent = {
  type: "Урьдчилсан хамгаалалтын дотоод хяналт",
  date: "Баасан, 2026 оны 4-р сарын 15",
  time: "10:00 - 11:30",
  room: "В байр, 302 тоот семинарын өрөө",
  committee: ["Д.Сувдаа (Дарга)", "Б.Батням", "Д.Түвшинжаргал"]
};

export default function StudentEvaluationDeadlines() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [evalCards, setEvalCards] = useState(evaluations);

  const toggleExpand = (id: number) => {
    setEvalCards(cards => cards.map(c =>
      c.id === id ? { ...c, isExpanded: !c.isExpanded } : c
    ));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 flex flex-col xl:flex-row gap-6">

      {/* Зүүн багана: Үнэлгээний ажлын урсгал */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#1455BD]" />
              Үнэлгээний ажлын урсгал
            </h1>
            <p className="text-slate-600 mt-1">Үнэлгээний аргачлал болон дүнгийн мэдээлэ.</p>
          </div>
        </div>

        <div className="relative border-l-2 border-slate-100 space-y-6 ml-4 sm:ml-6 pb-4">
          {evalCards.map((stage) => (
            <div key={stage.id} className="relative pl-6 sm:pl-8">

              {/* Цаг хугацааны цэг */}
              <div className={`absolute -left-[11px] top-5 w-5 h-5 rounded-full border-4 bg-white z-10 transition-colors ${stage.status === 'completed' ? 'border-[#1455BD]' :
                stage.status === 'active' ? 'border-orange-400' :
                  'border-slate-200'
                }`}>
                {stage.status === 'active' && <div className="absolute inset-[-4px] rounded-full border border-orange-200 animate-ping opacity-75"></div>}
              </div>

              <Card className={`transition-all duration-200 shadow-sm ${stage.status === 'active' ? 'border-orange-200 shadow-orange-100/50 relative overflow-hidden' : 'border-slate-200 hover:border-[#1455BD]/30'
                }`}>
                {stage.status === 'active' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400" />}

                <CardHeader
                  className={`p-5 pb-4 cursor-pointer select-none ${stage.status === 'active' ? 'bg-orange-50/20' : ''}`}
                  onClick={() => toggleExpand(stage.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-lg font-bold ${stage.status === 'pending' ? 'text-slate-500' : 'text-slate-900'}`}>
                        {stage.stage}
                      </h3>
                      {stage.status === 'completed' && <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Дууссан</Badge>}
                      {stage.status === 'active' && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">Явцад</Badge>}
                      {stage.status === 'pending' && <Badge variant="outline" className="text-slate-500">Хүлээгдэж байна</Badge>}
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{stage.reviewersCompleted} / {stage.totalReviewers} хянасан</span>
                      </div>
                      <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
                      <div className={`text-lg font-bold ${stage.status === 'completed' ? 'text-[#1455BD]' : 'text-slate-400'}`}>
                        {stage.score}
                      </div>
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-slate-400">
                        {stage.isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Хянагчийн дэвшлийн мөр */}
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={(stage.reviewersCompleted / stage.totalReviewers) * 100} className="h-1.5 flex-1" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest shrink-0">
                      {Math.round((stage.reviewersCompleted / stage.totalReviewers) * 100)}% дууссан
                    </span>
                  </div>
                </CardHeader>

                {stage.isExpanded && (
                  <CardContent className="p-5 pt-0 border-t border-slate-100">
                    <div className="space-y-4 pt-4">
                      {stage.comments.length > 0 ? stage.comments.map((comment, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                          <Avatar className="h-8 w-8 border border-slate-200">
                            <AvatarFallback className="bg-white text-slate-600 text-xs font-bold">
                              {comment.reviewer.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-sm text-slate-900">{comment.reviewer}</span>
                              <Badge variant="outline" className={`font-mono text-xs ${comment.score === 'Хүлээгдэж байна' ? 'text-slate-400 border-slate-200' : 'text-[#1455BD] border-blue-200 bg-blue-50'}`}>
                                {comment.score}
                              </Badge>
                            </div>
                            <p className={`text-sm ${comment.score === 'Хүлээгдэж байна' ? 'text-slate-500 italic' : 'text-slate-700'}`}>
                              "{comment.comment}"
                            </p>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center p-6 bg-slate-50 rounded-lg text-slate-500 text-sm">
                          Энэ шатан дээр үнэлгээний дүн байхгүй байна.
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Баруун багана: Эцсийн хугацаа ба хамгаалалт */}
      <div className="w-full xl:w-80 space-y-6 shrink-0 mt-[4.5rem]">

        {/* Эцсийн хугацааны хэсэг */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Calendar className="w-5 h-5 text-[#1455BD]" />
                Эцсийн хугацаанууд
              </CardTitle>
              <div className="flex bg-slate-100 rounded-md p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1455BD]' : 'text-slate-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-1.5 rounded-sm transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-[#1455BD]' : 'text-slate-500'}`}
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {deadlines.map((deadline) => (
              <div key={deadline.id} className={`p-4 rounded-xl border relative overflow-hidden transition-all ${deadline.status === 'overdue' ? 'bg-rose-50 border-rose-200 hover:border-rose-300' :
                deadline.status === 'urgent' ? 'bg-orange-50 border-orange-200 hover:border-orange-300' :
                  'bg-white border-slate-200 hover:border-blue-200'
                }`}>
                {(deadline.status === 'overdue' || deadline.status === 'urgent') && (
                  <div className={`absolute top-0 right-0 w-1.5 h-full ${deadline.status === 'overdue' ? 'bg-rose-500' : 'bg-orange-400'}`} />
                )}

                <div className="flex justify-between items-start mb-2 pr-2">
                  <Badge className={`border-0 rounded-sm font-semibold px-2 py-0.5 ${deadline.status === 'overdue' ? 'bg-rose-100 text-rose-800' :
                    deadline.status === 'urgent' ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                    {deadline.status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1 inline" />}
                    {deadline.status === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                    {deadline.status === 'overdue' ? `${Math.abs(deadline.daysLeft)} ХОНОГООР ХОЦОРСОН` :
                      deadline.status === 'urgent' ? `${deadline.daysLeft} ХОНОГ ҮЛДСЭН` :
                        `${deadline.daysLeft} хоногийн дараа`}
                  </Badge>
                </div>

                <h4 className={`font-semibold text-sm mb-1 line-clamp-2 ${deadline.status === 'overdue' ? 'text-rose-950' :
                  deadline.status === 'urgent' ? 'text-orange-950' : 'text-slate-800'
                  }`}>
                  {deadline.title}
                </h4>

                <p className="text-xs text-slate-500 flex items-center font-medium mt-2">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {new Date(deadline.date).toLocaleDateString('mn-MN', { month: 'long', day: 'numeric' })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Удахгүй болох хамгаалалт */}
        <Card className="border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-[#1455BD]">
          <CardHeader className="bg-[#1455BD]/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#1455BD]">
              Удахгүй болох хамгаалалт
            </CardTitle>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{defenseEvent.type}</h3>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-3 relative">

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1455BD] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Огноо</p>
                  <p className="text-sm font-medium text-slate-900">{defenseEvent.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1455BD] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Цаг</p>
                  <p className="text-sm font-medium text-slate-900">{defenseEvent.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1455BD] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Байршил</p>
                  <p className="text-sm font-medium text-slate-900">{defenseEvent.room}</p>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Комиссын бүрэлдэхүүн</p>
              <div className="space-y-2">
                {defenseEvent.committee.map((member, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-slate-200">
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {member.replace(' (Дарга)', '').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`text-sm ${member.includes('Дарга') ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                      {member}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50">
              Хуваарьт нэмэх
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
