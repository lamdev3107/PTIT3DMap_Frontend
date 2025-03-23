import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({
    required_error: "Vui lòng nhập tên tòa nhà",
  }),
  description: z.any(),
});

export function BuildingForm({ open, data = null, setOpen, fetchData }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      description: undefined,
    },
  });
  useEffect(() => {
    if (data) {
      form.reset({
        name: "" + data?.name,
        description: data?.description || "",
      });
    }
  }, [data]);

  const onOpenChange = () => {
    setOpen(!open);
    form.reset();
  };

  const createNewBuildingService = async (payload) => {
    const response = await axios(
      import.meta.env.VITE_SERVER_URL + "/buildings",
      {
        method: "POST",
        data: payload,
      }
    );
    return response;
  };

  const updateBuildingService = async (payload) => {
    const response = await axios(
      import.meta.env.VITE_SERVER_URL + "/buildings/" + data.id,
      {
        method: "PUT",
        data: payload,
      }
    );
    return response;
  };
  const onSubmit = async (payload) => {
    try {
      console.log(payload);
      setIsLoading(true);
      if (!data) {
        const response = await createNewBuildingService(payload);
        if (response?.data?.success) {
          toast.success("Thêm mới Tòa nhà/CSVC thành công!");
          setIsLoading(false);
        }
      } else {
        const response = await updateBuildingService(payload);
        if (response?.data?.success) {
          toast.success("Chỉnh sửa thông tin thành công!");
          setIsLoading(false);
        }
      }
      fetchData();
      setOpen();
    } catch (err) {
      setIsLoading(false);
      toast.error("Thêm mới tòa nhà thất bại!", err);

      console.log("error", err);
    }
  };

  return (
    <Dialog className="h-fit" open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[65vw] h-fit">
        <DialogHeader className={"pb-3"}>
          <DialogTitle>
            {data ? "Chỉnh sửa thông tin tòa nhà" : "Thêm mới tòa nhà"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin cần chỉnh sửa và nhấn lưu thay đổi để cập nhật loại
            tin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="grid  grid-cols-2 gap-5">
              {/* Tên tòa nhà */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Tên tòa nhà
                      <span className="text-red-primary ">(*)</span>
                    </FormLabel>
                    <div className="h-10 p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Input
                          className="border border-r-none"
                          type="text"
                          {...field}
                          placeholder="Nhập tên..."
                        />
                      </FormControl>
                    </div>

                    <FormMessage className="text-red-500 font-normal italic" />
                  </FormItem>
                )}
              />

              {/* Mô tả  */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Mô tả
                      <span className="text-secondary ml-1.5">(*)</span>
                    </FormLabel>
                    <div className="h-fit p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Textarea
                          className="border border-r-none"
                          type="text"
                          {...field}
                          placeholder="Nhập thông tin mô tả..."
                        />
                      </FormControl>
                    </div>

                    <FormMessage className="text-red-500 font-normal italic" />
                  </FormItem>
                )}
              />
            </div>
            {/* Nút Submit */}
            <DialogFooter className={"pt-5"}>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                type="submit"
                disabled={isLoading ? true : false}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : data ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
