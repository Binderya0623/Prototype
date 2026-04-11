import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import StudentSidebar from "../components/StudentSidebar";
import TopHeader from "../components/TopHeader";
import { FloatingMessageButton } from "../components/FloatingMessageButton";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/student": { title: "Миний Хянах самбар", subtitle: "Судалгааны ажлын явцаа хянах" },
  "/student/thesis": { title: "Миний судалгааны ажил", subtitle: "Судалгааны ажил, тайлан, илгээлтийг удирдах" },
  "/student/feedback": { title: "Санал хүсэлт", subtitle: "Багшийн зөвлөгөө болон сэтгэгдэл" },
  "/student/deadlines": { title: "Хугацаа болон Хамгаалалт", subtitle: "Ирж буй хугацаа болон хамгаалалтын хуваарь" },
  "/student/grade": { title: "Эцсийн дүн", subtitle: "Эцсийн дүн болон үр дүнг харах" },
  "/student/messages": { title: "Зурвасууд", subtitle: "Удирдагч багштайгаа харилцах" },
  "/student/profile": { title: "Миний профайл", subtitle: "Хувийн мэдээллээ харах, засварлах" },
};


export default function StudentLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pageInfo = pageTitles[location.pathname] || pageTitles["/student"];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <StudentSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopHeader
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          userName="Батбаяр"
          userRole="Оюутан"
          userInitials="ББ"
          avatarColor="from-blue-500 to-blue-700"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <FloatingMessageButton
        unreadCount={3}
        onMessageClick={() => navigate("/student/messages")}
      />
    </div>
  );
}