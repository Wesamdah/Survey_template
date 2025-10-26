"use client";

import { useUserStore } from "@/store/userStore";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface UserFormData {
  full_name: string;
  email: string;
  phone: string;
  work_status: string;
  education: string;
  birth_date: Date | null;
  address: string;
  gender: string;
}

export default function UserInfoTap({ onNext }: { onNext: () => void }) {
  const { register, handleSubmit } = useForm<UserFormData>();
  const { setUserData } = useUserStore();

  const FORM_ID = "user-info-form";

  const onSubmit = (data: UserFormData) => {
    setUserData(data);
    console.log("User Data,", data);
    if (onNext) onNext();
  };

  return (
    <div className="relative min-h-screen">
      <div className="p-12  max-w-4xl mx-auto" dir="rtl">
        <form
          id={FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
          className=" space-y-7"
        >
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-lg font-medium">
              الاسم
            </Label>
            <Input
              id="full_name"
              className="p-4 h-auto text-lg border-gray-300 focus:border-teal-500"
              {...register("full_name", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-medium">
              البريد الالكتروني
            </Label>
            <Input
              id="email"
              type="email"
              className="p-4 h-auto text-lg border-gray-300 focus:border-teal-500"
              {...register("email", { required: true })}
            />
          </div>
          <div className="space-y-2 hidden">
            <Label htmlFor="phone" className="text-lg font-medium">
              رقم الهاتف
            </Label>
            <Input
              id="phone"
              type="tel"
              className="p-4 h-auto text-lg border-gray-300 focus:border-teal-500"
              {...register("phone")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-lg font-medium">الحالة الوظيفية</Label>
            <div className="flex gap-10 mt-2">
              {["صاحب عمل", "موظف", "طالب"].map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={status}
                    className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500"
                    {...register("work_status", { required: true })}
                  />
                  <span className="text-lg">{status}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="education" className="text-lg font-medium">
              التعليم
            </Label>
            <Input
              id="education"
              className="p-4 h-auto text-lg border-gray-300 focus:border-teal-500"
              {...register("education")}
            />
          </div>
          <div className="flex gap-6">
            <div className="space-y-2 w-1/2">
              <Label htmlFor="birth_date" className="text-lg font-medium">
                تاريخ ولادة
              </Label>
              <Input
                id="birth_date"
                type="date"
                className="p-4 h-auto text-lg border-gray-300 focus:border-teal-500"
                {...register("birth_date")}
              />
            </div>
            <div className="space-y-2 w-1/2">
              <Label htmlFor="age" className="text-lg font-medium">
                العمر
              </Label>
              <Input
                id="age"
                type="number"
                placeholder=""
                className="p-4 h-auto text-lg border-gray-300 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-lg font-medium">
              رقم الهاتف
            </Label>
            <Input
              id="phone"
              type="number"
              className="p-4 h-auto text-lg border-gray-300 focus:border-teal-500"
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-lg font-medium">
              عنوان السكن
            </Label>
            <Input
              id="address"
              className="p-4 h-auto text-lg border-gray-300 focus:border-teal-500"
              {...register("address")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-lg font-medium">الجنس</Label>
            <div className="flex gap-10 mt-2">
              {["أنثى", "ذكر"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={gender}
                    className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500"
                    {...register("gender", { required: true })}
                  />
                  <span className="text-lg">{gender}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>
      <div className="w-full shadow-2xl ">
        <Button
          form={FORM_ID}
          type="submit"
          className="w-full py-6 h-auto text-2xl font-bold bg-teal-600 text-white hover:bg-teal-700 rounded-none transition duration-200 hover:opacity-70 cursor-pointer"
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
