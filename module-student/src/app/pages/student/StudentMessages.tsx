import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Send, Paperclip, MoreVertical } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "teacher",
    text: "Өглөөний мэнд, Батбаяр. Таны хамгийн сүүлийн бүлгийн ажлыг уншиж үзлээ.",
    time: "9:00",
  },
  {
    id: 2,
    sender: "teacher",
    text: "Нийтдээ сайн ноорог байна. Гэхдээ хэдэн хэсгийг сайжруулах шаардлагатай байна.",
    time: "9:01",
  },
  {
    id: 3,
    sender: "student",
    text: "Өглөөний мэнд, профессор. Хурдан хянаж өгсөнд баярлалаа!",
    time: "9:45",
  },
  {
    id: 4,
    sender: "student",
    text: "Та 3-р бүлэгт зааж өгсөн засварыг хийж дуусгалаа.",
    time: "9:46",
  },
  {
    id: 5,
    sender: "teacher",
    text: "Гайхалтай! Уншиж үзье, өнөөдрийн үдэш хариулах болно.",
    time: "9:50",
  },
  {
    id: 6,
    sender: "student",
    text: "Баярлалаа! Мөн аргачлалын хэсгийн талаар асуухыг хүсэж байна.",
    time: "10:15",
  },
  {
    id: 7,
    sender: "student",
    text: "Мэдээлэл цуглуулах үйл явцын талаар дэлгэрэнгүй бичих хэрэгтэй юу?",
    time: "10:16",
  },
  {
    id: 8,
    sender: "teacher",
    text: "Тийм, заавал. Дээж хэмжээ, сонгох шалгуур болон ашигласан баталгаажуулалтын аргуудын талаарх мэдээллийг оруулна уу.",
    time: "10:20",
  },
  {
    id: 9,
    sender: "student",
    text: "Мэдлэй! Өнөөдөр тэр дээр ажиллана. Удирдлага өгсөнд баярлалаа!",
    time: "10:30",
  },
];

export default function StudentMessages() {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      alert(`Мессеж илгээсэн: ${messageText}`);
      setMessageText("");
    }
  };

  return (
    <div className="h-[calc(100vh-200px)]">
      <Card className="h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Чат гарчиг */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-purple-100 text-purple-700 text-lg">SM</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">Dr. Sarah Mitchell</p>
                <p className="text-sm text-slate-500">Дипломын удирдагч багш</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Мессежүүд */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2 max-w-[70%]">
                  {msg.sender === "teacher" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">SM</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 ${msg.sender === "student"
                          ? "bg-purple-600 text-white"
                          : "bg-white text-slate-900 border border-slate-200"
                        }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${msg.sender === "student" ? "text-right text-slate-400" : "text-slate-400"
                        }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                  {msg.sender === "student" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">AJ</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Мессеж оруулах */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Мессежээ бичнэ үү..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 flex-shrink-0" onClick={handleSendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Илгаах
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Илгаахын тулд Enter дар, шинэ мөр үүсгэхийн тулд Shift+Enter дар</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
