"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchPolls, LoggedInUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { fetchCurrentUser } from "@/utils/api";
import { usePollStore } from "@/store/pollStore";

import AuthSidebar from "@/components/AuthSidebar";
import PollsTable from "@/components/admin/PollsTable";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Bell } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const { polls, setPolls } = usePollStore();

  const [searchTerm, setSearchTerm] = useState("");

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
        const fetchedPolls = await fetchPolls();
        setPolls(fetchedPolls);
      } catch (err: any) {
        setError(err.message);

        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPolls = useMemo(() => {
    if (!searchTerm) {
      return polls;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return polls.filter(
      (poll) =>
        poll.title.toLowerCase().includes(lowerCaseSearch) ||
        poll.description.toLowerCase().includes(lowerCaseSearch)
    );
  }, [polls, searchTerm]);

  if (loading)
    return <div className="text-center p-20">جاري تحميل لوحة التحكم...</div>;
  if (error)
    return <div className="text-center p-20 text-red-600">خطأ: {error}</div>;

  const adminName = user?.name || "اسم المدير";

  const sidebarProps = {
    title: "لوحة التحكم",
    description: "مرحبا بك في لوحة تحكم الاستطلاعات",
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="w-1/4 fixed left-0 h-full">
        <AuthSidebar {...sidebarProps} />
      </div>

      <main className="w-3/4 mr-0 ml-auto flex flex-col h-full">
        <div className="flex justify-between items-center p-8 pb-6 border-b border-gray-200 bg-white sticky top-0 z-20 shadow-md">
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="text-right">
              <h2 className="text-lg font-bold text-gray-800">{adminName}</h2>
              <p className="text-sm text-gray-500">مرحباً بك</p>
            </div>

            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 ml-5">
              <Image
                src="/images/default_image.jpg"
                alt="Admin Avatar"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="relative cursor-pointer">
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
          </div>

          <div className="relative w-1/3">
            <Input
              type="search"
              placeholder="البحث"
              className="w-full p-3 pr-10 bg-gray-100 border-none rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="p-8 grow overflow-y-auto">
          <div className="pt-8">
            <PollsTable polls={filteredPolls} createPollPath="/admin/addpoll" />
          </div>
        </div>
      </main>
    </div>
  );
}
