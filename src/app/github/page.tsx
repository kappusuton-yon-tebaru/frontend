"use client";

import { Button } from "antd";
import Image from "next/image";

export default function Home() {
  function handleLogin() {
    window.location.assign(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/login`
    );
  }

  return (
    <div className="bg-ci-modal-dark-blue flex flex-col justify-center rounded-xl my-24 md:mx-[240px] lg:mx-[420px] gap-4 items-center p-12">
      <Image
        src="/github-icon.svg"
        alt="github-icon"
        width={100}
        height={100}
      />
      <div className="font-bold text-4xl">Connect with GitHub</div>
      <div>Connect your account with GitHub to get started</div>
      <Button
        className="bg-ci-modal-light-blue border-ci-modal-light-blue text-white w-72 h-12 font-semibold text-lg"
        onClick={handleLogin}
      >
        Connect with GitHub
      </Button>
    </div>
  );
}
