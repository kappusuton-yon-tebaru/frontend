"use client";
import RegistrySelector from "@/components/cicd/RegistrySelection";
import { useState } from "react";

const InputField = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => (
  <div className="flex flex-col gap-y-6">
    <label className="text-base font-semi-bold">{label}</label>
    <input
      className="px-4 py-2 bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base placeholder:text-sm"
      type="text"
      placeholder={placeholder}
    />
  </div>
);

export default function AddImageRegistryPage() {
  const [selectedRegistry, setSelectedRegistry] = useState("ECR");

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <div className="flex flex-col gap-y-16">
        <h2 className="text-xl font-bold">Add New Registry Provider</h2>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <div className="col-span-2 flex flex-col gap-y-6">
            <label className="text-base font-semi-bold">
              Container Registry
            </label>
            <RegistrySelector onSelect={setSelectedRegistry} />
          </div>
          <div className="col-span-4">
            <InputField
              label="Container Registry URL"
              placeholder="Image Registry Link"
            />
          </div>
          {selectedRegistry === "ECR" && (
            <>
              <div className="col-span-3">
                <InputField label="Access Key" placeholder="Access Key" />
              </div>
              <div className="col-span-3">
                <InputField
                  label="Secret Access Key"
                  placeholder="Secret Access Key"
                />
              </div>
            </>
          )}

          {selectedRegistry === "Docker Hub" && (
            <>
              <div className="col-span-3">
                <InputField label="Token" placeholder="Docker Hub Token" />
              </div>
              <div className="col-span-3"></div>
            </>
          )}
          <div className="col-start-6 ">
            <button className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full">
              Add Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
