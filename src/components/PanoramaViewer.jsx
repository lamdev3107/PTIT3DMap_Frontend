// import { useEffect, useRef } from "react";
// import img1 from "../assets/images/img_1.jpg";
// import img2 from "../assets/images/img_2.jpg";
// import img3 from "../assets/images/img_3.jpg";

// const PanoramaViewer = ({ scene, setScene }) => {
//     const containerRef = useRef(null);

//     useEffect(() => {
//         if (!containerRef.current) return;

//         const viewer = pannellum.viewer(containerRef.current, {
//             default: {
//                 firstScene: scene, // Lấy scene hiện tại khi khởi tạo
//                 sceneFadeDuration: 1000,
//                 autoLoad: true, // Tự động tải panorama mà không cần nhấn nút
//                 onload: () => {
//                     // Ẩn nút load panorama khi đã load scene
//                     const loadButton = document.querySelector('.pnlm-load-button');
//                     if (loadButton) {
//                         loadButton.style.display = 'none';
//                     }
//                 },
//             },
//             scenes: {
//                 scene1: {
//                     panorama: img1, // Đặt ảnh panorama cho scene1
//                     hotSpots: [
//                         {
//                             pitch: 0,
//                             yaw: 90,
//                             type: "scene",
//                             text: "Go to Scene 2",
//                             sceneId: "scene2",
//                             clickHandlerFunc: () => {
//                                 viewer.loadScene('scene2'); // Tải scene2 khi nhấn vào hotspot
//                                 setScene("scene2"); // Cập nhật state của scene
//                             },
//                         },
//                     ],
//                 },
//                 scene2: {
//                     panorama: img2, // Đặt ảnh panorama cho scene2
//                     hotSpots: [
//                         {
//                             pitch: 0,
//                             yaw: -90,
//                             type: "scene",
//                             text: "Go to Scene 1",
//                             sceneId: "scene1",
//                             clickHandlerFunc: () => {
//                                 viewer.loadScene('scene1'); // Tải scene1 khi nhấn vào hotspot
//                                 setScene("scene1"); // Cập nhật state của scene
//                             },
//                         },
//                         {
//                             pitch: 0,
//                             yaw: 90,
//                             type: "scene",
//                             text: "Go to Scene 3",
//                             sceneId: "scene3",
//                             clickHandlerFunc: () => {
//                                 viewer.loadScene('scene3'); // Tải scene3 khi nhấn vào hotspot
//                                 setScene("scene3"); // Cập nhật state của scene
//                             },
//                         },
//                     ],
//                 },
//                 scene3: {
//                     panorama: img3, // Đặt ảnh panorama cho scene3
//                     hotSpots: [
//                         {
//                             pitch: 0,
//                             yaw: -90,
//                             type: "scene",
//                             text: "Go to Scene 2",
//                             sceneId: "scene2",
//                             clickHandlerFunc: () => {
//                                 viewer.loadScene('scene2'); // Tải scene2 khi nhấn vào hotspot
//                                 setScene("scene2"); // Cập nhật state của scene
//                             },
//                         },
//                     ],
//                 },
//             },
//         });

//         // Clean up on unmount
//         return () => {
//             if (viewer) {
//                 viewer.destroy();
//             }
//         };
//     }, [scene]);

//     return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
// };

// export default PanoramaViewer;

import React, { useEffect, useRef } from "react";


const PanoramaViewer = ({ scenesData, initialScene, setScene }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const viewer = pannellum.viewer(containerRef.current, {
            default: {
                firstScene: initialScene, // Scene ban đầu được truyền vào
                sceneFadeDuration: 1000,
                autoLoad: true, // Tự động tải panorama mà không cần nhấn nút
                onload: () => {
                    // Ẩn nút load panorama khi đã load scene
                    const loadButton = document.querySelector('.pnlm-load-button');
                    if (loadButton) {
                        loadButton.style.display = 'none';
                    }
                },
            },
            scenes: scenesData.reduce((acc, scene, index) => {
                // Tạo các scene động từ data
                acc[`scene${index + 1}`] = {
                    panorama: scene.image, // Đặt ảnh panorama cho scene
                    hotSpots: scene.hotSpots.map((hotspot, hotspotIndex) => ({
                        pitch: hotspot.pitch,
                        yaw: hotspot.yaw,
                        type: "scene",
                        text: hotspot.text,
                        sceneId: hotspot.sceneId,
                        clickHandlerFunc: () => {
                            viewer.loadScene(hotspot.sceneId); // Chuyển sang scene khi nhấn vào hotspot
                            setScene(hotspot.sceneId); // Cập nhật state của scene
                        },
                    })),
                };
                return acc;
            }, {}),
        });

        // Clean up on unmount
        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    }, [scenesData, initialScene, setScene]);

    return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default PanoramaViewer;


