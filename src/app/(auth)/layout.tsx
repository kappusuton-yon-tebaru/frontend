"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient();

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
    </div>
  );
}
