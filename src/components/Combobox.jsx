"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronsDown, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const demoOption = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function Combobox({
  optionList,
  selectedOption,
  setSelectedOption,
  disabled = false,
  onChange = () => {},
  searchable = true,
  placeholder,
  className = null,
  emptyText = null,
}) {
  const [open, setOpen] = React.useState(false);

  // const [value, setValue] = React.useState("");
  const observedRef = React.useRef(null); // Phần tử cần theo dõi
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const observedElement = observedRef.current;

    // Sử dụng ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height }); // Lưu kích thước phần tử
      }
    });

    if (observedElement) {
      resizeObserver.observe(observedElement);
    }

    // Cleanup observer khi component unmount
    return () => {
      if (observedElement) {
        resizeObserver.unobserve(observedElement);
      }
    };
  }, []);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          ref={observedRef}
          role="combobox"
          aria-expanded={open}
          className={`min-w-[200px] ${className && className}  justify-between`}
        >
          {selectedOption != null ? selectedOption?.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{
          width: size.width, // Áp dụng kích thước width từ phần tử đầu
        }}
        id="container"
        className={`min-w-[200px] p-0 ${
          className && className
        }  justify-between`}
      >
        <Command className="bg-white w-full">
          {/* Note: Search by value, not label */}
          {searchable && <CommandInput placeholder="Tìm kiếm..." />}
          <CommandList>
            <CommandEmpty className="w-full  p-0">
              {emptyText ? (
                <span className="text-sm px-3">{emptyText}</span>
              ) : (
                <span className="text-sm px-3">Chưa có dữ liệu</span>
              )}
            </CommandEmpty>
            <CommandGroup className="w-full">
              {optionList.map((item) => (
                <CommandItem
                  className="hover:bg-slate-100 w-full"
                  key={item.value}
                  value={item.label}
                  onSelect={(currentValue) => {
                    // setValue(currentValue === value ? "" : currentValue);
                    setSelectedOption(
                      optionList.find((item) => item.label === currentValue)
                    );
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
