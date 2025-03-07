"use client";
import CustomToast from "@/components/cicd/CustomToast";
import InputField from "@/components/cicd/InputField";
import Selector, { SelectorOption } from "@/components/cicd/Selector";
import { postData } from "@/services/baseRequest";
import { useState } from "react";
import toast from "react-hot-toast";

const options: SelectorOption[] = [
  { label: "ECR", icon: "🟧", id: "ECR" },
  { label: "Docker Hub", icon: "🐳", id: "DOCKER" },
];

export default function AddImageRegistryPage() {
  const createUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/regproviders`;

  const [selectedRegistry, setSelectedRegistry] = useState<SelectorOption>(
    options[0]
  );
  const [registryData, setRegistryData] = useState({
    name: "",
    registryUrl: "",
    accessKey: "",
    secretKey: "",
    awsRegion: "",
    dockerToken: "",
  });

  const handleChange = (field: keyof typeof registryData, value: string) => {
    setRegistryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    try {
      const createPayload = {
        name: registryData.name,
        provider_type: selectedRegistry.id,
        uri: registryData.registryUrl,
        json_credential: JSON.stringify(
          selectedRegistry.id === "ECR"
            ? {

                access_key: registryData.accessKey,
                secret_access_key: registryData.secretKey,
                aws_region: registryData.awsRegion
              }
            : selectedRegistry.id === "DOCKER"
            ? {
                token: registryData.dockerToken,
              }
            : {}
        ),
        organization_id: "678fd29c7c67bca50cfae354",
      };
      const operation = postData(createUrl, createPayload);
      toast.success("Add registry success!");
    } catch (error) {
      toast.error(`Add registry failed.\n${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <CustomToast />
      <div className="flex flex-col gap-y-16">
        <h2 className="text-xl font-bold">Add New Registry Provider</h2>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <div className="col-span-6">
            <InputField
              label="Registry Name"
              placeholder="Name"
              value={registryData.name}
              onChange={(value) => handleChange("name", value)}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-y-6">
            <label className="text-base font-semibold">
              Container Registry
            </label>
            <Selector
              options={options}
              onSelect={setSelectedRegistry}
              initialOption={options[0]}
            />
          </div>

          {/* Registry URL */}
          <div className="col-span-4">
            <InputField
              label="Container Registry URL"
              placeholder="Image Registry Link"
              value={registryData.registryUrl}
              onChange={(value) => handleChange("registryUrl", value)}
            />
          </div>

          {/* ECR Fields */}
          {selectedRegistry.label === "ECR" && (
            <>
              <div className="col-span-3">
                <InputField
                  label="Access Key"
                  placeholder="Access Key"
                  value={registryData.accessKey}
                  onChange={(value) => handleChange("accessKey", value)}
                />
              </div>
              <div className="col-span-3">
                <InputField
                  label="Secret Access Key"
                  placeholder="Secret Access Key"
                  value={registryData.secretKey}
                  onChange={(value) => handleChange("secretKey", value)}
                />
              </div>
              <div className="col-span-3">
                <InputField
                  label="AWS Region"
                  placeholder="AWS Region"
                  value={registryData.awsRegion}
                  onChange={(value) => handleChange("awsRegion", value)}
                />
              </div>
              <div className="col-span-3"></div>
            </>
          )}

          {/* Docker Hub Fields */}
          {selectedRegistry.label === "Docker Hub" && (
            <>
              <div className="col-span-3">
                <InputField
                  label="Token"
                  placeholder="Docker Hub Token"
                  value={registryData.dockerToken}
                  onChange={(value) => handleChange("dockerToken", value)}
                />
              </div>
              <div className="col-span-3"></div>
            </>
          )}

          {/* Submit Button */}
          <div className="col-start-6">
            <button
              className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full"
              onClick={handleSubmit}
            >
              Add Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
