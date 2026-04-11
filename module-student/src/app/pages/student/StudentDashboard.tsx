import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import { FileText, MessageSquare, Calendar, TrendingUp, Upload, Eye, Bell, CheckCircle2, Clock, ArrowRight, BookOpen } from "lucide-react";

// Mock data
const thesisData = {
  title: "CNN ашиглан эмнэлгийн зургийн оношлогоонд гүн суралцахуй",
  stage: "Урьдчилсан хамгаалалт",
  progress: 75,
  status: "Хийгдэж байна",
  supervisor: "Dr. Sarah Mitchell"
};

const stages = [
  { id: 1, name: "Сэдвийн санал", status: "completed", date: "1-р сарын 15" },
  { id: 2, name: "Явцын тайлан 1", status: "completed", date: "2-р сарын 10" },
  { id: 3, name: "Явцын тайлан 2", status: "completed", date: "3-р сарын 05" },
  { id: 4, name: "Урьдчилсан хамгаалалт", status: "active", date: "3-р сарын 25" },
  { id: 5, name: "Эцсийн хамгаалалт", status: "pending", date: "4-р сарын 20" },
];

const deadlines = [
  { id: 1, title: "Урьдчилсан хамгаалалтын тайлан илгаах", date: "2026-03-22T23:59:00", daysLeft: 3, urgency: "high" },
  { id: 2, title: "Комиссын хяналтын цонх", date: "2026-03-25T00:00:00", daysLeft: 6, urgency: "medium" },
];

const latestFeedback = [
  { id: 1, teacher: "Д.Сувдаа", comment: "3-р бүлгийн дэвшил сайн байна. Мэдээллийн өргөжүүлэлтийн талаарх дэлгэрэнгүй мэдээллийг аргачлалын хэсэгт оруулна уу.", stage: "Явцын тайлан 2", date: "2 өдрийн өмнө" },
  { id: 2, teacher: "Б.Батням", comment: "Уран зохиолын тоймын бичих нь тогтвортой харагдаж байна. 2024 оны сүүлийн нийтлэлүүдийг заавал дурдаарай.", stage: "Явцын тайлан 2", date: "5 өдрийн өмнө" },
];

