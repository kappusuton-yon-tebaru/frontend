"use client"
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';

const queryClient = new QueryClient();

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
    theme={{
        token: {
            colorPrimary: "#006DF5",
            colorLink: "#245FA1",
            colorText: "#FFFFFF",
            colorTextSecondary: "#999999",
            colorBgContainer: "#081026",
            controlItemBgHover: "#245FA1",
            controlItemBgActive: "#006DF5",
          },
    }}
  >
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
    </ConfigProvider>
  );
}
