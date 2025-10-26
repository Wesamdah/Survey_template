"use client";

import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/userStore";
import { usePollStore, useAnswersStore } from "@/store/pollStore";
import { submitSurvey } from "@/utils/api";

import { Button } from "./ui/button";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function ApprovalTap({ onNext }: { onNext: () => void }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const userProfile = useUserStore();
  const { selectedPoll } = usePollStore();
  const { answers } = useAnswersStore();

  const handleCompletion = async () => {
    if (onNext) onNext();

    if (isSubmitting || !selectedPoll || answers?.length === 0) {
      setSubmitError("البيانات غير مكتملة للإرسال.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const birthdayDateString = userProfile.birth_date
      ? userProfile.birth_date instanceof Date
        ? userProfile.birth_date.toISOString().split("T")[0]
        : userProfile.birth_date
      : "2000-01-01";

    const profilePayload = {
      full_name: userProfile.full_name,
      email: userProfile.email,
      phone: userProfile.phone,
      work_status: userProfile.work_status,
      education: userProfile.education,
      birth_date: birthdayDateString,
      address: userProfile.address,
      gender: userProfile.gender,
    };

    const finalPayload = {
      pollId: selectedPoll.id,
      profile: profilePayload,
      answers: answers,
    };

    try {
      console.log("Final Payload Ready for POST:", finalPayload);
      await submitSurvey(finalPayload as any);
      console.log("Survey submitted successfully!");
    } catch (error: any) {
      console.error("Failed to submit survey:", error);
      setSubmitError(error.message || "حدث خطأ غير متوقع أثناء الإرسال.");
    } finally {
      setIsSubmitting(false);
      router.push("/login");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="p-12 pb-40 max-w-4xl mx-auto flex flex-col items-center justify-center text-center h-full"
        dir="rtl"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        {submitError && (
          <div className="text-red-600 border border-red-300 p-4 rounded-lg mb-4 w-full max-w-sm">
            {submitError}
          </div>
        )}

        <CheckCircle className="h-24 w-24 text-teal-600 mb-6" />

        <h2 className="text-4xl font-extrabold text-teal-600 mb-4">
          تم الإنتهاء
        </h2>

        <p className="text-xl text-gray-600 mb-10">
          الاستطلاع جاهز للإرسال النهائي. اضغط "تثبيت" لإنهاء العملية.
        </p>
      </div>

      <div
        className="fixed bottom-0 right-0 w-2/3 p-0 shadow-2xl z-20"
        dir="rtl"
      >
        <Button
          onClick={handleCompletion}
          type="button"
          disabled={isSubmitting}
          className="w-full py-6 h-auto text-2xl font-bold bg-teal-600 text-white hover:bg-teal-700 rounded-none transition duration-200 disabled:bg-gray-400"
        >
          {isSubmitting ? "جاري الإرسال..." : "تثبيت"}
        </Button>
      </div>
    </div>
  );
}
