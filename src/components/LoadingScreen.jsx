// import React from "react";
// import { Progress } from "@/components/ui/progress";
// import { useProgress } from "@react-three/drei";

// const LoadingScreen = () => {
 //const {progress} = useProgress()
//   return (
//     <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 z-50">
//       <div className="mb-8  flex flex-col items-center justify-content-center gap-5">
//         <h1 className="text-5xl font-bold text-white mb-2">
//           {/* <span className="vr-gradient-text">VR</span> Experience */}
//           <img src={logo} alt="" className=" h-10" />
//         </h1>
//         <p className="text-center text-2xl font-bold w-full text-[#2e3243]">
//           Chào mừng bạn đến với Học viện Công nghệ Bưu chính Viễn Thông...
//         </p>
//       </div>

//       <div className="w-73 mb-4">
//         <Progress value={progress} className="h-2 bg-white" indicatorClassName="bg-red-500" />
//       </div>

//       <p className="text-vr-text">{Math.round(progress)}%</p>
//     </div>
//   );
// };

// export default LoadingScreen;

import { useProgress } from "@react-three/drei";
import { Progress } from "./ui/progress";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";

const LoadingScreen = ({ started, onStarted }) => {
  const [ready, setReady] = useState(false);
  const { progress } = useProgress();

  useEffect(() => {
    let timer = null;
    if (progress == 100) {
      timer = setTimeout(() => {
        setReady(true);
      }, 1000);
    }
    return () =>{
      if(timer)  clearTimeout(timer); // clear timer if it
    };
  }, [progress]);
  return (
    <div style={{
      transformOrigin: "right"
    }} className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 z-50 ${started ? "w-0 pointer-events-none" : ""} transition-all duration-1000 ease-out`}>
         <div className="mb-8  flex flex-col items-center justify-content-center gap-5">
       <h1 className="text-5xl font-bold text-white mb-2">
         <img src={logo} alt="" className=" h-32" />
       </h1>
       <p className="text-center text-2xl font-bold w-full text-[#2e3243]">
         Chào mừng bạn đến với Học viện Công nghệ Bưu chính Viễn Thông
       </p>
     </div>
        <>
        <div className="w-73 mb-4">
       <Progress value={progress} className="h-2 bg-white" indicatorClassName="bg-red-500" />
     </div>

     <p className="text-vr-text">{Math.round(progress)}%</p>
        </>
   
     
    </div>
  );
};
export  default LoadingScreen;
