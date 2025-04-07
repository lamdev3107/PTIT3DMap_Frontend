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
import Demo from "./components/Panorama/Main";
import { Room } from "./pages/admin/Room";
import FinalHome from "./pages/FinalHome";
import Test from "./components/CameraScrollSequence";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

if (import.meta.env.DEV) {
  studio.initialize();
  studio.extend(extension);
}

function App() {
  const [scene, setScene] = useState("scene1");

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Routes>
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
          <Route
            path={`${ROUTES.ADMIN}/${ROUTES.ROOM_ADMIN_DETAIL}`}
            element={<Room />}
          />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route path={"/"} element={<Home />} />
          {/* <Route path={"/"} element={<Test />} /> */}

          <Route path="/demo" element={<Demo />} />
          <Route path="/demo360" element={<Demo360 />} />
          <Route path={`/home-page`} element={<FinalHome />} />

          {/* <Route path={"building/:id"} element={<PostDetail />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
