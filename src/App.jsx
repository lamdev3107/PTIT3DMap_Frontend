import React, { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./utils/constants";
import { AdminLayout } from "./layouts/AdminLayout";
import { BuildingList } from "./pages/admin/BuildingList";
import { Building } from "./pages/admin/Building";
import { RoomList } from "./pages/admin/RoomList";
import TourForm from "./components/TourForm";
import { Room } from "./pages/admin/Room";
import FinalHome from "./pages/FinalHome";

import DetailBuilding from "./pages/DetailBuilding";
import PanasonicHotspotDemo from "./components/PanasonicHotspotDemo";
import { Floor } from "./pages/admin/Floor";

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
          <Route
            path={`${ROUTES.ADMIN}${ROUTES.BUILDINGS}/:buildingId${ROUTES.FLOOR_ADMIN_DETAIL}`}
            element={<Floor />}
          />
        </Route>

        <Route path="/" element={<MainLayout />}>
          {/* <Route path={"/"} element={<Test />} /> */}

          <Route path="/demo-hotspot" element={<PanasonicHotspotDemo />} />
          <Route path="/detail-building" element={<DetailBuilding />} />
          <Route path="/demo360" element={<TourForm />} />
          <Route path={`/`} element={<FinalHome />} />

          {/* <Route path={"building/:id"} element={<PostDetail />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
