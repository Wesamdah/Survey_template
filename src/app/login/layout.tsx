"use client";

import AuthSidebar from "@/components/AuthSidebar";
import LoginForm from "./page";

export default function AuthLayout() {
  const sidebarProps = {
    title: "تسجيل الدخول",
    description: "شرح بسيط",
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <main className="w-2/3 mr-0 ml-auto overflow-y-auto">
        <LoginForm />
      </main>

      <div className="w-1/3 fixed left-0 h-full">
        <AuthSidebar {...sidebarProps} />
      </div>
    </div>
  );
}
