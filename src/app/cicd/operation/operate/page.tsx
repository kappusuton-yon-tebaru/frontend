"use client";
import CustomToast from "@/components/cicd/CustomToast";
import InputField from "@/components/cicd/InputField";
import Selector, { SelectorOption } from "@/components/cicd/Selector";
import { useToast } from "@/context/ToastContext";
import { getData, postData } from "@/services/baseRequest";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export interface BuildPayload {
  project_id?: string;
  deployment_env?: string;
  services: ServiceInfo[];
}
export interface ServiceInfo {
  service_name: string;
  tag: string;
}

const operationOptions: SelectorOption[] = [
  {
    id: "build",
    label: "Build Image",
    type: "BUILD",
    data: { url: "/project/projectId/build" },
  },
  {
    id: "deploy",
    label: "Deploy",
    type: "DEPLOY",
    data: { url: "/project/projectId/deploy" },
  },
  {
    id: "both",
    label: "Build & Deploy",
    type: "BOTH",
    data: { url: "/both" },
  },
];

function OperationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { triggerToast } = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const organizationId = "678fcf897c67bca50cfae34e";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projectSpaceOptions, setProjectSpaceOptions] = useState<
    SelectorOption[]
  >([]);
  const [projectOptions, setProjectOptions] = useState<SelectorOption[]>([]);
  const [serviceOptions, setServiceOptions] = useState<SelectorOption[]>([]);
  const [deploymentEnvOptions, setDeploymentEnvOptions] = useState<
    SelectorOption[]
  >([]);

  const [selectedOperation, setSelectedOperation] = useState(
    operationOptions[0]
  );
  const [selectedProjectSpace, setSelectedProjectSpace] = useState<
    SelectorOption | undefined
  >();
  const [selectedProject, setSelectedProject] = useState<
    SelectorOption | undefined
  >();
  const [selectedServices, setSelectedServices] = useState<SelectorOption[]>(
    []
  );
  const [projectRepo, setProjectRepo] = useState<string>();
  const [devEnvName, setDevEnvName] = useState<SelectorOption | undefined>();

  const [isHealthCheck, setIsHealthCheck] = useState(false);

  const endpoints = {
    projectSpace: `${baseUrl}/resources/children/${organizationId}`,
    project: `${baseUrl}/resources/children/${selectedProjectSpace?.id}`,
    registry: `${baseUrl}/regproviders`,
    service: `${baseUrl}/project/${selectedProject?.id}/services `,
    env: `${baseUrl}/project/${selectedProject?.id}/deployenv`,
    image: `${baseUrl}/ecr/images?project_id=${selectedProject?.id}`,
  };

  const canSubmitData = () => {
    return (
      !selectedProjectSpace || !selectedProject || selectedServices.length === 0
    );
  };

  const getImageTagByServices = (service_name: string) => {
    const service = selectedServices.find(
      (service) => service.id === service_name
    );
    return service?.data.image_tags;
  };

  const handleChange = (id: string, key: string, value: any) => {
    setSelectedServices((prev) => {
      return prev.map((service) =>
        service.id === id
          ? { ...service, data: { ...service.data, [key]: value } }
          : service
      );
    });
  };

  const handleSubmit = async () => {
    try {
      let operationPayload;
      if (selectedOperation.type === "BUILD") {
        const services = selectedServices.map(
          ({ data: { service_name, dockerfile, tag_version } }) => ({
            service_name: service_name,
            tag: `${service_name}-${tag_version}`,
          })
        );
        const buildPayload: BuildPayload = {
          project_id: selectedProject?.data.id,
          services: services,
        };

        operationPayload = buildPayload;
      } else if (selectedOperation.type === "DEPLOY") {
        const services = selectedServices.map(
          ({
            data: {
              service_name,
              tag,
              port,
              secret_name,
              health_check_path,
              health_check_port,
            },
          }) => {
            const service: any = {
              service_name,
              tag,
              port: Number(port),
              secret_name,
            };

            if (isHealthCheck) {
              service.health_check = {
                path: health_check_path,
                port: Number(health_check_port),
              };
            }

            return service;
          }
        );
        const deployPayload: BuildPayload = {
          deployment_env: devEnvName?.id,
          services: services,
        };
        operationPayload = deployPayload;
      }
      console.log(operationPayload);
      const operation = await postData(
        baseUrl +
          selectedOperation.data.url.replace(
            /projectId/g,
            selectedProject?.data.id
          ),
        operationPayload
      );
      triggerToast("Create operation success!", "success");
      router.push(`/cicd/operation/jobs/${operation.parent_id}`);
    } catch (error) {
      triggerToast(`Create operation failed.\n${error}`, "error");
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
          data.data.map((item: { resource_name: string; id: string }) => ({
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
          data.data.map((item: { resource_name: string; id: string }) => ({
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
    if (!selectedProject) return;
    const fetchServices = async () => {
      try {
        const data = await getData(
          endpoints.service,
          process.env.NEXT_PUBLIC_GITHUB_TOKEN //wait for auth
        );
        setServiceOptions(
          data.data.map(
            (item: { service_name: string; dockerfile: string }) => ({
              label: item.service_name,
              id: item.service_name,
              data: {
                ...item,
                tag_version: "latest",
                tag: "",
                port: "",
                secret_name: "",
                image_tags: null,
                health_check_path: "",
                health_check_port: "",
              },
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

  useEffect(() => {
    if (!selectedProject || selectedOperation.type !== "DEPLOY") return;
    const fetchDeploymentEnv = async () => {
      try {
        const data = await getData(
          endpoints.env,
          process.env.NEXT_PUBLIC_GITHUB_TOKEN
        );
        setDeploymentEnvOptions(
          data.data.map((item: any) => ({
            label: item,
            id: item,
          }))
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchDeploymentEnv();
  }, [endpoints.env, selectedProject]);

  useEffect(() => {
    if (selectedServices.length === 0) return;

    const fetchData = async () => {
      try {
        const services = selectedServices.map(({ data: { service_name } }) => ({
          service_name: service_name,
        }));

        for (const service of services) {
          const data = await getData(
            endpoints.image + "&service_name=" + service.service_name,
            process.env.NEXT_PUBLIC_GITHUB_TOKEN //wait for auth
          );

          const tagSelectOption: SelectorOption = data.data.map(
            (item: { image_tag: string }) => ({
              label: item.image_tag,
              id: service.service_name + item.image_tag,
            })
          );
          handleChange(service.service_name, "image_tags", tagSelectOption);
        }
      } catch (error) {
        console.error("Error fetching ECR data:", error);
      }
    };

    fetchData();
  }, [selectedServices.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-4 flex justify-center items-center">
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
    <div className="min-h-dvh bg-ci-bg-dark-blue px-16 pt-8 py-40">
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-xl font-bold">Build and Deploy</h2>
          <div className="text-base text-ci-modal-grey">
            You can select the operation, project space, project, service(s)
            that you want to perform in this page
          </div>
          <hr className="border-t border-gray-300 col-span-6" />
        </div>
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
            <div key={label} className="col-span-2 flex flex-col gap-y-6 z-20">
              <label className="text-base font-semibold">{label}</label>
              <Selector
                options={options}
                initialOption={initial}
                onSelect={state}
              />
            </div>
          ))}

          <div className="col-span-4 flex flex-col gap-y-6 z-10">
            <label className="text-base font-semibold">Select Service</label>
            <Selector
              options={serviceOptions}
              initialOption={null}
              onSelect={setSelectedServices}
              isMultiSelect
            />
          </div>

          {selectedOperation.type === "DEPLOY" && (
            <div className="col-span-2 flex flex-col gap-y-6 z-10">
              <label className="text-base font-semibold">
                Deployment Environment
              </label>
              <Selector
                options={deploymentEnvOptions}
                initialOption={null}
                onSelect={setDevEnvName}
              />
            </div>
          )}

          {selectedOperation.type === "BUILD" && (
            <>
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
                        onChange={(value) =>
                          handleChange(item.id, "tag_version", value)
                        }
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {selectedOperation.type === "DEPLOY" && (
            <>
              {selectedServices.length > 0 && (
                <>
                  <hr className="border-t border-gray-300 col-span-6" />
                  <h2 className="text-xl font-bold col-span-6">
                    Service Deployment&apos;s Setting
                  </h2>
                  {selectedServices.map((item: SelectorOption, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 col-span-6 gap-x-8 gap-y-6 bg-ci-modal-timmid-blue py-4 px-6 rounded-xl z-auto"
                    >
                      <h2 className="text-lg font-bold col-span-6">
                        {item.data.service_name}
                      </h2>

                      <div className="col-span-2 flex flex-col gap-y-6">
                        <label className="text-base font-semibold">
                          Service&apos;s Image Tag
                        </label>
                        <Selector
                          options={getImageTagByServices(
                            item.data.service_name
                          )}
                          initialOption={null}
                          onSelect={(e) =>
                            handleChange(item.data.service_name, "tag", e.label)
                          }
                        />
                      </div>
                      <div className="col-span-2 col">
                        <InputField
                          label={`Port`}
                          placeholder="Deploy Port"
                          value={item.data.port}
                          onChange={(value) =>
                            handleChange(item.id, "port", value)
                          }
                          required={true}
                        />
                      </div>
                      <div className="col-span-2">
                        <InputField
                          label={`Secret Name (Optional)`}
                          placeholder="Secret Name from AWS Secret Manager"
                          value={item.data.secret_name}
                          onChange={(value) =>
                            handleChange(item.id, "secret_name", value)
                          }
                        />
                      </div>
                      <div className="col-span-6 flex flex-row gap-x-4 items-center">
                        <input
                          type="checkbox"
                          checked={isHealthCheck}
                          onChange={(e) => setIsHealthCheck(e.target.checked)}
                          className="w-5 h-5"
                        />
                        <label className="text-base font-semibold">
                          Health Check (Optional)
                        </label>
                      </div>
                      {isHealthCheck && (
                        <>
                          <div className="col-span-2">
                            <InputField
                              label={`Health Check Path`}
                              placeholder="Path for service's health check"
                              value={item.data.health_check_path}
                              onChange={(value) =>
                                handleChange(
                                  item.id,
                                  "health_check_path",
                                  value
                                )
                              }
                            />
                          </div>
                          <div className="col-span-2">
                            <InputField
                              label={`Health Check Port`}
                              placeholder="Port for service's health check"
                              value={item.data.health_check_port}
                              onChange={(value) =>
                                handleChange(
                                  item.id,
                                  "health_check_port",
                                  value
                                )
                              }
                            />
                          </div>
                        </>
                      )}
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OperationPage />
    </Suspense>
  );
}
