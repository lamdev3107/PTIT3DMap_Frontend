/* eslint-disable no-unused-vars */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import Demo360 from "@/components/Demo360";
import { LuCirclePlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";

export const Room = () => {
  const { pathname } = useLocation();
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  console.log("data", data);
  return (
    <>
      <Card className="col-span-2 bg-light-blue-bg p-4 rounded-xl  text-center lg:col-span-1 lg:p-4 gap-4">
        <CardHeader className={"p-0 pb-0 flex items-center border-b gap-2"}>
          <IoArrowBack
            size={20}
            className="text-gray-800 hover:text-red-primary cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-lg font-semibold">Chi tiết Phòng ban:</h2>
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

            <div className="flex items-center gap-2 mb-3">
              <p className="text-md font-semibold">Mô tả: </p>
              <p className="italic">
                {(!data?.description || data?.description === "") &&
                data?.description
                  ? data?.description
                  : "Chưa có"}
              </p>
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

          <div className="col-span-1 flex flex-col justify-start h-56">
            <p className="text-md font-semibold">Sơ đồ vị trí: </p>

            <img
              src={data?.image}
              alt="image"
              className="h-40 object-contain"
            />
          </div>

          <div className="col-span-2 flex justify-between items-center">
            <p className="text-md font-semibold text-left">Tour 360: </p>
            <div className="flex items-start justify-between mt-3 mb-3">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg`}
              >
                <LuCirclePlus />
                <span>Thêm mới Tour 360</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Demo360 open={isDialogOpen} setOpen={setIsDialogOpen} />
    </>
  );
};
