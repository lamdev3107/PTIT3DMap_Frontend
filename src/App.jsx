import React from "react";
import { MainLayout } from "./layouts/MainLayout";
import { AdminlLayout } from "./layouts/AdminlLayout";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Routes>
        <Route path={`admin`} element={<AdminlLayout />}></Route>

        <Route path="/" element={<MainLayout />}>
          <Route path={`/`} element={<Home />} />
          {/* <Route path={"building/:id"} element={<PostDetail />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
