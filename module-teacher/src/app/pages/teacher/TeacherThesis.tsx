import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Users, FileStack, BookOpen, AlertCircle } from "lucide-react";

import TeacherPlanReviewTab from "./tabs/TeacherPlanReviewTab";
import TeacherTopicRequestsTab from "./tabs/TeacherTopicRequestsTab";
import TeacherStudentProposalsTab from "./tabs/TeacherStudentProposalsTab";

export default function TeacherThesis() {
  const [selectedTab, setSelectedTab] = useState("plan-review");

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Top Graphic Card for Teacher */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="h-2 w-full bg-[#1455BD]"></div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Удирдсан дипломын ажлууд</h1>
              <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
                Өөрийн удирдаж буй оюутнуудын судалгааны ажил, 15 долоо хоногийн төлөвлөгөө болон сэдвийн хүсэлтүүдийг нэг дороос удирдах самбар.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-[#1455BD] rounded-md"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Удирдаж буй</p>
                  <p className="text-xl font-bold text-slate-900">4 оюутан</p>
                </div>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-md"><AlertCircle className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Хүлээгдэж буй</p>
                  <p className="text-xl font-bold text-slate-900">3 хүсэлт</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABS NAVIGATION */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="bg-white px-2 rounded-t-xl border-b border-slate-200 overflow-x-auto custom-scrollbar">
          <TabsList className="w-auto flex justify-start bg-transparent h-auto p-0 gap-6 min-w-max">
            <TabsTrigger value="plan-review" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-4 px-2 text-sm font-medium transition-all text-slate-500 hover:text-slate-700">
              <div className="flex items-center gap-2">
                <FileStack className="w-4 h-4" />
                Сэдэв дэвшүүлэх & Төлөвлөгөө хянах
              </div>
            </TabsTrigger>
            <TabsTrigger value="topic-requests" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-4 px-2 text-sm font-medium transition-all text-slate-500 hover:text-slate-700 relative">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Сэдэв сонгох хүсэлтүүд
                <span className="ml-1 bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center justify-center">2</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="student-proposals" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#1455BD] data-[state=active]:text-[#1455BD] rounded-none py-4 px-2 text-sm font-medium transition-all text-slate-500 hover:text-slate-700 relative">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Оюутны сэдэв хянах
                <span className="ml-1 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center justify-center">1</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. PLAN REVIEW & PROPOSE TAB */}
        <TabsContent value="plan-review" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <TeacherPlanReviewTab />
        </TabsContent>

        {/* 2. TOPIC REQUESTS TAB */}
        <TabsContent value="topic-requests" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <TeacherTopicRequestsTab />
        </TabsContent>

        {/* 3. STUDENT PROPOSALS TAB */}
        <TabsContent value="student-proposals" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <TeacherStudentProposalsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
