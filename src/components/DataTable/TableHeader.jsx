import { flexRender } from "@tanstack/react-table";

import {
  TableHead,
  TableHeader as ShadTableHeader,
  TableRow,
} from "@/components/ui/table";

const TableHeader = ({ table }) => {
  return (
    <ShadTableHeader className="bg-table-headerBackground">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className=" font-bold px-0 uppercase text-xs text-gray-900 "
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </ShadTableHeader>
  );
};

export default TableHeader;
