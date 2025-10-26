"use client";

import { usePollStore } from "@/store/pollStore";
import { useForm } from "react-hook-form";

import { useAnswersStore } from "@/store/pollStore";

import { Button } from "./ui/button";

import QuestionItem from "./QuestionItem";

export default function QuestionsTab({ onNext }: { onNext: () => void }) {
  const { selectedPoll } = usePollStore();

  const { setAnswers } = useAnswersStore();

  const questions = selectedPoll?.questions || [];

  const { register, handleSubmit } = useForm();

  const FORM_ID = "questions-form";

  const onSubmit = (formData: any) => {
    console.log(formData);
    const answersPayload = Object.keys(formData).map((key) => {
      // Use Ten to the Id number decimal
      const questionId = parseInt(key.split("_")[1], 10);
      const answerId = parseInt(formData[key], 10);

      return {
        questionId: questionId,
        answerId: answerId,
      };
    });

    setAnswers(answersPayload);

    if (onNext) onNext();
  };

  return (
    <div className="relative min-h-screen">
      <form
        id={FORM_ID}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-0"
        dir="rtl"
      >
        <div className="p-12 pb-40 max-w-4xl mx-auto">
          {questions.map((q) => (
            <QuestionItem key={q.id} question={q} register={register} />
          ))}

          <div className="h-10"></div>
        </div>
      </form>

      <div
        className="fixed bottom-0 right-0 w-2/3 p-0 shadow-2xl z-20"
        dir="rtl"
      >
        <Button
          form={FORM_ID}
          type="submit"
          className="w-full py-6 h-auto text-2xl font-bold bg-teal-600 text-white hover:bg-teal-700 rounded-none transition duration-200"
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
