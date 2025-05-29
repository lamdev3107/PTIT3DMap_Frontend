/* eslint-disable no-unused-vars */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import TourForm from "@/components/TourForm";
import { LuCirclePlus, LuEye, LuPencilLine } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ImageZoom } from "@/components/ImageZoom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BuildingModel } from "@/components/BuildingModel";
import { RoomForm } from "./RoomForm";
import Tour360Viewer from "@/components/Tour360Viewer";

export const Room = () => {
  const { pathname } = useLocation();
  const [data, setData] = useState([]);
  const [isOpenRoomForm, setIsOpenRoomForm] = useState(false);
  // const fetchData = async () => {
  //   let queryParams = {};

  //   if (searchBy.value === "device") {
  //     //Nếu là số
  //     if (!isNaN(Number(searchValue))) queryParams.deviceId = searchValue;
  //     else {
  //       queryParams.deviceName = searchValue;
  //     }
  //   }
  //   if (searchBy.value === "status") {
  //     queryParams.status = searchValue === "Tắt" ? "false" : "true";
  //   }
  //   if (searchBy.value === "createdAt") {
  //     queryParams.createdAt = searchValue;
  //   }
  //   queryParams.limit = pagination.pageSize;
  //   queryParams.page = page;
  //   queryParams.orderby = orderBy.label;
  //   queryParams.order = orderBy.value;
  //   // Fetch data from API
  //   try {
  //     let searchParam = new URLSearchParams(queryParams).toString();
  //     const response = await axios(
  //       import.meta.env.VITE_SERVER_URL + "/buildings?" + searchParam
  //     );
  //     const data = response.data;
  //     setData(data.data);
  //     setPageCount(data.pagination.totalPages);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const fetchData = async () => {
    // Fetch data from API
    try {
      let roomId = pathname.split("/").slice(-1).toString();
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/rooms/" + roomId
      );
      const data = response.data;
      setData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pathname]);
  const handleEditClick = () => {
    setIsOpenRoomForm(true);
  };
  return (
    <>
      <Card className="col-span-2 bg-light-blue-bg p-4 rounded-xl  text-center lg:col-span-1 lg:p-4 gap-4">
        <CardHeader
          className={"p-0 flex items-center justify-between border-b gap-2"}
        >
          <div className="flex items-center gap-2">
            <IoArrowBack
              size={20}
              className="text-gray-800 hover:text-red-primary cursor-pointer"
              onClick={() => window.history.back()}
            />
            <h2 className="text-lg font-semibold">
              {data?.name ? data?.name : "Chi tiết Phòng ban:"}
            </h2>
          </div>
          <Button
            className="bg-primary text-white flex items-center gap-2"
            onClick={handleEditClick}
          >
            <LuPencilLine />
            <span>Chỉnh sửa</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="flex  items-center gap-2  mb-3">
              <p className="text-md font-semibold">Tên: </p>
              <p>{data?.name}</p>
            </div>

            <div className="flex w-full items-center">
              <div className="flex  items-center gap-2 flex-1 mb-3">
                <p className="text-md font-semibold">Vị trí: </p>

                <p>{data?.floor?.name + ", " + data?.floor?.building?.name}</p>
              </div>
            </div>

            <div
              className={`flex  ${
                data?.description && data?.description !== ""
                  ? "items-start h-fit"
                  : "items-center h-9"
              }  gap-2 mb-3`}
            >
              <p className="text-md font-semibold w-fit flex-shrink-0  ">
                Mô tả:{" "}
              </p>
              {data?.description && data?.description !== "" ? (
                <p
                  className=" ql-editor min-h-[35vh] h-fit p-0 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: data?.description }}
                />
              ) : (
                <p className=" text-italic p-0 ">Chưa có</p>
              )}
            </div>

            <div className="flex w-full items-center">
              <div className="flex  items-center gap-2 flex-1 mb-3">
                <p className="text-md font-semibold">Danh mục: </p>

                <p>
                  {data?.navigationId ? (
                    data.navigation.name
                  ) : (
                    <p className="italic">Chưa có</p>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`col-span-1 flex flex-col justify-start ${
              data?.image ? "h-56" : "h-fit"
            } `}
          >
            <p className="text-md font-semibold">Sơ đồ vị trí: </p>
            {data?.image ? (
              <ImageZoom src={data?.image} className="w-full h-full" />
            ) : (
              <p className="italic">Chưa có</p>
            )}
          </div>

          <div className="flex justify-start col-span-2 items-center gap-2 mt-3 mb-5">
            <p className="text-md font-semibold w-[90px] text-left">
              Model 3D:{" "}
            </p>
            {data?.modelURL ? (
              <div className="flex-1 bg-white h-[300px] w-full border rounded-md relative">
                <Canvas className="w-[200px] ">
                  <Suspense>
                    <ambientLight intensity={0.5} />
                    <directionalLight
                      theatreKey="directionalLight"
                      position={[5, 5, 5]}
                      intensity={1}
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                    />
                    <OrbitControls
                      enableZoom={true}
                      minDistance={5}
                      maxDistance={15}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 2}
                    />
                    <BuildingModel
                      position={[0, -1, 0]}
                      scale={[0.8, 0.8, 0.8]}
                      rotation={[0, Math.PI / 2, 0]} // Rotate 360 degrees around Y axis
                      linkFile={data?.modelURL}
                    />
                  </Suspense>
                </Canvas>
              </div>
            ) : (
              <p className="italic">Chưa có</p>
            )}
          </div>
        </CardContent>
      </Card>

      <RoomForm
        open={isOpenRoomForm}
        setOpen={setIsOpenRoomForm}
        data={data}
        fetchData={fetchData}
      />
    </>
  );
};
