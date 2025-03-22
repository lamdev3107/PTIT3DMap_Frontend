import React from "react";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <main className="w-full h-full">
      <Outlet />
    </main>
  );
};
