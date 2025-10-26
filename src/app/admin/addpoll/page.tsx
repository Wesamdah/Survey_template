"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CreatePollPayload } from "@/utils/api";
import { createPoll } from "@/utils/api";
import { usePollStore } from "@/store/pollStore";

import AnswerFields from "@/components/admin/AnswerFields";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X, Trash2, ArrowRight } from "lucide-react";

interface FormInput extends CreatePollPayload {}

export default function CreatePollPage() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: {
      title: "",
      description: "",
      questions: [{ text: "", answers: [{ text: "", points: 0 }] }],
    },
  });
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const setPolls = usePollStore((state) => state.setPolls);
  const polls = usePollStore((state) => state.polls);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    setLoading(true);
    setApiError(null);

    try {
      const newPoll = await createPoll(data);

      setPolls([newPoll, ...polls]);

      reset();

      router.push("/admin");
    } catch (error: any) {
      setApiError(error.message || "فشل في إنشاء الاستطلاع.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-8 bg-gray-50 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-3xl font-extrabold text-teal-700">
            إنشاء استطلاع جديد
          </h2>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center space-x-2 space-x-reverse text-gray-600"
          >
            <ArrowRight className="h-4 w-4" />
            <span>عودة للوحة التحكم</span>
          </Button>
        </div>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4 border-b pb-6">
            <Label htmlFor="title" className="text-xl font-bold block mb-2">
              عنوان الاستطلاع
            </Label>
            <Input
              id="title"
              placeholder="مثال: استطلاع رضا الموظفين"
              className="p-3 bg-gray-100 border-none text-lg"
              {...register("title", { required: "العنوان مطلوب" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}

            <Label
              htmlFor="description"
              className="text-xl font-bold block mb-2 pt-4"
            >
              الوصف
            </Label>
            <Textarea
              id="description"
              placeholder="وصف مختصر للاستطلاع"
              className="p-3 bg-gray-100 border-none rounded-lg"
              rows={4}
              {...register("description")}
            />
          </div>

          <h3 className="text-2xl font-bold text-gray-800">
            تكوين الأسئلة ({questionFields.length})
          </h3>
          {questionFields.map((qField, qIndex) => (
            <div
              key={qField.id}
              className="p-6 border rounded-xl space-y-4 bg-gray-50 shadow-inner"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <Label className="text-xl font-bold text-gray-800">
                  السؤال رقم {qIndex + 1}
                </Label>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-100 p-2"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              <Input
                placeholder="أدخل نص السؤال هنا"
                className="p-3 bg-white border border-gray-300 rounded-lg text-lg"
                {...register(`questions.${qIndex}.text` as const, {
                  required: "نص السؤال مطلوب",
                })}
              />
              {errors.questions?.[qIndex]?.text && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[qIndex].text?.message}
                </p>
              )}

              <div className="space-y-2 pt-4 mt-4">
                <Label className="font-medium block mb-2 text-gray-700">
                  الإجابات والنقاط:
                </Label>
                <AnswerFields
                  qIndex={qIndex}
                  control={control}
                  register={register}
                  errors={errors}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendQuestion({ text: "", answers: [{ text: "", points: 0 }] })
            }
            className="w-full text-teal-600 border-teal-600 hover:bg-teal-50 py-3 text-lg"
          >
            <Plus className="h-5 w-5 ml-2" />
            إضافة سؤال جديد
          </Button>

          <div className="pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 h-auto text-xl font-bold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-400"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2 space-x-reverse">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>جاري الإنشاء والحفظ...</span>
                </span>
              ) : (
                "إنشاء وحفظ الاستطلاع"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
