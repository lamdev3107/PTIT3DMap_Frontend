import React, { useState } from "react";

function PanoramaUploader({ onSceneAdd }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const resizeImage = (file, maxWidth, callback) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;

        // Giới hạn chiều rộng tối đa là maxWidth (ví dụ: 4096)
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImageUrl = canvas.toDataURL("image/jpeg", 0.9); // Chất lượng 90%
        callback(resizedImageUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    files.forEach((file, index) => {
      resizeImage(file, 4096, (resizedImageUrl) => {
        const scene = {
          id: `scene-${index}-${Date.now()}`,
          title: file.name,
          imageUrl: resizedImageUrl,
          hotspots: [],
        };
        onSceneAdd(scene);
      });
    });
    setFiles([]);
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={files.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Upload Panoramas
      </button>
    </div>
  );
}

export default PanoramaUploader;
