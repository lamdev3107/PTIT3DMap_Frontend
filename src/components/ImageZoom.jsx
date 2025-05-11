"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";

export function ImageZoom({ src, alt = "", className }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={cn(
          "cursor-zoom-in rounded-lg h-full w-full object-contain transition hover:opacity-80",
          className
        )}
        onClick={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle />
        <DialogContent className="sm:max-w-[90vw] h-fit gap-1 md:max-w-[60vw] flex justify-content-center    bg-white p-5 border-none">
          <img
            src={src}
            alt={alt}
            className="h-[70vh] w-full object-contain cursor-zoom-out"
            onClick={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
