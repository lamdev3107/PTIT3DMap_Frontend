import { useProgress } from "@react-three/drei";
import { Progress } from "./ui/progress";
import logo from "@/assets/logo.png";
import { useEffect, useState, memo, useCallback } from "react";

const LoadingScreen = memo(({ started, onStarted }) => {
  const [ready, setReady] = useState(false);
  const { progress } = useProgress();

  const handleProgressComplete = useCallback(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    handleProgressComplete();
  }, [handleProgressComplete]);

  return (
    <div
      style={{
        transformOrigin: "right",
      }}
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 z-50 ${
        started ? "w-0 pointer-events-none" : ""
      } transition-all duration-1000 ease-out`}
    >
      <div className="mb-8 padding-8 flex flex-col items-center justify-content-center gap-5">
        <h1 className="text-5xl font-bold text-white mb-2">
          <img src={logo} alt="" className="h-32" />
        </h1>
        <p className="text-center text-2xl font-bold w-full text-[#2e3243]">
          Chào mừng bạn đến với Học viện Công nghệ Bưu chính Viễn Thông
        </p>
      </div>
      <>
        <div className="w-73 mb-4">
          <Progress
            value={progress}
            className="h-2 bg-white"
            indicatorClassName="bg-red-500"
          />
        </div>

        <p className="text-vr-text">{Math.round(progress)}%</p>
      </>
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";

export default LoadingScreen;
