"use client";
import InputField from "@/components/cicd/InputField";
import Selector, { SelectorOption } from "@/components/cicd/Selector";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export interface ServiceInfo {
  id: string;
  docker_file: string;
  tag: string;
}

const operationOptions: SelectorOption[] = [
  { id: "build", label: "Build Image", type: "BUILD" },
  { id: "deploy", label: "Deploy", type: "DEPLOY" },
  { id: "both", label: "Build & Deploy", type: "BOTH" },
];

export default function OperationPage() {
  const searchParams = useSearchParams();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const endpoints = {
    projectSpace: `${baseUrl}/users`,
    project: `${baseUrl}/resources`,
    registry: `${baseUrl}/regproviders`,
    service: `${baseUrl}/users`,
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projectSpaceOptions, setProjectSpaceOptions] = useState<
    SelectorOption[]
  >([]);
  const [projectOptions, setProjectOptions] = useState<SelectorOption[]>([]);
  const [registryOptions, setRegistryOptions] = useState<SelectorOption[]>([]);
  const [serviceOptions, setServiceOptions] = useState<SelectorOption[]>([]);

  const [selectedOperation, setSelectedOperation] = useState(
    operationOptions[0]
  );
  const [selectedProjectSpace, setSelectedProjectSpace] = useState<
    SelectorOption | undefined
  >();
  const [selectedProject, setSelectedProject] = useState<
    SelectorOption | undefined
  >();
  const [selectedRegistry, setSelectedRegistry] = useState<
    SelectorOption | undefined
  >();
  const [selectedServices, setSelectedServices] = useState<SelectorOption[]>(
    []
  );

  const handleChange = (id: string, value: string) => {
    setSelectedServices((prev) => {
      return prev.map((service) =>
        service.id === id
          ? { ...service, data: { ...service.data, tag_version: value } }
          : service
      );
    });
  };

  useEffect(() => {
    const type = searchParams.get("ops");
    const matchedOperation = operationOptions.find(
      (option) => option.type === type
    );
    if (matchedOperation) setSelectedOperation(matchedOperation);
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const responses = await Promise.all(
          Object.values(endpoints).map((url) => fetch(url))
        );
        if (responses.some((res) => !res.ok))
          throw new Error("Failed to fetch data");

        const [projectSpaceData, projectData, registryData, serviceData] =
          await Promise.all(responses.map((res) => res.json()));

        setProjectSpaceOptions(
          projectSpaceData.map((item: { name: string; id: string }) => ({
            label: item.name,
            id: item.id,
            data: item,
          }))
        );
        setProjectOptions(
          projectData.map((item: { resource_name: string; id: string }) => ({
            label: item.resource_name,
            id: item.id,
            data: item,
          }))
        );
        setRegistryOptions(
          registryData.map((item: { name: string; id: string }) => ({
            label: item.name,
            id: item.id,
            data: item,
          }))
        );
        setServiceOptions(
          serviceData.map((item: { name: string; id: string }) => ({
            label: item.name,
            id: item.id,
            data: { ...item, tag_version: "latest" },
          }))
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20 flex justify-center items-center">
        <ClipLoader
          size={100}
          color={"#245FA1"}
          cssOverride={{
            borderWidth: "10px",
          }}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <div className="flex flex-col gap-y-16">
        <h2 className="text-xl font-bold">Build and Deploy</h2>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          {[
            {
              label: "Operation",
              options: operationOptions,
              state: setSelectedOperation,
              initial: selectedOperation,
            },
            {
              label: "Select Project Space",
              options: projectSpaceOptions,
              state: setSelectedProjectSpace,
              initial: projectSpaceOptions[0],
            },
            {
              label: "Select Project",
              options: projectOptions,
              state: setSelectedProject,
              initial: projectOptions[0],
            },
          ].map(({ label, options, state, initial }) => (
            <div key={label} className="col-span-2 flex flex-col gap-y-6">
              <label className="text-base font-semibold">{label}</label>
              <Selector
                options={options}
                initialOption={initial}
                onSelect={state}
              />
            </div>
          ))}

          <div className="col-span-6 flex flex-col gap-y-6">
            <label className="text-base font-semibold">Select Service</label>
            <Selector
              options={serviceOptions}
              initialOption={null}
              onSelect={setSelectedServices}
              isMultiSelect
            />
          </div>

          {selectedOperation.type === "BUILD" && (
            <>
              <div className="col-span-2 flex flex-col gap-y-6">
                <label className="text-base font-semibold">
                  Select Registry
                </label>
                <Selector
                  options={registryOptions}
                  initialOption={registryOptions[0]}
                  onSelect={setSelectedRegistry}
                />
              </div>

              {selectedServices.length > 0 && (
                <>
                  <hr className="border-t border-gray-300 col-span-6" />
                  <h2 className="text-xl font-bold col-span-6">
                    Image Tag Setting
                  </h2>
                  {selectedServices.map((item: SelectorOption) => (
                    <div key={item.id} className="col-span-2">
                      <InputField
                        label={item.label}
                        placeholder="Image version"
                        value={item.data.tag_version}
                        onChange={(value) => handleChange(item.id, value)}
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          )}
          <div className="col-span-4"></div>
          <div className="col-start-6">
            <button
              className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full"
              onClick={() => console.log(selectedServices)}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
