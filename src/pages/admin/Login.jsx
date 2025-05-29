import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/provider/AuthProvider";
import { ROUTES } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import logo from "../../assets/logo.png";
import background from "../../assets/login-bg.png";
import { Eye, EyeOff } from "lucide-react";
const formSchema = z.object({
  email: z.any(),
  password: z.any(),
});
export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const profileData = {
    email: "",
    password: "",
  };
  const { login, user } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: profileData,
  });

  const handleLogin = async (values) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let res = await response.json();
      if (res.success) {
        let user = res.data;
        login(user);
        navigate(`${ROUTES.ADMIN}${ROUTES.BUILDINGS}`);
      } else {
        alert("Đăng nhập thất bại, mật khẩu hoặc email không chính xác!");
      }
    } catch (err) {
      console.error(err);
      alert("Đăng nhập thất bại, mật khẩu hoặc email không chính xác!");
    }
  };

  function onSubmit(values) {
    handleLogin(values);
  }

  return (
    <div className="h-screen w-screen  flex md:justify-start md:items-start justify-between ">
      <div className="hidden lg:w-2/3 bg-black/20 md:block h-screen relative">
        <div className="absolute inset-0  z-10"></div>
        <img src={background} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="md:p-8 p-0 bg-white mx-auto md:w-[400px]  lg:w-1/3 w-[90vw] h-fit my-auto flex-shrink-0">
        <div className="flex flex-col items-center gap-3">
          <img src={logo} alt="" className="w-24 h-24 object-contain" />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 mt-4 flex-1"
          >
            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2 mt-3 flex flex-col items-start">
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2 mt-1 space-y-1 flex flex-col items-start">
                  <FormLabel className="font-semibold  text-md">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="col-span-2 mt-1 flex flex-col items-start">
                  <FormLabel className="font-semibold  text-md">
                    Mật khẩu
                  </FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        placeholder="*******"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="bg-red-primary hover:bg-red-primary/80 text-md font-semibold w-full"
              type="submit"
            >
              Đăng nhập
            </Button>
          </form>
        </Form>
        {/* form */}
        {/* error message */}
      </div>
    </div>
  );
};
