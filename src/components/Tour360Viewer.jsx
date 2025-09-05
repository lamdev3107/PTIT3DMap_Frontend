import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogClose, DialogContent } from "./ui/dialog";
import axios from "axios";
import img360 from "@/assets/img360/A2105.JPG";
import img360_2 from "@/assets/img360/A2G01.JPG";
import { DialogTitle } from "@radix-ui/react-dialog";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { XIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const dummyScenes = [
  {
    title: "Scene 1",
    panorama: img360,
    hotspots: [],
  },
  {
    title: "Scene 2",
    panorama: img360_2,
    hotspots: [],
  },
];
export const Tour360Viewer = ({ data, open, setOpen }) => {
  const [scenes, setScenes] = useState([]);
  const [currentScene, setCurrentScene] = useState(null);
  console.log("check data", data);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [hotspots, setHotspots] = useState({});
  const [sceneConfigs, setSceneConfigs] = useState({});
  const [pannellumInstance, setPannellumInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pannellumContainerRef = useRef(null);
  // Tải dữ liệu tour từ API

  useEffect(() => {
    let time = null;
    if (open && data) {
      setScenes(data.length > 0 ? data : dummyScenes);
      // Thiết lập scene đầu tiên nếu có
      if (data.length > 0) {
        setCurrentScene(data[0].title);
        setCurrentSceneIndex(0);
      } else {
        setCurrentScene(dummyScenes[0].title);
        setCurrentSceneIndex(0);
      }

      // Khởi tạo cấu hình mặc định cho mỗi scene
      const configs = {};
      (data && data.length > 0 ? data : dummyScenes).forEach((scene) => {
        configs[scene.title] = {
          hfov: 120,
          minYaw: -180,
          maxYaw: 180,
          minPitch: -100,
          maxPitch: 100,
        };
      });
      setSceneConfigs(configs);
      setLoading(false);
    }
    if (open && !data) {
      time = setTimeout(() => {
        () => {
          setError("Không có dữ liệu tour.");
          setLoading(false);
        };
        setOpen(false); // Đóng dialog sau 3 giây nếu không có dữ liệu tour
      }, 3000);
    }
    if (time) {
      return () => {
        clearTimeout(time);
      };
    }
  }, [open]);

  useEffect(() => {
    if (currentSceneIndex >= 0 && scenes[currentSceneIndex]) {
      setHotspots(scenes[currentSceneIndex].hotSpots || []);
    }
  }, [currentSceneIndex, scenes]);

  // Tải thư viện Pannellum khi component được mount
  useEffect(() => {
    const loadPannellum = async () => {
      // Thêm CSS
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css";
      document.head.appendChild(cssLink);

      // Thêm JavaScript
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js";
      script.async = true;

      // Đảm bảo script đã được tải
      script.onload = () => {
        console.log("Pannellum đã được tải");
        if (scenes.length > 0) {
          initPannellum();
        }
      };

      document.body.appendChild(script);

      return () => {
        document.head.removeChild(cssLink);
        document.body.removeChild(script);
      };
    };
    loadPannellum();
  }, []);

  // Cập nhật viewer khi scene hiện tại thay đổi
  useEffect(() => {
    if (scenes.length > 0 && window.pannellum) {
      initPannellum();
    }
  }, [currentSceneIndex, currentScene, scenes, hotspots]);

  // Khởi tạo Pannellum
  const initPannellum = () => {
    if (
      !window.pannellum ||
      scenes.length === 0 ||
      !pannellumContainerRef.current
    )
      return;

    // Xóa instance cũ nếu có
    if (pannellumInstance) {
      pannellumInstance.destroy();
    }

    // Create a complete configuration with all scenes
    const sceneConfig = {
      default: {
        firstScene: currentScene,
        sceneFadeDuration: 1000,
        autoLoad: true,
        showControls: true,
      },
      scenes: {},
    };

    scenes.forEach((scene) => {
      sceneConfig.scenes[scene.title] = {
        title: scene.title,
        panorama: scene.panorama,
        hotSpots: scene.hotSpots || [],
        ...sceneConfigs[scene.title],
      };
    });

    // Khởi tạo Pannellum viewer
    const viewer = window.pannellum.viewer(
      pannellumContainerRef.current.id,
      sceneConfig
    );

    // Lưu instance để sử dụng sau này
    setPannellumInstance(viewer);

    // Add scene change event listener
    viewer.on("scenechange", function (sceneId) {
      setCurrentScene(sceneId);
      // Tìm index của scene mới để cập nhật currentSceneIndex
      const newIndex = scenes.findIndex((scene) => scene.title === sceneId);
      if (newIndex !== -1) {
        setCurrentSceneIndex(newIndex);
        // Cập nhật hotspots khi chuyển scene
        setHotspots(scenes[newIndex].hotSpots || []);
      }
    });
  };

  // Hàm chuyển đổi scene
  const changeScene = (sceneTitle, index) => {
    if (pannellumInstance && sceneTitle) {
      pannellumInstance.loadScene(sceneTitle);
      setCurrentScene(sceneTitle);
      setCurrentSceneIndex(index);
    }
  };

  const onOpenChange = (isOpen) => {
    if (!isOpen) {
      // Cleanup khi đóng dialog
      if (pannellumInstance) {
        pannellumInstance.destroy();
        setPannellumInstance(null);
      }
      setScenes([]);
      setCurrentScene(null);
      setCurrentSceneIndex(0);
      setHotspots({});
    }
    setOpen(isOpen);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-screen h-full border-none rounded-sm p-0 overflow-hidden"
        onInteractOutside={(event) => {
          event.preventDefault(); // Ngăn dialog đóng khi click outside
        }}
      >
        {/* <DialogTitle></DialogTitle> */}
        <DialogClose
          onClick={() => onOpenChange(false)}
          className="absolute z-50 top-4 right-4 bg-white text-red-primary hover:bg-red-primary hover:text-white p-2 rounded-full transition-all duration-200"
        >
          <XIcon />
        </DialogClose>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Panorama Viewer */}
            <div
              id="pannellum-viewer"
              ref={pannellumContainerRef}
              className="w-full h-full"
            ></div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
              {currentSceneIndex > 0 && (
                <button
                  onClick={() =>
                    changeScene(
                      scenes[currentSceneIndex - 1].title,
                      currentSceneIndex - 1
                    )
                  }
                  className="bg-white hover:bg-red-primary hover:text-white absolute top-1/2 left-1 -translate-y-1/2 bg-opacity-50 hover:bg-opacity-70 text-red-primary p-2 rounded-full transition-all duration-200"
                >
                  <IoChevronBack size={24} />
                </button>
              )}
              {currentSceneIndex < scenes.length - 1 && (
                <button
                  onClick={() =>
                    changeScene(
                      scenes[currentSceneIndex + 1].title,
                      currentSceneIndex + 1
                    )
                  }
                  className="bg-white hover:bg-red-primary hover:text-white absolute top-1/2 right-2 -translate-y-1/2 bg-opacity-50 hover:bg-opacity-70 text-red-primary p-2 rounded-full transition-all duration-200"
                >
                  <IoChevronForward size={24} />
                </button>
              )}
            </div>

            {/* Scene List at Bottom Center */}
            <div className="absolute bottom-4 left-1/2 transform  -translate-x-1/2 bg-white bg-opacity-70 rounded-lg p-2 min-[200px] md:max-w-[40%] overflow-x-auto">
              <div className="flex space-x-2">
                {scenes.map((scene, index) => (
                  <div
                    key={scene.id || index}
                    onClick={() => changeScene(scene.title, index)}
                    className={`cursor-pointer transition-all  rounded-md  duration-200 ${
                      currentSceneIndex === index
                        ? "border-2 border-red-primary"
                        : "border border-gray-400 hover:border-white"
                    }`}
                  >
                    <div className="w-10 h-10 md:w-20 md:h-20 relative overflow-hidden rounded-md">
                      <img
                        src={scene.panorama}
                        alt={scene.title}
                        className="w-full h-full object-cover"
                      />

                      <p
                        className={`absolute bg-black bottom-0 left-0 right-0 text-sm text-white line-clamp-1`}
                      >
                        {scene.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Tour360Viewer;
