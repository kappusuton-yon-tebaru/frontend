"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  return <div className="flex justify-center items-center">Redirecting...</div>;
}
