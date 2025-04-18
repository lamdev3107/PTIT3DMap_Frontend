import { BuildingModel } from "@/components/BuildingModel";
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
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import axios from "axios";
import { Loader2, Trash, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({
    required_error: "Vui lòng nhập tên tòa nhà",
  }),
  description: z.any(),
  model: z.any(),
  // .refine((files) => files instanceof FileList && files.length > 0, {
  //   message: "Bạn cần chọn một file",
  // }),
});

export function BuildingForm({ open, data = null, setOpen, fetchData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [glbURL, setGlbURL] = useState("");
  const defaultValues = useMemo(() => {
    return {
      name: undefined,
      description: undefined,
      model: undefined,
    };
  }, []);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  useEffect(() => {
    if (data) {
      form.reset({
        name: "" + data?.name,
        description: data?.description || "",
        model: data?.modelURL,
      });
      setGlbURL(data?.modelURL);
    }
  }, [data]);

  const handleDialogChange = (isOpen) => {
    if (!isOpen) {
      form.reset({
        name: "",
        description: "",
        model: undefined,
      });
      setGlbURL(null);
      setOpen(false);

      // Xử lý sự kiện khi dialog bị đóng
    }
  };

  useEffect(() => {
    if (!data) {
      form.reset();
    }
  }, [data]);
  const createNewBuildingService = async (payload) => {
    const response = await axios.post(
      import.meta.env.VITE_SERVER_URL + "/buildings",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  };

  // useEffect(() => {
  //   if (data?.modelURL) {
  //     fetch(data?.modelURL)
  //       .then((res) => res.blob())
  //       .then((blob) => {
  //         const file = new File([blob], "model.glb", { type: blob.type });
  //         form.setValue("model", file);
  //       });
  //   }
  // }, [data?.modelURL]);

  const updateBuildingService = async (payload) => {
    const response = await axios.put(
      import.meta.env.VITE_SERVER_URL + "/buildings/" + data.id,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  };
  const onSubmit = async (payload) => {
    try {
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
      form.reset();
    } catch (err) {
      setIsLoading(false);
      toast.error("Thêm mới tòa nhà thất bại!", err);

      console.log("error", err);
    }
  };

  const handleDeleteModel = () => {
    if (form.watch("model")) {
      form.setValue("model", null);
    }
    setGlbURL(null);
  };

  return (
    <Dialog className="h-fit" open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        className="sm:max-w-[90vw] md:max-w-[65vw] h-fit p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className={"py-5 mx-5  "}>
          <DialogTitle>
            {data ? "Chỉnh sửa thông tin tòa nhà" : "Thêm mới tòa nhà"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin cần chỉnh sửa và nhấn lưu thay đổi để cập nhật thông
            tin tòa nhà.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative h-[70vh] overflow-auto px-5 pb-5"
          >
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
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      File Model
                      <span className="text-secondary ml-1.5">(*)</span>
                    </FormLabel>
                    <div className="h-fit p2 text-sm rounded-md  w-full flex items-center relative">
                      {!glbURL ? (
                        <FormControl>
                          <Input
                            type="file"
                            accept=".glb"
                            onChange={(e) => {
                              // handleFileChange(e);
                              let fileURL = URL.createObjectURL(
                                e.target.files[0]
                              );
                              setGlbURL(fileURL);

                              field.onChange(e.target.files[0]);
                              // if (e.target.file[0]) {
                              //   field.onChange(e.target.files[0]);
                              // }
                            }}
                          />
                        </FormControl>
                      ) : (
                        <div className="     w-full border rounded-md relative">
                          <Canvas className="w-[200px]">
                            <Suspense>
                              <ambientLight intensity={0.5} />
                              <directionalLight
                                theatreKey="directionalLight"
                                position={[5, 5, 5]}
                                intensity={1}
                                castShadow
                                shadow-mapSize-width={1024}
                                shadow-mapSize-height={1024}
                              />
                              <OrbitControls />
                              <BuildingModel
                                position={[0, 0, 0]}
                                linkFile={glbURL}
                              />
                            </Suspense>
                          </Canvas>
                          <button
                            onClick={handleDeleteModel}
                            className="absolute cursor-pointer bg-red-primary   text-white text-red p-2.5 hover:bg-red-600 rounded-full  right-2 top-2"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      )}
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
