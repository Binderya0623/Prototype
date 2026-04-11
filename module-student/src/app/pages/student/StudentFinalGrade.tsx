import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Award, Download, CheckCircle, FileText, ChevronRight, GraduationCap } from "lucide-react";

// Mock Data
const finalGradeData = {
  studentName: "Б.Сувдаа",
  studentId: "22B1NUM0001",
  thesisTitle: "CNN ашиглан эмнэлгийн зургийн оношлогоонд гүн суралцахуй",
  department: "Компьютерын ухаан",
  supervisor: "Б.Батням",
  finalScore: 92,
  letterGrade: "A",
  status: "Published",
  publishDate: "2026-06-15",

  breakdown: [
    { stage: "Явцын тайлан 1", weight: "15%", score: "14/15", details: "Хүчтэй уран зохиолын тойм." },
    { stage: "Явцын тайлан 2", weight: "20%", score: "18/20", details: "Сайн аргачлал, илүү их мэдээлэл шаардлагатай байсан." },
    { stage: "Урьдчилсан хамгаалалтын ноорог", weight: "25%", score: "24/25", details: "Сайн бүтэцтэй бичгийн тайлан." },
    { stage: "Шүүмж", weight: "5%", score: "5/5", details: "Сайн бүтэцтэй бичгийн тайлан." },
    { stage: "Эцсийн хамгаалалтын танилцуулга", weight: "35%", score: "35/35", details: "Гайхалтай танилцуулга ба асуулт-хариулт." },
  ],

  committeeComments: "Эмнэлгийн чиглэлд конволюцын нейрон сүлжээний гүн ойлголтыг харуулсан онцгой судалгааны ажил. Практик хэрэгжилт нь гажиггүй, танилцуулга нь маш итгэлтэйгээр хийгдсэн. Нийтлэлийн зориулалтад тун тохиромжтой."
};

export default function StudentFinalGrade() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">

      {/* Гарчиг */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#1455BD]" />
            Албан ёсны эцсийн дүн
          </h1>
          <p className="text-slate-600 mt-1">Эцсийн дипломын үнэлгээ болон нийт оноогоо харах.</p>
        </div>

        {finalGradeData.status === "Published" && (
          <Button className="bg-[#1455BD] hover:bg-[#0d3a8a] text-white shadow-sm transition-all rounded-lg">
            <Download className="w-4 h-4 mr-2" />
            PDF транскрипт татах
          </Button>
        )}
      </div>

      {finalGradeData.status !== "Published" ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50 text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Үр дүн нийтлэгдээгүй байна</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Таны эцсийн дүнг дипломын комисс болон эрдэм шинжилгээний бүртгэл боловсруулж байна. Албан ёсны үр дүн гарсны дараа мэдэгдэл ирнэ.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">

          {/* Үндсэн үр дүн карт */}
          <Card className="border-slate-200 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10 opacity-50" />

            <CardHeader className="pb-2 border-b border-slate-100 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-[#1455BD] rounded-lg">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900">Дипломын үнэлгээний үр дүн</CardTitle>
                    <CardDescription className="text-slate-500 mt-1">Их сургуулийн албан ёсны бүртгэл</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 flex items-center gap-1.5 px-3 py-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {`${new Date(finalGradeData.publishDate).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' })}-д нийтлэгдсэн`}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                {/* Оюутны мэдээлэл */}
                <div className="p-6 md:col-span-2 space-y-4 bg-white/50 backdrop-blur-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Дипломын гарчиг</p>
                    <p className="font-semibold text-slate-900 leading-snug">{finalGradeData.thesisTitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Оюутан</p>
                      <p className="font-medium text-slate-800">{finalGradeData.studentName}</p>
                      <p className="text-sm text-slate-500">{finalGradeData.studentId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Тэнхим</p>
                      <p className="font-medium text-slate-800">{finalGradeData.department}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Үндсэн удирдагч</p>
                      <p className="font-medium text-slate-800">{finalGradeData.supervisor}</p>
                    </div>
                  </div>
                </div>

                {/* Оноо харуулах */}
                <div className="p-6 flex flex-col items-center justify-center bg-slate-50/50">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Нийт оноо</p>
                  <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 border-[#1455BD] bg-white shadow-sm mb-4">
                    <div className="text-center">
                      <span className="block text-4xl font-extrabold text-[#1455BD] leading-none mb-1">
                        {finalGradeData.finalScore}
                      </span>
                      <span className="block text-sm font-medium text-slate-400 border-t border-slate-100 pt-1 mx-4">
                        / 100
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-1 border-slate-300 text-slate-700 bg-white">
                    Үнэлгээ: <strong className="ml-1 text-[#1455BD]">{finalGradeData.letterGrade}</strong>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Задаргаа хэсэг */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-base text-slate-800">Шатуудаар оноо задаргаа</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {finalGradeData.breakdown.map((item, index) => (
                  <div key={index} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{item.stage}</span>
                        <Badge variant="outline" className="text-[10px] uppercase text-slate-500 border-slate-200 bg-white px-1.5 py-0">
                          Жин: {item.weight}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{item.details}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end min-w-[120px]">
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#1455BD]">{item.score.split('/')[0]}</span>
                        <span className="text-sm text-slate-400">/{item.score.split('/')[1]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Комиссын эцсийн тайлбар */}
          <Card className="border-slate-200 shadow-sm bg-[#1455BD]/5 border-l-4 border-l-[#1455BD]">
            <CardContent className="p-5 sm:p-6">
              <h3 className="text-sm font-bold text-[#1455BD] uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Комиссын эцсийн дүгнэлт
              </h3>
              <p className="text-slate-700 leading-relaxed italic">
                "{finalGradeData.committeeComments}"
              </p>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
