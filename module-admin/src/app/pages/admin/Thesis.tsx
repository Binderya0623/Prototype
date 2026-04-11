import { useState } from "react";
import { Search, Filter, Download, Eye, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { theses } from "../../data/mockData";

const statuses = ["Бүх байдал", "Явцаалалдаа байна", "Хянагдаж буй", "Зөвшөөрлөгдсөн", "Төлөвлөгө шатанда"];
const types = ["Бүх төрөл", "Бакалавр", "Магистр", "Докторантур"];

export default function Thesis() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Бүх байдал");
  const [selectedType, setSelectedType] = useState("Бүх төрөл");

  const filteredTheses = theses.filter((thesis) => {
    const matchesSearch =
      thesis.title.toLowerCase().includes(search.toLowerCase()) ||
      thesis.student.toLowerCase().includes(search.toLowerCase()) ||
      thesis.supervisor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === "Бүх байдал" || thesis.status === selectedStatus;
    const matchesType = selectedType === "Бүх төрөл" || thesis.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":     return "bg-green-100 text-green-800";
      case "In Progress":  return "bg-blue-100 text-blue-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Planning":     return "bg-slate-100 text-slate-800";
      default:             return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Approved":     return "Зөвшөөрлөгдсөн";
      case "In Progress":  return "Явцаалалдаа байна";
      case "Under Review": return "Хянагдаж буй";
      case "Planning":     return "Төлөвлөгөө шатанд";
      default:             return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PhD":        return "bg-purple-100 text-purple-800";
      case "Master's":   return "bg-blue-100 text-blue-800";
      case "Bachelor's": return "bg-teal-100 text-teal-800";
      default:           return "bg-slate-100 text-slate-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PhD":        return "Докторантур";
      case "Master's":   return "Магистр";
      case "Bachelor's": return "Бакалавр";
      default:           return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Нийт дипломын ажил</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{theses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Явцаалалдаа байна</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{theses.filter((t) => t.status === "In Progress").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Хянагдаж буй</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{theses.filter((t) => t.status === "Under Review").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Зөвшөөрлөгдсөн</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{theses.filter((t) => t.status === "Approved").length}</div>
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
                placeholder="Гарчиг, оюутан эсвэл удирдагч багшаар хайх..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
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
          </div>
        </CardContent>
      </Card>

      {/* Theses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Дипломын ажлын сан ({filteredTheses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 text-sm font-medium text-slate-600">Гарчиг</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Оюутан</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Удирдагч багш</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Тэнхим</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Төрөл</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Илгээсэн огноо</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Дэвшил</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Байдал</th>
                  <th className="pb-3 text-sm font-medium text-slate-600">Үйл</th>
                </tr>
              </thead>
              <tbody>
                {filteredTheses.map((thesis) => (
                  <tr key={thesis.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium max-w-xs">{thesis.title}</p>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {thesis.keywords.slice(0, 2).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-sm">{thesis.student}</td>
                    <td className="py-4 text-sm">{thesis.supervisor}</td>
                    <td className="py-4 text-sm">{thesis.department}</td>
                    <td className="py-4">
                      <Badge className={getTypeColor(thesis.type)}>{getTypeLabel(thesis.type)}</Badge>
                    </td>
                    <td className="py-4 text-sm text-slate-600">{thesis.submittedDate}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Progress value={thesis.progress} className="w-20 h-2" />
                        <span className="text-xs text-slate-600">{thesis.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className={getStatusColor(thesis.status)}>{getStatusLabel(thesis.status)}</Badge>
                    </td>
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
