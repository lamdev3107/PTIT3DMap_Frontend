/* eslint-disable no-unused-vars */
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
import { IoRefresh } from "react-icons/io5";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import axios from "axios";
import toast from "react-hot-toast";
import { BuildingForm } from "./BuildingForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";

export const BuildingList = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [data, setData] = useState([]);
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
    let queryParams = {};
    queryParams.limit = pagination.pageSize;
    queryParams.page = page;
    queryParams.orderby = orderBy.label;
    queryParams.order = orderBy.value;
    queryParams.search = searchValue;
    // Fetch data from API
    try {
      let searchParam = new URLSearchParams(queryParams).toString();
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/buildings?" + searchParam
      );
      const data = response.data;
      setData(data.data);
      setPageCount(data.pagination.totalPages);
    } catch (err) {
      toast.error("Lấy dữ liệu thất bại!");
      console.error(err);
    }
  };

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
                return { value: "desc", label: "name" };
              }
            });
            fetchData();
          }}
        >
          Tên tòa nhà/cơ sở vật chất
          <ArrowUpDown />
        </Button>
      ),

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
        <div className="text-left">
          {row.original?.description || <span className="italic">Chưa có</span>}
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
                    ROUTES.ADMIN + ROUTES.BUILDINGS + "/" + row.original.id
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
                onClick={() => handleDeleteClick(row.original.id)}
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
  useEffect(() => {
    if (searchBy.value === "") {
      fetchData();
      setSearchValue("");
    }
    return;
  }, [searchBy]);

  const table = useReactTable({
    data,
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

  const handleEditClick = (building) => {
    setSelectedBuilding(building);
    setIsDialogOpen(true);
  };
  const handleDeleteClick = async (id) => {
    const confirm = window.confirm(
      "Bạn có chắc chắn muốn xóa Tòa nhà/CSVC này?"
    );
    if (!confirm) return;
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/buildings/" + id,
        {
          method: "DELETE",
        }
      );
      if (response?.data?.success) {
        toast.success("Xóa Tòa nhà/CSVC thành công!");
        fetchData();
      } else {
        toast.error("Xóa Tòa nhà/CSVC thất bại!");
      }
    } catch (err) {
      toast.error("Xóa tòa nhà thất bại!", err);
    }
  };
  return (
    <>
      <Card className="col-span-2 bg-light-blue-bg p-4 rounded-xl  text-center lg:col-span-1 lg:p-4">
        <CardContent className="p-0">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold mb-3">
              Danh sách Tòa nhà/CSVC
            </h2>
          </div>
          <div className="flex items-center justify-between mb-3 relative">
            <div className="flex items-center gap-2">
              <div className="relative py-1">
                <Input
                  // disabled={searchBy.value === ""}
                  placeholder={`Tìm kiếm tòa nhà/CSVC...`}
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                  }}
                  className="max-w-sm min-w-72 bg-white "
                />
                <LuSearch
                  onClick={() => {
                    // setSearchValue("");
                    fetchData();
                  }}
                  size={19}
                  className="absolute text-gray-400 hover:text-black cursor-pointer transition-all duration-200 ease-out top-[calc(50%)] -translate-y-[calc(50%)] right-4 "
                />
              </div>
              <Button
                onClick={() => fetchData()}
                variant="outline"
                size="icon"
                className="h-10 w-10"
              >
                <IoRefresh className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg`}
            >
              <LuCirclePlus />
              <span>Thêm mới</span>
            </Button>
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
      <BuildingForm
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        data={selectedBuilding}
        fetchData={fetchData}
      />
    </>
  );
};
