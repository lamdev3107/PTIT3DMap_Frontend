// App.js
import React, { useState, useRef, useEffect } from "react";
import {
  PlusCircle,
  Camera,
  X,
  MapPin,
  Save,
  Upload,
  Eye,
  Edit,
  Move,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import axios from "axios";
import base64ToFile from "@/utils/base64ToFile";
// import "./index.css";

export default function TourForm({
  roomId = null,
  data = null,
  open,
  setOpen,
}) {
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentScene, setCurrentScene] = useState(null);
  const [editingSceneName, setEditingSceneName] = useState(null);
  const [newSceneName, setNewSceneName] = useState("");

  const [addingHotspot, setAddingHotspot] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [hotspotType, setHotspotType] = useState("");
  const [hotspotName, setHotspotName] = useState("");
  const [targetScene, setTargetScene] = useState("");

  const [isViewing, setIsViewing] = useState(false);
  const [pannellumInstance, setPannellumInstance] = useState(null);

  const [editingHotspot, setEditingHotspot] = useState(null);
  const [isMovingHotspot, setIsMovingHotspot] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [mousePosition, setMousePosition] = useState({ pitch: 0, yaw: 0 });
  const [hotspotPosition, setHotspotPosition] = useState({ pitch: 0, yaw: 0 });

  const fileInputRef = useRef(null);
  const pannellumContainerRef = useRef(null);
  const editorViewerRef = useRef(null);

  // Thay đổi state cấu hình để lưu theo từng scene
  const [sceneConfigs, setSceneConfigs] = useState({});

  const onOpenChange = (isOpen) => {
    console.log("heck dât", data);
    if (data) {
      setScenes(data);
      setCurrentScene(data[0]?.title);
      setCurrentSceneIndex(0);
      setHotspots(data);
      setAddingHotspot(false);
    }
    if (!isOpen) {
      setScenes([]);
      setCurrentScene(null);
      setCurrentSceneIndex(0);
      setHotspots([]);
      setAddingHotspot(false);
      setHotspotName("");
      setTargetScene("");
    }
    setOpen(!open);
  };

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
        // console.log("Pannellum đã được tải");
        initPannellum();
      };

      document.body.appendChild(script);

      return () => {
        document.head.removeChild(cssLink);
        document.body.removeChild(script);
      };
    };

    loadPannellum();
  }, []);
  useEffect(() => {
    if (scenes.length > 0 && window.pannellum) {
      initPannellum();
    }
  }, [currentSceneIndex, currentScene, scenes, isViewing, hotspots]);
  console.log("Check scene", scenes);
  // Khởi tạo Pannellum
  const initPannellum = () => {
    if (!window.pannellum || scenes.length === 0) return;

    // Xóa instance cũ nếu có
    if (pannellumInstance) {
      pannellumInstance.destroy();
    }
    // Lấy container phù hợp dựa trên mode
    const container = isViewing
      ? pannellumContainerRef.current
      : editorViewerRef.current;
    if (!container) return;

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
      // Tạo cấu hình mặc định cho scene nếu chưa có
      if (!sceneConfigs[scene.title]) {
        setSceneConfigs((prev) => ({
          ...prev,
          [scene.title]: {
            minYaw: -180,
            maxYaw: 180,
            minPitch: -100,
            maxPitch: 100,
            hfov: 120,
          },
        }));
      }

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
    const viewer = window.pannellum.viewer(container.id, sceneConfig);

    // Lưu instance để sử dụng sau này
    setPannellumInstance(viewer);

    // Xử lý sự kiện click để thêm hotspot trong chế độ chỉnh sửa
    if (!isViewing) {
      viewer.on("click", function (e) {
        if (addingHotspot) {
          setAddingHotspot(false);
        }
      });
      // Add scene change event listener
      viewer.on("scenechange", function (sceneId) {
        setCurrentScene(sceneId);
      });
    }
  };

  // Hàm xử lý khi người dùng tải ảnh lên
  const handleImageUpload = (event) => {
    const files = event.target.files;

    if (files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const newScene = {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          title: file.name.replace(/\.[^/.]+$/, ""),
          panorama: e.target.result,
        };

        setScenes((prevScenes) => [...prevScenes, newScene]);

        // Nếu đây là scene đầu tiên, đặt nó làm scene hiện tại
        if (scenes.length === 0) {
          setCurrentSceneIndex(0);
        }
        if (!currentScene) {
          setCurrentScene(newScene.title);
        }

        // Thêm cấu hình mặc định cho scene mới
        setSceneConfigs((prev) => ({
          ...prev,
          [newScene.title]: {
            hfov: 120,
            minYaw: -180,
            maxYaw: 180,
            minPitch: -100,
            maxPitch: 100,
          },
        }));

        setHotspots((prevHotspots) => ({
          ...prevHotspots,
          [newScene.title]: prevHotspots[newScene.title] || [],
        }));
      };

      reader.readAsDataURL(file);
    });
  };

  // Cập nhật hàm editSceneName để xử lý đúng việc đổi tên scene
  const editSceneName = () => {
    if (!newSceneName.trim() || !editingSceneName) return;

    // Kiểm tra xem tên mới đã tồn tại chưa
    const nameExists = scenes.some(
      (scene) =>
        scene.title === newSceneName && scene.title !== editingSceneName
    );

    if (nameExists) {
      alert("Tên scene đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    // Cập nhật tên scene trong danh sách scenes
    const updatedScenes = scenes.map((scene) => {
      if (scene.title === editingSceneName) {
        return {
          ...scene,
          title: newSceneName,
        };
      }
      return scene;
    });
    setScenes(updatedScenes);

    // Cập nhật hotspots với tên mới
    if (hotspots[editingSceneName]) {
      setHotspots((prev) => {
        const newHotspots = { ...prev };
        newHotspots[newSceneName] = newHotspots[editingSceneName];
        delete newHotspots[editingSceneName];
        return newHotspots;
      });
    }

    // Cập nhật sceneConfigs với tên mới
    if (sceneConfigs[editingSceneName]) {
      setSceneConfigs((prev) => {
        const newConfigs = { ...prev };
        newConfigs[newSceneName] = newConfigs[editingSceneName];
        delete newConfigs[editingSceneName];
        return newConfigs;
      });
    }

    // Cập nhật currentScene nếu đang chỉnh sửa scene hiện tại
    if (currentScene === editingSceneName) {
      setCurrentScene(newSceneName);
    }

    // Cập nhật các hotspot liên kết đến scene này
    setHotspots((prev) => {
      const updatedHotspots = { ...prev };

      // Duyệt qua tất cả các scene
      Object.keys(updatedHotspots).forEach((sceneName) => {
        // Cập nhật các hotspot có sceneId trỏ đến scene đang được đổi tên
        updatedHotspots[sceneName] = updatedHotspots[sceneName].map(
          (hotspot) => {
            if (
              hotspot.type === "scene" &&
              hotspot.sceneId === editingSceneName
            ) {
              return { ...hotspot, sceneId: newSceneName };
            }
            return hotspot;
          }
        );
      });

      return updatedHotspots;
    });

    // Reset editing state
    setEditingSceneName(null);
    setNewSceneName("");
  };

  // Hàm xóa scene
  const removeScene = (index) => {
    setScenes((prevScenes) => prevScenes.filter((_, i) => i !== index));

    // Cập nhật index hiện tại nếu cần
    if (currentSceneIndex >= index && currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };
  // Add a new hotspot
  const addHotspot = () => {
    if (!currentScene || !hotspotName) return;

    const newHotspot = {
      pitch: 0,
      yaw: 0,
      type: targetScene ? "scene" : "info",
      text: hotspotName,
    };

    if (targetScene) {
      newHotspot.sceneId = targetScene;
    }

    setHotspots((prevHotspots) => ({
      ...prevHotspots,
      [currentScene]: [...(prevHotspots[currentScene] || []), newHotspot],
    }));

    setHotspotName("");
    setTargetScene("");
  };

  // Delete a hotspot
  const deleteHotspot = (index) => {
    setHotspots((prevHotspots) => ({
      ...prevHotspots,
      [currentScene]: prevHotspots[currentScene].filter((_, i) => i !== index),
    }));
  };

  // Hàm lưu tour
  const saveTour = async () => {
    const formData = new FormData();

    // Prepare scenes data in a more compact format

    scenes.forEach((scene, i) => {
      formData.append(`scenes[${i}][title]`, scene.title);
      formData.append(`scenes[${i}][roomId]`, roomId);
      formData.append(`scenes[${i}][panorama]`, base64ToFile(scene.panorama));
    });
    // Prepare hotspots data in a more compact format
    const hotspotsData = {};
    Object.keys(hotspots).forEach((sceneTitle) => {
      hotspotsData[sceneTitle] = hotspots[sceneTitle].map((hotspot) => ({
        text: hotspot.text,
        type: hotspot.type,
        pitch: hotspot.pitch,
        yaw: hotspot.yaw,
        sceneId: hotspot.sceneId || null,
      }));
    });

    // Add hotspots data as a single JSON string
    formData.append("hotspots", JSON.stringify(hotspotsData));

    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/scenes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Add timeout and max content length settings
          timeout: 30000,
          maxContentLength: 50 * 1024 * 1024, // 50MB limit
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error saving tour:", err);
      throw err;
    }
  };

  // Hàm bắt đầu chỉnh sửa hotspot
  const startEditingHotspot = (hotspot) => {
    setEditingHotspot(hotspot);
    setHotspotName(hotspot.text);
    setHotspotType(hotspot.type);
    setTargetScene(hotspot.sceneId || "");
    setIsMovingHotspot(false);
    setCursorStyle("default");
  };

  // Hàm bắt đầu di chuyển hotspot
  const startMovingHotspot = (hotspot) => {
    setEditingHotspot(hotspot);
    setIsMovingHotspot(true);
    setHotspotPosition({ pitch: hotspot.pitch, yaw: hotspot.yaw });
  };

  // Hàm xử lý click chuột trong panorama để cập nhật vị trí hotspot
  const handlePanoramaClick = (e) => {
    if (!isMovingHotspot || !editingHotspot || !pannellumInstance) return;

    // Lấy container của Pannellum
    const container = pannellumInstance.getContainer();
    const rect = container.getBoundingClientRect();

    // Tính toán vị trí tương đối của chuột trong container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Chuyển đổi tọa độ pixel sang tọa độ panorama
    const coords = pannellumInstance.mouseEventToCoords(e);
    if (coords) {
      const [yaw, pitch] = coords;

      // Cập nhật vị trí hotspot
      const updatedHotspot = {
        ...editingHotspot,
        pitch,
        yaw,
      };

      // Cập nhật hotspots
      setHotspots((prevHotspots) => ({
        ...prevHotspots,
        [currentScene]: prevHotspots[currentScene].map((h) =>
          h === editingHotspot ? updatedHotspot : h
        ),
      }));

      // Cập nhật lại Pannellum viewer
      if (pannellumInstance) {
        // Xóa hotspot cũ
        pannellumInstance.removeHotSpot(editingHotspot.id);

        // Thêm hotspot mới
        pannellumInstance.addHotSpot({
          id: editingHotspot.id,
          pitch,
          yaw,
          type: editingHotspot.type,
          text: editingHotspot.text,
          ...(editingHotspot.type === "scene" && {
            sceneId: editingHotspot.sceneId,
          }),
        });
      }

      // Kết thúc di chuyển
      setIsMovingHotspot(false);
    }
  };

  // Hàm xử lý di chuyển chuột trong panorama
  const handlePanoramaMouseMove = (e) => {
    if (!pannellumInstance) return;

    // Get mouse coordinates relative to the viewer
    const mouseEvent = {
      clientX: e.clientX,
      clientY: e.clientY,
    };

    // Convert mouse coordinates to spherical coordinates
    const coords = pannellumInstance.mouseEventToCoords(mouseEvent);

    if (coords) {
      // Extract yaw and pitch from coordinates
      let [yaw, pitch] = coords;

      // Normalize yaw to range -180 to 180
      yaw = ((yaw + 180) % 360) - 180;

      // Clamp pitch to range -90 to 90
      pitch = Math.max(-90, Math.min(90, pitch));

      setMousePosition({ pitch, yaw });

      // Update hotspot position if moving
      if (isMovingHotspot) {
        setHotspotPosition({ pitch, yaw });
      }
    }
  };

  // Thêm event listener cho panorama khi component mount
  useEffect(() => {
    if (pannellumInstance) {
      const panoramaElement = document.querySelector("#editor-viewer");
      if (panoramaElement) {
        panoramaElement.addEventListener("mousemove", handlePanoramaMouseMove);
        panoramaElement.addEventListener("click", handlePanoramaClick);
      }
    }

    return () => {
      const panoramaElement = document.querySelector("#editor-viewer");
      if (panoramaElement) {
        panoramaElement.removeEventListener(
          "mousemove",
          handlePanoramaMouseMove
        );
        panoramaElement.removeEventListener("click", handlePanoramaClick);
      }
    };
  }, [pannellumInstance, isMovingHotspot, editingHotspot]);

  // Cập nhật style cursor khi isMovingHotspot thay đổi
  useEffect(() => {
    const panoramaElement = document.querySelector("#editor-viewer");
    if (panoramaElement) {
      panoramaElement.style.cursor = isMovingHotspot ? "move" : "default";
    }
  }, [isMovingHotspot]);

  // Hàm cập nhật cấu hình cho scene hiện tại
  const updateSceneConfig = (key, value) => {
    if (!currentScene) return;

    setSceneConfigs((prev) => ({
      ...prev,
      [currentScene]: {
        ...prev[currentScene],
        [key]: value,
      },
    }));

    // Cập nhật lại viewer nếu đang tồn tại
    if (pannellumInstance) {
      // Lưu lại các hotspot hiện tại
      const currentHotspots =
        pannellumInstance.getConfig().scenes[currentScene].hotSpots;

      // Tạo cấu hình mới
      const newConfig = {
        default: {
          firstScene: currentScene,
          sceneFadeDuration: 1000,
          autoLoad: true,
          showControls: true,
        },
        scenes: {
          [currentScene]: {
            title: currentScene,
            panorama: scenes.find((s) => s.title === currentScene)?.panorama,
            hotSpots: currentHotspots,
            ...sceneConfigs[currentScene],
            [key]: value,
          },
        },
      };

      // Xóa viewer cũ
      pannellumInstance.destroy();

      // Tạo viewer mới với cấu hình mới
      const container = isViewing
        ? pannellumContainerRef.current
        : editorViewerRef.current;
      const newViewer = window.pannellum.viewer(container.id, newConfig);
      setPannellumInstance(newViewer);

      // Thêm lại các event listener
      if (!isViewing) {
        newViewer.on("click", function (e) {
          if (addingHotspot) {
            setAddingHotspot(false);
          }
        });
        newViewer.on("scenechange", function (sceneId) {
          setCurrentScene(sceneId);
        });
      }
    }
  };

  return (
    <Dialog className="h-fit p-2" open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[90vw] gap-1 md:max-w-[80vw]  h-fit max-h-[95vh] overflow-hidden p-0"
        onInteractOutside={(event) => {
          event.preventDefault(); // 👉 Ngăn dialog đóng khi click outside
        }}
      >
        <DialogHeader className={"py-5 mx-5  border-b"}>
          <DialogTitle>
            {data ? "Chỉnh sửa Tour 360" : "Thêm mới Tour 360"}
          </DialogTitle>
          {data ? (
            <DialogDescription>
              Nhập thông tin cần chỉnh sửa và nhấn lưu thay đổi
            </DialogDescription>
          ) : (
            <></>
          )}
        </DialogHeader>
        <div className="overflow-auto h-[calc(95vh-85px)] px-5 pb-5 ">
          <div className="flex space-x-2 text-white my-3 ">
            <button
              onClick={() => saveTour()}
              className="flex items-center bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded"
            >
              <Save className="w-5 h-5 mr-2" />
              Lưu Tour
            </button>
            <button
              onClick={() => setIsViewing(!isViewing)}
              className="flex items-center bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              <Eye className="w-5 h-5 mr-2" />
              {isViewing ? "Thoát Xem" : "Xem Tour"}
            </button>
          </div>

          {!isViewing ? (
            <>
              <div className="bg-white  mb-6">
                <div className="mb-4">
                  <h2 className="text-md font-semibold mb-2">
                    Dánh sách scene ({scenes.length})
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {scenes.map((scene, index) => (
                      <div
                        key={scene.id}
                        className={`relative w-40 h-40 border-2 rounded-lg overflow-hidden cursor-pointer ${
                          currentScene === scene.title
                            ? "border-indigo-600"
                            : "border-gray-300"
                        }`}
                        onClick={() => {
                          setCurrentSceneIndex(index);
                          setCurrentScene(scene.title);
                        }}
                      >
                        <img
                          src={scene.panorama}
                          alt={scene.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Hiển thị form chỉnh sửa tên nếu đang edit scene này */}
                        {editingSceneName === scene.title ? (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 p-1 flex items-center">
                            <input
                              type="text"
                              value={newSceneName}
                              onChange={(e) => setNewSceneName(e.target.value)}
                              className="w-full text-white bg-transparent border-b border-gray-400 text-xs focus:outline-none"
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                            <button
                              className="ml-1 text-green-400 hover:text-green-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                editSceneName();
                              }}
                            >
                              ✓
                            </button>
                            <button
                              className="ml-1 text-red-400 hover:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Cancel editing and reset state
                                setEditingSceneName(null);
                                setNewSceneName("");
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-1 text-xs truncate flex justify-between items-center">
                            <span>{scene.title}</span>
                            <button
                              className="text-blue-300 hover:text-blue-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Start editing scene name and store current name
                                setEditingSceneName(scene.title);
                                setNewSceneName(scene.title);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeScene(index);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <div
                      className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-indigo-500 cursor-pointer"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <PlusCircle className="w-10 h-10 text-gray-400" />
                      <span className="mt-2 text-gray-500">Thêm cảnh</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {scenes.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-3">
                  <div className="lg:col-span-8 bg-white rounded-lg border p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-md font-semibold">
                        Preview cảnh: {currentScene}
                      </h2>
                    </div>

                    <div className="relative w-full h-[500px] bg-gray-800 rounded overflow-hidden">
                      {currentScene && (
                        <div
                          id="editor-viewer"
                          ref={editorViewerRef}
                          className="w-full h-full"
                        ></div>
                      )}
                      {isMovingHotspot && (
                        <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 p-2 rounded-md">
                          <p>
                            Đang di chuyển hotspot. Click vào vị trí mới trong
                            panorama để đặt hotspot.
                          </p>
                          <p className="text-sm mt-1">
                            Vị trí hiện tại: Pitch{" "}
                            {hotspotPosition.pitch.toFixed(2)}° | Yaw{" "}
                            {hotspotPosition.yaw.toFixed(2)}°
                          </p>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-md">
                        <p className="text-sm">
                          Con trỏ chuột: Pitch {mousePosition.pitch.toFixed(2)}°
                          | Yaw {mousePosition.yaw.toFixed(2)}°
                        </p>
                      </div>
                    </div>

                    {/* Thêm phần cấu hình Pannellum */}
                    {/* <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Góc nhìn ngang (HFOV):{" "}
                          {sceneConfigs[currentScene]?.hfov || 120}°
                        </label>
                        <input
                          type="range"
                          min="30"
                          max="180"
                          value={sceneConfigs[currentScene]?.hfov || 120}
                          onChange={(e) =>
                            updateSceneConfig("hfov", parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giới hạn trái (Min Yaw):{" "}
                          {sceneConfigs[currentScene]?.minYaw || -180}°
                        </label>
                        <input
                          type="range"
                          min="-180"
                          max="0"
                          value={sceneConfigs[currentScene]?.minYaw || -180}
                          onChange={(e) =>
                            updateSceneConfig(
                              "minYaw",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giới hạn phải (Max Yaw):{" "}
                          {sceneConfigs[currentScene]?.maxYaw || 180}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="180"
                          value={sceneConfigs[currentScene]?.maxYaw || 180}
                          onChange={(e) =>
                            updateSceneConfig(
                              "maxYaw",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nhìn xuống (Min Pitch):{" "}
                          {sceneConfigs[currentScene]?.minPitch || -100}°
                        </label>
                        <input
                          type="range"
                          min="-90"
                          max="0"
                          value={sceneConfigs[currentScene]?.minPitch || -100}
                          onChange={(e) =>
                            updateSceneConfig(
                              "minPitch",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nhìn lên (Max Pitch):{" "}
                          {sceneConfigs[currentScene]?.maxPitch || 100}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          value={sceneConfigs[currentScene]?.maxPitch || 100}
                          onChange={(e) =>
                            updateSceneConfig(
                              "maxPitch",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </div> */}
                  </div>

                  {/* Hotspot editor  */}
                  {/* <div className="lg:col-span-2 p-3 border rounded-md flex justify-center">
                    <Tabs defaultValue="hotspots" className="w-full mx-auto">
                      <TabsList className="w-full">
                        <TabsTrigger value="hotspots">
                          Danh sách hotspot
                        </TabsTrigger>
                        <TabsTrigger value="hotspot editor">
                          Hotspot editor
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="hotspots">
                        {currentScene && hotspots[currentScene]?.length > 0 ?
                         (<div className="space-y-4">
                            {hotspots[currentScene].map((hotspot, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-medium">
                                    Hotspot: {hotspot.text}
                                  </h3>
                                  <div className="space-x-2">
                                    <button
                                      onClick={() =>
                                        startEditingHotspot(hotspot)
                                      }
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        startMovingHotspot(hotspot)
                                      }
                                      className="text-green-500 hover:text-green-700"
                                    >
                                      <Move className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => deleteHotspot(index)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <p>
                                    Loại:{" "}
                                    {hotspot.type === "scene"
                                      ? "Liên kết scene"
                                      : "Thông tin"}
                                  </p>
                                  {hotspot.type === "scene" && (
                                    <p>Scene đích: {hotspot.sceneId}</p>
                                  )}
                                  <p>
                                    Vị trí: Pitch {hotspot.pitch.toFixed(2)}°,
                                    Yaw {hotspot.yaw.toFixed(2)}°
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : 
                          <div className="space-y-4">
                            <p>Không có hotspot nào trong scene này.</p>
                          </div>
                        }
                      </TabsContent>

                      <TabsContent value="hotspot editor">
                        {currentScene && (
                          <div className="bg-white border p-4 rounded-md overflow-auto">
                            <h2 className="text-md font-semibold mb-4">
                              {editingHotspot
                                ? "Chỉnh sửa Hotspot"
                                : "Thêm Hotspot mới"}
                            </h2>

                            <div className="grid grid-cols-1 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tên Hotspot
                                </label>
                                <input
                                  type="text"
                                  value={hotspotName}
                                  onChange={(e) => {
                                    setHotspotName(e.target.value);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Nhập tên hotspot"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Loại Hotspot
                                </label>
                                <select
                                  value={hotspotType}
                                  onChange={(e) => {
                                    setHotspotType(e.target.value);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="info">Thông tin</option>
                                  <option value="scene">Liên kết scene</option>
                                </select>
                              </div>
                              {hotspotType == "scene" && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Scene liên kết
                                  </label>
                                  <select
                                    value={targetScene}
                                    onChange={(e) =>
                                      setTargetScene(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Chọn scene</option>
                                    {scenes
                                      .filter(
                                        (scene) => scene.title !== currentScene
                                      )
                                      .map((scene) => (
                                        <option
                                          key={scene.id}
                                          value={scene.title}
                                        >
                                          {scene.title}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end space-x-2">
                              {editingHotspot && (
                                <button
                                  onClick={() => {
                                    setEditingHotspot(null);
                                    setHotspotName("");
                                    setTargetScene("");
                                    setHotspotType("");
                                  }}
                                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                  Hủy
                                </button>
                              )}
                              <button
                                onClick={
                                  editingHotspot
                                    ? () => {
                                        const updatedHotspot = {
                                          ...editingHotspot,
                                          text: hotspotName,
                                          type: hotspotType,
                                          sceneId:
                                            hotspotType === "scene"
                                              ? targetScene
                                              : undefined,
                                        };
                                        setHotspots((prevHotspots) => ({
                                          ...prevHotspots,
                                          [currentScene]: prevHotspots[
                                            currentScene
                                          ].map((h) =>
                                            h === editingHotspot
                                              ? updatedHotspot
                                              : h
                                          ),
                                        }));
                                        setEditingHotspot(null);
                                        setHotspotName("");
                                        setTargetScene("");
                                        setHotspotType("");
                                      }
                                    : addHotspot
                                }
                                disabled={!hotspotName}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                  !hotspotName
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              >
                                {editingHotspot
                                  ? "Lưu thay đổi"
                                  : "Thêm hotspot"}
                              </button>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div> */}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Chế độ xem</h2>
                <div className="flex flex-wrap gap-2">
                  {scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      onClick={() => setCurrentSceneIndex(index)}
                      className={`px-3 py-1 rounded text-sm ${
                        index === currentSceneIndex
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {scene.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full h-[65vh] bg-black rounded overflow-hidden">
                {scenes[currentSceneIndex] && (
                  <div
                    id="pannellum-container"
                    ref={pannellumContainerRef}
                    className=""
                  ></div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
