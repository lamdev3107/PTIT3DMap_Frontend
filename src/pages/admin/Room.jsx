/* eslint-disable no-unused-vars */
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LuCirclePlus, LuSearch } from "react-icons/lu";
import { IoRefresh } from "react-icons/io5";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import axios from "axios";

export const Room = () => {
  const [searchValue, setSearchValue] = useState("");
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

    if (searchBy.value === "device") {
      //Nếu là số
      if (!isNaN(Number(searchValue))) queryParams.deviceId = searchValue;
      else {
        queryParams.deviceName = searchValue;
      }
    }
    if (searchBy.value === "status") {
      queryParams.status = searchValue === "Tắt" ? "false" : "true";
    }
    if (searchBy.value === "createdAt") {
      queryParams.createdAt = searchValue;
    }
    queryParams.limit = pagination.pageSize;
    queryParams.page = page;
    queryParams.orderby = orderBy.label;
    queryParams.order = orderBy.value;
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
      header: () => {
        return (
          <div className="p-2 text-sm capitalize font-bold">Tên tòa nhà</div>
        );
      },
      cell: ({ row }) => (
        <div className="text-left capitalize">{row.original?.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => {
        return <div className="p-2 text-sm capitalize font-bold">Mô tả</div>;
      },
      cell: ({ row }) => (
        <div className="text-left capitalize">{row.original?.description}</div>
      ),
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
  console.log("data", data);
  return (
    <>
      <Card className="col-span-2 bg-light-blue-bg p-4 rounded-xl  text-center lg:col-span-1 lg:p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-3">Danh sách tòa nhà</h2>
          <Button
            className={`cursor-pointer flex items-center gap-2 px-2 py-1 rounded-lg`}
          >
            <LuCirclePlus />
            <span>Thêm mới tòa nhà</span>
          </Button>
        </div>
        <CardContent className="p-0">
          <DataTable
            fetchData={fetchData}
            table={table}
            page={page}
            columns={columns}
            setPage={setPage}
          />
        </CardContent>
      </Card>
    </>
  );
};
