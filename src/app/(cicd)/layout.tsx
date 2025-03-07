"use client";
import SideBarMenu, { MenuItem } from "@/components/cicd/SideBarMenu";
import React from "react"; // Update the path accordingly
import { ConfigProvider, ThemeConfig } from "antd";
import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from "@tanstack/react-query";

const menuItems: MenuItem[] = [
  {
    name: "Images",
    href: "#",
    subMenu: [
      {
        name: "Services List",
        href: "http://localhost:3000/images/projectSpaces",
      },
      { name: "Registry List", href: "http://localhost:3000/images/registry" },
      { name: "Images Setting", href: "http://localhost:3000/images/settings" },
    ],
  },
  {
    name: "Deployment",
    href: "#",
    subMenu: [
      { name: "Deployment List", href: "" },
      { name: "Deployment Setting", href: "" },
    ],
  },
  {
    name: "Operarion",
    href: "http://localhost:3000/operation",
    subMenu: [
      {
        name: "Build and Deploy",
        href: "http://localhost:3000/operation/operate",
      },
      { name: "Jobs Status", href: "http://localhost:3000/operation/jobs" },
    ],
  },
];

const theme: ThemeConfig = {
  token: {
    colorText: "#FFFFFF",
    colorBgContainer: "#081026",
    colorBorder: "#999999",
    colorBgTextHover: "#006DF5",
    colorBgTextActive: "#999999",
  },
  components: {
    Input: {
      colorTextPlaceholder: "#999999",
      borderRadius: 8,
      colorBgContainer: "#161F3A",
    },
  },
};

const config: QueryClientConfig = {};

const queryClient = new QueryClient(config);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <div className="flex">
          <SideBarMenu menuItems={menuItems} />
          <div className="flex-1">
            <main>{children}</main>
          </div>
        </div>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
