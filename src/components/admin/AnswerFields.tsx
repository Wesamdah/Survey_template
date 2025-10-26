import { UseFormRegister } from "react-hook-form";

import { useFieldArray, FieldErrors, Control } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Trash2, Plus } from "lucide-react";
import { CreatePollPayload } from "@/utils/api";

interface FormInput extends CreatePollPayload {}

export default function AnswerFields({
  qIndex,
  control,
  register,
}: {
  qIndex: number;
  control: Control<FormInput>;
  register: UseFormRegister<FormInput>;
  errors: FieldErrors<FormInput>;
}) {
  const {
    fields: answerFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name: `questions.${qIndex}.answers` as const,
  });

  return (
    <div className="space-y-3">
      {answerFields.map((aField, aIndex) => (
        <div
          key={aField.id}
          className="flex space-x-4 space-x-reverse items-center p-2 rounded-lg bg-white border border-gray-200"
        >
          {/* الراديو بتن الوهمي */}
          <div className="shrink-0">
            <div className="h-5 w-5 rounded-full border-2 border-teal-600 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-teal-600"></div>
            </div>
          </div>

          {/* حقل نص الإجابة */}
          <Input
            placeholder="نص الإجابة"
            className="w-full p-2 bg-transparent border-none focus:ring-0 text-gray-700"
            {...register(
              `questions.${qIndex}.answers.${aIndex}.text` as const,
              { required: "نص الإجابة مطلوب" }
            )}
          />

          {/* حقل النقاط */}
          <div className="shrink-0 w-24">
            <Input
              type="number"
              placeholder="نقاط"
              className="p-2 border-gray-300 text-center"
              {...register(
                `questions.${qIndex}.answers.${aIndex}.points` as const,
                { valueAsNumber: true, required: "النقاط مطلوبة" }
              )}
            />
          </div>

          {/* زر الحذف */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100 w-8 h-8 shrink-0"
            onClick={() => removeAnswer(aIndex)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* زر إضافة إجابة جديدة */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => appendAnswer({ text: "", points: 0 })}
        className="text-xs text-blue-600 border-blue-600 border-dashed hover:bg-blue-50 mt-4"
      >
        <Plus className="h-4 w-4 ml-1" />
        إضافة إجابة
      </Button>
    </div>
  );
}
