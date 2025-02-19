"use client";
import CustomToast from "@/components/cicd/CustomToast";
import InputField from "@/components/cicd/InputField";
import Selector, { SelectorOption } from "@/components/cicd/Selector";
import { getData, postData } from "@/services/baseRequest";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const options: SelectorOption[] = [
  { label: "ECR", icon: "🟧", id: "ECR" },
  { label: "Docker Hub", icon: "🐳", id: "DOCKER" },
];

export default function EditImageRegistryPage() {
  const { registryId } = useParams();
  const organizationId = "678fcf897c67bca50cfae34e";
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRegistry, setSelectedRegistry] = useState<SelectorOption>(
    options[0]
  );
  const [projectSpaceOptions, setProjectSpaceOptions] = useState<
    SelectorOption[]
  >([]);
  const [projectOptions, setProjectOptions] = useState<SelectorOption[]>([]);
  const [selectedProjectSpace, setSelectedProjectSpace] = useState<
    SelectorOption | undefined
  >();
  const [selectedProject, setSelectedProject] = useState<
    SelectorOption | undefined
  >();

  const [registryData, setRegistryData] = useState({
    name: "",
    registryUrl: "",
    accessKey: "",
    secretKey: "",
    awsRegion: "",
    dockerToken: "",
  });

  const endpoints = {
    projectSpace: `${baseUrl}/resources/children/${organizationId}`,
    project: `${baseUrl}/resources/children/${selectedProjectSpace?.id}`,
    updateRegUrl: `${baseUrl}/regproviders`,
    setProjectToReg: `${baseUrl}/projrepos/${selectedProject?.id}`,
  };

  const handleChange = (field: keyof typeof registryData, value: string) => {
    setRegistryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjRegSubmit = () => {
    try {
      const createPayload = {
        registry_provider_id: registryId,
      };
      //   console.log(createPayload);
      const operation = postData(endpoints.setProjectToReg, createPayload);

      toast.success("Edit registry success!");
    } catch (error) {
      toast.error(`Edit registry failed.\n${error}`);
    }
  };

  const handleSaveSubmit = () => {
    try {
      const createPayload = {
        name: registryData.name,
        providerType: selectedRegistry.id,
        uri: registryData.registryUrl,
        jsonCredential: JSON.stringify(
          selectedRegistry.id === "ECR"
            ? {
                access_key: registryData.accessKey,
                secret_access_key: registryData.secretKey,
                aws_region: registryData.awsRegion,
              }
            : selectedRegistry.id === "DOCKER"
            ? {
                token: registryData.dockerToken,
              }
            : {}
        ),
        organizationId: "678fd29c7c67bca50cfae354",
      };
      const operation = postData(endpoints.updateRegUrl, createPayload);

      toast.success("Edit registry success!");
    } catch (error) {
      toast.error(`Edit registry failed.\n${error}`);
    }
  };

  useEffect(() => {
    const fetchProjectSpaces = async () => {
      try {
        const data = await getData(endpoints.projectSpace);
        setProjectSpaceOptions(
          data.map((item: { resource_name: string; id: string }) => ({
            label: item.resource_name,
            id: item.id,
            data: item,
          }))
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchProjectSpaces();
    setLoading(false);
  }, [endpoints.projectSpace]);

  useEffect(() => {
    if (!selectedProjectSpace) return;

    const fetchProjects = async () => {
      try {
        const data = await getData(endpoints.project);
        setProjectOptions(
          data.map((item: { resource_name: string; id: string }) => ({
            label: item.resource_name,
            id: item.id,
            data: item,
          }))
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchProjects();
  }, [endpoints.project, selectedProjectSpace]);

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <CustomToast />
      <div className="col-span-2"></div>
      <div className="flex flex-col gap-y-16">
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <h2 className="text-xl font-bold col-span-6">
            Project Registry Setting
          </h2>
          {[
            {
              label: "Select Project Space",
              options: projectSpaceOptions,
              state: setSelectedProjectSpace,
              initial: null,
            },
            {
              label: "Select Project",
              options: projectOptions,
              state: setSelectedProject,
              initial: null,
            },
          ].map(({ label, options, state, initial }) => (
            <div key={label} className="col-span-3 flex flex-col gap-y-6">
              <label className="text-base font-semibold">{label}</label>
              <Selector
                options={options}
                initialOption={initial}
                onSelect={state}
              />
            </div>
          ))}
          <div className="col-start-6">
            <button
              className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full"
              onClick={handleProjRegSubmit}
            >
              Save
            </button>
          </div>
          <hr className="border-t border-gray-300 col-span-6" />
        </div>

        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <h2 className="text-xl font-bold col-span-6">
            Edit Registry Provider
          </h2>
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
              label="Container Registry URI"
              placeholder="Image Registry Link"
              value={registryData.registryUrl}
              onChange={(value) => handleChange("registryUrl", value)}
            />
          </div>

          {/* ECR Fields */}
          {selectedRegistry.label === "ECR" && (
            <>
              <div className="col-span-2">
                <InputField
                  label="Access Key"
                  placeholder="Access Key"
                  value={registryData.accessKey}
                  onChange={(value) => handleChange("accessKey", value)}
                />
              </div>
              <div className="col-span-2">
                <InputField
                  label="Secret Access Key"
                  placeholder="Secret Access Key"
                  value={registryData.secretKey}
                  onChange={(value) => handleChange("secretKey", value)}
                />
              </div>
              <div className="col-span-2">
                <InputField
                  label="AWS Region"
                  placeholder="AWS Region"
                  value={registryData.secretKey}
                  onChange={(value) => handleChange("awsRegion", value)}
                />
              </div>
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

          <div className="col-start-6">
            <button
              className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full"
              onClick={handleSaveSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
