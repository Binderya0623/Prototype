import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import { Mail, Phone, MapPin, Calendar, GraduationCap, Award, BookOpen, Edit } from "lucide-react";

const studentProfile = {
  name: "Alex Johnson",
  studentId: "STU2024001",
  email: "a.johnson@student.edu",
  phone: "+976-99123456",
  department: "Компьютерын ухаан",
  year: "4-р курс",
  enrollmentDate: "2020-09-01",
  expectedGraduation: "2024-06-30",
  gpa: 3.8,
  avatar: "AJ",
  address: "Улаанбаатар, Монгол",
  supervisor: "Dr. Sarah Mitchell",
  thesisTitle: "Эмнэлгийн зургийн оношлогоонд гүн суралцахуй",
  thesisProgress: 65,
};

const academicRecords = [
  { semester: "7-р улирал", year: "2023-2024", gpa: 3.9, credits: 18 },
  { semester: "6-р улирал", year: "2023-2024", gpa: 3.8, credits: 18 },
  { semester: "5-р улирал", year: "2022-2023", gpa: 3.7, credits: 20 },
  { semester: "4-р улирал", year: "2022-2023", gpa: 3.8, credits: 19 },
];

const achievements = [
  { title: "Декануудын жагсаалт", date: "2023", description: "Эрдэм шинжилгээний тэргүүны шагнал" },
  { title: "Судалгааны нийтлэл", date: "2023", description: "Бага хурлын нийтлэл хүлээн авагдсан" },
  { title: "Хакатон ялагч", date: "2022", description: "1-р байр - Технологийн судалгааны шинэчлэл" },
];

export default function StudentProfile() {
  return (
    <div className="space-y-6">
      {/* Профайлын гарчиг */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-purple-100 text-purple-700 text-3xl">
                {studentProfile.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{studentProfile.name}</h2>
                  <p className="text-slate-600 mb-3">{studentProfile.studentId}</p>
                  <div className="flex gap-2">
                    <Badge className="bg-purple-100 text-purple-800">{studentProfile.year}</Badge>
                    <Badge variant="outline">{studentProfile.department}</Badge>
                  </div>
                </div>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Профайл засварлах
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">{studentProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">{studentProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">{studentProfile.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Элссэн: {studentProfile.enrollmentDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Эрдэм шинжилгээний мэдээлэл */}
        <div className="lg:col-span-2 space-y-6">
          {/* Эрдэм шинжилгээний статистик */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">GPA</CardTitle>
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentProfile.gpa.toFixed(1)}</div>
                <p className="text-xs text-slate-500 mt-1">Нийлмэл</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Диплом</CardTitle>
                <BookOpen className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentProfile.thesisProgress}%</div>
                <p className="text-xs text-slate-500 mt-1">Дэвшил</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Шагналууд</CardTitle>
                <Award className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{achievements.length}</div>
                <p className="text-xs text-slate-500 mt-1">Нийт</p>
              </CardContent>
            </Card>
          </div>

          {/* Эрдэм шинжилгээний бүртгэл */}
          <Card>
            <CardHeader>
              <CardTitle>Эрдэм шинжилгээний бүртгэл</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {academicRecords.map((record, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div>
                      <p className="font-medium text-sm">{record.semester}</p>
                      <p className="text-xs text-slate-500">{record.year}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">GPA</p>
                        <p className="font-semibold">{record.gpa.toFixed(1)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Кредит</p>
                        <p className="font-semibold">{record.credits}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Дипломын мэдээлэл */}
          <Card>
            <CardHeader>
              <CardTitle>Одоогийн диплом</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{studentProfile.thesisTitle}</h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Хийгдэж байна</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Удирдагч багш</p>
                  <p className="font-medium">{studentProfile.supervisor}</p>
                </div>
                <div>
                  <p className="text-slate-500">Тэнхим</p>
                  <p className="font-medium">{studentProfile.department}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600">Дэвшил</p>
                  <p className="text-sm font-medium">{studentProfile.thesisProgress}%</p>
                </div>
                <Progress value={studentProfile.thesisProgress} className="h-2" />
              </div>
              <Button variant="outline" className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Дипломын дэлгэрэнгүйг харах
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Баруун багана */}
        <div className="space-y-6">
          {/* Удирдагч багшийн мэдээлэл */}
          <Card>
            <CardHeader>
              <CardTitle>Дипломын удирдагч</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-purple-100 text-purple-700">SM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{studentProfile.supervisor}</p>
                  <p className="text-sm text-slate-500">{studentProfile.department}</p>
                  <p className="text-sm text-slate-500 mt-2">s.mitchell@university.edu</p>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Удирдагчтай холбогдох
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Амжилтууд */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Амжилт ба шагналууд
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, idx) => (
                <div key={idx} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{achievement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Чухал огнооууд */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Чухал огнооууд
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Элссэн огноо</span>
                <span className="font-medium">{studentProfile.enrollmentDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Төгсөх хугацаа</span>
                <span className="font-medium">{studentProfile.expectedGraduation}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-slate-600">Дипломын эцсийн хугацаа</span>
                <Badge variant="outline" className="text-xs">
                  2026-04-02
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}