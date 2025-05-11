import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import axios from "axios";
import img360 from "@/assets/img360/A2105.JPG";
import img360_2 from "@/assets/img360/A2G01.JPG";
import { DialogTitle } from "@radix-ui/react-dialog";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

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
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [hotspots, setHotspots] = useState({});
  const [sceneConfigs, setSceneConfigs] = useState({});
  const [pannellumInstance, setPannellumInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pannellumContainerRef = useRef(null);
  console.log("check currentSCen", currentScene);
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
    if (currentSceneIndex)
      setHotspots(scenes[currentSceneIndex].hotSpots || {});
  }, [currentSceneIndex]);

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
      // Create a deep copy of the hotspots to prevent reference issues
      const sceneHotspots = (hotspots[scene.title] || []).map((hotspot) => ({
        ...hotspot,
      }));

      sceneConfig.scenes[scene.title] = {
        title: scene.title,
        panorama: scene.panorama,
        hotSpots: sceneHotspots,
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
        className="sm:max-w-[95vw] md:max-w-[95vw] h-[95vh] p-0 overflow-hidden"
        onInteractOutside={(event) => {
          event.preventDefault(); // Ngăn dialog đóng khi click outside
        }}
      >
        {/* <DialogTitle></DialogTitle> */}

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
                  className="bg-black absolute top-1/2 left-1 -translate-y-1/2 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
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
                  className="bg-black absolute top-1/2 right-2 -translate-y-1/2 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                >
                  <IoChevronForward size={24} />
                </button>
              )}
            </div>

            {/* Scene List at Bottom Center */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 rounded-lg p-2 max-w-[90%] overflow-x-auto">
              <div className="flex space-x-2">
                {scenes.map((scene, index) => (
                  <div
                    key={scene.id || index}
                    onClick={() => changeScene(scene.title, index)}
                    className={`cursor-pointer transition-all duration-200 ${
                      currentSceneIndex === index
                        ? "border-2 border-blue-500 scale-105"
                        : "border border-gray-400 hover:border-white"
                    }`}
                  >
                    <div className="w-20 h-20 relative">
                      <img
                        src={scene.panorama}
                        alt={scene.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate text-center">
                        {scene.title}
                      </div>
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
