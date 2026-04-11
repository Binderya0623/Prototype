import { useState } from "react";
import { Search, Filter, Download, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { students } from "../../data/mockData";

const departments = ["Бүх тэнхим", "Компьютерын ухаан", "Огтоогны шинжлэл", "Програмхааглын инженерчлэл", "КХО/Робот", "Кибер аюулга хамгаалал"];
const years = ["Бүх дүншилгээ", "3-р дүншилгээ", "4-р дүншилгээ", "Докторантур"];

export default function Students() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("Бүх тэнхим");
  const [selectedYear, setSelectedYear] = useState("Бүх дүншилгээ");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "Бүх тэнхим" || student.department === selectedDept;
    const matchesYear = selectedYear === "Бүх дүншилгээ" || student.year === selectedYear;
    return matchesSearch && matchesDept && matchesYear;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-yellow-100 text-yellow-800";
      case "Planning":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Нийт оюутнууд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Идэвхтэй дипломъууд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter((s) => s.thesisStatus === "In Progress").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Дууссан</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter((s) => s.thesisStatus === "Completed").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Дундаж GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Оюутан, и-мэйл эсвэл ID-гаар хайх..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Шүүлэх
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Гаргах
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Оюутан нэмэх
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Оюутны бүртгэл ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 text-sm font-medium text-slate-600">Оюутан</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Оюутны ID</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Тэнхим</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Удирдагч багш</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Дипломын ажил</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Дэвшил</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Байдал</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">GPA</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Үйл</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">{student.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{student.studentId}</td>
                    <td className="py-4 text-sm">{student.department}</td>
                    <td className="py-4 text-sm">{student.supervisor}</td>
                    <td className="py-4">
                      <p className="text-sm max-w-xs truncate">{student.thesisTitle}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Progress value={student.progress} className="w-20 h-2" />
                        <span className="text-xs text-slate-600">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className={getStatusColor(student.thesisStatus)}>{student.thesisStatus}</Badge>
                    </td>
                    <td className="py-4 text-sm font-medium">{student.gpa.toFixed(1)}</td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
