import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export function Pagination({ page, setPage, table }) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => setPage(1)}
        disabled={page <= 1}
      >
        <span className="sr-only">Trang đầu</span>
        <ChevronsLeft />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
      >
        {/* <span className="sr-only">Đi tới trang trước đó</span> */}
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => setPage(page + 1)}
        disabled={page >= table.getPageCount()}
      >
        {/* <span className="sr-only">Đi tới trang tiếp theo</span> */}
        <ChevronRight />
      </Button>
      <Button
        variant="outline"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => setPage(table.getPageCount())}
        disabled={page >= table.getPageCount()}
      >
        <ChevronsRight />
        <span className="sr-only">Trang cuối</span>
      </Button>
    </div>
  );
}
