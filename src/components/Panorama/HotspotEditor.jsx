import React, { useState, useEffect } from "react";

function HotspotEditor({
  scene,
  scenes,
  onUpdateHotspots,
  pannellumInstance,
  setCurrentScene,
  currentScene,
}) {
  const [tempHotspot, setTempHotspot] = useState(null);
  const [hotspotType, setHotspotType] = useState("info");
  const [text, setText] = useState("");
  const [linkedScene, setLinkedScene] = useState("");

  const addTempHotspot = () => {
    const newHotspot = {
      pitch: 0,
      yaw: 0,
      type: "info",
      text: "Drag me",
      cssClass: "draggable-hotspot",
    };
    setTempHotspot(newHotspot);
    onUpdateHotspots([...scene.hotspots, newHotspot]);
  };

  useEffect(() => {
    if (pannellumInstance && tempHotspot) {
      const hotspotElement = document.querySelector(".draggable-hotspot");
      if (hotspotElement) {
        let isDragging = false;
        let startPitch, startYaw;

        const onMouseDown = (e) => {
          isDragging = true;
          startPitch = pannellumInstance.getPitch();
          startYaw = pannellumInstance.getYaw();
        };

        const onMouseMove = (e) => {
          if (isDragging) {
            const newPitch = pannellumInstance.getPitch();
            const newYaw = pannellumInstance.getYaw();
            setTempHotspot((prev) => ({
              ...prev,
              pitch: newPitch,
              yaw: newYaw,
            }));
            onUpdateHotspots([
              ...scene.hotspots.filter((hs) => hs !== tempHotspot),
              { ...tempHotspot, pitch: newPitch, yaw: newYaw },
            ]);
          }
        };

        const onMouseUp = () => {
          isDragging = false;
        };

        hotspotElement.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
          hotspotElement.removeEventListener("mousedown", onMouseDown);
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };
      }
    }
  }, [tempHotspot, pannellumInstance, scene.hotspots, onUpdateHotspots]);

  const saveHotspot = () => {
    if (!tempHotspot) return;

    const finalHotspot = {
      pitch: tempHotspot.pitch,
      yaw: tempHotspot.yaw,
      type: hotspotType,
      ...(hotspotType === "info" ? { text } : { sceneId: linkedScene }),
    };

    const updatedHotspots = [
      ...scene.hotspots.filter((hs) => hs !== tempHotspot),
      finalHotspot,
    ];
    onUpdateHotspots(updatedHotspots);
    setTempHotspot(null);
    setText("");
    setLinkedScene("");
  };

  const cancelHotspot = () => {
    if (!tempHotspot) return;
    onUpdateHotspots(scene.hotspots.filter((hs) => hs !== tempHotspot));
    setTempHotspot(null);
    setText("");
    setLinkedScene("");
  };

  const previewScene = () => {
    if (linkedScene) {
      setCurrentScene(linkedScene); // Chuyển sang scene được chọn để xem trước
    }
  };

  const returnToCurrentScene = () => {
    setCurrentScene(scene.id); // Quay lại scene hiện tại
  };

  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Hotspot Editor</h2>
      {!tempHotspot && (
        <button
          onClick={addTempHotspot}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Hotspot
        </button>
      )}
      {tempHotspot && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Hotspot Type:</label>
            <select
              value={hotspotType}
              onChange={(e) => setHotspotType(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="info">Information</option>
              <option value="scene">Link to Scene</option>
            </select>
          </div>
          {hotspotType === "info" ? (
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Hotspot Text"
              className="border p-2 rounded w-full"
            />
          ) : (
            <div className="space-y-2">
              <select
                value={linkedScene}
                onChange={(e) => setLinkedScene(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select a Scene</option>
                {scenes
                  .filter((s) => s.id !== scene.id)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
              </select>
              {linkedScene && (
                <div className="flex space-x-2">
                  <button
                    onClick={previewScene}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Preview Scene
                  </button>
                  {currentScene !== scene.id && (
                    <button
                      onClick={returnToCurrentScene}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Back to Current Scene
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex space-x-2">
            <button
              onClick={saveHotspot}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Hotspot
            </button>
            <button
              onClick={cancelHotspot}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotspotEditor;
