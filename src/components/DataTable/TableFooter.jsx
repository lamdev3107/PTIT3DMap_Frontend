import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "./Pagination";
export function TableFooter({ table, page, setPage }) {
  return (
    <div className="flex items-center justify-end pt-5  ">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2 ">
          <p className="text-sm">Số hàng/trang</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px] bg-white">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[8, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Trang {page}/ {table.getPageCount()}
        </div>

        <Pagination page={page} setPage={setPage} table={table} />
      </div>
    </div>
  );
}
