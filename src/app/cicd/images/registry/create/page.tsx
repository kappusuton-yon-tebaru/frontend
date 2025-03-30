"use client";
import InputField from "@/components/cicd/InputField";
import Selector, { SelectorOption } from "@/components/cicd/Selector";
import { useToast } from "@/context/ToastContext";
import { postData } from "@/services/baseRequest";
import { useRouter } from "next/navigation";
import { useState } from "react";

const options: SelectorOption[] = [
  { label: "ECR", icon: "🟧", id: "ECR" },
  { label: "Docker Hub", icon: "🐳", id: "DOCKER" },
];

export default function AddImageRegistryPage() {
  const createUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/regproviders`;

  const router = useRouter();

  const { triggerToast } = useToast();

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
    dockerUsername: "",
    dockerPassword: "",
  });

  const handleChange = (field: keyof typeof registryData, value: string) => {
    setRegistryData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    if (!registryData.name) return false;
    if (!registryData.registryUrl) return false;

    if (selectedRegistry.id === "ECR") {
      if (
        !registryData.accessKey ||
        !registryData.secretKey ||
        !registryData.awsRegion
      )
        return false;
    }

    if (selectedRegistry.id === "DOCKER") {
      if (!registryData.dockerUsername || !registryData.dockerPassword)
        return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      const basePayload: any = {
        name: registryData.name,
        provider_type: selectedRegistry.id,
        uri: registryData.registryUrl,
        credential: {},
        organization_id: "678fd29c7c67bca50cfae354",
      };

      if (selectedRegistry.id === "ECR") {
        basePayload.credential.ecr_credential = {
          access_key: registryData.accessKey,
          secret_access_key: registryData.secretKey,
          aws_region: registryData.awsRegion,
        };
      }

      if (selectedRegistry.id === "DOCKER") {
        basePayload.credential.dockerhub_credential = {
          username: registryData.dockerUsername,
          personal_access_token: registryData.dockerPassword,
        };
      }

      const operation = await postData(createUrl, basePayload);
      triggerToast("Add registry success!", "success");
      router.push("/cicd/images/registry");
    } catch (error) {
      triggerToast(`Add registry failed.\n${error}`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <div className="flex flex-col gap-y-16">
        <h2 className="text-xl font-bold">Add New Registry Provider</h2>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <div className="col-span-6">
            <InputField
              label="Registry Name"
              placeholder="Name"
              value={registryData.name}
              onChange={(value) => handleChange("name", value)}
              required={true}
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
              required={true}
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
                  required={true}
                />
              </div>
              <div className="col-span-3">
                <InputField
                  label="Secret Access Key"
                  placeholder="Secret Access Key"
                  value={registryData.secretKey}
                  onChange={(value) => handleChange("secretKey", value)}
                  required={true}
                />
              </div>
              <div className="col-span-3">
                <InputField
                  label="AWS Region"
                  placeholder="AWS Region"
                  value={registryData.awsRegion}
                  onChange={(value) => handleChange("awsRegion", value)}
                  required={true}
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
                  label="Username"
                  placeholder="Docker Hub Username"
                  value={registryData.dockerUsername}
                  onChange={(value) => handleChange("dockerUsername", value)}
                  required={true}
                />
              </div>
              <div className="col-span-3">
                <InputField
                  label="Password"
                  placeholder="Docker Hub Password"
                  value={registryData.dockerPassword}
                  onChange={(value) => handleChange("dockerPassword", value)}
                  required={true}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="col-start-6">
            <button
              className={`bg-ci-modal-black border border-ci-modal-grey py-2 rounded-lg text-base w-full ${
                !isFormValid()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-ci-modal-blue"
              }`}
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              Add Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
