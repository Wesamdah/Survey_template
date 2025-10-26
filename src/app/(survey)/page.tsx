"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SurveySidebar from "@/components/SurveySideBar";
import UserInfoTap from "@/components/UserInfoTap";
import QuestionsTab from "@/components/QuestionsTab";
import ApprovalTap from "@/components/ApprovalTap";

import { Check, FileText, HelpCircle } from "lucide-react";

import { usePollStore } from "@/store/pollStore";
import { fetchPolls } from "@/utils/api";

import { Loader2 } from "lucide-react";

const SurveyPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const { selectedPoll, setPolls, setSelectedPoll } = usePollStore();
  const [isLoading, setIsLoading] = useState(true);

  const steps = [
    {
      id: 1,
      title: "المعلومات الخاصة بك",
      component: UserInfoTap,
      icon: FileText,
      progress: 25,
    },

    {
      id: 2,
      title: "الأسئلة",
      component: QuestionsTab,
      icon: HelpCircle,
      progress: 50,
    },
    {
      id: 3,
      title: "الموافقة",
      component: ApprovalTap,
      icon: Check,
      progress: 100,
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Survey flow finished.");
    }
  };

  const handleLoginRoute = () => {
    router.push("/login");
  };

  const currentStepData = steps.find((step) => step.id === currentStep);

  const sidebarProps = {
    title: "عنوان الأستطلاع",
    description: "شرح عن الأستطلاع",
    stepText: `الخطوة ${currentStep} من ${totalSteps}`,
    progress: currentStepData ? currentStepData.progress : 0,
    onLoginClick: handleLoginRoute,
  };

  const ActiveComponent = currentStepData?.component;

  useEffect(() => {
    async function loadPolls() {
      try {
        const fetchedPolls = await fetchPolls();
        console.log(fetchedPolls);
        setPolls(fetchedPolls);

        if (fetchedPolls.length > 0) {
          const randomIndex = Math.floor(Math.random() * fetchedPolls.length);
          setSelectedPoll(fetchedPolls[randomIndex].id);
        }
      } catch (error) {
        console.error("Could not load polls:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPolls();
  }, [setPolls, setSelectedPoll]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
          <div className="text-xl font-medium text-gray-700">
            جاري تحميل الاستطلاع...
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPoll) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-2xl font-semibold text-red-600 p-10 border border-red-300 rounded-lg bg-red-50 shadow-md">
          لم يتم العثور على استطلاع نشط.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="w-1/3 fixed left-0 h-full">
        <SurveySidebar {...sidebarProps} />
      </div>

      <main className="w-2/3 mr-0 ml-auto overflow-y-auto">
        <div className="p-8 sticky top-0 bg-white shadow-sm z-10 border-b">
          <div className="flex justify-start items-center space-x-4 space-x-reverse">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center text-lg transition-colors duration-300 ${
                    step.id <= currentStep ? "text-teal-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full border-2 ${
                      step.id <= currentStep
                        ? "border-teal-600 bg-teal-50"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="mr-3 font-medium hidden sm:inline">
                    {step.title}
                  </span>
                </div>

                {index < totalSteps - 1 && (
                  <div
                    className={`h-0.5 w-24 transition-colors duration-300 ${
                      step.id < currentStep ? "bg-teal-600" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
          {ActiveComponent ? (
            <ActiveComponent onNext={handleNext} />
          ) : (
            <div className="p-12 text-center text-gray-500">
              الخطوة {currentStep} قريباً...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SurveyPage;
