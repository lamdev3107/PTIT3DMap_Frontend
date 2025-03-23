"use client";

import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import TableHeader from "./TableHeader";
import { TableFooter } from "./TableFooter";

{
  // columns, data, (search = null), (columnList = null);
}
export function DataTable({
  columns,
  page,
  setPage,
  search = null,
  table = table,
}) {
  return (
    <div className="w-full ">
      <div className="rounded-md border">
        <Table className="bg-white">
          <TableHeader table={table} />
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:bg-gray-100"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TableFooter page={page} setPage={setPage} table={table} />
    </div>
  );
}
