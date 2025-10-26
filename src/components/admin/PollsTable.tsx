import { useRouter } from "next/navigation";

import { Poll } from "@/store/pollStore";

import DescriptionCell from "./DescriptionCell";

import { Button } from "../ui/button";
import { FileText, Download } from "lucide-react";

interface PollsTableProps {
  polls: Array<Poll>;
  createPollPath: string;
}

export default function PollsTable({ polls, createPollPath }: PollsTableProps) {
  const router = useRouter();

  const handleViewDetails = (id: number) => {
    console.log(id);
    router.push(`/admin/poll/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">الاستطلاعات</h2>
        <div className="flex justify-start space-x-4  mb-6">
          <Button
            variant="outline"
            className="text-teal-600 border-teal-600 bg-[#E7E9ED] hover:bg-teal-50 flex items-center space-x-2 space-x-reverse"
          >
            <Download className="h-5 w-5" />
            <span>تصدير للإكسل</span>
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-2 space-x-reverse"
            onClick={() => router.push(createPollPath)}
          >
            <FileText className="h-5 w-5" />
            <span>إضافة</span>
          </Button>
        </div>
      </div>
      <div className="max-h-[75vh] overflow-y-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["الاسم", "عدد الأسئلة", "النتيجة", "وصف بسيط", "تفاصيل"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {polls.map((poll) => (
              <tr key={poll.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {poll.title}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {poll.questions.length}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 bg-green-500 rounded-full ml-2"></span>

                    {"0%"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <DescriptionCell description={poll.description} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="link"
                    className="text-teal-600 hover:text-teal-800 p-0 h-auto"
                    onClick={() => handleViewDetails(poll.id)}
                  >
                    عرض
                  </Button>
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={6} className="text-center py-4">
                <Button
                  variant="link"
                  className="text-teal-600 hover:text-teal-800 text-base"
                >
                  عرض المزيد
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
