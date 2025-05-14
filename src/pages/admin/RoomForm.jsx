import { BuildingModel } from "@/components/BuildingModel";
import { Combobox } from "@/components/Combobox";
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
import fileUploader, { deleteFirebaseItem } from "@/utils/fileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { LuImageUp } from "react-icons/lu";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({
    required_error: "Vui lòng nhập tên phòng",
  }),
  roomId: z.string({
    required_error: "Vui lòng nhập mã phòng",
  }),
  buildingId: z.number({
    required_error: "Vui lòng chọn tòa nhà",
  }),
  floorId: z.number({
    required_error: "Vui lòng chọn tầng",
  }),
  model: z.any(),
  description: z.any(),
});

export function RoomForm({ open, data = null, setOpen, fetchData, floorData = null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [building, setBuilding] = useState(null);
  const [buildingList, setBuildingList] = useState([]);
  const [floor, setFloor] = useState(null);
  const [floorList, setFloorList] = useState([]);

  const [glbURL, setGlbURL] = useState("");

  const handleDeleteModel = () => {
    if (form.watch("model")) {
      form.setValue("model", null);
    }
    setGlbURL(null);
  };

  const [navigation, setNavigation] = useState({
    label: "Không chọn",
    value: null,
  });
  const [navigationList, setNavigationList] = useState([]);

  //   upload Image state
  const [imgUploaded, setImgUploaded] = useState(null);
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const defaultValues = useMemo(() => {
    return {
      name: undefined,
      description: undefined,
      model: undefined,
    };
  }, []);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
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
        roomId: "" + res?.roomId,
        description: res?.description || "",
        navigationId: res?.navigation?.id,
        floorId: res?.floor?.id,
        buildingId: res?.floor?.building?.id,
        model: res?.modelURL
      });
      setImgUploaded(res?.image);
      setNavigation({
        label: res?.navigation?.name || "Không chọn",
        value: res?.navigation?.id,
      });
      setFloor({
        label: res?.floor?.name || "Không chọn",
        value: res?.floor?.id,
      });
      setBuilding({
        label: res?.floor.building?.name || "Không chọn",
        value: res?.floor.building?.id,
      });
      setGlbURL(data?.modelURL);

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
  }, [data, open]);

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

  useEffect(() => {
    if(floorData){
      if(buildingList){
        const building = buildingList.find((item) => item.value == floorData.buildingId)

        if(building){
          setBuilding(building);

          form.reset({
            buildingId: Number(floorData.buildingId),
          }) 
        }
      }
      if(floorList){
        setFloor(floorList.find((item) => item.value == floorData.floorId))
        form.reset({
          floorId: Number(floorData.floorId),
          buildingId: Number(floorData.buildingId)
        })
      }
      
    }
  }, [ buildingList, floorList, open])

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
    if (building?.value && !floor?.data) {
      fetchBuildingFloorsData();
    }
  }, [building?.value]);

  const onOpenChange = ( isOpen
  ) => {
    if (!isOpen) {
      resetForm();
      // Xử lý sự kiện khi dialog bị đóng
    }
    setOpen(!open);

  };

  const createNewRoomService = async (payload) => {
    const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/rooms",
     payload,
     {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    );
      
    return response;
  };

  const updateRoomService = async (payload) => {
    const response = await axios.put(
      import.meta.env.VITE_SERVER_URL + "/rooms/" + data.id ,payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  };
  const resetForm = () => {
    form.reset({
      name: undefined,
      description: undefined,
      model: undefined,
      roomId: undefined,
      buildingId: undefined,
      floorId: undefined,
    });
    setGlbURL(null);
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
      toast.error("Thêm mới tòa nhà thất bại!");

      console.log("error", err);
    }
  };
  const handleUploadSuccess = (url) => {
    setImgUploaded(url);
    setIsLoadingImg(false);
    setUploadingProgress(0);
  };
  const handleUploadProgress = (progress) => {
    setUploadingProgress(progress);
    setIsLoadingImg(true);
  };
  return (
    <Dialog className="h-fit p-0" open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] p-0 md:max-w-[65vw] h-fit" 
       onInteractOutside={(event) => {
        event.preventDefault(); // 👉 Ngăn dialog đóng khi click outside
      }}
      >
        <DialogHeader className={"pb-3 pt-5 px-5 border-b"}>
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
            <div className="grid  grid-cols-2 gap-5 p-5 max-h-[calc(85vh-100px)] overflow-auto">
              {/* Tên phòng  */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1 md:col-span-2">
                    <FormLabel>
                      Tên phòng
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

              {/* Mã phòng  */}
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1 md:col-span-2">
                    <FormLabel>
                      Mã phòng
                      <span className="text-red-primary ">(*)</span>
                    </FormLabel>
                    <div className="h-10 p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Input
                          className="border border-r-none"
                          type="text"
                          {...field}
                          placeholder="Nhập mã phòng..."
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
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>
                      Tòa nhà:
                      <span className="text-red-primary ">(*)</span>
                    </FormLabel>
                    <div className="h-10 p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Combobox
                          className={"w-full"}
                          searchable={false}
                          disabled={floorData}
                          optionList={buildingList}
                          selectedOption={building}
                          onChange={field.onChange}
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
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>
                      Tầng
                      <span className="text-red-primary ">(*)</span>
                    </FormLabel>
                    <div className="h-10 p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Combobox
                          className={"w-full"}
                          searchable={false}
                          disabled={!building?.value || floorData ? true : false}
                          optionList={floorList}
                          onChange={field.onChange}
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

                 {/* Tên danh mục */}
                <FormField
                control={form.control}
                name="navigationId"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Danh mục:</FormLabel>
                    <div className="h-10 p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <Combobox
                          className={"w-full"}
                          searchable={false}
                          onChange={field.onChange}
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

              {/* Hình ảnh sơ đồ */}
              <div className="flex flex-col gap-2 col-span-2">
                <FormLabel>
                  Hình ảnh sơ đồ
                  <span className="text-red-primary ">(*)</span>
                </FormLabel>
                <div className="p-2 relative h-40 border-2  border-dashed rounded-lg">
                  {imgUploaded ? (
                    <div className="relative w-full h-full">
                      <Button
                        className="bg-red-primary absolute right-3 top-2 h-8 w-8 rouned-full text-white hover:bg-red-primary/90"
                        onClick={() => {
                          const confirm = window.confirm("Bạn có chắc chắn muốn xóa ảnh này?");
                          if (!confirm) return;
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
                              handleUploadSuccess,
                              handleUploadProgress
                            );
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      File Model
                      <span className="text-red-primary ">(*)</span>
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
                        <div className="   h-80   w-full border rounded-md relative">
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
                                scale={[0.8, 0.8, 0.8]}
                                rotation={[0,  Math.PI/2, 0]} // Rotate 360 degrees around Y axis
                                linkFile={glbURL}
                              />
                            </Suspense>
                          </Canvas>
                          <Button
                            className="bg-red-primary absolute right-5 top-4 h-8 w-8 rouned-full text-white hover:bg-red-primary/90"
                            onClick={handleDeleteModel }
                          >
                            <Trash />
                          </Button>
                        </div>
                      )}
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
                      {/* <span className="text-red-primary ">(*)</span> */}
                    </FormLabel>
                    <div className="h-fit p2 text-sm rounded-md flex items-center">
                      <FormControl>
                        <TextEditor onChange={field.onChange} value={field.value} />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-500 font-normal italic" />
                  </FormItem>
                )}
              />
            </div>
            {/* Nút Submit */}
            <DialogFooter className={"pt-5 px-5 pb-4"}>
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