const notifications = [
  { id: 1, message: "Д.Сувдаа таны Явцын тайлан 2-ыг зөвшөөрлөө.", time: "1 өдрийн өмнө", read: false, type: "approval" },
  { id: 2, message: "Урьдчилсан хамгаалалтын огноог 3-р сарын 25-нд товлолоо.", time: "3 өдрийн өмнө", read: true, type: "system" },
  { id: 3, message: "Сануулга: Танилцуулгын слайдыг хамгаалалтаас 48 цагийн өмнө оруулна уу.", time: "1 долоо хоногийн өмнө", read: true, type: "reminder" },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* Хурдан үйлдлүүд */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white shadow-sm transition-all rounded-lg">
          <Eye className="h-4 w-4 mr-2" />
          Дипломоо харах
        </Button>
        <Button variant="outline" className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-[#1455BD] shadow-sm transition-all rounded-lg">
          <Upload className="h-4 w-4 mr-2" />
          Тайлан оруулах
        </Button>
        <Button variant="outline" className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-[#1455BD] shadow-sm transition-all rounded-lg">
          <MessageSquare className="h-4 w-4 mr-2" />
          Санал хүсэлт харах
        </Button>
        <Button variant="outline" className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-[#1455BD] shadow-sm transition-all rounded-lg">
          <Calendar className="h-4 w-4 mr-2" />
          Эцсийн хугацааг шалгах
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* Зүүн гол агуулга */}
        <div className="lg:col-span-2 space-y-6">

          {/* Явцын хураангуй карт */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
            <div className="h-2 w-full bg-slate-100">
              <div className="h-full bg-[#1455BD] rounded-r-full transition-all duration-1000" style={{ width: `${thesisData.progress}%` }} />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-50 text-[#1455BD] border border-blue-100 hover:bg-blue-100/80 font-medium rounded-md py-1 px-2.5">
                      {thesisData.status}
                    </Badge>
                    <span className="text-sm font-medium text-slate-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      Шат: {thesisData.stage}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight pr-4">
                    {thesisData.title}
                  </h2>
                </div>
                <div className="text-right shrink-0 bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <div className="text-3xl font-extrabold text-[#1455BD]">{thesisData.progress}%</div>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Дууссан</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center">
                  <Avatar className="h-7 w-7 mr-2 outline outline-1 outline-slate-200">
                    <AvatarFallback className="bg-blue-100 text-[#1455BD] text-xs font-bold">SM</AvatarFallback>
                  </Avatar>
                  <span className="text-slate-500">Удирдагч багш:</span>
                  <span className="font-medium text-slate-900 ml-1.5">{thesisData.supervisor}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Эрдэм шинжилгээний цаг хугацааны шугам */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                <TrendingUp className="w-5 h-5 mr-2 text-[#1455BD]" />
                Эрдэм шинжилгээний хуваарь
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute top-[18px] left-[10%] w-[80%] h-[2px] bg-slate-100 -z-10"></div>
                <div
                  className="absolute top-[18px] left-[10%] h-[2px] bg-[#1455BD] transition-all duration-1000 -z-10"
                  style={{ width: '55%' }}
                ></div>

                <div className="flex justify-between">
                  {stages.map((stage) => (
                    <div key={stage.id} className="flex flex-col items-center group relative w-1/5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stage.status === 'completed'
                            ? 'bg-[#1455BD] border-[#1455BD] text-white shadow-sm'
                            : stage.status === 'active'
                              ? 'bg-white border-[#1455BD] text-[#1455BD] ring-4 ring-blue-50 shadow-md scale-110'
                              : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'
                          }`}
                      >
                        {stage.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : stage.status === 'active' ? (
                          <div className="w-2.5 h-2.5 bg-[#1455BD] rounded-full animate-pulse" />
                        ) : (
                          <span className="text-sm font-semibold">{stage.id}</span>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <p className={`text-xs font-semibold ${stage.status === 'active' ? 'text-[#1455BD]' : 'text-slate-700'}`}>
                          {stage.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{stage.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Сүүлийн санал хүсэлт */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50 rounded-t-xl">
              <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                <MessageSquare className="w-5 h-5 mr-2 text-[#1455BD]" />
                Сүүлийн санал хүсэлт
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#1455BD] text-xs h-8 -mr-2">
                Бүгдийг харах
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {latestFeedback.map((fb) => (
                  <div key={fb.id} className="p-5 hover:bg-slate-50/80 transition-colors group cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#1455BD] transition-colors" />
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 outline outline-1 outline-slate-200">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                            {fb.teacher.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-semibold text-slate-900 leading-none">{fb.teacher}</span>
                          <span className="text-[11px] text-slate-500 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {fb.date}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 uppercase tracking-wider shrink-0 mt-0.5">
                        {fb.stage}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed pl-12 pr-4 group-hover:text-slate-900 transition-colors">
                      "{fb.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Баруун хажуу самбар */}
        <div className="space-y-6">

          {/* Эцсийн хугацаа хэсэг */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-[#1455BD]/5">
              <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                <Calendar className="w-5 h-5 mr-2 text-[#1455BD]" />
                Удахгүй болох эцсийн хугацаа
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 bg-slate-50/30">
              {deadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={`p-4 rounded-xl border relative overflow-hidden ${deadline.urgency === 'high'
                      ? 'bg-rose-50/80 border-rose-200'
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md'
                    } transition-all cursor-pointer group`}
                >
                  {deadline.urgency === 'high' && (
                    <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                      <div className="absolute top-[8px] -right-[14px] bg-rose-500 text-white text-[8px] font-bold uppercase tracking-widest py-0.5 px-4 rotate-45 shadow-sm">
                        Яаралтай
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      className={
                        deadline.urgency === 'high'
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-0 rounded pl-2.5 pr-2'
                          : 'bg-blue-50 text-[#1455BD] hover:bg-blue-100 border-0 rounded pl-2.5 pr-2'
                      }
                    >
                      <Clock className="w-3 h-3 mr-1 text-inherit opacity-70" />
                      {deadline.daysLeft} хоног үлдсэн
                    </Badge>
                    <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${deadline.urgency === 'high' ? 'text-rose-600' : 'text-[#1455BD]'}`} />
                  </div>
                  <h4 className={`font-semibold text-sm mb-1.5 leading-snug pr-4 ${deadline.urgency === 'high' ? 'text-rose-950' : 'text-slate-800'}`}>
                    {deadline.title}
                  </h4>
                  <p className={`text-xs flex items-center font-medium ${deadline.urgency === 'high' ? 'text-rose-700/80' : 'text-slate-500'}`}>
                    Дуусах {new Date(deadline.date).toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' })} цагт {new Date(deadline.date).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs font-semibold text-slate-600 border-slate-200 mt-2 hover:bg-slate-50 hover:text-[#1455BD] shadow-sm">
                Хуваарь нээх
              </Button>
            </CardContent>
          </Card>

          {/* Мэдэгдлүүд */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                <Bell className="w-5 h-5 mr-2 text-[#1455BD]" />
                Мэдэгдлүүд
              </CardTitle>
              <Badge className="bg-[#1455BD] text-white hover:bg-[#0d3a8a] transition-colors rounded-sm px-1.5 py-0 h-5">2 шинэ</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer relative ${notif.read ? 'opacity-70' : ''}`}
                  >
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1455BD]" />
                    )}
                    <div className="shrink-0 mt-0.5 pl-1 text-slate-400">
                      {notif.type === 'approval' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                        notif.type === 'reminder' ? <Clock className="w-4 h-4 text-orange-500" /> :
                          <Bell className="w-4 h-4 text-[#1455BD]" />}
                    </div>
                    <div>
                      <p className={`text-sm leading-snug ${!notif.read ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1.5">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex justify-center">
                <Button variant="link" size="sm" className="text-xs text-[#1455BD] h-auto p-0 font-semibold hover:text-[#0d3a8a]">
                  Бүгдийг уншсан гэж тэмдэглэх
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}