import React from "react";
import { MainLayout } from "./layouts/MainLayout";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { ROUTES } from "./utils/constants";
import { AdminLayout } from "./layouts/AdminLayout";
import { BuildingList } from "./pages/admin/BuildingList";
import { Building } from "./pages/admin/Building";
import { RoomList } from "./pages/admin/RoomList";

function App() {
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
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route path={"/"} element={<Home />} />
          {/* <Route path={"building/:id"} element={<PostDetail />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
