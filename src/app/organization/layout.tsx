"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import NavigationBar from "@/components/NavigationBar";

const queryClient = new QueryClient();

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-36 p-8">
      <ConfigProvider
        theme={{
          token: {
            colorText: "#FFFFFF",
            colorBgContainer: "#081026",
            colorBorder: "#999999",
            colorBgTextHover: "#006DF5",
            colorBgTextActive: "#999999",
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <NavigationBar/>
          {children}
        </QueryClientProvider>
      </ConfigProvider>
    </div>
  );
}
