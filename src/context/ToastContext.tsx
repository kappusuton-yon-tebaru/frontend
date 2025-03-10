"use client";
import CustomToast from "@/components/cicd/CustomToast";
import { createContext, useContext, useState, ReactNode } from "react";
import { Toaster, toast } from "react-hot-toast";

interface ToastContextProps {
  triggerToast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const triggerToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    if (type === "success") {
      return toast.success(message);
    } else {
      return toast.error(message);
    }
  };

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      <CustomToast />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
