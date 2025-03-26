"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

interface TokenContextType {
  tokenAuth: string;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokenAuth, setTokenAuth] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenAuth(token);
    }
  }, []);

  return (
    <TokenContext.Provider value={{ tokenAuth }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
