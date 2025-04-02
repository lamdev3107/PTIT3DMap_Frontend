import React, { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { ROUTES } from "./utils/constants";
import { AdminLayout } from "./layouts/AdminLayout";
import { BuildingList } from "./pages/admin/BuildingList";
import { Building } from "./pages/admin/Building";
import { RoomList } from "./pages/admin/RoomList";
import Demo360 from "./components/Demo360";
import PanoramaViewer from "./components/PanoramaViewer";
import UploadPanorama from "./components/UploadPanorama";

function App() {
  const [scene, setScene] = useState("scene1");

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Routes>
        <Route path={`/demo-360`} element={<Demo360 />} />
        <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
          <Route
            path={`${ROUTES.ADMIN}/${ROUTES.BUILDINGS}`}
            element={<BuildingList />}
          />
          <Route
            path={`${ROUTES.ADMIN}/${ROUTES.BUILDING_DETAIL}`}
            element={<Building />}
          />
          <Route
            path={`${ROUTES.ADMIN}${ROUTES.ROOMS}`}
            element={<RoomList />}
          />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route path={"/"} element={<Home />} />
          <Route
            path="/upload-360"
            element={<UploadPanorama scene={scene} setScene={setScene} />}
          />

          {/* <Route path={"building/:id"} element={<PostDetail />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
