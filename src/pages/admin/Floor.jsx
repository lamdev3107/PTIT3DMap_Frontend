/* eslint-disable no-unused-vars */
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import {
  LuCirclePlus,
  LuEye,
  LuPencilLine,
  LuTrash2,
} from "react-icons/lu";
import { IoArrowBack, IoRefresh } from "react-icons/io5";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import axios from "axios";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FloorForm } from "./FloorForm";
import { Canvas } from "@react-three/fiber";
// import { FloorModel } from "@/components/FloorModel";
import { OrbitControls } from "@react-three/drei";
import { Separator } from "@/components/ui/separator";
import { RoomForm } from "./RoomForm";
import { ImageZoom } from "@/components/ImageZoom";

export const Floor = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [floorData, setFloorData] = useState(null);
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
        import.meta.env.VITE_SERVER_URL +  "/floors/" + floorsId
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
      let floorId = pathname.slice(-1);
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/floors/" + floorId + "/rooms"
      );
      const data = response.data;
      setRoomsData(data.data);
      setPageCount(data.pagination.totalPages);
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
        <div className="text-left capitalize px-4">{row.getValue("roomId")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: () => {
        return (
          <div className="p-2 text-sm capitalize font-bold w-fit">Tên phòng</div>
        );
      },
      cell: ({ row }) => (
        <div className="text-left w-fit">{row.original?.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => {
        return <div className="p-2 text-sm capitalize font-bold">Mô tả</div>;
      },
      cell: ({ row }) => (
        <div className="text-left italic">
          {row.original?.description || <span className=" ">Chưa có</span>}
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
            <img src={row.original?.image} alt="image" className="w-20 h-20" />
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
        console.log("room", room);
        if (room?.image && room?.image !== "") {
          deleteFirebaseItem(room?.image);
        }
        toast.success("Xóa tầng thành công!");
        fetchFloorRoomsData();
      } else {
        toast.error("Xóa loại tin thất bại!");
      }
    } catch (err) {
      toast.error("Xóa tòa nhà thất bại!", err);
    }
  };
  return (
    <>
      <Card className="col-span-2 bg-light-blue-bg p-4 rounded-xl  text-center lg:col-span-1 lg:p-4">
        <CardHeader className={"p-0 flex items-center gap-2 border-b"}>
          <IoArrowBack
            size={20}
            className="text-gray-800 hover:text-red-primary cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <Link
            href={() => navigate("/admin/buildings/" + data?.building.id)}
          >
            <h2 className="text-lg font-semibold hover:text-red-primary">{data?.building?.name + " /"}</h2>
          </Link>
          <h2 className="text-lg font-semibold">{data?.name }</h2>
        </CardHeader>
        <CardContent className="p-0">
    

          <div className="flex flex-col justify-start mx-auto h-56">
            <p className="text-md font-semibold">Sơ đồ mặt bằng: </p>

            <ImageZoom
              src={data?.image}
              alt="image"
              className="h-full w-fit mx-auto object-contain"
            />
          </div>


          <div className="flex items-center gap-2 mt-3 mb-3">
            <p className="text-md font-semibold">Mô tả: </p>
            <p className="italic">
              {(!data?.description || data?.description === "") &&
              data?.description
                ? data?.description
                : "Chưa có"}
            </p>
          </div>
     

          <div className="flex items-start justify-between mt-3 mb-3">
            <div className="flex items-center gap-2">
              <p className="text-md font-semibold">Số phòng: </p>
              <p className="">{roomsData?.length}</p>
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
        floorData = {{
          floorId: floorId,
          buildingId: buildingId
        }}
      />
    </>
  );
};
