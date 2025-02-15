"use client";
import CustomToast from "@/components/cicd/CustomToast";
import InputField from "@/components/cicd/InputField";
import Selector, { SelectorOption } from "@/components/cicd/Selector";
import { getData, postData } from "@/services/baseRequest";
import build from "next/dist/build";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

export interface BuildPayload {
  repo_url: string;
  registry_url: string;
  services: ServiceInfo[];
}
export interface ServiceInfo {
  service_name: string;
  service_root: string;
  tag: string;
}

const operationOptions: SelectorOption[] = [
  { id: "build", label: "Build Image", type: "BUILD", data: { url: "/build" } },
  { id: "deploy", label: "Deploy", type: "DEPLOY", data: { url: "/deploy" } },
  {
    id: "both",
    label: "Build & Deploy",
    type: "BOTH",
    data: { url: "/both" },
  },
];

export default function OperationPage() {
  const searchParams = useSearchParams();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const organizationId = "678fcf897c67bca50cfae34e";

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
  const [projectRepo, setProjectRepo] = useState<String>();

  const endpoints = {
    projectSpace: `${baseUrl}/resources/children/${organizationId}`,
    project: `${baseUrl}/resources/children/${selectedProjectSpace?.id}`,
    registry: `${baseUrl}/regproviders`,
    service: `${baseUrl}/project/${selectedProject?.id}/services `,
  };

  const canSubmitData = () => {
    return (
      !selectedProjectSpace ||
      !selectedProject ||
      !selectedRegistry ||
      selectedServices.length === 0
    );
  };

  const handleChange = (id: string, value: string) => {
    setSelectedServices((prev) => {
      return prev.map((service) =>
        service.id === id
          ? { ...service, data: { ...service.data, tag_version: value } }
          : service
      );
    });
  };

  const handleSubmit = () => {
    try {
      const services = selectedServices.map(
        ({ data: { service_name, dockerfile, tag_version } }) => ({
          service_name: service_name,
          service_root: dockerfile.replace("/Dockerfile", ""),
          tag: `${service_name}-${tag_version}`,
        })
      );
      console.log(services);

      const buildPayload: BuildPayload = {
        repo_url: `git://github.com/${projectRepo}`,
        registry_url: "public.ecr.aws/r2n4f6g5/testproject",
        services: services,
      };

      console.log(buildPayload);
      toast.success("Create operation success!");
      // const operation = postData(
      //   baseUrl + selectedOperation.data.url,
      //   buildPayload
      // );
      // console.log(operation);
    } catch (error) {
      toast.error(`Create operation failed.\n${error}`);
    }
  };

  useEffect(() => {
    const type = searchParams.get("ops");
    const matchedOperation = operationOptions.find(
      (option) => option.type === type
    );
    if (matchedOperation) setSelectedOperation(matchedOperation);
  }, [searchParams]);

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

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const data = await getData(endpoints.registry);
        setRegistryOptions(
          data.map((item: { name: string; id: string }) => ({
            label: item.name,
            id: item.id,
            data: item,
          }))
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchRegistries();
  }, [endpoints.registry]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchServices = async () => {
      try {
        const data = await getData(endpoints.service);
        setServiceOptions(
          data.services.map(
            (item: { service_name: string; dockerfile: string }) => ({
              label: item.service_name,
              id: item.service_name,
              data: { ...item, tag_version: "latest" },
            })
          )
        );
        setProjectRepo(data.repo_url);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchServices();
  }, [endpoints.service, selectedProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20 flex justify-center items-center">
        <CustomToast />
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
              initial: null,
            },
            {
              label: "Select Project",
              options: projectOptions,
              state: setSelectedProject,
              initial: null,
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
                  initialOption={null}
                  onSelect={setSelectedRegistry}
                />
              </div>

              {selectedServices.length > 0 && (
                <>
                  <hr className="border-t border-gray-300 col-span-6" />
                  <h2 className="text-xl font-bold col-span-6">
                    Image Tag Setting
                  </h2>
                  {selectedServices.map((item: SelectorOption, index) => (
                    <div key={index} className="col-span-2 col-start-1">
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
              className={`bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full ${
                canSubmitData() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={canSubmitData()}
              onClick={() => handleSubmit()}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
