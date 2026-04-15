import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, BookOpen, CheckCircle } from "lucide-react";
import { theses, teachers, students } from "../../data/mockData";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function Statistics() {
  // Department distribution
  const deptData = [
    { name: "Компьютер", theses: theses.filter((t) => t.department === "Computer Science").length },
    { name: "Огтоог", theses: theses.filter((t) => t.department === "Data Science").length },
    { name: "Програмког", theses: theses.filter((t) => t.department === "Software Engineering").length },
    { name: "КХО/Робот", theses: theses.filter((t) => t.department === "AI & Robotics").length },
    { name: "Кибер", theses: theses.filter((t) => t.department === "Cybersecurity").length },
  ];

  // Teacher workload
  const teacherWorkload = teachers.map((t) => ({
    name: t.name.split(" ")[1],
    students: t.studentsCount,
    theses: t.thesesCount,
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Нийт багш нар</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-slate-500 mt-1">Идэвхтэй багш нар</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Нийт оюутнууд</CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-slate-500 mt-1">Бүртгэлтэй оюутнууд</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Нийт дипломын ажил</CardTitle>
            <BookOpen className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{theses.length}</div>
            <p className="text-xs text-slate-500 mt-1">Бүх илгаалтууд</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Дуусгах хувиарилалт</CardTitle>
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((theses.filter((t) => t.status === "Approved").length / theses.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Зөвшөөрлөгдсөн дипломууд</p>
          </CardContent>
        </Card>
      </div>



      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Тэнхимийн дипломууд</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="theses" fill="#3b82f6" name="Дипломын ажлын тоо" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Teacher Workload */}
        <Card>
          <CardHeader>
            <CardTitle>Багшны ачаалалтын тархалт</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teacherWorkload}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#10b981" name="Оюутнууд" />
                <Bar dataKey="theses" fill="#8b5cf6" name="Дипломууд" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Дундаж дэвшил</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {(theses.reduce((sum, t) => sum + t.progress, 0) / theses.length).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Оюутны дундаж GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">
                {(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Багшны дундаж үнэлгээ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">
                {(teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length).toFixed(1)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
