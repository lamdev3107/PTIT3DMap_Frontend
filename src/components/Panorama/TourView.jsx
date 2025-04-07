import React, { useEffect, useState } from "react";
import HotspotEditor from "./HotspotEditor";

function TourViewer({ scenes, setScenes, initialScene }) {
  const [currentScene, setCurrentScene] = useState(
    initialScene || scenes[0]?.id
  );
  const [pannellumInstance, setPannellumInstance] = useState(null);
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.async = true;
    script.onload = () => {
      console.log("Pannellum script loaded");
      setIsPannellumLoaded(true);
    };
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.href =
      "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (isPannellumLoaded && scenes.length > 0 && currentScene) {
      const sceneData = scenes.find((s) => s.id === currentScene);
      if (!sceneData) {
        console.error("Scene not found for ID:", currentScene);
        return;
      }

      const config = {
        type: "equirectangular",
        panorama: sceneData.imageUrl,
        autoLoad: true,
        hotSpots: sceneData.hotspots || [],
      };

      const viewer = window.pannellum.viewer("panorama", config);
      setPannellumInstance(viewer);

      return () => {
        console.log("Destroying Pannellum viewer");
        viewer.destroy();
      };
    }
  }, [isPannellumLoaded, scenes, currentScene]);

  const updateHotspots = (newHotspots) => {
    const updatedScenes = scenes.map((scene) =>
      scene.id === currentScene ? { ...scene, hotspots: newHotspots } : scene
    );
    setScenes(updatedScenes);
    if (pannellumInstance) {
      pannellumInstance.loadScene(currentScene, {
        panorama: scenes.find((s) => s.id === currentScene).imageUrl,
        hotSpots: newHotspots,
      });
    }
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setCurrentScene(scene.id)}
            className={`px-3 py-1 rounded ${
              currentScene === scene.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {scene.title}
          </button>
        ))}
      </div>
      <div id="panorama" className="w-full h-[500px]"></div>
      {currentScene && (
        <HotspotEditor
          scene={scenes.find((s) => s.id === currentScene)}
          scenes={scenes}
          onUpdateHotspots={updateHotspots}
          pannellumInstance={pannellumInstance}
          setCurrentScene={setCurrentScene}
          currentScene={currentScene}
        />
      )}
    </div>
  );
}

export default TourViewer;
