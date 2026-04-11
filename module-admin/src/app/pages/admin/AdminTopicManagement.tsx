import { useState } from "react";
import { Search, Filter, CheckCircle, XCircle, FileText, ChevronRight, MessageSquare, X, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";

// Mock Data
type TopicStatus = "Тэнхим хяналтанд" | "Батлагдсан" | "Татгалзсан";
type ProposerType = "Багш" | "Оюутан";

interface TopicIdea {
  id: string;
  title: string;
  proposerType: ProposerType;
  supervisorName: string;
  studentName?: string;
  status: TopicStatus;
  date: string;
  goal: string;
  description: string;
  comments: { author: string; text: string; date: string }[];
}

const mockTopics: TopicIdea[] = [
  {
    id: "TOPIC-001",
    title: "Гүн суралцахүйн аргаар эмнэлгийн зургийн оношлогоо",
    proposerType: "Багш",
    supervisorName: "Дэд проф. Б.Батбаатар",
    status: "Тэнхим хяналтанд",
    date: "2024-03-20",
    goal: "X-ray зургаас уушгины хатгалгааг илрүүлэх AI загвар сургах",
    description: "Сүүлийн үеийн CNN болон Vision Transformer архитектуруудыг харьцуулан судалж, эмнэлгийн зураг дээрх нарийвчлалыг сайжруулах.",
    comments: [],
  },
  {
    id: "TOPIC-002",
    title: "Их сургуулийн кампусын ухаалаг зогсоолын систем",
    proposerType: "Оюутан",
    supervisorName: "Проф. С.Сүхбаатар",
    studentName: "О.Тэмүүлэн (SE20D123)",
    status: "Тэнхим хяналтанд",
    date: "2024-03-21",
    goal: "Камерын дүрс задлах аргаар сул зогсоолыг тодорхойлох систем хөгжүүлэх",
    description: "YOLOv8 ашиглан зогсоол дахь автомашинуудыг таньж, мобайл аппликейшнээр дамжуулан оюутнуудад сул зогсоолын мэдээлэл өгөх.",
    comments: [
      { author: "Проф. С.Сүхбаатар", text: "Сэдвийн хүрээ боломжийн байна, дэмжиж байна.", date: "2024-03-22" }
    ],
  },
  {
    id: "TOPIC-003",
    title: "Монгол хэлний LLM-ийн датасэт үүсгэх автоматжуулалт",
    proposerType: "Багш",
    supervisorName: "Дот. Ж.Саран",
    status: "Батлагдсан",
    date: "2024-03-15",
    goal: "Вебээс монгол текст автоматаар ялгах, цэвэрлэх pipeline байгуулах",
    description: "Томоохон мэдээллийн сайтуудаас текст цуглуулах, NLP аргаар алдааг нь засах, LLM сургалтанд зориулан форматлах.",
    comments: [
      { author: "Тэнхим", text: "Маш чухал, цаг үеэ олсон сэдэв байна. Баталлаа.", date: "2024-03-18" }
    ],
  }
];

export default function AdminTopicManagement() {
  const [topics, setTopics] = useState<TopicIdea[]>(mockTopics);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicIdea | null>(null);
  const [commentText, setCommentText] = useState("");

  const filteredTopics = topics.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case "Тэнхим хяналтанд":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Хяналтанд</span>;
      case "Батлагдсан":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Батлагдсан</span>;
      case "Татгалзсан":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">Татгалзсан</span>;
    }
  };

  const handleApprove = (id: string, comment: string) => {
    setTopics(topics.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          status: "Батлагдсан", 
          comments: comment ? [...t.comments, { author: "Тэнхим", text: comment, date: new Date().toISOString().split('T')[0] }] : t.comments 
        };
      }
      return t;
    }));
    setSelectedTopic(null);
    setCommentText("");
  };

  const handleReject = (id: string, comment: string) => {
    setTopics(topics.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          status: "Татгалзсан", 
          comments: comment ? [...t.comments, { author: "Тэнхим", text: comment, date: new Date().toISOString().split('T')[0] }] : t.comments 
        };
      }
      return t;
    }));
    setSelectedTopic(null);
    setCommentText("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Сэдвийн удирдлага</h1>
          <p className="text-sm text-slate-500 mt-1">
            Багш болон оюутны дэвшүүлсэн дипломын сэдвүүдийг хянах, батлах нэгдсэн самбар
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Сэдвийн нэр, багшийн нэрээр хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1455BD]/20 focus:border-[#1455BD] transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 text-slate-600 bg-white">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Шүүлтүүр</span>
          </Button>
        </div>
      </div>

      {/* Topics Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Сэдвийн нэр</th>
                <th className="px-6 py-4">Дэвшүүлсэн</th>
                <th className="px-6 py-4">Холбогдох багш / Оюутан</th>
                <th className="px-6 py-4">Огноо</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 line-clamp-2">{topic.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{topic.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                      {topic.proposerType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-900 font-medium">{topic.supervisorName}</p>
                    {topic.studentName ? (
                      <p className="text-xs text-slate-500 mt-0.5">{topic.studentName}</p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-0.5 font-style: italic">Оюутан сонгоогүй</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{topic.date}</td>
                  <td className="px-6 py-4">{getStatusBadge(topic.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTopic(topic)}
                      className="gap-2 text-[#1455BD] border-[#1455BD]/20 hover:bg-[#1455BD]/5"
                    >
                      <Eye className="w-4 h-4" />
                      Дэлгэрэнгүй
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredTopics.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <p>Илэрц олдсонгүй</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Slide-over Drawer / Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-slate-500">{selectedTopic.id}</span>
                  {getStatusBadge(selectedTopic.status)}
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                    {selectedTopic.proposerType} дэвшүүлсэн
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedTopic.title}
                </h2>
              </div>
              <button 
                onClick={() => { setSelectedTopic(null); setCommentText(""); }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Удирдагч багш</p>
                  <p className="text-sm font-medium text-slate-900">{selectedTopic.supervisorName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Оюутан</p>
                  <p className="text-sm font-medium text-slate-900">{selectedTopic.studentName || "Одоогоор байхгүй"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Судалгааны зорилго</h3>
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 text-sm text-slate-700 leading-relaxed">
                  {selectedTopic.goal}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Дэлгэрэнгүй тайлбар</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedTopic.description}
                </p>
              </div>

              {/* History & Comments */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  Шийдвэр болон сэтгэгдлүүд
                </h3>
                
                <div className="space-y-4">
                  {selectedTopic.comments.length > 0 ? (
                    selectedTopic.comments.map((comment, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-slate-500">{comment.author.substring(0,2).toUpperCase()}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-100 flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-900">{comment.author}</span>
                            <span className="text-xs text-slate-400">{comment.date}</span>
                          </div>
                          <p className="text-sm text-slate-600">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">Одоогоор сэтгэгдэл байхгүй байна.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer (Actions) */}
            {selectedTopic.status === "Тэнхим хяналтанд" && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Тэнхимийн шийдвэрийн тайлбар (заавал биш)</label>
                  <textarea
                    placeholder="Батлах эсвэл татгалзах шалтгаанаа энд бичнэ үү..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="w-full h-20 p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1455BD]/20 focus:border-[#1455BD] resize-none"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline"
                    className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => handleReject(selectedTopic.id, commentText)}
                  >
                    <XCircle className="w-4 h-4" /> Татгалзах
                  </Button>
                  <Button 
                    className="gap-2 bg-[#1455BD] hover:bg-blue-700 text-white"
                    onClick={() => handleApprove(selectedTopic.id, commentText)}
                  >
                    <CheckCircle className="w-4 h-4" /> Сэдвийг батлах
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
