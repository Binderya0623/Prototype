import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Users, FileText, CheckCircle, Clock, Calendar,
  ArrowRight, Activity, TrendingUp, AlertCircle
} from "lucide-react";

// Mock Data
const stats = [
  { label: "Хуваарилагдсан оюутнууд", value: 12, icon: Users, color: "text-[#1455BD]", bg: "bg-blue-50" },
  { label: "Хүлээгдэж буй тайлан", value: 5, icon: FileText, color: "text-orange-600", bg: "bg-orange-50", urgent: true },
  { label: "Удахгүй болох үнэлгээ", value: 3, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Дууссан хяналт", value: 28, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
];

const pendingReports = [
  { id: 1, student: "Д.Оч", type: "Явц 2-ын тайлан", date: "2 өдрийн өмнө илгээсэн", urgency: "high" },
  { id: 2, student: "Б.Батбаяр", type: "Урьдчилсан хамгаалалтын ноорог", date: "3 өдрийн өмнө илгээсэн", urgency: "high" },
  { id: 3, student: "С.Мөнхбаяр", type: "Явц 1-ийн тайлан", date: "Өнөөдөр илгээсэн", urgency: "normal" },
];

const upcomingEvaluations = [
  { id: 1, type: "Урьдчилсан хамгаалалтын хяналтын хороо", student: "Д.Оч", date: "2026-03-25T10:00:00", daysLeft: 6 },
  { id: 2, type: "Эцсийн хамгаалалт", student: "Б.Батбаяр", date: "2026-04-10T14:00:00", daysLeft: 22 },
];

const activityFeed = [
  { id: 1, text: "Д.Оч-ны судалгааны төлөвлөгөөг зөвшөөрлөо.", time: "2 цагийн өмнө", icon: CheckCircle, color: "text-emerald-500" },
  { id: 2, text: "Б.Батбаяр урьдчилсан хамгаалалтын шинэ ноорог оруулав.", time: "5 цагийн өмнө", icon: Upload, color: "text-blue-500" },
  { id: 3, text: "С.Мөнхбаяр-ны эцсийн хамгаалалтад комисс томилогдлоо.", time: "1 өдрийн өмнө", icon: Users, color: "text-purple-500" },
  { id: 4, text: "Т.Түвшинбаяр-ны 2-р бүлэгт тайлбар нэмлээ.", time: "2 өдрийн өмнө", icon: MessageSquare, color: "text-slate-500" },
];

// Re-using lucide icons for feed since standard ones weren't imported
import { Upload, MessageSquare } from "lucide-react";

export default function TeacherDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Хянах самбар</h1>
          <p className="text-slate-600 mt-1">Өнөөдөр оюутнуудтай холбоотой тойм мэдээлэл.</p>
        </div>
        <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white shadow-sm transition-all rounded-lg">
          <FileText className="w-4 h-4 mr-2" />
          Бүх хүлээгдэж буйг хянах
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
              {stat.urgent && (
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                  <div className="absolute top-[8px] -right-[14px] bg-rose-500 text-white text-[8px] font-bold uppercase tracking-widest py-0.5 px-4 rotate-45 shadow-sm">
                    Action
                  </div>
                </div>
              )}
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110 duration-300 ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Pending Reports */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
              <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Хянах шаардлагатай тайлан
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#1455BD] text-xs h-8">
                Дараалал харах
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {pendingReports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-200">
                        <AvatarFallback className="bg-blue-50 text-[#1455BD] text-xs font-bold">
                          {report.student.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-slate-900">{report.student}</p>
                          {report.urgency === 'high' && (
                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0 text-[10px] px-1.5 py-0 rounded">
                              Яаралтай
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{report.type} • {report.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-200 bg-white hover:bg-slate-50 hover:text-[#1455BD] shadow-sm shrink-0">
                      Одоо хянах
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                <Activity className="w-5 h-5 mr-2 text-[#1455BD]" />
                Сүүлийн үйл ажиллагаа
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative border-l-2 border-slate-100 space-y-6 ml-2">
                {activityFeed.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                        <div className={`w-1.5 h-1.5 rounded-full bg-slate-300`} />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                        <p className="text-sm text-slate-700"><span className="font-medium mr-1.5 inline-flex items-center"><Icon className={`w-4 h-4 mr-1 ${activity.color}`} /></span>{activity.text}</p>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs text-[#1455BD] mt-4 hover:bg-blue-50/50">
                Дэлгэрэнгүй харах
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">

          {/* Upcoming Evaluations */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 bg-[#1455BD]/5">
              <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                <Calendar className="w-5 h-5 mr-2 text-[#1455BD]" />
                Удахгүй болох үнэлгээ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 bg-slate-50/30">
              {upcomingEvaluations.map((evalItem) => (
                <div key={evalItem.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#1455BD]/30 hover:shadow-sm transition-all group cursor-pointer relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1455BD]/20 group-hover:bg-[#1455BD] transition-colors" />

                  <div className="flex justify-between items-start mb-2 pl-2">
                    <Badge variant="outline" className="bg-blue-50/50 text-[#1455BD] border-blue-100 font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {evalItem.daysLeft} хоногийн дараа
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1455BD] transition-colors" />
                  </div>

                  <div className="pl-2">
                    <h4 className="font-semibold text-sm text-slate-900 leading-snug">{evalItem.type}</h4>
                    <p className="text-xs text-slate-600 mt-1">Оюутан: <span className="font-medium">{evalItem.student}</span></p>
                    <p className="text-xs font-medium text-slate-400 mt-2 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(evalItem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full text-xs font-semibold text-slate-600 border-slate-200 mt-2 hover:bg-slate-50 hover:text-[#1455BD] shadow-sm">
                Бүтэн хуваарь харах
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats Mini */}
          <Card className="border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Улирлын явц
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">Хэвийн явцтай оюутнууд</span>
                    <span className="font-bold text-slate-900">10/12</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '83%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">Комиссын даалгавар дууссан</span>
                    <span className="font-bold text-slate-900">8/15</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1455BD]" style={{ width: '53%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
