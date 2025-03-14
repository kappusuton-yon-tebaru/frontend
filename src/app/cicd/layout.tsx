"use client";
import SideBarMenu, { MenuItem } from "@/components/cicd/SideBarMenu";
import React from "react"; // Update the path accordingly
import { ConfigProvider, ThemeConfig } from "antd";
import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from "@tanstack/react-query";
import CustomBreadcrumbs from "@/components/cicd/CustomBreadcrums";
import { ToastProvider } from "@/context/ToastContext";
import NavigationBar from "@/components/NavigationBar";

const menuItems: MenuItem[] = [
  {
    name: "Images",
    href: "#",
    subMenu: [
      {
        name: "Services List",
        href: "http://localhost:3000/cicd/images/projectSpaces",
      },
      {
        name: "Registry List",
        href: "http://localhost:3000/cicd/images/registry",
      },
    ],
  },
  {
    name: "Deployment",
    href: "#",
    subMenu: [
      {
        name: "Environment",
        href: "http://localhost:3000/cicd/deployment/environment",
      },
    ],
  },
  {
    name: "Operarion",
    href: "http://localhost:3000/cicd/operation",
    subMenu: [
      {
        name: "Build and Deploy",
        href: "http://localhost:3000/cicd/operation/operate",
      },
      {
        name: "Jobs Status",
        href: "http://localhost:3000/cicd/operation/jobs",
      },
      {
        name: "Operation Setting",
        href: "http://localhost:3000/cicd/operation/settings",
      },
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
        <NavigationBar />
        <ToastProvider>
          <CustomBreadcrumbs />
          <div className="flex">
            <SideBarMenu menuItems={menuItems} />
            <div className="flex-1">
              <main className="mt-20">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
