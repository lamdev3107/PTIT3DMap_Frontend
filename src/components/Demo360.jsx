// App.js
import React, { useState, useRef, useEffect } from "react";
import { PlusCircle, Camera, X, MapPin, Save, Upload, Eye } from "lucide-react";
// import "./index.css";

export default function Demo360() {
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [addingHotspot, setAddingHotspot] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [tourName, setTourName] = useState("Tour 360 mới");
  const [isViewing, setIsViewing] = useState(false);
  const [pannellumInstance, setPannellumInstance] = useState(null);

  const viewerRef = useRef(null);
  const fileInputRef = useRef(null);
  const pannellumContainerRef = useRef(null);
  const editorViewerRef = useRef(null);

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

  // Cập nhật viewer khi scene hiện tại thay đổi
  useEffect(() => {
    if (scenes.length > 0 && window.pannellum) {
      initPannellum();
    }
  }, [currentSceneIndex, scenes, isViewing]);

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

    // Tạo config cho Pannellum
    const config = {
      type: "equirectangular",
      panorama: scenes[currentSceneIndex]?.imageUrl,
      autoLoad: true,
      showControls: true,
      hotSpots: getHotspotsForCurrentScene(),
    };

    // Khởi tạo Pannellum viewer
    const viewer = window.pannellum.viewer(container.id, config);

    // Lưu instance để sử dụng sau này
    setPannellumInstance(viewer);

    // Xử lý sự kiện click để thêm hotspot trong chế độ chỉnh sửa
    if (!isViewing) {
      viewer.on("click", function (e) {
        if (addingHotspot) {
          addHotspotAtPosition(e.pitch, e.yaw);
          setAddingHotspot(false);
        }
      });
    }
  };

  // Hàm tạo danh sách hotspot cho Pannellum
  const getHotspotsForCurrentScene = () => {
    if (!scenes[currentSceneIndex]) return [];

    return hotspots
      .filter((h) => h.sceneId === scenes[currentSceneIndex].id)
      .map((hotspot) => {
        const pannellumHotspot = {
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          type: "info",
          text: hotspot.title,
          id: hotspot.id,
        };

        // Nếu có scene đích, thêm xử lý click để chuyển scene
        if (hotspot.targetSceneId) {
          pannellumHotspot.type = "scene";
          pannellumHotspot.sceneId = hotspot.targetSceneId;
          pannellumHotspot.targetYaw = 0;
          pannellumHotspot.targetPitch = 0;
        }

        return pannellumHotspot;
      });
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
          name: file.name.replace(/\.[^/.]+$/, ""),
          imageUrl: e.target.result,
        };

        setScenes((prevScenes) => [...prevScenes, newScene]);

        // Nếu đây là scene đầu tiên, đặt nó làm scene hiện tại
        if (scenes.length === 0) {
          setCurrentSceneIndex(0);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // Hàm xóa scene
  const removeScene = (index) => {
    setScenes((prevScenes) => prevScenes.filter((_, i) => i !== index));

    // Cập nhật index hiện tại nếu cần
    if (currentSceneIndex >= index && currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  // Hàm thêm hotspot tại vị trí pitch, yaw
  const addHotspotAtPosition = (pitch, yaw) => {
    if (!scenes[currentSceneIndex]) return;

    const newHotspot = {
      id: Date.now().toString(),
      pitch: pitch,
      yaw: yaw,
      sceneId: scenes[currentSceneIndex].id,
      title: `Điểm ${
        hotspots.filter((h) => h.sceneId === scenes[currentSceneIndex].id)
          .length + 1
      }`,
      targetSceneId: "",
      description: "",
    };

    setHotspots((prevHotspots) => [...prevHotspots, newHotspot]);

    // Cập nhật lại Pannellum viewer
    if (pannellumInstance) {
      pannellumInstance.addHotSpot({
        id: newHotspot.id,
        pitch: pitch,
        yaw: yaw,
        type: "info",
        text: newHotspot.title,
      });
    }
  };

  // Hàm xóa hotspot
  const removeHotspot = (hotspotId) => {
    setHotspots((prevHotspots) =>
      prevHotspots.filter((h) => h.id !== hotspotId)
    );

    // Xóa hotspot khỏi Pannellum
    if (pannellumInstance) {
      pannellumInstance.removeHotSpot(hotspotId);
    }
  };

  // Hàm cập nhật thuộc tính của hotspot
  const updateHotspot = (id, property, value) => {
    setHotspots((prevHotspots) =>
      prevHotspots.map((h) => (h.id === id ? { ...h, [property]: value } : h))
    );

    // Cập nhật lại viewer nếu đổi tiêu đề
    if (property === "title" && pannellumInstance) {
      const hotspot = pannellumInstance
        .getConfig()
        .hotSpots.find((h) => h.id === id);
      if (hotspot) {
        hotspot.text = value;
        pannellumInstance.removeHotSpot(id);
        pannellumInstance.addHotSpot(hotspot);
      }
    }

    // Cập nhật kiểu hotspot nếu thay đổi targetSceneId
    if (property === "targetSceneId" && pannellumInstance) {
      initPannellum(); // Tạo lại viewer với hotspot đã cập nhật
    }
  };

  // Hàm lưu tour
  const saveTour = () => {
    const tourData = {
      name: tourName,
      scenes,
      hotspots,
    };

    // Tạo file JSON và tải xuống
    const dataStr = JSON.stringify(tourData);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${tourName.replace(/\s+/g, "-")}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Hàm chuyển đến scene được chỉ định bởi hotspot
  const navigateToScene = (targetSceneId) => {
    const targetIndex = scenes.findIndex((scene) => scene.id === targetSceneId);
    if (targetIndex !== -1) {
      setCurrentSceneIndex(targetIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tour 360 Creator</h1>
          <div className="flex space-x-2">
            <button
              onClick={saveTour}
              className="flex items-center bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded"
            >
              <Save className="w-5 h-5 mr-2" />
              Lưu Tour
            </button>
            <button
              onClick={() => setIsViewing(!isViewing)}
              className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              <Eye className="w-5 h-5 mr-2" />
              {isViewing ? "Thoát Xem" : "Xem Tour"}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {!isViewing ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tên Tour:</label>
                <input
                  type="text"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  Cảnh ({scenes.length})
                </h2>
                <div className="flex flex-wrap gap-4">
                  {scenes.map((scene, index) => (
                    <div
                      key={scene.id}
                      className={`relative w-40 h-40 border-2 rounded-lg overflow-hidden cursor-pointer ${
                        index === currentSceneIndex
                          ? "border-indigo-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => setCurrentSceneIndex(index)}
                    >
                      <img
                        src={scene.imageUrl}
                        alt={scene.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-1 text-xs truncate">
                        {scene.name}
                      </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Cảnh hiện tại: {scenes[currentSceneIndex]?.name}
                    </h2>
                    <button
                      onClick={() => setAddingHotspot(!addingHotspot)}
                      className={`flex items-center px-4 py-2 rounded ${
                        addingHotspot
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } text-white`}
                    >
                      <MapPin className="w-5 h-5 mr-2" />
                      {addingHotspot ? "Hủy" : "Thêm Hotspot"}
                    </button>
                  </div>

                  <div className="relative w-full h-96 bg-gray-800 rounded overflow-hidden">
                    {scenes[currentSceneIndex] && (
                      <div
                        id="editor-viewer"
                        ref={editorViewerRef}
                        className="w-full h-full"
                      ></div>
                    )}

                    {addingHotspot && (
                      <div className="absolute inset-0 pointer-events-none bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="text-white text-center p-4 bg-black bg-opacity-70 rounded">
                          Nhấp vào vị trí bất kỳ trên ảnh để thêm điểm hotspot
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Hotspots</h2>

                  {hotspots.filter(
                    (h) => h.sceneId === scenes[currentSceneIndex]?.id
                  ).length === 0 ? (
                    <div className="text-gray-500 text-center py-6">
                      Chưa có hotspot nào. Nhấn "Thêm Hotspot" để tạo mới.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hotspots
                        .filter(
                          (h) => h.sceneId === scenes[currentSceneIndex]?.id
                        )
                        .map((hotspot) => (
                          <div
                            key={hotspot.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-medium">
                                Hotspot: {hotspot.title}
                              </h3>
                              <button
                                onClick={() => removeHotspot(hotspot.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  Tiêu đề:
                                </label>
                                <input
                                  type="text"
                                  value={hotspot.title}
                                  onChange={(e) =>
                                    updateHotspot(
                                      hotspot.id,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  Mô tả:
                                </label>
                                <textarea
                                  value={hotspot.description}
                                  onChange={(e) =>
                                    updateHotspot(
                                      hotspot.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                  rows="2"
                                ></textarea>
                              </div>

                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  Liên kết đến cảnh:
                                </label>
                                <select
                                  value={hotspot.targetSceneId || ""}
                                  onChange={(e) =>
                                    updateHotspot(
                                      hotspot.id,
                                      "targetSceneId",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                >
                                  <option value="">
                                    -- Chọn cảnh liên kết --
                                  </option>
                                  {scenes
                                    .filter(
                                      (scene) =>
                                        scene.id !==
                                        scenes[currentSceneIndex]?.id
                                    )
                                    .map((scene) => (
                                      <option key={scene.id} value={scene.id}>
                                        {scene.name}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm text-gray-600 mb-1">
                                    Pitch (độ dọc):
                                  </label>
                                  <input
                                    type="number"
                                    value={hotspot.pitch || 0}
                                    onChange={(e) =>
                                      updateHotspot(
                                        hotspot.id,
                                        "pitch",
                                        parseFloat(e.target.value)
                                      )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm text-gray-600 mb-1">
                                    Yaw (độ ngang):
                                  </label>
                                  <input
                                    type="number"
                                    value={hotspot.yaw || 0}
                                    onChange={(e) =>
                                      updateHotspot(
                                        hotspot.id,
                                        "yaw",
                                        parseFloat(e.target.value)
                                      )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{tourName} - Chế độ xem</h2>
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
                    {scene.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full h-96 md:h-screen bg-black rounded overflow-hidden">
              {scenes[currentSceneIndex] && (
                <div
                  id="pannellum-container"
                  ref={pannellumContainerRef}
                  className="w-full h-full"
                ></div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
