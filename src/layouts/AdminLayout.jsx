import React from "react";
// import { AdminHeader } from "./AdminHeader";
import { Navigate, Outlet, Route } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LucideLogOut } from "lucide-react";
import { useAuth } from "@/provider/AuthProvider";
import { ROUTES } from "@/utils/constants";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "react-hot-toast";
// import { ROUTES } from "@/utils/constants";

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return user ? (
    <SidebarProvider className={`w-screen h-screen `}>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 bg-light-blue-bg shadow-sm flex h-16 shrink-0 items-center justify-between gap-2  px-4 ">
          <div className="text-xl font-bold ">
            {/* <SidebarTrigger className="-ml-1" /> */}
            {/* Chào mừng bạn tới Bản đồ PTIT */}
          </div>
          <div className="flex justify-between  items-center gap-3 p-1.5 rounded-full bg-light-blue-bg">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Admin</AvatarFallback>
            </Avatar>
            <span className="text-md font-semibold">{user.name}</span>
            <Button
              className="rounded-full p-2 bg-white hover:bg-primaryBlue hover:text-white w-fit h-fit text-gray-700"
              onClick={handleLogout}
            >
              <LucideLogOut />
            </Button>
          </div>
        </header>
        <div className="py-8 px-8 overflow-y-auto">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 4000,
          style: {
            background: "#fff",
            color: "#000",
          },
        }}
      />
    </SidebarProvider>
  ) : (
    <Navigate to={ROUTES.LOGIN} />
  );
};
