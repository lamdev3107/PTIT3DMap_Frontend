import React, { useState, useEffect, useRef } from "react";

function Main() {
  const [scenes, setScenes] = useState({});
  const [currentScene, setCurrentScene] = useState(null);
  const [hotspots, setHotspots] = useState({});
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [hotspotName, setHotspotName] = useState("");
  const [targetScene, setTargetScene] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const viewerRef = useRef(null);
  const pannellumRef = useRef(null);
  const tempHotspotRef = useRef(null); // To store temporary hotspot position during drag

  // Load Pannellum via CDN
  useEffect(() => {
    const pannellumScript = document.createElement("script");
    pannellumScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js";
    pannellumScript.async = true;

    const pannellumCss = document.createElement("link");
    pannellumCss.rel = "stylesheet";
    pannellumCss.href =
      "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css";

    document.body.appendChild(pannellumScript);
    document.head.appendChild(pannellumCss);

    pannellumScript.onload = () => {
      pannellumRef.current = window.pannellum;
    };

    return () => {
      document.body.removeChild(pannellumScript);
      document.head.removeChild(pannellumCss);
    };
  }, []);

  // Initialize or update the panorama viewer when the current scene changes
  useEffect(() => {
    if (!pannellumRef.current || !currentScene) return;

    if (viewerRef.current) {
      viewerRef.current.destroy();
    }

    // Create a complete configuration with all scenes
    const sceneConfig = {
      default: {
        firstScene: currentScene,
        sceneFadeDuration: 1000,
        autoLoad: true,
      },
      scenes: {},
    };

    // Add all available scenes to the configuration
    Object.keys(scenes).forEach((sceneName) => {
      // Create a deep copy of the hotspots to prevent reference issues
      const sceneHotspots = (hotspots[sceneName] || []).map((hotspot) => ({
        ...hotspot,
      }));

      sceneConfig.scenes[sceneName] = {
        title: sceneName,
        panorama: scenes[sceneName],
        hotSpots: sceneHotspots,
      };
    });
    console.log("Check sceneConfig", sceneConfig);
    // Create the viewer with full configuration
    viewerRef.current = pannellumRef.current.viewer("panorama", sceneConfig);

    // Add scene change event listener
    viewerRef.current.on("scenechange", function (sceneId) {
      // Update currentScene state when scene changes via hotspot click
      setCurrentScene(sceneId);
    });

    // Event listeners should be added only once to prevent duplicates
    const panoramaElement = document.getElementById("panorama");

    // Clean up existing event listeners if any
    panoramaElement.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    // Add new event listeners
    panoramaElement.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      // Cleanup event listeners
      panoramaElement?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [currentScene, scenes, hotspots]);
  const handleMouseDown = (e) => {
    if (!currentScene || !viewerRef.current || activeHotspot === null) return;

    // Only start dragging if we're clicking inside the panorama
    if (e.target.closest("#panorama")) {
      setIsDragging(true);

      // Store initial coords for visual feedback
      const coords = viewerRef.current.mouseEventToCoords(e);
      tempHotspotRef.current = coords;

      // Add a temporary hotspot for visual feedback
      if (hotspots[currentScene] && hotspots[currentScene][activeHotspot]) {
        const currentHotspot = hotspots[currentScene][activeHotspot];

        // Remove existing hotspot first (if any)
        try {
          viewerRef.current.removeHotSpot(
            `dragging-hotspot-${activeHotspot}`,
            currentScene
          );
        } catch (e) {
          // Ignore errors if hotspot doesn't exist
        }

        // Add a temporary hotspot to show where we're dragging
        viewerRef.current.addHotSpot(
          {
            id: `dragging-hotspot-${activeHotspot}`,
            pitch: coords[1],
            yaw: coords[0],
            text: currentHotspot.text,
            type: currentHotspot.type,
            cssClass: "dragging-hotspot",
          },
          currentScene
        );
      }

      // Prevent default to avoid selection issues
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    const coords = viewerRef.current.mouseEventToCoords(e);

    if (!isDragging || !viewerRef.current || activeHotspot === null) return;

    // Get mouse position from viewerRef if the event is from panorama element
    // Only proceed if we have a panorama element in the event path
    const panoramaElement = document.getElementById("panorama");
    const rect = panoramaElement.getBoundingClientRect();

    // Check if mouse is inside panorama
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      const coords = viewerRef.current.mouseEventToCoords(e);
      tempHotspotRef.current = coords;

      // Update the temporary hotspot position in real-time
      if (hotspots[currentScene] && hotspots[currentScene][activeHotspot]) {
        try {
          viewerRef.current.removeHotSpot(
            `dragging-hotspot-${activeHotspot}`,
            currentScene
          );
        } catch (e) {
          // Ignore errors if hotspot doesn't exist
        }

        // Add updated temporary hotspot
        viewerRef.current.addHotSpot(
          {
            id: `dragging-hotspot-${activeHotspot}`,
            pitch: coords[1],
            yaw: coords[0],
            text: hotspots[currentScene][activeHotspot].text,
            type: hotspots[currentScene][activeHotspot].type,
            cssClass: "dragging-hotspot",
          },
          currentScene
        );
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging || !viewerRef.current || activeHotspot === null) return;

    // Finalize hotspot position
    if (tempHotspotRef.current) {
      const coords = tempHotspotRef.current;

      // Update the actual hotspot data
      setHotspots((prevHotspots) => {
        const updatedSceneHotspots = [...(prevHotspots[currentScene] || [])];

        // Keep all properties but update position
        updatedSceneHotspots[activeHotspot] = {
          ...updatedSceneHotspots[activeHotspot],
          pitch: coords[1],
          yaw: coords[0],
        };

        return {
          ...prevHotspots,
          [currentScene]: updatedSceneHotspots,
        };
      });

      // Remove the temporary dragging hotspot
      try {
        viewerRef.current.removeHotSpot(
          `dragging-hotspot-${activeHotspot}`,
          currentScene
        );
      } catch (e) {
        // Ignore errors if hotspot doesn't exist
      }
    }

    // Reset dragging state
    setIsDragging(false);
    setActiveHotspot(null);
    tempHotspotRef.current = null;
  };

  // Handle file upload
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        const sceneName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension

        setScenes((prevScenes) => ({
          ...prevScenes,
          [sceneName]: event.target.result,
        }));

        if (!currentScene) {
          setCurrentScene(sceneName);
        }

        setHotspots((prevHotspots) => ({
          ...prevHotspots,
          [sceneName]: prevHotspots[sceneName] || [],
        }));
      };

      reader.readAsDataURL(file);
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

  // Select a hotspot to drag
  const selectHotspotToDrag = (index) => {
    setActiveHotspot(index);
  };

  // Export tour configuration as JSON
  const exportTourConfig = () => {
    const config = {
      default: {
        firstScene: Object.keys(scenes)[0],
        sceneFadeDuration: 1000,
      },
      scenes: {},
    };

    Object.keys(scenes).forEach((sceneName) => {
      config.scenes[sceneName] = {
        title: sceneName,
        panorama: scenes[sceneName],
        hotSpots: hotspots[sceneName] || [],
      };
    });

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(config));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tour_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Add CSS for dragging hotspot
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .dragging-hotspot {
        background-color: rgba(255, 165, 0, 0.7) !important;
        border: 2px solid #ff8c00 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  console.log("check currrentScene", currentScene);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex flex-1 p-4">
        {/* Left sidebar */}
        <div className="w-64 bg-white shadow-md p-4 mr-4 rounded-md flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Scenes</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Panorama Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="mb-4 flex-grow overflow-y-auto">
            <h3 className="text-md font-medium mb-2">Available Scenes</h3>
            <ul className="space-y-2">
              {Object.keys(scenes).map((sceneName) => (
                <li key={sceneName} className="flex items-center">
                  <button
                    onClick={() => setCurrentScene(sceneName)}
                    className={`flex-1 text-left py-1 px-2 rounded-md ${
                      currentScene === sceneName
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {sceneName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={exportTourConfig}
            disabled={Object.keys(scenes).length === 0}
            className={`mt-auto w-full py-2 rounded-md ${
              Object.keys(scenes).length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Export Tour
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Larger panorama preview */}
          <div
            id="panorama"
            className="w-full bg-gray-200 rounded-md mb-4"
            style={{
              height: "70vh",
              cursor: activeHotspot !== null ? "move" : "default",
            }}
          ></div>

          {/* Status message for dragging */}
          {isDragging && (
            <div className="bg-blue-100 text-blue-800 p-2 mb-4 rounded-md text-center">
              Dragging hotspot... Release mouse button to place.
            </div>
          )}

          {/* Hotspot controls */}
          {currentScene && (
            <div className="bg-white shadow-md p-4 rounded-md overflow-auto">
              <h2 className="text-lg font-semibold mb-4">
                Hotspots for {currentScene}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotspot Name
                  </label>
                  <input
                    type="text"
                    value={hotspotName}
                    onChange={(e) => setHotspotName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter hotspot name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Scene (optional)
                  </label>
                  <select
                    value={targetScene}
                    onChange={(e) => setTargetScene(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None (Info Hotspot)</option>
                    {Object.keys(scenes)
                      .filter((scene) => scene !== currentScene)
                      .map((sceneName) => (
                        <option key={sceneName} value={sceneName}>
                          {sceneName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <button
                onClick={addHotspot}
                disabled={!hotspotName}
                className={`px-4 py-2 rounded-md ${
                  !hotspotName
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } mb-4`}
              >
                Add Hotspot
              </button>

              <h3 className="text-md font-medium mb-2">Existing Hotspots</h3>
              <div className="overflow-auto max-h-48">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hotspots[currentScene]?.map((hotspot, index) => (
                      <tr
                        key={index}
                        className={activeHotspot === index ? "bg-blue-50" : ""}
                      >
                        <td className="px-4 py-2 whitespace-nowrap">
                          {hotspot.text}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {hotspot.type === "scene"
                            ? `Scene: ${hotspot.sceneId}`
                            : "Info"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          Pitch: {hotspot.pitch.toFixed(2)}, Yaw:{" "}
                          {hotspot.yaw.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => selectHotspotToDrag(index)}
                            className={`px-2 py-1 rounded-md ${
                              activeHotspot === index
                                ? "bg-blue-500 text-white"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                          >
                            {activeHotspot === index ? "Selected" : "Move"}
                          </button>
                          <button
                            onClick={() => deleteHotspot(index)}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeHotspot !== null && !isDragging && (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-md">
                  <p>Bạn đã chọn một hotspot để di chuyển. Bây giờ hãy:</p>
                  <ol className="list-decimal list-inside mt-2">
                    <li>Click và giữ chuột trên panorama</li>
                    <li>Di chuyển chuột đến vị trí mới</li>
                    <li>Thả chuột để đặt hotspot ở vị trí đó</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Main;
