import { TextEditor } from "@/components/TextEditor/TextEditor";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import fileUploader, { deleteFirebaseItem } from "@/utils/fileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LuImageUp } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({
    required_error: "Vui lòng nhập tên tầng",
  }),
  description: z.any(),
});

export function FloorForm({ open, data = null, setOpen, fetchData }) {
  const { pathname } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(null);
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
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
        description:
          data?.description === "" || data?.description === null
            ? "Chưa có"
            : data?.description,
      });
      setImgUploaded(data?.image);
    }
  }, [data]);

  const createNewFloorService = async (payload) => {
    const response = await axios(import.meta.env.VITE_SERVER_URL + "/floors", {
      method: "POST",
      data: payload,
    });
    return response;
  };

  const updateFloorService = async (payload) => {
    const response = await axios(
      import.meta.env.VITE_SERVER_URL + "/floors/" + data.id,
      {
        method: "PUT",
        data: payload,
      }
    );
    return response;
  };
  const onSubmit = async (values) => {
    try {
      let buildingId = pathname.split("/").slice(-1).toString();
      let payload = {
        buildingId,
        image: imgUploaded,
        ...values,
      };
      setIsLoading(true);
      if (!data) {
        const response = await createNewFloorService(payload);
        if (response?.data?.success) {
          toast.success("Thêm mới Tòa nhà/CSVC thành công!");
          setIsLoading(false);
          setImgUploaded(null);
          setIsLoadingImg(false);
          form.reset();
        }
      } else {
        const response = await updateFloorService(payload);
        if (response?.data?.success) {
          toast.success("Chỉnh sửa thông tin thành công!");
          setIsLoading(false);
          setImgUploaded(null);
          setIsLoadingImg(false);
          form.reset();
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

  const onOpenChange = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) {
      if (imgUploaded) {
        deleteFirebaseItem(imgUploaded);
        setImgUploaded(null);
        setIsLoadingImg(false);
      }
      form.reset();
    }
  }, [open]);
  console.log("descriptions", form.watch());
  return (
    <Dialog className="h-fit" open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[65vw] h-fit max-h-[90vh] ">
        <DialogHeader className={"pb-3 shadow-b-md"}>
          <DialogTitle>
            {data ? "Chỉnh sửa thông tin tầng" : "Thêm mới tầng"}
          </DialogTitle>
          {data ? (
            <DialogDescription>
              Nhập thông tin cần chỉnh sửa và nhấn lưu thay đổi
            </DialogDescription>
          ) : (
            <></>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative h-[calc(100%-165px)] overflow-auto px-3"
          >
            <div className="grid  grid-cols-2 gap-5 ">
              {/* Tên tòa nhà */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className={`flex items-center gap-1.5`}>
                      Tên
                      <span className="text-red-primary ">(*)</span>:
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

              {/* Hình ảnh sơ đồ */}
              <div className="flex flex-col gap-2 col-span-2">
                <FormLabel>
                  Hình ảnh sơ đồ
                  <span className="text-secondary ml-1.5">(*)</span>
                </FormLabel>
                <div className="p-2 relative h-40 border-2  border-dashed rounded-lg">
                  {imgUploaded ? (
                    <div className="relative w-full h-full">
                      <Button
                        className="bg-red-primary absolute right-3 top-2 h-8 w-8 rouned-full text-white hover:bg-red-primary/90"
                        onClick={() => {
                          deleteFirebaseItem(imgUploaded);
                          setImgUploaded(null);
                          setIsLoadingImg(false);
                        }}
                      >
                        <Trash />
                      </Button>
                      <img
                        src={imgUploaded}
                        className={`shadow-[rgba(0,_0,_0,_0.8)_0px_30px_60px] w-full h-full object-contain rounded-[4px] `}
                        alt="thumbnail"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      <div className="absolute flex items-center justify-center w-full h-full justify-content-center border-2 border-dashed inset-0 rounded-lg">
                        {isLoadingImg ? (
                          <Progress
                            className={"absolute bottom-1 right-0 left-0"}
                            value={uploadingProgress}
                          />
                        ) : (
                          <LuImageUp size={46} />
                        )}
                      </div>

                      <label className="w-full h-full user-select-none border-dashed inset-0 rouned-lg absolute z-20">
                        <input
                          type="file"
                          name="upload-file"
                          //Nếu isImage=true thì chấp nhận mọi file có có type là image. Ngược lại các file có type là audio
                          accept="image/*"
                          className="w-0 h-0 hidden absolute cursor-pointer z-20"
                          onInput={(e) => {
                            const file = e?.target?.files[0];
                            if (!file) return;
                            fileUploader(
                              file,
                              "images",
                              setImgUploaded,
                              setIsLoadingImg,
                              setUploadingProgress
                            );
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

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
                      {console.log("dfasdfa", field)}

                      <FormControl>
                        <TextEditor
                          className="border border-r-none"
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
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
                disabled={(isLoading || isLoadingImg) && true ? true : false}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : data ? (
                  "Lưu"
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
