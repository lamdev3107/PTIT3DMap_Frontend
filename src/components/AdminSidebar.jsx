import * as React from "react";

// import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
    {
      title: "Trang chủ",
      icon: <LuBuilding size={20} />,
      url: ROUTES.ADMIN,
    },
    {
      title: "Tòa Nhà/CSVC",
      icon: <LuBuilding size={20} />,
      url: `${ROUTES.ADMIN}${ROUTES.BUILDING}`,
    },
    {
      title: "Phòng Ban",
      icon: <LuLayoutDashboard size={20} />,
      url: `${ROUTES.ADMIN}${ROUTES.ROOM}`,
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
      <SidebarContent className="overflow-hidden bg-light-blue-bg pt-4">
        {/* We create a SidebarGroup for each parent. */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primaryBlue flex items-center text-xl font-bold mb-4 ml-4 ">
            BẢN ĐỒ PTIT
          </SidebarGroupLabel>
          <SidebarGroupContent className="ml-4">
            <SidebarMenu className="overflow-hidden">
              {data.navMain.map((item, id) => {
                return (
                  <SidebarMenuButton
                    asChild
                    key={id}
                    className={`${
                      pathname === item.url
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
                            pathname === item.url
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
