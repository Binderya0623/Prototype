import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { students } from "../../data/mockData";

const conversations = [
  {
    id: 1,
    student: "Д.Оч",
    avatar: "AJ",
    lastMessage: "Thank you for the feedback on Chapter 3!",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: 2,
    student: "Б.Батбаяр",
    avatar: "PS",
    lastMessage: "I've uploaded the revised methodology section.",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 3,
    student: "С.Мөнхбаяр",
    avatar: "DB",
    lastMessage: "When can we schedule the next review meeting?",
    time: "Yesterday",
    unread: 1,
  },
];

const messages = [
  {
    id: 1,
    sender: "student",
    text: "Good morning, Professor. I've completed the revisions you suggested for Chapter 3.",
    time: "9:45 AM",
  },
  {
    id: 2,
    sender: "teacher",
    text: "Great! Let me review it and I'll get back to you by this afternoon.",
    time: "9:50 AM",
  },
  {
    id: 3,
    sender: "student",
    text: "Thank you! I also wanted to ask about the methodology section.",
    time: "10:15 AM",
  },
  {
    id: 4,
    sender: "student",
    text: "Should I include more details about the data collection process?",
    time: "10:16 AM",
  },
  {
    id: 5,
    sender: "teacher",
    text: "Yes, definitely. Include information about your sample size, selection criteria, and any validation methods you used.",
    time: "10:20 AM",
  },
  {
    id: 6,
    sender: "student",
    text: "Thank you for the feedback on Chapter 3!",
    time: "10:30 AM",
  },
];

export default function TeacherMessages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.student.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      alert(`Message sent: ${messageText}`);
      setMessageText("");
    }
  };

  return (
    <div className="h-[calc(100vh-200px)]">
      <Card className="h-full">
        <CardContent className="p-0 h-full">
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-slate-200 flex flex-col h-full">
              {/* Search */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${selectedConversation === conv.id ? "bg-emerald-50 border-l-4 border-l-emerald-600" : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">{conv.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">{conv.student}</p>
                          <span className="text-xs text-slate-500">{conv.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="bg-emerald-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-8 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">AJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Alex Johnson</p>
                    <p className="text-xs text-slate-500">Computer Science • STU2024001</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "teacher" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${msg.sender === "teacher"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-900"
                        }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${msg.sender === "teacher" ? "text-emerald-100" : "text-slate-500"
                          }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
