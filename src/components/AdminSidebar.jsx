import * as React from "react";
import logo from "../assets/logo.png";
// import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/utils/constants";
import { Link, useLocation } from "react-router-dom";

import { LuBuilding, LuLayoutDashboard } from "react-icons/lu";

// This is sample data.
const data = {
  navMain: [
    // {
    //   title: "Trang chủ",
    //   icon: <LuBuilding size={20} />,
    //   url: ROUTES.HOME,
    // },
    {
      title: "Tòa Nhà/CSVC",
      icon: <LuBuilding size={20} />,
      url: `${ROUTES.ADMIN}${ROUTES.BUILDINGS}`,
    },
    {
      title: "Phòng Ban",
      icon: <LuLayoutDashboard size={20} />,
      url: `${ROUTES.ADMIN}${ROUTES.ROOMS}`,
    },
    // {
    //   title: "Tài khoản",
    //   icon: <LucideCircleUser />,
    //   url: ROUTES.PROFILE,
    // },
    // {
    //   title: "Settings",
    //   icon: <LuSettings />,
    //   url: "",
    // },
  ],
};

export function AdminSidebar({ ...props }) {
  const { pathname } = useLocation();
  return (
    <Sidebar
      className="shadow-[inset_0px_4px_10px_#d5e7fb] bg-light-blue-bg "
      {...props}
    >
      <SidebarContent className="overflow-hidden bg-light-blue-bg pt-2">
        {/* We create a SidebarGroup for each parent. */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primaryBlue flex items-center justify-center text-xl font-bold pb-5  h-fit ml-4 ">
            <img src={logo} alt="" className="w-14 h-14 object-contain" />
          </SidebarGroupLabel>
          <SidebarGroupContent className="ml-4">
            <SidebarMenu className="overflow-hidden">
              {data.navMain.map((item, id) => {
                return (
                  <SidebarMenuButton
                    asChild
                    key={id}
                    className={`${
                      pathname.includes(item.url)
                        ? "bg-red-primary hover:text-white  text-white rounded-l-full hover:bg-red-primary overflow-hidden shadow-md"
                        : "bg-transparent hover:text-red-primary hover:bg-transparent rounded-l-full overflow-hidden"
                    }  `}
                    // isActive={pathname === item.url}
                  >
                    <Link
                      to={item.url}
                      className="  flex items-center gap-2 h-fit "
                    >
                      {
                        <div
                          className={`p-2 rounded-l-full ${
                            pathname.includes(item.url)
                              ? " rounded-full shadow-inner hover:text-white text-white "
                              : "bg-transparent "
                          } `}
                        >
                          {item.icon}
                        </div>
                      }
                      <span className="text-md">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarRail /> */}
      {/* <SidebarFooter className="flex items-center">
        <SidebarTrigger />
      </SidebarFooter> */}
    </Sidebar>
  );
}
