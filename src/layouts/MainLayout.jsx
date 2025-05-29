import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check initially
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-primary mb-2">
            Vui lòng xoay ngang màn hình điện thoại
          </h2>
          <p className="text-gray-600">Để có trải nghiệm tốt nhất</p>
        </div>
      </div>
    );
  }
  return (
    <main className="w-full h-full">
      <Outlet />
    </main>
  );
};
