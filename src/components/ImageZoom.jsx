"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ImageZoom({ src, alt = "", className }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={cn(
          "cursor-zoom-in rounded-lg  transition hover:opacity-80",
          className
        )}
        onClick={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[90vw] gap-1 md:max-w-[80vw]  h-fit max-h-[80vh] overflow-hidden  bg-white p-5 border-none">
          <img
            src={src}
            alt={alt}
            className="h-full object-contain cursor-zoom-out"
            onClick={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
