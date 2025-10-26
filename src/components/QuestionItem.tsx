import { useForm } from "react-hook-form";
import { Question, AnswerQuestion } from "@/store/pollStore";

interface Props {
  question: Question;
  register: ReturnType<typeof useForm>["register"];
}

export default function QuestionItem({ question, register }: Props) {
  const fieldName = `q_${question.id}`;
  const answers: Array<AnswerQuestion> = question.answers || [];
  return (
    <div className="py-8 border-b border-gray-200">
      <h3 className="text-xl font-medium text-gray-800 mb-6 text-right">
        {question.text}
      </h3>

      <div className="flex justify-start space-x-12 space-x-reverse">
        {answers.map((answer) => (
          <label
            key={answer.id}
            className="flex items-center space-x-3 space-x-reverse cursor-pointer"
          >
            <input
              type="radio"
              value={answer.id.toString()}
              className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500 "
              {...register(fieldName, { required: true })}
            />

            <span className="text-lg text-gray-700 mr-2">{answer.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
