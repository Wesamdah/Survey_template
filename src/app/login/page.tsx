"use client";

import { useUserLoginStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { handleLogin } from "@/utils/api";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { setAccessToken } = useUserLoginStore();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError(null);

    const loginPayload = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await handleLogin(loginPayload);

      localStorage.setItem("token", response);

      router.push("/");
    } catch (error: any) {
      console.error("Frontend Login Error:", error.message);

      setApiError(
        error.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full h-full  bg-white">
      <div className="w-full h-full space-y-10 p-20" dir="rtl">
        {apiError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-right"
            role="alert"
          >
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        <h1 className="text-5xl font-extrabold text-gray-500 text-right">
          أهلاً بك
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <Label
              htmlFor="email"
              className="text-2xl font-medium text-gray-500 block mb-2"
            >
              اسم المستخدم او الإيميل
            </Label>
            <Input
              id="email"
              placeholder="youremail@guru.com"
              className={`p-4 h-20 text-2xl w-full bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-teal-600 ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "هذا الحقل مطلوب",
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-2xl font-medium text-gray-500 flex justify-between items-center mb-2"
            >
              كلمة المرور
              <a href="#" className="text-sm text-gray-500 hover:text-teal-600">
                نسيت كلمة المرور؟
              </a>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                className={`p-4 h-20 text-lg w-full bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-teal-600 ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", { required: "هذا الحقل مطلوب" })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 h-auto text-2xl font-bold bg-teal-600 text-white hover:bg-teal-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2 space-x-reverse">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </span>
            ) : (
              "تسجيل دخول"
            )}
          </Button>
        </form>

        <div className=" space-y-4">
          <p className="text-gray-700 text-xl text-start">
            ليس لديك حساب؟
            <a
              href="#"
              className="text-teal-600 font-medium hover:text-teal-700 mr-1"
            >
              تواصل معنا
            </a>
          </p>

          <div className="mt-6 text-lg text-gray-500 space-x-6 text-end">
            <a href="#" className="hover:text-teal-600">
              شروط الخصوصية
            </a>
            <a href="#" className="hover:text-teal-600">
              الدعم الفني
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
