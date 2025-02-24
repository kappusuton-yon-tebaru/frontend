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
            colorText: "#FFFFFF",
            colorBgContainer: "#081026",
            colorBorder: "#999999",
            colorBgTextHover: "#006DF5",
            colorBgTextActive: "#999999",
          },
    }}
  >
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
    </ConfigProvider>
  );
}
