import { Combobox } from "@/components/Combobox";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  LuCirclePlus,
  LuEye,
  LuPencilLine,
  LuSearch,
  LuTrash2,
} from "react-icons/lu";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { IoRefresh } from "react-icons/io5";
import { Label } from "@/components/ui/label";
import { RoomForm } from "./RoomForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { deleteFirebaseItem } from "@/utils/fileUploader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize text-left">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "sensor",
    header: ({ column }) => (
      <Button
        id="sensor"
        variant="ghost"
        className="px-0 font-bold "
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Cảm biến
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{"Cảm biến môi trường"}</div>
      );
    },
  },
];
export const RoomList = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [pageCount, setPageCount] = useState(0);
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState({
    label: "createdAt",
    value: "desc",
  });
  const fetchData = async () => {
    let queryParams = {};
    if (searchValue !== "") {
      queryParams[name] = searchValue;
    }
    queryParams.limit = pagination.pageSize;
    queryParams.page = page;
    queryParams.orderby = orderBy.label;
    queryParams.order = orderBy.value;
    // Fetch data from API
    try {
      let searchParam = new URLSearchParams(queryParams).toString();
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/rooms?" + searchParam
      );
      const data = await response.json();
      setData(data.data);
      setPageCount(data.pagination.totalPages);
      
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      if (selectedRoom) setSelectedRoom(null);
    }
  }, [isDialogOpen]);
  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };
  const handleDeleteClick = async (room) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?");
    if (!confirm) return;
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/rooms/" + room.id,
        {
          method: "DELETE",
        }
      );
      if (response?.data?.success) {
        toast.success("Xóa phòng ban thành công!");
        if (room?.image) {
          deleteFirebaseItem(room?.image);
        }
        fetchData();
      } else {
        toast.error("Xóa phòng ban thất bại!!");
      }
    } catch (err) {
      toast.error("Xóa phòng ban thất bại!", err);
    }
  };
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
      header: (
        <Button
          variant="ghost"
          className="px-2 hover:bg-gray-100 font-bold"
          onClick={() => {
            setOrderBy((prev) => {
              if (prev.value == "desc") {
                return { value: "asc", label: "name" };
              } else if (prev.value == "asc") {
                return { value: "desc", label: "name" };
              } else {
                return { value: "asc", label: "name" };
              }
            });
          }}
        >
          Tên
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize text-left">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "floor",
      header: (
        <Button
          variant="ghost"
          className="px-2 hover:bg-gray-100 font-bold"
          onClick={() => {
            setOrderBy((prev) => {
              if (prev.value == "desc") {
                return { value: "asc", label: "floor" };
              } else if (prev.value == "asc") {
                return { value: "desc", label: "floor" };
              } else {
                return { value: "desc", label: "floor" };
              }
            });
            fetchData();
          }}
        >
          Tầng
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize text-left">{row.original.floor?.name}</div>
      ),
    },

    {
      accessorKey: "building",
      header: (
        <Button
          variant="ghost"
          className="px-2 hover:bg-gray-100 font-bold"
          onClick={() => {
            setOrderBy((prev) => {
              if (prev.value == "desc") {
                return { value: "asc", label: "building" };
              } else if (prev.value == "asc") {
                return { value: "desc", label: "building" };
              } else {
                return { value: "desc", label: "building" };
              }
            });
            fetchData();
          }}
        >
          Tòa nhà
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className=" text-left">{row.original.floor.building.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => {
        return <div className="text-sm p-2 font-bold capitalize">Mô tả</div>;
      },
      cell: ({ row }) => (
        <div className="text-left">
          {row.original?.description || <span className="italic">Chưa có</span>}
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
                  console.log("id", row.original.id);
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
  useEffect(() => {
    fetchData();
    setPagination((prev) => {
      return {
        ...prev,
        pageSize: pagination.pageSize,
        pageIndex: page - 1,
      };
    });
  }, [pagination.pageSize, page]);
  useEffect(() => {
    fetchData();
  }, [orderBy]);

  const table = useReactTable({
    data,
    pageCount: pageCount,
    columns,
    debugTable: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      pagination,
      initialState: {
        pagination: {
          pageSize: 10,
          pageIndex: 0,
        },
      },
    },
  });
  const optionList = [
    {
      label: "Tòa nhà A1",
      value: "",
    },
    {
      label: "Tìm kiếm theo tên",
      value: "temperature",
    },
    {
      label: "Tìm kiếm theo tầng",
      value: "humidity",
    },
    {
      label: "Tìm kiếm theo Tòa nhà",
      value: "light",
    },
  ];
  return (
    <>
      <Card className="col-span-2 bg-light-blue-bg p-4 rounded-xl  text-center lg:col-span-1 lg:p-4">
        <CardContent className="p-0 ">
          <div className="flex justify-between items-center ">
            <h2 className="font-semibold  text-lg mb-3">Danh sách phòng ban </h2>
          </div>
          <div className="flex items-center justify-between mb-3 relative">
            <div className="relative py-1">
              <Input
                // disabled={searchBy.value === ""}
                placeholder={`Tìm kiếm phòng ban...`}
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setPage(1);
                }}
                className="max-w-sm min-w-72 bg-white "
              />
              <LuSearch
                onClick={() => fetchData()}
                size={20}
                className="absolute text-gray-400 hover:text-black cursor-pointer transition-all duration-200 ease-out top-[calc(50%)] -translate-y-[calc(50%)] right-4 "
              />
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg`}
            >
              <LuCirclePlus />
              <span>Thêm mới</span>
            </Button>
            {/* <div className="relative flex gap-1.5 items-center  py-1">
              <Label>Tòa nhà:</Label>
              <Combobox
                className={"w-fit"}
                searchable={false}
                optionList={optionList}
                selectedOption={searchBy}
                setSelectedOption={setSearchBy}
                placeholder={"Tìm kiếm theo"}
              />
            </div> */}
          </div>

          <DataTable
            fetchData={fetchData}
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
        fetchData={fetchData}
      />
    </>
  );
};
