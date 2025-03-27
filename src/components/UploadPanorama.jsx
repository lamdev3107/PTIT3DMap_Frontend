import React, { useState } from "react";
import PanoramaViewer from "./PanoramaViewer";

const UploadPanorama = () => {
    const [panoImages, setPanoImages] = useState([]); // Lưu trữ ảnh đã tải
    const [selectedImage, setSelectedImage] = useState(null); // Ảnh hiện tại được chọn để preview
    const [hotspots, setHotspots] = useState({}); // Lưu trữ các hotspot cho mỗi ảnh pano

    const handleFileUpload = (event) => {
        const files = event.target.files;
        const newImages = [];
        for (let file of files) {
            const url = URL.createObjectURL(file);
            newImages.push(url);
        }
        setPanoImages((prevImages) => [...prevImages, ...newImages]);
    };

    const handlePreview = () => {
        if (!selectedImage) return;
        // Tạo tour VR từ ảnh đã tải
        const hotspotsForSelectedImage = hotspots[selectedImage] || [];
        // Bạn có thể thực hiện thêm logic ở đây để load scene và thiết lập các hotspot.
        console.log("Previewing VR Tour with hotspots: ", hotspotsForSelectedImage);
    };

    const handleAddHotspot = (image) => {
        const pitch = prompt("Enter pitch for hotspot (e.g. 0):");
        const yaw = prompt("Enter yaw for hotspot (e.g. 90):");
        const newHotspot = { pitch: parseFloat(pitch), yaw: parseFloat(yaw) };

        setHotspots((prevHotspots) => ({
            ...prevHotspots,
            [image]: [...(prevHotspots[image] || []), newHotspot],
        }));
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileUpload} />
            <div>
                <h3>Uploaded Panorama Images</h3>
                <ul>
                    {panoImages.map((image, index) => (
                        <li key={index}>
                            <img src={image} alt={`pano-${index}`} width="100" height="100" />
                            <button onClick={() => setSelectedImage(image)}>Select for Preview</button>
                            <button onClick={() => handleAddHotspot(image)}>Add Hotspot</button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedImage && (
                <div>
                    <h3>Preview Panorama</h3>
                    <PanoramaViewer
                        scene={selectedImage}
                        hotspots={hotspots[selectedImage] || []}
                    />
                </div>
            )}

            <button onClick={handlePreview}>Preview VR Tour</button>
        </div>
    );
};

export default UploadPanorama;
