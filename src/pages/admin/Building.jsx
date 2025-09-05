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
  LuSearch,
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FloorForm } from "./FloorForm";
import { Canvas } from "@react-three/fiber";
import { BuildingModel } from "@/components/BuildingModel";
import { OrbitControls } from "@react-three/drei";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/utils/constants";
import { BuildingForm } from "./BuildingForm";
import { deleteFirebaseItem } from "@/utils/fileUploader";

export const Building = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const buildingId = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenBuildingForm, setIsOpenBuildingForm] = useState(false);
  const [floorsData, setFloorsData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
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
      let buildingId = pathname.split("/").slice(-1).toString();
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/buildings/" + buildingId
      );
      const data = response.data;
      setData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBuildingFloorsData = async () => {
    // Fetch data from API
    try {
      const buildingId = pathname.split("/").slice(-1).toString();
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/buildings/" + buildingId + "/floors"
      );
      const data = response.data;
      setFloorsData(data?.data);
      setPageCount(data?.pagination?.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBuildingFloorsData();
    fetchData();
  }, [pathname]);

  const columns = [
    {
      accessorKey: "id",
      header: () => {
        return (
          <Button
            variant="ghost"
            className="font-bold"
            onClick={() => {
              setOrderBy((prev) => {
                if (prev.value == "desc") {
                  return { value: "asc", label: "id" };
                } else if (prev.value == "asc") {
                  return { value: "desc", label: "id" };
                } else {
                  return { value: "desc", label: "id" };
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
        <div className="text-left capitalize px-4">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: () => {
        return (
          <div className="p-2 text-sm capitalize font-bold w-fit">Tên tầng</div>
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
        <div className="text-left italic max-w-[400px] truncate">
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
                onClick={() => {
                  navigate(
                    ROUTES.ADMIN +
                      ROUTES.BUILDINGS +
                      "/" +
                      row.original.buildingId +
                      ROUTES.FLOORS +
                      "/" +
                      row.original.id
                  );
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
    data: floorsData,
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

  const handleEditClick = (floor) => {
    setSelectedFloor(floor);
    setIsDialogOpen(true);
  };

  const handleEditBuildingClick = () => {
    setIsOpenBuildingForm(true);
  };
  const handleDeleteClick = async (floor) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa Tầng này?");
    if (!confirm) return;
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/floors/" + floor.id,
        {
          method: "DELETE",
        }
      );
      if (response?.data?.success) {
        if (floor?.image && floor?.image !== "") {
          deleteFirebaseItem(floor?.image);
        }
        toast.success("Xóa tầng thành công!");
        fetchBuildingFloorsData();
      } else {
        toast.error("Xóa tầng thất bại");
      }
    } catch (err) {
      toast.error("Xóa tầng thất bại!", err);
    }
  };

  const handleRowClick = (row) => {
    navigate(
      ROUTES.ADMIN +
        ROUTES.BUILDINGS +
        "/" +
        row.original.buildingId +
        ROUTES.FLOORS +
        "/" +
        row.original.id
    );
  };

  return (
    <div className="overflow-x-auto">
      <Card className="col-span-2 bg-light-blue-bg p-4 rounded-xl  text-center lg:col-span-1 lg:p-4">
        <CardHeader
          className={
            "p-0 flex justify-between items-center gap-2 border-b pb-0"
          }
        >
          <div className="flex items-center gap-2">
            <IoArrowBack
              size={20}
              className="text-gray-800 hover:text-red-primary cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h2 className="text-lg font-semibold">{data?.name}</h2>
          </div>
          <Button
            className="bg-primary text-white flex items-center gap-2"
            onClick={handleEditBuildingClick}
          >
            <LuPencilLine />
            <span>Chỉnh sửa</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {/* <div className="flex  items-center gap-2  mb-3">
            <p className="text-md font-semibold">Tên: </p>

            <p>{data?.name}</p>
          </div> */}

          {/* <div className="flex items-center gap-2 mt-3 mb-3">
            <p className="text-md font-semibold">Mô tả: </p>
            <p className="italic">
              {(!data?.description || data?.description === "") &&
              data?.description
                ? data?.description
                : "Chưa có"}
            </p>
          </div> */}
          <div className="flex justify-start items-center gap-2  mb-5">
            <p className="text-md font-semibold w-[90px] text-left">
              Model 3D:{" "}
            </p>
            {data?.modelURL ? (
              <div className="flex-1 bg-white max-h-full h-[300px] w-full border rounded-md relative">
                <Canvas className=" ">
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
                      minDistance={3} // Minimum zoom distance
                      maxDistance={5} // Maximum zoom distance
                      enablePan={false} // Disable panning
                    />
                    <BuildingModel
                      position={[0, 0, 0]}
                      scale={[1, 1, 1]}
                      linkFile={data?.modelURL}
                    />
                  </Suspense>
                </Canvas>
              </div>
            ) : (
              <p className="italic">Chưa có</p>
            )}
          </div>

          <div className="flex items-start justify-between mt-3 mb-3">
            <div className="flex items-center gap-2">
              <p className="text-md font-semibold">Số tầng: </p>
              <p className="">{floorsData?.length}</p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg`}
            >
              <LuCirclePlus />
              <span>Thêm mới tầng</span>
            </Button>
          </div>
          <DataTable
            fetchData={fetchBuildingFloorsData}
            table={table}
            page={page}
            columns={columns}
            setPage={setPage}
          />
        </CardContent>
      </Card>
      <FloorForm
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        data={selectedFloor}
        fetchData={fetchBuildingFloorsData}
      />
      <BuildingForm
        open={isOpenBuildingForm}
        setOpen={setIsOpenBuildingForm}
        data={data}
        fetchData={fetchData}
      />
    </div>
  );
};
