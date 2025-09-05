/* eslint-disable no-unused-vars */
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { LuCirclePlus, LuEye, LuPencilLine, LuTrash2 } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import axios from "axios";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { FloorForm } from "./FloorForm";
import { RoomForm } from "./RoomForm";
import { ImageZoom } from "@/components/ImageZoom";
import { ROUTES } from "@/utils/constants";
import TourForm from "@/components/TourForm";
import Tour360Viewer from "@/components/Tour360Viewer";
import { deleteFirebaseItem } from "@/utils/fileUploader";

export const Floor = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //Tour 360
  const [isOpenTour360Form, setIsOpenTour360Form] = useState(false);
  const [showTour360, setShowTour360] = useState(false); // State to control the 360 tour visibility

  const [isOpenFloorForm, setIsIsOpenFloorForm] = useState(false);
  const [data, setData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [pageCount, setPageCount] = useState(0);
  //   const [rowSelection, setRowSelection] = useState({});
  const [searchBy, setSearchBy] = useState({
    label: "Tất cả",
    value: "",
  });
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState({
    label: "createdAt",
    value: "desc",
  });
  const fetchData = async () => {
    // Fetch data from API
    try {
      let floorsId = pathname.split("/").slice(-1).toString();
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/floors/" + floorsId
      );
      const data = response.data;
      setData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFloorRoomsData = async () => {
    // Fetch data from API
    try {
      let floorsId = pathname.split("/").slice(-1).toString();
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/floors/" + floorsId + "/rooms"
      );
      const data = response.data;
      setRoomsData(data.data);
      setPageCount(data?.pagination?.totalPages);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchFloorRoomsData();
    fetchData();
  }, [pathname]);
  let buildingId = pathname.split("/")[3];
  let floorId = pathname.split("/").slice(-1).toString();

  const columns = [
    {
      accessorKey: "Mã phòng",
      header: () => {
        return (
          <Button
            variant="ghost"
            className="font-bold"
            onClick={() => {
              setOrderBy((prev) => {
                if (prev.value == "desc") {
                  return { value: "asc", label: "roomId" };
                } else if (prev.value == "asc") {
                  return { value: "desc", label: "roomId" };
                } else {
                  return { value: "desc", label: "roomId" };
                }
              });
            }}
          >
            ID
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-left capitalize px-4">{row.original.roomId}</div>
      ),
    },
    {
      accessorKey: "name",
      header: () => {
        return (
          <div className="p-2 text-sm capitalize font-bold w-fit">
            Tên phòng
          </div>
        );
      },
      cell: ({ row }) => (
        <div
          onClick={() => handleRowClick(row)}
          className="text-left w-fit cursor-pointer"
        >
          {row.original?.name}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: () => {
        return <div className="p-2 text-sm capitalize font-bold">Mô tả</div>;
      },
      cell: ({ row }) => (
        <div
          className="text-left italic truncate max-w-[300px]"
          title={row.original?.description}
        >
          {row.original?.description || <span>Chưa có</span>}
        </div>
      ),
    },
    {
      accessorKey: "image",
      header: () => {
        return <div className="p-2 text-sm capitalize font-bold">Sơ đồ</div>;
      },
      cell: ({ row }) => (
        <div className="flex justify-start">
          {row.original?.image ? (
            <ImageZoom
              src={row.original?.image}
              alt="image"
              className="w-20 h-20"
            />
          ) : (
            <span className="italic text-left">Chưa có</span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: true,
      cell: ({ row }) => {
        // const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primary" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only"></span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  navigate(ROUTES.ADMIN + ROUTES.ROOMS + "/" + row.original.id);
                }}
              >
                <LuEye />
                <span>Xem chi tiết</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleEditClick(row.original)}
              >
                <LuPencilLine />
                <span>Chỉnh sửa</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleDeleteClick(row.original)}
              >
                <LuTrash2 />
                <span>Xóa</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: roomsData,
    pageCount: pageCount,
    columns,
    debugTable: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
      initialState: {
        pagination: {
          pageSize: 10,
          pageIndex: 0,
        },
      },
    },
  });

  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };
  const handleEditFloorClick = () => {
    setIsIsOpenFloorForm(true);
  };
  const handleDeleteClick = async (room) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa Tầng này?");
    if (!confirm) return;
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/rooms/" + room.id,
        {
          method: "DELETE",
        }
      );
      if (response?.data?.success) {
        if (room?.image && room?.image !== "") {
          deleteFirebaseItem(room?.image);
        }
        toast.success("Xóa tầng thành công!");
        fetchFloorRoomsData();
      } else {
        toast.error("Xóa tầng thất bại!");
      }
    } catch (err) {
      toast.error("Xóa tầng thất bại!", err);
    }
  };

  const handleRowClick = (row) => {
    navigate(ROUTES.ADMIN + ROUTES.ROOM_DETAIL.replace(":id", row.original.id));
  };

  const scenes = useMemo(() => {
    if (!data?.scenes) return [];
    let returnScenes = data?.scenes.map((scene) => {
      return {
        ...scene,
        panorama: `http://localhost:8000${scene.panorama}`,
      };
    });
    return returnScenes;
  }, [data]);
  return (
    <>
      <Card className="col-span-2 bg-light-blue-bg p-4 rounded-xl  text-center lg:col-span-1 lg:p-4">
        <CardHeader
          className={"p-0 flex items-center justify-between gap-2 border-b"}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex cursor-pointer group items-center gap-2 hover:text-primary"
              onClick={() => navigate(-1)}
            >
              <IoArrowBack
                size={20}
                className="text-gray-800 group-hover:text-red-primary cursor-pointer"
              />
              <h2 className="text-lg font-semibold group-hover:text-red-primary">
                {data?.building?.name + " /"}
              </h2>
            </div>
            <h2 className="text-lg font-semibold">{data?.name}</h2>
          </div>
          <Button
            className="bg-primary text-white flex items-center gap-2"
            onClick={handleEditFloorClick}
          >
            <LuPencilLine />
            <span>Chỉnh sửa</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {data?.image && data?.image !== "" ? (
            <div className="flex flex-col justify-start mx-auto h-56">
              <p className="text-md font-semibold">Sơ đồ mặt bằng: </p>

              <ImageZoom
                src={data?.image}
                alt="image"
                className="h-full w-fit mx-auto object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col justify-start h-fit">
              <p className="text-md font-semibold">Sơ đồ mặt bằng: </p>
              <p className="text-italic p-0 text-gray-600">Chưa có</p>
            </div>
          )}

          {/* Description  */}
          <div
            className={`flex  ${
              data?.description && data?.description !== ""
                ? "items-start h-fit"
                : "items-center h-9"
            }  gap-2 mb-3 mt-4`}
          >
            <p className="text-md font-semibold w-fit flex-shrink-0">Mô tả: </p>
            {data?.description && data?.description !== "" ? (
              <p
                className=" ql-editor min-h-[35vh] h-fit p-0 text-gray-600"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />
            ) : (
              <p className=" text-italic p-0 text-gray-600">Chưa có</p>
            )}
          </div>

          {/* Tour 360 */}
          <div className="col-span-2 flex justify-between  items-center">
            <p className="text-md flex items-center gap-2 w-fit flex-shrink-0">
              <span className="font-semibold">Tour 360:</span>
              {data?.scenes?.length === 0 && (
                <p className=" text-italic p-0 text-gray-600">Chưa có</p>
              )}
            </p>
            {data?.scenes?.length > 0 ? (
              <div className="flex items-start gap-3  mt-3 mb-3">
                <Button
                  onClick={() => setShowTour360(true)}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg`}
                >
                  <LuEye />
                  <span>Xem Tour 360</span>
                </Button>
                <Button
                  onClick={() => setIsOpenTour360Form(true)}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg`}
                >
                  <LuCirclePlus />
                  <span>Chỉnh sửa Tour 360</span>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mt-3 mb-3">
                  <Button
                    onClick={() => setIsOpenTour360Form(true)}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg`}
                  >
                    <LuCirclePlus />
                    <span>Thêm mới Tour 360</span>
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-start justify-between mt-3 mb-3">
            <div className="flex items-center gap-2">
              <p className="text-md font-semibold">Danh sách phòng ban: </p>
              <p className="">({roomsData?.length} phòng)</p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className={`cursor-pointer flex items-center gap-2 px-2 py-1 rounded-lg`}
            >
              <LuCirclePlus />
              <span>Thêm mới phòng</span>
            </Button>
          </div>
          <DataTable
            fetchData={fetchFloorRoomsData}
            table={table}
            page={page}
            columns={columns}
            setPage={setPage}
          />
        </CardContent>
      </Card>
      <RoomForm
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        data={selectedRoom}
        fetchData={fetchFloorRoomsData}
        floorData={{
          floorId: floorId,
          buildingId: buildingId,
        }}
      />
      <FloorForm
        open={isOpenFloorForm}
        setOpen={setIsIsOpenFloorForm}
        data={data}
        fetchData={fetchData}
      />
      <TourForm
        floor={data}
        data={data?.scenes}
        open={isOpenTour360Form}
        setOpen={setIsOpenTour360Form}
        fetchData={fetchData}
      />
      <Tour360Viewer
        open={showTour360}
        setOpen={setShowTour360}
        data={scenes}
      />
    </>
  );
};
