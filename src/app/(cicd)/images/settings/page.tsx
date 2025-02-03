"use client";
import InputField from "@/components/cicd/InputField";
import RegistrySelector from "@/components/cicd/RegistrySelection";
import { useState } from "react";

export default function AddImageRegistryPage() {
  const [worker, setWorker] = useState(1);

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <div className="flex flex-col gap-y-16">
        <h2 className="text-xl font-bold">Image Builder Setting</h2>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <div className="col-span-3">
            <InputField label="Max Worker" placeholder="Max Worker" />
          </div>
          <div className="col-span-3"></div>
          <div className="col-start-6 ">
            <button className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
