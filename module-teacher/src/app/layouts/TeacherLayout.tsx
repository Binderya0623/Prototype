import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import TeacherSidebar from "../components/TeacherSidebar";
import TopHeader from "../components/TopHeader";
import { FloatingMessageButton } from "../components/FloatingMessageButton";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/teacher": { title: "Хянах самбар", subtitle: "Тавтай морилно уу, Багш" },
  "/teacher/students": { title: "Хуваарилагдсан оюутнууд", subtitle: "Харьцлаж буй оюутнуудынгоо харах, удирдах" },
  "/teacher/progress": { title: "Явцын хяналт", subtitle: "Бүх оюутны дэвшил, шат, эцсийн хугацааг хянах" },
  "/teacher/committee": { title: "Комисс", subtitle: "Комиссийн үнэлгээний даалгавраа удирдах" },
  "/teacher/evaluations": { title: "Комисс", subtitle: "Комиссийн үнэлгээний даалгавраа удирдах" },
  "/teacher/settings": { title: "Тохиргоо", subtitle: "Профайл, тохиргоо удирдах" },
};


export default function TeacherLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pageInfo = pageTitles[location.pathname] || pageTitles["/teacher"];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <TeacherSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopHeader
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          userName=" Батбаатар"
          userRole="Профессор"
          userInitials="ББ"
          avatarColor="from-blue-500 to-blue-700"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <FloatingMessageButton
        unreadCount={5}
        onMessageClick={() => navigate("/teacher/messages")}
      />
    </div>
  );
}