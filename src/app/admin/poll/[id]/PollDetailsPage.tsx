"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Poll } from "@/store/pollStore";
import { fetchPollDetails } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Loader2, CornerDownRight, ArrowRight } from "lucide-react";

interface PollDetailsPageProps {
  pollId: number;
}

export default function PollDetailsPage({ pollId }: PollDetailsPageProps) {
  const router = useRouter();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(pollId)) {
      setError("معرف الاستطلاع غير صالح.");
      setLoading(false);
      return;
    }

    const loadDetails = async () => {
      try {
        const data = await fetchPollDetails(pollId);
        setPoll(data);
      } catch (err: any) {
        setError(err.message || "فشل في جلب تفاصيل الاستطلاع.");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [pollId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full p-20">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <span className="mr-2 text-lg text-gray-700">
          جاري تحميل تفاصيل الاستطلاع...
        </span>
      </div>
    );

  if (error || !poll)
    return (
      <div className="text-center p-20 text-red-600">
        <h1 className="text-2xl font-bold mb-4">خطأ في التحميل</h1>
        <p>{error || "تعذر العثور على بيانات الاستطلاع."}</p>
        <Button
          onClick={() => router.push("/admin")}
          className="mt-6 bg-teal-600 hover:bg-teal-700"
        >
          العودة للوحة التحكم
        </Button>
      </div>
    );

  const formattedDate = new Date(poll.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full h-full p-8 bg-gray-50 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 space-y-8">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-extrabold text-teal-700">
            تفاصيل الاستطلاع: {poll.title}
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="flex items-center space-x-2 space-x-reverse text-gray-600"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للوحة التحكم</span>
          </Button>
        </div>

        <div className="space-y-4 border-b pb-6">
          <p className="text-lg text-gray-600">
            <span className="font-bold text-gray-800 ml-2">المعرّف (ID):</span>{" "}
            {poll.id}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-bold text-gray-800 ml-2">تاريخ الإنشاء:</span>{" "}
            {formattedDate}
          </p>
          <div className="p-4 bg-teal-50 border-r-4 border-teal-500 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-2">الوصف:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {poll.description}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 pt-4">
          الأسئلة ({poll.questions.length})
        </h2>
        {poll.questions.map((question, qIndex) => (
          <div
            key={question.id}
            className="p-6 border rounded-xl space-y-4 bg-gray-50 shadow-inner"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <CornerDownRight className="h-5 w-5 text-teal-600 shrink-0" />
              <h3 className="text-xl font-bold text-gray-900">
                {qIndex + 1}. {question.text}
              </h3>
            </div>

            <div className="space-y-2 pr-8 border-r border-gray-300">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                الإجابات:
              </h4>
              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <span className="text-gray-700">{answer.text}</span>
                  <span className="font-bold text-teal-600 bg-teal-100 px-3 py-1 rounded-full text-sm">
                    {answer.points} نقطة
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
