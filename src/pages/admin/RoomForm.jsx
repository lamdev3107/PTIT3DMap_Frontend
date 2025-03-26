import { Combobox } from "@/components/Combobox";
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

import { Textarea } from "@/components/ui/textarea";
import fileUploader, { deleteFirebaseItem } from "@/utils/fileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LuImageUp } from "react-icons/lu";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({
    required_error: "Vui lòng nhập tên tòa nhà",
  }),
  description: z.any(),
});

export function RoomForm({ open, data = null, setOpen, fetchData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [building, setBuilding] = useState(null);
  const [buildingList, setBuildingList] = useState([]);
  const [floor, setFloor] = useState(null);
  const [floorList, setFloorList] = useState([]);

  const [navigation, setNavigation] = useState({
    label: "Không chọn",
    value: null,
  });
  const [navigationList, setNavigationList] = useState([]);

  //   upload Image state
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

  const fetchRoom = async () => {
    // Fetch data from API
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/rooms/" + data?.id
      );
      let res = response.data.data;
      form.reset({
        name: "" + res?.name,
        description: res?.description || "",
      });
      setImgUploaded(res.image);
      setNavigation({
        label: res.navigation?.name || "Không chọn",
        value: res.navigation?.id,
      });
      setFloor({
        label: res.floor?.name || "Không chọn",
        value: res.floor?.id,
      });
      setBuilding({
        label: res.floor.building?.name || "Không chọn",
        value: res.floor.building?.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (data) {
      fetchRoom();
    } else {
      resetForm();
    }
  }, [data]);

  const fetchBuildingList = async () => {
    // Fetch data from API
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/buildings?"
      );

      const data = response.data.data;

      let buildingList = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setBuildingList(buildingList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBuildingList();
    fetchNavigationsData();
  }, []);

  const fetchBuildingFloorsData = async () => {
    // Fetch data from API
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL +
          "/buildings/" +
          building.value +
          "/floors"
      );
      const data = response.data.data;

      let floorList = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setFloorList(floorList);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchNavigationsData = async () => {
    // Fetch data from API
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/navigations"
      );
      const data = response.data.data;
      let navigationList = [];
      navigationList.push({
        label: "Không chọn",
        value: null,
      });
      let fetchList = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      navigationList = navigationList.concat(fetchList);
      setNavigationList(navigationList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (building?.value) {
      fetchBuildingFloorsData();
    }
  }, [building?.value]);

  const onOpenChange = () => {
    setOpen(!open);
    resetForm();
  };

  const createNewRoomService = async (payload) => {
    const response = await axios(import.meta.env.VITE_SERVER_URL + "/rooms", {
      method: "POST",
      data: payload,
    });
    return response;
  };

  const updateRoomService = async (payload) => {
    const response = await axios(
      import.meta.env.VITE_SERVER_URL + "/rooms/" + data.id,
      {
        method: "PUT",
        data: payload,
      }
    );
    return response;
  };
  const resetForm = () => {
    form.reset({
      name: undefined,
      description: undefined,
    });
    setBuilding(null);
    setFloor(null);
    setIsLoading(false);
    setNavigation(null);
    setImgUploaded(null);
    setUploadingProgress(0);
  };
  const onSubmit = async (payload) => {
    try {
      let formData = {
        floorId: floor?.value,
        navigationId: navigation?.value,
        image: imgUploaded,
        ...payload,
      };
      setIsLoading(true);
      if (!data) {
        const response = await createNewRoomService(formData);
        if (response?.data?.success) {
          toast.success("Thêm mới Tòa nhà/CSVC thành công!");
          setIsLoading(false);
        }
      } else {
        const response = await updateRoomService(formData);
        if (response?.data?.success) {
          toast.success("Chỉnh sửa thông tin thành công!");
          setIsLoading(false);
        }
      }
      fetchData();
      setOpen();
      resetForm();
    } catch (err) {
      setIsLoading(false);
      toast.error("Thêm mới tòa nhà thất bại!", err);

      console.log("error", err);
    }
  };
  console.log("form", form.watch());
  return (
    <Dialog className="h-fit" open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[65vw] h-fit">
        <DialogHeader className={"pb-3"}>
          <DialogTitle>
            {data ? "Chỉnh sửa thông tin phòng ban" : "Thêm mới phòng ban"}
          </DialogTitle>
          {data ? (
            <DialogDescription>
              Nhập thông tin cần chỉnh sửa và nhấn lưu thay đổi để cập nhật loại
              tin.
            </DialogDescription>
          ) : (
            ""
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="grid  grid-cols-2 gap-5">
              {/* Tên phòng  */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1 md:col-span-2">
                    <FormLabel>
                      Tên
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

              {/* Tên danh mục */}
              <FormField
                control={form.control}
                name="navigationId"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1 md:col-span-2">
                    <FormLabel>Danh mục:</FormLabel>
                    <div className="h-10 p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Combobox
                          className={"w-full"}
                          searchable={false}
                          optionList={navigationList}
                          selectedOption={navigation}
                          setSelectedOption={setNavigation}
                          placeholder={"Chọn danh mục"}
                        />
                      </FormControl>
                    </div>

                    <FormMessage className="text-red-500 font-normal italic" />
                  </FormItem>
                )}
              />

              {/* Tòa nhà  */}
              <FormField
                control={form.control}
                name="buildingId"
                render={({ field }) => (
                  <FormItem className=" md:col-span-1">
                    <FormLabel>
                      Tòa nhà:
                      <span className="text-red-primary ">(*)</span>
                    </FormLabel>
                    <div className="h-10 p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Combobox
                          className={"w-full"}
                          searchable={false}
                          optionList={buildingList}
                          selectedOption={building}
                          setSelectedOption={setBuilding}
                          placeholder={"Chọn tòa nhà"}
                        />
                      </FormControl>
                    </div>

                    <FormMessage className="text-red-500 font-normal italic" />
                  </FormItem>
                )}
              />

              {/* Tầng */}
              <FormField
                control={form.control}
                name="floorId"
                render={({ field }) => (
                  <FormItem className=" md:col-span-1">
                    <FormLabel>
                      Tầng
                      <span className="text-red-primary ">(*)</span>
                    </FormLabel>
                    <div className="h-10 p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Combobox
                          className={"w-full"}
                          searchable={false}
                          disabled={building?.value ? false : true}
                          optionList={floorList}
                          selectedOption={floor}
                          setSelectedOption={setFloor}
                          placeholder={"Chọn tầng"}
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
                  Hình ảnh
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
