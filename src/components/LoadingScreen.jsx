import React from "react";
import { Progress } from "@/components/ui/progress";
import logo from "@/assets/logo.png";

const LoadingScreen = ({ progress }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#e3dde3] to-[#c9e9ec] z-50">
      <div className="mb-8 animate-pulse flex flex-col items-center justify-content-center gap-5">
        <h1 className="text-5xl font-bold text-white mb-2">
          {/* <span className="vr-gradient-text">VR</span> Experience */}
          <img src={logo} alt="" className=" h-10" />
        </h1>
        <p className="text-center text-xl text-[#2e3243]">
          Chào mừng bạn đến với Học viện Công nghệ Bưu chính Viễn Thông...
        </p>
      </div>

      <div className="w-73 mb-4">
        <Progress value={progress} className="h-2 bg-red-primary" />
      </div>

      <p className="text-vr-text">{Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingScreen;
